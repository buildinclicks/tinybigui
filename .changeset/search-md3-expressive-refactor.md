---
"@tinybigui/react": patch
---

refactor(search): md3 expressive variants-vs-states architecture

Aligns the Search component with the project-wide Variants-vs-States architecture used by Button and Switch:

- Rebuilds `Search.variants.ts` into per-slot CVAs (root, stateLayer, focusRing, leadingIcon, trailingAction, avatar, input for the bar; container, header, backButton, clearButton, input, divider, content for the view). Removes interaction-state CVA variants (`focused`, `disabled`, `noActions`) — all states now driven by `data-*` attributes via `group-data-[x]/search` selectors.
- Refactors `SearchBar.tsx` to use React Aria `useHover` + `useFocusRing({ within: true })` + `getInteractionDataAttributes`, with a sibling focus-ring span (outside `overflow-hidden`) matching the Button/Switch pattern. The M3 Expressive pane-margin transition (24dp → 12dp on focus) now uses the correct Expressive fast spatial spring token, guarded by `useReducedMotion`.
- Refactors `SearchView.tsx` to apply per-slot CVAs directly instead of descendant-selector `[&>[data-slot=...]]` blobs and the `getHeaderClasses()` helper. Enter motion is layout-aware: docked → `animate-md-scale-in`, fullscreen → `animate-md-fade-in`.
- Replaces literal `←` back glyph and `✕` clear glyph in `SearchHeadless.tsx` with inline MD3 SVG icons (24×24, `currentColor`, `aria-hidden`).
- Updates `SearchViewHeadless` to accept per-slot `className` props so styled classes are applied directly on each element.
- Updates tests to assert on the new slot elements and data-attribute–driven class names.
