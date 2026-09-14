import { connectLambda } from '@netlify/blobs';
import { checkAuth } from './_auth.js';

function json(body, status = 200) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export const handler = async (event) => {
  connectLambda(event);

  const auth = await checkAuth(event);
  if (!auth.ok) return json({ error: auth.error }, auth.status);
  return json({ ok: true });
};
