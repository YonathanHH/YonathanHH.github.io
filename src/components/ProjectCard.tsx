import { ExternalLink, Github } from 'lucide-react';
import { Project } from '../data/projects';

/**
 * One project, one cell.
 *
 * Deliberately not a Motion component. The reveal comes from the `.reveal`
 * class, which is a CSS view() timeline: it runs off the main thread, and if a
 * browser does not support it the card renders in its finished state instead of
 * sitting at opacity 0 waiting for an observer that never fires.
 */
export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="reveal group flex h-full flex-col">
      {/* No overlay, no badge. The frame is the card's only chrome, and the
          deployed state is stated in the metadata row as text rather than
          printed on top of the screenshot.

          The 2:1 frame is a system decision, not a per-card one. The 27 local
          screenshots run from 0.97:1 to 3.27:1 and the nine GitHub cards are
          exactly 2:1, with the repository name set at the left edge. At 2:1
          with top anchoring, the sixteen images between 1.7:1 and 2.1:1 crop by
          nothing worth measuring and the tall screenshots keep their header
          instead of their middle. A 16:10 frame cut the repository name off
          every GitHub card. */}
      <div className="r-frame relative aspect-[2/1] w-full overflow-hidden bg-[var(--color-ink-100)] dark:bg-[var(--color-ink-800)]">
        {project.website ? (
          <a
            href={project.website}
            target="_blank"
            rel="noreferrer"
            tabIndex={-1}
            aria-hidden="true"
            className="block h-full w-full"
          >
            <img
              src={project.image}
              alt=""
              width={800}
              height={400}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              referrerPolicy="no-referrer"
            />
          </a>
        ) : (
          <img
            src={project.image}
            alt=""
            width={800}
            height={400}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            referrerPolicy="no-referrer"
          />
        )}
      </div>

      <div className="flex flex-grow flex-col pt-4">
        <div className="flex items-center justify-between gap-4">
          <p
            title={project.category.trim()}
            className="truncate font-mono text-[0.6875rem] text-[var(--color-ink-500)]"
          >
            {project.category.trim()}
          </p>
          {project.website && (
            <span className="shrink-0 font-mono text-[0.6875rem] font-medium text-[var(--color-primary-text)]">
              Live
            </span>
          )}
        </div>

        <h3 className="mt-2 text-[1.0625rem] font-bold leading-[1.3] tracking-[-0.012em] text-balance transition-colors duration-200 group-hover:text-[var(--color-primary-text)]">
          {project.title}
        </h3>

        <p className="mt-2 line-clamp-3 flex-grow text-sm leading-[1.6] text-[var(--color-ink-600)] dark:text-[var(--color-ink-300)]">
          {project.description}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t pt-3.5 rule">
          <ul className="flex min-w-0 flex-wrap gap-1.5">
            {project.stack.slice(0, 4).map((tech) => (
              <li key={tech} className="tag">
                {tech}
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-0.5">
            {project.website && (
              <a
                href={project.website}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open the live app for ${project.title}`}
                title="Live app"
                className="rounded-[0.625rem] p-2 text-[var(--color-ink-500)] transition-colors duration-200 hover:text-[var(--color-primary-text)]"
              >
                <ExternalLink size={18} strokeWidth={1.75} />
              </a>
            )}
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              aria-label={`View ${project.title} source on GitHub`}
              title="Source code"
              className="rounded-[0.625rem] p-2 text-[var(--color-ink-500)] transition-colors duration-200 hover:text-[var(--color-primary-text)]"
            >
              <Github size={18} strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
