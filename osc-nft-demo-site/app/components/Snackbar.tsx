import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import React from 'react';
import { useSnackbar } from '../hooks/useSnackbar';

export const SuccessSnackbar: React.FC = () => {
  const [{ isOpen, message }, { handleClose }] = useSnackbar();
  return (
    <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
    <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
      {message}
    </Alert>
  </Snackbar>
  );
}