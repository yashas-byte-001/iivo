import React from 'react';
import { ArrowUpRight, Download, MonitorDown, X } from 'lucide-react';

import { OPTISTUDY_APK_URL, OPTISTUDY_APP_URL } from '../config/links';
import { OPEN_INSTALL_EVENT } from '../components';
import { useIsAndroid } from '../hooks/usePlatform';

/*
 * A one-line announcement that OptiStudy is out, shown once per visitor.
 *
 * Kept deliberately thin. A card lived here before and was removed for
 * carrying the whole install story at once — it read as a page of
 * instructions (see the note above Hero in components.jsx). This one says a
 * single thing and offers a single action; everything else stays where it
 * already lives, in the hero and the #install guide.
 *
 * The action follows the device, the same split the hero and launch bar make:
 * an Android phone gets the app file, everyone else gets the install steps for
 * their own OS. It cannot install OptiStudy directly — a browser will only
 * offer that for the site serving the manifest, and that is optistudy.in, not
 * iivo.org.
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
  const android = useIsAndroid();
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
        {android ? (
          <a href={OPTISTUDY_APK_URL} className="opti-button button--sm" download>
            <Download size={15} />
            Download for Android
          </a>
        ) : (
          <a
            href="#install"
            className="opti-button button--sm"
            onClick={() => window.dispatchEvent(new CustomEvent(OPEN_INSTALL_EVENT))}
          >
            <MonitorDown size={15} />
            Install on this device
          </a>
        )}
        <a href={OPTISTUDY_APP_URL} className="live-card-link" target="_blank" rel="noreferrer">
          Open in browser
          <ArrowUpRight size={13} />
        </a>
      </div>
    </aside>
  );
}
