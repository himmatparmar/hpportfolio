import { connectLambda, getStore } from '@netlify/blobs';

export const handler = async (event) => {
  connectLambda(event);

  const key = event.queryStringParameters?.key;
  if (!key) return { statusCode: 400, body: 'Missing key' };

  const store = getStore('cms-images');
  const result = await store.getWithMetadata(key, { type: 'arrayBuffer' });
  if (!result) return { statusCode: 404, body: 'Not found' };

  const { data, metadata } = result;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': metadata?.contentType || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
    body: Buffer.from(data).toString('base64'),
    isBase64Encoded: true,
  };
};
