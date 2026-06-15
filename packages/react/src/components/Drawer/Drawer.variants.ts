import { cva, type VariantProps } from "class-variance-authority";

// ─── CONTAINER ────────────────────────────────────────────────────────────────

/**
 * Material Design 3 Navigation Drawer container variants (CVA).
 *
 * Architecture: Variants vs States (component-variants.mdc)
 * - CVA holds design-time structure only (variant, open).
 * - No interaction states in CVA — they are driven by data-* on the root.
 *
 * Specification:
 *   Width:    360dp (`w-drawer`)
 *   Height:   100dvh (`h-full`)
 *   Padding:  12dp sides/top/bottom (`px-3 py-3`)
 *   Surface:  `bg-surface-container-low` (both variants per MD3 color token)
 *   Elevation: standard = none; modal = `shadow-elevation-1`
 *   Shape:
 *     standard = square trailing edge (`rounded-none`) — panel is flush with the
 *                screen left edge and has no exposed trailing corner.
 *     modal    = 16dp trailing corner (`rounded-r-lg`, MD3 corner-large) — the
 *                exposed right edge is rounded when the drawer overlays content.
 *
 * Standard slide motion (spatial, on-screen translate):
 *   Spring-standard-default-spatial (500ms, no overshoot) per md3-motion.mdc.
 *   "enter = translate-x-0, exit = -translate-x-full"
 *   Applied with `transition-transform` + spring tokens.
 *   Reduced motion: handled by caller appending `transition-none`.
 *
 * Modal motion (enters/exits the screen):
 *   Uses the animate-md-slide-in-left / animate-md-slide-out-left composite
 *   utilities applied via `drawerAnimationVariants` + the presence state machine
 *   in HeadlessDrawer. Container itself stays fixed; panel is portalled.
 *
 * @see https://m3.material.io/components/navigation-drawer/specs
 */
export const drawerVariants = cva(
  [
    // Layout
    "fixed top-0 left-0 h-full",
    "flex flex-col overflow-y-auto",
    // Width — 360dp per MD3 spec
    "w-drawer",
    // Stacking
    "z-50",
    // Container padding — 12dp per MD3 nav drawer spec
    "px-3 py-3",
    // Focus outline removal (focus management handled by FocusScope / React Aria)
    "outline-none",
  ],
  {
    variants: {
      /**
       * Structural variant — drives shape and elevation.
       *
       * - `standard`: flush left panel, square trailing edge, flat surface.
       * - `modal`:    overlay dialog, 16dp trailing corner, shadow-elevation-1.
       */
      variant: {
        standard: ["bg-surface-container-low", "rounded-none"],
        modal: ["bg-surface-container-low", "rounded-r-lg", "shadow-elevation-1"],
      },

      /**
       * Open/closed state — drives translation for the STANDARD variant only.
       *
       * Standard slide: spatial on-screen property → spring-standard-default-spatial.
       * Modal enter/exit is handled externally via drawerAnimationVariants + portal gate.
       *
       * - `true`:  translate-x-0 (visible)
       * - `false`: -translate-x-full (off-screen to the left)
       */
      open: {
        true: [
          "translate-x-0",
          "transition-transform",
          "duration-spring-standard-default-spatial",
          "ease-spring-standard-default-spatial",
        ],
        false: [
          "-translate-x-full",
          "transition-transform",
          "duration-spring-standard-default-spatial",
          "ease-spring-standard-default-spatial",
        ],
      },
    },

    defaultVariants: {
      variant: "standard",
      open: false,
    },
  }
);

// ─── DRAWER ANIMATION (MODAL enter/exit) ─────────────────────────────────────

/**
 * Animation state CVA for the MODAL drawer panel.
 *
 * Mirrors the `bottomSheetAnimationVariants` pattern exactly.
 * Applied by `Drawer.tsx` via a `getAnimationClassName` callback that is
 * gated on `useReducedMotion()`.
 *
 * Motion tokens (drawer is a large screen-level element, left-edge):
 *   Enter: `animate-md-slide-in-left`  — standard-default-spatial (500ms)
 *   Exit:  `animate-md-slide-out-left` — emphasized-accelerate   (200ms)
 *
 * State machine: entering → visible → exiting → exited
 *   entering: mount frame, panel is transparent/off-screen (no animation yet)
 *   visible:  entry animation fires
 *   exiting:  exit animation fires; `onTransitionEnd` + fallback timer → exited
 *   exited:   portal gate removes the element
 *
 * @see packages/react/src/components/BottomSheet/BottomSheet.variants.ts
 * @see https://m3.material.io/components/navigation-drawer/specs — Motion
 */
