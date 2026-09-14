const FN_BASE = '/.netlify/functions';

export function getToken() {
  try {
    return sessionStorage.getItem('cms_token') || '';
  } catch {
    return '';
  }
}

export function setToken(token) {
  try {
    sessionStorage.setItem('cms_token', token);
  } catch {
    // ignore storage failures (e.g. private browsing)
  }
}

function handleUnauthorized() {
  try {
    sessionStorage.removeItem('cms_token');
  } catch {
    // ignore
  }
  alert('Incorrect admin password. Please re-enter it.');
  window.location.reload();
}

export async function verifyLogin(password) {
  const res = await fetch(`${FN_BASE}/auth-verify`, {
    headers: { Authorization: `Bearer ${password}` },
  });
  if (res.ok) return true;
  if (res.status === 401) return false;
  throw new Error(await errorMessage(res, 'Could not verify password'));
}

export async function getSection(section) {
  const res = await fetch(`${FN_BASE}/content?section=${section}`);
  if (!res.ok) throw new Error(`Failed to load ${section}`);
  return res.json();
}

async function errorMessage(res, fallback) {
  const body = await res.json().catch(() => ({}));
  return body.error || fallback;
}

export async function saveSection(section, data) {
  const res = await fetch(`${FN_BASE}/content?section=${section}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify(data),
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(await errorMessage(res, `Failed to save ${section}`));
  return res.json();
}

export async function uploadImage(file) {
  const dataBase64 = await fileToBase64(file);
  const res = await fetch(`${FN_BASE}/upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ filename: file.name, contentType: file.type, dataBase64 }),
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(await errorMessage(res, 'Upload failed'));
  return res.json();
}

export async function requestPasswordChange(newPassword) {
  const res = await fetch(`${FN_BASE}/password-change-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ newPassword }),
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(await errorMessage(res, 'Failed to send confirmation code'));
  return res.json();
}

export async function confirmPasswordChange(code) {
  const res = await fetch(`${FN_BASE}/password-change-confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ code }),
  });
  if (res.status === 401) {
    handleUnauthorized();
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(await errorMessage(res, 'Failed to confirm password change'));
  return res.json();
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
