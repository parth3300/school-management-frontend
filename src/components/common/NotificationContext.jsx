import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

const NotificationContext = createContext();

export const useNotifier = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState({
    message: '',
    severity: 'info'
  });

  const showNotification = (message, severity = 'info') => {
    setMessageInfo({ message, severity });
    setOpen(true);
  };

  const handleClose = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifySuccess: (msg) => showNotification(msg, 'success'),
        notifyError: (msg) => showNotification(msg, 'error'),
        notifyInfo: (msg) => showNotification(msg, 'info'),
        notifyWarn: (msg) => showNotification(msg, 'warning')
      }}
    >
      {children}

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity={messageInfo.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {messageInfo.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};
