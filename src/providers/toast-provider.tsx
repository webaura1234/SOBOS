'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '8px',
          border: '1px solid var(--border)',
        },
      }}
    />
  );
}
