---
"@tinybigui/react": patch
---

Close MD3 Navigation Drawer spec gaps: measurements, typography, motion, and states.

**Container / Measurements**

- Added `w-drawer` (360dp) class to `drawerVariants` — was accidentally absent despite the doc comment claiming it.
- Standard variant now has `rounded-none` (square trailing edge, flush with viewport). Modal variant retains `rounded-r-lg` (16dp trailing corner per MD3). Both previously used `rounded-r-lg`.
- Standard variant `z-50` stacking context added for correct overlay ordering.

**Motion (Standard)**

- Replaced legacy `duration-medium4 / ease-emphasized-decelerate / ease-emphasized-accelerate` slide tokens with `duration-spring-standard-default-spatial / ease-spring-standard-default-spatial` (spring, no overshoot) per md3-motion.mdc spatial navigation guidelines.
- Standard slide direction: `translate-x-0` (open) / `-translate-x-full` (closed) via CVA `open` variant.

**Motion (Modal — broken → fixed)**

- Modal drawer enter/exit animation was broken: `{isOpen && ...}` immediately unmounted the panel/scrim, preventing any exit animation from playing.
- Replaced with the library-standard animation state machine pattern (mirrors `BottomSheetHeadless` / `DialogHeadless`): `entering → visible → exiting → exited`.
- Modal panel now renders via `createPortal` to `document.body` with a portal gate that only unmounts after `animationState === "exited"`.
- Panel enter: `animate-md-slide-in-left` (spring-standard-default-spatial, 500ms). Exit: `animate-md-slide-out-left`. Applied via `drawerAnimationVariants` CVA + `getAnimationClassName` callback.
- Scrim fade: CSS `transition-opacity` from `opacity-0` → `opacity-32` on enter, reversed on exit. Applied via `drawerScrimAnimationVariants`.
- Both panel and scrim carry `data-animation-state` attribute for visual testing and potential CSS hooks.
- `useReducedMotion()` gate: all animations suppressed when `prefers-reduced-motion: reduce` is active; `transition-none` appended to standard variant.

**Typography**

- `text-label-large` and `text-title-small` Tailwind classes apply only font-size and line-height (known Tailwind v4 theme limitation). Added explicit `font-medium` (weight 500) and `tracking-[0.1px]` to: `DrawerItem` root, `DrawerItemBadge`, `DrawerHeadline`, and section headers — matching the MD3 Label Large / Title Small specification.

**States**

- Focus state now shows both the outline ring (`outline-secondary`, WCAG 2.4.7) and a 10% state layer (`group-data-[focus-visible]/draweritem:opacity-10`), matching MD3 focus spec and the BottomSheet handle reference implementation.
- Added explicit icon disabled color override: `group-data-[disabled]/draweritem:text-on-surface/38` on the icon slot (mirrors Menu icon pattern).

**Exports**

- Added: `drawerAnimationVariants`, `drawerScrimAnimationVariants`, `drawerScrimVariants`, `DrawerAnimationState`, `DrawerAnimationVariants`, `DrawerScrimAnimationVariants`, `DrawerScrimVariants`.
- Removed: dead `drawerDividerVariants` (DrawerSection uses the shared `Divider` component), `scrimVariants` (renamed to `drawerScrimVariants` to avoid collision with DatePicker's export of the same name).
- `HeadlessDrawerProps` extended with `getAnimationClassName` and `getScrimAnimationClassName` optional callbacks.
