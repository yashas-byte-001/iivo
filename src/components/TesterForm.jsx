import React from 'react';
import { ArrowRight, CircleCheck, LogOut, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTester } from '../hooks/useTester';

const ROLE_OPTIONS = ['Student', 'Teacher', 'Institution', 'Other'];

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 8-2.9l-3.9-3c-1.1.7-2.5 1.2-4.1 1.2-3.1 0-5.8-2.1-6.7-5H1.2v3.1C3.2 21.3 7.3 24 12 24z" />
      <path fill="#FBBC05" d="M5.3 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.2C.4 8.2 0 10 0 12s.4 3.8 1.2 5.4l4.1-3.1z" />
      <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C18 1.2 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.6l4.1 3.1c.9-2.9 3.6-4.9 6.7-4.9z" />
    </svg>
  );
}

function Status({ error, success, children }) {
  if (!error && !success) return null;
  return (
    <p className={`form-status ${error ? 'is-error' : 'is-success'}`} role="status" aria-live="polite">
      {error || children}
    </p>
  );
}

/* Step one: sign in. Google first, email underneath. */
function AuthPanel({ auth, busy }) {
  const [mode, setMode] = React.useState('signin');
  const [values, setValues] = React.useState({ name: '', email: '', password: '' });

  const onChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    auth.setError('');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (mode === 'signup') {
      const created = await auth.signUpWithPassword(values);
      /* 'confirm' means the account exists but is waiting on the email link. */
      if (created !== true) return;
    }
    await auth.signInWithPassword(values);
  };

  return (
    <div className="tester-panel-body">
      <button type="button" className="secondary-button form-google" onClick={auth.signInWithGoogle} disabled={busy}>
        <GoogleGlyph />
        Continue with Google
      </button>

      <div className="form-divider">
        <span>or with email</span>
      </div>

      <div className="form-toggle" role="tablist" aria-label="Sign in or create an account">
        <button type="button" role="tab" aria-selected={mode === 'signin'} className={mode === 'signin' ? 'is-active' : ''} onClick={() => setMode('signin')}>
          Sign in
        </button>
        <button type="button" role="tab" aria-selected={mode === 'signup'} className={mode === 'signup' ? 'is-active' : ''} onClick={() => setMode('signup')}>
          Create account
        </button>
      </div>

      <form className="form-stack" onSubmit={onSubmit}>
        {mode === 'signup' ? (
          <label className="field">
            <span>Full name</span>
            <input type="text" name="name" value={values.name} onChange={onChange} autoComplete="name" placeholder="Your name" disabled={busy} />
          </label>
        ) : null}

        <label className="field">
          <span>Email</span>
          <input type="email" name="email" value={values.email} onChange={onChange} autoComplete="email" placeholder="you@example.com" required disabled={busy} />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            value={values.password}
            onChange={onChange}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            placeholder="At least 6 characters"
            required
            minLength={6}
            disabled={busy}
          />
        </label>

        <button type="submit" className="primary-button form-submit" disabled={busy}>
          <span>{mode === 'signup' ? 'Create account' : 'Sign in'}</span>
          <ArrowRight size={16} />
        </button>

        {mode === 'signin' ? (
          <button type="button" className="form-text-button" onClick={() => auth.resetPassword({ email: values.email })} disabled={busy}>
            Forgot password?
          </button>
        ) : null}

        <Status error={auth.error} />
      </form>
    </div>
  );
}

