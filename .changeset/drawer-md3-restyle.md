---
"@tinybigui/react": minor
---

Refactor Navigation Drawer to MD3 slot-based "Variants-vs-States" architecture.

**Architectural Changes**

- `DrawerItem` now follows the slot pattern used by `Button` and `MenuItem`: the root element is `group/draweritem` and each visual part (active indicator, state layer, focus ring, ripple, icon, label, badge) is a discrete `<span>` slot whose appearance is driven by `group-data-[x]/draweritem` Tailwind selectors.
- Interaction states (hover, focus-visible, pressed) are owned by the styled layer via `useHover` / `useFocusRing` / press callbacks and emitted as `data-*` attributes through `getInteractionDataAttributes` — no CVA variants for states.
- All color/opacity slot transitions now use `duration-spring-standard-fast-effects ease-spring-standard-fast-effects` (effects tokens, no overshoot). Slide-in animation retains legacy navigation-level tokens (`duration-medium4 ease-emphasized-decelerate`).

**MD3 Spec Alignment**

- Container: `bg-surface-container-low` for both standard and modal variants; modal adds `shadow-elevation-1`.
- Corner radius corrected: `rounded-r-lg` (16dp, MD3 corner-large) — was `rounded-r-xl` (28dp).
- Item height: `h-14` (56dp); shape `rounded-full`; padding `pl-4 pr-6`; icon-to-label gap `gap-3` (12dp).
- Inactive content (icon / label / badge): `text-on-surface-variant`. Active: `bg-secondary-container` indicator, `text-on-secondary-container` content.
- State-layer colors: `bg-on-surface-variant` inactive / `bg-on-secondary-container` active; hover 8% / press 10% opacity.
- Scrim: `bg-scrim opacity-32`.
- Icon size corrected to 24dp (`h-6 w-6`).

**Breaking Changes**

- `iconOnly` prop removed from `Drawer` and `DrawerItem` (belongs to NavigationRail, not MD3 nav drawer). `DrawerIconOnlyContext` removed.
- `secondaryText` prop removed from `DrawerItem` (not in MD3 nav-drawer anatomy).
- `badge` prop type changed from `DrawerItemBadgeConfig | ReactNode` to `number | string`. The badge now renders as plain inline text colored by item state instead of an error-colored pill.
- `DrawerItemBadgeConfig` type removed.

**New Additions**

- `DrawerHeadline` component: MD3 anatomy element 2 — header text for the drawer (`text-title-small text-on-surface-variant`).
- `DrawerContext` exported (replaces the removed `DrawerIconOnlyContext`).
- All slot CVA functions exported: `drawerItemActiveIndicatorVariants`, `drawerItemStateLayerVariants`, `drawerItemFocusRingVariants`, `drawerItemIconVariants`, `drawerItemLabelVariants`, `drawerItemBadgeVariants`, `drawerHeadlineVariants`.
