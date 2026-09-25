/*
 * Single source of truth for where OptiStudy lives.
 *
 * There is exactly one destination. OptiStudy is open to everyone, and every
 * account action — creating one, signing in, resetting a password — happens
 * inside the app at this address, never on iivo.org. Visitors kept looking for
 * a login form on this site, so every button that mentions signing in must
 * point here.
 */
export const OPTISTUDY_APP_URL = 'https://optistudy.in';
export const OPTISTUDY_APP_HOST = 'optistudy.in';

/* How to install OptiStudy on each device (a PWA from the browser — the
   Android APK is retired). */
export const OPTISTUDY_DOWNLOAD_URL = 'https://optistudy.in/download';

/* The tester programme page: the one sign-in on iivo.org, and it is for the
   programme, not for OptiStudy. */
export const TESTER_URL = 'tester.html';

/* Spread onto any anchor that leaves iivo.org. */
export const EXTERNAL_LINK_PROPS = { target: '_blank', rel: 'noreferrer' };
