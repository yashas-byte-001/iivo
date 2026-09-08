/*
 * Single source of truth for the OptiStudy destinations.
 *
 * There are two very different products behind these links, and visitors must
 * never be confused about which one they are opening:
 *
 *  - DEMO is the public mock. Anyone can open it to see how OptiStudy looks.
 *  - APP is the real product. It is open to the approved pilot roster only;
 *    everyone else is met by the app's own closed-pilot page.
 */
export const OPTISTUDY_DEMO_URL = 'https://opti-study-mock.vercel.app/';
export const OPTISTUDY_APP_URL = 'https://opti-study-v0-2.vercel.app';

export const WAITLIST_URL = 'join-waitlist.html';
export const WAITLIST_DETAILS_URL = 'join-waitlist-details.html';

/* Spread onto any anchor that leaves iivo.org. */
export const EXTERNAL_LINK_PROPS = { target: '_blank', rel: 'noreferrer' };
