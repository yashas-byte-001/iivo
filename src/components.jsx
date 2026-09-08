import React from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
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
  ShieldCheck,
  Sparkles,
  Stars,
  TimerReset,
  TrendingUp,
  Zap,
} from 'lucide-react';

import { EXTERNAL_LINK_PROPS, OPTISTUDY_APP_URL, OPTISTUDY_DEMO_URL, WAITLIST_URL } from './config/links';

const NAV_SCROLL_COLLAPSE_AT = 72;
const NAV_SCROLL_EXPAND_AT = 28;

/* One easing family for the whole site; mirrors --ease in styles.css. */
const EASE = [0.16, 1, 0.3, 1];
const HERO_LINES = ['Intelligence.', 'Innovation.', 'Vision.', 'Optimization.'];

/* Reveals share a shape so sections feel like one system, not six animations. */
const reveal = (delay = 0, distance = 26) => ({
  initial: { opacity: 0, y: distance },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.85, delay, ease: EASE },
});
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

/* A hairline of the same light, tracking how far through the page you are. */
export function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  if (reduceMotion) {
    return null;
  }

  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}

const TILT_SPRING = { stiffness: 150, damping: 18, mass: 0.6 };

/*
 * A card that leans toward the cursor and lights up under it. The rotation runs
 * through motion values rather than CSS custom properties because framer owns
 * the transform on these elements — fighting it from CSS just loses.
 */
function TiltCard({ className = '', delay = 0, distance = 24, children }) {
  const reduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [7, -7]), TILT_SPRING);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-9, 9]), TILT_SPRING);

  const handleMove = (event) => {
    if (reduceMotion) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;

    pointerX.set(localX / rect.width - 0.5);
    pointerY.set(localY / rect.height - 0.5);

    /* The spotlight gradient reads these two. */
    event.currentTarget.style.setProperty('--mx', `${localX}px`);
    event.currentTarget.style.setProperty('--my', `${localY}px`);
  };

  const handleLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.article
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 1000 }}
      {...reveal(delay, distance)}
    >
      {children}
    </motion.article>
  );
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

/*
 * The app is open to the approved pilot roster only. The link stays visible to
 * everyone — the app meets anyone else with its own closed-pilot page — but it
 * is always labelled so nobody clicks it expecting general access.
 */
export function PilotAccessLink({ className = '' }) {
  return (
    <motion.a
      href={OPTISTUDY_APP_URL}
      className={`pilot-link ${className}`}
      whileHover={{ y: -1 }}
      {...EXTERNAL_LINK_PROPS}
    >
      <ShieldCheck size={14} />
      <span>Pilot user? Open OptiStudy</span>
      <ArrowUpRight size={14} />
    </motion.a>
  );
}

function JoinWaitlistTeaserFallback() {
  return (
    <div className="waitlist-teaser">
      <p className="waitlist-teaser-label">Join the waitlist</p>
      <p className="waitlist-teaser-copy">Continue to the dedicated join page to sign in first and complete your profile.</p>
      <PrimaryButton href={WAITLIST_URL} className="waitlist-teaser-button" aria-label="Join the waitlist">
        Join waitlist
      </PrimaryButton>
    </div>
  );
}

export function AnimatedGrid() {
  return <div className="aurora-grid" aria-hidden="true" />;
}

/* One ellipse, three passes: wide spill, soft halo, hairline core. */
const AURORA_PATH = 'M -120 760 A 860 700 0 0 1 1560 760';

/*
 * Lights that travel the orbits. Each rides the upper half of one ellipse, so
 * it enters from the dark at one edge and leaves at the other — the ring is
 * only ever lit where something is moving along it.
 */
const ORBITERS = [
  { id: 'outer', path: 'M -340 910 A 1060 860 0 0 1 1780 910', duration: 34, delay: 0, size: 2.6, trail: 13 },
  { id: 'mid', path: 'M -260 910 A 980 800 0 0 1 1700 910', duration: 26, delay: -9, size: 3.2, trail: 16 },
  { id: 'inner', path: 'M 0 910 A 720 585 0 0 1 1440 910', duration: 19, delay: -14, size: 2.2, trail: 11 },
];

