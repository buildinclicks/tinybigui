---
"@tinybigui/react": minor
---

Radio: align styling with MD3 Expressive variants-vs-states architecture

Rewrites the Radio component visual layer to match the Switch component's architecture:

- All interaction/selection/error states are now driven by `group-data-[x]/radio` Tailwind selectors on the root label — no state variants or compoundVariants in CVA.
- Replaces the SVG + `animate-pulse` focus ring with div-based slots (state layer, outer ring, inner dot, MD3 focus ring) using proper MD3 spring motion token pairs (`spring-standard-fast-effects` for color/opacity, `spring-standard-fast-spatial` for dot scale).
- Fixes `isInvalid` forwarding in `RadioGroup` so `data-invalid` is correctly emitted on individual Radio elements.
- Inner dot animates scale 0→1 on selection using the spatial spring token.
