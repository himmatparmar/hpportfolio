const API_BASE = 'http://localhost:4000/api';

export async function getSection(section) {
  const res = await fetch(`${API_BASE}/content/${section}`);
  if (!res.ok) throw new Error(`Failed to load ${section}`);
  return res.json();
}

export async function saveSection(section, data) {
  const res = await fetch(`${API_BASE}/content/${section}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to save ${section}`);
  return res.json();
}

export async function uploadImage(file) {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: form });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}
