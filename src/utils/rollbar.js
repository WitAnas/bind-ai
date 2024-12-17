import Rollbar from 'rollbar';

let rollbar;

if (typeof window !== 'undefined') {
  // Client-side Rollbar configuration
  rollbar = new Rollbar({
    accessToken: process.env.NEXT_PUBLIC_ROLLBAR_CLIENT_TOKEN, // Client token
    captureUncaught: true,
    captureUnhandledRejections: true,
    environment: process.env.NODE_ENV,
  });
} else {
  // Server-side Rollbar configuration
  rollbar = new Rollbar({
    accessToken: process.env.NEXT_PUBLIC_ROLLBAR_SERVER_TOKEN, // Server token
    captureUncaught: true,
    captureUnhandledRejections: true,
    environment: process.env.NODE_ENV,
  });
}

export default rollbar;

