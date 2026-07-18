import React from 'react';
import { About, CTA, Features, Footer, Hero, Navbar, Product } from './components';
import { supabase } from './lib/supabase';

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
  const activeSection = useActiveSection();
  const heroVisible = activeSection === 'home';
  // No password-recovery handling — removed per design change to keep auth flows simple and inside the modal.

  return (
    <div className="app-shell">
      {/* Password recovery removed — modal and flows were intentionally removed. */}
      <Navbar activeSection={activeSection} heroVisible={heroVisible} />
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