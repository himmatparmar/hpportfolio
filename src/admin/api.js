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

export async function getSection(section) {
  const res = await fetch(`${FN_BASE}/content?section=${section}`);
  if (!res.ok) throw new Error(`Failed to load ${section}`);
  return res.json();
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
  if (!res.ok) throw new Error(`Failed to save ${section}`);
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
  if (!res.ok) throw new Error('Upload failed');
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
