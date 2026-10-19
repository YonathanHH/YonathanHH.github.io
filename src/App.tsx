import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';

// Home is the landing route, so it ships in the initial bundle. The rest are
// split out; the CV, biography and article bodies are large and rarely the
// first thing a visitor needs.
// The assistant widget carries the markdown renderer and the search index, and
// nothing on first paint depends on it, so let it arrive after the page does.
const PortfolioChatbot = lazy(() => import('./components/PortfolioChatbot'));

const Projects = lazy(() => import('./pages/Projects'));
const CV = lazy(() => import('./pages/CV'));
const Biography = lazy(() => import('./pages/Biography'));
const Articles = lazy(() => import('./pages/Articles'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));

/** Matches the shape of every page header, so the swap does not jump. */
function RouteFallback() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8"
    >
      <div className="h-9 w-2/3 max-w-sm rounded-[0.625rem] bg-[var(--color-ink-500)]/12" />
      <div className="mt-6 h-4 w-full max-w-xl rounded-full bg-[var(--color-ink-500)]/12" />
      <div className="mt-3 h-4 w-4/5 max-w-lg rounded-full bg-[var(--color-ink-500)]/12" />
      <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4">
            <div className="aspect-[2/1] rounded-[0.875rem] bg-[var(--color-ink-500)]/12" />
            <div className="h-3 w-1/3 rounded-full bg-[var(--color-ink-500)]/12" />
            <div className="h-5 w-4/5 rounded-full bg-[var(--color-ink-500)]/12" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}

/**
 * The app uses HashRouter, so a plain `href="#main-content"` would overwrite the
 * route in the hash. Move focus manually instead and leave the URL alone.
 */
function SkipToContent() {
  return (
    <a
      href="#main-content"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById('main-content')?.focus();
      }}
      className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:rounded-[0.625rem] focus:bg-[var(--color-primary)] focus:px-4 focus:py-2 focus:font-medium focus:text-white focus:shadow-lg"
      style={{ zIndex: 'var(--z-overlay)' }}
    >
      Skip to main content
    </a>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex min-h-dvh flex-col">
        <SkipToContent />
        <ScrollToTop />
        <Navbar />
        <main id="main-content" tabIndex={-1} className="flex-grow">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/cv" element={<CV />} />
              <Route path="/biography" element={<Biography />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:id" element={<ArticleDetail />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <Suspense fallback={null}>
          <PortfolioChatbot />
        </Suspense>
      </div>
    </Router>
  );
}
