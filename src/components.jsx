import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CalendarDays,
  ChartNoAxesCombined,
  CircleCheckBig,
  ClipboardList,
  Eye,
  GraduationCap,
  Mail,
  Menu,
  MessageCircleMore,
  MonitorDown,
  ShieldCheck,
  Sparkles,
  Stars,
  Users,
  X,
} from 'lucide-react';

import { EXTERNAL_LINK_PROPS, OPTISTUDY_APP_URL, OPTISTUDY_DEMO_URL, WAITLIST_URL } from './config/links';

const EASE = [0.16, 1, 0.3, 1];

/*
 * The site map. Nav, mobile sheet and footer all read from this so a section
 * can never be reachable from one and missing from another.
 */
export const SECTIONS = [
  { id: 'home', label: 'Home', hint: 'Start here' },
  { id: 'access', label: 'Get access', hint: 'Waitlist → pilot → install' },
  { id: 'about', label: 'About', hint: 'Who we are' },
  { id: 'optistudy', label: 'OptiStudy', hint: 'The product' },
  { id: 'install', label: 'Get the app', hint: 'Install on any device' },
  { id: 'waitlist', label: 'Waitlist', hint: 'Reserve a spot' },
  { id: 'contact', label: 'Contact', hint: 'Reach us' },
];

const NAV_LINKS = SECTIONS.filter((section) => section.id !== 'home');

/* One reveal shape for every section, so the page scrolls as one system. */
const reveal = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, delay, ease: EASE },
});

const JoinWaitlistTeaser = React.lazy(() => import('./components/JoinWaitlistTeaser'));

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

/* Purple means "opens the OptiStudy app". Nothing else on the site is purple. */
export function OptiButton({ children, href = OPTISTUDY_APP_URL, className = '', ghost = false, ...props }) {
  return (
    <a href={href} className={`opti-button ${ghost ? 'opti-button--ghost' : ''} ${className}`} {...EXTERNAL_LINK_PROPS} {...props}>
      {children}
    </a>
  );
}

/*
 * The one decision every visitor has to make, put in front of them as two
 * doors rather than a button and a footnote. Pilot users kept opening the demo
 * and typing their credentials into it, so each door says who it is for, and
 * the demo door says outright that pilot credentials do not work there.
 */
export function OptiStudyPaths({ variant = 'hero', ...props }) {
  return (
    <div className={`path-chooser path-chooser--${variant}`} {...props}>
      <a href={OPTISTUDY_APP_URL} className="path-card path-card--pilot" {...EXTERNAL_LINK_PROPS}>
        <span className="path-badge">
          <ShieldCheck size={13} />
          Pilot users
        </span>
        <span className="path-title">
          Open OptiStudy
          <ArrowUpRight size={20} />
        </span>
        <span className="path-copy">
          <strong>The real app.</strong> Sign in with the pilot credentials we sent you.
        </span>
      </a>

      <a href={OPTISTUDY_DEMO_URL} className="path-card path-card--demo" {...EXTERNAL_LINK_PROPS}>
        <span className="path-badge">
          <Eye size={13} />
          Everyone else
        </span>
        <span className="path-title">
          Try the demo
          <ArrowUpRight size={20} />
        </span>
        <span className="path-copy">
          <strong>A preview with sample data.</strong> No sign-in needed &mdash; pilot credentials won&rsquo;t work here.
        </span>
      </a>
    </div>
  );
}

