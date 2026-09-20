import React from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CalendarDays,
  ChartNoAxesCombined,
  CircleCheckBig,
  ClipboardList,
  Eye,
  FlaskConical,
  Globe,
  GraduationCap,
  KeyRound,
  Mail,
  Menu,
  MessageCircleMore,
  MonitorDown,
  Sparkles,
  Stars,
  UserRoundPlus,
  Users,
  X,
} from 'lucide-react';

import { EXTERNAL_LINK_PROPS, OPTISTUDY_APP_HOST, OPTISTUDY_APP_URL, TESTER_URL } from './config/links';

/*
 * The site map. Nav, mobile sheet and footer all read from this so a section
 * can never be reachable from one and missing from another.
 */
export const SECTIONS = [
  { id: 'home', label: 'Home', hint: 'Start here' },
  { id: 'start', label: 'Get started', hint: 'Open, sign in, install' },
  { id: 'optistudy', label: 'OptiStudy', hint: 'The product' },
  { id: 'install', label: 'Get the app', hint: 'Install on any device' },
  { id: 'about', label: 'About', hint: 'Who we are' },
  { id: 'testers', label: 'Testers', hint: 'Join the programme' },
  { id: 'contact', label: 'Contact', hint: 'Reach us' },
];

const NAV_LINKS = SECTIONS.filter((section) => section.id !== 'home' && section.id !== 'contact');

/*
 * No scroll-triggered reveals on this design. The only thing that moves on
 * the page is the product preview, and it still honours reduced motion.
 */
function useReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

