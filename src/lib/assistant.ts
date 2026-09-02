/**
 * The portfolio assistant. Everything it does happens in the visitor's
 * browser: no API key, no proxy, no request leaves the page.
 *
 * It works in two stages, the way a person answering from a folder of notes
 * would. First it *finds* the relevant material — BM25 over the site's own
 * data modules, with a small synonym layer so "energy work" reaches the
 * geothermal projects and "where did he study" reaches the CV. Then it
 * *composes* a short answer from what it found: structured lists when the
 * question asks for a list, otherwise the sentences of the best-matching
 * entry that actually carry the query's terms.
 *
 * It never writes prose of its own about Yonathan. Every claim in an answer
 * is a sentence that exists in src/data.
 */
import { articles, type Article } from '../data/articles';
import { biography } from '../data/biography';
import { chatbotFaq } from '../data/chatbotFaq';
import { cvSections } from '../data/cv';
import { profile } from '../data/profile';
import { projects, type Project } from '../data/projects';
import { skills } from '../data/skills';
import { getDocs, type Doc, type DocKind } from './knowledge';

export type AssistantReply = {
  /** Markdown — the chat panel renders it. */
  text: string;
  route?: string;
  routeLabel?: string;
};

/** Synonym hits count for less than the visitor's own words. */
const SYNONYM_WEIGHT = 0.45;

/** Share of the question's meaningful terms the best match must cover before
 *  the answer is worth showing. Below it, saying "I don't know" is better. */
const CONFIDENCE_FLOOR = 0.34;

const BM25_K1 = 1.5;
const BM25_B = 0.75;

const MAX_LIST_ITEMS = 4;
const MAX_ANSWER_CHARS = 560;

const FALLBACK_TEXT =
  'I only know what is on this site — Yonathan’s background, projects, articles, skills, and CV. Try asking about geothermal work, machine learning projects, forecasting, education, or how to get in touch.';

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'of', 'and', 'to', 'in', 'for', 'is', 'are', 'was', 'were',
  'he', 'his', 'him', 'she', 'her', 'they', 'them', 'what', 'who', 'how', 'why',
  'when', 'where', 'does', 'did', 'do', 'has', 'have', 'had', 'on', 'with',
  'about', 'me', 'tell', 'you', 'your', 'i', 'it', 'that', 'this', 'these',
  'can', 'could', 'would', 'show', 'any', 'some', 'there', 'from', 'at', 'by',
  'be', 'been', 'as', 'or', 'if', 'so', 'give', 'know', 'anything', 'more',
  'much', 'many', 'please', 'here', 'like', 'want', 'us', 'we',
]);

/**
 * Terms that mean the same thing to a visitor but not to a string match.
 * Each group expands in every direction, at a reduced weight — this is what
 * stands in for the embedding model, and for a corpus this size it is enough.
 */
const SYNONYM_GROUPS: string[][] = [
  ['ai', 'ml', 'machine', 'learning', 'model', 'modelling', 'modeling', 'algorithm', 'neural', 'deep'],
  ['energy', 'geothermal', 'renewable', 'power', 'electricity', 'sustainable', 'sustainability'],
  ['forecast', 'forecasting', 'prediction', 'predictive', 'timeseries', 'lstm', 'stock', 'trend'],
  ['education', 'study', 'studied', 'degree', 'university', 'college', 'school', 'master', 'masters', 'msc', 'bachelor', 'bsc', 'graduate', 'thesis'],
  ['experience', 'job', 'career', 'role', 'position', 'employer', 'employment', 'intern', 'internship', 'worked'],
  ['cv', 'resume', 'curriculum'],
  ['article', 'blog', 'post', 'write', 'writing', 'wrote', 'medium', 'story'],
  ['skill', 'tool', 'stack', 'technology', 'tech', 'software', 'proficiency'],
  ['contact', 'email', 'linkedin', 'hire', 'reach', 'connect', 'whatsapp', 'recruiter'],
  ['project', 'portfolio', 'built', 'build', 'app', 'application', 'repo', 'github'],
  ['geology', 'geoscience', 'geological', 'basin', 'structural', 'reservoir'],
  ['data', 'analytics', 'analysis', 'analyst', 'science', 'scientist', 'dashboard'],
  ['vision', 'image', 'satellite', 'remote', 'sensing', 'cnn'],
];

