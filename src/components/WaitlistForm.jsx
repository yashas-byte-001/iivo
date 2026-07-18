import React from 'react';
import { ArrowRight, ChevronDown, LogOut, Mail, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useWaitlist } from '../hooks/useWaitlist';

const INITIAL_AUTH_MODE = 'signin';
const ROLE_OPTIONS = ['Student', 'Teacher', 'Institution', 'Other'];

function AuthModeToggle({ authMode, setAuthMode }) {
  return (
    <div className="waitlist-auth-toggle" role="tablist" aria-label="Authentication mode">
      <button type="button" className={authMode === 'signin' ? 'is-active' : ''} onClick={() => setAuthMode('signin')}>
        Login
      </button>
      <button type="button" className={authMode === 'signup' ? 'is-active' : ''} onClick={() => setAuthMode('signup')}>
        Sign up
      </button>
    </div>
  );
}

function AuthForm({ onGoogle, onPasswordSubmit, authMode, loading, authError }) {
  const [values, setValues] = React.useState({ name: '', email: '', password: '' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onPasswordSubmit(values);
  };

  return (
    <form className="waitlist-auth-form" onSubmit={handleSubmit}>
      {authMode === 'signup' ? (
        <label className="waitlist-field">
          <span>Full name</span>
          <input type="text" name="name" value={values.name} onChange={handleChange} autoComplete="name" placeholder="Your name" disabled={loading} />
        </label>
      ) : null}

      <label className="waitlist-field">
        <span>Email</span>
        <input type="email" name="email" value={values.email} onChange={handleChange} autoComplete="email" placeholder="you@example.com" required disabled={loading} />
      </label>

      <label className="waitlist-field">
        <span>Password</span>
        <input type="password" name="password" value={values.password} onChange={handleChange} autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} placeholder="••••••••" required minLength={6} disabled={loading} />
      </label>

      <div className="waitlist-auth-actions">
        <button type="submit" className="primary-button waitlist-submit" disabled={loading}>
          <span>{authMode === 'signup' ? 'Create account' : 'Login'}</span>
          <ArrowRight size={16} />
        </button>

        <button type="button" className="secondary-button waitlist-google" onClick={onGoogle} disabled={loading}>
          Continue with Google
        </button>
      </div>

      {authError ? <p className="waitlist-status is-error">{authError}</p> : null}
    </form>
  );
}