export const drawerAnimationVariants = cva("", {
  variants: {
    animationState: {
      // Mount frame: invisible until animation starts
      entering: ["opacity-0"],
      // Entry animation: slide in from the left edge
      visible: ["animate-md-slide-in-left"],
      // Exit animation: slide out to the left
      exiting: ["animate-md-slide-out-left"],
      // Portal gate removes element; classes below act as a safety net
      exited: ["opacity-0", "pointer-events-none"],
    },
  },
  defaultVariants: {
    animationState: "entering",
  },
});

/**
 * Scrim animation CVA — controls the modal backdrop fade via CSS transition.
 *
 * Uses `transition-opacity` (an effects property — no overshoot) rather than
 * `animate-md-fade-*` keyframes so that the opacity change is a plain
 * CSS transition from one state to another, avoiding a `tailwind-merge`
 * conflict between the base `opacity-32` and the keyframe `opacity-1`.
 *
 * Opacity sequence per state:
 *   entering: opacity-0   (invisible mount frame — transition will start here)
 *   visible:  opacity-32  (MD3 scrim opacity; CSS transition from 0→32 fires)
 *   exiting:  opacity-0   (CSS transition from 32→0 fires)
 *   exited:   opacity-0 + pointer-events-none (portal gate removes element)
 *
 * NOTE: the base `drawerScrimVariants` must NOT include `opacity-32` so that
 * tailwind-merge does not collapse it with these per-state opacity classes.
 *
 * @see https://m3.material.io/components/navigation-drawer/specs — Scrim callout 9
 */
export const drawerScrimAnimationVariants = cva(
  [
    "transition-opacity",
    "duration-spring-standard-fast-effects",
    "ease-spring-standard-fast-effects",
  ],
  {
    variants: {
      animationState: {
        entering: ["opacity-0"],
        visible: ["opacity-32"],
        exiting: ["opacity-0"],
        exited: ["opacity-0", "pointer-events-none"],
      },
    },
    defaultVariants: {
      animationState: "entering",
    },
  }
);

// ─── DRAWER ITEM ROOT ─────────────────────────────────────────────────────────

/**
 * Material Design 3 Navigation Drawer item root variants (CVA).
 *
 * Architecture: root is the `group/draweritem` host. It owns layout, shape,
 * and cursor. Colors (content color) live here via self-targeting `data-[x]:`
 * selectors since the root IS the group host.
 *
 * Slot z-order:
 *   activeIndicator  z-0    — secondary-container pill background
 *   stateLayer       z-[1]  — hover/press opacity overlay
 *   focusRing        z-[2]  — keyboard focus outline
 *   ripple           z-[3]  — press ripple feedback
 *   content          z-10   — icon, label, badge
 *
 * Specification:
 *   Height:     56dp (`h-14`)
 *   Shape:      `rounded-full` (pill)
 *   Padding:    16dp leading (`pl-4`), 24dp trailing (`pr-6`)
 *   Gap:        12dp icon-to-label (`gap-3`)
 *   Typography: Label Large — 14sp / 500 / 0.1px tracking
 *
 * @see https://m3.material.io/components/navigation-drawer/specs
 */
export const drawerItemVariants = cva([
  // Layout
  "relative flex w-full items-center",
  "h-14 pl-4 pr-6 gap-3",
  // Shape
  "rounded-full",
  // Typography — Label Large per MD3 spec (size via text-label-large, weight + tracking explicit)
  "text-label-large",
  "font-medium",
  "tracking-[0.1px]",
  // Interaction
  "cursor-pointer select-none outline-none",
  // Color transition (effects — no overshoot)
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Inactive content color (icon/label/badge inherit this via currentColor)
  "text-on-surface-variant",
  // Active content color — self-targeting data-[active]: (root is the group host)
  "data-[active]:text-on-secondary-container",
  // Disabled — self-targeting
  "data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed",
  "data-[disabled]:text-on-surface/38",
]);

// ─── ACTIVE INDICATOR ─────────────────────────────────────────────────────────

/**
 * Active indicator — secondary-container pill background.
 *
 * Fills the item shape (`inset-0 rounded-[inherit]`) and uses opacity
 * to toggle visibility when the item becomes active. Separating this from
 * the root background lets the state layer sit above it at z-[1].
 *
 * Color: `bg-secondary-container` per MD3 color token (callout 5).
 *
 * @see https://m3.material.io/components/navigation-drawer/specs
 */
