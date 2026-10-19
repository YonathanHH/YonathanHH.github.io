import { ArrowRight, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects, Project } from '../data/projects';
import { skills } from '../data/skills';
import { profile } from '../data/profile';
import ProjectCard from '../components/ProjectCard';

/**
 * The lead project in the featured grouping.
 *
 * Horizontal rather than a card, so the featured group has a clear first
 * entry instead of three identically-shaped tiles competing for the eye. The
 * description runs unclamped here: there is room for it and it is the one
 * place the strongest piece of work gets to argue at length.
 */
function LeadProject({ project }: { project: Project }) {
  return (
    <div className="reveal group grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-5">
        <div className="flex items-center gap-4">
          <p className="font-mono text-[0.6875rem] text-[var(--color-ink-500)]">
            {project.category.trim()}
          </p>
          {project.website && (
            <span className="font-mono text-[0.6875rem] font-medium text-[var(--color-primary-text)]">
              Live
            </span>
          )}
        </div>

        <h3 className="mt-3 text-[1.625rem] font-bold leading-[1.2] tracking-[-0.022em] text-balance transition-colors duration-200 group-hover:text-[var(--color-primary-text)] sm:text-[2rem]">
          {project.title}
        </h3>

        <p className="mt-4 max-w-[54ch] text-[0.9375rem] leading-[1.7] text-[var(--color-ink-600)] dark:text-[var(--color-ink-300)]">
          {project.description}
        </p>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {project.stack.map((tech) => (
            <li key={tech} className="tag">
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          {project.website && (
            <a
              href={project.website}
              target="_blank"
              rel="noreferrer"
              className="link -my-2 py-2 text-sm"
            >
              Open the live app
            </a>
          )}
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="-my-2 inline-flex items-center gap-1.5 py-2 text-sm font-medium text-[var(--color-ink-600)] transition-colors hover:text-[var(--color-primary-text)] dark:text-[var(--color-ink-300)]"
          >
            <Github size={16} strokeWidth={1.75} aria-hidden="true" />
            Source
          </a>
        </div>
      </div>

      <div className="r-frame relative aspect-[2/1] overflow-hidden bg-[var(--color-ink-100)] lg:col-span-7 dark:bg-[var(--color-ink-800)]">
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
              width={1280}
              height={640}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              referrerPolicy="no-referrer"
            />
          </a>
        ) : (
          <img
            src={project.image}
            alt=""
            width={1280}
            height={640}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-top"
            referrerPolicy="no-referrer"
          />
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const featured = projects.filter((p) => p.featured);
  const [lead, ...rest] = featured;
  const otherFeatured = rest.slice(0, 2);
  const skillGroups = Object.entries(skills);

  return (
    <div className="flex flex-col">
      {/* ==================================================================
          Hero. Four text elements, one primary action, one secondary.

          The photograph is unchanged and still mirrored, and it is still a
          background rather than a foreground element. What is new is that it
          is now a real <picture> with a preloaded source and a portrait frame
          for phones, where a 3:2 crop used to remove the subject from the
          viewport entirely. The scrim is tuned to this frame: heavy on the
          left where the type sits, releasing before it reaches the figure.
          ================================================================== */}
      <section className="relative isolate flex min-h-[calc(100dvh-4rem)] items-end overflow-hidden px-4 pb-14 pt-24 sm:px-6 md:items-center md:pb-24 lg:px-8">
        <picture>
          <source
            media="(min-width: 1024px)"
            type="image/webp"
            srcSet="/hero-bg-828.webp 828w, /hero-bg-1280.webp 1280w, /hero-bg-1920.webp 1920w, /hero-bg-2560.webp 2560w"
            sizes="100vw"
          />
          <source
            type="image/webp"
            srcSet="/hero-bg-portrait-640.webp 640w, /hero-bg-portrait-900.webp 900w, /hero-bg-portrait-1200.webp 1200w"
            sizes="100vw"
          />
          <img
            src="/hero-bg-1920.jpg"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full -scale-x-100 object-cover object-center"
          />
        </picture>

        {/* Phone and tablet: dark where the type is, releasing over the ridge
            so the landscape still reads, then grounded at the bottom edge. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,14,15,0.95)_0%,rgba(10,14,15,0.88)_26%,rgba(10,14,15,0.5)_54%,rgba(10,14,15,0.16)_78%,rgba(10,14,15,0.28)_100%)] md:hidden"
        />
        {/* Desktop: a directional scrim over a light ground coat, not one flat
            overlay. The falloff is placed so it is essentially gone by the time
            it reaches the subject, which is what keeps the figure from looking
            dipped, and the ground coat deepens the ochre so white type reads
            against it rather than sitting on top of it. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-[linear-gradient(100deg,rgba(10,13,14,0.88)_0%,rgba(10,13,14,0.86)_34%,rgba(10,13,14,0.6)_56%,rgba(10,13,14,0.18)_80%,rgba(10,13,14,0.04)_100%),linear-gradient(to_top,rgba(10,13,14,0.46)_0%,rgba(10,13,14,0)_34%)] md:block"
        />

        <div className="relative mx-auto w-full max-w-7xl">
          <div className="max-w-[44rem]">
            <p className="arrive arrive-1 text-[0.9375rem] font-medium tracking-[-0.005em] text-white/70">
              Yonathan Hary Hutagalung
            </p>

            <h1 className="arrive arrive-2 mt-4 text-[2.25rem] font-bold leading-[1.04] tracking-[-0.032em] text-white text-balance sm:text-[3rem] lg:text-[3.75rem]">
              <span className="font-light">Bridging</span> Geoscience and Machine Learning
            </h1>

            <p className="arrive arrive-3 mt-6 max-w-[46ch] text-[1.0625rem] font-light leading-[1.65] text-white/90 sm:text-[1.1875rem]">
              Data Scientist and Geothermal Energy Researcher, delivering end-to-end
              projects from EDA through model deployment.
            </p>

            <div className="arrive arrive-4 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/projects" className="btn btn-primary w-full sm:w-auto">
                View projects
                <ArrowRight size={17} strokeWidth={2} aria-hidden="true" />
              </Link>
              <Link to="/cv" className="btn w-full border border-white/35 text-white hover:bg-white/10 sm:w-auto">
                View CV
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          Capabilities.

          This was eight columns of forty-three bulleted list items. It is now
          the same eight groups and the same forty-three items, set as a
          two-column index with the terms running as prose. A capability
          inventory is a reference, not a narrative: it wants to be scanned in
          one screen, and a bullet is the slowest way to read a keyword.
          ================================================================== */}
      <section className="section" aria-labelledby="capabilities">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2
            id="capabilities"
            className="reveal text-[1.75rem] font-bold leading-[1.1] tracking-[-0.026em] md:text-[2.5rem]"
          >
            Skills &amp; Expertise
          </h2>

          <dl className="mt-11 grid gap-x-14 gap-y-9 md:mt-14 lg:grid-cols-2">
            {skillGroups.map(([group, items]) => (
              <div key={group} className="reveal">
                <dt className="text-[1.0625rem] font-medium tracking-[-0.01em]">{group}</dt>
                <dd className="mt-2.5 font-mono text-[0.75rem] leading-[1.85] text-[var(--color-ink-600)] dark:text-[var(--color-ink-300)]">
                  {items.join(', ')}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ==================================================================
          Featured work. One full-width lead and two supporting cards, so the
          group reads as a ranking rather than a row of three equals.
          ================================================================== */}
      <section className="section border-y rule" aria-labelledby="featured">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="reveal flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="lg:max-w-[62ch]">
              <h2
                id="featured"
                className="text-[1.75rem] font-bold leading-[1.1] tracking-[-0.026em] md:text-[2.5rem]"
              >
                Featured Projects
              </h2>
              <p className="mt-5 max-w-[68ch] text-[0.9375rem] leading-[1.7] text-[var(--color-ink-600)] dark:text-[var(--color-ink-300)]">
                A selection of my most impactful work: an end-to-end churn platform built on a
                Medallion data pipeline, a physics-informed geothermal reservoir digital twin, and a
                marketplace sales-intelligence product served through its own API and dashboard.
              </p>
            </div>
            <Link
              to="/projects"
              className="-my-2 inline-flex shrink-0 items-center gap-1.5 self-start py-2 font-mono text-xs font-medium text-[var(--color-primary-text)]"
            >
              All {projects.length} projects
              <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-12 flex flex-col gap-14 md:mt-16">
            {lead && <LeadProject project={lead} />}
            {otherFeatured.length > 0 && (
              <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
                {otherFeatured.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ==================================================================
          Contact. One action, then a quiet list of channels. Previously this
          band held two large buttons plus the hero held a third, which left
          four competing ways to reach the same person on one page.
          ================================================================== */}
      <section id="contact" className="band-brand section">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-9 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="reveal lg:col-span-7">
              <h2 className="text-[1.75rem] font-bold leading-[1.1] tracking-[-0.026em] md:text-[2.5rem]">
                Let&rsquo;s Connect
              </h2>
              <p className="mt-5 max-w-[56ch] text-[1.0625rem] leading-[1.65] opacity-90">
                I&rsquo;m currently open to new opportunities in data science, machine learning, and
                energy analytics. Feel free to reach out if you&rsquo;d like to collaborate or just
                say hi!
              </p>
            </div>

            <div className="reveal lg:col-span-5 lg:justify-self-end">
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="btn btn-on-brand w-full px-7 py-3.5 text-base sm:w-auto"
              >
                Connect on LinkedIn
                <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </div>

          <ul className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/25 pt-6 md:mt-14 dark:border-[var(--color-ink-700)]">
            <li>
              <a href={`mailto:${profile.links.email}`} className="channel-link">
                Email
              </a>
            </li>
            <li>
              <a
                href={profile.links.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="channel-link"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={profile.links.github}
                target="_blank"
                rel="noreferrer"
                className="channel-link"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href={profile.links.medium}
                target="_blank"
                rel="noreferrer"
                className="channel-link"
              >
                Medium
              </a>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
