import React from 'react';
import { ArrowLeft, ArrowUpRight, FlaskConical, MessageSquareText, Sparkles, Users } from 'lucide-react';
import TesterForm from './TesterForm';
import { EXTERNAL_LINK_PROPS, OPTISTUDY_APP_URL } from '../config/links';

const PERKS = [
  { icon: Sparkles, title: 'Early access to new features', body: 'Try what we are building weeks before it reaches everyone else.' },
  { icon: MessageSquareText, title: 'A direct line to the team', body: 'Your feedback goes straight to the people building OptiStudy.' },
  { icon: Users, title: 'Shape the product', body: 'Testers decide what gets fixed first and what gets built next.' },
];

/*
 * The tester programme page. Two columns: why join, and the form. The only
 * sign-in on iivo.org lives here, and the copy says so, because visitors
 * have confused this site's forms with the product's login before.
 */
export default function TesterPage() {
  return (
    <div className="tester-page">
      <div className="hero-glow" aria-hidden="true" />

      <header className="tester-topbar">
        <a href="/" className="brand-markup">
          <span className="brand-dot" aria-hidden="true" />
          IIVO
        </a>
        <div className="tester-topbar-actions">
          <a href="/" className="secondary-button button--sm">
            <ArrowLeft size={15} />
            Back to home
          </a>
          <a href={OPTISTUDY_APP_URL} className="opti-button button--sm" {...EXTERNAL_LINK_PROPS}>
            Open OptiStudy
            <ArrowUpRight size={15} />
          </a>
        </div>
      </header>

      <main className="tester-shell">
        <div className="tester-copy">
          <p className="section-kicker">
            <FlaskConical size={13} />
            Tester programme
          </p>
          <h1 className="section-title">Help shape OptiStudy.</h1>
          <p className="section-copy">
            We are a small team, and the people who use OptiStudy every day see things we miss. Join the tester programme and
            you will hear about new features first, try them early, and tell us what to change.
          </p>

          <ul className="tester-perks">
            {PERKS.map((perk) => {
              const Icon = perk.icon;
              return (
                <li key={perk.title}>
                  <Icon size={18} />
                  <div>
                    <strong>{perk.title}</strong>
                    <span>{perk.body}</span>
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="tester-aside">
            This sign-in is for the tester programme only. To use OptiStudy itself, open the app and sign in there.
          </p>
        </div>

        <TesterForm />
      </main>
    </div>
  );
}