/**
 * Words that describe the *shape* of a question rather than its subject.
 * "What geothermal projects has he built?" is about geothermal; ranking on
 * "projects" and "built" as well would pull in every project ever described
 * as built. They are dropped before ranking, never before intent matching.
 */
const INTENT_WORDS = [
  'project', 'projects', 'portfolio', 'repo', 'repos', 'repository', 'build', 'built',
  'app', 'application', 'article', 'articles', 'blog', 'post', 'posts', 'write',
  'writing', 'wrote', 'written', 'medium', 'skill', 'skills', 'tool', 'tools',
  'stack', 'cv', 'resume', 'list', 'show', 'case', 'work', 'working', 'works',
];

/** Naming Yonathan is not a topic — every document on this site is about him. */
const PERSON_WORDS = [
  'yonathan', 'hary', 'hutagalung', 'himself', 'background', 'biography', 'bio',
  'profile', 'introduce',
];

/**
 * Light suffix stripping so "forecasting" matches "Forecaster". The length
 * guard matters: without it "series" collapses to "ser" and collides with
 * "server" and "service".
 */
function stem(word: string): string {
  if (word.length <= 4) return word;

  for (const suffix of ['ings', 'ing', 'ers', 'er', 'ed', 'es', 's']) {
    if (word.endsWith(suffix)) {
      const root = word.slice(0, -suffix.length);
      if (root.length >= 4) return root;
    }
  }

  return word;
}

