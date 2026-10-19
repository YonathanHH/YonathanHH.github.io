import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { projects, Project } from '../data/projects';
import { skills } from '../data/skills';
import { profile } from '../data/profile';
import { imageSize, isLogoImage } from '../data/imageSizes';
import { LENSES, Lens, PROJECT_LENS } from '../data/lenses';
import { cn } from '../lib/cn';

const ALL = 'All';
type LensFilter = typeof ALL | Lens;

/**
 * One frame on the archive sheet.
 *
 * The frame takes the image's own aspect ratio rather than cropping it into a
 * house shape. The 27 local screenshots run from 0.97:1 to 3.27:1 and the nine
 * GitHub cards are 2:1, so a single crop either cuts the header off tall
 * captures or throws away most of a wide dashboard. On a contact sheet each
 * frame keeps its own proportions and the ragged edge is the point.
 *
 * Width is derived from the row height in CSS (see --frame-h below) instead of
 * being fixed per frame, so the wall stays proportional on a phone.
 */
function SheetFrame({ project }: { project: Project }) {
  const [w, h] = imageSize(project.image);
  const logo = isLogoImage(project.image);

  return (
    <a
      href={project.website ?? project.github}
      target="_blank"
      rel="noreferrer"
      className="group block shrink-0"
      style={{ width: `max(calc(var(--frame-h) * ${(w / h).toFixed(4)}), var(--frame-min))` }}
    >
      <div
        className={cn(
          'h-[var(--frame-h)] overflow-hidden',
          logo ? 'bg-white' : 'bg-[var(--color-ink-100)] dark:bg-[var(--color-ink-800)]'
        )}
      >
        <img
          src={project.image}
          alt=""
          width={w}
          height={h}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          className={cn(
            'h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100',
            logo ? 'object-contain p-4' : 'object-cover object-top'
          )}
        />
      </div>

      <p
        title={project.title}
        className="mt-2 line-clamp-2 text-[0.8125rem] leading-[1.4] text-[var(--color-ink-600)] transition-colors duration-200 group-hover:text-[var(--color-primary-text)] dark:text-[var(--color-ink-300)]"
      >
        {project.title}
      </p>
    </a>
  );
}

/**
 * The archive.
 *
 * This replaced a featured trio: one wide lead plus two cards, which showed
 * three of thirty-five projects and pushed the other thirty-two behind a link.
 * The landing page is the one place a visitor decides whether the work is
 * worth their time, so it shows all of it, small and in rows, and lets them
 * narrow it if they want to.
 *
 * The lens filters are the page's one live thing. They are plain buttons in a
 * roving row, not pills, so the row reads as an index rather than a control
 * bank, and the status line is announced rather than being only visual.
 */
