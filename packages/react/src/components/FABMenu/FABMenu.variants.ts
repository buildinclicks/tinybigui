import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 FABMenu Variants
 *
 * Architecture: Variants vs States
 * - CVA holds design-time structure only (no disabled/state variants in CVA).
 * - All interaction states are driven by data-* attributes on the root via
 *   group-data-[x]/fab-menu-item Tailwind selectors in each slot's base classes.
 * - Content flags (data-with-icon, data-with-label) are set explicitly by the component.
 * - Self-targeting data-[x]: selectors handle root-level disabled styling.
 *
 * Slot responsibilities:
 *   fabMenuVariants           — root container; direction layout
 *   fabMenuItemVariants       — root <button> pill; shape, color, elevation, group scope
 *   fabMenuItemStateLayerVariants — absolute inset overlay; opacity 0/8/10/10; color=on-color
 *   fabMenuItemFocusRingVariants  — keyboard focus outline (inset-[-3px], MUST NOT be clipped)
 *   fabMenuItemIconVariants   — leading icon wrapper; size-6 (24dp)
 *   fabMenuItemLabelVariants  — inline text label slot
 *
 * MD3 Expressive FAB Menu item spec:
 *   Shape:       full-rounded pill (rounded-full)
 *   Height:      56dp (h-14)
 *   Padding:     16dp leading (pl-4), 20dp trailing (pr-5)
 *   Gap:         12dp between icon and label (gap-3)
 *   Icon:        24dp (size-6)
 *   Typography:  Title Medium
 *   Elevation:   base 3 → hover 4 → focus/pressed 3 → disabled none
 *   State-layer: hover 8% | focus 10% | pressed 10% | disabled hidden
 *
 * IMPORTANT — overflow-hidden is NOT on the root button.
 * The focus ring span has `inset-[-3px]` to extend outside the button boundary.
 * Overflow clipping is delegated to the state layer (overflow-hidden + rounded-[inherit]).
 */

// ─── ROOT CONTAINER (FABMenu) ─────────────────────────────────────────────────

/**
 * Root container for FABMenu — controls expansion direction layout.
 */
export const fabMenuVariants = cva(["relative", "inline-flex", "items-end"], {
  variants: {
    direction: {
      up: ["flex-col-reverse", "gap-3"],
      down: ["flex-col", "gap-3"],
      left: ["flex-row-reverse", "gap-3", "items-center"],
      right: ["flex-row", "gap-3", "items-center"],
    },
  },
  defaultVariants: {
    direction: "up",
  },
});

// ─── MENU ITEM ROOT / CONTAINER ──────────────────────────────────────────────

/**
 * Root <button> pill for a FABMenu action item.
 *
 * IMPORTANT — no overflow-hidden here (focus ring must extend outside).
 * Elevation follows MD3 FAB spec: base 3 → hover 4 → focus/pressed 3 → disabled none.
 * The doubled attribute selector for focus/pressed gives higher specificity than
 * the single hover selector, ensuring they always win.
 *
 * Disabled styling uses self-targeting data-[disabled]: (not group-data —
 * these selectors target the root element itself).
 */
export const fabMenuItemVariants = cva(
  [
    // Layout — full-rounded pill, NO overflow-hidden (focus ring extends outside)
    "relative inline-flex items-center cursor-pointer select-none",
    "rounded-full",
    "h-14 pl-4 pr-5 gap-3", // 56dp height, 16dp leading, 20dp trailing, 12dp gap
    // Effects transition for color/bg/shadow
    "transition-[color,background-color,box-shadow]",
    "duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
    // Disabled — self-targeting data-[x]: selectors
    "data-[disabled]:bg-on-surface/12 data-[disabled]:text-on-surface/38",
    "data-[disabled]:shadow-none data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none",
  ],
  {
    variants: {
      /**
       * Color role — controls container background, text color, and elevation.
       * State-layer color must equal the on-color (see fabMenuItemStateLayerVariants).
       *
       * Elevation per state:
       *   base   → elevation-3
       *   hover  → elevation-4 (group-data-[hovered]/fab-menu-item)
       *   focus  → elevation-3 (doubled selector wins over hover)
       *   pressed→ elevation-3 (doubled selector wins over hover)
       *   disabled → shadow-none (self-targeting data-[disabled])
       */
      color: {
        "primary-container": [
          "bg-primary-container text-on-primary-container",
          "shadow-elevation-3",
          "group-data-[hovered]/fab-menu-item:shadow-elevation-4",
          "group-data-[focus-visible]/fab-menu-item:shadow-elevation-3",
          "group-data-[pressed]/fab-menu-item:group-data-[pressed]/fab-menu-item:shadow-elevation-3",
        ],
        "secondary-container": [
          "bg-secondary-container text-on-secondary-container",
          "shadow-elevation-3",
          "group-data-[hovered]/fab-menu-item:shadow-elevation-4",
          "group-data-[focus-visible]/fab-menu-item:shadow-elevation-3",
          "group-data-[pressed]/fab-menu-item:group-data-[pressed]/fab-menu-item:shadow-elevation-3",
        ],
        "tertiary-container": [
          "bg-tertiary-container text-on-tertiary-container",
          "shadow-elevation-3",
          "group-data-[hovered]/fab-menu-item:shadow-elevation-4",
          "group-data-[focus-visible]/fab-menu-item:shadow-elevation-3",
          "group-data-[pressed]/fab-menu-item:group-data-[pressed]/fab-menu-item:shadow-elevation-3",
        ],
        primary: [
          "bg-primary text-on-primary",
          "shadow-elevation-3",
          "group-data-[hovered]/fab-menu-item:shadow-elevation-4",
          "group-data-[focus-visible]/fab-menu-item:shadow-elevation-3",
          "group-data-[pressed]/fab-menu-item:group-data-[pressed]/fab-menu-item:shadow-elevation-3",
        ],
        secondary: [
          "bg-secondary text-on-secondary",
          "shadow-elevation-3",
          "group-data-[hovered]/fab-menu-item:shadow-elevation-4",
          "group-data-[focus-visible]/fab-menu-item:shadow-elevation-3",
          "group-data-[pressed]/fab-menu-item:group-data-[pressed]/fab-menu-item:shadow-elevation-3",
        ],
        tertiary: [
          "bg-tertiary text-on-tertiary",
          "shadow-elevation-3",
          "group-data-[hovered]/fab-menu-item:shadow-elevation-4",
          "group-data-[focus-visible]/fab-menu-item:shadow-elevation-3",
          "group-data-[pressed]/fab-menu-item:group-data-[pressed]/fab-menu-item:shadow-elevation-3",
        ],
      },
    },
    defaultVariants: {
      color: "primary-container",
    },
  }
);

