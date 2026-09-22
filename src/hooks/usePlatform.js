import React from 'react';

/*
 * Which kind of visitor this is, for the one decision the page makes on
 * their behalf: an Android phone gets the app download as its first action,
 * everyone else gets "open OptiStudy" (and the install guide for their
 * device). Read after mount so the first paint is the same for everyone.
 */
export function isAndroid() {
  return typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent || '');
}

export function useIsAndroid() {
  const [android, setAndroid] = React.useState(false);
  React.useEffect(() => {
    setAndroid(isAndroid());
  }, []);
  return android;
}
