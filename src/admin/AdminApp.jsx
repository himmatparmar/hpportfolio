import { useEffect, useState } from 'react';
import { getSection, saveSection, getToken, setToken, requestPasswordChange, confirmPasswordChange } from './api';
import ListEditor from './ListEditor';
import TextListEditor from './TextListEditor';
import ImageListEditor from './ImageListEditor';
import seedWork from '../data/work.json';
import seedEducation from '../data/education.json';
import seedBanner from '../data/banner.json';
import seedGettouch from '../data/gettouch.json';
import seedSkills from '../data/skills.json';
import './admin.css';

const TABS = ['Work', 'Education', 'Banner', 'Contact', 'Skills', 'Password'];

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

function SaveBar({ status, errorMessage, onSave }) {
  return (
    <div className="save-bar">
      <button type="button" className="save-btn" onClick={onSave}>Save changes</button>
      {status === 'saving' && <span className="status">Saving…</span>}
      {status === 'saved' && <span className="status ok">Saved ✓</span>}
      {status === 'error' && <span className="status error">{errorMessage || 'Save failed'}</span>}
    </div>
  );
}

function useSection(section, seed) {
  const [data, setData] = useState(seed);
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSection(section)
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [section]);

  const save = async () => {
    setStatus('saving');
    try {
      await saveSection(section, data);
      setStatus('saved');
      setTimeout(() => setStatus('idle'), 1500);
    } catch (err) {
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  return { data, setData, status, errorMessage, save, loaded };
}

function WorkTab() {
  const { data, setData, status, errorMessage, save, loaded } = useSection('work', seedWork);
  if (!loaded) return <p>Loading…</p>;
  return (
    <div>
      <SaveBar status={status} errorMessage={errorMessage} onSave={save} />
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
  const { data, setData, status, errorMessage, save, loaded } = useSection('education', seedEducation);
  if (!loaded) return <p>Loading…</p>;
  return (
    <div>
      <SaveBar status={status} errorMessage={errorMessage} onSave={save} />
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
  const { data, setData, status, errorMessage, save, loaded } = useSection('banner', seedBanner);
  if (!loaded) return <p>Loading…</p>;
  return (
    <div>
      <SaveBar status={status} errorMessage={errorMessage} onSave={save} />
      <h3>About / Banner paragraphs</h3>
      <TextListEditor
        items={data.profileText}
        onChange={(profileText) => setData({ ...data, profileText })}
      />
    </div>
  );
}

function ContactTab() {
  const { data, setData, status, errorMessage, save, loaded } = useSection('gettouch', seedGettouch);
  if (!loaded) return <p>Loading…</p>;
  return (
    <div>
      <SaveBar status={status} errorMessage={errorMessage} onSave={save} />
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
  const { data, setData, status, errorMessage, save, loaded } = useSection('skills', seedSkills);
  if (!loaded) return <p>Loading…</p>;
  const setGroup = (key) => (items) => setData({ ...data, [key]: items });
  return (
    <div>
      <SaveBar status={status} errorMessage={errorMessage} onSave={save} />
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

function PasswordTab() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [stage, setStage] = useState('form'); // 'form' | 'code' | 'done'
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const sendCode = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setErrorMessage('New password must be at least 8 characters');
      setStatus('error');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      setStatus('error');
      return;
    }
    setStatus('saving');
    try {
      await requestPasswordChange(newPassword);
      setStage('code');
      setStatus('idle');
      setErrorMessage('');
    } catch (err) {
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  const confirm = async (e) => {
    e.preventDefault();
    setStatus('saving');
    try {
      await confirmPasswordChange(code);
      setToken(newPassword);
      setStage('done');
      setStatus('idle');
    } catch (err) {
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  if (stage === 'done') {
    return <p>Password changed — you're still logged in with the new password.</p>;
  }

  if (stage === 'code') {
    return (
      <form className="password-form" onSubmit={confirm}>
        <p>Enter the 6-digit code emailed to you. It expires in 10 minutes.</p>
        <label className="field">
          <span>Confirmation code</span>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </label>
        <button type="submit" className="save-btn">Confirm change</button>
        {status === 'error' && <p className="status error">{errorMessage}</p>}
        <button type="button" className="logout-link" onClick={() => { setStage('form'); setErrorMessage(''); setStatus('idle'); }}>
          Start over
        </button>
      </form>
    );
  }

  return (
    <form className="password-form" onSubmit={sendCode}>
      <label className="field">
        <span>New password</span>
        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      </label>
      <label className="field">
        <span>Confirm new password</span>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      </label>
      <button type="submit" className="save-btn">Send confirmation code</button>
      {status === 'error' && <p className="status error">{errorMessage}</p>}
    </form>
  );
}

function LoginScreen({ onSubmit }) {
  const [password, setPassword] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!password) return;
    setToken(password);
    onSubmit();
  };

  return (
    <div className="login-screen">
      <form className="login-box" onSubmit={submit}>
        <h1>Portfolio CMS</h1>
        <p>Enter the admin password to continue.</p>
        <input
          type="password"
          autoFocus
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="save-btn">Enter</button>
      </form>
    </div>
  );
}

export default function AdminApp() {
  const [tab, setTab] = useState('Work');
  const [authed, setAuthed] = useState(() => Boolean(getToken()));

  if (!authed) {
    return <LoginScreen onSubmit={() => setAuthed(true)} />;
  }

  const logout = () => {
    setToken('');
    setAuthed(false);
  };

  return (
    <div className="admin-app">
      <header className="admin-header">
        <h1>Portfolio CMS</h1>
        <p>Edit content, then save — changes go live within moments. <button type="button" className="logout-link" onClick={logout}>Log out</button></p>
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
        {tab === 'Password' && <PasswordTab />}
      </main>
    </div>
  );
}
