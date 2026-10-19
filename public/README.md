# Hero image derivatives

`hero-bg.jpg` is the original camera frame (Canon EOS M50m2, 6000x4000, 8.3 MB)
and is kept untouched as the source of truth. Nothing on the page requests it;
it is here so the derivatives can be regenerated and so the original is never
lost.

Everything else in this list is generated from it. The generator is a short
Pillow script (see the commit message), because the project has no image build
step and does not need one.

## Landscape frame, 3:2

Used from 1024px up, where the viewport is wider than the subject's aspect and
the whole ridge line reads.

| File | Size | Role |
| --- | --- | --- |
| `hero-bg-828.webp` | 41 KB | 828w candidate |
| `hero-bg-1280.webp` | 87 KB | 1280w candidate |
| `hero-bg-1920.webp` | 160 KB | 1920w candidate, preloaded on desktop |
| `hero-bg-2560.webp` | 246 KB | 2560w candidate for high-DPI |
| `hero-bg-1920.jpg` | 308 KB | progressive JPEG fallback |

## Portrait frame, 5:6

Used below 1024px. A 3:2 frame in a portrait viewport crops away roughly 70% of
its width, which is why the subject was missing from the phone hero entirely.
This crop is framed around the figure with the ochre ridge filling the
surround, so no `object-position` nudging is needed at any phone width.

| File | Size | Role |
| --- | --- | --- |
| `hero-bg-portrait-640.webp` | 42 KB | 640w candidate |
| `hero-bg-portrait-900.webp` | 75 KB | 900w candidate |
| `hero-bg-portrait-1200.webp` | 113 KB | 1200w candidate |
| `hero-bg-portrait-900.jpg` | 137 KB | progressive JPEG fallback |

## Social card

`og-card.jpg` is a 1200x630 render at 83 KB. The image is mirrored so the
subject sits right of centre and the left third stays clear for type, matching
the mirrored framing the hero already uses in CSS. The scrim releases before it
reaches the figure, and the brand teal appears as a rule above the name and a
bar along the bottom edge.

The previous `og:image` pointed at the 8.3 MB camera original. Every social
scraper imposes a fetch budget well under that, so the previous preview was
being dropped rather than cropped.
