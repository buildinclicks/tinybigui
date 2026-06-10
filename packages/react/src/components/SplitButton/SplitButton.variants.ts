import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Expressive Split Button Variants
 *
 * Architecture: Variants vs States
 * - CVA holds design-time structure only (no disabled/pressed/hovered state variants).
 * - All interaction states are driven by data-* attributes on each segment's root via
 *   group-data-[x]/sb-leading and group-data-[x]/sb-trailing Tailwind selectors.
 * - Inner-corner radius morphing is driven by a CSS variable (--sb-inner-radius) on
 *   the segment root to avoid specificity battles — the same technique as Switch's
 *   --switch-handle-size.
 *
 * Slot responsibilities:
 *   splitButtonContainerVariants  — outer wrapper; gap between the two segments
 *   splitButtonLeadingVariants    — leading (primary) button segment; shape + color
 *   splitButtonTrailingVariants   — trailing (dropdown trigger) button segment; shape + color
 *   splitButtonStateLayerVariants — per-segment hover/focus/press opacity overlay
 *   splitButtonFocusRingVariants  — per-segment keyboard focus outline (extends outside overflow-hidden)
 *   splitButtonLabelVariants      — leading label text slot
 *   splitButtonIconVariants       — leading/trailing icon wrapper
 *   splitButtonMenuVariants       — dropdown menu surface
 *   splitButtonMenuItemVariants   — individual menu item row
 *
 * MD3 Expressive Specs:
 *   Shape: outer corners rounded-full; inner corners morph on interaction
 *   Height: 32dp xs | 40dp sm | 56dp md | 96dp lg | 136dp xl
 *   Gap between segments: 2dp (gap-0.5)
 *   Icon size: 20px xs/sm | 24px md | 32px lg | 40px xl
 *   State-layer opacities: hover 8% | focus 10% | pressed 10%
 *   Disabled: container on-surface/12 | content on-surface/38
 *   Elevation: elevated base=1 hover=2; filled/tonal base=0 hover=1; outlined none
 *
 * Inner-corner radius per size (MD3 spec — 2dp space rule):
 *   xs/sm/md → --radius-xs  (4dp)
 *   lg       → --radius-sm  (8dp)
 *   xl       → --radius-md  (12dp)
 *
 * When the segment is hovered, focused, or pressed the inner corner morphs to
 * the next step up: xs/sm/md → --radius-sm (8dp), lg/xl → --radius-lg (16dp).
 *
 * Motion token pairing:
 *   Border-radius (spatial)   → duration-expressive-fast-spatial  ease-expressive-fast-spatial
 *   Opacity / color (effects) → duration-spring-standard-fast-effects ease-spring-standard-fast-effects
 *   Elevation shadow (effects)→ duration-spring-standard-fast-effects ease-spring-standard-fast-effects
 */

// ─── OUTER CONTAINER ─────────────────────────────────────────────────────────

/**
 * Outer wrapper div — lays out leading + trailing with a 2dp gap.
 * Does NOT own any color, shape, or elevation — those belong to each segment.
 */
export const splitButtonContainerVariants = cva([
  "relative inline-flex items-stretch",
  "gap-0.5", // MD3 2dp gap between segments
]);

// ─── LEADING (PRIMARY) SEGMENT ────────────────────────────────────────────────

/**
 * Leading segment — the primary action button.
 *
 * Shape:
 *   outer corners (top-left, bottom-left) = rounded-full
 *   inner corners (top-right, bottom-right) = var(--sb-inner-radius), driven by
 *   self-targeting data-[x]: selectors on this element for the CSS variable.
 *
 * The doubled data-[x]:data-[x]: selector for pressed/focus achieves higher
 * specificity than single hover, mirroring the Switch handle-size technique.
 */
