import React from 'react';
import {
  ArrowUpRight,
  Bell,
  CircleCheck,
  Dock,
  Download,
  EllipsisVertical,
  Info,
  Laptop,
  Monitor,
  MonitorDown,
  RefreshCw,
  Share,
  Smartphone,
  SquarePlus,
  Tablet,
  Terminal,
  Zap,
} from 'lucide-react';

import { EXTERNAL_LINK_PROPS, OPTISTUDY_APK_URL, OPTISTUDY_APP_HOST, OPTISTUDY_APP_URL, OPTISTUDY_DOWNLOAD_URL } from '../config/links';

const APP_HOST = OPTISTUDY_APP_HOST;

/* A small picture of the control the step is talking about. */
function Glyph({ icon: Icon, label }) {
  return (
    <span className="ui-glyph" role="img" aria-label={label}>
      <Icon strokeWidth={2.2} />
    </span>
  );
}

function Label({ children }) {
  return <kbd className="ui-label">{children}</kbd>;
}

/*
 * One entry per platform. Steps are written for the recommended browser; the
 * note covers the others. Wording follows what each browser actually shows in
 * its menus, so a reader can match the text on their screen.
 */
const PLATFORMS = [
  {
    id: 'ios',
    label: 'iPhone & iPad',
    icon: Smartphone,
    title: 'Add OptiStudy to your Home Screen',
    browsers: [
      { name: 'Safari', recommended: true },
      { name: 'Chrome (iOS 16.4+)' },
      { name: 'Firefox (iOS 16.4+)' },
      { name: 'Edge (iOS 16.4+)' },
    ],
    steps: [
      {
        title: 'Open OptiStudy in Safari',
        body: (
          <>
            Go to <Label>{APP_HOST}</Label>. You can install before or after signing in.
          </>
        ),
      },
      {
        title: 'Tap the Share button',
        body: (
          <>
            It&rsquo;s the square with an arrow pointing up <Glyph icon={Share} label="Share icon" /> &mdash; in the bar at the bottom of the
            screen on iPhone, or at the top next to the address bar on iPad.
          </>
        ),
      },
      {
        title: 'Choose “Add to Home Screen”',
        body: (
          <>
            Scroll down the share sheet until you see <Label>Add to Home Screen</Label> <Glyph icon={SquarePlus} label="Add to Home Screen icon" /> and tap it.
          </>
        ),
      },
      {
        title: 'Tap “Add”',
        body: (
          <>
            Confirm with <Label>Add</Label> in the top-right corner. OptiStudy now sits on your Home Screen and opens full-screen, like any
            other app.
          </>
        ),
      },
    ],
    note: 'On iOS 16.4 or later, Chrome, Firefox and Edge offer the same “Add to Home Screen” option from their share menus. Older versions of iOS need Safari.',
  },
  {
    id: 'android',
    label: 'Android',
    icon: Tablet,
    title: 'Download the OptiStudy app',
    browsers: [
      { name: 'Chrome', recommended: true },
      { name: 'Samsung Internet' },
      { name: 'Edge' },
      { name: 'Firefox' },
    ],
    /* A real app file (a signed shell that opens OptiStudy in Chrome), so the
       steps are download-and-install rather than a browser menu. Every
       improvement to OptiStudy reaches the installed app on its own. */
    action: { href: OPTISTUDY_APK_URL, label: 'Download for Android', detail: 'About 1.4 MB · Android 5.0 and up' },
    steps: [
      {
        title: 'Download the app',
        body: (
          <>
            Tap <Label>Download for Android</Label> below. Chrome may say the file could be harmful &mdash; that is Android&rsquo;s
            message for any app that does not come from the Play Store.
          </>
        ),
      },
      {
        title: 'Open the downloaded file',
        body: (
          <>
            Tap <Label>Open</Label> in Chrome&rsquo;s download bar, or open <Label>OptiStudy.apk</Label> from your notifications. The first
            time, Android asks you to allow installs from Chrome &mdash; allow it once and go back.
          </>
        ),
      },
      {
        title: 'Tap “Install”',
        body: (
          <>
            OptiStudy appears in your app drawer. Open it and sign in with your account. You never need to reinstall: the app always shows
            the current OptiStudy.
          </>
        ),
      },
    ],
    note: (
      <>
        Prefer not to download a file? Open <Label>{APP_HOST}</Label> in Chrome, tap the three dots{' '}
        <Glyph icon={EllipsisVertical} label="Menu icon" /> and choose <Label>Install app</Label> &mdash; you get the same app without the
        download. Full details and the file&rsquo;s checksum are at{' '}
        <a href={OPTISTUDY_DOWNLOAD_URL} {...EXTERNAL_LINK_PROPS}>
          optistudy.in/download
        </a>
        .
      </>
    ),
  },
  {
    id: 'windows',
    label: 'Windows',
    icon: Monitor,
    title: 'Install OptiStudy as a desktop app',
    browsers: [
      { name: 'Chrome', recommended: true },
      { name: 'Edge', recommended: true },
      { name: 'Brave / Opera' },
    ],
    steps: [
      {
        title: 'Open OptiStudy in Chrome or Edge',
        body: (
          <>
            Go to <Label>{APP_HOST}</Label>.
          </>
        ),
      },
      {
        title: 'Click the install icon in the address bar',
        body: (
          <>
            Look at the right end of the address bar for <Glyph icon={MonitorDown} label="Install icon" />. In Chrome it says{' '}
            <Label>Install OptiStudy</Label>; in Edge it&rsquo;s labelled <Label>App available</Label>.
          </>
        ),
      },
      {
        title: 'Don’t see the icon? Use the menu',
        body: (
          <>
            Chrome: <Glyph icon={EllipsisVertical} label="Menu icon" /> → <Label>Cast, save, and share</Label> → <Label>Install OptiStudy…</Label>.
            Edge: <Label>…</Label> → <Label>Apps</Label> → <Label>Install this site as an app</Label>.
          </>
        ),
      },
      {
        title: 'Click “Install”',
        body: (
          <>
            OptiStudy opens in its own window and appears in the Start menu. Right-click its taskbar icon and choose{' '}
            <Label>Pin to taskbar</Label> to keep it handy.
          </>
        ),
      },
    ],
    note: 'Firefox on desktop doesn’t support installing web apps. Use Chrome or Edge to install; you can still use OptiStudy in a Firefox tab.',
  },
  {
    id: 'macos',
    label: 'macOS',
    icon: Laptop,
    title: 'Add OptiStudy to your Dock',
    browsers: [
      { name: 'Safari (macOS 14+)', recommended: true },
      { name: 'Chrome', recommended: true },
      { name: 'Edge' },
    ],
    steps: [
      {
        title: 'Open OptiStudy in Safari',
        body: (
          <>
            Go to <Label>{APP_HOST}</Label>. This needs macOS Sonoma (14) or later; on older Macs, use Chrome and follow the step below.
          </>
        ),
      },
      {
        title: 'Choose File → “Add to Dock…”',
        body: (
          <>
            From the menu bar, or click the Share button <Glyph icon={Share} label="Share icon" /> in the toolbar and pick{' '}
            <Label>Add to Dock</Label> <Glyph icon={Dock} label="Dock icon" />.
          </>
        ),
      },
      {
        title: 'Click “Add”',
        body: (
          <>
            Keep the name as OptiStudy and confirm. It now lives in your Dock and in Launchpad, and opens in its own window.
          </>
        ),
      },
      {
        title: 'Using Chrome or Edge instead?',
        body: (
          <>
            Click the install icon <Glyph icon={MonitorDown} label="Install icon" /> at the right end of the address bar, or open{' '}
            <Glyph icon={EllipsisVertical} label="Menu icon" /> → <Label>Cast, save, and share</Label> → <Label>Install OptiStudy…</Label>, then click{' '}
            <Label>Install</Label>.
          </>
        ),
      },
    ],
    note: 'Firefox on macOS doesn’t support installing web apps. Safari, Chrome and Edge all do.',
  },
  {
    id: 'linux',
    label: 'Linux & ChromeOS',
    icon: Terminal,
    title: 'Install OptiStudy from a Chromium browser',
    browsers: [
      { name: 'Chrome', recommended: true },
      { name: 'Chromium' },
      { name: 'Edge' },
      { name: 'Brave' },
    ],
    steps: [
      {
        title: 'Open OptiStudy in Chrome, Chromium or Edge',
        body: (
          <>
            Go to <Label>{APP_HOST}</Label>. On a Chromebook, the built-in Chrome browser is all you need.
          </>
        ),
      },
      {
        title: 'Click the install icon in the address bar',
        body: (
          <>
            It&rsquo;s at the right end of the address bar <Glyph icon={MonitorDown} label="Install icon" />, labelled <Label>Install OptiStudy</Label>.
          </>
        ),
      },
      {
        title: 'Or use the browser menu',
        body: (
          <>
            <Glyph icon={EllipsisVertical} label="Menu icon" /> → <Label>Cast, save, and share</Label> → <Label>Install OptiStudy…</Label>. In Edge:{' '}
            <Label>…</Label> → <Label>Apps</Label> → <Label>Install this site as an app</Label>.
          </>
        ),
      },
      {
        title: 'Click “Install”',
        body: (
          <>
            OptiStudy gets its own window and a launcher entry. On ChromeOS it appears in the Launcher and can be pinned to the shelf.
          </>
        ),
      },
    ],
    note: 'Firefox doesn’t support installing web apps on Linux. Any Chromium-based browser works.',
  },
];

