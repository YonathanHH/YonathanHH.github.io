import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * React Router keeps the scroll offset when the route changes, so navigating
 * from halfway down /projects to /cv lands mid-page. Reset it on every
 * pathname change, honouring the user's reduced-motion preference.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, left: 0, behavior: reduced ? 'auto' : 'smooth' });
  }, [pathname]);

  return null;
}
