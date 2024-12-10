import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ThemeProvider from './lib/theme';
import { AuthProvider } from './lib/auth';
import AppRoutes from './routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Create router with supported future flags
const router = createBrowserRouter([
  {
    path: '*',
    element: <AppRoutes />
  }
], {
  future: {
    // Only include officially supported flags
    v7_normalizeFormMethod: true,
    v7_prependBasename: true
  }
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}