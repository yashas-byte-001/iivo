import React from 'react';
import { About, CTA, Features, Footer, Hero, Navbar, Product } from './components';
const WaitlistPopup = React.lazy(() => import('./components/WaitlistPopup'));

const JoinWaitlistPage = React.lazy(() => import('./components/JoinWaitlistPage'));
const JoinWaitlistDetailsPage = React.lazy(() => import('./components/JoinWaitlistDetailsPage'));

function useActiveSection() {
  const [activeSection, setActiveSection] = React.useState('home');

  React.useEffect(() => {
    const sectionIds = ['home', 'about', 'optistudy', 'why-optistudy', 'footer'];
    const elements = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    if (elements.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        threshold: 0.3,
        rootMargin: '-15% 0px -55% 0px',
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return activeSection;
}

export default function App() {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const isJoinWaitlistPage = pathname.endsWith('join-waitlist.html');
  const isJoinWaitlistDetailsPage = pathname.endsWith('join-waitlist-details.html');
  const activeSection = useActiveSection();
  const heroVisible = activeSection === 'home';

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
      <Navbar activeSection={activeSection} heroVisible={heroVisible} />
      <React.Suspense fallback={null}>
        <WaitlistPopup />
      </React.Suspense>
      <main>
        <Hero />
        <About />
        <Product />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}