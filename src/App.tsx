/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';

// Home is the landing route, so it ships in the initial bundle. The rest are
// split out — the CV, biography and article bodies are large and rarely the
// first thing a visitor needs.
// The assistant widget carries the markdown renderer and the search index, and
// nothing on first paint depends on it — let it arrive after the page does.
const PortfolioChatbot = lazy(() => import('./components/PortfolioChatbot'));

const Projects = lazy(() => import('./pages/Projects'));
const CV = lazy(() => import('./pages/CV'));
const Biography = lazy(() => import('./pages/Biography'));
const Articles = lazy(() => import('./pages/Articles'));
const ArticleDetail = lazy(() => import('./pages/ArticleDetail'));

function RouteFallback() {
  return (
    <div
      role="status"
      aria-label="Loading page"
      className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20"
    >
      <div className="h-10 w-2/3 max-w-md rounded-lg bg-[var(--color-primary)]/10 animate-pulse" />
      <div className="mt-6 h-5 w-full max-w-2xl rounded bg-[var(--color-primary)]/10 animate-pulse" />
      <div className="mt-3 h-5 w-5/6 max-w-xl rounded bg-[var(--color-primary)]/10 animate-pulse" />
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-80 rounded-xl bg-[var(--color-primary)]/10 animate-pulse"
          />
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
      className="sr-only focus:not-sr-only focus:fixed focus:z-[60] focus:top-3 focus:left-3 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[var(--color-primary)] focus:text-white focus:font-medium focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
}

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
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
