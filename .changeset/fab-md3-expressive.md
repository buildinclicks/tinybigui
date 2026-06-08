---
"@tinybigui/react": minor
---

refactor(fab): M3 Expressive refactor — slot architecture, new size scale, solid colors

**Breaking changes (pre-1.0 minor bump):**

- Default `size` changed from `"medium"` to `"fab"`. Update `size="medium"` if you relied on the 56dp size — it now renders the 80dp M3 Expressive Medium FAB.
- `size="medium"` now renders a **80dp** container (M3 Expressive Medium FAB), not 56dp.
- Default `color` changed from `"primary"` to `"primary-container"`. The old `color="primary"` is now a **solid** color style (`bg-primary / text-on-primary`).
- `color="secondary"` and `color="tertiary"` are now **solid** styles (bg-secondary / bg-tertiary).

**New features:**

- `size="fab"` (56dp) — new canonical default size.
- `size="medium"` (80dp) — M3 Expressive Medium FAB with 20dp corners and 28dp icon.
- `color="primary-container"` / `"secondary-container"` / `"tertiary-container"` — container color styles (previous default behaviour).
- `color="primary"` / `"secondary"` / `"tertiary"` — new solid color styles (M3 Expressive).
- Dedicated focus-ring slot (`inset-[-3px]`, keyboard-only, never clipped).
- Dedicated state-layer slot with correct opacities: hover 8% / focus 10% / pressed 10%.
- State-layer color matches icon/on-color per MD3 spec.
- Elevation 3 base → 4 hover → 3 focus/pressed per MD3 spec.
- `useHover` + `useFocusRing` + `isPressed` via React Aria — full `group-data-[x]/fab` attribute system.
- MD3 motion tokens (`duration-spring-standard-fast-effects`, `ease-spring-standard-fast-effects`) replace hardcoded `duration-200`.

**Deprecated (functional, with dev warning):**

- `size="small"` — use `size="fab"` instead.
- `color="surface"` — use `color="primary-container"` instead.
