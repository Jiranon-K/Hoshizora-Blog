'use client';

import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        success: {
          style: {
            background: '#10B981',
            color: 'white',
          },
          duration: 3000,
        },
        error: {
          style: {
            background: '#EF4444',
            color: 'white',
          },
          duration: 4000,
        },
        loading: {
          style: {
            background: '#3B82F6',
            color: 'white',
          },
        },
      }}
    />
  );
};

export default ToastProvider;