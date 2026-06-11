import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Navigation Drawer container variants (CVA).
 *
 * Architecture: Variants vs States (component-variants.mdc)
 * - CVA holds design-time structure only (variant, open).
 * - No interaction states in CVA — they are driven by data-* on the root.
 *
 * Specification:
 *   Width:  360dp (`w-drawer`)
 *   Shape:  `rounded-r-lg` (16dp per MD3 corner-large for nav drawer)
 *   Color:  `bg-surface-container-low` (both standard and modal)
 *   Modal:  adds `shadow-elevation-1` for elevation separation
 *
 * Slide-in animation uses legacy navigation-level tokens (not spring) per md3-motion.mdc:
 *   Enter: `duration-medium4` (400ms) + `ease-emphasized-decelerate`
 *   Exit:  `duration-short4` (200ms) + `ease-emphasized-accelerate`
 *
 * @see https://m3.material.io/components/navigation-drawer/specs
 */
export const drawerVariants = cva(
  [
    // Layout
    "fixed top-0 left-0 h-full",
    "flex flex-col overflow-y-auto",
    // Stacking and shape
    "z-50",
    "rounded-r-lg",
    // Slide animation — navigation-level legacy tokens per md3-motion.mdc
    "transition-transform",
    // Focus outline removal (focus management handled by FocusScope / React Aria)
    "outline-none",
    // Container padding — 12dp on sides per MD3 nav drawer spec
    "px-3 py-3",
  ],
  {
    variants: {
      /**
       * Structural variant — drives elevation shadow.
       *
       * - `standard`: inline nav panel; `bg-surface-container-low`, flat (no shadow)
       * - `modal`:    overlay dialog;  `bg-surface-container-low` + `shadow-elevation-1`
       *
       * Both use `surface-container-low` per MD3 color callout 1.
       */
      variant: {
        standard: ["bg-surface-container-low"],
        modal: ["bg-surface-container-low", "shadow-elevation-1"],
      },

      /**
       * Open/closed state — drives translation.
       *
       * - `true`:  drawer visible (`translate-x-0`), enter uses emphasized-decelerate
       * - `false`: drawer off-screen (`-translate-x-full`), exit uses emphasized-accelerate
       */
      open: {
        true: ["translate-x-0", "duration-medium4", "ease-emphasized-decelerate"],
        false: ["-translate-x-full", "duration-short4", "ease-emphasized-accelerate"],
      },
    },

    defaultVariants: {
      variant: "standard",
      open: false,
    },
  }
);

// ─── DRAWER ITEM ROOT ─────────────────────────────────────────────────────────

/**
 * Material Design 3 Navigation Drawer item root variants (CVA).
 *
 * Architecture: root is the `group/draweritem` host. It owns layout, shape,
 * and cursor. Colors (content color) live here via `group-data-[active]`
 * selectors since the root IS the group host and self-targeting `data-[x]:`
 * is valid for the root element.
 *
 * Slot z-order:
 *   activeIndicator  z-0    — secondary-container pill background
 *   stateLayer       z-[1]  — hover/press opacity overlay
 *   focusRing        z-[2]  — keyboard focus outline
 *   ripple           z-[3]  — press ripple feedback
 *   content          z-10   — icon, label, badge
 *
 * Specification:
 *   Height:   56dp (`h-14`)
 *   Shape:    `rounded-full` (pill)
 *   Padding:  16dp leading (`pl-4`), 24dp trailing (`pr-6`)
 *   Gap:      12dp icon-to-label (`gap-3`)
 *   Typography: `text-label-large`
 *
 * @see https://m3.material.io/components/navigation-drawer/specs
 */
