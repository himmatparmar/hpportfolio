import { connectLambda } from '@netlify/blobs';
import nodemailer from 'nodemailer';
import { checkAuth, requestPasswordChange } from './_auth.js';

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

  const { newPassword } = payload;
  if (!newPassword || newPassword.length < 8) {
    return json({ error: 'New password must be at least 8 characters' }, 400);
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailPass) {
    return json({ error: 'Email is not configured on the server (GMAIL_USER / GMAIL_APP_PASSWORD missing)' }, 500);
  }

  const code = await requestPasswordChange(newPassword);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass },
  });

  await transporter.sendMail({
    from: gmailUser,
    to: gmailUser,
    subject: 'Portfolio CMS — confirm your password change',
    text: `Your confirmation code is ${code}. It expires in 10 minutes.\n\nIf you didn't request this, ignore this email — your password stays unchanged.`,
  });

  return json({ ok: true });
};