export const splitButtonLeadingVariants = cva(
  [
    // Layout
    "group/sb-leading relative inline-flex items-center justify-center",
    "cursor-pointer select-none",
    // Shape — asymmetric corners via CSS variable
    "rounded-tl-full rounded-bl-full",
    "rounded-tr-[var(--sb-inner-radius,var(--radius-xs))]",
    "rounded-br-[var(--sb-inner-radius,var(--radius-xs))]",
    // Inner-corner size defaults per state (self-targeting — segment owns the variable)
    "[--sb-inner-radius:var(--radius-xs)]",
    "data-[hovered]:[--sb-inner-radius:var(--radius-sm)]",
    "data-[focus-visible]:data-[focus-visible]:[--sb-inner-radius:var(--radius-sm)]",
    "data-[pressed]:data-[pressed]:[--sb-inner-radius:var(--radius-sm)]",
    // Spatial transition for border-radius morphing
    "transition-[border-radius]",
    "duration-expressive-fast-spatial ease-expressive-fast-spatial",
    // Disabled — self-targeting
    "data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none",
  ],
  {
    variants: {
      /**
       * Visual variant — controls container color, text color, and elevation.
       * State layer color is handled in splitButtonStateLayerVariants.
       */
      variant: {
        /**
         * Filled — highest emphasis.
         * container=primary, label=on-primary
         * Elevation: 0 base → 1 hover → 0 focus/pressed
         */
        filled: [
          "bg-primary text-on-primary shadow-none",
          "group-data-[hovered]/sb-leading:shadow-elevation-1",
          "group-data-[focus-visible]/sb-leading:shadow-none",
          "group-data-[pressed]/sb-leading:group-data-[pressed]/sb-leading:shadow-none",
          // Disabled
          "data-[disabled]:bg-on-surface/12 data-[disabled]:text-on-surface/38 data-[disabled]:shadow-none",
        ],

        /**
         * Tonal — secondary emphasis.
         * container=secondary-container, label=on-secondary-container
         * Elevation: 0 base → 1 hover → 0 focus/pressed
         */
        tonal: [
          "bg-secondary-container text-on-secondary-container shadow-none",
          "group-data-[hovered]/sb-leading:shadow-elevation-1",
          "group-data-[focus-visible]/sb-leading:shadow-none",
          "group-data-[pressed]/sb-leading:group-data-[pressed]/sb-leading:shadow-none",
          // Disabled
          "data-[disabled]:bg-on-surface/12 data-[disabled]:text-on-surface/38 data-[disabled]:shadow-none",
        ],

        /**
         * Outlined — medium emphasis. Transparent with border.
         * container=transparent, border=outline, label=primary
         * Elevation: always 0
         */
        outlined: [
          "bg-transparent border border-outline text-primary",
          // Disabled
          "data-[disabled]:border-on-surface/12 data-[disabled]:text-on-surface/38",
        ],

        /**
         * Elevated — uses surface-container-low with a level-1 shadow base.
         * container=surface-container-low, label=primary
         * Elevation: 1 base → 2 hover → 1 focus/pressed
         */
        elevated: [
          "bg-surface-container-low text-primary shadow-elevation-1",
          "group-data-[hovered]/sb-leading:shadow-elevation-2",
          "group-data-[focus-visible]/sb-leading:shadow-elevation-1",
          "group-data-[pressed]/sb-leading:group-data-[pressed]/sb-leading:shadow-elevation-1",
          // Disabled
          "data-[disabled]:bg-on-surface/12 data-[disabled]:text-on-surface/38 data-[disabled]:shadow-none",
        ],
      },

      /**
       * Size — governs height, horizontal padding, typography, and inner-corner default.
       * lg/xl override the --sb-inner-radius default to larger steps.
       */
      size: {
        xs: "h-8 pl-4 pr-3 text-label-large",
        sm: "h-10 pl-6 pr-4 text-label-large",
        md: "h-14 pl-8 pr-6 text-title-medium",
        lg: [
          "h-24 pl-10 pr-8 text-headline-small",
          "[--sb-inner-radius:var(--radius-sm)]",
          "data-[hovered]:[--sb-inner-radius:var(--radius-lg)]",
          "data-[focus-visible]:data-[focus-visible]:[--sb-inner-radius:var(--radius-lg)]",
          "data-[pressed]:data-[pressed]:[--sb-inner-radius:var(--radius-lg)]",
        ],
        xl: [
          "h-[8.5rem] pl-12 pr-10 text-headline-large",
          "[--sb-inner-radius:var(--radius-md)]",
          "data-[hovered]:[--sb-inner-radius:var(--radius-lg)]",
          "data-[focus-visible]:data-[focus-visible]:[--sb-inner-radius:var(--radius-lg)]",
          "data-[pressed]:data-[pressed]:[--sb-inner-radius:var(--radius-lg)]",
        ],
      },
    },

    defaultVariants: {
      variant: "filled",
      size: "sm",
    },
  }
);