/* Fixed, not random: a rebuild should not reshuffle the sky. */
const STAR_DUST = [
  { id: 1, x: 180, y: 150, r: 1.4, duration: 7, delay: 0 },
  { id: 2, x: 420, y: 96, r: 1, duration: 9, delay: -2 },
  { id: 3, x: 980, y: 128, r: 1.2, duration: 8, delay: -4 },
  { id: 4, x: 1240, y: 208, r: 1.5, duration: 11, delay: -1 },
  { id: 5, x: 620, y: 62, r: 1, duration: 10, delay: -6 },
  { id: 6, x: 1340, y: 92, r: 1.1, duration: 9, delay: -3 },
  { id: 7, x: 96, y: 300, r: 1.2, duration: 12, delay: -5 },
  { id: 8, x: 1180, y: 340, r: 1, duration: 8, delay: -7 },
];

function AuroraArc({ reduceMotion }) {
  return (
    <motion.svg
      className="aurora-svg"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      animate={reduceMotion ? undefined : { opacity: [0.85, 1, 0.85] }}
      transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
    >
      <defs>
        <linearGradient id="aurora-rim" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4f6bff" stopOpacity="0" />
          <stop offset="16%" stopColor="#4f6bff" stopOpacity="0.5" />
          <stop offset="38%" stopColor="#eaf0ff" stopOpacity="0.95" />
          <stop offset="58%" stopColor="#dfe6ff" stopOpacity="0.9" />
          <stop offset="82%" stopColor="#a05cff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#a05cff" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="aurora-spill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4f6bff" stopOpacity="0" />
          <stop offset="22%" stopColor="#4f6bff" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#2fe6c9" stopOpacity="0.28" />
          <stop offset="70%" stopColor="#a05cff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#a05cff" stopOpacity="0" />
        </linearGradient>

        <radialGradient id="aurora-pool" cx="50%" cy="0%" r="70%">
          <stop offset="0%" stopColor="#6076ff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#6076ff" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="orbit-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4f6bff" stopOpacity="0" />
          <stop offset="30%" stopColor="#8ea3ff" stopOpacity="0.22" />
          <stop offset="50%" stopColor="#dfe6ff" stopOpacity="0.32" />
          <stop offset="70%" stopColor="#b08cff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#a05cff" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="comet-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#4f6bff" stopOpacity="0.1" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#a05cff" stopOpacity="0.1" />
        </linearGradient>

        <radialGradient id="orbiter-halo">
          <stop offset="0%" stopColor="#cfd9ff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#cfd9ff" stopOpacity="0" />
        </radialGradient>

        <filter id="aurora-soft" x="-25%" y="-70%" width="150%" height="280%">
          <feGaussianBlur stdDeviation="34" />
        </filter>
        <filter id="aurora-tight" x="-15%" y="-45%" width="130%" height="220%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {/* Light pooling under the ribbon, so it sits in space rather than on top of it. */}
      <ellipse cx="720" cy="300" rx="540" ry="130" fill="url(#aurora-pool)" filter="url(#aurora-soft)" opacity="0.55" />

      {/*
       * Orbits share the arc's centre, so the rings read as paths around the
       * same body the horizon light belongs to. Only their crowns clear the
       * fold; the rest is below the viewport, which is what sells the scale.
       */}
      <g className="orbit-rings">
        <ellipse cx="720" cy="910" rx="1060" ry="860" fill="none" stroke="url(#orbit-stroke)" strokeWidth="1" opacity="0.5" />
        <ellipse cx="720" cy="910" rx="980" ry="800" fill="none" stroke="url(#orbit-stroke)" strokeWidth="1" opacity="0.7" />
        <ellipse cx="720" cy="910" rx="720" ry="585" fill="none" stroke="url(#orbit-stroke)" strokeWidth="1" opacity="0.55" />
      </g>

      <path d={AURORA_PATH} fill="none" stroke="url(#aurora-spill)" strokeWidth="56" filter="url(#aurora-soft)" opacity="0.65" />
      <path d={AURORA_PATH} fill="none" stroke="url(#aurora-rim)" strokeWidth="12" filter="url(#aurora-tight)" opacity="0.75" />
      <path d={AURORA_PATH} fill="none" stroke="url(#aurora-rim)" strokeWidth="1.6" opacity="0.95" />

      {!reduceMotion && (
        <>
          {/*
           * A short bright segment chases the horizon line. Animating the dash
           * offset rather than moving an element means the light follows the
           * curve exactly, and the browser does it on the compositor.
           */}
          <path
            className="arc-comet"
            d={AURORA_PATH}
            fill="none"
            stroke="url(#comet-stroke)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeDasharray="150 4000"
          />

          {ORBITERS.map((orbiter) => (
            <g key={orbiter.id}>
              <circle r={orbiter.trail} fill="url(#orbiter-halo)" opacity="0.5">
                <animateMotion dur={`${orbiter.duration}s`} begin={`${orbiter.delay}s`} repeatCount="indefinite" path={orbiter.path} />
              </circle>
              <circle r={orbiter.size} fill="#f2f5ff" filter="url(#aurora-tight)">
                <animateMotion dur={`${orbiter.duration}s`} begin={`${orbiter.delay}s`} repeatCount="indefinite" path={orbiter.path} />
              </circle>
            </g>
          ))}

          <g className="star-dust">
            {STAR_DUST.map((star) => (
              <circle key={star.id} cx={star.x} cy={star.y} r={star.r} fill="#dfe6ff" opacity="0.4">
                <animate
                  attributeName="opacity"
                  values="0.12;0.55;0.12"
                  dur={`${star.duration}s`}
                  begin={`${star.delay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            ))}
          </g>
        </>
      )}
    </motion.svg>
  );
}

/*
 * Obsidian Aurora: a single ribbon of light plus its spill. The arc breathes,
 * the blooms drift, nothing else moves. Every loop is long, slow and runs on
 * transform/opacity only, so the rig stays cheap and stops under reduced motion.
 */
export function BackgroundEffects({ variant = 'hero' }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className={`background-effects background-${variant}`} aria-hidden="true">
      <AnimatedGrid />

      {variant === 'hero' ? (
        <AuroraArc reduceMotion={reduceMotion} />
      ) : null}

      <motion.div
        className="aurora-bloom aurora-bloom--indigo"
        animate={reduceMotion ? undefined : { x: [0, 42, 0], y: [0, -26, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="aurora-bloom aurora-bloom--violet"
        animate={reduceMotion ? undefined : { x: [0, -36, 0], y: [0, 30, 0] }}
        transition={{ duration: 38, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="aurora-bloom aurora-bloom--teal"
        animate={reduceMotion ? undefined : { opacity: [0.55, 1, 0.55], scale: [1, 1.12, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
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
              <SecondaryButton href={OPTISTUDY_DEMO_URL} className="nav-demo" {...EXTERNAL_LINK_PROPS}>See the demo</SecondaryButton>
              <PrimaryButton href={WAITLIST_URL} className="nav-cta">Join the waitlist</PrimaryButton>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.nav>
    </motion.header>
  );
}

export function Hero() {
  const reduceMotion = useReducedMotion();
  const sectionRef = React.useRef(null);

  /*
   * The copy drifts up and dissolves as the aurora stays put, so the hero
   * hands the page over instead of scrolling away as one flat slab.
   */
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 96]);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  const enter = (delay) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease: EASE },
  });

  return (
    <section id="home" className="hero-shell" ref={sectionRef}>
      <BackgroundEffects variant="hero" />
      <div className="hero-center">
        <motion.div className="hero-copy" style={reduceMotion ? undefined : { y: copyY, opacity: copyOpacity }}>
          <div className="hero-title-wrap">
            <h1 className="hero-title">
              {HERO_LINES.map((line, index) => (
                <motion.span key={line} {...enter(index * 0.09)}>
                  {line}
                </motion.span>
              ))}
            </h1>
          </div>

          <motion.p className="hero-body" {...enter(0.46)}>
            IIVO creates intelligent software that helps people learn better and achieve more.
          </motion.p>

          <motion.div className="hero-actions" {...enter(0.55)}>
            <PrimaryButton href={OPTISTUDY_DEMO_URL} {...EXTERNAL_LINK_PROPS}>See the demo</PrimaryButton>
            <SecondaryButton href={WAITLIST_URL}>Join the waitlist</SecondaryButton>
            <SecondaryButton href="#about">Learn About IIVO</SecondaryButton>
          </motion.div>

          <motion.div className="hero-pilot-wrap" {...enter(0.63)}>
            <PilotAccessLink className="hero-pilot-link" />
          </motion.div>

          <motion.p className="hero-note" {...enter(0.7)}>
            Built with purpose. Designed for the future.
          </motion.p>
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
        <GlassCard className="about-shell" {...reveal(0, 28)}>
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
                  <TiltCard key={card.title} className="about-mini-card glass-panel" delay={index * 0.08} distance={22}>
                    <Icon size={22} />
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </TiltCard>
                );
              })}
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

/*
 * A still life of the product, drawn in markup rather than shipped as a
 * screenshot: it stays sharp at any size, themes with the site, and weighs
 * nothing. It is deliberately generic — the demo is where the real UI lives.
 */
function ProductPreview() {
  const reduceMotion = useReducedMotion();

  const sessions = [
    { subject: 'Physics', title: 'Wave interference recap', time: '09:30', tone: 'indigo' },
    { subject: 'Math', title: 'Integration by parts drill', time: '11:00', tone: 'violet' },
    { subject: 'Chemistry', title: 'Organic reactions recall', time: '15:45', tone: 'teal' },
  ];

  /*
   * The panel walks its own plan while you read: attention moves down the
   * sessions the way a student's would, so the still life is never still.
   */
  const [activeSession, setActiveSession] = React.useState(0);

  React.useEffect(() => {
    if (reduceMotion) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveSession((current) => (current + 1) % sessions.length);
    }, 2600);

    return () => window.clearInterval(timer);
  }, [reduceMotion, sessions.length]);

  return (
    <motion.div className="app-frame" {...reveal(0.1, 30)}>
      <div className="app-frame-bar">
        <span className="app-dot" />
        <span className="app-dot" />
        <span className="app-dot" />
        <p>OptiStudy</p>
      </div>

      <div className="app-frame-body">
        <aside className="app-rail" aria-hidden="true">
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
              <span className="live-dot" aria-hidden="true" />
              3 sessions
            </span>
          </div>

          <ul className="app-sessions">
            {sessions.map((session, index) => (
              <li key={session.title} className={index === activeSession ? 'is-active' : ''}>
                <span className={`app-tone app-tone--${session.tone}`} aria-hidden="true" />
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
                  transition={{ duration: 1.6, ease: EASE, delay: 0.3 }}
                />
              </div>
              <strong>72%</strong>
            </div>

            <div className="app-metric">
              <p className="app-eyebrow">Focus streak</p>
              <strong className="app-metric-figure">12 days</strong>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Product() {
  const features = ['AI Study Planner', 'Smart Schedule & Calendar', 'Progress Tracking', 'AI Chat Assistant', 'Notes & Summaries', 'And much more...'];

  return (
    <section id="optistudy" className="section-shell opti-shell">
      <div className="section-inner">
        <div className="product-shell glass-panel">
          <div className="product-grid">
            <motion.div className="product-copy" {...reveal(0, 24)}>
              <p className="section-kicker">OptiStudy</p>
              <h2 className="section-title">Your AI-powered academic workspace.</h2>
              <ul className="product-list">
                {features.map((item, index) => (
                  <motion.li key={item} {...reveal(index * 0.06, 14)}>
                    <span className="product-bullet" aria-hidden="true"><CircleCheckBig size={14} /></span>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="product-actions">
                <PrimaryButton href={OPTISTUDY_DEMO_URL} {...EXTERNAL_LINK_PROPS}>See the demo</PrimaryButton>
                <PilotAccessLink />
              </div>
              <p className="product-actions-note">The demo is a live preview with sample data — no sign-up needed. The full app is open to our pilot roster.</p>
            </motion.div>

            <ProductPreview />
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
              <TiltCard key={card.title} className="feature-card glass-panel" delay={index * 0.07} distance={24}>
                <Icon size={20} />
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </TiltCard>
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
      <BackgroundEffects variant="section" />
      <div className="section-inner">
        <motion.div className="cta-banner glass-panel" {...reveal(0, 28)}>
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
              <a href={OPTISTUDY_DEMO_URL} {...EXTERNAL_LINK_PROPS}>Live demo</a>
              <a href={OPTISTUDY_APP_URL} {...EXTERNAL_LINK_PROPS}>Open the app (pilot)</a>
              <a href={WAITLIST_URL}>Join the waitlist</a>
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