// ─── STATE LAYER ─────────────────────────────────────────────────────────────

/**
 * State layer — absolute inset overlay that transitions opacity on interaction.
 *
 * Per MD3 spec, the state-layer color must equal the icon/on-color:
 *   primary-container   → bg-on-primary-container
 *   secondary-container → bg-on-secondary-container
 *   tertiary-container  → bg-on-tertiary-container
 *   primary (solid)     → bg-on-primary
 *   secondary (solid)   → bg-on-secondary
 *   tertiary (solid)    → bg-on-tertiary
 *
 * Opacity:
 *   0 at rest · 8% hover · 10% focus · 10% pressed · hidden when disabled
 *
 * Pressed (10%) must win over hover (8%) when both data attributes are set.
 * The doubled attribute selector gives it higher specificity:
 *   group-data-[hovered]/fab-menu-item:          → specificity (0,1,0)
 *   group-data-[pressed]/fab-menu-item:group-..  → specificity (0,2,0) always wins
 *
 * overflow-hidden is placed HERE (not on the root) so the state layer clips to
 * the pill shape while the focus ring span can extend outside.
 */
export const fabMenuItemStateLayerVariants = cva(
  [
    "absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none opacity-0",
    // Effects transition — opacity must not overshoot
    "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
    // Hover: 8%
    "group-data-[hovered]/fab-menu-item:opacity-8",
    // Focus: 10%
    "group-data-[focus-visible]/fab-menu-item:opacity-10",
    // Pressed: 10% — doubled selector wins over hover's 8%
    "group-data-[pressed]/fab-menu-item:group-data-[pressed]/fab-menu-item:opacity-10",
    // No state layer when disabled
    "group-data-[disabled]/fab-menu-item:hidden",
  ],
  {
    variants: {
      color: {
        "primary-container": "bg-on-primary-container",
        "secondary-container": "bg-on-secondary-container",
        "tertiary-container": "bg-on-tertiary-container",
        primary: "bg-on-primary",
        secondary: "bg-on-secondary",
        tertiary: "bg-on-tertiary",
      },
    },
    defaultVariants: { color: "primary-container" },
  }
);

// ─── FOCUS RING ───────────────────────────────────────────────────────────────

/**
 * Focus ring overlay.
 *
 * Rendered as an absolute `<span>` with `inset-[-3px]` so it extends 3px
 * outside the button boundary. This REQUIRES that `overflow-hidden` is NOT
 * on the root button — overflow clipping is moved to the state layer.
 *
 * Always present in the DOM (opacity-0 at rest), transitions to opacity-100
 * on keyboard/programmatic focus — avoids layout shifts.
 */
export const fabMenuItemFocusRingVariants = cva([
  "pointer-events-none absolute inset-[-3px] rounded-full",
  "outline outline-2 outline-offset-0 outline-secondary",
  // Effects transition — opacity change must not overshoot
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "opacity-0",
  "group-data-[focus-visible]/fab-menu-item:opacity-100",
]);

// ─── ICON ─────────────────────────────────────────────────────────────────────

/**
 * Leading icon wrapper.
 *
 * MD3 spec: 24×24dp icons inside FAB menu items.
 * Color is inherited from the parent button's text color.
 */
export const fabMenuItemIconVariants = cva([
  "relative z-10 inline-flex shrink-0 items-center justify-center",
  "size-6", // 24dp per MD3 spec
  // Color transition uses effects token (no spatial overshoot on color)
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
]);

// ─── LABEL ────────────────────────────────────────────────────────────────────

/**
 * Inline text label wrapper.
 *
 * MD3 spec: Title Medium typography for FAB menu item labels.
 * z-10 keeps it above the state layer and ripple overlays.
 */
export const fabMenuItemLabelVariants = cva([
  "relative z-10 inline-flex items-center",
  "text-title-medium",
]);

// ─── EXPORTED TYPES ───────────────────────────────────────────────────────────

export type FABMenuVariants = VariantProps<typeof fabMenuVariants>;
export type FABMenuItemVariants = VariantProps<typeof fabMenuItemVariants>;
export type FABMenuItemStateLayerVariants = VariantProps<typeof fabMenuItemStateLayerVariants>;
export type FABMenuItemFocusRingVariants = VariantProps<typeof fabMenuItemFocusRingVariants>;
export type FABMenuItemIconVariants = VariantProps<typeof fabMenuItemIconVariants>;
export type FABMenuItemLabelVariants = VariantProps<typeof fabMenuItemLabelVariants>;
