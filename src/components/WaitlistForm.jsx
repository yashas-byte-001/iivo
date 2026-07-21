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

function AuthForm({ onGoogle, onPasswordSubmit, authMode, loading, authError, values, onChange }) {
  return (
    <form className="waitlist-auth-form" onSubmit={(e) => { e.preventDefault(); onPasswordSubmit(values); }}>
      {authMode === 'signup' ? (
        <label className="waitlist-field">
          <span>Full name</span>
          <input type="text" name="name" value={values.name} onChange={onChange} autoComplete="name" placeholder="Your name" disabled={loading} />
        </label>
      ) : null}

      <label className="waitlist-field">
        <span>Email</span>
        <input type="email" name="email" value={values.email} onChange={onChange} autoComplete="email" placeholder="you@example.com" required disabled={loading} />
      </label>

      <label className="waitlist-field">
        <span>Password</span>
        <input type="password" name="password" value={values.password} onChange={onChange} autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} placeholder="••••••••" required minLength={6} disabled={loading} />
      </label>

      <div className="waitlist-auth-actions">
        <button type="submit" className="primary-button waitlist-submit" disabled={loading}>
          <span>{authMode === 'signup' ? 'Create Account' : 'Sign In'}</span>
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

export function WaitlistForm({ className = '', mode = 'full' }) {
  const { session, user, loading: authLoading, error: authError, signInWithGoogle, signUpWithPassword, signInWithPassword, signOut } = useAuth();
  const { joinWaitlist, checkWaitlistStatus, loading, error, success, existingEntry, setExistingEntry, setError, setSuccess } = useWaitlist();
  const [view, setView] = React.useState('initial'); // 'initial' | 'email'
  const [emailValues, setEmailValues] = React.useState({ email: '', password: '' });
  const [localAuthError, setLocalAuthError] = React.useState('');
  const [authMode, setAuthMode] = React.useState(INITIAL_AUTH_MODE);
  const [profileValues, setProfileValues] = React.useState({ fullName: '', college: '', course: '', role: 'Student' });
  const [checking, setChecking] = React.useState(false);
  const hasJoined = Boolean(existingEntry) || success;
  const showAuth = mode !== 'collect';
  const showCollection = mode !== 'auth';

  React.useEffect(() => {
    if (user) {
      setChecking(true);
      checkWaitlistStatus().finally(() => setChecking(false));
      // Once authenticated, move out of the email entry view into the waitlist/confirmation flow
      setView('initial');
      return;
    }

    setExistingEntry(null);
    setSuccess(false);
    setError('');
    setProfileValues({ fullName: '', college: '', course: '', role: 'Student' });
  }, [user, checkWaitlistStatus, setExistingEntry, setError, setSuccess]);

  React.useEffect(() => {
    if (!session || !showCollection) {
      return;
    }

    const el = document.getElementById('waitlist') || document.querySelector('.waitlist-form');
    if (!el) return;

    // Account for any fixed header by measuring its height, then scroll so
    // the waitlist form is centered in the viewport on all screen sizes.
    const header = document.querySelector('header') || document.querySelector('.site-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const rect = el.getBoundingClientRect();
    const top = window.scrollY + rect.top - headerHeight - Math.max((window.innerHeight - rect.height) / 2, 16);

    window.scrollTo({ top: Math.max(0, Math.round(top)), behavior: 'smooth' });

    // After scrolling, focus the first interactive input inside the waitlist
    // so users on mobile/desktop can start typing immediately.
    setTimeout(() => {
      const first = el.querySelector('input, textarea, select, button');
      first?.focus?.();
    }, 450);
  }, [session, showCollection]);

  React.useEffect(() => {
    if (!session || !hasJoined || !showCollection) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      window.location.assign(new URL('index.html', window.location.href).toString());
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [hasJoined, session, showCollection]);

  const handlePasswordSubmit = async ({ name = '', email = '', password = '' }) => {
    if (authMode === 'signup') {
      const created = await signUpWithPassword({ email, password, name });
      if (!created) {
        return;
      }

      // attempt immediate sign-in after account creation
      await signInWithPassword({ email, password });
      return;
    }

    await signInWithPassword({ email, password });
  };

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailValues((c) => ({ ...c, [name]: value }));
    setLocalAuthError('');
    setError('');
  };

  const handleCreateAccount = async () => {
    setLocalAuthError('');
    setError('');
    const created = await signUpWithPassword({ email: emailValues.email, password: emailValues.password, name: emailValues.name || '' });
    if (!created) {
      setLocalAuthError(authError || 'Unable to create account.');
      return;
    }

    // Attempt to sign in immediately after creating the account
    await signInWithPassword({ email: emailValues.email, password: emailValues.password });
  };

  const handleSignIn = async () => {
    setLocalAuthError('');
    setError('');
    const signedIn = await signInWithPassword({ email: emailValues.email, password: emailValues.password });
    if (!signedIn) {
      setLocalAuthError(authError || 'Unable to sign in.');
    }
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

  const showJoined = hasJoined;
  const isBusy = authLoading || loading || checking;

  return (
    <div className={`waitlist-form glass-panel ${className}`}>
      <div className="waitlist-form-head">
        <p className="section-kicker mb-0">Join the waitlist</p>
        <p className="waitlist-form-copy">Sign in first, then we’ll keep the waitlist details minimal and tied to your account.</p>
      </div>

      {showAuth && !session ? (
        <div className={`waitlist-auth-shell auth-view auth-view-${view}`}>
          {view === 'initial' ? (
            <div className="auth-initial">
              <button type="button" className="waitlist-google-hero primary-button" onClick={signInWithGoogle} disabled={isBusy}>
                <Sparkles size={16} />
                <span>Continue with Google</span>
              </button>

              <div className="waitlist-auth-divider"><span>or</span></div>

              <button type="button" className="secondary-button waitlist-email-cta" onClick={() => { setView('email'); setAuthMode(INITIAL_AUTH_MODE); }} disabled={isBusy}>
                Continue with Email
              </button>
            </div>
          ) : (
            <div className="auth-email">
              <div className="email-form-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <AuthModeToggle authMode={authMode} setAuthMode={setAuthMode} />
                </div>
                <div>
                  <button type="button" className="secondary-button" onClick={() => setView('initial')} disabled={isBusy}>
                    Back
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 8 }}>
                <label className="waitlist-field">
                  <span>Email</span>
                  <input type="email" name="email" value={emailValues.email} onChange={handleEmailChange} autoComplete="email" placeholder="you@example.com" required disabled={isBusy} />
                </label>

                {authMode === 'signup' ? (
                  <label className="waitlist-field">
                    <span>Full name</span>
                    <input type="text" name="name" value={emailValues.name || ''} onChange={handleEmailChange} autoComplete="name" placeholder="Your name" disabled={isBusy} />
                  </label>
                ) : null}

                <label className="waitlist-field">
                  <span>Password</span>
                  <input type="password" name="password" value={emailValues.password} onChange={handleEmailChange} autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'} placeholder="••••••••" required minLength={6} disabled={isBusy} />
                </label>

                <div className="waitlist-auth-actions email-actions">
                  <button type="button" className="primary-button waitlist-submit" onClick={authMode === 'signup' ? handleCreateAccount : handleSignIn} disabled={isBusy}>
                    <span>{authMode === 'signup' ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight size={16} />
                  </button>

                  <button type="button" className="secondary-button" onClick={() => signInWithGoogle()} disabled={isBusy}>
                    Continue with Google
                  </button>
                </div>

                {(authError || localAuthError || error) ? <p className="waitlist-status is-error">{authError || localAuthError || error}</p> : null}
              </div>
            </div>
          )}
        </div>
      ) : showCollection && showJoined ? (
        <div className="waitlist-confirmation">
          <div className="waitlist-confirmation-badge">
            <Shield size={18} />
            <span>Waitlist confirmed</span>
          </div>
          <h3>🎉 You're already on the IIVO waitlist.</h3>
          <p>Signed in as {user.email}. We’ll keep your spot associated with this account.</p>
          <p>We'll email you when early access becomes available.</p>
          <button type="button" className="secondary-button waitlist-signout" onClick={signOut} disabled={isBusy}>
            <LogOut size={16} />
            <span>Sign out</span>
          </button>
        </div>
      ) : showCollection ? (
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
            {error || (success ? 'Welcome! You’re officially on the waitlist. Redirecting home in 5 seconds.' : '')}
          </p>
        </form>
      ) : null}
    </div>
  );
}