import React from 'react';
import { motion } from 'framer-motion';
import { BackgroundEffects } from '../components';
import { WaitlistForm, WaitlistJoinedState } from './WaitlistForm';
import { useAuth } from '../hooks/useAuth';
import { useWaitlist } from '../hooks/useWaitlist';

function JoinWaitlistDetailsPage() {
  const { session, loading: authLoading, signOut } = useAuth();
  const { checkWaitlistStatus, existingEntry, loading: waitlistLoading } = useWaitlist();
  const [checked, setChecked] = React.useState(false);

  React.useEffect(() => {
    if (authLoading) {
      return undefined;
    }

    if (!session?.user) {
      window.location.assign('join-waitlist.html');
      return undefined;
    }

    let mounted = true;
    setChecked(false);

    checkWaitlistStatus({ user: session.user }).finally(() => {
      if (mounted) {
        setChecked(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, [authLoading, checkWaitlistStatus, session]);

  if (authLoading || (session?.user && (!checked || waitlistLoading))) {
    return (
      <div className="join-waitlist-page">
        <BackgroundEffects variant="hero" />
        <header className="join-waitlist-topbar">
          <a href="index.html" className="brand-markup">IIVO</a>
          <a href="index.html" className="secondary-button join-waitlist-home-link">Back to home</a>
        </header>

        <main className="join-waitlist-shell">
          <motion.div className="join-waitlist-copy glass-panel" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}>
            <p className="section-kicker">Waitlist details</p>
            <h1 className="section-title">Checking your account...</h1>
            <p className="section-copy mt-6">We’re verifying whether you already have a waitlist entry.</p>
          </motion.div>

          <div className="waitlist-form glass-panel join-waitlist-panel">
            <div className="waitlist-loading-state" aria-live="polite">
              <span className="waitlist-spinner" aria-hidden="true" />
              <span>Loading your authentication state</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  if (existingEntry) {
    return (
      <div className="join-waitlist-page">
        <BackgroundEffects variant="hero" />
        <header className="join-waitlist-topbar">
          <a href="index.html" className="brand-markup">IIVO</a>
          <a href="index.html" className="secondary-button join-waitlist-home-link">Back to home</a>
        </header>

        <main className="join-waitlist-shell">
          <motion.div className="join-waitlist-copy glass-panel" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}>
            <p className="section-kicker">Waitlist details</p>
            <h1 className="section-title">You’re already joined.</h1>
            <p className="section-copy mt-6">We found an existing waitlist entry linked to this account.</p>
          </motion.div>

          <div className="join-waitlist-panel glass-panel">
            <WaitlistJoinedState email={session.user.email || 'your account'} isBusy={waitlistLoading} onSignOut={signOut} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="join-waitlist-page">
      <BackgroundEffects variant="hero" />
      <header className="join-waitlist-topbar">
        <a href="index.html" className="brand-markup">IIVO</a>
        <a href="index.html" className="secondary-button join-waitlist-home-link">Back to home</a>
      </header>

      <main className="join-waitlist-shell">
        <motion.div className="join-waitlist-copy glass-panel" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}>
          <p className="section-kicker">Waitlist details</p>
          <h1 className="section-title">Complete your waitlist profile.</h1>
          <p className="section-copy mt-6">Your account is signed in. Enter the details below to join the waitlist.</p>
        </motion.div>

        <WaitlistForm className="join-waitlist-panel" mode="collect" checkExistingEntry={false} />
      </main>
    </div>
  );
}

export default React.memo(JoinWaitlistDetailsPage);
