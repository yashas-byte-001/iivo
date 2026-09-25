import React from 'react';
import { ArrowUpRight, MonitorDown, X } from 'lucide-react';

import { OPTISTUDY_APP_URL } from '../config/links';
import { OPEN_INSTALL_EVENT } from '../components';

/*
 * A one-line announcement that OptiStudy is out, shown once per visitor.
 *
 * Kept deliberately thin. A card lived here before and was removed for
 * carrying the whole install story at once — it read as a page of
 * instructions (see the note above Hero in components.jsx). This one says a
 * single thing and offers a single action; everything else stays where it
 * already lives, in the hero and the #install guide.
 *
 * The action follows the device. An Android phone gets the app file, which is
 * a plain download and so works from any origin.
 *
 * Everywhere else the button opens optistudy.in, because **iivo.org cannot
 * install OptiStudy itself**: `beforeinstallprompt` only fires on the origin
 * serving the manifest, and a manifest installs its own site — one here would
 * install iivo.org. There is no cross-origin install API. optistudy.in carries
 * the manifest, the service worker and its own Install button, so the handoff
 * is the shortest real path: one click here, one click there. The steps stay
 * one tap away for anyone whose browser offers no prompt (Firefox, Safari on
 * iOS) or who would rather read them.
 */

const DISMISSED_KEY = 'iivo.liveCard.dismissed';
const APPEAR_DELAY_MS = 900;

function wasDismissed() {
  try {
    return localStorage.getItem(DISMISSED_KEY) === '1';
  } catch {
    // Private mode or blocked storage: show it: a card shown twice is a much
    // smaller problem than a crash on load.
    return false;
  }
}

export default function LiveCard({ ready = true }) {
  const [shown, setShown] = React.useState(false);
  const [leaving, setLeaving] = React.useState(false);

  React.useEffect(() => {
    if (!ready || wasDismissed()) return undefined;
    // Let the opening animation finish before anything slides in over it.
    const timer = setTimeout(() => setShown(true), APPEAR_DELAY_MS);
    return () => clearTimeout(timer);
  }, [ready]);

  const dismiss = React.useCallback(() => {
    setLeaving(true);
    try {
      localStorage.setItem(DISMISSED_KEY, '1');
    } catch { /* nothing to remember it with; it will show again next visit */ }
    setTimeout(() => setShown(false), 200);
  }, []);

  if (!shown) return null;

  return (
    <aside className={`live-card ${leaving ? 'is-leaving' : ''}`} role="status" aria-live="polite">
      <button type="button" className="live-card-close" onClick={dismiss} aria-label="Dismiss">
        <X size={15} />
      </button>

      <p className="live-card-kicker">
        <span className="live-card-dot" aria-hidden="true" />
        OptiStudy is live
      </p>
      <p className="live-card-copy">
        The AI academic workspace is out now. Free to start.
      </p>

      <div className="live-card-actions">
        <a href={OPTISTUDY_APP_URL} className="opti-button button--sm" target="_blank" rel="noreferrer">
          <MonitorDown size={15} />
          Install on this device
        </a>
        <a
          href="#install"
          className="live-card-link"
          onClick={() => window.dispatchEvent(new CustomEvent(OPEN_INSTALL_EVENT))}
        >
          See the steps
          <ArrowUpRight size={13} />
        </a>
      </div>
    </aside>
  );
}