/* Kept for the join pages, which render it behind their form. */
export function BackgroundEffects() {
  return <div className="background-effects" aria-hidden="true" />;
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
            IIVO
          </a>

          <nav className="nav-links" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a key={link.id} href={`#${link.id}`} className={activeSection === link.id ? 'is-active' : ''}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <OptiButton ghost className="button--sm">
              <ShieldCheck size={15} />
              Pilot sign-in
            </OptiButton>
            <PrimaryButton href={WAITLIST_URL} className="button--sm">
              Join the waitlist
            </PrimaryButton>
          </div>

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
          <OptiButton>
            <ShieldCheck size={16} />
            Pilot sign-in — open OptiStudy
          </OptiButton>
          <PrimaryButton href={WAITLIST_URL}>Join the waitlist</PrimaryButton>
          <SecondaryButton href={OPTISTUDY_DEMO_URL} {...EXTERNAL_LINK_PROPS}>
            Try the public demo
          </SecondaryButton>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

export function Hero() {
  const reduceMotion = useReducedMotion();

  const enter = (delay) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section id="home" className="hero-shell">
      <BackgroundEffects />
      <div className="hero-inner">
        <motion.a href="#access" className="status-pill" {...enter(0)}>
          <span className="live-dot" aria-hidden="true" />
          <strong>OptiStudy is live in pilot</strong>
          <em>Waitlist open for the next cohort</em>
        </motion.a>

        <motion.h1 className="hero-title" {...enter(0.08)}>
          Intelligent software that helps people <em>learn better</em> and achieve more.
        </motion.h1>

        <motion.p className="hero-body" {...enter(0.16)}>
          IIVO builds tools for students. Our first product, OptiStudy, is an AI-powered academic workspace &mdash; now in a closed pilot,
          with the waitlist open for everyone else.
        </motion.p>

        <motion.div {...enter(0.24)} style={{ width: '100%' }}>
          <OptiStudyPaths />
        </motion.div>

        <motion.div className="hero-actions" {...enter(0.32)}>
          <PrimaryButton href={WAITLIST_URL} className="button--lg">
            Join the waitlist
          </PrimaryButton>
          <SecondaryButton href="#install" className="button--lg">
            <MonitorDown size={16} />
            How to install the app
          </SecondaryButton>
        </motion.div>

        <motion.p className="hero-foot" {...enter(0.4)}>
          <span>Works on iPhone, Android, Windows, macOS and Linux</span>
          <span>No app store needed</span>
        </motion.p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* How access works                                                    */
/* ------------------------------------------------------------------ */

export function AccessSteps() {
  const steps = [
    {
      icon: Users,
      title: 'Join the waitlist',
      body: 'Sign in and tell us a little about yourself. It takes a minute, and your spot stays tied to your account.',
      link: { label: 'Join now', href: WAITLIST_URL },
    },
    {
      icon: Mail,
      title: 'Get your pilot invite',
      body: 'We open OptiStudy to new cohorts in waves. When it is your turn, we email pilot credentials to the address you signed up with.',
      link: { label: 'Try the demo meanwhile', href: OPTISTUDY_DEMO_URL, external: true },
    },
    {
      icon: MonitorDown,
      title: 'Install and sign in',
      body: 'Add OptiStudy to your phone, tablet or computer in a few taps, then sign in with your pilot credentials.',
      link: { label: 'Installation guide', href: '#install' },
    },
  ];

  return (
    <section id="access" className="section-shell section-shell--alt section-shell--rule">
      <div className="section-inner">
        <div className="section-head section-head--split">
          <div>
            <p className="section-kicker">How access works</p>
            <h2 className="section-title">OptiStudy is rolling out in cohorts.</h2>
          </div>
          <p className="section-copy">
            We are onboarding students in small groups so every pilot user gets real attention. Three steps take you from the waitlist
            to the app on your own device.
          </p>
        </div>

        <div className="access-steps">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.article key={step.title} className="access-step" {...reveal(index * 0.08)}>
                <div className="access-step-index">
                  <span>0{index + 1}</span>
                  <Icon size={20} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                <a href={step.link.href} className="text-link" {...(step.link.external ? EXTERNAL_LINK_PROPS : {})}>
                  {step.link.label}
                  <ArrowRight size={14} />
                </a>
              </motion.article>
            );
          })}
        </div>
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
    <section id="about" className="section-shell">
      <div className="section-inner">
        <div className="about-grid">
          <motion.div className="about-copy" {...reveal()}>
            <p className="section-kicker">About IIVO</p>
            <h2 className="section-title">We are IIVO.</h2>
            <p className="section-copy">
              IIVO creates intelligent software that helps people learn better and achieve more. We are a small team building for
              students first, starting with the hours they spend planning, studying and keeping track of it all.
            </p>
            <p className="section-copy">
              The name is the four things we hold ourselves to: Intelligence, Innovation, Vision, Optimization.
            </p>
          </motion.div>

          <div className="about-list">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div key={value.title} className="about-item" {...reveal(index * 0.06)}>
                  <Icon size={20} />
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* OptiStudy                                                           */
/* ------------------------------------------------------------------ */

