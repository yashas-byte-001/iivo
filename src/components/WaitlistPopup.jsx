import React from 'react';
import { CheckCircle2, CircleX, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useWaitlist } from '../hooks/useWaitlist';

const SEEN_KEY = 'iivo-waitlist-popup-seen';

export default function WaitlistPopup() {
  const { user, loading: authLoading } = useAuth();
  const { checkWaitlistStatus, existingEntry, setExistingEntry, loading: waitlistLoading } = useWaitlist();
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    if (window.sessionStorage.getItem(SEEN_KEY) === '1') {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      window.sessionStorage.setItem(SEEN_KEY, '1');
      setIsOpen(true);
    }, 1200);
    return () => window.clearTimeout(timeoutId);
  }, []);

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

  React.useEffect(() => {
    if (!isOpen || typeof window === 'undefined') {
      return undefined;
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        dismiss();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const hasJoined = Boolean(existingEntry);
  const isBusy = authLoading || waitlistLoading;

  if (!isOpen || typeof window === 'undefined') {
    return null;
  }

  const dismiss = () => {
    setIsOpen(false);
  };

  const joinHref = 'join-waitlist.html';
  const alreadyJoinedHref = 'join-waitlist-details.html';

  return (
    <div className="waitlist-popup-overlay" role="presentation" onClick={dismiss}>
      <div
        className="waitlist-popup glass-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="waitlist-popup-title"
        aria-describedby="waitlist-popup-description"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="waitlist-popup-close" onClick={dismiss} aria-label="Close waitlist announcement">
          <CircleX size={20} />
        </button>

        <div className="waitlist-popup-badge">
          <Sparkles size={16} />
          <span>OptiStudy waitlist is open</span>
        </div>

        <h2 id="waitlist-popup-title">The OptiStudy waitlist is now open.</h2>
        <p id="waitlist-popup-description">
          Visitors can join now to reserve an early spot. If you already signed up, use the already joined button to view your waitlist details.
        </p>

        <div className="waitlist-popup-actions">
          <a href={joinHref} className="primary-button waitlist-popup-button">
            {isBusy ? 'Checking status' : 'Join waitlist'}
          </a>

          <a href={alreadyJoinedHref} className="secondary-button waitlist-popup-button waitlist-popup-button--secondary">
            Already joined
            {hasJoined ? <CheckCircle2 size={16} /> : null}
          </a>
        </div>
      </div>
    </div>
  );
}