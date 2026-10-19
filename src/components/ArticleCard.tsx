import { Article } from '../data/articles';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Article index row.
 *
 * A full-width row rather than a third card in a grid, on purpose: the
 * featured-projects grouping on the home page is already an asymmetric grid,
 * and two card grids on one site is the repetition the reader stops seeing.
 * The whole row is the link, so the click target is the row and not a word.
 */
export default function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="reveal group border-t rule">
      <Link
        to={`/articles/${article.id}`}
        className="grid grid-cols-1 items-start gap-5 py-8 md:grid-cols-[minmax(0,1fr)_17rem] md:gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]"
      >
        <div className="order-2 md:order-1">
          <p className="flex items-center gap-3 font-mono text-xs text-[var(--color-ink-500)]">
            <span>{article.date}</span>
            <span>{article.readTime}</span>
          </p>

          <h2 className="mt-3 text-[1.375rem] font-bold leading-[1.25] tracking-[-0.018em] text-balance transition-colors duration-200 group-hover:text-[var(--color-primary-text)] sm:text-[1.625rem]">
            {article.title}
          </h2>

          <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-[1.65] text-[var(--color-ink-600)] dark:text-[var(--color-ink-300)]">
            {article.summary}
          </p>

          <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs font-medium text-[var(--color-primary-text)]">
            Read article
            <ArrowRight
              size={14}
              strokeWidth={2}
              aria-hidden="true"
              className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            />
          </span>
        </div>

        <div className="r-frame order-1 aspect-[2/1] w-full overflow-hidden bg-[var(--color-ink-100)] md:order-2 dark:bg-[var(--color-ink-800)]">
          <img
            src={article.image}
            alt=""
            width={640}
            height={320}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            referrerPolicy="no-referrer"
          />
        </div>
      </Link>
    </article>
  );
}
