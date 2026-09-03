import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, X, Rocket } from 'lucide-react';
import { projects, Project } from '../data/projects';
import ProjectCard from '../components/ProjectCard';
import { cn } from '../lib/cn';

const ALL = 'All';

/** Categories read like "ML · Energy" — the first segment is the discipline. */
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

  const chipClass = (active: boolean) =>
    cn(
      'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
      active
        ? 'bg-[var(--color-primary)] text-white'
        : 'bg-[var(--color-primary)]/10 text-[var(--color-primary-text)] hover:bg-[var(--color-primary)]/20'
    );

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 sm:mb-12"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">All Projects</h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl">
          A comprehensive portfolio of my work spanning machine learning, deep learning, data
          analysis, and software engineering. {liveCount} of the {projects.length} projects here are
          deployed and can be opened in the browser.
        </p>
      </motion.div>

      <section aria-labelledby="filter-heading" className="mb-8">
        <h2 id="filter-heading" className="sr-only">
          Filter projects
        </h2>

        <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
          <div className="relative flex-grow lg:max-w-md">
            <label htmlFor="project-search" className="sr-only">
              Search projects by name, description, or technology
            </label>
            <Search
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              id="project-search"
              type="search"
              value={query}
              onChange={(e) => setParam('q', e.target.value)}
              placeholder="Search by name, stack, or topic"
              className="w-full rounded-lg border border-[var(--color-primary)]/20 bg-white dark:bg-[#22211e] py-2.5 pl-10 pr-10 text-sm text-[var(--color-text-light)] dark:text-[var(--color-text-dark)] placeholder:text-gray-400 hover:border-[var(--color-primary)]/40 transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => setParam('q', null)}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-400 hover:text-[var(--color-primary-text)] transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setParam('live', liveOnly ? null : '1')}
            aria-pressed={liveOnly}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium border transition-colors',
              liveOnly
                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                : 'border-[var(--color-primary)]/20 text-[var(--color-text-light)] dark:text-[var(--color-text-dark)] hover:border-[var(--color-primary)]/40'
            )}
          >
            <Rocket size={16} aria-hidden="true" />
            Live demo only
            <span className={cn('text-xs', liveOnly ? 'text-white/70' : 'text-gray-500')}>
              ({liveCount})
            </span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by discipline">
          <button
            type="button"
            onClick={() => setParam('area', null)}
            aria-pressed={discipline === ALL}
            className={chipClass(discipline === ALL)}
          >
            All <span className="opacity-70">({projects.length})</span>
          </button>
          {disciplines.map(([name, count]) => (
            <button
              key={name}
              type="button"
              onClick={() => setParam('area', discipline === name ? null : name)}
              aria-pressed={discipline === name}
              className={chipClass(discipline === name)}
            >
              {name} <span className="opacity-70">({count})</span>
            </button>
          ))}
        </div>
      </section>

      <p role="status" aria-live="polite" className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        Showing {visible.length} of {projects.length} projects
        {isFiltered && (
          <>
            {' · '}
            <button
              type="button"
              onClick={clearFilters}
              className="font-medium text-[var(--color-primary-text)] hover:underline"
            >
              Reset filters
            </button>
          </>
        )}
      </p>

      {visible.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {visible.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[var(--color-primary)]/30 py-16 px-6 text-center">
          <Search size={32} aria-hidden="true" className="mx-auto text-[var(--color-primary-text)]/50" />
          <h3 className="mt-4 text-lg font-semibold">No projects match those filters</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Try a broader search term, or clear the filters to see all {projects.length} projects.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-6 inline-flex items-center px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
