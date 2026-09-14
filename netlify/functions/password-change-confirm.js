import { connectLambda } from '@netlify/blobs';
import { checkAuth, confirmPasswordChange } from './_auth.js';

function json(body, status = 200) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export const handler = async (event) => {
  connectLambda(event);

  if (event.httpMethod !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const auth = await checkAuth(event);
  if (!auth.ok) return json({ error: auth.error }, auth.status);

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { code } = payload;
  if (!code) return json({ error: 'Missing code' }, 400);

  const result = await confirmPasswordChange(code);
  if (!result.ok) return json({ error: result.error }, 400);
  return json({ ok: true });
};
