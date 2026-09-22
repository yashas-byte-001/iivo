import React from 'react';
import { supabase } from '../lib/supabase';
import { TESTER_URL } from '../config/links';

/*
 * Supabase auth for the tester programme. This is the only place on iivo.org
 * where anyone signs in, and it is for the programme, not the product:
 * OptiStudy accounts live inside the app.
 */
export function useAuth() {
  const [session, setSession] = React.useState(null);
  const [loading, setLoading] = React.useState(Boolean(supabase));
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!supabase) {
      setLoading(false);
      setError('Sign-in is not configured.');
      return undefined;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!mounted) return;
      if (sessionError) setError(sessionError.message);
      setSession(data.session ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
      setLoading(false);
      setError('');
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  function mapAuthError(err) {
    if (!err) return '';
    const msg = (err.message || '').toLowerCase();

    if (msg.includes('already registered') || msg.includes('user already exists')) {
      if (msg.includes('google') || msg.includes('oauth') || msg.includes('provider')) {
        return 'This email is already registered with Google. Please continue with Google.';
      }
      return 'An account with this email already exists. Please sign in instead.';
    }

    if (msg.includes('invalid login credentials') || msg.includes('invalid email or password')) {
      return 'Incorrect email or password.';
    }

    return err.message ?? String(err);
  }

  /* Google sends the visitor back to the tester page, never the home page,
     so they land on the form they were filling in. */
  const redirectTo = () => new URL(TESTER_URL, window.location.origin).toString();

  const signInWithGoogle = React.useCallback(async () => {
    if (!supabase) {
      setError('Sign-in is not configured.');
      return false;
    }
    setError('');
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectTo() },
    });
    if (authError) {
      setError(mapAuthError(authError));
      return false;
    }
    return true;
  }, []);

  const signUpWithPassword = React.useCallback(async ({ email, password, name = '' }) => {
    if (!supabase) {
      setError('Sign-in is not configured.');
      return false;
    }
    setError('');
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name.trim() } },
    });
    if (authError) {
      setError(mapAuthError(authError));
      return false;
    }
    /* When the project asks for email confirmation, sign-up returns a user but
       no session. Signing in straight away would fail with "Email not
       confirmed", so say what is actually waiting for them. */
    if (!data?.session) {
      setError('Check your email to confirm your account, then sign in.');
      return 'confirm';
    }
    return true;
  }, []);

  const signInWithPassword = React.useCallback(async ({ email, password }) => {
    if (!supabase) {
      setError('Sign-in is not configured.');
      return false;
    }
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(mapAuthError(authError));
      return false;
    }
    return true;
  }, []);

  const resetPassword = React.useCallback(async ({ email } = {}) => {
    if (!supabase) {
      setError('Sign-in is not configured.');
      return false;
    }
    if (!email) {
      setError('Enter your email first, then choose "Forgot password".');
      return false;
    }
    setError('');
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectTo() });
    if (resetError) {
      setError(mapAuthError(resetError));
      return false;
    }
    setError('If that account exists, a reset email is on its way.');
    return true;
  }, []);

  const signOut = React.useCallback(async () => {
    if (!supabase) return false;
    setError('');
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
      return false;
    }
    return true;
  }, []);

  return {
    session,
    user: session?.user ?? null,
    loading,
    error,
    setError,
    signInWithGoogle,
    signUpWithPassword,
    signInWithPassword,
    resetPassword,
    signOut,
  };
}
