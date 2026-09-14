export function checkAuth(event) {
  const password = process.env.CMS_ADMIN_PASSWORD;
  if (!password) {
    return { ok: false, status: 500, error: 'CMS_ADMIN_PASSWORD is not set on the server' };
  }
  const auth = event.headers.authorization || event.headers.Authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');
  if (token !== password) {
    return { ok: false, status: 401, error: 'Incorrect password' };
  }
  return { ok: true };
}
