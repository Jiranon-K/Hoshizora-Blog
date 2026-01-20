'use client';

import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: '#09090b', 
          color: '#ffffff',
          border: '1px solid #27272a', 
          borderRadius: '0',
          fontWeight: '300', 
          fontSize: '14px',
          padding: '12px 16px',
        },
        success: {
          style: {
            background: '#09090b',
            color: '#ffffff',
            borderLeft: '2px solid #ffffff',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#09090b',
          },
          duration: 3000,
        },
        error: {
          style: {
            background: '#09090b',
            color: '#ffffff',
            borderLeft: '2px solid #ef4444', 
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#09090b',
          },
          duration: 4000,
        },
        loading: {
          style: {
            background: '#09090b',
            color: '#71717a', 
            borderLeft: '2px solid #71717a',
          },
          iconTheme: {
            primary: '#71717a',
            secondary: '#09090b',
          },
        },
      }}
    />
  );
};

export default ToastProvider;