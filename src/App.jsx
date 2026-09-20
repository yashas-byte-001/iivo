import React from 'react';
import { About, Footer, Hero, LaunchBar, Navbar, Product, SECTIONS, Testers } from './components';

const InstallGuide = React.lazy(() => import('./components/InstallGuide'));
const TesterPage = React.lazy(() => import('./components/TesterPage'));

/*
 * The active section is the last one whose top has passed a line a third of
 * the way down the viewport. Picking by "last intersecting entry" made the nav
 * flicker between two sections whenever both were on screen.
 */
function useActiveSection() {
  const [activeSection, setActiveSection] = React.useState('home');

  React.useEffect(() => {
    const elements = SECTIONS.map((section) => document.getElementById(section.id)).filter(Boolean);
    if (elements.length === 0) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.34;
      let current = elements[0].id;
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= line) current = element.id;
      }
      setActiveSection(current);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return activeSection;
}

export default function App() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isTesterPage = pathname.endsWith('tester.html') || pathname.endsWith('/tester');
  const activeSection = useActiveSection();

  if (isTesterPage) {
    return (
      <React.Suspense fallback={null}>
        <TesterPage />
      </React.Suspense>
    );
  }

  return (
    <div className="app-shell">
      <Navbar activeSection={activeSection} />
      <main>
        <Hero />
        {/* The OptiStudy block: the product, its features, how to install it,
            and the tester programme around it. About IIVO comes after. */}
        <Product />
        <React.Suspense fallback={null}>
          <InstallGuide />
        </React.Suspense>
        <Testers />
        <About />
      </main>
      <Footer />
      <LaunchBar activeSection={activeSection} />
    </div>
  );
}
