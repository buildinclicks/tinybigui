import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 FAB Variants — Slot-based architecture
 *
 * Architecture: Variants vs States
 * - CVA holds design-time structure only (no disabled/loading state variants).
 * - All interaction states are driven by data-* attributes on the root via
 *   group-data-[x]/fab Tailwind selectors in each slot's base classes.
 * - Content flags (data-with-icon, data-loading) are set explicitly by the component.
 * - Self-targeting data-[x]: selectors handle root-level disabled styling.
 *
 * Slot responsibilities:
 *   fabVariants           — root <button>; shape per size, color per variant,
 *                           elevation (base 3 → hover 4 → focus/pressed 3),
 *                           self data-[disabled] styling, group/fab scope.
 *   fabStateLayerVariants — absolute inset overlay, opacity 0/8%/10%/10%,
 *                           color = icon/on-color per MD3 spec.
 *   fabFocusRingVariants  — keyboard focus outline ring (inset-[-3px]).
 *                           MUST NOT sit inside overflow-hidden.
 *   fabIconVariants       — icon wrapper; size per FAB size variant.
 *   fabLabelVariants      — extended FAB text label slot.
 *
 * MD3 Expressive size scale:
 *   fab      → 56dp  container, 16dp corner, 24dp icon  (default)
 *   medium   → 80dp  container, 20dp corner, 28dp icon  (M3 Expressive)
 *   large    → 96dp  container, 28dp corner, 36dp icon
 *   extended → 56dp  height,    16dp corner, 24dp icon  (+ text label)
 *   small    → 40dp  container, 12dp corner, 24dp icon  (@deprecated)
 *
 * MD3 Expressive color roles:
 *   primary-container   → bg-primary-container   / text-on-primary-container   (default)
 *   secondary-container → bg-secondary-container / text-on-secondary-container
 *   tertiary-container  → bg-tertiary-container  / text-on-tertiary-container
 *   primary             → bg-primary             / text-on-primary             (solid, M3 Expressive)
 *   secondary           → bg-secondary           / text-on-secondary           (solid, M3 Expressive)
 *   tertiary            → bg-tertiary            / text-on-tertiary            (solid, M3 Expressive)
 *   surface             → bg-surface-container-high / text-primary             (@deprecated)
 *
 * Elevation per state (MD3 spec):
 *   base    → elevation-3
 *   hovered → elevation-4  (shadow-elevation-4)
 *   focused → elevation-3  (doubled selector wins over hover)
 *   pressed → elevation-3  (doubled selector wins over hover)
 *   disabled → no shadow
 *
 * State-layer opacities (MD3):
 *   hover  → 8%   (opacity-8)
 *   focus  → 10%  (opacity-10)
 *   pressed→ 10%  (opacity-10, doubled selector wins over hover's 8%)
 *
 * Important — overflow-hidden is NOT on the root button.
 * The focus ring span has `inset-[-3px]` to extend outside the button boundary,
 * which requires the root to not clip overflow. Overflow clipping is delegated
 * to the state layer and ripple container (overflow-hidden + rounded-[inherit]).
 */

// ─── FAB ROOT / CONTAINER ─────────────────────────────────────────────────────

export const fabVariants = cva(
  [
    // Layout — NO overflow-hidden here (focus ring must extend outside)
    "relative inline-flex items-center justify-center cursor-pointer select-none",
    "shrink-0",
    // Effects transition: color / bg / shadow — standard spring, no overshoot
    "transition-[color,background-color,box-shadow]",
    "duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
    // Disabled — self-targeting data-[x]: selectors (not group-data — these target the root itself)
    "data-[disabled]:bg-on-surface/12 data-[disabled]:text-on-surface/38",
    "data-[disabled]:shadow-none data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none",
  ],
  {
    variants: {
      /**
       * FAB size — controls container dimensions, corner radius, and icon slot size.
       */
      size: {
        /**
         * fab (default) — 56×56dp, 16dp corner radius.
         * MD3 standard FAB.
         */
        fab: [
          "h-14 w-14", // 56dp
          "rounded-2xl", // 16dp corner
        ],

        /**
         * medium — 80×80dp, 20dp corner radius.
         * M3 Expressive Medium FAB. Previously this value mapped to 56dp;
         * it is now remapped to the Expressive 80dp Medium FAB.
         */
        medium: [
          "h-20 w-20", // 80dp
          "rounded-[20px]", // 20dp corner (large-increased shape token)
        ],

        /**
         * large — 96×96dp, 28dp corner radius.
         */
        large: [
          "h-24 w-24", // 96dp
          "rounded-[28px]", // 28dp corner
        ],

        /**
         * extended — 56dp height, variable width, 16dp corner.
         * Icon + text label side by side.
         * Padding: 16dp leading (icon side), 20dp trailing (text side).
         * Gap: 12dp between icon and label (MD3 spec).
         */
        extended: [
          "h-14", // 56dp height
          "rounded-2xl", // 16dp corner
          "pl-4 pr-5", // 16dp leading, 20dp trailing
          "gap-3", // 12dp gap between icon and label
        ],

        /**
         * @deprecated Use `fab` (56dp) instead.
         * small — 40×40dp, 12dp corner radius. No longer recommended in M3 Expressive.
         * Kept functional for backward compatibility.
         */
        small: [
          "h-10 w-10", // 40dp
          "rounded-xl", // 12dp corner
          "m-1", // 4dp margin for 48×48dp minimum touch target
        ],
      },

      /**
       * FAB color — controls container + on-color.
       * State-layer color in fabStateLayerVariants must match icon/on-color.
       */
      color: {
        "primary-container": [
          "bg-primary-container text-on-primary-container",
          // Elevation base=3, hover=4 (state driven), disabled handled by root data-[disabled]
          "shadow-elevation-3",
          "group-data-[hovered]/fab:shadow-elevation-4",
          // Focus / pressed: return to elevation-3
          // Doubled attribute selector gives higher specificity than single hover selector
          "group-data-[focus-visible]/fab:shadow-elevation-3",
          "group-data-[pressed]/fab:group-data-[pressed]/fab:shadow-elevation-3",
        ],
        "secondary-container": [
          "bg-secondary-container text-on-secondary-container",
          "shadow-elevation-3",
          "group-data-[hovered]/fab:shadow-elevation-4",
          "group-data-[focus-visible]/fab:shadow-elevation-3",
          "group-data-[pressed]/fab:group-data-[pressed]/fab:shadow-elevation-3",
        ],
        "tertiary-container": [
          "bg-tertiary-container text-on-tertiary-container",
          "shadow-elevation-3",
          "group-data-[hovered]/fab:shadow-elevation-4",
          "group-data-[focus-visible]/fab:shadow-elevation-3",
          "group-data-[pressed]/fab:group-data-[pressed]/fab:shadow-elevation-3",
        ],
        primary: [
          "bg-primary text-on-primary",
          "shadow-elevation-3",
          "group-data-[hovered]/fab:shadow-elevation-4",
          "group-data-[focus-visible]/fab:shadow-elevation-3",
          "group-data-[pressed]/fab:group-data-[pressed]/fab:shadow-elevation-3",
        ],
        secondary: [
          "bg-secondary text-on-secondary",
          "shadow-elevation-3",
          "group-data-[hovered]/fab:shadow-elevation-4",
          "group-data-[focus-visible]/fab:shadow-elevation-3",
          "group-data-[pressed]/fab:group-data-[pressed]/fab:shadow-elevation-3",
        ],
        tertiary: [
          "bg-tertiary text-on-tertiary",
          "shadow-elevation-3",
          "group-data-[hovered]/fab:shadow-elevation-4",
          "group-data-[focus-visible]/fab:shadow-elevation-3",
          "group-data-[pressed]/fab:group-data-[pressed]/fab:shadow-elevation-3",
        ],
        /** @deprecated Use `primary-container` instead. */
        surface: [
          "bg-surface-container-high text-primary",
          "shadow-elevation-3",
          "group-data-[hovered]/fab:shadow-elevation-4",
          "group-data-[focus-visible]/fab:shadow-elevation-3",
          "group-data-[pressed]/fab:group-data-[pressed]/fab:shadow-elevation-3",
        ],
      },
    },

    defaultVariants: {
      size: "fab",
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
 *   surface (deprecated)→ bg-primary
 *
 * Opacity:
 *   0 at rest · 8% hover · 10% focus · 10% pressed · hidden when disabled
 *
 * overflow-hidden is placed HERE (not on root) so the state layer clips to
 * the FAB shape while the focus ring span can extend outside.
 */
export const fabStateLayerVariants = cva(
  [
    "absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none opacity-0",
    // Effects transition — opacity must not overshoot
    "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
    // Hover: 8%
    "group-data-[hovered]/fab:opacity-8",
    // Focus: 10%
    "group-data-[focus-visible]/fab:opacity-10",
    // Pressed: 10% — doubled selector wins over hover's 8%
    "group-data-[pressed]/fab:group-data-[pressed]/fab:opacity-10",
    // No state layer when disabled
    "group-data-[disabled]/fab:hidden",
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
        /** @deprecated */
        surface: "bg-primary",
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
 * on the root `<button>` element — overflow clipping is moved to the ripple
 * container and state layer instead.
 *
 * Always present in the DOM (opacity-0 at rest), transitions to opacity-100
 * on keyboard/programmatic focus — avoids layout shifts.
 */
export const fabFocusRingVariants = cva([
  "pointer-events-none absolute inset-[-3px] rounded-[inherit]",
  "outline outline-2 outline-offset-0 outline-secondary",
  // Effects transition — opacity change must not overshoot
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "opacity-0",
  "group-data-[focus-visible]/fab:opacity-100",
]);

// ─── ICON ─────────────────────────────────────────────────────────────────────

/**
 * Icon wrapper slot.
 *
 * MD3 icon sizes per FAB size:
 *   fab / extended / small  → 24×24px (size-6)
 *   medium                  → 28×28px (size-7)
 *   large                   → 36×36px (size-9)
 *
 * `invisible` (not `hidden`) when loading — keeps the layout stable so the
 * spinner can occupy the same space without reflowing.
 * Color is inherited from the parent button's text color.
 */
export const fabIconVariants = cva(
  [
    "relative z-10 inline-flex shrink-0 items-center justify-center",
    // Color transition uses effects token (no spatial overshoot on color)
    "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  ],
  {
    variants: {
      size: {
        fab: "size-6", // 24dp
        medium: "size-7", // 28dp
        large: "size-9", // 36dp
        extended: "size-6", // 24dp
        small: "size-6", // 24dp
      },
      hidden: {
        true: "invisible",
        false: "",
      },
    },
    defaultVariants: {
      size: "fab",
      hidden: false,
    },
  }
);

// ─── LABEL (Extended FAB only) ────────────────────────────────────────────────

/**
 * Text label wrapper for extended FAB.
 * Typography: Label Large (MD3 spec for FAB labels).
 * z-10 keeps it above the state layer and ripple overlays.
 */
export const fabLabelVariants = cva([
  "relative z-10 inline-flex items-center",
  "text-label-large tracking-[0.1px]",
]);

// ─── EXPORTED TYPES ───────────────────────────────────────────────────────────

export type FABVariants = VariantProps<typeof fabVariants>;
export type FABStateLayerVariants = VariantProps<typeof fabStateLayerVariants>;
export type FABFocusRingVariants = VariantProps<typeof fabFocusRingVariants>;
export type FABIconVariants = VariantProps<typeof fabIconVariants>;
export type FABLabelVariants = VariantProps<typeof fabLabelVariants>;
