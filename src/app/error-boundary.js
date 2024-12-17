// app/error-boundary.js
'use client'; // because we're using it on the client side
import { useEffect } from 'react';
import rollbar from '@/utils/rollbar';

function ErrorBoundary({ children }) {
  useEffect(() => {
    const handleClientError = (event) => {
      rollbar.error(event.error || event.reason);
    };

    window.addEventListener('error', handleClientError);
    window.addEventListener('unhandledrejection', handleClientError);

    return () => {
      window.removeEventListener('error', handleClientError);
      window.removeEventListener('unhandledrejection', handleClientError);
    };
  }, []);

  return children;
}

export default ErrorBoundary;
