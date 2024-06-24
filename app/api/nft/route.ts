import { NextRequest, NextResponse } from 'next/server';
import { BlobServiceClient, BlockBlobUploadOptions, StorageSharedKeyCredential, ContainerClient } from '@azure/storage-blob';
import PinataClient, { PinataPinOptions } from "@pinata/sdk";
import { v4 as uuidv4 } from 'uuid';
import { Network } from 'alchemy-sdk';
import { ethers } from "ethers";
import { erc721Abi } from '../abi/erc721';

type requestBody ={
  name: string;
  image: Blob;
}
export async function GET(): Promise<NextResponse> {
 try {
   return NextResponse.json({
    name: 'Mike',
  });
  } catch (error) {
    throw error
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const formData = await req.formData();
  const imageFile = formData.get('image') as File;

  // ファイル名の取得
  const exif = imageFile.name.split('.').pop();
  const fileName = `${uuidv4()}.${exif}`;

  // Enter your storage account name and shared key
  const account = process.env.AZURE_STORAGE_ACCOUNT_NAME!;
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY!;

  const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
  const blobServiceClient = new BlobServiceClient(
    `https://${account}.blob.core.windows.net`,
    sharedKeyCredential
  );

  // コンテナの作成
  const containerName = process.env.AZURE_STORAGE_CONTAONER_NAME!;
  const containerClient: ContainerClient = blobServiceClient.getContainerClient(containerName);
  // blobの作成
  const blobName = fileName;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // ファイルの取得とアップロード
  
  const arrayBuffer = await imageFile.arrayBuffer();
  const options: BlockBlobUploadOptions = {
    blobHTTPHeaders: {
      blobContentType: 'image/jpeg',
    },
  };
  const uploadBlobResponse = await blockBlobClient.upload(arrayBuffer, arrayBuffer.byteLength, options);

  console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);

  // pinataにmetadataをupload
  // pinataClientの初期化
  const pinata = new PinataClient({
    pinataApiKey: process.env.PINATA_API_KEY!,
    pinataSecretApiKey: process.env.PINATA_API_SECRET!,
  });
  const metadata = {
    name: formData.get('name'),
    image: blockBlobClient.url,
  };
  const pinataOptions: PinataPinOptions = {
    pinataMetadata: {
        name: uuidv4(),
    },
};

  const res = await pinata.pinJSONToIPFS(metadata, pinataOptions);

  // web3でNFTをmint
  const provider = new ethers.AlchemyProvider(process.env.ETH_NETWORK, process.env.ALCHEMY_API_KEY!);
  const wallet = new ethers.Wallet(process.env.METAMASK_PRIVATE_KEY!, provider);
  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS!, erc721Abi, wallet);
  const tx = await contract.safeMint(process.env.METAMASK_EOA_ADDRESS!, res.IpfsHash);
  await tx.wait();

  return NextResponse.json({
    status: 'ok',
    lobUrl: blockBlobClient.url,
  })
}