// ─── TRAILING (DROPDOWN TRIGGER) SEGMENT ─────────────────────────────────────

/**
 * Trailing segment — the dropdown trigger.
 *
 * Shape mirrors leading but mirrored: outer corners right, inner corners left.
 * Uses group/sb-trailing for child slot selectors.
 * Gets data-selected when the menu is open (icon centers per MD3 spec).
 */
export const splitButtonTrailingVariants = cva(
  [
    // Layout
    "group/sb-trailing relative inline-flex items-center justify-center",
    "cursor-pointer select-none",
    // Shape — asymmetric corners, inner on the left side
    "rounded-tr-full rounded-br-full",
    "rounded-tl-[var(--sb-inner-radius,var(--radius-xs))]",
    "rounded-bl-[var(--sb-inner-radius,var(--radius-xs))]",
    // Inner-corner size defaults per state
    "[--sb-inner-radius:var(--radius-xs)]",
    "data-[hovered]:[--sb-inner-radius:var(--radius-sm)]",
    "data-[focus-visible]:data-[focus-visible]:[--sb-inner-radius:var(--radius-sm)]",
    "data-[pressed]:data-[pressed]:[--sb-inner-radius:var(--radius-sm)]",
    // Spatial transition for border-radius morphing
    "transition-[border-radius]",
    "duration-expressive-fast-spatial ease-expressive-fast-spatial",
    // Disabled — self-targeting
    "data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        filled: [
          "bg-primary text-on-primary shadow-none",
          "group-data-[hovered]/sb-trailing:shadow-elevation-1",
          "group-data-[focus-visible]/sb-trailing:shadow-none",
          "group-data-[pressed]/sb-trailing:group-data-[pressed]/sb-trailing:shadow-none",
          "data-[disabled]:bg-on-surface/12 data-[disabled]:text-on-surface/38 data-[disabled]:shadow-none",
        ],
        tonal: [
          "bg-secondary-container text-on-secondary-container shadow-none",
          "group-data-[hovered]/sb-trailing:shadow-elevation-1",
          "group-data-[focus-visible]/sb-trailing:shadow-none",
          "group-data-[pressed]/sb-trailing:group-data-[pressed]/sb-trailing:shadow-none",
          "data-[disabled]:bg-on-surface/12 data-[disabled]:text-on-surface/38 data-[disabled]:shadow-none",
        ],
        outlined: [
          "bg-transparent border border-outline text-primary",
          "data-[disabled]:border-on-surface/12 data-[disabled]:text-on-surface/38",
        ],
        elevated: [
          "bg-surface-container-low text-primary shadow-elevation-1",
          "group-data-[hovered]/sb-trailing:shadow-elevation-2",
          "group-data-[focus-visible]/sb-trailing:shadow-elevation-1",
          "group-data-[pressed]/sb-trailing:group-data-[pressed]/sb-trailing:shadow-elevation-1",
          "data-[disabled]:bg-on-surface/12 data-[disabled]:text-on-surface/38 data-[disabled]:shadow-none",
        ],
      },

      size: {
        // MD3 menu-icon optical offset when unselected; centered when selected (data-selected:px-*)
        xs: "h-8 px-3",
        sm: "h-10 px-4",
        md: "h-14 px-5",
        lg: [
          "h-24 px-7",
          "[--sb-inner-radius:var(--radius-sm)]",
          "data-[hovered]:[--sb-inner-radius:var(--radius-lg)]",
          "data-[focus-visible]:data-[focus-visible]:[--sb-inner-radius:var(--radius-lg)]",
          "data-[pressed]:data-[pressed]:[--sb-inner-radius:var(--radius-lg)]",
        ],
        xl: [
          "h-[8.5rem] px-10",
          "[--sb-inner-radius:var(--radius-md)]",
          "data-[hovered]:[--sb-inner-radius:var(--radius-lg)]",
          "data-[focus-visible]:data-[focus-visible]:[--sb-inner-radius:var(--radius-lg)]",
          "data-[pressed]:data-[pressed]:[--sb-inner-radius:var(--radius-lg)]",
        ],
      },
    },

    defaultVariants: {
      variant: "filled",
      size: "sm",
    },
  }
);

