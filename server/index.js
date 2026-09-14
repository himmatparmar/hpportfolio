import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'src', 'data');
const UPLOAD_DIR = path.join(ROOT, 'public', 'uploads');

const SECTIONS = new Set(['work', 'education', 'banner', 'gettouch', 'skills']);

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '-');
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

function dataPath(section) {
  return path.join(DATA_DIR, `${section}.json`);
}

app.get('/api/content/:section', async (req, res) => {
  const { section } = req.params;
  if (!SECTIONS.has(section)) return res.status(404).json({ error: 'Unknown section' });
  try {
    const raw = await fs.readFile(dataPath(section), 'utf-8');
    res.json(JSON.parse(raw));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/content/:section', async (req, res) => {
  const { section } = req.params;
  if (!SECTIONS.has(section)) return res.status(404).json({ error: 'Unknown section' });
  try {
    await fs.writeFile(dataPath(section), JSON.stringify(req.body, null, 2) + '\n', 'utf-8');
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ path: `/uploads/${req.file.filename}` });
});

const PORT = process.env.CMS_API_PORT || 4000;
app.listen(PORT, () => {
  console.log(`CMS API server running at http://localhost:${PORT}`);
});