/*
 * A still life of the product, drawn in the app's own dark purple so a visitor
 * sees what OptiStudy looks like before they open it. Deliberately generic —
 * the demo is where the real UI lives.
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
    <motion.div className="app-frame" {...reveal(0.1)} aria-hidden="true">
      <div className="app-frame-bar">
        <span className="app-dot" />
        <span className="app-dot" />
        <span className="app-dot" />
        <p>OptiStudy</p>
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
                <motion.span
                  initial={reduceMotion ? false : { width: 0 }}
                  whileInView={{ width: '72%' }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 1.4, ease: EASE, delay: 0.3 }}
                />
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
    </motion.div>
  );
}

export function Product() {
  const features = [
    { title: 'AI study planner', body: 'Builds a daily structure from deadlines, workload and free time.', icon: ClipboardList },
    { title: 'Smart schedule & calendar', body: 'Keeps classes, work and study blocks aligned without rework.', icon: CalendarDays },
    { title: 'Progress tracking', body: 'Shows what is done, what is next and how much momentum is left.', icon: ChartNoAxesCombined },
    { title: 'AI chat assistant', body: 'Answers questions about your own notes and unblocks next steps.', icon: MessageCircleMore },
    { title: 'Notes & summaries', body: 'Turns long sessions into compact, useful study material.', icon: GraduationCap },
    { title: 'And more on the way', body: 'The workspace keeps expanding as pilot feedback comes in.', icon: Stars },
  ];

  return (
    <section id="optistudy" className="section-shell section-shell--rule">
      <div className="section-inner">
        <div className="product-grid">
          <motion.div className="product-copy" {...reveal()}>
            <p className="section-kicker section-kicker--opti">OptiStudy</p>
            <h2 className="section-title">Your academic life, understood.</h2>
            <p className="section-copy">
              OptiStudy is an AI-powered academic workspace. Plan your study, ask questions about your own notes, and keep track of what
              you have actually covered &mdash; in one place, on every device.
            </p>

            <ul className="product-features">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <li key={feature.title}>
                    <Icon size={18} />
                    <div>
                      <strong>{feature.title}</strong>
                      <span>{feature.body}</span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <OptiStudyPaths variant="product" />
          </motion.div>

          <ProductPreview />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Waitlist                                                            */
/* ------------------------------------------------------------------ */

function JoinWaitlistTeaserFallback() {
  return (
    <div className="waitlist-teaser">
      <p className="waitlist-teaser-label">Join the waitlist</p>
      <p className="waitlist-teaser-copy">Continue to the join page to sign in and complete your profile.</p>
      <PrimaryButton href={WAITLIST_URL} className="waitlist-teaser-button">
        Join waitlist
      </PrimaryButton>
    </div>
  );
}

export function CTA() {
  return (
    <section id="waitlist" className="section-shell section-shell--alt section-shell--rule">
      <div className="section-inner">
        <motion.div className="cta-banner" {...reveal()}>
          <div>
            <p className="section-kicker">Waitlist</p>
            <h2 className="section-title">Ready to change the way you study?</h2>
            <p className="section-copy">
              Be among the first to use OptiStudy. Pilot cohorts are invited from the waitlist in order, and every invite comes with
              credentials for the real app.
            </p>
          </div>

          <div className="waitlist-panel">
            <React.Suspense fallback={<JoinWaitlistTeaserFallback />}>
              <JoinWaitlistTeaser />
            </React.Suspense>
          </div>
        </motion.div>
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
            <div className="footer-wordmark">IIVO</div>
            <p>Intelligence. Innovation. Vision. Optimization. Intelligent software that helps people learn better and achieve more.</p>
            <a href="mailto:iivo.contact1@gmail.com" className="text-link">
              <Mail size={14} />
              iivo.contact1@gmail.com
            </a>
          </div>

          <div className="footer-links-grid">
            <div>
              <h3>Company</h3>
              <a href="#about">About IIVO</a>
              <a href="#access">How access works</a>
              <a href="#waitlist">Join the waitlist</a>
            </div>
            <div>
              <h3>OptiStudy</h3>
              <a href="#optistudy">Overview</a>
              <a href={OPTISTUDY_APP_URL} className="is-opti" {...EXTERNAL_LINK_PROPS}>
                Pilot sign-in (real app)
              </a>
              <a href={OPTISTUDY_DEMO_URL} {...EXTERNAL_LINK_PROPS}>
                Public demo
              </a>
              <a href="#install">Install the app</a>
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
          <span>OptiStudy is currently in a closed pilot.</span>
        </div>
      </div>
    </footer>
  );
}
