import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { loginUser, registerUser } from '../services/authService';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      let data;
      if (isRegister) {
        data = await registerUser(email, fullName, password);
      } else {
        data = await loginUser(email, password);
      }
      login(data.access_token);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Background decoration */}
      <div style={styles.bgCircle1} />
      <div style={styles.bgCircle2} />

      {/* Brand header */}
      <div style={styles.brand}>
        <div style={styles.logoIcon}>₹</div>
        <span style={styles.logoText}>Vyapar IQ</span>
      </div>

      {/* Card */}
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>
          {isRegister ? 'Create an account' : 'Welcome back'}
        </h2>
        <p style={styles.subtitle}>
          {isRegister
            ? 'Start your journey with intelligent insights'
            : 'Sign in to continue to your dashboard'}
        </p>

        {error && <div style={styles.error}>{error}</div>}

        {isRegister && (
          <label style={styles.fieldGroup}>
            <span style={styles.label}>FULL NAME</span>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon} className="material-symbols-outlined">person</span>
              <input
                style={styles.input}
                type="text"
                placeholder="Your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          </label>
        )}

        <label style={styles.fieldGroup}>
          <span style={styles.label}>EMAIL ADDRESS</span>
          <div style={styles.inputWrapper}>
            <span style={styles.inputIcon} className="material-symbols-outlined">mail</span>
            <input
              style={styles.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </label>

        <label style={styles.fieldGroup}>
          <span style={styles.label}>PASSWORD</span>
          <div style={styles.inputWrapper}>
            <span style={styles.inputIcon} className="material-symbols-outlined">lock</span>
            <input
              style={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
        </label>

        <button type="submit" style={styles.button} disabled={submitting}>
          {submitting
            ? 'Please wait…'
            : isRegister
              ? 'Create Account'
              : 'Sign In'}
        </button>

        <p style={styles.toggle}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            style={styles.toggleBtn}
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
          >
            {isRegister ? 'Sign In' : 'Create one'}
          </button>
        </p>
      </form>
    </div>
  );
}

/* ── Inline styles (matches the Vyapar IQ branding from the screenshot) ────── */
const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #fdf6f0 0%, #fce8d5 100%)',
    fontFamily: "'Inter', sans-serif",
    position: 'relative',
    overflow: 'hidden',
    padding: '2rem',
  },
  bgCircle1: {
    position: 'absolute', top: '-120px', right: '-120px',
    width: '340px', height: '340px', borderRadius: '50%',
    background: 'rgba(180, 83, 9, 0.08)',
  },
  bgCircle2: {
    position: 'absolute', bottom: '-100px', left: '-100px',
    width: '280px', height: '280px', borderRadius: '50%',
    background: 'rgba(180, 83, 9, 0.06)',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem',
    zIndex: 1,
  },
  logoIcon: {
    width: '48px', height: '48px', borderRadius: '14px',
    background: 'linear-gradient(135deg, #b45309 0%, #92400e 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontSize: '22px', fontWeight: 800,
  },
  logoText: {
    fontSize: '28px', fontWeight: 800,
    background: 'linear-gradient(135deg, #b45309, #78350f)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
  },
  card: {
    background: '#fff', borderRadius: '20px', padding: '2.5rem 2rem',
    width: '100%', maxWidth: '420px',
    boxShadow: '0 15px 50px rgba(0,0,0,0.08)',
    display: 'flex', flexDirection: 'column', gap: '1.2rem',
    zIndex: 1,
  },
  title: {
    fontSize: '24px', fontWeight: 800, color: '#1a1a1a', margin: 0,
  },
  subtitle: {
    fontSize: '14px', color: '#888', margin: '-0.5rem 0 0.2rem',
  },
  error: {
    background: '#fff1f1', color: '#dc2626', padding: '12px 16px',
    borderRadius: '12px', fontSize: '14px', fontWeight: 500,
  },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: {
    fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em',
    color: '#555',
  },
  inputWrapper: {
    display: 'flex', alignItems: 'center', gap: '10px',
    background: '#f5ebe0', borderRadius: '14px', padding: '0 16px',
    border: '2px solid transparent', transition: 'border 0.2s',
  },
  inputIcon: { fontSize: '20px', color: '#999' },
  input: {
    flex: 1, border: 'none', outline: 'none', background: 'transparent',
    padding: '14px 0', fontSize: '15px', color: '#333',
    fontFamily: "'Inter', sans-serif",
  },
  button: {
    marginTop: '0.5rem', padding: '14px', borderRadius: '14px',
    border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '15px',
    color: '#fff', fontFamily: "'Inter', sans-serif",
    background: 'linear-gradient(135deg, #b45309 0%, #92400e 100%)',
    boxShadow: '0 4px 14px rgba(180,83,9,0.35)',
    transition: 'opacity 0.2s',
  },
  toggle: {
    textAlign: 'center', fontSize: '13px', color: '#888', margin: 0,
  },
  toggleBtn: {
    background: 'none', border: 'none', color: '#b45309',
    fontWeight: 700, cursor: 'pointer', fontSize: '13px',
    fontFamily: "'Inter', sans-serif",
  },
};
