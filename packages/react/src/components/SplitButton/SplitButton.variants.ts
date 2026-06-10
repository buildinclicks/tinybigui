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
 *   splitButtonIconVariants       — icon wrapper; carries per-size optical offset + selected reset
 *   splitButtonMenuVariants       — dropdown menu surface
 *   splitButtonMenuItemVariants   — individual menu item row
 *
 * MD3 Expressive Specs:
 *   Shape: outer corners rounded-full; inner corners morph on interaction
 *   Height: 32dp xs | 40dp sm | 56dp md | 96dp lg | 136dp xl
 *   Trailing segment is always square (width = height); selected state = perfect circle
 *   Gap between segments: 2dp (gap-0.5)
 *   Icon size: 20px xs/sm | 24px md | 32px lg | 40px xl
 *   State-layer opacities: hover 8% | focus 10% | pressed 10%
 *   Disabled: container on-surface/12 | content on-surface/38
 *   Elevation: elevated base=1 hover=2; filled/tonal base=0 hover=1; outlined none
 *
 * Inner-corner radius morph table (--sb-inner-radius CSS variable):
 *
 *   Size     Rest         Hover / Focus        Pressed (stronger)   Selected (trailing)
 *   xs/sm/md --radius-xs  --radius-sm          --radius-lg          --radius-full
 *   lg       --radius-sm  --radius-lg          --radius-xl          --radius-full
 *   xl       --radius-md  --radius-lg          --radius-xl          --radius-full
 *
 * Specificity ladder (CSS attribute selector weight, all at same cascade layer):
 *   rest           → [--sb-inner-radius:...] (0,0,0 base class)
 *   hovered        → data-[hovered]:         (0,1,0)
 *   focus-visible  → data-[fv]:data-[fv]:    (0,2,0)
 *   pressed        → data-[pressed]:data-[pressed]:data-[pressed]:  (0,3,0)
 *   selected       → data-[sel]:data-[sel]:data-[sel]:data-[sel]:   (0,4,0) — always wins
 *
 * Motion token pairing:
 *   Border-radius / transform (spatial) → duration-expressive-fast-spatial ease-expressive-fast-spatial
 *   Opacity / color / shadow (effects)  → duration-spring-standard-fast-effects ease-spring-standard-fast-effects
 *
 * Chevron optical offset (MD3 spec — trailing icon shifts toward center gap when unselected):
 *   xs/sm: -1dp  md: -2dp  lg: -3dp  xl: -6dp
 *   Resets to translate-x-0 when group-data-[selected]/sb-trailing is present.
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
    // Inner-corner morph — xs/sm/md defaults; lg/xl override in size variants below.
    // Specificity ladder: rest (0,0,0) < hover (0,1,0) < focus (0,2,0) < pressed (0,3,0)
    "[--sb-inner-radius:var(--radius-xs)]",
    "data-[hovered]:[--sb-inner-radius:var(--radius-sm)]",
    "data-[focus-visible]:data-[focus-visible]:[--sb-inner-radius:var(--radius-sm)]",
    // Pressed morphs stronger than hover/focus — tripled selector → (0,3,0)
    "data-[pressed]:data-[pressed]:data-[pressed]:[--sb-inner-radius:var(--radius-lg)]",
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
       * Size — governs height, horizontal padding, typography, and inner-corner rest/morph values.
       * lg/xl need larger rest radii so their morph steps differ from xs/sm/md.
       */
      size: {
        xs: "h-8 pl-4 pr-3 text-label-large",
        sm: "h-10 pl-6 pr-4 text-label-large",
        md: "h-14 pl-8 pr-6 text-title-medium",
        lg: [
          "h-24 pl-10 pr-8 text-headline-small",
          // lg rest=sm, hover/focus→lg, pressed→xl
          "[--sb-inner-radius:var(--radius-sm)]",
          "data-[hovered]:[--sb-inner-radius:var(--radius-lg)]",
          "data-[focus-visible]:data-[focus-visible]:[--sb-inner-radius:var(--radius-lg)]",
          "data-[pressed]:data-[pressed]:data-[pressed]:[--sb-inner-radius:var(--radius-xl)]",
        ],
        xl: [
          "h-[8.5rem] pl-12 pr-10 text-headline-large",
          // xl rest=md, hover/focus→lg, pressed→xl
          "[--sb-inner-radius:var(--radius-md)]",
          "data-[hovered]:[--sb-inner-radius:var(--radius-lg)]",
          "data-[focus-visible]:data-[focus-visible]:[--sb-inner-radius:var(--radius-lg)]",
          "data-[pressed]:data-[pressed]:data-[pressed]:[--sb-inner-radius:var(--radius-xl)]",
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
    // Layout — square so that selected (rounded-full on all corners) = perfect circle
    "group/sb-trailing relative inline-flex items-center justify-center shrink-0",
    "cursor-pointer select-none",
    // Shape — asymmetric corners, inner on the left side
    "rounded-tr-full rounded-br-full",
    "rounded-tl-[var(--sb-inner-radius,var(--radius-xs))]",
    "rounded-bl-[var(--sb-inner-radius,var(--radius-xs))]",
    // Inner-corner morph — xs/sm/md defaults; lg/xl override in size variants below.
    // Specificity ladder: rest (0,0,0) < hover (0,1,0) < focus (0,2,0) < pressed (0,3,0) < selected (0,4,0)
    "[--sb-inner-radius:var(--radius-xs)]",
    "data-[hovered]:[--sb-inner-radius:var(--radius-sm)]",
    "data-[focus-visible]:data-[focus-visible]:[--sb-inner-radius:var(--radius-sm)]",
    // Pressed morphs stronger than hover/focus — tripled → (0,3,0)
    "data-[pressed]:data-[pressed]:data-[pressed]:[--sb-inner-radius:var(--radius-lg)]",
    // Selected (menu open) → full circle; quadrupled → (0,4,0) always wins
    "data-[selected]:data-[selected]:data-[selected]:data-[selected]:[--sb-inner-radius:var(--radius-full)]",
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
        // Square dimensions (width = height) so selected state = perfect circle.
        // Per-size inner-radius rest/morph values mirror the leading segment.
        xs: "h-8 w-8",
        sm: "h-10 w-10",
        md: "h-14 w-14",
        lg: [
          "h-24 w-24",
          // lg rest=sm, hover/focus→lg, pressed→xl; selected→full handled in base classes
          "[--sb-inner-radius:var(--radius-sm)]",
          "data-[hovered]:[--sb-inner-radius:var(--radius-lg)]",
          "data-[focus-visible]:data-[focus-visible]:[--sb-inner-radius:var(--radius-lg)]",
          "data-[pressed]:data-[pressed]:data-[pressed]:[--sb-inner-radius:var(--radius-xl)]",
        ],
        xl: [
          "h-[8.5rem] w-[8.5rem]",
          // xl rest=md, hover/focus→lg, pressed→xl; selected→full handled in base classes
          "[--sb-inner-radius:var(--radius-md)]",
          "data-[hovered]:[--sb-inner-radius:var(--radius-lg)]",
          "data-[focus-visible]:data-[focus-visible]:[--sb-inner-radius:var(--radius-lg)]",
          "data-[pressed]:data-[pressed]:data-[pressed]:[--sb-inner-radius:var(--radius-xl)]",
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
 *
 * For the trailing chevron the MD3 spec calls for an optical offset toward the
 * gap between segments when the button is unselected, and resets to centered
 * when selected (menu open). The offset is applied as a negative translate-x
 * and reverted via group-data-[selected]/sb-trailing:translate-x-0.
 *
 * Chevron optical offsets (trailing only):
 *   xs/sm: -1dp  md: -2dp  lg: -3dp  xl: -6dp
 */
export const splitButtonIconVariants = cva(
  [
    "relative z-10 inline-flex shrink-0 items-center justify-center",
    // Spatial spring motion for the optical-offset translate
    "transition-transform duration-spring-standard-fast-spatial ease-spring-standard-fast-spatial",
    // Reset offset when the trailing segment is in selected state (menu open)
    "group-data-[selected]/sb-trailing:translate-x-0",
  ],
  {
    variants: {
      size: {
        // Include per-size icon dimension + unselected optical offset
        xs: ["size-5", "-translate-x-px"],
        sm: ["size-5", "-translate-x-px"],
        md: ["size-6", "-translate-x-0.5"],
        lg: ["size-8", "-translate-x-[3px]"],
        xl: ["size-10", "-translate-x-[6px]"],
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