/*
 * Best guess at where the visitor is, so the guide opens on their platform.
 * iPadOS reports itself as a Mac, hence the touch-point check.
 */
function detectPlatform() {
  if (typeof navigator === 'undefined') {
    return null;
  }

  const ua = navigator.userAgent || '';
  const isTouchMac = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

  if (/iPhone|iPad|iPod/.test(ua) || isTouchMac) return 'ios';
  if (/Android/.test(ua)) return 'android';
  if (/CrOS/.test(ua)) return 'linux';
  if (/Windows/.test(ua)) return 'windows';
  if (/Macintosh|Mac OS X/.test(ua)) return 'macos';
  if (/Linux/.test(ua)) return 'linux';
  return null;
}

const WHY = [
  { icon: Zap, title: 'One tap to open', body: 'Its own icon on your home screen, dock or taskbar. No address bar, no tabs.' },
  { icon: RefreshCw, title: 'Always current', body: 'Updates arrive automatically the next time you open it. Nothing to reinstall.' },
  { icon: Bell, title: 'Feels native', body: 'Runs full-screen in its own window and behaves like an app from the store.' },
  { icon: CircleCheck, title: 'No app store', body: 'Installs straight from the browser in a few seconds — or as a 1.4 MB download on Android. Takes almost no space.' },
];

