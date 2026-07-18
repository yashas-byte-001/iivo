import React from 'react';
import { supabase } from '../lib/supabase';

export function useAuth() {
  const [session, setSession] = React.useState(null);
  const [loading, setLoading] = React.useState(Boolean(supabase));
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!supabase) {
      setLoading(false);
      setError('Authentication is not configured.');
      return undefined;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!mounted) {
        return;
      }

      if (sessionError) {
        setError(sessionError.message);
      }

      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!mounted) {
        return;
      }

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

    if (msg.includes('user already registered') || msg.includes('already registered') || msg.includes('user already exists')) {
      // If the error mentions an external provider or oauth, suggest the provider path
      if (msg.includes('google') || msg.includes('oauth') || msg.includes('provider') || msg.includes('social')) {
        return 'This email is already registered using Google. Please continue with Google.';
      }

      return 'An account with this email already exists. Please sign in instead.';
    }

    if (msg.includes('invalid login credentials') || (msg.includes('invalid') && msg.includes('credentials')) || msg.includes('invalid email or password')) {
      return 'Incorrect email or password.';
    }

    return err.message ?? String(err);
  }

  const signInWithGoogle = React.useCallback(async () => {
    if (!supabase) {
      setError('Authentication is not configured.');
      return false;
    }

    setError('');

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/#waitlist`,
      },
    });

    if (authError) {
      setError(mapAuthError(authError));
      return false;
    }

    return true;
  }, []);

  const signUpWithPassword = React.useCallback(async ({ email, password, name = '' }) => {
    if (!supabase) {
      setError('Authentication is not configured.');
      return false;
    }

    setError('');

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name.trim(),
        },
      },
    });

    if (authError) {
      setError(mapAuthError(authError));
      return false;
    }

    return true;
  }, []);

  const signInWithPassword = React.useCallback(async ({ email, password }) => {
    if (!supabase) {
      setError('Authentication is not configured.');
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
      setError('Authentication is not configured.');
      return false;
    }

    if (!email) {
      setError('Please enter your email to reset your password.');
      return false;
    }

    setError('');

    // Use Supabase password reset API; include redirect back to waitlist anchor
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/#waitlist`,
    });

    if (resetError) {
      setError(mapAuthError(resetError));
      return false;
    }

    setError('A password reset email has been sent if that account exists. Check your inbox.');
    return true;
  }, []);

  const signOut = React.useCallback(async () => {
    if (!supabase) {
      setError('Authentication is not configured.');
      return false;
    }

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