export const drawerItemVariants = cva([
  // Layout
  "relative flex w-full items-center",
  "h-14 pl-4 pr-6 gap-3",
  // Shape
  "rounded-full",
  // Typography
  "text-label-large",
  // Interaction
  "cursor-pointer select-none outline-none",
  // Color transition (effects — no overshoot)
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Inactive content color (icon/label/badge inherit this)
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
 * Color: `bg-secondary-container` per MD3 color callout 5.
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
 * hover / press interaction states.
 *
 * Color mapping per MD3 spec:
 *   Inactive: `bg-on-surface-variant` (callout 2/8)
 *   Active:   `bg-on-secondary-container` (callout 3/6)
 *
 * State-layer opacities per MD3 spec:
 *   Hover:   8%   (opacity-8)
 *   Pressed: 10%  (opacity-10 — doubled selector wins over hover)
 *   Hidden when disabled.
 *
 * Focus-visible is NOT a state-layer opacity — it uses the dedicated
 * focus-ring slot (drawerItemFocusRingVariants) per MD3 spec.
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
 * MD3 spec: 24dp × 24dp icon, color inherits from root text color.
 * Inactive: `text-on-surface-variant` (via root).
 * Active:   `text-on-secondary-container` (via root data-[active]).
 * Disabled: `group-data-[disabled]/draweritem:text-on-surface/38` as override.
 *
 * @see https://m3.material.io/components/navigation-drawer/specs#anatomy
 */
export const drawerItemIconVariants = cva([
  "relative z-10 flex shrink-0 items-center justify-center",
  "h-6 w-6",
  // Color and transition inherited via currentColor from root
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
]);

// ─── LABEL ────────────────────────────────────────────────────────────────────

/**
 * Label text slot.
 *
 * Typography and color are inherited from the root `drawerItemVariants` classes.
 * `z-10` keeps it above the state layer and active indicator overlays.
 */
export const drawerItemLabelVariants = cva(["relative z-10 flex-1 min-w-0 truncate"]);

// ─── BADGE ────────────────────────────────────────────────────────────────────

/**
 * Trailing badge label text slot.
 *
 * MD3 anatomy element 5 — "Badge label text".
 * Rendered as inline text, colored by the item's active/inactive state
 * via the root's inherited `text-on-surface-variant` / `text-on-secondary-container`.
 *
 * @see https://m3.material.io/components/navigation-drawer/specs#anatomy
 */
export const drawerItemBadgeVariants = cva([
  "relative z-10 shrink-0 ml-auto",
  "text-label-large",
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
]);

// ─── HEADLINE ─────────────────────────────────────────────────────────────────

/**
 * Material Design 3 Navigation Drawer Headline variants (CVA).
 *
 * MD3 anatomy element 2 — the header text at the top of the drawer.
 * Typically used for the app name or section label.
 *
 * Typography: `text-title-small`
 * Color: `text-on-surface-variant`
 * Padding: 16dp top, 16dp horizontal, 4dp bottom to create space above items.
 *
 * @see https://m3.material.io/components/navigation-drawer/specs#anatomy
 */
export const drawerHeadlineVariants = cva([
  "px-4 pt-4 pb-1",
  "text-title-small text-on-surface-variant",
  "select-none",
]);

// ─── SCRIM ────────────────────────────────────────────────────────────────────

/**
 * Modal scrim overlay variants (CVA).
 *
 * Covers the full viewport behind the modal drawer.
 * Clicking the scrim closes the drawer.
 *
 * Color: `bg-scrim` at `opacity-32` per MD3 spec callout 9.
 *
 * @see https://m3.material.io/components/navigation-drawer/specs
 */
export const scrimVariants = cva([
  "fixed inset-0 z-40",
  "bg-scrim opacity-32",
  "transition-opacity duration-short4 ease-standard",
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
 * Typography:  `text-title-small text-on-surface-variant` per MD3 spec.
 * Padding:     16dp horizontal (aligned with item icon), 16dp top, 8dp bottom.
 *
 * @see https://m3.material.io/components/navigation-drawer/specs
 */
export const drawerSectionHeaderVariants = cva([
  "px-4 pt-4 pb-2",
  "text-title-small text-on-surface-variant",
  "select-none",
]);

/**
 * Drawer section divider variants (CVA).
 *
 * Horizontal rule using `border-outline-variant`.
 * 16dp horizontal inset (mx-4), 4dp vertical margin.
 */
export const drawerDividerVariants = cva(["border-t border-outline-variant", "mx-4 my-1"]);

// ─── TYPE EXPORTS ─────────────────────────────────────────────────────────────

export type DrawerVariants = VariantProps<typeof drawerVariants>;
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
export type ScrimVariants = VariantProps<typeof scrimVariants>;
export type DrawerSectionVariants = VariantProps<typeof drawerSectionVariants>;
