import nodemailer from 'nodemailer';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9\s\-()]{7,20}$/;

function json(body, status = 200) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { name, email, phone, message, hp } = payload;

  // Honeypot: real visitors never see or fill this field, bots usually fill everything.
  if (hp) return json({ ok: true });

  if (!name || !email || !phone || !message) {
    return json({ error: 'Name, email, number, and message are all required' }, 400);
  }
  if (!EMAIL_RE.test(email)) {
    return json({ error: 'Enter a valid email address' }, 400);
  }
  const digitCount = (phone.match(/\d/g) || []).length;
  if (!PHONE_RE.test(phone) || digitCount < 7) {
    return json({ error: 'Enter a valid phone number' }, 400);
  }
  if (name.length > 200 || message.length > 5000) {
    return json({ error: 'One of the fields is too long' }, 400);
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailPass) {
    return json({ error: 'Email is not configured on the server' }, 500);
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: gmailUser, pass: gmailPass },
  });

  try {
    await transporter.sendMail({
      from: gmailUser,
      to: gmailUser,
      replyTo: email,
      subject: `Portfolio contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
    });
  } catch {
    return json({ error: 'Failed to send. Please try again shortly.' }, 502);
  }

  return json({ ok: true });
};
