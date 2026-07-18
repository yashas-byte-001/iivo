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
      setError(authError.message);
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
      setError(authError.message);
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
      setError(authError.message);
      return false;
    }

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
    signOut,
  };
}