function useMediaQuery(query) {
  const getMatches = React.useCallback(() => (typeof window === 'undefined' ? false : window.matchMedia(query).matches), [query]);
  const [matches, setMatches] = React.useState(getMatches);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = (event) => setMatches(event.matches);
    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

export function PrimaryButton({ children, href, className = '', ...props }) {
  const Tag = href ? 'a' : 'button';
  return (
    <Tag href={href} className={`primary-button ${className}`} {...props}>
      <span>{children}</span>
      <ArrowRight size={16} />
    </Tag>
  );
}

export function SecondaryButton({ children, href, className = '', ...props }) {
  const Tag = href ? 'a' : 'button';
  return (
    <Tag href={href} className={`secondary-button ${className}`} {...props}>
      {children}
    </Tag>
  );
}

/*
 * Purple means "opens OptiStudy". IIVO itself is blue; the product is purple,
 * and every purple control goes to the same address, so a visitor only ever
 * has to learn one thing.
 */
export function OptiButton({ children, className = '', ghost = false, ...props }) {
  return (
    <a href={OPTISTUDY_APP_URL} className={`opti-button ${ghost ? 'opti-button--ghost' : ''} ${className}`} {...EXTERNAL_LINK_PROPS} {...props}>
      {children}
    </a>
  );
}

/* The OptiStudy mark: a small purple tile used wherever the product is named. */
export function OptiMark({ size = 'md' }) {
  return (
    <span className={`opti-mark opti-mark--${size}`} aria-hidden="true">
      O
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export function Navbar({ activeSection = 'home' }) {
  const isCompact = useMediaQuery('(max-width: 1024px)');
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  /* The sheet only exists on small screens; closing it when the viewport grows
     stops it lingering invisibly with the page scroll locked. */
  React.useEffect(() => {
    if (!isCompact) setOpen(false);
  }, [isCompact]);

  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return undefined;

    const onKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className={`site-nav ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="site-nav-inner">
          <a href="#home" className="brand-markup" onClick={() => setOpen(false)}>
            <span className="brand-dot" aria-hidden="true" />
            IIVO
          </a>

          <nav className="nav-links" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a key={link.id} href={`#${link.id}`} className={activeSection === link.id ? 'is-active' : ''}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* The launch button never hides behind the menu: on a phone it sits
              beside the toggle so the product is one tap away from anywhere. */}
          <div className="nav-actions">
            <OptiButton className="button--sm nav-launch">
              Open OptiStudy
              <ArrowUpRight size={15} />
            </OptiButton>
            <button
              type="button"
              className="nav-toggle"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`nav-sheet ${open ? 'is-open' : ''}`} hidden={!open}>
        <nav className="nav-sheet-links" aria-label="Sections">
          {SECTIONS.map((link) => (
            <a key={link.id} href={`#${link.id}`} onClick={() => setOpen(false)}>
              {link.label}
              <span>{link.hint}</span>
            </a>
          ))}
        </nav>
        <div className="nav-sheet-actions">
          <OptiButton className="button--lg">
            Open OptiStudy
            <ArrowUpRight size={16} />
          </OptiButton>
          <p className="nav-sheet-note">
            Free for everyone. Sign in or create your account inside the app at <strong>{OPTISTUDY_APP_HOST}</strong>.
          </p>
          <a href={TESTER_URL} className="secondary-button">
            <FlaskConical size={15} />
            Join the tester programme
          </a>
        </div>
      </div>
    </>
  );
}

/*
 * A launch bar pinned to the bottom of small screens once the hero has
 * scrolled away. Whatever a visitor is reading, the product stays one tap
 * away and the address stays in view.
 */
export function LaunchBar({ activeSection = 'home' }) {
  const visible = activeSection !== 'home';
  return (
    <div className={`launch-bar ${visible ? 'is-visible' : ''}`} aria-hidden={!visible}>
      <div className="launch-bar-text">
        <OptiMark size="sm" />
        <div>
          <strong>OptiStudy</strong>
          <span>{OPTISTUDY_APP_HOST}</span>
        </div>
      </div>
      <OptiButton className="button--sm" tabIndex={visible ? 0 : -1}>
        Open
        <ArrowUpRight size={15} />
      </OptiButton>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

/*
 * The product spotlight. It carries the OptiStudy purple, the address, one
 * big button, and a plain statement that accounts live inside the app,
 * because visitors kept looking for a login form on this site.
 */
export function Spotlight({ variant = 'hero' }) {
  return (
    <div className={`spotlight spotlight--${variant}`}>
      <div className="spotlight-main">
        <div className="spotlight-brand">
          <OptiMark size="lg" />
          <div>
            <h2 className="spotlight-name">OptiStudy</h2>
            <p className="spotlight-tag">The AI-powered academic workspace</p>
          </div>
          <span className="spotlight-status">
            <span className="live-dot" aria-hidden="true" />
            Live &middot; open to everyone
          </span>
        </div>

        <div className="spotlight-actions">
          <OptiButton className="button--xl spotlight-button">
            Open OptiStudy
            <ArrowUpRight size={20} />
          </OptiButton>
          <a href={OPTISTUDY_APP_URL} className="spotlight-host" {...EXTERNAL_LINK_PROPS}>
            <Globe size={14} />
            {OPTISTUDY_APP_HOST}
          </a>
        </div>
      </div>

      <ul className="spotlight-facts">
        <li>
          <UserRoundPlus size={16} />
          <span>
            <strong>New here?</strong> Create your account in the app
          </span>
        </li>
        <li>
          <KeyRound size={16} />
          <span>
            <strong>Already have one?</strong> Sign in there too
          </span>
        </li>
        <li>
          <MonitorDown size={16} />
          <span>
            <strong>Any browser.</strong> <a href="#install">Install it</a> for one-tap access
          </span>
        </li>
      </ul>
    </div>
  );
}

export function Hero() {
  return (
    <section id="home" className="hero-shell">
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-inner">
        <p className="hero-kicker">IIVO &middot; Intelligent software for learning</p>

        <h1 className="hero-title">
          Your studies, <em>planned and understood</em> by AI.
        </h1>

        <p className="hero-body">
          OptiStudy is an AI-powered academic workspace that plans your study, answers questions about your own notes and keeps track
          of what you have actually covered. It is now open to everyone &mdash; no waitlist, no invite.
        </p>

        <Spotlight />

        <p className="hero-foot">
          <span>Free to start</span>
          <span>iPhone, Android, Windows, macOS &amp; Linux</span>
          <span>No app store needed</span>
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Get started                                                         */
/* ------------------------------------------------------------------ */

export function GetStarted() {
  const steps = [
    {
      icon: Globe,
      title: 'Open OptiStudy',
      body: (
        <>
          Go to <strong>{OPTISTUDY_APP_HOST}</strong> in any browser, or press the purple button anywhere on this page. That is the app.
        </>
      ),
      link: { label: 'Open it now', href: OPTISTUDY_APP_URL, external: true },
    },
    {
      icon: UserRoundPlus,
      title: 'Create your account, or sign in',
      body: (
        <>
          Everything to do with your account happens inside OptiStudy: signing up, signing in and resetting a password. There is
          nothing to log into on this website.
        </>
      ),
      link: { label: 'Go to sign-in', href: OPTISTUDY_APP_URL, external: true },
    },
    {
      icon: MonitorDown,
      title: 'Install it, if you like',
      body: (
        <>
          Add OptiStudy to your home screen, dock or taskbar in a few taps so it opens like a native app. Optional, but worth it.
        </>
      ),
      link: { label: 'Installation guide', href: '#install' },
    },
  ];

  return (
    <section id="start" className="section-shell section-shell--rule">
      <div className="section-inner">
        <div className="section-head section-head--center">
          <p className="section-kicker">Get started</p>
          <h2 className="section-title">Three steps. The first one is the only one you need.</h2>
          <p className="section-copy">
            OptiStudy is a web app, so there is nothing to download first. Open it, make an account, and start planning. Installing it
            on your device comes after, whenever you want.
          </p>
        </div>

        <ol className="steps">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li key={step.title} className="step">
                <div className="step-marker">
                  <span className="step-number">{index + 1}</span>
                  <Icon size={18} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <a
                  href={step.link.href}
                  className={`text-link ${step.link.external ? 'text-link--opti' : ''}`}
                  {...(step.link.external ? EXTERNAL_LINK_PROPS : {})}
                >
                  {step.link.label}
                  {step.link.external ? <ArrowUpRight size={14} /> : <ArrowRight size={14} />}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* OptiStudy                                                           */
/* ------------------------------------------------------------------ */

/*
 * A still life of the product, drawn in the app's own purple so a visitor
 * sees what OptiStudy looks like before they open it. Deliberately generic —
 * the app itself is where the real UI lives.
 */
function ProductPreview() {
  const reduceMotion = useReducedMotion();

  const sessions = [
    { subject: 'Physics', title: 'Wave interference recap', time: '09:30', tone: 'lavender' },
    { subject: 'Math', title: 'Integration by parts drill', time: '11:00', tone: 'rose' },
    { subject: 'Chemistry', title: 'Organic reactions recall', time: '15:45', tone: 'amber' },
  ];

  const [activeSession, setActiveSession] = React.useState(0);

  React.useEffect(() => {
    if (reduceMotion) return undefined;
    const timer = window.setInterval(() => setActiveSession((current) => (current + 1) % sessions.length), 2600);
    return () => window.clearInterval(timer);
  }, [reduceMotion, sessions.length]);

  return (
    <div className="app-frame" aria-hidden="true">
      <div className="app-frame-bar">
        <span className="app-dot" />
        <span className="app-dot" />
        <span className="app-dot" />
        <p>{OPTISTUDY_APP_HOST}</p>
      </div>

      <div className="app-frame-body">
        <aside className="app-rail">
          {[0, 1, 2, 3, 4].map((item) => (
            <span key={item} className={`app-rail-item ${item === 0 ? 'is-active' : ''}`} />
          ))}
        </aside>

        <div className="app-canvas">
          <div className="app-canvas-head">
            <div>
              <p className="app-eyebrow">Today</p>
              <h4>Your plan is ready</h4>
            </div>
            <span className="app-chip">
              <span className="live-dot" />3 sessions
            </span>
          </div>

          <ul className="app-sessions">
            {sessions.map((session, index) => (
              <li key={session.title} className={index === activeSession ? 'is-active' : ''}>
                <span className={`app-tone app-tone--${session.tone}`} />
                <div>
                  <strong>{session.title}</strong>
                  <span>{session.subject}</span>
                </div>
                <em>{session.time}</em>
              </li>
            ))}
          </ul>

          <div className="app-metrics">
            <div className="app-metric">
              <p className="app-eyebrow">Week progress</p>
              <div className="app-bar">
                <span style={{ width: '72%' }} />
              </div>
              <strong>72%</strong>
            </div>
            <div className="app-metric">
              <p className="app-eyebrow">Focus streak</p>
              <strong>12 days</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Product() {
  const features = [
    { title: 'AI study planner', body: 'Builds a daily structure from deadlines, workload and free time.', icon: ClipboardList },
    { title: 'Smart schedule & calendar', body: 'Keeps classes, work and study blocks aligned without rework.', icon: CalendarDays },
    { title: 'Progress tracking', body: 'Shows what is done, what is next and how much momentum is left.', icon: ChartNoAxesCombined },
    { title: 'AI chat assistant', body: 'Answers questions about your own notes and unblocks next steps.', icon: MessageCircleMore },
    { title: 'Notes & summaries', body: 'Turns long sessions into compact, useful study material.', icon: GraduationCap },
    { title: 'And more on the way', body: 'The workspace keeps expanding as feedback comes in.', icon: Stars },
  ];

  return (
    <section id="optistudy" className="section-shell section-shell--opti section-shell--rule">
      <div className="section-glow" aria-hidden="true" />
      <div className="section-inner">
        <div className="product-grid">
          <div className="product-copy">
            <p className="section-kicker section-kicker--opti">
              <OptiMark size="sm" />
              OptiStudy
            </p>
            <h2 className="section-title">Your academic life, in one place.</h2>
            <p className="section-copy">
              Plan your study, ask questions about your own notes, and keep track of what you have actually covered &mdash; on every
              device, from one account.
            </p>

            <div className="product-actions">
              <OptiButton className="button--lg">
                Open OptiStudy
                <ArrowUpRight size={16} />
              </OptiButton>
              <SecondaryButton href="#install" className="button--lg">
                <MonitorDown size={16} />
                Install on your device
              </SecondaryButton>
            </div>
          </div>

          <ProductPreview />
        </div>

        <ul className="feature-grid">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <li key={feature.title} className="feature-card">
                <Icon size={20} />
                <strong>{feature.title}</strong>
                <span>{feature.body}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

export function About() {
  const values = [
    { title: 'Intelligence', icon: BrainCircuit, description: 'Systems that read context and turn it into a clear next step.' },
    { title: 'Innovation', icon: Sparkles, description: 'Product design that feels modern without ever becoming loud.' },
    { title: 'Vision', icon: Eye, description: 'A foundation that can grow into a wider learning platform over time.' },
    { title: 'Optimization', icon: CircleCheckBig, description: 'Less friction, cleaner flows and better follow-through every day.' },
  ];

  return (
    <section id="about" className="section-shell section-shell--rule">
      <div className="section-inner">
        <div className="section-head section-head--center">
          <p className="section-kicker">About IIVO</p>
          <h2 className="section-title">We are IIVO.</h2>
          <p className="section-copy">
            IIVO creates intelligent software that helps people learn better and achieve more. We are a small team building for
            students first, starting with the hours they spend planning, studying and keeping track of it all.
          </p>
          <p className="section-copy">The name is the four things we hold ourselves to.</p>
        </div>

        <ul className="values">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <li key={value.title} className="value">
                <span className="value-letter">{value.title[0]}</span>
                <Icon size={18} />
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Tester programme                                                    */
/* ------------------------------------------------------------------ */

/*
 * The one thing on iivo.org that asks for anything from a visitor. It is
 * blue, not purple: it is an IIVO programme, not the product, and the copy
 * says so, because a form on this site has been mistaken for the app's
 * login before.
 */
export function Testers() {
  const perks = [
    { icon: Sparkles, title: 'Early access', body: 'Try new features weeks before everyone else.' },
    { icon: MessageCircleMore, title: 'Direct line', body: 'Your feedback goes straight to the team.' },
    { icon: Users, title: 'Shape the product', body: 'Testers decide what gets fixed and built next.' },
  ];

  return (
    <section id="testers" className="section-shell section-shell--rule">
      <div className="section-inner">
        <div className="testers-banner">
          <div className="testers-copy">
            <p className="section-kicker">
              <FlaskConical size={13} />
              Tester programme
            </p>
            <h2 className="section-title">Help shape OptiStudy.</h2>
            <p className="section-copy">
              We are a small team, and the people who use OptiStudy every day see things we miss. Join the tester programme to try
              new features first and tell us what to change.
            </p>
            <div className="testers-actions">
              <PrimaryButton href={TESTER_URL} className="button--lg">
                Join the tester programme
              </PrimaryButton>
              <span className="testers-note">Takes a minute. Sign in with Google or email.</span>
            </div>
          </div>

          <ul className="testers-perks">
            {perks.map((perk) => {
              const Icon = perk.icon;
              return (
                <li key={perk.title}>
                  <Icon size={18} />
                  <strong>{perk.title}</strong>
                  <span>{perk.body}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Final call to action                                                */
/* ------------------------------------------------------------------ */

export function CTA() {
  return (
    <section id="launch" className="section-shell section-shell--rule">
      <div className="section-inner">
        <div className="cta-banner">
          <div className="section-glow section-glow--tight" aria-hidden="true" />
          <div className="cta-copy">
            <p className="section-kicker section-kicker--opti">
              <OptiMark size="sm" />
              Ready when you are
            </p>
            <h2 className="section-title">Open OptiStudy and start today.</h2>
            <p className="section-copy">
              It is free to start and open to everyone. Create your account inside the app, and it will be waiting for you on every
              device you sign in from.
            </p>
          </div>

          <Spotlight variant="banner" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export function Footer() {
  return (
    <footer id="contact" className="footer-shell">
      <div className="section-inner">
        <div className="footer-layout">
          <div className="footer-brand">
            <div className="footer-wordmark">
              <span className="brand-dot" aria-hidden="true" />
              IIVO
            </div>
            <p>Intelligence. Innovation. Vision. Optimization. Intelligent software that helps people learn better and achieve more.</p>
            <a href="mailto:iivo.contact1@gmail.com" className="text-link">
              <Mail size={14} />
              iivo.contact1@gmail.com
            </a>
          </div>

          <div className="footer-links-grid">
            <div>
              <h3>OptiStudy</h3>
              <a href={OPTISTUDY_APP_URL} className="is-opti" {...EXTERNAL_LINK_PROPS}>
                Open OptiStudy
              </a>
              <a href={OPTISTUDY_APP_URL} {...EXTERNAL_LINK_PROPS}>
                Sign in / create account
              </a>
              <a href="#optistudy">Overview</a>
              <a href="#install">Install the app</a>
            </div>
            <div>
              <h3>Company</h3>
              <a href="#about">About IIVO</a>
              <a href={TESTER_URL}>Tester programme</a>
              <a href="#start">Get started</a>
              <a href="mailto:iivo.contact1@gmail.com">Contact</a>
            </div>
            <div>
              <h3>Social</h3>
              <a href="https://www.youtube.com/@IIVO-t5q" {...EXTERNAL_LINK_PROPS}>
                YouTube
              </a>
              <a href="https://www.instagram.com/iivo.tech/" {...EXTERNAL_LINK_PROPS}>
                Instagram
              </a>
            </div>
            <div>
              <h3>Legal</h3>
              <a href="privacy.html">Privacy Policy</a>
              <a href="terms.html">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} IIVO. All rights reserved.</span>
          <span>
            OptiStudy lives at{' '}
            <a href={OPTISTUDY_APP_URL} {...EXTERNAL_LINK_PROPS}>
              {OPTISTUDY_APP_HOST}
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
