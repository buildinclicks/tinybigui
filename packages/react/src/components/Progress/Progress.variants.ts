import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Progress Indicator Variants (CVA)
 *
 * Architecture: Slot-based CVA blocks (no interaction states — Progress is non-interactive).
 * Each DOM slot owns a separate CVA. Design-time variant props (type, size, thickness)
 * are passed to the appropriate slot; no state variants exist here.
 *
 * MD3 Expressive spec (materialy.io/components/progress-indicators):
 *   Active indicator color : primary
 *   Inactive track color   : primary-container  (Expressive "colorful" style)
 *   Indicator-track gap    : 4dp
 *   Stop indicator         : 4dp dot, primary, trailing edge (linear determinate only)
 *   Track corner radius    : fully-rounded (rounded-full for all segments)
 *   Track thickness        : 4dp default (h-1) | 8dp thick (h-2)
 *   Determinate transition : spatial spring — width/stroke are spatial properties
 *   Indeterminate motion   : keyframes in Progress.css referencing MD3 motion tokens
 *
 * Slot map:
 *   progressContainerVariants     — outer wrapper; flex layout
 *   progressLabelVariants         — body-small on-surface label text
 *   progressTrackVariants         — linear inactive rail; thickness variant
 *   progressActiveIndicatorVariants — linear active fill; spring spatial transition
 *   progressInactiveSegmentVariants — linear inactive segment (rendered after gap)
 *   progressStopIndicatorVariants  — 4dp primary dot at trailing edge (linear det only)
 *   progressCircularSizeVariants   — circular SVG wrapper; size + thickness variant
 */

// ─── CONTAINER ────────────────────────────────────────────────────────────────

/**
 * Outer wrapper for the entire progress indicator (label + visual).
 * linear → full-width column; circular → auto-width centred column.
 */
export const progressContainerVariants = cva(["inline-flex", "flex-col", "gap-1"], {
  variants: {
    type: {
      linear: "w-full",
      circular: "items-center justify-center w-auto",
    },
  },
  defaultVariants: {
    type: "linear",
  },
});

// ─── LABEL ────────────────────────────────────────────────────────────────────

/**
 * Optional visible label rendered above the indicator.
 * MD3: body-small type scale, on-surface color role.
 */
export const progressLabelVariants = cva(["text-body-small", "text-on-surface", "select-none"]);

// ─── LINEAR TRACK (OUTER WRAPPER) ─────────────────────────────────────────────

/**
 * Linear track outer wrapper.
 * This element establishes the full-width positioning context for the
 * active indicator, inactive segment, and stop indicator.
 * It does NOT carry a background color itself — the inactive track is a
 * separate sibling element rendered after the gap.
 *
 * thickness variant:
 *   default → h-1 (4dp)
 *   thick   → h-2 (8dp) per MD3 Expressive "thick" configuration
 */
export const progressTrackVariants = cva(
  [
    "relative",
    "w-full",
    "overflow-visible", // gap segments extend beyond clipping bounds
    "rounded-full",
  ],
  {
    variants: {
      thickness: {
        default: "h-1",
        thick: "h-2",
      },
    },
    defaultVariants: {
      thickness: "default",
    },
  }
);

// ─── LINEAR ACTIVE INDICATOR ──────────────────────────────────────────────────

/**
 * Linear active indicator bar (foreground fill).
 *
 * MD3 Expressive: primary color, fully rounded.
 * Spatial spring transition on width — width is a spatial property
 * (can animate with controlled overshoot), not an effects property.
 *
 * Uses spring-standard-default-spatial (500ms) — progress updates are
 * purposeful UI feedback, not high-emphasis expressive moments.
 */
export const progressActiveIndicatorVariants = cva([
  "absolute",
  "left-0",
  "top-0",
  "h-full",
  "rounded-full",
  "bg-primary",
  // Spatial spring — width changes are spatial (bar growing)
  "transition-[width]",
  "duration-spring-standard-default-spatial",
  "ease-spring-standard-default-spatial",
]);

// ─── LINEAR INACTIVE SEGMENT (AFTER GAP) ──────────────────────────────────────

/**
 * Linear inactive segment — rendered to the right of the active indicator
 * with a 4dp gap between them.
 *
 * MD3 Expressive: primary-container color, fully rounded.
 * `left` is set inline to `calc(P% + 4px)` by the component.
 * Hidden when progress reaches 100% (right=0 with left>100% collapses it).
 */
export const progressInactiveSegmentVariants = cva([
  "absolute",
  "top-0",
  "right-0",
  "h-full",
  "rounded-full",
  "bg-primary-container",
  // Spatial spring on left position (gap moves as progress moves)
  "transition-[left]",
  "duration-spring-standard-default-spatial",
  "ease-spring-standard-default-spatial",
]);

// ─── STOP INDICATOR ───────────────────────────────────────────────────────────

/**
 * Stop indicator dot — trailing edge of the track for linear determinate.
 *
 * MD3 spec: 4dp size, primary color, always at the far right edge.
 * Required when the track has contrast < 3:1 with its container surface;
 * included unconditionally for determinacy and clarity.
 */
export const progressStopIndicatorVariants = cva([
  "absolute",
  "right-0",
  "top-1/2",
  "-translate-y-1/2",
  "size-1", // 4dp
  "rounded-full",
  "bg-primary",
]);

// ─── CIRCULAR SIZE ────────────────────────────────────────────────────────────

/**
 * Circular SVG wrapper.
 * Maps the size prop to MD3-specified dimensions.
 *
 * size:
 *   small  → 24dp (h-6 w-6)
 *   medium → 48dp (h-12 w-12, default)
 *   large  → 64dp (h-16 w-16)
 */
export const progressCircularSizeVariants = cva(
  ["relative", "flex", "items-center", "justify-center", "flex-shrink-0"],
  {
    variants: {
      size: {
        small: "h-6 w-6",
        medium: "h-12 w-12",
        large: "h-16 w-16",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  }
);

// ─── BACKWARD COMPAT ALIAS ────────────────────────────────────────────────────

/**
 * @deprecated Use `progressActiveIndicatorVariants` instead.
 * Kept for backward compatibility with any consumers importing this directly.
 */
export const progressIndicatorVariants = progressActiveIndicatorVariants;

// ─── EXPORTED TYPES ───────────────────────────────────────────────────────────

export type ProgressContainerVariants = VariantProps<typeof progressContainerVariants>;
export type ProgressTrackVariants = VariantProps<typeof progressTrackVariants>;
export type ProgressActiveIndicatorVariants = VariantProps<typeof progressActiveIndicatorVariants>;
export type ProgressInactiveSegmentVariants = VariantProps<typeof progressInactiveSegmentVariants>;
export type ProgressStopIndicatorVariants = VariantProps<typeof progressStopIndicatorVariants>;
export type ProgressCircularSizeVariants = VariantProps<typeof progressCircularSizeVariants>;
export type ProgressLabelVariants = VariantProps<typeof progressLabelVariants>;

/** @deprecated Use `ProgressActiveIndicatorVariants` instead. */
export type ProgressIndicatorVariants = ProgressActiveIndicatorVariants;
