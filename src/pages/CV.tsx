import { cvSections } from '../data/cv';

/**
 * `meta` is a single authored string of the shape
 * "Organisation • Period", and one education entry carries a
 * third segment for the grade. Split on the last separator so the
 * period sits on its own line and the rest stays together.
 */
function splitMeta(meta: string): { body: string; period: string | null } {
  const cut = meta.lastIndexOf('•');
  if (cut === -1) return { body: meta.trim(), period: null };
  return { body: meta.slice(0, cut).trim(), period: meta.slice(cut + 1).trim() };
}

export default function CV() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <header className="arrive max-w-[62ch]">
        <h1 className="text-[2rem] font-bold leading-[1.06] tracking-[-0.03em] sm:text-[2.75rem]">
          Curriculum Vitae
        </h1>
        <p className="mt-5 text-[1.0625rem] leading-[1.65] text-[var(--color-ink-600)] dark:text-[var(--color-ink-300)]">
          Roles, research, and teaching, most recent first.
        </p>
      </header>

      <div className="mt-14 sm:mt-16">
        {cvSections.map((section) => (
          <section key={section.id} className="mt-14 first:mt-0 sm:mt-20">
            <h2 className="text-[1.375rem] font-bold tracking-[-0.02em] sm:text-[1.625rem]">
              {section.heading}
            </h2>

            <ol className="mt-6">
              {section.entries.map((entry) => {
                const { body, period } = splitMeta(entry.meta);

                return (
                  <li
                    key={entry.title}
                    className="grid gap-x-10 gap-y-3 border-t py-7 rule md:grid-cols-[10rem_minmax(0,1fr)] md:py-8"
                  >
                    <p className="font-mono text-xs leading-[1.7] text-[var(--color-ink-500)]">
                      {period ?? body}
                    </p>

                    <div>
                      <h3 className="text-[1.0625rem] font-bold leading-snug tracking-[-0.012em] sm:text-[1.1875rem]">
                        {entry.title.trim()}
                      </h3>
                      {period !== null && (
                        <p className="mt-1 text-[0.9375rem] text-[var(--color-ink-600)] dark:text-[var(--color-ink-300)]">
                          {body}
                        </p>
                      )}

                      <ul className="mt-4 space-y-2.5">
                        {entry.points.map((point) => (
                          <li
                            key={point}
                            className="relative pl-5 text-[0.9375rem] leading-[1.7] text-[var(--color-ink-600)] before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-2.5 before:bg-[var(--color-primary)] dark:text-[var(--color-ink-300)]"
                          >
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
