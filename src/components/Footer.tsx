import { Github, Linkedin, Mail, PenTool } from 'lucide-react';

/** Channel links, same four, same destinations, same screen-reader labels. */
const channels = [
  { href: 'https://github.com/YonathanHH', label: 'GitHub', Icon: Github },
  { href: 'https://www.linkedin.com/in/yonathanhary/', label: 'LinkedIn', Icon: Linkedin },
  { href: 'https://medium.com/@yonathanhary1', label: 'Medium', Icon: PenTool },
  { href: 'mailto:yonathanhary1@gmail.com', label: 'Email', Icon: Mail },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-[var(--color-ink-50)] py-8 dark:bg-[var(--color-surface-dark)]">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center lg:px-8">
        <p className="text-[0.8125rem] text-[var(--color-ink-500)]">
          © {new Date().getFullYear()} Yonathan Hary Hutagalung. All rights reserved.
        </p>
        <div className="flex items-center gap-1">
          {channels.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              {...(label === 'Email' ? {} : { target: '_blank', rel: 'noreferrer' })}
              title={label}
              className="rounded-[0.625rem] p-2 text-[var(--color-ink-500)] transition-colors duration-200 hover:text-[var(--color-primary-text)]"
            >
              <span className="sr-only">{label}</span>
              <Icon size={18} strokeWidth={1.75} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
