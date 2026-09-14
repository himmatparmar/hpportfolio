import { connectLambda, getStore } from '@netlify/blobs';
import { checkAuth } from './_auth.js';

const MAX_BYTES = 4 * 1024 * 1024; // stay safely under Netlify Functions' payload limit

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

  const { filename, contentType, dataBase64 } = payload;
  if (!filename || !contentType || !dataBase64) {
    return json({ error: 'Missing filename, contentType, or dataBase64' }, 400);
  }

  const buffer = Buffer.from(dataBase64, 'base64');
  if (buffer.byteLength > MAX_BYTES) {
    return json({ error: 'Image too large (max 4MB)' }, 413);
  }

  const ext = (filename.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const store = getStore('cms-images');
  await store.set(key, buffer, { metadata: { contentType } });

  return json({ path: `/.netlify/functions/image?key=${encodeURIComponent(key)}` });
};
