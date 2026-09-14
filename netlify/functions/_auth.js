import { getStore } from '@netlify/blobs';
import crypto from 'crypto';

const STORE_NAME = 'cms-auth';
const PASSWORD_KEY = 'password-hash';
const PENDING_KEY = 'pending-change';
const CODE_TTL_MS = 10 * 60 * 1000;

function hash(value, salt = crypto.randomBytes(16).toString('hex')) {
  const derived = crypto.scryptSync(value, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function matches(value, stored) {
  if (!stored) return false;
  const [salt, expected] = stored.split(':');
  const derivedBuf = crypto.scryptSync(value, salt, 64);
  const expectedBuf = Buffer.from(expected, 'hex');
  if (derivedBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(derivedBuf, expectedBuf);
}

// Checks a request's Bearer token against the stored password hash, falling
// back to the legacy CMS_ADMIN_PASSWORD env var until a password is ever
// set through the "change password" flow.
export async function checkAuth(event) {
  const auth = event.headers.authorization || event.headers.Authorization || '';
  const token = auth.replace(/^Bearer\s+/i, '');

  const store = getStore(STORE_NAME);
  const stored = await store.get(PASSWORD_KEY, { type: 'text' });
  const legacy = process.env.CMS_ADMIN_PASSWORD;

  if (!stored && !legacy) {
    return { ok: false, status: 500, error: 'No admin password configured on the server' };
  }

  const valid = stored ? matches(token, stored) : token === legacy;
  if (!valid) return { ok: false, status: 401, error: 'Incorrect password' };
  return { ok: true };
}

// Stores a pending password change gated behind an emailed code, returning
// the plaintext code to send. Nothing takes effect until confirmPasswordChange.
export async function requestPasswordChange(newPassword) {
  const store = getStore(STORE_NAME);
  const code = String(crypto.randomInt(100000, 999999));
  await store.setJSON(PENDING_KEY, {
    codeHash: hash(code),
    newPasswordHash: hash(newPassword),
    expiresAt: Date.now() + CODE_TTL_MS,
  });
  return code;
}

export async function confirmPasswordChange(code) {
  const store = getStore(STORE_NAME);
  const record = await store.get(PENDING_KEY, { type: 'json' });
  if (!record) return { ok: false, error: 'No pending password change. Request a new code.' };
  if (Date.now() > record.expiresAt) {
    await store.delete(PENDING_KEY);
    return { ok: false, error: 'Code expired. Request a new one.' };
  }
  if (!matches(code, record.codeHash)) {
    return { ok: false, error: 'Incorrect code.' };
  }
  await store.set(PASSWORD_KEY, record.newPasswordHash);
  await store.delete(PENDING_KEY);
  return { ok: true };
}
