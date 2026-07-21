import React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  ChartNoAxesCombined,
  CircleCheckBig,
  ClipboardList,
  Eye,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MessageCircleMore,
  Sparkles,
  Stars,
  TimerReset,
  TrendingUp,
  Zap,
} from 'lucide-react';

const OPTISTUDY_MOCK_SITE_URL = 'https://opti-study-mock.vercel.app/';
const NAV_SCROLL_COLLAPSE_AT = 72;
const NAV_SCROLL_EXPAND_AT = 28;
const JoinWaitlistTeaser = React.lazy(() => import('./components/JoinWaitlistTeaser'));

function useMediaQuery(query) {
  const getMatches = React.useCallback(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia(query).matches;
  }, [query]);

  const [matches, setMatches] = React.useState(getMatches);

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const mediaQuery = window.matchMedia(query);
    const handleChange = (event) => setMatches(event.matches);

    setMatches(mediaQuery.matches);

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, [query]);

  return matches;
}

export function SectionTitle({ kicker, title, description, align = 'left' }) {
  return (
    <div className={`max-w-4xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <p className="section-kicker">{kicker}</p>
      <h2 className="section-title">{title}</h2>
      {description ? <p className="section-copy mt-6">{description}</p> : null}
    </div>
  );
}

export function GlassCard({ className = '', children, ...props }) {
  return (
    <motion.div className={`glass-panel ${className}`} {...props}>
      {children}
    </motion.div>
  );
}

export function FloatingCard({ className = '', children, delay = 0, floating = true, ...props }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={`glass-panel floating-card ${className}`}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] }}
      animate={reduceMotion || !floating ? undefined : { y: [0, -8, 0] }}
      style={reduceMotion || !floating ? undefined : { animationDuration: '8s' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function PrimaryButton({ children, href, className = '', ...props }) {
  const Tag = href ? motion.a : motion.button;

  return (
    <Tag href={href} className={`primary-button ${className}`} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} {...props}>
      <span>{children}</span>
      <ArrowRight size={16} />
    </Tag>
  );
}

export function SecondaryButton({ children, href, className = '', ...props }) {
  const Tag = href ? motion.a : motion.button;

  return (
    <Tag href={href} className={`secondary-button ${className}`} whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} {...props}>
      {children}
    </Tag>
  );
}

function JoinWaitlistTeaserFallback() {
  return (
    <div className="waitlist-teaser">
      <p className="waitlist-teaser-label">Join the waitlist</p>
      <p className="waitlist-teaser-copy">Continue to the dedicated join page to sign in first and complete your profile.</p>
      <PrimaryButton href="join-waitlist.html" className="waitlist-teaser-button" aria-label="Join the waitlist">
        Join waitlist
      </PrimaryButton>
    </div>
  );
}

export function AnimatedGrid() {
  return <div className="animated-grid" aria-hidden="true" />;
}

export function BackgroundEffects({ variant = 'hero' }) {
  const reduceMotion = useReducedMotion();
  const particles = reduceMotion ? [] : [0, 1, 2, 3];

  return (
    <div className={`background-effects background-${variant}`} aria-hidden="true">
      <AnimatedGrid />
      <motion.div className="bg-orb bg-orb-a" animate={reduceMotion ? undefined : { x: [0, 24, 0], y: [0, -16, 0] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="bg-orb bg-orb-b" animate={reduceMotion ? undefined : { x: [0, -18, 0], y: [0, 24, 0] }} transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="bg-orb bg-orb-c" animate={reduceMotion ? undefined : { opacity: [0.25, 0.45, 0.25], scale: [1, 1.08, 1] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
      <div className="particle-layer">
        {particles.map((particle) => (
          <motion.span
            key={particle}
            className="particle"
            style={{ left: `${10 + particle * 11}%`, top: `${18 + (particle % 4) * 15}%` }}
            animate={reduceMotion ? undefined : { y: [0, -8, 0], opacity: [0.18, 0.45, 0.18] }}
            transition={{ duration: 10 + particle, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  );
}

export function Navbar({ activeSection = 'home' }) {
  const reduceMotion = useReducedMotion();
  const isCompactViewport = useMediaQuery('(max-width: 720px)');
  const [scrolled, setScrolled] = React.useState(false);
  const [navExpanded, setNavExpanded] = React.useState(false);

  React.useEffect(() => {
    if (isCompactViewport) {
      setScrolled(false);
      setNavExpanded(false);
      return undefined;
    }

    const updateScrolledState = () => {
      const value = window.scrollY;
      setScrolled((current) => (current ? value > NAV_SCROLL_EXPAND_AT : value > NAV_SCROLL_COLLAPSE_AT));
    };

    updateScrolledState();
    window.addEventListener('scroll', updateScrolledState, { passive: true });

    return () => window.removeEventListener('scroll', updateScrolledState);
  }, [isCompactViewport]);

  React.useEffect(() => {
    if (!scrolled || isCompactViewport) {
      setNavExpanded(false);
    }
  }, [scrolled, isCompactViewport]);

  const links = [
    { label: 'Home', href: '#home' },
    { label: 'About IIVO', href: '#about' },
    { label: 'OptiStudy', href: '#optistudy' },
    { label: 'Our Vision', href: '#why-optistudy' },
    { label: 'Contact', href: '#footer' },
  ];

  return (
    <motion.header
      className={`floating-nav-shell ${scrolled ? 'is-scrolled' : 'is-top'} ${navExpanded ? 'is-expanded' : 'is-collapsed'}`}
      initial={reduceMotion ? false : { opacity: 0, y: -12 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={reduceMotion ? undefined : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.nav
        className={`floating-nav glass-pill ${scrolled ? 'is-scrolled' : 'is-hero'} ${navExpanded ? 'is-expanded' : 'is-collapsed'}`}
        aria-label="Primary navigation"
        transition={reduceMotion ? undefined : { type: 'spring', stiffness: 360, damping: 34, mass: 0.95 }}
      >
        {scrolled && !isCompactViewport ? (
          <button
            type="button"
            className="brand-markup nav-brand-button"
            aria-label={navExpanded ? 'Collapse navigation' : 'Expand navigation'}
            aria-expanded={navExpanded}
            onClick={() => setNavExpanded((value) => !value)}
          >
            IIVO
          </button>
        ) : (
          <a href="#home" className="brand-markup">IIVO</a>
        )}

        <AnimatePresence initial={false}>
          {!isCompactViewport && (!scrolled || navExpanded) && (
            <motion.div
              key="nav-links"
              className="nav-links nav-links-desktop"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {links.map((link) => (
                <a key={link.label} href={link.href} className={activeSection === link.href.slice(1) ? 'is-active' : ''}>
                  {link.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {(!scrolled || navExpanded || isCompactViewport) && (
            <motion.div
              key="nav-actions"
              className="nav-actions"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={reduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              <PrimaryButton href={OPTISTUDY_MOCK_SITE_URL} target="_blank" rel="noreferrer" className="nav-cta">Launch OptiStudy</PrimaryButton>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.nav>
    </motion.header>
  );
}

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="home" className="hero-shell">
      <BackgroundEffects variant="hero" />
      <div className="hero-hemisphere" aria-hidden="true" />
      <div className="hero-center">
        <motion.div className="hero-copy" initial={reduceMotion ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <div className="hero-title-wrap">
            <h1 className="hero-title">
              <span>Intelligence.</span>
              <span>Innovation.</span>
              <span>Vision.</span>
              <span>Optimization.</span>
            </h1>
            <div className="headline-glow" aria-hidden="true" />
          </div>

          <p className="hero-body">IIVO creates intelligent software that helps people learn better and achieve more.</p>

          <div className="hero-actions">
            <PrimaryButton href={OPTISTUDY_MOCK_SITE_URL} target="_blank" rel="noreferrer">Explore OptiStudy</PrimaryButton>
            <SecondaryButton href="join-waitlist.html">Join Waitlist</SecondaryButton>
            <SecondaryButton href="#about">Learn About IIVO</SecondaryButton>
          </div>

          <p className="hero-note">Built with purpose. Designed for the future.</p>
        </motion.div>
      </div>
    </section>
  );
}

export function About() {
  const cards = [
    { title: 'Intelligence', icon: BrainCircuit, description: 'Systems that interpret context and turn it into clear next steps.' },
    { title: 'Innovation', icon: Sparkles, description: 'Quiet product design that feels modern without becoming loud.' },
    { title: 'Vision', icon: Eye, description: 'A brand frame that can grow into a wider platform over time.' },
    { title: 'Optimization', icon: CircleCheckBig, description: 'Less friction, cleaner flows, and better follow-through every day.' },
  ];

  return (
    <section id="about" className="section-shell">
      <div className="section-inner">
        <GlassCard className="about-shell" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.75 }}>
          <div className="about-grid">
            <div className="about-copy">
              <p className="section-kicker">ABOUT IIVO</p>
              <h2 className="section-title">We are IIVO.</h2>
              <p className="section-copy mt-6">IIVO creates intelligent software that helps people learn better and achieve more.</p>
            </div>

            <div className="about-cards">
              {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.article key={card.title} className="about-mini-card glass-panel" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.68, delay: index * 0.06 }} whileHover={{ y: -8 }}>
                    <Icon size={22} />
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

export function Product() {
  const features = ['AI Study Planner', 'Smart Schedule & Calendar', 'Progress Tracking', 'AI Chat Assistant', 'Notes & Summaries', 'And much more...'];

  return (
    <section id="optistudy" className="section-shell opti-shell">
      <div className="section-inner">
        <div className="product-shell glass-panel">
          <div className="product-grid">
            <motion.div className="product-copy" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.75 }}>
              <p className="section-kicker">OptiStudy</p>
              <h2 className="section-title">Your AI-powered academic workspace.</h2>
              <ul className="product-list">
                {features.map((item) => (
                  <li key={item}><span className="product-bullet" aria-hidden="true"><CircleCheckBig size={14} /></span><span>{item}</span></li>
                ))}
              </ul>
              <PrimaryButton href={OPTISTUDY_MOCK_SITE_URL} target="_blank" rel="noreferrer" className="mt-8">Explore OptiStudy</PrimaryButton>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const cards = [
    { title: 'AI Study Planner', description: 'Builds a daily structure from deadlines, workload, and available time.', icon: ClipboardList },
    { title: 'Smart Schedule & Calendar', description: 'Keeps classes, work, and study blocks aligned without manual rework.', icon: CalendarDays },
    { title: 'Progress Tracking', description: 'Shows what is done, what is next, and how much momentum is left.', icon: ChartNoAxesCombined },
    { title: 'AI Chat Assistant', description: 'Answers questions, unblocks next steps, and keeps the flow moving.', icon: MessageCircleMore },
    { title: 'Notes & Summaries', description: 'Turns long sessions into compact, useful study material.', icon: GraduationCap },
    { title: 'And much more...', description: 'A wider workspace that keeps expanding as the product evolves.', icon: Stars },
  ];

  return (
    <section id="why-optistudy" className="section-shell">
      <div className="section-inner">
        <SectionTitle kicker="Why OptiStudy" title="Everything you need to study smarter." />

        <div className="features-grid">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.article key={card.title} className="feature-card glass-panel" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.68, delay: index * 0.05 }} whileHover={{ y: -8, scale: 1.01 }}>
                <Icon size={20} />
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function CTA() {
  return (
    <section id="waitlist" className="section-shell">
      <div className="section-inner">
        <motion.div className="cta-banner glass-panel" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.76 }}>
          <div className="cta-inner">
            <div>
              <p className="section-kicker">Closing CTA</p>
              <h2 className="section-title">Ready to transform the way you study?</h2>
              <p className="section-copy mt-6 max-w-3xl">Be among the first to experience OptiStudy — now live in testing with students shaping how it evolves.</p>
            </div>

            <div className="waitlist-panel waitlist-panel--teaser">
              <React.Suspense fallback={<JoinWaitlistTeaserFallback />}>
                <JoinWaitlistTeaser />
              </React.Suspense>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer id="footer" className="footer-shell">
      <div className="section-inner">
        <div className="footer-divider" />
        <div className="footer-layout">
          <div className="footer-brand">
            <div className="footer-wordmark">IIVO</div>
            <p>Intelligence. Innovation. Vision. Optimization.</p>
          </div>

          <div className="footer-links-grid">
            <div>
              <h3>Company</h3>
              <a href="#about">About IIVO</a>
            </div>
            <div>
              <h3>Product</h3>
              <a href="#optistudy">OptiStudy</a>
            </div>
            <div>
              <h3>Legal</h3>
              <a href="privacy.html">Privacy Policy</a>
              <a href="terms.html">Terms of Service</a>
            </div>
            <div>
              <h3>Social</h3>
              <a href="https://www.youtube.com/@IIVO-t5q" target="_blank" rel="noreferrer">YouTube</a>
              <a href="https://www.instagram.com/iivo.tech/" target="_blank" rel="noreferrer">Instagram</a>
            </div>
            <div className="footer-contact-column">
              <h3>Contact</h3>
              <a href="mailto:iivo.contact1@gmail.com">iivo.contact1@gmail.com</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}