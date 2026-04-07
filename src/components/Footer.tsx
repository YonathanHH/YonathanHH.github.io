import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-primary)]/20 bg-[var(--color-bg-light)] dark:bg-[var(--color-bg-dark)] py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} Yonathan Hary Hutagalung. All rights reserved.
          </p>
        </div>
        <div className="flex space-x-6">
          <a href="https://github.com/YonathanHH" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors">
            <span className="sr-only">GitHub</span>
            <Github size={20} />
          </a>
          <a href="https://www.linkedin.com/in/yonathanhary/" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors">
            <span className="sr-only">LinkedIn</span>
            <Linkedin size={20} />
          </a>
          <a href="mailto:yonathanhary1@gmail.com" className="text-gray-500 hover:text-[var(--color-primary)] transition-colors">
            <span className="sr-only">Email</span>
            <Mail size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}