function ArchiveSheet() {
  const [lens, setLens] = useState<LensFilter>(ALL);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const project of projects) {
      const name = PROJECT_LENS[project.id];
      if (name) map.set(name, (map.get(name) ?? 0) + 1);
    }
    return map;
  }, []);

  const visible = useMemo(
    () => (lens === ALL ? projects : projects.filter((p) => PROJECT_LENS[p.id] === lens)),
    [lens]
  );

  const liveCount = useMemo(() => projects.filter((p) => p.website).length, []);

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="pb-16 pt-9 sm:pt-12 md:pb-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 id="work-heading" className="sr-only">
          Projects
        </h2>

        <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4">
          <p
            role="status"
            aria-live="polite"
            className="text-[1rem] text-[var(--color-ink-600)] dark:text-[var(--color-ink-300)]"
          >
            <span className="font-bold tabular-nums text-[var(--color-text-light)] dark:text-[var(--color-text-dark)]">
              {visible.length}
            </span>
            {lens === ALL
              ? ` projects, ${liveCount} of them deployed`
              : ` of ${projects.length} projects`}
          </p>

          <div
            role="group"
            aria-label="Filter projects by lens"
            className="flex flex-wrap items-baseline gap-x-5 gap-y-2"
          >
            {([ALL, ...LENSES] as const).map((name) => {
              const active = lens === name;
              const count = name === ALL ? projects.length : (counts.get(name) ?? 0);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setLens(name)}
                  aria-pressed={active}
                  className={cn(
                    'relative pb-1 text-[0.875rem] font-medium transition-colors duration-200',
                    active
                      ? 'text-[var(--color-text-light)] dark:text-[var(--color-text-dark)]'
                      : 'text-[var(--color-ink-500)] hover:text-[var(--color-text-light)] dark:hover:text-[var(--color-text-dark)]'
                  )}
                >
                  {name}
                  <span
                    className={cn(
                      'ml-1.5 text-[0.8125rem] tabular-nums',
                      active
                        ? 'text-[var(--color-primary-text)]'
                        : 'text-[var(--color-ink-500)]'
                    )}
                  >
                    {count}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute inset-x-0 -bottom-px h-0.5 origin-left bg-[var(--color-primary)] transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
                      active ? 'scale-x-100' : 'scale-x-0'
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-start gap-x-2 gap-y-7 [--frame-h:5.5rem] [--frame-min:7rem] sm:[--frame-h:8.5rem] sm:[--frame-min:0px]">
          {visible.map((project) => (
            <SheetFrame key={project.id} project={project} />
          ))}
        </div>

        <p className="mt-11 text-[1rem]">
          <Link to="/projects" className="link">
            Project notes, stack, and live links
          </Link>
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  const skillGroups = Object.entries(skills);
  const skillCount = skillGroups.reduce((total, [, items]) => total + items.length, 0);

  return (
    <div className="flex flex-col">
      {/* ==================================================================
          Hero. The name is the display element and the sentence under it is
          the claim, so there is no kicker repeating the name that the navbar
          already shows. One action, because the work is the next thing on the
          page and a second button would only compete with it.

          The scrim is lighter than it was: the photograph is the only place on
          the site where the subject's own palette shows up, and the old
          gradient greyed the ochre out of it. Contrast was re-measured after
          the change rather than assumed.
          ================================================================== */}      <section className="relative isolate flex min-h-[calc(100dvh-4rem)] items-end overflow-hidden pb-14 pt-24 md:items-center md:pb-24">
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
            className="absolute inset-0 h-full w-full -scale-x-100 object-cover object-[50%_38%] md:object-center"
          />
        </picture>

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,14,15,0.9)_0%,rgba(10,14,15,0.8)_45%,rgba(10,14,15,0.55)_75%,rgba(10,14,15,0.28)_100%)] md:hidden"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-[linear-gradient(100deg,rgba(10,13,14,0.62)_0%,rgba(10,13,14,0.56)_38%,rgba(10,13,14,0.3)_62%,rgba(10,13,14,0.04)_88%,rgba(10,13,14,0)_100%),linear-gradient(to_top,rgba(10,13,14,0.35)_0%,rgba(10,13,14,0)_38%)] md:block"
        />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="arrive arrive-1 max-w-[13ch] text-[clamp(2.75rem,8vw,8.5rem)] font-bold leading-[0.9] tracking-[-0.045em] text-white text-balance">
            Yonathan Hary Hutagalung
          </h1>

          <p className="arrive arrive-2 mt-6 max-w-[26ch] text-[1.5rem] font-medium leading-[1.25] tracking-[-0.02em] text-white text-balance">
            Bridging Geoscience and Machine Learning
          </p>

          <p className="arrive arrive-3 mt-4 max-w-[46ch] text-[1rem] font-light leading-[1.6] text-white/85">
            Data Scientist and Geothermal Energy Researcher, delivering end-to-end projects from
            EDA through model deployment.
          </p>

          <div className="arrive arrive-4 mt-8">
            <Link
              to="/projects"
              className="btn bg-white px-6 py-3 text-[1rem] text-[var(--color-text-light)] hover:bg-[var(--color-ink-50)]"
            >
              View projects
              <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <ArchiveSheet />

      {/* ==================================================================
          About. Two paragraphs, both taken from the biography rather than
          written fresh, so the landing page and the biography page cannot
          drift apart. The right column states availability and offers the two
          places a reader can go deeper.
          ================================================================== */}
      <section className="section" aria-labelledby="about-heading">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="reveal lg:col-span-7">
              <h2
                id="about-heading"
                className="text-[2.5rem] font-bold leading-[1.06] tracking-[-0.03em]"
              >
                About
              </h2>

              <p className="mt-6 max-w-[62ch] text-[1rem] leading-[1.7] text-[var(--color-ink-600)] dark:text-[var(--color-ink-300)]">
                I am a geothermal energy researcher and data scientist with an MSc in Sustainable
                Energy from Reykjavik University and a BSc in Geology. My work sits where
                geothermal systems, reservoir modelling, geological interpretation, and
                data-driven analysis meet.
              </p>

              <p className="mt-5 max-w-[62ch] text-[1rem] leading-[1.7] text-[var(--color-ink-600)] dark:text-[var(--color-ink-300)]">
                I have worked across geothermal research and applied data projects, building
                practical tools and models that turn complex technical data into useful insights,
                from numerical reservoir modelling in TOUGH2 to machine learning systems that run
                in a browser.
              </p>
            </div>

            <div className="reveal lg:col-span-5 lg:pb-1">
              <p className="text-[0.8125rem] font-medium text-[var(--color-ink-500)]">
                Currently
              </p>
              <p className="mt-2 max-w-[34ch] text-[1rem] leading-[1.6]">
                Open to new opportunities in {profile.openTo}.
              </p>
              <div className="mt-6 flex flex-wrap items-baseline gap-x-7 gap-y-2">
                <Link to="/cv" className="link text-[1rem]">
                  Curriculum vitae
                </Link>
                <Link to="/biography" className="link text-[1rem]">
                  Biography
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================
          Capabilities. The same eight groups and the same items as before,
          kept complete because a capability list is a reference and trimming
          it would only make it guesswork. What changed is the voice: it is set
          in the text face at a readable size instead of twelve-pixel
          monospace, which had made the largest block of text on the page the
          hardest one to read.
          ================================================================== */}
      <section className="section" aria-labelledby="capabilities">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="reveal flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
            <h2
              id="capabilities"
              className="text-[2.5rem] font-bold leading-[1.06] tracking-[-0.03em]"
            >
              Capabilities
            </h2>
            <p className="text-[0.8125rem] text-[var(--color-ink-500)]">
              {skillCount} tools and methods, {skillGroups.length} groups
            </p>
          </div>

          <dl className="mt-10 grid gap-x-16 gap-y-9 md:mt-12 md:grid-cols-2">
            {skillGroups.map(([group, items]) => (
              <div key={group} className="reveal">
                <dt className="text-[1.25rem] font-medium tracking-[-0.012em]">{group}</dt>
                <dd className="mt-2 text-[1rem] leading-[1.65] text-[var(--color-ink-600)] dark:text-[var(--color-ink-300)]">
                  {items.join(', ')}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ==================================================================
          Contact. One action, then the channels as plain text. The rule that
          used to separate them is gone: the row is separated by space now.
          ================================================================== */}
      <section id="contact" className="band-brand section">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-9 lg:grid-cols-12 lg:items-end lg:gap-12">
            <div className="reveal lg:col-span-7">
              <h2 className="text-[2.5rem] font-bold leading-[1.06] tracking-[-0.03em]">
                Let&rsquo;s Connect
              </h2>
              <p className="mt-5 max-w-[56ch] text-[1rem] leading-[1.65] opacity-90">
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
                className="btn btn-on-brand w-full px-7 py-3.5 text-[1rem] sm:w-auto"
              >
                Connect on LinkedIn
                <ArrowRight size={18} strokeWidth={2} aria-hidden="true" />
              </a>
            </div>
          </div>

          <ul className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 md:mt-14">
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