export const drawerItemActiveIndicatorVariants = cva([
  "absolute inset-0 rounded-[inherit] pointer-events-none",
  "bg-secondary-container",
  // Effects transition for opacity — no overshoot
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Hidden when inactive; shown when active
  "opacity-0",
  "group-data-[active]/draweritem:opacity-100",
  // z-0: below state layer (z-[1]) and content (z-10)
  "z-0",
]);

// ─── STATE LAYER ──────────────────────────────────────────────────────────────

/**
 * State layer — absolute inset overlay that transitions opacity on
 * hover / focus-visible / press interaction states.
 *
 * Color mapping per MD3 spec:
 *   Inactive: `bg-on-surface-variant` (callout 2/8)
 *   Active:   `bg-on-secondary-container` (callout 3/6)
 *
 * State-layer opacities per MD3 spec:
 *   Hover:         8%  (opacity-8)
 *   Focused:       10% (opacity-10)
 *   Pressed:       10% (opacity-10 — doubled selector wins over hover)
 *   Hidden when disabled.
 *
 * Focus-visible also activates the dedicated focus-ring slot
 * (drawerItemFocusRingVariants) per WCAG 2.4.7. Both layer + ring are shown
 * simultaneously, matching the BottomSheet handle and MD3 reference grid.
 *
 * @see https://m3.material.io/components/navigation-drawer/specs#states
 */
export const drawerItemStateLayerVariants = cva([
  "absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none opacity-0",
  // Effects transition — opacity must NOT overshoot
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Color: inactive uses on-surface-variant; active switches to on-secondary-container
  "bg-on-surface-variant",
  "group-data-[active]/draweritem:bg-on-secondary-container",
  // Hover: 8%
  "group-data-[hovered]/draweritem:opacity-8",
  // Focus-visible: 10% (MD3 focus state layer)
  "group-data-[focus-visible]/draweritem:opacity-10",
  // Pressed: 10%, doubled selector wins over hover at same cascade position
  "group-data-[pressed]/draweritem:group-data-[pressed]/draweritem:opacity-10",
  // No state layer when disabled
  "group-data-[disabled]/draweritem:hidden",
  // z-[1]: above active indicator (z-0), below focus ring and content
  "z-[1]",
]);

// ─── FOCUS RING ───────────────────────────────────────────────────────────────

/**
 * Focus ring slot — keyboard-focus indicator rendered as an absolute overlay.
 *
 * Uses `-outline-offset-2` (inset 2dp) so the outline stays within the pill
 * shape and does not spill into adjacent items.
 *
 * Shown alongside the 10% state layer for full MD3 focus state compliance.
 * Color: `outline-secondary` per MD3 focus indicator token.
 * Opacity: 0 at rest → 100% on focus-visible.
 *
 * @see https://m3.material.io/components/navigation-drawer/specs#states
 */
export const drawerItemFocusRingVariants = cva([
  "pointer-events-none absolute inset-0 rounded-[inherit]",
  "outline outline-2 -outline-offset-2 outline-secondary",
  // Effects transition — opacity must not overshoot
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "opacity-0",
  "group-data-[focus-visible]/draweritem:opacity-100",
  // z-[2]: above state layer (z-[1]), below content (z-10)
  "z-[2]",
]);

// ─── ICON ─────────────────────────────────────────────────────────────────────

/**
 * Leading icon slot.
 *
 * MD3 spec: 24dp × 24dp icon.
 * Color inherits from the root `text-*` via `currentColor`.
 * Inactive: `text-on-surface-variant` (via root).
 * Active:   `text-on-secondary-container` (via root data-[active]).
 * Disabled: explicit `text-on-surface/38` override (matches Menu icon pattern).
 *
 * @see https://m3.material.io/components/navigation-drawer/specs#anatomy
 */
export const drawerItemIconVariants = cva([
  "relative z-10 flex shrink-0 items-center justify-center",
  "h-6 w-6",
  // Color and transition inherited via currentColor from root
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Explicit disabled override — mirrors Menu icon (on-surface/38)
  "group-data-[disabled]/draweritem:text-on-surface/38",
]);

// ─── LABEL ────────────────────────────────────────────────────────────────────

/**
 * Label text slot.
 *
 * Typography (Label Large — size, weight, tracking) is set on the root via
 * `drawerItemVariants` and inherited here via cascade.
 * `z-10` keeps it above the state layer and active indicator overlays.
 */
export const drawerItemLabelVariants = cva(["relative z-10 flex-1 min-w-0 truncate"]);

