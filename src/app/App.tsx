import { RouterProvider } from 'react-router';
import { Toaster } from 'sonner';
import { router } from './routes';
import { PortalProvider } from './context/PortalContext';

export default function App() {
  return (
    <PortalProvider>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          style: {
            borderRadius: '10px',
            fontSize: '13.5px',
          },
        }}
      />
    </PortalProvider>
  );
}