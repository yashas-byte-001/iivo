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

    /*
     * Wait for the visitor to actually see the hero before interrupting them.
     * Firing at 1.2s put a blurred overlay over the whole page before anyone
     * had read a word of it. Now it waits for the first scroll past the hero,
     * and falls back to a timer for people who never scroll.
     */
    const open = () => {
      window.sessionStorage.setItem(SEEN_KEY, '1');
      setIsOpen(true);
      cleanup();
    };

    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.6) {
        open();
      }
    };

    const timeoutId = window.setTimeout(open, 12000);

    function cleanup() {
      window.clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return cleanup;
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