/* Step two: tell us about yourself. */
function ProfilePanel({ auth, tester, busy }) {
  const [values, setValues] = React.useState({
    fullName: auth.user?.user_metadata?.full_name ?? '',
    college: '',
    course: '',
    role: 'Student',
  });

  const onChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    tester.setError('');
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await tester.join({ user: auth.user, ...values });
  };

  return (
    <form className="tester-panel-body form-stack" onSubmit={onSubmit}>
      <p className="form-note">
        <Mail size={15} />
        <span>
          Signed in as <strong>{auth.user?.email}</strong>. We keep your place tied to this account.
        </span>
      </p>

      <div className="form-grid">
        <label className="field">
          <span>Full name</span>
          <input type="text" name="fullName" value={values.fullName} onChange={onChange} autoComplete="name" placeholder="Your full name" required disabled={busy} />
        </label>

        <label className="field">
          <span>I am a</span>
          <select name="role" value={values.role} onChange={onChange} disabled={busy}>
            {ROLE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        <span>College or school</span>
        <input type="text" name="college" value={values.college} onChange={onChange} autoComplete="organization" placeholder="Where you study or teach" required disabled={busy} />
      </label>

      <label className="field">
        <span>Course or subject</span>
        <input type="text" name="course" value={values.course} onChange={onChange} placeholder="What you are studying or teaching" required disabled={busy} />
      </label>

      <div className="form-actions">
        <button type="submit" className="primary-button form-submit" disabled={busy}>
          <span>{tester.loading ? 'Joining…' : 'Join the tester programme'}</span>
          <ArrowRight size={16} />
        </button>
        <button type="button" className="form-text-button" onClick={auth.signOut} disabled={busy}>
          <LogOut size={14} />
          Sign out
        </button>
      </div>

      <Status error={tester.error} />
    </form>
  );
}

/* Done. */
function JoinedPanel({ auth, tester, busy }) {
  const since = tester.entry?.created_at ? new Date(tester.entry.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' }) : null;

  return (
    <div className="tester-panel-body tester-joined">
      <span className="tester-joined-badge">
        <CircleCheck size={16} />
        You are in
      </span>
      <h3>Welcome to the tester programme{tester.entry?.full_name ? `, ${tester.entry.full_name.split(' ')[0]}` : ''}.</h3>
      <p>
        We will email <strong>{auth.user?.email}</strong> when there is something to test, and we read every reply.
        {since ? ` Joined ${since}.` : ''}
      </p>
      <button type="button" className="form-text-button" onClick={auth.signOut} disabled={busy}>
        <LogOut size={14} />
        Sign out
      </button>
    </div>
  );
}

function LoadingPanel({ label }) {
  return (
    <div className="tester-panel-body tester-loading" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

/*
 * The whole flow in one panel: sign in → details → confirmation. The step
 * rail at the top shows where the visitor is, so the panel never feels like
 * it jumped.
 */
export default function TesterForm() {
  const auth = useAuth();
  const tester = useTester();
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    if (!auth.user) {
      tester.setEntry(null);
      setChecked(false);
      return undefined;
    }
    let mounted = true;
    tester.checkStatus({ user: auth.user }).finally(() => {
      if (mounted) setChecked(true);
    });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user?.id]);

  const busy = auth.loading || tester.loading;
  const joined = Boolean(tester.entry) || tester.success;
  const step = !auth.user ? 1 : joined ? 3 : 2;

  let body;
  if (auth.loading) body = <LoadingPanel label="Checking your account…" />;
  else if (!auth.user) body = <AuthPanel auth={auth} busy={busy} />;
  else if (!checked) body = <LoadingPanel label="Looking up your tester status…" />;
  else if (joined) body = <JoinedPanel auth={auth} tester={tester} busy={busy} />;
  else body = <ProfilePanel auth={auth} tester={tester} busy={busy} />;

  return (
    <div className="tester-panel">
      <ol className="tester-rail" aria-label="Progress">
        {['Sign in', 'About you', 'Done'].map((label, index) => {
          const number = index + 1;
          const state = number < step ? 'is-done' : number === step ? 'is-current' : '';
          return (
            <li key={label} className={state} aria-current={number === step ? 'step' : undefined}>
              <span className="tester-rail-dot">{number < step ? <ShieldCheck size={12} /> : number}</span>
              {label}
            </li>
          );
        })}
      </ol>
      {body}
    </div>
  );
}
