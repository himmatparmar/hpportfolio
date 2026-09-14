import { useEffect, useState } from 'react';
import { getSection, saveSection } from './api';
import ListEditor from './ListEditor';
import TextListEditor from './TextListEditor';
import ImageListEditor from './ImageListEditor';
import './admin.css';

const TABS = ['Work', 'Education', 'Banner', 'Contact', 'Skills'];

const WORK_FIELDS = [
  { key: 'expCompany', label: 'Company' },
  { key: 'expPostion', label: 'Position' },
  { key: 'expinnerTitle', label: 'Dates (e.g. 8th June 2026 - Till Date)' },
  { key: 'exProjects', label: 'Projects', type: 'textarea' },
  { key: 'exDev', label: 'Development', type: 'textarea' },
  { key: 'exRespo', label: 'Responsibilities', type: 'textarea', rows: 4 },
];

const EDUCATION_FIELDS = [
  { key: 'expinnerTitle', label: 'School / Certification' },
  { key: 'expPostion', label: 'Detail' },
];

function SaveBar({ status, onSave }) {
  return (
    <div className="save-bar">
      <button type="button" className="save-btn" onClick={onSave}>Save changes</button>
      {status === 'saving' && <span className="status">Saving…</span>}
      {status === 'saved' && <span className="status ok">Saved ✓</span>}
      {status === 'error' && <span className="status error">Save failed</span>}
    </div>
  );
}

function useSection(section, initial) {
  const [data, setData] = useState(initial);
  const [status, setStatus] = useState('idle');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSection(section)
      .then((d) => {
        setData(d);
        setLoaded(true);
      })
      .catch(() => setStatus('error'));
  }, [section]);

  const save = async () => {
    setStatus('saving');
    try {
      await saveSection(section, data);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1500);
    } catch {
      setStatus('error');
    }
  };

  return { data, setData, status, save, loaded };
}

function WorkTab() {
  const { data, setData, status, save, loaded } = useSection('work', []);
  if (!loaded) return <p>Loading…</p>;
  return (
    <div>
      <SaveBar status={status} onSave={save} />
      <ListEditor
        items={data}
        onChange={setData}
        fields={WORK_FIELDS}
        emptyItem={{ expCompany: '', expPostion: '', expinnerTitle: '', exProjects: '', exDev: '', exRespo: '' }}
      />
    </div>
  );
}

function EducationTab() {
  const { data, setData, status, save, loaded } = useSection('education', []);
  if (!loaded) return <p>Loading…</p>;
  return (
    <div>
      <SaveBar status={status} onSave={save} />
      <ListEditor
        items={data}
        onChange={setData}
        fields={EDUCATION_FIELDS}
        emptyItem={{ expinnerTitle: '', expPostion: '' }}
      />
    </div>
  );
}

function BannerTab() {
  const { data, setData, status, save, loaded } = useSection('banner', { profileText: [] });
  if (!loaded) return <p>Loading…</p>;
  return (
    <div>
      <SaveBar status={status} onSave={save} />
      <h3>About / Banner paragraphs</h3>
      <TextListEditor
        items={data.profileText}
        onChange={(profileText) => setData({ ...data, profileText })}
      />
    </div>
  );
}

function ContactTab() {
  const { data, setData, status, save, loaded } = useSection('gettouch', { profileText: [], email: '' });
  if (!loaded) return <p>Loading…</p>;
  return (
    <div>
      <SaveBar status={status} onSave={save} />
      <label className="field">
        <span>Email</span>
        <input
          type="text"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
      </label>
      <h3>Get In Touch paragraphs</h3>
      <TextListEditor
        items={data.profileText}
        onChange={(profileText) => setData({ ...data, profileText })}
      />
    </div>
  );
}

function SkillsTab() {
  const { data, setData, status, save, loaded } = useSection('skills', {
    skills: [], softwares: [], certificates: [], events: [],
  });
  if (!loaded) return <p>Loading…</p>;
  const setGroup = (key) => (items) => setData({ ...data, [key]: items });
  return (
    <div>
      <SaveBar status={status} onSave={save} />
      <h3>Skills</h3>
      <ImageListEditor items={data.skills} onChange={setGroup('skills')} />
      <h3>Softwares</h3>
      <ImageListEditor items={data.softwares} onChange={setGroup('softwares')} />
      <h3>Certificates</h3>
      <ImageListEditor items={data.certificates} onChange={setGroup('certificates')} />
      <h3>Events</h3>
      <ImageListEditor items={data.events} onChange={setGroup('events')} />
    </div>
  );
}

export default function AdminApp() {
  const [tab, setTab] = useState('Work');

  return (
    <div className="admin-app">
      <header className="admin-header">
        <h1>Portfolio CMS</h1>
        <p>Edit content locally, then save. Refresh the site to see changes.</p>
      </header>
      <nav className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={t === tab ? 'active' : ''}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>
      <main className="admin-content">
        {tab === 'Work' && <WorkTab />}
        {tab === 'Education' && <EducationTab />}
        {tab === 'Banner' && <BannerTab />}
        {tab === 'Contact' && <ContactTab />}
        {tab === 'Skills' && <SkillsTab />}
      </main>
    </div>
  );
}
