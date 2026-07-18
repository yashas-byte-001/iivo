import React from 'react';
import { supabase } from '../lib/supabase';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DUPLICATE_EMAIL_MESSAGES = [
  'duplicate',
  'already exists',
  'unique constraint',
  '23505',
];

function isDuplicateEmailError(error) {
  if (!error) {
    return false;
  }

  const haystack = `${error.code ?? ''} ${error.message ?? ''} ${error.details ?? ''}`.toLowerCase();
  return DUPLICATE_EMAIL_MESSAGES.some((token) => haystack.includes(token));
}

export function useWaitlist() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);

  const joinWaitlist = React.useCallback(async ({ name = '', email = '', interest = 'Just Curious' } = {}) => {
    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedInterest = interest.trim() || 'Just Curious';

    setError('');
    setSuccess(false);

    if (!normalizedEmail) {
      setError('Email is required.');
      return false;
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (!supabase) {
      setError('Something went wrong. Please try again.');
      return false;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase.from('waitlist').insert([
        {
          name: trimmedName || null,
          email: normalizedEmail,
          interest: trimmedInterest,
        },
      ]);

      if (insertError) {
        if (isDuplicateEmailError(insertError)) {
          setError("You're already on the waitlist 🎉");
          return false;
        }

        setError('Something went wrong. Please try again.');
        return false;
      }

      setSuccess(true);
      return true;
    } catch {
      setError('Something went wrong. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { joinWaitlist, loading, error, success };
}
