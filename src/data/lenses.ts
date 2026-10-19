/**
 * Curated lenses for the landing-page archive.
 *
 * The project's own `category` field is written for a catalogue: it often
 * carries two or three areas ("Data Engineering · Machine Learning · Customer
 * Behavior"), which makes eleven overlapping filter values. A landing page
 * wants an index you can read in one glance, so each project is assigned
 * exactly one lens here, by hand, by what the work actually is. Because every
 * project has one, the counts add up and no project hides from every filter.
 *
 * These are editorial groupings, not a taxonomy claim. The Projects page keeps
 * the fuller discipline list for anyone who wants it.
 */
export const LENSES = ['Energy', 'Earth', 'Models', 'AI', 'Data'] as const;

export type Lens = (typeof LENSES)[number];

export const PROJECT_LENS: Record<string, Lens> = {
  // Energy: geothermal, power systems, energy transition, sustainability.
  'PROJ-001': 'Energy',
  'PROJ-002': 'Energy',
  'PROJ-005': 'Energy',
  'PROJ-010': 'Energy',
  'PROJ-012': 'Energy',
  'PROJ-020': 'Energy',
  'PROJ-027': 'Energy',
  'PROJ-029': 'Energy',
  'PROJ-035': 'Energy',

  // Earth: geology, geospatial, remote sensing, subsurface.
  'PROJ-007': 'Earth',
  'PROJ-011': 'Earth',
  'PROJ-013': 'Earth',
  'PROJ-015': 'Earth',
  'PROJ-034': 'Earth',

  // Models: prediction, classification, forecasting, recommendation.
  'PROJ-003': 'Models',
  'PROJ-008': 'Models',
  'PROJ-014': 'Models',
  'PROJ-016': 'Models',
  'PROJ-017': 'Models',
  'PROJ-022': 'Models',
  'PROJ-030': 'Models',
  'PROJ-033': 'Models',

  // AI: language models, retrieval, agents, automation.
  'PROJ-024': 'AI',
  'PROJ-025': 'AI',
  'PROJ-026': 'AI',
  'PROJ-031': 'AI',
  'PROJ-032': 'AI',

  // Data: analysis, dashboards, engineering, quantitative work.
  'PROJ-004': 'Data',
  'PROJ-006': 'Data',
  'PROJ-009': 'Data',
  'PROJ-018': 'Data',
  'PROJ-019': 'Data',
  'PROJ-021': 'Data',
  'PROJ-023': 'Data',
  'PROJ-028': 'Data',
};
