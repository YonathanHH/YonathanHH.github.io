/**
 * Intrinsic pixel dimensions of every project image, in one table.
 *
 * The archive sheet on the landing page keeps each frame at its own aspect
 * ratio instead of cropping everything into one shape. That means the width of
 * a frame is derived from its height, so the ratio has to be known before the
 * image arrives: without it the browser reserves the wrong width, the row
 * wraps against a placeholder box, and the whole wall reflows as the lazy
 * images land.
 *
 * Every value for the local files was measured off the file itself, not
 * guessed. GitHub's OpenGraph cards are always 1200x630, and the single remote
 * logo is square.
 */
const LOCAL: Record<string, readonly [number, number]> = {
  '/image/anime.png': [868, 768],
  '/image/backtest.png': [1920, 1280],
  '/image/bangkok.png': [1846, 828],
  '/image/bank.png': [1860, 856],
  '/image/churn.png': [1125, 586],
  '/image/elec_mix.png': [3373, 1033],
  '/image/esg.png': [776, 595],
  '/image/eurosat.png': [1145, 708],
  '/image/ewaste.png': [1142, 472],
  '/image/geol.png': [1110, 856],
  '/image/geothermal.png': [615, 479],
  '/image/geothermal1.png': [1134, 595],
  '/image/global_powerplant.png': [1852, 786],
  '/image/hotel.png': [850, 855],
  '/image/household.png': [824, 850],
  '/image/indosent.png': [1354, 865],
  '/image/innova.png': [708, 368],
  '/image/leekwan.png': [1272, 767],
  '/image/lstm.png': [1821, 698],
  '/image/movielens.png': [1171, 582],
  '/image/netflix.png': [1125, 563],
  '/image/pytough.png': [1415, 936],
  '/image/rumah123.png': [909, 476],
  '/image/uk_cars.jpg': [5120, 2880],
  '/image/wave.png': [1132, 454],
};

const GITHUB_OG: readonly [number, number] = [1200, 630];
const SQUARE: readonly [number, number] = [1000, 1000];

export function imageSize(src: string): readonly [number, number] {
  const local = LOCAL[src];
  if (local) return local;
  if (src.includes('opengraph.githubassets.com')) return GITHUB_OG;
  return SQUARE;
}

/**
 * The one image that is a logo on a transparent field rather than a
 * screenshot. It is fitted inside its frame instead of filling it.
 */
export function isLogoImage(src: string): boolean {
  return !src.startsWith('/image/') && !src.includes('opengraph.githubassets.com');
}
