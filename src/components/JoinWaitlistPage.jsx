import React from 'react';
import { motion } from 'framer-motion';
import { BackgroundEffects } from '../components';
import { WaitlistForm } from './WaitlistForm';
import { useAuth } from '../hooks/useAuth';

function JoinWaitlistPage() {
  const { session } = useAuth();

  React.useEffect(() => {
    if (session) {
      window.location.assign('join-waitlist-details.html');
    }
  }, [session]);

  return (
    <div className="join-waitlist-page">
      <BackgroundEffects variant="hero" />
      <header className="join-waitlist-topbar">
        <a href="index.html" className="brand-markup">IIVO</a>
        <a href="index.html" className="secondary-button join-waitlist-home-link">Back to home</a>
      </header>

      <main className="join-waitlist-shell">
        <motion.div className="join-waitlist-copy glass-panel" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}>
          <p className="section-kicker">Join the waitlist</p>
          <h1 className="section-title">Sign in to continue.</h1>
          <p className="section-copy mt-6">After login, you’ll be taken to a separate page to complete your waitlist details.</p>
        </motion.div>

        <WaitlistForm className="join-waitlist-panel" mode="auth" />
      </main>
    </div>
  );
}

export default React.memo(JoinWaitlistPage);
