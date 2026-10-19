import { articles } from '../data/articles';
import ArticleCard from '../components/ArticleCard';

export default function Articles() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <header className="arrive max-w-[62ch]">
        <h1 className="text-[2rem] font-bold leading-[1.06] tracking-[-0.03em] sm:text-[2.75rem]">
          Articles &amp; Insights
        </h1>
        <p className="mt-5 text-[1.0625rem] leading-[1.65] text-[var(--color-ink-600)] dark:text-[var(--color-ink-300)]">
          Thoughts, tutorials, and insights on data science, machine learning, and sustainable
          energy.
        </p>
      </header>

      {/* Rows, not a third card grid. The home page already runs an asymmetric
          grid for featured work; repeating that shape here is the repetition a
          reader stops registering. */}
      <div className="mt-12 sm:mt-16">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
