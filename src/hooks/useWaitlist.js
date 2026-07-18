import React from 'react';
import { supabase } from '../lib/supabase';

const DUPLICATE_MESSAGES = ['duplicate', 'already exists', 'unique constraint', '23505'];

function isDuplicateError(error) {
  if (!error) {
    return false;
  }

  const haystack = `${error.code ?? ''} ${error.message ?? ''} ${error.details ?? ''}`.toLowerCase();
  return DUPLICATE_MESSAGES.some((token) => haystack.includes(token));
}

export function useWaitlist() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [existingEntry, setExistingEntry] = React.useState(null);

  const findWaitlistEntry = React.useCallback(async ({ userId, email }) => {
    if (!supabase) {
      return null;
    }

    const query = supabase.from('waitlist').select('id,user_id,email,full_name,college,course,interest,created_at').limit(1);

    if (userId) {
      const { data, error: lookupError } = await query.eq('user_id', userId);
      if (lookupError) {
        throw lookupError;
      }

      return data?.[0] ?? null;
    }

    if (email) {
      const { data, error: lookupError } = await query.eq('email', email);
      if (lookupError) {
        throw lookupError;
      }

      return data?.[0] ?? null;
    }

    return null;
  }, []);

  const checkWaitlistStatus = React.useCallback(async ({ user }) => {
    // If no explicit user provided, try to resolve the current auth user (auth.uid())
    let targetUser = user;
    if (!targetUser) {
      try {
        const { data } = await supabase.auth.getUser();
        targetUser = data?.user ?? null;
      } catch (_) {
        targetUser = null;
      }
    }

    if (!targetUser) {
      setExistingEntry(null);
      return null;
    }

    setLoading(true);
    setError('');

    try {
      const entry = await findWaitlistEntry({ userId: targetUser.id, email: targetUser.email?.toLowerCase() ?? '' });
      setExistingEntry(entry);
      return entry;
    } catch {
      setError('Something went wrong while checking your waitlist status.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [findWaitlistEntry]);

  const joinWaitlist = React.useCallback(async ({ user, fullName = '', college = '', course = '', interest = 'Student' } = {}) => {
    if (!supabase) {
      setError('Something went wrong. Please try again.');
      return false;
    }

    if (!user?.id || !user?.email) {
      setError('Please sign in before joining the waitlist.');
      return false;
    }

    const trimmedFullName = fullName.trim();
    const trimmedCollege = college.trim();
    const trimmedCourse = course.trim();
    const trimmedInterest = interest.trim() || 'Student';

    if (!trimmedFullName || !trimmedCollege || !trimmedCourse) {
      setError('Please complete all required fields.');
      return false;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const existing = existingEntry ?? (await findWaitlistEntry({ userId: user.id, email: user.email.toLowerCase() }));
      if (existing) {
        setExistingEntry(existing);
        setError("You're already on the IIVO waitlist.");
        return false;
      }

      const { error: insertError } = await supabase.from('waitlist').insert([
        {
          user_id: user.id,
          email: user.email.toLowerCase(),
          full_name: trimmedFullName,
          college: trimmedCollege,
          course: trimmedCourse,
          interest: trimmedInterest,
        },
      ]);

      if (insertError) {
        if (isDuplicateError(insertError)) {
          const entry = await findWaitlistEntry({ userId: user.id, email: user.email.toLowerCase() });
          setExistingEntry(entry);
          setError("You're already on the IIVO waitlist.");
          return false;
        }

        setError('Something went wrong. Please try again.');
        return false;
      }

      setSuccess(true);
      const entry = await findWaitlistEntry({ userId: user.id, email: user.email.toLowerCase() });
      setExistingEntry(entry);
      return true;
    } catch {
      setError('Something went wrong. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [existingEntry, findWaitlistEntry]);

  return { joinWaitlist, checkWaitlistStatus, loading, error, success, existingEntry, setExistingEntry, setError, setSuccess };
}
