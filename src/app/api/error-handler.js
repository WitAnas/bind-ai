// app/api/error-handler.js
import rollbar from '../../../utils/rollbar';

export async function POST(req) {
  const { message, stack } = await req.json();

  rollbar.error(message, {
    stack,
    environment: process.env.NODE_ENV,
  });

  return new Response('Error logged', { status: 200 });
}
