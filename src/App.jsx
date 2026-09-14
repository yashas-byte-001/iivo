import React from 'react';
import { About, AccessSteps, CTA, Footer, Hero, Navbar, Product, SECTIONS } from './components';

const WaitlistPopup = React.lazy(() => import('./components/WaitlistPopup'));
const InstallGuide = React.lazy(() => import('./components/InstallGuide'));
const JoinWaitlistPage = React.lazy(() => import('./components/JoinWaitlistPage'));
const JoinWaitlistDetailsPage = React.lazy(() => import('./components/JoinWaitlistDetailsPage'));

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
  const isJoinWaitlistPage = pathname.endsWith('join-waitlist.html');
  const isJoinWaitlistDetailsPage = pathname.endsWith('join-waitlist-details.html');
  const activeSection = useActiveSection();

  if (isJoinWaitlistPage) {
    return (
      <React.Suspense fallback={null}>
        <JoinWaitlistPage />
      </React.Suspense>
    );
  }

  if (isJoinWaitlistDetailsPage) {
    return (
      <React.Suspense fallback={null}>
        <JoinWaitlistDetailsPage />
      </React.Suspense>
    );
  }

  return (
    <div className="app-shell">
      <Navbar activeSection={activeSection} />
      <React.Suspense fallback={null}>
        <WaitlistPopup />
      </React.Suspense>
      <main>
        <Hero />
        <AccessSteps />
        <About />
        <Product />
        <React.Suspense fallback={null}>
          <InstallGuide />
        </React.Suspense>
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
