import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Github, Linkedin, PenTool } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';

/** Icon links, in the order they have always been in. Not part of the nav list
 *  because they are channels, not pages, and they never carry the page marker. */
const channels = [
  { href: 'https://github.com/YonathanHH', label: 'GitHub', Icon: Github },
  { href: 'https://www.linkedin.com/in/yonathanhary/', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://medium.com/@yonathanhary1', label: 'Medium Blog', Icon: PenTool },
];

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: '/projects' },
  { name: 'Articles', path: '/articles' },
  { name: 'CV', path: '/cv' },
  { name: 'Biography', path: '/biography' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Navigating away should never leave the panel hanging open behind the page.
  useEffect(() => setIsOpen(false), [location.pathname]);

  // Escape closes the panel and returns focus to the control that opened it.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setIsOpen(false);
      toggleRef.current?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  return (
    <nav
      className="sticky top-0 w-full bg-[var(--color-ink-50)] dark:bg-[var(--color-surface-dark)]"
      style={{ zIndex: 'var(--z-sticky)' }}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-6">
          {/* Lockup: the mark, then the name in live text.
              The mark is decorative beside the name, so it carries an empty alt
              and the link's accessible name stays exactly "Yonathan Hary".
              It is swapped rather than recoloured in dark mode, because the
              navy stroke would sit at 1.2:1 on the dark ground; the dark asset
              is the same mark with that stroke taken to the bone tone and the
              cyan left alone, which measures 9.1:1.
              The name is set in the text colour rather than the accent, so the
              logo's own two inks are the only brand colours in the lockup and
              the teal stays reserved for interactive state. */}
          <Link
            to="/"
            className="-m-2 flex shrink-0 items-center gap-2.5 rounded-[0.625rem] p-2"
          >
            <picture>
              <source
                srcSet="/logo-mark-dark.png"
                media="(prefers-color-scheme: dark)"
              />
              <img
                src="/logo-mark.png"
                alt=""
                width={165}
                height={128}
                className="h-8 w-auto"
                fetchPriority="high"
                decoding="async"
              />
            </picture>
            <span className="text-[1rem] font-bold tracking-[-0.015em] text-[var(--color-text-light)] dark:text-[var(--color-text-dark)]">
              Yonathan Hary
            </span>
          </Link>

          {/* Desktop. Five items and three channels, one line, always. */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                aria-current={location.pathname === link.path ? 'page' : undefined}
                className="nav-link"
              >
                {link.name}
              </Link>
            ))}

            <div className="ml-3 flex items-center gap-1">
              {channels.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  title={label}
                  className="rounded-[0.625rem] p-2 text-[var(--color-ink-500)] transition-colors duration-200 hover:text-[var(--color-primary-text)]"
                >
                  <Icon size={18} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          {/* Mobile */}
          <div className="flex items-center md:hidden">
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="-mr-2 rounded-[0.625rem] p-2 text-[var(--color-ink-600)] transition-colors hover:text-[var(--color-primary-text)] dark:text-[var(--color-ink-300)]"
            >
              {isOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          id="mobile-menu"
          className="bg-[var(--color-ink-50)] md:hidden dark:bg-[var(--color-surface-dark)]"
        >
          <div className="mx-auto w-full max-w-7xl px-4 pb-6 pt-2 sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                aria-current={location.pathname === link.path ? 'page' : undefined}
                className={cn(
                  'block py-3.5 text-lg font-medium transition-colors',
                  location.pathname === link.path
                    ? 'text-[var(--color-primary-text)]'
                    : 'text-[var(--color-text-light)] dark:text-[var(--color-text-dark)]'
                )}
              >
                {link.name}
              </Link>
            ))}

            <div className="mt-5 flex items-center gap-2">
              {channels.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="rounded-[0.625rem] p-2.5 text-[var(--color-ink-500)] transition-colors hover:text-[var(--color-primary-text)]"
                >
                  <Icon size={20} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
