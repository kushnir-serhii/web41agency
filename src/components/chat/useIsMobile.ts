import { useSyncExternalStore } from 'react';

const MOBILE_QUERY = '(max-width: 1023px)';

const subscribe = (onChange: () => void): (() => void) => {
  const mql = window.matchMedia(MOBILE_QUERY);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
};

const getSnapshot = (): boolean => window.matchMedia(MOBILE_QUERY).matches;
const getServerSnapshot = (): boolean => false;

export const useIsMobile = (): boolean =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
