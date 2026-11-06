import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Sparkles,
  Lock,
  Mail,
  User,
  GraduationCap,
  Building,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { DEMO_ACCOUNT } from '../utils/storage';

/**
 * Authentication Page: Login, Account Registration, and Instant Demo Access.
 * Demonstrates React Controlled Forms, Tab States, Validation, and Authentication Flow.
 */
export default function Auth({
  initialMode = 'login', // 'login' | 'register'
  onLoginSuccess,
  onRegisterSuccess,
  onDemoLogin,
  onBackToHome
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regEducation, setRegEducation] = useState('B.Tech in Computer Science & Engineering');
  const [regInstitution, setRegInstitution] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [preloadStarter, setPreloadStarter] = useState(true);
  const [regErrors, setRegErrors] = useState({});

  // Auto-fill demo credentials in the login form for testing
  const handleAutoFillDemo = () => {
    setLoginEmail(DEMO_ACCOUNT.email);
    setLoginPassword(DEMO_ACCOUNT.password);
    setLoginError('');
  };

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Please enter your email address.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Please enter your password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await onLoginSuccess(loginEmail, loginPassword);
      if (result && !result.success) {
        setLoginError(result.message || 'Login failed.');
      }
    } catch (err) {
      setLoginError(err.message || 'Authentication error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate Register Form
  const validateRegister = () => {
    const errs = {};
    if (!regName.trim()) errs.name = 'Full name is required.';
    if (!regEmail.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      errs.email = 'Please provide a valid email format.';
    }
    if (!regPassword) {
      errs.password = 'Password is required.';
    } else if (regPassword.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }
    if (regPassword !== regConfirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    return errs;
  };

  // Submit Register
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const valErrors = validateRegister();
    if (Object.keys(valErrors).length > 0) {
      setRegErrors(valErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await onRegisterSuccess({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        education: regEducation.trim(),
        institution: regInstitution.trim(),
        preloadStarter
      });

      if (result && !result.success) {
        setRegErrors({ general: result.message || 'Registration failed.' });
      }
    } catch (err) {
      setRegErrors({ general: err.message || 'Registration failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-cream)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 2.5rem',
          borderBottom: '1px solid var(--border-light)',
          background: 'rgba(250, 247, 242, 0.9)'
        }}
      >
        <div
          className="brand-badge"
          style={{ cursor: 'pointer' }}
          onClick={onBackToHome}
        >
          <div className="brand-logo-icon">
            <Compass size={18} />
          </div>
          <span>Skillora</span>
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={onBackToHome}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeft size={14} /> Back to Home
        </button>
      </header>

      {/* Main Container */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1rem'
        }}
      >
        <div style={{ maxWidth: '520px', width: '100%' }}>
          {/* Quick Demo Access Callout Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #ffffff, var(--lavender-100))',
              border: '1px solid var(--lavender-300)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.25rem 1.5rem',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, fontSize: '0.92rem', color: 'var(--lavender-800)' }}>
                <Zap size={16} color="#d99126" />
                <span>Instant Evaluation / Demo Login</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', maxWidth: '300px' }}>
                Explore immediately as <strong>Ananya Sharma</strong> with preloaded verified skills, tasks, and analytics.
              </p>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onDemoLogin}
              style={{ padding: '0.55rem 1rem', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
            >
              Continue as Demo Student <ArrowRight size={14} />
            </button>
          </div>

          {/* Main Card */}
          <div className="editorial-card" style={{ padding: '2.25rem 2rem' }}>
            {/* Title & Tabs */}
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div className="editorial-pill" style={{ marginBottom: '0.5rem', fontSize: '0.72rem' }}>
                <Sparkles size={12} />
                <span>Student Authentication</span>
              </div>
              <h2 className="font-editorial" style={{ fontSize: '1.85rem', color: 'var(--text-primary)' }}>
                {mode === 'login' ? 'Sign in to Skillora' : 'Create Student Account'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                {mode === 'login'
                  ? 'Access your personal skills, verified milestones, and portfolio.'
                  : 'Start tracking your learning consistency with your own customized dashboard.'}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.4rem',
                background: 'var(--bg-cream-alt)',
                padding: '0.35rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.75rem'
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setLoginError('');
                  setRegErrors({});
                }}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  transition: 'all 0.2s',
                  background: mode === 'login' ? '#ffffff' : 'transparent',
                  color: mode === 'login' ? 'var(--lavender-800)' : 'var(--text-muted)',
                  boxShadow: mode === 'login' ? 'var(--shadow-xs)' : 'none'
                }}
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setLoginError('');
                  setRegErrors({});
                }}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  transition: 'all 0.2s',
                  background: mode === 'register' ? '#ffffff' : 'transparent',
                  color: mode === 'register' ? 'var(--lavender-800)' : 'var(--text-muted)',
                  boxShadow: mode === 'register' ? 'var(--shadow-xs)' : 'none'
                }}
              >
                Create Account
              </button>
            </div>

            {/* ----------------- SIGN IN FORM ----------------- */}
            {mode === 'login' && (
              <form onSubmit={handleLoginSubmit}>
                {loginError && (
                  <div
                    style={{
                      background: 'var(--danger-bg)',
                      border: '1px solid var(--danger-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 1rem',
                      marginBottom: '1.25rem',
                      fontSize: '0.84rem',
                      color: 'var(--danger-text)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{loginError}</span>
                  </div>
                )}

                {/* Email Input */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <label className="form-label" htmlFor="login-email" style={{ margin: 0 }}>
                      Email Address
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoFillDemo}
                      style={{ fontSize: '0.75rem', color: 'var(--lavender-700)', fontWeight: 600, textDecoration: 'underline' }}
                    >
                      Fill Demo Credentials
                    </button>
                  </div>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '0.9rem', color: 'var(--text-muted)' }} />
                    <input
                      id="login-email"
                      type="email"
                      className="input-control"
                      placeholder="e.g. ananya.sharma@example.edu"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        if (loginError) setLoginError('');
                      }}
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="form-group">
                  <label className="form-label" htmlFor="login-password">
                    Password
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '0.9rem', color: 'var(--text-muted)' }} />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      className="input-control"
                      placeholder="Enter password (demo: demo123)"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (loginError) setLoginError('');
                      }}
                      style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontSize: '0.95rem', opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? 'Signing In...' : 'Sign In to Workspace'} {!isSubmitting && <ArrowRight size={16} />}
                </button>

                {/* Switch to Register */}
                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setLoginError('');
                    }}
                    style={{ color: 'var(--lavender-700)', fontWeight: 700, textDecoration: 'underline' }}
                  >
                    Create Account
                  </button>
                </div>
              </form>
            )}

            {/* ----------------- CREATE ACCOUNT FORM ----------------- */}
            {mode === 'register' && (
              <form onSubmit={handleRegisterSubmit}>
                {regErrors.general && (
                  <div
                    style={{
                      background: 'var(--danger-bg)',
                      border: '1px solid var(--danger-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 1rem',
                      marginBottom: '1.25rem',
                      fontSize: '0.84rem',
                      color: 'var(--danger-text)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{regErrors.general}</span>
                  </div>
                )}

                {/* Full Name */}
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-name">
                    Full Name *
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <User size={16} style={{ position: 'absolute', left: '0.9rem', color: 'var(--text-muted)' }} />
                    <input
                      id="reg-name"
                      type="text"
                      className="input-control"
                      placeholder="e.g. Rahul Verma"
                      value={regName}
                      onChange={(e) => {
                        setRegName(e.target.value);
                        if (regErrors.name) setRegErrors({ ...regErrors, name: null });
                      }}
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                  {regErrors.name && <div className="form-error">{regErrors.name}</div>}
                </div>

                {/* Email Address */}
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-email">
                    Email Address *
                  </label>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '0.9rem', color: 'var(--text-muted)' }} />
                    <input
                      id="reg-email"
                      type="email"
                      className="input-control"
                      placeholder="e.g. rahul.verma@example.edu"
                      value={regEmail}
                      onChange={(e) => {
                        setRegEmail(e.target.value);
                        if (regErrors.email) setRegErrors({ ...regErrors, email: null });
                      }}
                      style={{ paddingLeft: '2.5rem' }}
                    />
                  </div>
                  {regErrors.email && <div className="form-error">{regErrors.email}</div>}
                </div>

                {/* Degree / Education */}
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-education">
                      Program / Degree
                    </label>
                    <input
                      id="reg-education"
                      type="text"
                      className="input-control"
                      placeholder="e.g. B.Tech Computer Science"
                      value={regEducation}
                      onChange={(e) => setRegEducation(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-institution">
                      Institution / College
                    </label>
                    <input
                      id="reg-institution"
                      type="text"
                      className="input-control"
                      placeholder="e.g. NIT Trichy"
                      value={regInstitution}
                      onChange={(e) => setRegInstitution(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password & Confirm */}
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-password">
                      Password *
                    </label>
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      className="input-control"
                      placeholder="Min 6 characters"
                      value={regPassword}
                      onChange={(e) => {
                        setRegPassword(e.target.value);
                        if (regErrors.password) setRegErrors({ ...regErrors, password: null });
                      }}
                    />
                    {regErrors.password && <div className="form-error">{regErrors.password}</div>}
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-confirm">
                      Confirm Password *
                    </label>
                    <input
                      id="reg-confirm"
                      type={showPassword ? 'text' : 'password'}
                      className="input-control"
                      placeholder="Re-type password"
                      value={regConfirmPassword}
                      onChange={(e) => {
                        setRegConfirmPassword(e.target.value);
                        if (regErrors.confirmPassword) setRegErrors({ ...regErrors, confirmPassword: null });
                      }}
                    />
                    {regErrors.confirmPassword && <div className="form-error">{regErrors.confirmPassword}</div>}
                  </div>
                </div>

                {/* Preload starter template checkbox */}
                <div style={{ marginBottom: '1.25rem', background: 'var(--bg-cream-alt)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', cursor: 'pointer', fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                    <input
                      type="checkbox"
                      checked={preloadStarter}
                      onChange={(e) => setPreloadStarter(e.target.checked)}
                      style={{ marginTop: '2px', accentColor: 'var(--lavender-600)' }}
                    />
                    <span>
                      <strong>Preload starter skills & milestones:</strong> Adds starter programming and web development skills with sample tasks so your dashboard is immediately active.
                    </span>
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                  style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem', opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account & Enter Workspace'} {!isSubmitting && <ArrowRight size={16} />}
                </button>

                {/* Switch to Sign In */}
                <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setRegErrors({});
                    }}
                    style={{ color: 'var(--lavender-700)', fontWeight: 700, textDecoration: 'underline' }}
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

