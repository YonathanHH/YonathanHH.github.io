import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, Rocket } from 'lucide-react';
import { projects, Project } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import { cn } from '../lib/cn';

const ALL = 'All';

/** Categories read like "ML · Energy"; the first segment is the discipline. */
function disciplineOf(project: Project) {
  return project.category.split('·')[0].trim();
}

function searchIndexOf(project: Project) {
  return [project.title, project.description, project.category, ...project.stack]
    .join(' ')
    .toLowerCase();
}

export default function Projects() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const discipline = params.get('area') ?? ALL;
  const liveOnly = params.get('live') === '1';
  const isFiltered = query !== '' || discipline !== ALL || liveOnly;

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value === null || value === '' || value === ALL) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const clearFilters = () => setParams(new URLSearchParams(), { replace: true });

  const disciplines = useMemo(() => {
    const counts = new Map<string, number>();
    for (const project of projects) {
      const key = disciplineOf(project);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, []);

  const liveCount = useMemo(() => projects.filter((p) => p.website).length, []);

  const visible = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return projects.filter((project) => {
      if (liveOnly && !project.website) return false;
      if (discipline !== ALL && disciplineOf(project) !== discipline) return false;
      if (terms.length === 0) return true;
      const haystack = searchIndexOf(project);
      return terms.every((term) => haystack.includes(term));
    });
  }, [query, discipline, liveOnly]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
      <header className="arrive max-w-[62ch]">
        <h1 className="text-[2rem] font-bold leading-[1.06] tracking-[-0.03em] sm:text-[2.75rem]">
          All Projects
        </h1>
        <p className="mt-5 text-[1.0625rem] leading-[1.65] text-[var(--color-ink-600)] dark:text-[var(--color-ink-300)]">
          A comprehensive portfolio of my work spanning machine learning, deep learning, data
          analysis, and software engineering.{' '}
          <span className="font-mono text-[0.9375rem] text-[var(--color-primary-text)]">
            {liveCount} of {projects.length}
          </span>{' '}
          projects here are deployed and can be opened in the browser.
        </p>
      </header>

      <section aria-labelledby="filter-heading" className="mt-11 sm:mt-14">
        <h2 id="filter-heading" className="sr-only">
          Filter projects
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full sm:max-w-md">
            <label htmlFor="project-search" className="sr-only">
              Search projects by name, description, or technology
            </label>
            <Search
              size={17}
              strokeWidth={1.75}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-ink-500)]"
            />
            <input
              id="project-search"
              type="search"
              value={query}
              onChange={(e) => setParam('q', e.target.value)}
              placeholder="Search by name, stack, or topic"
              className="w-full rounded-[0.625rem] border border-[var(--color-ink-500)]/30 bg-white py-2.5 pl-10 pr-10 text-sm text-[var(--color-text-light)] transition-colors placeholder:text-[var(--color-ink-500)] hover:border-[var(--color-ink-500)]/55 focus:border-[var(--color-primary)] dark:bg-[var(--color-surface-dark)] dark:text-[var(--color-text-dark)]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setParam('q', null)}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-[0.625rem] p-2 text-[var(--color-ink-500)] transition-colors hover:text-[var(--color-primary-text)]"
              >
                <X size={15} strokeWidth={2} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setParam('live', liveOnly ? null : '1')}
            aria-pressed={liveOnly}
            className={cn(
              'chip h-[2.625rem] shrink-0 px-4',
              liveOnly ? 'chip-active' : 'chip-idle'
            )}
          >
            <Rocket size={14} strokeWidth={2} aria-hidden="true" />
            Live demo only
            <span>({liveCount})</span>
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by discipline">
          <button
            type="button"
            onClick={() => setParam('area', null)}
            aria-pressed={discipline === ALL}
            className={cn('chip', discipline === ALL ? 'chip-active' : 'chip-idle')}
          >
            All <span>({projects.length})</span>
          </button>
          {disciplines.map(([name, count]) => (
            <button
              key={name}
              type="button"
              onClick={() => setParam('area', discipline === name ? null : name)}
              aria-pressed={discipline === name}
              className={cn('chip', discipline === name ? 'chip-active' : 'chip-idle')}
            >
              {name} <span>({count})</span>
            </button>
          ))}
        </div>
      </section>

      <p
        role="status"
        aria-live="polite"
        className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-[var(--color-ink-500)]"
      >
        Showing {visible.length} of {projects.length} projects
        {isFiltered && (
          <button
            type="button"
            onClick={clearFilters}
            className="font-medium text-[var(--color-primary-text)] underline decoration-[var(--color-primary-text)]/35 underline-offset-[0.25em] transition-colors hover:decoration-current"
          >
            Reset filters
          </button>
        )}
      </p>

      {visible.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="r-surface mt-10 border border-dashed border-[var(--color-ink-500)]/40 px-6 py-20 text-center">
          <Search
            size={28}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mx-auto text-[var(--color-ink-400)]"
          />
          <p className="mt-5 text-lg font-bold tracking-[-0.015em]">
            No projects match those filters
          </p>
          <p className="mx-auto mt-2 max-w-[46ch] text-sm leading-[1.65] text-[var(--color-ink-600)] dark:text-[var(--color-ink-300)]">
            Try a broader search term, or clear the filters to see all {projects.length} projects.
          </p>
          <button type="button" onClick={clearFilters} className="btn btn-primary mt-7">
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
