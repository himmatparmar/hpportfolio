import { connectLambda, getStore } from '@netlify/blobs';
import { checkAuth } from './_auth.js';
import seedWork from '../../src/data/work.json';
import seedEducation from '../../src/data/education.json';
import seedBanner from '../../src/data/banner.json';
import seedGettouch from '../../src/data/gettouch.json';
import seedSkills from '../../src/data/skills.json';

const SEEDS = {
  work: seedWork,
  education: seedEducation,
  banner: seedBanner,
  gettouch: seedGettouch,
  skills: seedSkills,
};

function json(body, status = 200) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  };
}

export const handler = async (event) => {
  connectLambda(event);

  const section = event.queryStringParameters?.section;
  if (!section || !SEEDS[section]) {
    return json({ error: 'Unknown section' }, 404);
  }

  const store = getStore('cms-content');

  if (event.httpMethod === 'GET') {
    const value = await store.get(section, { type: 'json' });
    return json(value ?? SEEDS[section]);
  }

  if (event.httpMethod === 'PUT') {
    const auth = checkAuth(event);
    if (!auth.ok) return json({ error: auth.error }, auth.status);
    let data;
    try {
      data = JSON.parse(event.body);
    } catch {
      return json({ error: 'Invalid JSON' }, 400);
    }
    await store.setJSON(section, data);
    return json({ ok: true });
  }

  return json({ error: 'Method not allowed' }, 405);
};
