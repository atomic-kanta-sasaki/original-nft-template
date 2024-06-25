"use client"
import { Button } from '@mui/material';
import { useState } from "react";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from "axios";

// styled conmponent
const VisuallyHiddenInput = styled('input')({
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const NftMintPageContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width:'80%',
  margin: '0 auto',
  maxWidth: '500px',
});

export default function Home() {
  // nft name
  const [text, setText] = useState('');
  const handleNameChange = (e:any) => {
    setText(e.target.value);
  }

  // nft image
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // api request
  const handleOnClick = async () => {
    const formData = new FormData();
    if(image) {
      formData.append('image', image);
    }
    formData.append('name', text);
    try {
      const res = await axios.post('/api/nft', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  }

  return <>
    <main>
      <NftMintPageContainer>
        <Box
          sx={{
            width: 500,
            maxWidth: '100%',
          }}
        >
          <TextField fullWidth label="NFTの名前" id="name" onChange={handleNameChange}/>
        </Box>
        {preview && <img src={preview as string} alt="preview" style={{ width: '100px' }}/>}
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload file
          <VisuallyHiddenInput type="file" onChange={handleImageChange}/>
        </Button>
        <Button variant="contained" onClick={handleOnClick}>Mint</Button>
      </NftMintPageContainer>
    </main>
  </>;
}
