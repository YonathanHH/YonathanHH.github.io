import { useParams, Link, Navigate } from 'react-router-dom';
import { articles } from '../data/articles';
import { ArrowLeft } from 'lucide-react';
import Markdown from 'react-markdown';

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return <Navigate to="/articles" replace />;
  }

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <Link
        to="/articles"
        className="inline-flex items-center gap-2 font-mono text-xs font-medium text-[var(--color-primary-text)]"
      >
        <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" />
        Back to Articles
      </Link>

      <header className="mt-8">
        <p className="flex items-center gap-3 font-mono text-xs text-[var(--color-ink-500)]">
          <span>{article.date}</span>
          <span>{article.readTime}</span>
        </p>

        <h1 className="mt-4 text-[1.875rem] font-bold leading-[1.12] tracking-[-0.028em] text-balance sm:text-[2.5rem]">
          {article.title}
        </h1>
      </header>

      <div className="r-frame mt-9 aspect-[2/1] w-full overflow-hidden bg-[var(--color-ink-100)] dark:bg-[var(--color-ink-800)]">
        <img
          src={article.image}
          alt=""
          width={1280}
          height={640}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* `.article-body` rather than the typography plugin: the plugin ships two
          palettes and a `prose-invert` switch, and this site has one palette
          expressed in tokens. Owning the rules keeps headings, links, quotes
          and rules in the same colour family as the rest of the page. */}
      <div className="article-body mt-11">
        <Markdown>{article.content}</Markdown>
      </div>
    </article>
  );
}
