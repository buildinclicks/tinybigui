---
"@tinybigui/react": minor
---

refactor(icon-button): M3 Expressive sizing system, Variants-vs-States architecture, press shape-morph

**Breaking changes:**

- `size` prop values renamed to the M3 Expressive 5-tier system. Map your existing values as follows:
  - old `small` (32dp) → new `xsmall`
  - old `medium` (40dp) → new `small`
  - old `large` (48dp) → new `medium`
  - new `large` (96dp) and `xlarge` (136dp) are added

**New props:**

- `width: 'narrow' | 'default' | 'wide'` — adjusts container width relative to height (default: `'default'`)
- `shape: 'round' | 'square'` — `round` = circular (default); `square` = MD3 size-tiered corner radius
- `selectedIcon: React.ReactNode` — icon shown when a toggle button (`selected` prop defined) is in the ON state

**Improvements:**

- Migrated to the Variants-vs-States architecture (same pattern as `Switch`): all interaction and selection states are driven by `data-*` attributes emitted by `IconButtonHeadless` and consumed by slot CVA classes via `group-data-[x]/icon-button` selectors — no state variants in CVA
- `IconButtonHeadless` now runs `useHover` + `useFocusRing` and emits `data-hovered`, `data-focus-visible`, `data-pressed`, `data-selected`, `data-disabled`, `data-toggle` via `getInteractionDataAttributes`
- MD3-correct state layers: per-variant overlay color via `--ib-sl` CSS variable, hover 8% / focus-visible 10% / pressed 10% opacity
- MD3-correct disabled: icon content `text-on-surface/38`; filled/tonal containers collapse to `bg-on-surface/12`; outlined border collapses to `border-on-surface/12`
- Press shape-morph: `round` shape springs to size-tiered square corners on press via `data-[pressed]:rounded-[var(--ib-radius-press)]` + expressive-fast-spatial easing
- Toggle-off filled/tonal: correct `surface-container-highest` background per MD3 Flutter spec
- Slot-based CVA with CSS role variables (`--ib-bg`, `--ib-bg-off`, `--ib-bg-on`, `--ib-fg`, `--ib-fg-off`, `--ib-fg-on`, `--ib-sl`, `--ib-border`, `--ib-radius`, `--ib-radius-press`) for clean variant × state separation
- New exports: `iconButtonRootVariants`, `iconButtonStateLayerVariants`, `iconButtonIconVariants`, `IconButtonWidth`, `IconButtonShape`
