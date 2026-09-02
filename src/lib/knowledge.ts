/**
 * The assistant's knowledge base.
 *
 * Every fact it can state is derived from the same data modules the pages
 * render, so an answer can never drift from what the site shows. Add a
 * project, an article, or a CV entry and the assistant knows about it on the
 * next build — there is no index to regenerate and no service to redeploy.
 */
import { articles } from '../data/articles';
import { biography } from '../data/biography';
import { cvSections } from '../data/cv';
import { projects } from '../data/projects';
import { skills } from '../data/skills';

export type DocKind = 'biography' | 'project' | 'skills' | 'cv' | 'article';

export type Doc = {
  id: string;
  kind: DocKind;
  title: string;
  /** Prose the answer composer quotes sentences from. Kept clean: no labels. */
  body: string;
  /** Searchable terms that would read badly if quoted — stack, category, meta. */
  tags: string[];
  /** Key back into the source data, so composers can use the structured form. */
  refId?: string;
  route: string;
  routeLabel: string;
};

/** Long enough to keep an argument intact, short enough that one chunk of a
 *  6-paragraph article cannot outrank a whole project on term count alone. */
const ARTICLE_CHUNK_CHARS = 900;

function chunkProse(text: string): string[] {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = '';

  for (const paragraph of paragraphs) {
    if (current && current.length + paragraph.length + 1 > ARTICLE_CHUNK_CHARS) {
      chunks.push(current);
      current = paragraph;
    } else {
      current = current ? `${current} ${paragraph}` : paragraph;
    }
  }

  if (current) chunks.push(current);

  return chunks;
}

function buildDocs(): Doc[] {
  const docs: Doc[] = [];

  docs.push({
    id: 'bio-intro',
    kind: 'biography',
    title: 'Biography',
    body: biography.intro.join(' '),
    tags: ['Yonathan Hary Hutagalung', 'about', 'who', 'data scientist', 'geothermal researcher'],
    route: '/biography',
    routeLabel: 'Open biography',
  });

  docs.push({
    id: 'bio-summary',
    kind: 'biography',
    title: 'Profile summary',
    body: biography.profileSummary,
    tags: ['Yonathan', 'profile', 'summary'],
    route: '/biography',
    routeLabel: 'Open biography',
  });

  for (const project of projects) {
    docs.push({
      id: `project-${project.id}`,
      kind: 'project',
      title: project.title,
      body: project.description,
      tags: [project.category, ...project.stack, 'project'],
      refId: project.id,
      route: '/projects',
      routeLabel: 'Browse projects',
    });
  }

  for (const [group, items] of Object.entries(skills)) {
    docs.push({
      id: `skills-${group.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      kind: 'skills',
      title: group,
      body: `Yonathan's ${group.toLowerCase()}: ${items.join(', ')}.`,
      tags: [...items, 'skills', 'tools', 'stack'],
      refId: group,
      route: '/',
      routeLabel: 'Back to home',
    });
  }

  for (const section of cvSections) {
    for (const entry of section.entries) {
      docs.push({
        id: `cv-${section.id}-${entry.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}`,
        kind: 'cv',
        title: entry.title,
        body: entry.points.join(' '),
        tags: [entry.meta, section.heading, 'cv', 'resume'],
        refId: `${section.id}|${entry.title}`,
        route: '/cv',
        routeLabel: 'Open CV',
      });
    }
  }

  for (const article of articles) {
    chunkProse(article.content).forEach((chunk, position) => {
      docs.push({
        id: `article-${article.id}-${position}`,
        kind: 'article',
        title: article.title,
        body: chunk,
        tags: [article.summary, article.date, 'article', 'blog'],
        refId: article.id,
        route: `/articles/${article.id}`,
        routeLabel: 'Read the article',
      });
    });
  }

  return docs;
}

let docs: Doc[] | null = null;

/** Built once, on the first question, then reused for the session. */
export function getDocs(): Doc[] {
  if (!docs) docs = buildDocs();
  return docs;
}
