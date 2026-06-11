---
"@tinybigui/tokens": patch
---

Fix --opacity-\* tokens to use percentage values instead of unitless decimals.

Tailwind v4 emits named --opacity-\* theme values verbatim into color-mix(), which requires a <percentage> stop value. The previous unitless decimals (0.08, 0.38, etc.) produced syntactically invalid color-mix() declarations that browsers silently discarded, breaking every color opacity modifier class (text-on-surface/38, bg-on-surface/12, bg-scrim/32, etc.) across all components.

CSS opacity also accepts percentages identically to decimals, so bare opacity-\* utility classes are unaffected.
