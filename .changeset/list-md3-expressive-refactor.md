---
"@tinybigui/react": minor
---

Refactor List to Variants-vs-States architecture with MD3 state layers, focus ring, and spring motion

- Move all interaction/selection state out of CVA variant keys into data-\* attributes + group-data-[x]/list-item slot selectors (matches Button, Tabs, Switch pattern)
- Add dedicated state layer span with MD3 spring-standard-fast-effects motion (opacity 8/10/10 for hover/focus/pressed)
- Add keyboard focus ring span (outline-secondary, inset-0, opacity transition)
- Replace scoped `group` with named `group/list-item` to prevent style leakage
- Use `getInteractionDataAttributes` helper for consistent presence-based encoding
- Propagate selected/disabled colors to leading, trailing, overline, headline, and supporting text slots via group-data selectors
- Convert ListItemLeading, ListItemTrailing, ListItemText to slot CVAs
- Fix ListDensity JSDoc: correct min-heights to 56/72/88dp (was 48/64dp)
- Remove unused per-item `onAction` from `ListItemProps` (List-level `onAction` is the correct API)
- Export all new slot CVA variants and VariantProps types