function tokenize(text: string): string[] {
  const words: string[] = text.toLowerCase().match(/[a-z0-9]+/g) ?? [];

  return words
    .filter((word) => word.length > 1 && !STOP_WORDS.has(word))
    .map(stem);
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

const INTENT_TERMS = new Set(INTENT_WORDS.map(stem));
const PERSON_TERMS = new Set(PERSON_WORDS.map(stem));

const SYNONYMS = (() => {
  const map = new Map<string, Set<string>>();

  for (const group of SYNONYM_GROUPS) {
    const stems = new Set(group.map(stem));

    for (const term of stems) {
      const related = map.get(term) ?? new Set<string>();
      for (const other of stems) if (other !== term) related.add(other);
      map.set(term, related);
    }
  }

  return map;
})();

type QueryTerm = { term: string; weight: number };

function expand(tokens: string[]): QueryTerm[] {
  const weights = new Map<string, number>();

  for (const token of tokens) weights.set(token, 1);

  for (const token of tokens) {
    for (const related of SYNONYMS.get(token) ?? []) {
      if (!weights.has(related)) weights.set(related, SYNONYM_WEIGHT);
    }
  }

  return [...weights].map(([term, weight]) => ({ term, weight }));
}

type SearchIndex = {
  docs: Doc[];
  frequencies: Map<string, number>[];
  lengths: number[];
  documentFrequency: Map<string, number>;
  averageLength: number;
};

let searchIndex: SearchIndex | null = null;

function getIndex(): SearchIndex {
  if (searchIndex) return searchIndex;

  const docs = getDocs();

  // The title counts twice: a project's name is a stronger signal than any
  // one sentence of its description.
  const tokens = docs.map((doc) => [
    ...tokenize(doc.title),
    ...tokenize(doc.title),
    ...tokenize(doc.tags.join(' ')),
    ...tokenize(doc.body),
  ]);

  const frequencies = tokens.map((docTokens) => {
    const counts = new Map<string, number>();
    for (const token of docTokens) counts.set(token, (counts.get(token) ?? 0) + 1);
    return counts;
  });

  const documentFrequency = new Map<string, number>();
  for (const docTokens of tokens) {
    for (const token of new Set(docTokens)) {
      documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
    }
  }

  const lengths = tokens.map((docTokens) => docTokens.length);
  const averageLength = lengths.reduce((total, length) => total + length, 0) / lengths.length;

  searchIndex = { docs, frequencies, lengths, documentFrequency, averageLength };
  return searchIndex;
}

/** Builds the index ahead of the first question, so opening the panel — not
 *  answering — pays for it. */
export function warmAssistant(): void {
  getIndex();
}

function idf(index: SearchIndex, term: string): number {
  const containing = index.documentFrequency.get(term) ?? 0;
  return Math.log(1 + (index.docs.length - containing + 0.5) / (containing + 0.5));
}

function bm25(index: SearchIndex, terms: QueryTerm[], position: number): number {
  const frequencies = index.frequencies[position];
  const length = index.lengths[position];

  let score = 0;

  for (const { term, weight } of terms) {
    const frequency = frequencies.get(term);
    if (!frequency) continue;

    const normalization = BM25_K1 * (1 - BM25_B + (BM25_B * length) / index.averageLength);
    score += weight * idf(index, term) * ((frequency * (BM25_K1 + 1)) / (frequency + normalization));
  }

  return score;
}

/**
 * How much of what the visitor actually asked this document accounts for.
 *
 * BM25 alone cannot tell "no good match" from "best of a bad lot" — it always
 * ranks something first. Coverage is the guard: a document answers the
 * question only if it contains the question's rarer terms. Synonym matches
 * count half, since they are our substitution, not the visitor's word.
 */
function coverage(index: SearchIndex, terms: QueryTerm[], position: number): number {
  const asked = terms.filter((term) => term.weight === 1);
  if (!asked.length) return 0;

  const frequencies = index.frequencies[position];

  let matched = 0;
  let total = 0;

  for (const { term } of asked) {
    const weight = idf(index, term);
    total += weight;

    if (frequencies.has(term)) {
      matched += weight;
    } else {
      const related = SYNONYMS.get(term);
      if (related && [...related].some((other) => frequencies.has(other))) matched += weight * 0.5;
    }
  }

  return total ? matched / total : 0;
}

type Hit = { doc: Doc; score: number; coverage: number };

function search(terms: QueryTerm[], limit = 8): Hit[] {
  const index = getIndex();

  return index.docs
    .map((doc, position) => ({
      doc,
      score: bm25(index, terms, position),
      coverage: coverage(index, terms, position),
    }))
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Documents of one kind that answer the question about as well as the best of
 * them does. The relative cut is what keeps a list honest: for "geothermal
 * projects", entries matched only through a synonym score half as well as a
 * literal match and drop out, but for a two-word topic where nothing matches
 * both words, the half-matches are the answer and they stay.
 */
function relevantHits(hits: Hit[], kind: DocKind): Hit[] {
  const matching = hits.filter((hit) => hit.doc.kind === kind && hit.coverage >= CONFIDENCE_FLOOR);
  if (!matching.length) return [];

  const best = Math.max(...matching.map((hit) => hit.coverage));

  return matching.filter((hit) => hit.coverage >= best * 0.75);
}

/**
 * Detects a question about one thing by name — "tell me about the Geothermal
 * Asset Transition Tool" — by asking how much of the *title* the visitor
 * typed, rather than how much of the question the document matched.
 */
function namedEntity(hits: Hit[], topicTokens: string[]): Hit | null {
  if (topicTokens.length < 2) return null;

  const asked = new Set(topicTokens);

  for (const hit of hits.slice(0, 3)) {
    if (hit.doc.kind !== 'project' && hit.doc.kind !== 'article') continue;

    const titleTokens = new Set(tokenize(hit.doc.title));
    if (titleTokens.size < 2) continue;

    const overlap = [...titleTokens].filter((token) => asked.has(token)).length / titleTokens.size;
    if (overlap >= 0.6) return hit;
  }

  return null;
}

/**
 * Picks the navigation target by summing scores per route across the top
 * hits rather than trusting the single best document — one long article chunk
 * should not outvote two CV entries that agree.
 */
function pickRoute(hits: Hit[]): Pick<AssistantReply, 'route' | 'routeLabel'> {
  const considered = hits.slice(0, 4);
  if (!considered.length) return {};

  const weights = new Map<string, { label: string; weight: number }>();

  for (const hit of considered) {
    const existing = weights.get(hit.doc.route);
    weights.set(hit.doc.route, {
      label: hit.doc.routeLabel,
      weight: (existing?.weight ?? 0) + hit.score,
    });
  }

  const [route, best] = [...weights.entries()].sort((a, b) => b[1].weight - a[1].weight)[0];

  return { route, routeLabel: best.label };
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'“(])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;

  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');

  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.]$/, '')}…`;
}

function firstSentence(text: string): string {
  return splitSentences(text)[0] ?? text;
}

/**
 * Extractive summary: keeps the sentences that carry the query's terms, in
 * their original order, and stops at MAX_ANSWER_CHARS. This is why answers
 * read as quotes rather than paraphrase — nothing here can invent a fact.
 */
function summarize(body: string, terms: QueryTerm[], limit: number): string {
  const index = getIndex();
  const sentences = splitSentences(body);

  if (sentences.length <= limit) return truncate(sentences.join(' '), MAX_ANSWER_CHARS);

  const scored = sentences.map((sentence, position) => {
    const tokens = new Set(tokenize(sentence));

    let score = 0;
    for (const { term, weight } of terms) {
      if (tokens.has(term)) score += weight * idf(index, term);
    }

    // A small lead bias: the opening sentence usually states the subject.
    return { sentence, position, score: score + (position === 0 ? 0.6 : 0) };
  });

  const kept = scored
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .sort((a, b) => a.position - b.position)
    .map((entry) => entry.sentence);

  return truncate(kept.join(' '), MAX_ANSWER_CHARS);
}

function bullets(lines: string[]): string {
  return lines.map((line) => `- ${line}`).join('\n');
}

function projectById(id?: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

function articleById(id?: string): Article | undefined {
  return articles.find((article) => article.id === id);
}

function projectBullet(project: Project): string {
  return `**${project.title}** — ${truncate(firstSentence(project.description), 150)}`;
}

/* ---------------------------------------------------------------------- */
/* Answer composers                                                       */
/* ---------------------------------------------------------------------- */

function answerFromProject(project: Project, terms: QueryTerm[]): AssistantReply {
  return {
    text: [
      `**${project.title}** · ${project.category}`,
      summarize(project.description, terms, 2),
      `Stack: ${project.stack.join(', ')}. [Source code](${project.github})`,
    ].join('\n\n'),
    route: '/projects',
    routeLabel: 'Browse projects',
  };
}

function answerFromArticle(article: Article, doc: Doc, terms: QueryTerm[]): AssistantReply {
  return {
    text: [
      `From **“${article.title}”** (${article.date}):`,
      summarize(doc.body, terms, 3),
    ].join('\n\n'),
    route: `/articles/${article.id}`,
    routeLabel: 'Read the article',
  };
}

function listProjects(terms: QueryTerm[], hits: Hit[]): AssistantReply {
  const matches = relevantHits(hits, 'project')
    .slice(0, MAX_LIST_ITEMS)
    .map((hit) => projectById(hit.doc.refId))
    .filter((project): project is Project => Boolean(project));

  // One clearly-named project deserves its own answer, not a list of one.
  if (matches.length === 1) return answerFromProject(matches[0], terms);

  if (!matches.length) {
    const featured = projects.filter((project) => project.featured).slice(0, 3);

    return {
      text: [
        `Yonathan has ${projects.length} projects in the portfolio, spanning machine learning, energy analytics, and business intelligence. Three he features:`,
        bullets(featured.map(projectBullet)),
        'Ask about a theme — geothermal, forecasting, computer vision, dashboards — to narrow it down.',
      ].join('\n\n'),
      route: '/projects',
      routeLabel: 'Browse projects',
    };
  }

  return {
    text: [
      `${matches.length} of Yonathan’s ${projects.length} projects fit that best:`,
      bullets(matches.map(projectBullet)),
    ].join('\n\n'),
    route: '/projects',
    routeLabel: 'Browse projects',
  };
}

function listArticles(terms: QueryTerm[], hits: Hit[]): AssistantReply {
  // Asking what he wrote *about* something is a question about the piece, not
  // a request for the reading list.
  const [best] = relevantHits(hits, 'article');

  if (best) {
    const article = articleById(best.doc.refId);
    if (article) return answerFromArticle(article, best.doc, terms);
  }

  return {
    text: [
      `Yonathan has written ${articles.length} articles on this site:`,
      bullets(
        articles.map(
          (article) => `**${article.title}** — ${truncate(article.summary, 140)} (${article.readTime})`,
        ),
      ),
    ].join('\n\n'),
    route: '/articles',
    routeLabel: 'Read articles',
  };
}

function answerSkills(terms: QueryTerm[]): AssistantReply {
  const asked = new Set(terms.filter((term) => term.weight === 1).map((term) => term.term));

  let best: { group: string; item: string; items: string[]; ratio: number } | null = null;

  for (const [group, items] of Object.entries(skills)) {
    for (const item of items) {
      const tokens = tokenize(item);
      if (!tokens.length) continue;

      // A ratio, not a hit count: "Python (pandas, numpy, scikit-learn)"
      // contains "learn", but someone asking about deep learning means the
      // entry that is *mostly* those words.
      const ratio = tokens.filter((token) => asked.has(token)).length / tokens.length;

      if (ratio >= 0.5 && (!best || ratio > best.ratio)) best = { group, item, items, ratio };
    }
  }

  if (best) {
    return {
      text: [
        `Yes — ${best.item} sits in Yonathan’s **${best.group}** toolkit.`,
        `The full group: ${best.items.join(', ')}.`,
      ].join('\n\n'),
      route: '/',
      routeLabel: 'See all skills',
    };
  }

  return {
    text: [
      'Yonathan’s toolkit, as listed on the site:',
      bullets(
        Object.entries(skills).map(
          ([group, items]) => `**${group}** — ${truncate(items.join(', '), 180)}`,
        ),
      ),
    ].join('\n\n'),
    route: '/',
    routeLabel: 'See all skills',
  };
}

function answerFromCv(sectionId: string, terms: QueryTerm[]): AssistantReply {
  const section = cvSections.find((candidate) => candidate.id === sectionId);
  if (!section) return { text: FALLBACK_TEXT };

  const index = getIndex();

  // Every entry is listed, but the one the question is really about gets its
  // detail line — that is the difference between a CV dump and an answer.
  const ranked = section.entries.map((entry) => {
    const tokens = new Set(tokenize(`${entry.title} ${entry.meta} ${entry.points.join(' ')}`));

    let relevance = 0;
    for (const { term, weight } of terms) {
      if (tokens.has(term)) relevance += weight * idf(index, term);
    }

    return { entry, relevance };
  });

  const detailed = ranked.slice().sort((a, b) => b.relevance - a.relevance)[0];

  return {
    text: [
      `Yonathan’s ${section.heading.toLowerCase()}:`,
      bullets(
        ranked.map(({ entry }) =>
          entry === detailed.entry && detailed.relevance > 0
            ? `**${entry.title}** — ${entry.meta}. ${truncate(firstSentence(entry.points[0]), 180)}`
            : `**${entry.title}** — ${entry.meta}`,
        ),
      ),
    ].join('\n\n'),
    route: '/cv',
    routeLabel: 'Open CV',
  };
}

function answerCv(): AssistantReply {
  const counts = cvSections.map(
    (section) => `${section.entries.length} ${section.heading.toLowerCase()} entries`,
  );

  return {
    text: `The CV page has ${counts.join(' and ')} — roles, dates, and what each one involved.`,
    route: '/cv',
    routeLabel: 'Open CV',
  };
}

function answerAbout(terms: QueryTerm[]): AssistantReply {
  return {
    text: summarize(biography.intro.join(' '), terms, 2),
    route: '/biography',
    routeLabel: 'Open biography',
  };
}

function answerContact(): AssistantReply {
  const { email, linkedin, github, medium, whatsapp } = profile.links;

  return {
    text: [
      `${profile.shortName} is open to opportunities in ${profile.openTo}.`,
      bullets([
        `Email — [${email}](mailto:${email})`,
        `LinkedIn — [linkedin.com/in/yonathanhary](${linkedin})`,
        `GitHub — [YonathanHH](${github})`,
        `Medium — [@yonathanhary1](${medium})`,
        `WhatsApp — [message directly](${whatsapp})`,
      ]),
    ].join('\n\n'),
    route: '/biography',
    routeLabel: 'Open biography',
  };
}

function answerCapabilities(): AssistantReply {
  return {
    text: [
      'I answer from this site’s own content — nothing I say is generated, and nothing you type leaves your browser. I can cover:',
      bullets([
        `**Projects** — all ${projects.length} of them, by topic or by name`,
        '**Background** — biography and profile summary',
        '**CV** — working experience and education',
        '**Skills** — tools, platforms, and domain expertise',
        `**Articles** — the ${articles.length} pieces published here`,
        '**Contact** — how to reach Yonathan',
      ]),
    ].join('\n\n'),
  };
}

/** The original keyword FAQ, kept as the last stop before giving up. */
function answerFromFaq(query: string): AssistantReply | null {
  const normalized = normalize(query);

  const ranked = chatbotFaq
    .map((item) => ({
      item,
      score: item.keywords.reduce((score, keyword) => {
        const normalizedKeyword = normalize(keyword);

        if (normalized === normalizedKeyword) return score + 6;
        if (normalized.includes(normalizedKeyword)) return score + 3;

        const words = normalizedKeyword.split(' ');
        return score + words.filter((word) => normalized.includes(word)).length;
      }, 0),
    }))
    .sort((a, b) => b.score - a.score);

  const best = ranked[0];
  if (!best || best.score < 2) return null;

  return { text: best.item.answer, route: best.item.route, routeLabel: best.item.routeLabel };
}

/* ---------------------------------------------------------------------- */
/* Intent routing                                                         */
/* ---------------------------------------------------------------------- */

const GREETING = /^(hi|hai|halo|hello|hey|yo|good (morning|afternoon|evening|day))\b/;
const THANKS = /\b(thanks|thank you|thx|makasih|terima kasih)\b/;
const CAPABILITIES = /\b(what can you do|who are you|what are you|how (do|can) i use you)\b|^help$/;
const CONTACT = /\b(contact|email|e mail|linkedin|hire|hiring|reach|connect|available|availability|whatsapp|recruit\w*|freelance|opportunit\w*)\b/;
const ARTICLES = /\b(articles?|blog|blogs|posts?|writing|writes|wrote|written|medium)\b/;
const PROJECTS = /\b(projects?|portfolio|case stud\w*|repos?|repositor\w*|built|build)\b/;
const SKILLS = /\b(skills?|stack|tools?|tooling|tech|technolog\w*|software|proficien\w*|languages?)\b/;
const EDUCATION = /\b(education|study|studied|studies|degree|university|college|school|masters?|msc|bachelors?|bsc|gpa|graduat\w*|thesis|campus)\b/;
const EXPERIENCE = /\b(experience|jobs?|work history|working experience|career|employ\w*|roles?|positions?|intern\w*)\b/;
const CV = /\b(cv|resume|curriculum vitae)\b/;
const ABOUT = /\b(who is|about (yonathan|him|himself)|tell me about (yonathan|him|himself)|introduce|background|biography|profile)\b/;

/**
 * Answers a visitor's question.
 *
 * Synchronous by design: ranking a few dozen documents is a millisecond of
 * work, so there is nothing to await, nothing to rate limit, and nothing that
 * can be offline.
 */
export function askAssistant(query: string): AssistantReply {
  const trimmed = query.trim();
  if (!trimmed) return answerCapabilities();

  const normalized = normalize(trimmed);
  const tokens = tokenize(trimmed);
  const terms = expand(tokens);

  // What the question is *about*, with the question's own scaffolding removed.
  const topicTokens = tokens.filter(
    (token) => !INTENT_TERMS.has(token) && !PERSON_TERMS.has(token),
  );
  const topics = topicTokens.length ? expand(topicTokens) : terms;

  const hits = search(terms);
  // No topic left after the scaffolding — "what projects does he have?" — so
  // there is nothing to rank, and the list answers fall back to highlights.
  const topicHits = topicTokens.length ? search(topics) : [];

  // The best-scoring document that actually covers the question. Taking
  // hits[0] instead would let a long, term-rich article outrank the one entry
  // that contains every word the visitor typed.
  const top = hits.find((hit) => hit.coverage >= CONFIDENCE_FLOOR);

  if (GREETING.test(normalized)) {
    return {
      text: `Hi — ask me anything about ${profile.shortName}: his projects, background, CV, skills, or articles.`,
    };
  }

  if (THANKS.test(normalized)) return { text: 'Anytime. Ask away if something else comes up.' };
  if (CAPABILITIES.test(normalized)) return answerCapabilities();

  // A thing asked for by name outranks every intent: "tell me about the
  // Geothermal Asset Transition Tool" is not a question about tools.
  const named = namedEntity(topicHits, topicTokens);

  if (named) {
    const project = named.doc.kind === 'project' ? projectById(named.doc.refId) : undefined;
    if (project) return answerFromProject(project, topics);

    const article = articleById(named.doc.refId);
    if (article) return answerFromArticle(article, named.doc, topics);
  }

  if (CONTACT.test(normalized)) return answerContact();
  if (ARTICLES.test(normalized)) return listArticles(topics, topicHits);
  if (PROJECTS.test(normalized)) return listProjects(topics, topicHits);
  if (SKILLS.test(normalized)) return answerSkills(terms);
  if (EDUCATION.test(normalized)) return answerFromCv('education', terms);
  if (EXPERIENCE.test(normalized)) return answerFromCv('experience', terms);
  if (CV.test(normalized)) return answerCv();

  // "Tell me about him" is a biography question; "tell me about the
  // geothermal tool" only looks like one, so a real topic wins.
  if (ABOUT.test(normalized) && !topicTokens.length) return answerAbout(terms);

  if (top) {
    // "Has he used Docker?" is answered by the skill, not by reciting the
    // whole toolkit the skill sits in.
    if (top.doc.kind === 'skills') return answerSkills(terms);

    if (top.doc.kind === 'project') {
      const project = projectById(top.doc.refId);
      if (project) return answerFromProject(project, terms);
    }

    if (top.doc.kind === 'article') {
      const article = articleById(top.doc.refId);
      if (article) return answerFromArticle(article, top.doc, terms);
    }

    if (top.doc.kind === 'cv') {
      const [sectionId] = (top.doc.refId ?? '').split('|');
      if (sectionId) return answerFromCv(sectionId, terms);
    }

    return { text: summarize(top.doc.body, terms, 3), ...pickRoute(hits) };
  }

  return answerFromFaq(trimmed) ?? { text: FALLBACK_TEXT };
}
