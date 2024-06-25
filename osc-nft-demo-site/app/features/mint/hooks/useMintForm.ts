import { useState } from "react";
import { useMintApi } from "./useMintApi";
import { useSnackbar } from "../../../hooks/useSnackbar";

export type MintFormState = {
  name: string;
  preview: string | ArrayBuffer | null;
  image: File | null;
}

export type MintFormActions = {
  handleNameChange: (e: any) => void;
  handleImageChange: (e: any) => void;
  handleOnClick: () => void;
}

export const useMintForm = ():[MintFormState, MintFormActions] => {
  const { mint } = useMintApi();
  const [{},{ handleSnackbar }] = useSnackbar();
  const [name, setName] = useState('');
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
  const [image, setImage] = useState<File | null>(null);

  const handleNameChange = (e:any) => {
    setName(e.target.value);
  }

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

  const handleOnClick = async () => {
    if (!image) {
      return;
    }
    await mint({name, image});
    handleSnackbar('Minting Success!!');
  }

  return[
    {
      name,
      preview,
      image
    },
    {
      handleNameChange,
      handleImageChange,
      handleOnClick
    }
  ]
};