// ─── BADGE ────────────────────────────────────────────────────────────────────

/**
 * Trailing badge label text slot.
 *
 * MD3 anatomy element 5 — "Badge label text".
 * Rendered as plain inline text, colored by the item's active/inactive state
 * via the root's inherited text color.
 *
 * Typography: Label Large — size via `text-label-large`, weight and tracking
 * set explicitly so they are not lost when the element is not a block-level
 * inheritor in all browsers.
 *
 * @see https://m3.material.io/components/navigation-drawer/specs#anatomy
 */
export const drawerItemBadgeVariants = cva([
  "relative z-10 shrink-0 ml-auto",
  "text-label-large",
  "font-medium",
  "tracking-[0.1px]",
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
]);

// ─── HEADLINE ─────────────────────────────────────────────────────────────────

/**
 * Material Design 3 Navigation Drawer Headline variants (CVA).
 *
 * MD3 anatomy element 2 — the header text at the top of the drawer.
 * Typography: Title Small — 14sp / 500 / 0.1px tracking.
 * Color: `text-on-surface-variant`.
 * Padding: 16dp top (pt-4), 16dp horizontal (px-4), 4dp bottom (pb-1).
 *
 * @see https://m3.material.io/components/navigation-drawer/specs#anatomy
 */
export const drawerHeadlineVariants = cva([
  "px-4 pt-4 pb-1",
  "text-title-small",
  "font-medium",
  "tracking-[0.1px]",
  "text-on-surface-variant",
  "select-none",
]);

// ─── SCRIM ────────────────────────────────────────────────────────────────────

/**
 * Modal scrim overlay base styles (CVA).
 *
 * Covers the full viewport behind the modal drawer.
 * Clicking the scrim closes the drawer.
 *
 * Color: `bg-scrim` at `opacity-32` per MD3 spec callout 9.
 *
 * Enter/exit fade is applied via `drawerScrimAnimationVariants` by the
 * animation-state machine in HeadlessDrawer.
 *
 * @see https://m3.material.io/components/navigation-drawer/specs
 */
export const drawerScrimVariants = cva([
  "fixed inset-0 z-40",
  // NOTE: opacity is intentionally absent here — it is controlled per
  // animation state by drawerScrimAnimationVariants (opacity-0 / opacity-32)
  // to avoid tailwind-merge collapsing the classes during cn() composition.
  "bg-scrim",
]);

// ─── SECTION ──────────────────────────────────────────────────────────────────

/**
 * Drawer section container variants (CVA).
 *
 * Groups related items with an optional header label and divider.
 */
export const drawerSectionVariants = cva(["flex flex-col w-full"]);

/**
 * Drawer section header variants (CVA).
 *
 * Typography: Title Small — 14sp / 500 / 0.1px tracking per MD3 spec.
 * Color: `text-on-surface-variant`.
 * Padding: 16dp horizontal (aligned with item icon), 16dp top, 8dp bottom.
 *
 * @see https://m3.material.io/components/navigation-drawer/specs
 */
export const drawerSectionHeaderVariants = cva([
  "px-4 pt-4 pb-2",
  "text-title-small",
  "font-medium",
  "tracking-[0.1px]",
  "text-on-surface-variant",
  "select-none",
]);

// ─── TYPE EXPORTS ─────────────────────────────────────────────────────────────

export type DrawerVariants = VariantProps<typeof drawerVariants>;
export type DrawerAnimationVariants = VariantProps<typeof drawerAnimationVariants>;
export type DrawerScrimAnimationVariants = VariantProps<typeof drawerScrimAnimationVariants>;
export type DrawerItemVariants = VariantProps<typeof drawerItemVariants>;
export type DrawerItemActiveIndicatorVariants = VariantProps<
  typeof drawerItemActiveIndicatorVariants
>;
export type DrawerItemStateLayerVariants = VariantProps<typeof drawerItemStateLayerVariants>;
export type DrawerItemFocusRingVariants = VariantProps<typeof drawerItemFocusRingVariants>;
export type DrawerItemIconVariants = VariantProps<typeof drawerItemIconVariants>;
export type DrawerItemLabelVariants = VariantProps<typeof drawerItemLabelVariants>;
export type DrawerItemBadgeVariants = VariantProps<typeof drawerItemBadgeVariants>;
export type DrawerHeadlineVariants = VariantProps<typeof drawerHeadlineVariants>;
export type DrawerScrimVariants = VariantProps<typeof drawerScrimVariants>;
export type DrawerSectionVariants = VariantProps<typeof drawerSectionVariants>;
