import React from 'react';
import { ArrowLeft, ArrowUpRight, FlaskConical } from 'lucide-react';
import TesterForm from './TesterForm';
import { EXTERNAL_LINK_PROPS, OPTISTUDY_APP_URL } from '../config/links';

/*
 * The tester programme page: the form, and nothing in front of it. The pitch
 * and the perks live on the home page, which is where the visitor came from.
 * The two-column version put them here too, and on a phone that pushed the
 * sign-in a full screen down: people tapped "Join", saw a page of copy, and
 * left believing they had joined. Now the first thing on screen is the step
 * they have to take, before and after signing in. The only sign-in on
 * iivo.org lives here, and the note says so, because visitors have confused
 * this site's forms with the product's login before.
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
          <a href="/" className="secondary-button button--sm" aria-label="Back to home">
            <ArrowLeft size={15} />
            <span>Back to home</span>
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
          <h1 className="section-title">Join the tester programme</h1>
          <p className="section-copy">Sign in, tell us a little about yourself, and you are in. About a minute.</p>
        </div>

        <TesterForm />

        <p className="tester-aside">
          This sign-in is for the tester programme only. To use OptiStudy itself,{' '}
          <a href={OPTISTUDY_APP_URL} {...EXTERNAL_LINK_PROPS}>
            open the app
          </a>{' '}
          and sign in there.
        </p>
      </main>
    </div>
  );
}