function RoleDropdown({ value, onChange, disabled }) {
  const dropdownRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handlePointerDown = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return (
    <div className="waitlist-field waitlist-dropdown-field" ref={dropdownRef}>
      <span>Role</span>
      <button
        type="button"
        className="waitlist-dropdown-trigger"
        onClick={() => setOpen((current) => !current)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Role, current option ${value}`}
      >
        <span>{value}</span>
        <ChevronDown size={18} />
      </button>

      {open ? (
        <div className="waitlist-dropdown-menu glass-panel" role="listbox" aria-label="Role options">
          {ROLE_OPTIONS.map((option) => {
            const isSelected = value === option;
            return (
              <button
                key={option}
                type="button"
                className={`waitlist-dropdown-option ${isSelected ? 'is-selected' : ''}`}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                role="option"
                aria-selected={isSelected}
                disabled={disabled}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function WaitlistForm({ className = '' }) {
  const { session, user, loading: authLoading, error: authError, signInWithGoogle, signUpWithPassword, signInWithPassword, signOut } = useAuth();
  const { joinWaitlist, checkWaitlistStatus, loading, error, success, existingEntry, setExistingEntry, setError, setSuccess } = useWaitlist();
  const [authMode, setAuthMode] = React.useState(INITIAL_AUTH_MODE);
  const [profileValues, setProfileValues] = React.useState({ fullName: '', college: '', course: '', role: 'Student' });
  const [checking, setChecking] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setChecking(true);
      checkWaitlistStatus({ user }).finally(() => setChecking(false));
      return;
    }

    setExistingEntry(null);
    setSuccess(false);
    setError('');
    setProfileValues({ fullName: '', college: '', course: '', role: 'Student' });
  }, [user, checkWaitlistStatus, setExistingEntry, setError, setSuccess]);

  React.useEffect(() => {
    if (!session) {
      return;
    }

    document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [session]);

  const handlePasswordSubmit = async ({ name = '', email = '', password = '' }) => {
    if (authMode === 'signup') {
      const created = await signUpWithPassword({ email, password, name });
      if (created) {
        setAuthMode('signin');
      }
      return;
    }

    await signInWithPassword({ email, password });
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfileValues((current) => ({ ...current, [name]: value }));
  };

  const handleRoleChange = (nextRole) => {
    setProfileValues((current) => ({ ...current, role: nextRole }));
  };

  const handleJoinSubmit = async (event) => {
    event.preventDefault();
    await joinWaitlist({
      user,
      fullName: profileValues.fullName,
      college: profileValues.college,
      course: profileValues.course,
      interest: profileValues.role,
    });
  };

  const showJoined = Boolean(existingEntry) || success;
  const isBusy = authLoading || loading || checking;

  return (
    <div className={`waitlist-form glass-panel ${className}`}>
      <div className="waitlist-form-head">
        <p className="section-kicker mb-0">Join the waitlist</p>
        <p className="waitlist-form-copy">Sign in first, then we’ll keep the waitlist details minimal and tied to your account.</p>
      </div>

      {!session ? (
        <div className="waitlist-auth-shell">
          <button type="button" className="waitlist-google-hero primary-button" onClick={signInWithGoogle} disabled={isBusy}>
            <Sparkles size={16} />
            <span>Continue with Google</span>
          </button>

          <div className="waitlist-auth-divider"><span>or</span></div>

          <AuthModeToggle authMode={authMode} setAuthMode={setAuthMode} />
          <AuthForm onGoogle={signInWithGoogle} onPasswordSubmit={handlePasswordSubmit} authMode={authMode} loading={isBusy} authError={authError || error} />
        </div>
      ) : showJoined ? (
        <div className="waitlist-confirmation">
          <div className="waitlist-confirmation-badge">
            <Shield size={18} />
            <span>Waitlist confirmed</span>
          </div>
          <h3>You're already on the IIVO waitlist.</h3>
          <p>Signed in as {user.email}. We’ll keep your spot associated with this account.</p>
          <button type="button" className="secondary-button waitlist-signout" onClick={signOut} disabled={isBusy}>
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      ) : (
        <form className="waitlist-profile-form" onSubmit={handleJoinSubmit}>
          <div className="waitlist-profile-note">
            <Mail size={16} />
            <span>Email will be pulled automatically from your account: {user.email}</span>
          </div>

          <div className="waitlist-grid">
            <label className="waitlist-field">
              <span>Full Name</span>
              <input type="text" name="fullName" value={profileValues.fullName} onChange={handleProfileChange} placeholder="Your full name" autoComplete="name" required disabled={isBusy} />
            </label>

            <label className="waitlist-field">
              <span>College</span>
              <input type="text" name="college" value={profileValues.college} onChange={handleProfileChange} placeholder="Your college" autoComplete="organization" required disabled={isBusy} />
            </label>
          </div>

          <RoleDropdown value={profileValues.role} onChange={handleRoleChange} disabled={isBusy} />

          <label className="waitlist-field">
            <span>Course</span>
            <input type="text" name="course" value={profileValues.course} onChange={handleProfileChange} placeholder="Your course" autoComplete="off" required disabled={isBusy} />
          </label>

          <div className="waitlist-actions">
            <button type="submit" className="primary-button waitlist-submit" disabled={isBusy}>
              {loading ? <><span className="waitlist-spinner" aria-hidden="true" />Submitting</> : <><span>Join the waitlist</span><ArrowRight size={16} /></>}
            </button>

            <button type="button" className="secondary-button waitlist-signout" onClick={signOut} disabled={isBusy}>
              <LogOut size={16} />
              <span>Sign out</span>
            </button>
          </div>

          <p className={`waitlist-status ${error ? 'is-error' : success ? 'is-success' : ''}`} aria-live="polite">
            {error || (success ? 'Welcome! You’re officially on the waitlist.' : '')}
          </p>
        </form>
      )}
    </div>
  );
}