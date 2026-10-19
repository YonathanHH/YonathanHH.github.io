import { biography } from '../data/biography';

/**
 * Prose, not a panel.
 *
 * The previous build wrapped this in a white card with a border and a shadow,
 * which is elevation doing no work: nothing is stacked on top of the text, so
 * the card only added a second rectangle for the eye to parse. Reading
 * measure, rhythm, and one hairline before the summary carry it instead.
 */
export default function Biography() {
  const [lead, ...rest] = biography.intro;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <header className="arrive">
        <h1 className="text-[2rem] font-bold leading-[1.06] tracking-[-0.03em] sm:text-[2.75rem]">
          Biography
        </h1>
      </header>

      <div className="mt-10 sm:mt-12">
        <p className="text-[1.125rem] leading-[1.7] tracking-[-0.008em] sm:text-[1.25rem]">
          <strong className="font-bold">Yonathan Hary Hutagalung</strong>
          {lead.replace('Yonathan Hary Hutagalung', '')}
        </p>

        {rest.map((paragraph) => (
          <p
            key={paragraph}
            className="mt-6 text-[1.0625rem] leading-[1.75] text-[var(--color-ink-600)] dark:text-[var(--color-ink-300)]"
          >
            {paragraph}
          </p>
        ))}

        <section className="mt-14 border-t pt-10 rule sm:mt-16">
          <h2 className="text-[1.375rem] font-bold tracking-[-0.02em] text-[var(--color-primary-text)] sm:text-[1.5rem]">
            {biography.profileSummaryHeading}
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-[1.75] text-[var(--color-ink-600)] dark:text-[var(--color-ink-300)]">
            {biography.profileSummary}
          </p>
        </section>
      </div>
    </div>
  );
}