// ─── STATE LAYER ─────────────────────────────────────────────────────────────

/**
 * Per-segment state layer — absolute inset overlay that transitions opacity.
 *
 * overflow-hidden clips ripple + state layer to the button shape without
 * affecting the focus ring span (which lives outside this element).
 *
 * Color is variant-specific (MD3 "on-container" role):
 *   filled   → bg-on-primary
 *   tonal    → bg-on-secondary-container
 *   outlined → bg-primary
 *   elevated → bg-primary
 *
 * Opacities:
 *   0 at rest | 8% hover | 10% focus | 10% pressed | hidden disabled
 *
 * The doubled attribute selector for pressed gives it higher specificity (0,2,0)
 * than the single hover selector (0,1,0), ensuring pressed always wins.
 *
 * groupScope controls whether this reads from group/sb-leading or group/sb-trailing.
 */
export const splitButtonStateLayerVariants = cva(
  [
    "absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none opacity-0",
    "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  ],
  {
    variants: {
      variant: {
        filled: "bg-on-primary",
        tonal: "bg-on-secondary-container",
        outlined: "bg-primary",
        elevated: "bg-primary",
      },
      /**
       * groupScope identifies which segment this state layer belongs to so it
       * reads from the correct group-data-[x]/<scope> selectors.
       */
      groupScope: {
        leading: [
          "group-data-[hovered]/sb-leading:opacity-8",
          "group-data-[focus-visible]/sb-leading:opacity-10",
          "group-data-[pressed]/sb-leading:group-data-[pressed]/sb-leading:opacity-10",
          "group-data-[disabled]/sb-leading:hidden",
        ],
        trailing: [
          "group-data-[hovered]/sb-trailing:opacity-8",
          "group-data-[focus-visible]/sb-trailing:opacity-10",
          "group-data-[pressed]/sb-trailing:group-data-[pressed]/sb-trailing:opacity-10",
          "group-data-[disabled]/sb-trailing:hidden",
        ],
      },
    },
    defaultVariants: {
      variant: "filled",
      groupScope: "leading",
    },
  }
);

// ─── FOCUS RING ───────────────────────────────────────────────────────────────

/**
 * Per-segment focus ring overlay.
 *
 * Rendered as an absolute span with inset-[-3px] so it extends 3px outside
 * the segment boundary. Requires that overflow-hidden is NOT on the segment
 * root — it is moved to the state-layer span instead.
 *
 * Always present in DOM (opacity-0 at rest) for smooth CSS transition.
 */
export const splitButtonFocusRingVariants = cva(
  [
    "pointer-events-none absolute inset-[-3px]",
    "outline outline-2 outline-offset-0 outline-secondary",
    "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
    "opacity-0",
  ],
  {
    variants: {
      /**
       * Corner shape must match the segment it wraps.
       * Leading: full-left, inner-right follows --sb-inner-radius.
       * Trailing: full-right, inner-left follows --sb-inner-radius.
       */
      groupScope: {
        leading: [
          "rounded-tl-full rounded-bl-full",
          "rounded-tr-[calc(var(--sb-inner-radius,var(--radius-xs))+3px)]",
          "rounded-br-[calc(var(--sb-inner-radius,var(--radius-xs))+3px)]",
          "group-data-[focus-visible]/sb-leading:opacity-100",
        ],
        trailing: [
          "rounded-tr-full rounded-br-full",
          "rounded-tl-[calc(var(--sb-inner-radius,var(--radius-xs))+3px)]",
          "rounded-bl-[calc(var(--sb-inner-radius,var(--radius-xs))+3px)]",
          "group-data-[focus-visible]/sb-trailing:opacity-100",
        ],
      },
    },
    defaultVariants: { groupScope: "leading" },
  }
);

// ─── LABEL ────────────────────────────────────────────────────────────────────

/**
 * Label text wrapper — z-10 keeps it above state layer and ripple.
 * Typography is inherited from the leading segment's size class.
 */
export const splitButtonLabelVariants = cva(["relative z-10 inline-flex items-center"]);

// ─── ICON ─────────────────────────────────────────────────────────────────────

/**
 * Icon wrapper (leading or trailing chevron).
 *
 * Size scales with the button size per MD3 spec:
 *   xs/sm → 20px | md → 24px | lg → 32px | xl → 40px
 */
export const splitButtonIconVariants = cva(
  ["relative z-10 inline-flex shrink-0 items-center justify-center"],
  {
    variants: {
      size: {
        xs: "size-5",
        sm: "size-5",
        md: "size-6",
        lg: "size-8",
        xl: "size-10",
      },
    },
    defaultVariants: { size: "sm" },
  }
);

// ─── DROPDOWN MENU ────────────────────────────────────────────────────────────

/**
 * Dropdown menu surface — elevated container, positioned below the trailing segment.
 */
export const splitButtonMenuVariants = cva([
  "absolute top-full right-0 z-50 mt-1 min-w-40",
  "bg-surface-container rounded-md py-2",
  "shadow-elevation-2",
  "animate-md-scale-in",
]);

/**
 * Individual menu item row.
 */
export const splitButtonMenuItemVariants = cva(
  [
    "text-body-large text-on-surface cursor-pointer px-4 py-2",
    "hover:bg-on-surface/8",
    "focus:bg-on-surface/10 focus:outline-none",
  ],
  {
    variants: {
      isDisabled: {
        true: "text-on-surface/38 pointer-events-none cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: { isDisabled: false },
  }
);

// ─── EXPORTED TYPES ───────────────────────────────────────────────────────────

export type SplitButtonContainerVariants = VariantProps<typeof splitButtonContainerVariants>;
export type SplitButtonLeadingVariants = VariantProps<typeof splitButtonLeadingVariants>;
export type SplitButtonTrailingVariants = VariantProps<typeof splitButtonTrailingVariants>;
export type SplitButtonStateLayerVariants = VariantProps<typeof splitButtonStateLayerVariants>;
export type SplitButtonFocusRingVariants = VariantProps<typeof splitButtonFocusRingVariants>;
export type SplitButtonIconVariants = VariantProps<typeof splitButtonIconVariants>;
export type SplitButtonMenuItemVariantProps = VariantProps<typeof splitButtonMenuItemVariants>;

/**
 * Convenience bundle of all Split Button CVA functions.
 */
export const splitButtonVariants = {
  container: splitButtonContainerVariants,
  leading: splitButtonLeadingVariants,
  trailing: splitButtonTrailingVariants,
  stateLayer: splitButtonStateLayerVariants,
  focusRing: splitButtonFocusRingVariants,
  label: splitButtonLabelVariants,
  icon: splitButtonIconVariants,
  menu: splitButtonMenuVariants,
  menuItem: splitButtonMenuItemVariants,
};
