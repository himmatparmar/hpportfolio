import { useEffect, useState } from 'react';
import { getSection, saveSection, getToken, setToken, verifyLogin, requestPasswordChange, confirmPasswordChange } from './api';
import ListEditor from './ListEditor';
import TextListEditor from './TextListEditor';
import ImageListEditor from './ImageListEditor';
import seedWork from '../data/work.json';
import seedEducation from '../data/education.json';
import seedBanner from '../data/banner.json';
import seedGettouch from '../data/gettouch.json';
import seedSkills from '../data/skills.json';
import seedInsta from '../data/insta.json';
import hpLogo from '../assets/hpLogo.png';
import './admin.css';

const TABS = ['Work', 'Education', 'Banner', 'Contact', 'Skills', 'Instagram', 'Password'];

const TAB_ICONS = {
  Work: 'fa-solid fa-briefcase',
  Education: 'fa-solid fa-graduation-cap',
  Banner: 'fa-solid fa-user',
  Contact: 'fa-solid fa-envelope',
  Skills: 'fa-solid fa-star',
  Instagram: 'fa-brands fa-instagram',
  Password: 'fa-solid fa-lock',
};

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
      <button type="button" className="save-btn" onClick={onSave}>
        <i className="fa-solid fa-floppy-disk" /> Save changes
      </button>
      {status === 'saving' && <span className="status"><i className="fa-solid fa-spinner fa-spin" /> Saving…</span>}
      {status === 'saved' && <span className="status ok"><i className="fa-solid fa-circle-check" /> Saved</span>}
      {status === 'error' && <span className="status error"><i className="fa-solid fa-circle-exclamation" /> {errorMessage || 'Save failed'}</span>}
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
  if (!loaded) return <p className="loading-state"><i className="fa-solid fa-spinner fa-spin" /> Loading…</p>;
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
  if (!loaded) return <p className="loading-state"><i className="fa-solid fa-spinner fa-spin" /> Loading…</p>;
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
  if (!loaded) return <p className="loading-state"><i className="fa-solid fa-spinner fa-spin" /> Loading…</p>;
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
  if (!loaded) return <p className="loading-state"><i className="fa-solid fa-spinner fa-spin" /> Loading…</p>;
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
  if (!loaded) return <p className="loading-state"><i className="fa-solid fa-spinner fa-spin" /> Loading…</p>;
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

function InstaTab() {
  const { data, setData, status, errorMessage, save, loaded } = useSection('insta', seedInsta);
  if (!loaded) return <p className="loading-state"><i className="fa-solid fa-spinner fa-spin" /> Loading…</p>;
  return (
    <div>
      <SaveBar status={status} errorMessage={errorMessage} onSave={save} />
      <label className="field">
        <span>Instagram profile URL ("View more..." link)</span>
        <input
          type="text"
          value={data.profileUrl}
          onChange={(e) => setData({ ...data, profileUrl: e.target.value })}
        />
      </label>
      <h3>Post URLs</h3>
      <TextListEditor
        items={data.postUrls}
        onChange={(postUrls) => setData({ ...data, postUrls })}
        itemLabel="Post"
        addLabel="Add post URL"
        rows={1}
      />
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
    return (
      <div className="password-form password-done">
        <div className="password-done-icon"><i className="fa-solid fa-circle-check" /></div>
        <p>Password changed — you're still logged in with the new password.</p>
      </div>
    );
  }

  if (stage === 'code') {
    return (
      <form className="password-form" onSubmit={confirm}>
        <p><i className="fa-solid fa-envelope-circle-check" /> Enter the 6-digit code emailed to you. It expires in 10 minutes.</p>
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
        <button type="submit" className="save-btn"><i className="fa-solid fa-check" /> Confirm change</button>
        {status === 'error' && <p className="status error"><i className="fa-solid fa-circle-exclamation" /> {errorMessage}</p>}
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
      <button type="submit" className="save-btn"><i className="fa-solid fa-paper-plane" /> Send confirmation code</button>
      {status === 'error' && <p className="status error"><i className="fa-solid fa-circle-exclamation" /> {errorMessage}</p>}
    </form>
  );
}

function LoginScreen({ onSubmit }) {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!password) return;
    setStatus('checking');
    setErrorMessage('');
    try {
      const valid = await verifyLogin(password);
      if (!valid) {
        setErrorMessage('Incorrect password.');
        setStatus('error');
        return;
      }
      setToken(password);
      onSubmit();
    } catch (err) {
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="login-screen">
      <form className="login-box" onSubmit={submit}>
        <div className="login-icon"><i className="fa-solid fa-lock" /></div>
        <h1>Portfolio CMS</h1>
        <p>Enter the admin password to continue.</p>
        <input
          type="password"
          autoFocus
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {status === 'error' && <p className="status error"><i className="fa-solid fa-circle-exclamation" /> {errorMessage}</p>}
        <button type="submit" className="save-btn" disabled={status === 'checking'}>
          {status === 'checking' ? <><i className="fa-solid fa-spinner fa-spin" /> Checking…</> : <>Enter <i className="fa-solid fa-arrow-right" /></>}
        </button>
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
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <img src={hpLogo} alt="" className="brand-logo" />
          <div>
            <div className="brand-title">Portfolio CMS</div>
            <div className="brand-subtitle">Himmatlal Parmar</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {TABS.map((t) => (
            <button
              key={t}
              className={`sidebar-nav-item ${t === tab ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              <i className={TAB_ICONS[t]} />
              <span>{t}</span>
            </button>
          ))}
        </nav>
        <button type="button" className="sidebar-logout" onClick={logout}>
          <i className="fa-solid fa-right-from-bracket" />
          <span>Log out</span>
        </button>
      </aside>
      <main className="admin-main">
        <div className="admin-topbar">
          <i className={TAB_ICONS[tab]} />
          <div>
            <h1>{tab}</h1>
            <p>Edit content, then save — changes go live within moments.</p>
          </div>
        </div>
        <div className="admin-content" key={tab}>
          {tab === 'Work' && <WorkTab />}
          {tab === 'Education' && <EducationTab />}
          {tab === 'Banner' && <BannerTab />}
          {tab === 'Contact' && <ContactTab />}
          {tab === 'Skills' && <SkillsTab />}
          {tab === 'Instagram' && <InstaTab />}
          {tab === 'Password' && <PasswordTab />}
        </div>
      </main>
    </div>
  );
}
