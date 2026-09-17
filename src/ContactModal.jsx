import { useState } from 'react';

const initialForm = { name: '', email: '', phone: '', message: '', hp: '' };

function ContactModal({ open, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState('');

  if (!open) return null;

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const close = () => {
    onClose();
    setTimeout(() => {
      setForm(initialForm);
      setStatus('idle');
      setErrorMessage('');
    }, 200);
  };

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');
    try {
      const res = await fetch('/.netlify/functions/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || 'Something went wrong. Please try again.');
      setStatus('sent');
    } catch (err) {
      setErrorMessage(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="popup-overlay" onClick={close}>
      <div className="popup contact-popup" onClick={(e) => e.stopPropagation()}>
        <div className="popUpHeader">
          <button type="button" onClick={close}>X</button>
        </div>
        <div className="popUpBodayContent">
          <h2>Say Hello</h2>
          {status === 'sent' ? (
            <div className="contact-sent">
              <p>Thanks{form.name ? `, ${form.name.split(' ')[0]}` : ''}! Your message is on its way — I&apos;ll get back to you soon.</p>
              <button type="button" className="sayHello" onClick={close}>Close</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <label>
                <span>Name</span>
                <input type="text" required maxLength={200} value={form.name} onChange={update('name')} />
              </label>
              <label>
                <span>Email</span>
                <input type="email" required value={form.email} onChange={update('email')} />
              </label>
              <label>
                <span>Number</span>
                <input
                  type="tel"
                  required
                  maxLength={20}
                  pattern="\+?[0-9\s\-()]{7,20}"
                  title="Enter a valid phone number (at least 7 digits)"
                  value={form.phone}
                  onChange={update('phone')}
                />
              </label>
              <label>
                <span>Message</span>
                <textarea required rows={4} maxLength={5000} value={form.message} onChange={update('message')} />
              </label>
              {/* Honeypot: invisible to real visitors, catches simple bots that fill every field */}
              <input
                type="text"
                value={form.hp}
                onChange={update('hp')}
                className="contact-honeypot"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />
              {status === 'error' && <p className="contact-error">{errorMessage}</p>}
              <button type="submit" className="sayHello" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactModal;