export default function InstallGuide() {
  const [detected, setDetected] = React.useState(null);
  const [active, setActive] = React.useState('windows');
  const tabRefs = React.useRef({});

  React.useEffect(() => {
    const platform = detectPlatform();
    if (platform) {
      setDetected(platform);
      setActive(platform);
    }
  }, []);

  const current = PLATFORMS.find((platform) => platform.id === active) ?? PLATFORMS[0];

  const handleKeyDown = (event) => {
    const index = PLATFORMS.findIndex((platform) => platform.id === active);
    let next = index;

    if (event.key === 'ArrowRight') next = (index + 1) % PLATFORMS.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + PLATFORMS.length) % PLATFORMS.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = PLATFORMS.length - 1;
    else return;

    event.preventDefault();
    const id = PLATFORMS[next].id;
    setActive(id);
    tabRefs.current[id]?.focus();
  };

  return (
    <section id="install" className="section-shell section-shell--flow">
      <div className="section-inner">
        <div className="section-head section-head--split">
          <div>
            <p className="section-kicker section-kicker--opti">Get the app</p>
            <h2 className="section-title">Install OptiStudy on any device.</h2>
          </div>
          <p className="section-copy">
            OptiStudy installs straight from your browser, with no app store in between &mdash; and on Android there is an app to
            download. Either way it works like a native app on your phone, tablet or computer. Pick your device below.
          </p>
        </div>

        <div className="install-why">
          {WHY.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title}>
                <Icon size={20} />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            );
          })}
        </div>

        <div className="install-panel">
          <div className="install-tabs" role="tablist" aria-label="Choose your device" onKeyDown={handleKeyDown}>
            {PLATFORMS.map((platform) => {
              const Icon = platform.icon;
              const selected = platform.id === active;
              return (
                <button
                  key={platform.id}
                  ref={(node) => {
                    tabRefs.current[platform.id] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`install-tab-${platform.id}`}
                  aria-selected={selected}
                  aria-controls={`install-panel-${platform.id}`}
                  tabIndex={selected ? 0 : -1}
                  className="install-tab"
                  onClick={() => setActive(platform.id)}
                >
                  <Icon size={16} />
                  {platform.label}
                </button>
              );
            })}
          </div>

          <div
            key={current.id}
            className="install-body"
            role="tabpanel"
            id={`install-panel-${current.id}`}
            aria-labelledby={`install-tab-${current.id}`}
          >
            <div>
              {detected === current.id ? (
                <p className="install-detected">
                  <CircleCheck size={14} />
                  Looks like you&rsquo;re on {current.label} &mdash; these are the steps for your device.
                </p>
              ) : null}

              <div className="install-head">
                <h3>{current.title}</h3>
                <ul className="install-browsers" aria-label="Supported browsers">
                  {current.browsers.map((browser) => (
                    <li key={browser.name} className={browser.recommended ? 'is-recommended' : ''}>
                      {browser.name}
                      {browser.recommended ? ' · recommended' : ''}
                    </li>
                  ))}
                </ul>
              </div>

              <ol className="install-steps">
                {current.steps.map((step) => (
                  <li key={step.title}>
                    <div className="install-step-body">
                      <strong>{step.title}</strong>
                      <p>{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>

              {current.action ? (
                <div className="install-action">
                  <a href={current.action.href} className="opti-button" download>
                    <Download size={16} />
                    {current.action.label}
                  </a>
                  <span>{current.action.detail}</span>
                </div>
              ) : null}
            </div>

            <aside className="install-aside">
              <div className="install-card install-card--opti">
                <h4>
                  <Info size={16} />
                  Install from this address
                </h4>
                <p>
                  {current.action
                    ? 'The download above installs it. This is the address the app opens, and where you sign in.'
                    : 'Every step above starts by opening OptiStudy. This is the only address you need.'}
                </p>
                <span className="install-url">{APP_HOST}</span>
                <a href={OPTISTUDY_APP_URL} className="opti-button" {...EXTERNAL_LINK_PROPS}>
                  Open OptiStudy to install
                  <ArrowUpRight size={16} />
                </a>
              </div>

              <div className="install-card">
                <h4>
                  <Info size={16} />
                  Good to know
                </h4>
                <ul>
                  <li>Installing is free and takes a few seconds. You can sign in before or after &mdash; it makes no difference.</li>
                  <li>Your account is the same everywhere. Sign in on a second device and everything is already there.</li>
                  <li>
                    To remove it: on a phone, press and hold the icon and choose Remove or Uninstall. On desktop, open the app&rsquo;s own
                    menu and pick Uninstall OptiStudy.
                  </li>
                </ul>
              </div>

              <p className="install-note">
                <strong>{current.label}:</strong> {current.note}
              </p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
