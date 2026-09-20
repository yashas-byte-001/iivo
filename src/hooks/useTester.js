import React from 'react';
import { supabase } from '../lib/supabase';

/*
 * Tester programme sign-ups. Rows live in the Supabase `waitlist` table —
 * the same table and columns the old waitlist used — so nothing had to be
 * migrated when the programme changed its name.
 */
const TABLE = 'waitlist';
const COLUMNS = 'id,user_id,email,full_name,college,course,interest,created_at';
const DUPLICATE_MESSAGES = ['duplicate', 'already exists', 'unique constraint', '23505'];

function isDuplicateError(error) {
  if (!error) return false;
  const haystack = `${error.code ?? ''} ${error.message ?? ''} ${error.details ?? ''}`.toLowerCase();
  return DUPLICATE_MESSAGES.some((token) => haystack.includes(token));
}

export function useTester() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [entry, setEntry] = React.useState(null);

  const findEntry = React.useCallback(async ({ userId, email }) => {
    if (!supabase) return null;

    if (userId) {
      const { data, error: lookupError } = await supabase.from(TABLE).select(COLUMNS).limit(1).eq('user_id', userId);
      if (lookupError) throw lookupError;
      if (data?.[0]) return data[0];
    }
    if (email) {
      const { data, error: lookupError } = await supabase.from(TABLE).select(COLUMNS).limit(1).eq('email', email);
      if (lookupError) throw lookupError;
      return data?.[0] ?? null;
    }
    return null;
  }, []);

  const checkStatus = React.useCallback(
    async ({ user }) => {
      if (!user) {
        setEntry(null);
        return null;
      }
      setLoading(true);
      setError('');
      try {
        const found = await findEntry({ userId: user.id, email: user.email?.toLowerCase() ?? '' });
        setEntry(found);
        return found;
      } catch {
        setError('Something went wrong while checking your status.');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [findEntry],
  );

  const join = React.useCallback(
    async ({ user, fullName = '', college = '', course = '', role = 'Student' } = {}) => {
      if (!supabase) {
        setError('Sign-up is not configured.');
        return false;
      }
      if (!user?.id || !user?.email) {
        setError('Please sign in before joining.');
        return false;
      }

      const values = {
        full_name: fullName.trim(),
        college: college.trim(),
        course: course.trim(),
        interest: role.trim() || 'Student',
      };

      if (!values.full_name || !values.college || !values.course) {
        setError('Please complete all the fields.');
        return false;
      }

      setLoading(true);
      setError('');
      setSuccess(false);

      const email = user.email.toLowerCase();

      try {
        const existing = entry ?? (await findEntry({ userId: user.id, email }));
        if (existing) {
          setEntry(existing);
          setError('You are already in the tester programme.');
          return false;
        }

        const { error: insertError } = await supabase.from(TABLE).insert([{ user_id: user.id, email, ...values }]);

        if (insertError) {
          if (isDuplicateError(insertError)) {
            setEntry(await findEntry({ userId: user.id, email }));
            setError('You are already in the tester programme.');
            return false;
          }
          setError('Something went wrong. Please try again.');
          return false;
        }

        setSuccess(true);
        setEntry(await findEntry({ userId: user.id, email }));
        return true;
      } catch {
        setError('Something went wrong. Please try again.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [entry, findEntry],
  );

  return { join, checkStatus, loading, error, success, entry, setEntry, setError };
}
