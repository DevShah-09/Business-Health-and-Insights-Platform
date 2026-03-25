import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      if (isSignUp) {
        await register(email, fullName, password);
      } else {
        await login(email, password);
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp((v) => !v);
    setError('');
  };

  return (
    <div className="login-page">
      {/* Animated background orbs */}
      <div className="login-orb login-orb--1" />
      <div className="login-orb login-orb--2" />
      <div className="login-orb login-orb--3" />

      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo__icon">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1", fontSize: 28, color: '#fff' }}>
              account_balance_wallet
            </span>
          </div>
          <h1 className="login-logo__title">FinSight</h1>
          <p className="login-logo__subtitle">Ledger Artisan</p>
        </div>

        {/* Heading */}
        <h2 className="login-heading">{isSignUp ? 'Create your account' : 'Welcome back'}</h2>
        <p className="login-subheading">
          {isSignUp
            ? 'Start your business insights journey'
            : 'Sign in to access your dashboard'}
        </p>

        {/* Error */}
        {error && (
          <div className="login-error">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
            {error}
          </div>
        )}

        {/* Form */}
        <form className="login-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="login-field">
              <label className="login-label" htmlFor="fullName">Full Name</label>
              <div className="login-input-wrap">
                <span className="material-symbols-outlined login-input-icon">person</span>
                <input
                  id="fullName"
                  className="login-input"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  autoComplete="name"
                />
              </div>
            </div>
          )}

          <div className="login-field">
            <label className="login-label" htmlFor="email">Email</label>
            <div className="login-input-wrap">
              <span className="material-symbols-outlined login-input-icon">mail</span>
              <input
                id="email"
                className="login-input"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label" htmlFor="password">Password</label>
            <div className="login-input-wrap">
              <span className="material-symbols-outlined login-input-icon">lock</span>
              <input
                id="password"
                className="login-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
              />
            </div>
          </div>

          {isSignUp && (
            <div className="login-field">
              <label className="login-label" htmlFor="confirmPassword">Confirm Password</label>
              <div className="login-input-wrap">
                <span className="material-symbols-outlined login-input-icon">lock</span>
                <input
                  id="confirmPassword"
                  className="login-input"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="login-submit"
            disabled={submitting}
          >
            {submitting ? (
              <span className="login-spinner" />
            ) : isSignUp ? (
              'Create Account'
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Toggle */}
        <p className="login-toggle">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button type="button" className="login-toggle__btn" onClick={toggleMode}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>

      {/* Inline styles scoped to this page */}
      <style>{`
        .login-page {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--background);
          overflow: hidden;
          padding: 1.5rem;
        }

        /* Floating gradient orbs */
        .login-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.45;
          pointer-events: none;
          will-change: transform;
        }
        .login-orb--1 {
          width: 420px; height: 420px;
          background: var(--brand);
          top: -120px; left: -80px;
          animation: orbFloat1 14s ease-in-out infinite alternate;
        }
        .login-orb--2 {
          width: 340px; height: 340px;
          background: var(--brand-hover);
          bottom: -100px; right: -60px;
          animation: orbFloat2 16s ease-in-out infinite alternate;
        }
        .login-orb--3 {
          width: 200px; height: 200px;
          background: var(--brand-muted);
          top: 50%; left: 60%;
          animation: orbFloat3 12s ease-in-out infinite alternate;
        }
        @keyframes orbFloat1 { to { transform: translate(60px, 80px) scale(1.08); } }
        @keyframes orbFloat2 { to { transform: translate(-50px, -60px) scale(1.12); } }
        @keyframes orbFloat3 { to { transform: translate(-40px, 50px) scale(0.92); } }

        /* Card */
        .login-card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 420px;
          padding: 2.5rem 2rem;
          border-radius: 1.5rem;
          background: color-mix(in srgb, var(--surface-card) 75%, transparent);
          backdrop-filter: blur(24px) saturate(1.6);
          -webkit-backdrop-filter: blur(24px) saturate(1.6);
          border: 1px solid var(--surface-border);
          box-shadow: var(--shadow-editorial), 0 0 60px rgba(163, 57, 0, 0.07);
          animation: cardEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes cardEnter {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Logo */
        .login-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .login-logo__icon {
          width: 52px; height: 52px;
          border-radius: 1rem;
          background: linear-gradient(135deg, var(--brand-hover), var(--brand));
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(163, 57, 0, 0.3);
          margin-bottom: 0.5rem;
        }
        .login-logo__title {
          font-family: var(--font-headline);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--surface-foreground);
          line-height: 1.2;
        }
        .login-logo__subtitle {
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--surface-muted-foreground);
          font-weight: 700;
        }

        /* Headings */
        .login-heading {
          font-family: var(--font-headline);
          text-align: center;
          font-size: 1.35rem;
          font-weight: 700;
          color: var(--surface-foreground);
          margin-bottom: 0.25rem;
        }
        .login-subheading {
          text-align: center;
          font-size: 0.82rem;
          color: var(--surface-muted-foreground);
          margin-bottom: 1.5rem;
        }

        /* Error */
        .login-error {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.25);
          color: #ef4444;
          padding: 0.65rem 0.85rem;
          border-radius: 0.75rem;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
          animation: shake 0.35s ease;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          75% { transform: translateX(6px); }
        }

        /* Form */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .login-field {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .login-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--surface-muted-foreground);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .login-input-wrap {
          display: flex;
          align-items: center;
          border-radius: 0.75rem;
          border: 1.5px solid var(--surface-border);
          background: var(--surface);
          transition: border-color 0.2s, box-shadow 0.2s;
          overflow: hidden;
        }
        .login-input-wrap:focus-within {
          border-color: var(--brand);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--brand) 15%, transparent);
        }
        .login-input-icon {
          padding-left: 0.85rem;
          font-size: 20px;
          color: var(--surface-muted-foreground);
          pointer-events: none;
          user-select: none;
        }
        .login-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 0.75rem 0.85rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--surface-foreground);
          outline: none;
          font-family: var(--font-sans);
        }
        .login-input::placeholder {
          color: var(--surface-muted-foreground);
          opacity: 0.6;
          font-weight: 500;
        }

        /* Submit */
        .login-submit {
          margin-top: 0.5rem;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: none;
          border-radius: 0.75rem;
          padding: 0.85rem;
          font-size: 0.9rem;
          font-weight: 700;
          font-family: var(--font-sans);
          color: #fff;
          cursor: pointer;
          background: linear-gradient(135deg, var(--brand-hover), var(--brand));
          box-shadow: 0 4px 20px rgba(163, 57, 0, 0.25);
          transition: transform 0.15s, opacity 0.15s, box-shadow 0.15s;
        }
        .login-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(163, 57, 0, 0.35);
        }
        .login-submit:active:not(:disabled) {
          transform: scale(0.97);
        }
        .login-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        /* Spinner */
        .login-spinner {
          width: 20px; height: 20px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Toggle */
        .login-toggle {
          text-align: center;
          margin-top: 1.25rem;
          font-size: 0.8rem;
          color: var(--surface-muted-foreground);
        }
        .login-toggle__btn {
          background: none;
          border: none;
          color: var(--brand);
          font-weight: 700;
          cursor: pointer;
          font-family: var(--font-sans);
          font-size: 0.8rem;
          transition: color 0.15s;
        }
        .login-toggle__btn:hover {
          color: var(--brand-hover);
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
