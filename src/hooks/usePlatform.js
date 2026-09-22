import React from 'react';

/*
 * Which kind of visitor this is, for the one decision the page makes on
 * their behalf: an Android phone gets the app download as its first action,
 * everyone else gets "open OptiStudy" (and the install guide for their
 * device). Read after mount so the first paint is the same for everyone.
 */
export function isAndroid() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  if (/Android/i.test(ua)) return true;
  if (navigator.userAgentData && navigator.userAgentData.platform === 'Android') return true;
  // "Desktop site" on an Android phone reports itself as X11/Linux and drops
  // the word Android; a touch screen that is not Apple's is the next best sign.
  const touch = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const apple = /iPhone|iPad|iPod|Macintosh/.test(ua);
  return touch && !apple && /Linux|X11/.test(ua);
}

export function useIsAndroid() {
  const [android, setAndroid] = React.useState(false);
  React.useEffect(() => {
    setAndroid(isAndroid());
  }, []);
  return android;
}
