import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Github, Linkedin, PenTool } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'CV', path: '/cv' },
    { name: 'Biography', path: '/biography' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-[var(--color-bg-light)]/80 dark:bg-[var(--color-bg-dark)]/80 border-b border-[var(--color-primary)]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-[var(--color-primary)]">
              Yonathan HH
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-[var(--color-primary)]",
                  location.pathname === link.path 
                    ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]" 
                    : "text-[var(--color-text-light)] dark:text-[var(--color-text-dark)]"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center space-x-4 ml-4 pl-4 border-l border-gray-300 dark:border-gray-700">
              <a href="https://github.com/YonathanHH" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors" aria-label="GitHub">
                <Github size={20} />
              </a>
              <a href="https://www.linkedin.com/in/yonathanhary/" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="https://medium.com/@yonathanhary1" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors" aria-label="Medium Blog">
                <PenTool size={20} />
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-500 hover:text-[var(--color-primary)] focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] border-b border-[var(--color-primary)]/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium",
                  location.pathname === link.path
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                    : "text-[var(--color-text-light)] dark:text-[var(--color-text-dark)] hover:bg-[var(--color-primary)]/5"
                )}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center space-x-6 px-3 py-4 mt-2 border-t border-[var(--color-primary)]/10">
              <a href="https://github.com/YonathanHH" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors">
                <Github size={24} />
              </a>
              <a href="https://www.linkedin.com/in/yonathanhary/" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="https://medium.com/@yonathanhary1" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors">
                <PenTool size={24} />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
