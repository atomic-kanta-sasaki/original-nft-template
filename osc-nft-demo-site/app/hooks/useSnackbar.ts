import { useState } from "react"

type SnackbarState = {
	isOpen: boolean;
	message: string;
}

type SnackbarActions = {
	handleClose: () => void;
	handleSnackbar: (message: string) => void;
}

export const useSnackbar = (): [SnackbarState, SnackbarActions] => {
	const [ isOpen, setOpen ] = useState(false);
	const [ message, setMessage ] = useState('');
	const handleClose = () => {
    setOpen(false);
  };
	const handleSnackbar = (message: string) => {
		setMessage(message);
		setOpen(true);
	};

	return [
		{
			isOpen,
			message
		},
		{
			handleClose,
			handleSnackbar
		}
	]
}