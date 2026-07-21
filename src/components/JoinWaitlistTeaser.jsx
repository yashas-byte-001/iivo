import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useWaitlist } from '../hooks/useWaitlist';

function JoinWaitlistTeaserContent() {
  const { user, loading: authLoading } = useAuth();
  const { checkWaitlistStatus, existingEntry, setExistingEntry, loading: waitlistLoading } = useWaitlist();

  React.useEffect(() => {
    if (!user) {
      setExistingEntry(null);
      return undefined;
    }

    let mounted = true;

    checkWaitlistStatus({ user }).catch(() => {
      if (mounted) {
        setExistingEntry(null);
      }
    });

    return () => {
      mounted = false;
    };
  }, [checkWaitlistStatus, setExistingEntry, user]);

  const isBusy = authLoading || waitlistLoading;
  const hasJoined = Boolean(existingEntry);

  return (
    <div className="waitlist-teaser">
      {hasJoined ? (
        <div className="waitlist-teaser-confirmation">
          <div className="waitlist-confirmation-badge">
            <span>Waitlist confirmed</span>
          </div>
          <h3>You’re already on the IIVO waitlist.</h3>
          <p>Signed in as {user?.email}. We’ll keep your spot tied to this account.</p>
        </div>
      ) : (
        <>
          <p className="waitlist-teaser-label">Join the waitlist</p>
          <p className="waitlist-teaser-copy">Continue to the dedicated join page to sign in first and complete your profile.</p>
          <a href="join-waitlist.html" className="primary-button waitlist-teaser-button" aria-label="Join the waitlist">
            {isBusy ? 'Checking status' : 'Join waitlist'}
          </a>
        </>
      )}
    </div>
  );
}

export default React.memo(JoinWaitlistTeaserContent);
