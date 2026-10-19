# Bundled fonts

Both faces are self-hosted. Nothing is fetched from a third-party font CDN at
runtime, and there is no Google Fonts `<link>` anywhere in the project.

| File | Family | Axes | Licence |
| --- | --- | --- | --- |
| `satoshi-variable.woff2` | Satoshi | weight 300-900 | Free for personal and commercial use (Indian Type Foundry, via Fontshare) |
| `jetbrains-mono-variable.woff2` | JetBrains Mono | weight 100-800, Latin subset | SIL Open Font License 1.1 |

## Why these two

Satoshi carries display and body copy. It is a grotesque with more character
than the system default and it holds up at both 96px (the hero headline) and
15px (article prose, which this site has a lot of).

JetBrains Mono carries the machine register: project ids, result counts, dates,
stack tags, filter values. That is not decoration. A portfolio whose subject
matter is numerical work reads as more honest when the numbers are set in a
face that was designed for them.

## Metric-matched fallbacks

`src/index.css` defines `Satoshi Fallback` and `JetBrains Mono Fallback`
`@font-face` rules with `size-adjust` and metric overrides, so the swap from
the local system font to the downloaded face does not move anything. The
overrides are derived from the real fonts, not guessed; the arithmetic is
written out in the comment above those rules.

Satoshi's own metrics, for reference:

```
upm 1000   ascent 1010   descent -240   line-gap 100   x-height 500   cap 740
```
