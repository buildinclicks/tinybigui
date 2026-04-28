import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Snackbar Variants (CVA)
 *
 * Type-safe variant management using Tailwind CSS classes mapped to MD3 tokens.
 *
 * MD3 Specifications:
 * - Surface color: inverse-surface
 * - Text color: inverse-on-surface
 * - Shape: extra-small (4dp) → rounded-xs
 * - Elevation: level-3 → shadow-elevation-3
 * - Min width: 288dp → min-w-72
 * - Max width: 568dp → max-w-snackbar-max
 * - Default position: fixed bottom-4, horizontally centered
 * - Message text: body-medium
 * - Action text: label-large, inverse-primary color
 * - Entry motion: short4 (200ms) + ease-emphasized-decelerate (slide up/down + fade in)
 * - Exit motion:  short2 (100ms) + ease-emphasized-accelerate (fade out)
 */

// ─── Base container (surface, shape, layout — no positioning) ─────────────────

/**
 * Snackbar base container variants — structural, surface, and layout classes.
 * Positioning is handled separately via `snackbarPositionVariants` so it can
 * be updated independently from animation state.
 */
export const snackbarBaseVariants = cva(
  [
    // Fixed stacking context
    "fixed",
    "z-50",

    // Sizing (MD3 spec: 288dp min, 568dp max)
    "min-w-72",
    "max-w-snackbar-max",
    "w-max",
    "min-h-12",

    // Surface
    "bg-inverse-surface",

    // Shape: MD3 extra-small corner = 4dp
    "rounded-xs",

    // Elevation level 3
    "shadow-elevation-3",

    // Layout
    "flex",
    "items-center",
    "gap-x-1",
    "pl-4 pr-2",

    // Typography
    "text-body-medium",
    "text-inverse-on-surface",

    // Transition (properties used by both entry and exit)
    "transition-[opacity,transform]",
    "will-change-[opacity,transform]",
  ],
  {
    variants: {
      /**
       * Whether the Snackbar has supporting text (two-line layout).
       * Adjusts vertical padding to MD3 spec for two-line configuration.
       */
      twoLine: {
        true: "py-1",
        false: "py-1",
      },
    },
    defaultVariants: {
      twoLine: false,
    },
  }
);

export type SnackbarBaseVariants = VariantProps<typeof snackbarBaseVariants>;

// ─── Position variants ────────────────────────────────────────────────────────

/**
 * Snackbar screen position variants.
 *
 * Maps to a fixed corner/edge of the viewport with 16dp (4) inset.
 * MD3 default is `bottom-center`.
 *
 * Center variants add `left-1/2 -translate-x-1/2` for horizontal centering.
 */
export const snackbarPositionVariants = cva("", {
  variants: {
    position: {
      "bottom-center": ["bottom-4", "left-1/2", "-translate-x-1/2"],
      "bottom-left": ["bottom-4", "left-4"],
      "bottom-right": ["bottom-4", "right-4"],
      "top-center": ["top-4", "left-1/2", "-translate-x-1/2"],
      "top-left": ["top-4", "left-4"],
      "top-right": ["top-4", "right-4"],
    },
  },
  defaultVariants: {
    position: "bottom-center",
  },
});

export type SnackbarPositionVariants = VariantProps<typeof snackbarPositionVariants>;

// ─── Animation state classes ──────────────────────────────────────────────────

/**
 * Snackbar animation state variants.
 * Applied by `SnackbarHeadless` based on its internal animation state machine.
 *
 * The `enterDirection` controls the initial translate offset:
 * - `up`   (bottom positions): starts `translate-y-4`  (below) → slides up
 * - `down` (top positions):    starts `-translate-y-4` (above) → slides down
 *
 * - `entering`: initial mount state — starts offset + transparent
 * - `visible`:  translate-y-0 + fade in (short4 / emphasized-decelerate)
 * - `exiting`:  fade out in place (short2 / emphasized-accelerate)
 * - `exited`:   fully transparent (removed from DOM by provider)
 */
export const snackbarAnimationVariants = cva("", {
  variants: {
    animationState: {
      entering: ["opacity-0"],
      visible: ["translate-y-0", "opacity-100", "duration-short4", "ease-emphasized-decelerate"],
      exiting: ["translate-y-0", "opacity-0", "duration-short2", "ease-emphasized-accelerate"],
      exited: ["translate-y-0", "opacity-0", "duration-short2", "ease-emphasized-accelerate"],
    },
    enterDirection: {
      up: [],
      down: [],
    },
  },
  compoundVariants: [
    { animationState: "entering", enterDirection: "up", class: "translate-y-4" },
    { animationState: "entering", enterDirection: "down", class: "-translate-y-4" },
  ],
  defaultVariants: {
    animationState: "entering",
    enterDirection: "up",
  },
});

export type SnackbarAnimationVariants = VariantProps<typeof snackbarAnimationVariants>;

/**
 * Combined container variants (base + position + animation) for convenience.
 * The headless layer uses `snackbarAnimationVariants` directly; this export
 * is kept for consumers who want the full combined class string without the
 * render-prop pattern.
 */
export const snackbarContainerVariants = cva([...snackbarBaseVariants()], {
  variants: {
    animationState: {
      entering: ["opacity-0"],
      visible: ["translate-y-0", "opacity-100", "duration-short4", "ease-emphasized-decelerate"],
      exiting: ["translate-y-0", "opacity-0", "duration-short2", "ease-emphasized-accelerate"],
      exited: ["translate-y-0", "opacity-0", "duration-short2", "ease-emphasized-accelerate"],
    },
    enterDirection: {
      up: [],
      down: [],
    },
    position: {
      "bottom-center": ["bottom-4", "left-1/2", "-translate-x-1/2"],
      "bottom-left": ["bottom-4", "left-4"],
      "bottom-right": ["bottom-4", "right-4"],
      "top-center": ["top-4", "left-1/2", "-translate-x-1/2"],
      "top-left": ["top-4", "left-4"],
      "top-right": ["top-4", "right-4"],
    },
    twoLine: {
      true: "py-1",
      false: "py-1",
    },
  },
  compoundVariants: [
    { animationState: "entering", enterDirection: "up", class: "translate-y-4" },
    { animationState: "entering", enterDirection: "down", class: "-translate-y-4" },
  ],
  defaultVariants: {
    animationState: "entering",
    enterDirection: "up",
    position: "bottom-center",
    twoLine: false,
  },
});

export type SnackbarContainerVariants = VariantProps<typeof snackbarContainerVariants>;

// ─── Message ─────────────────────────────────────────────────────────────────

/**
 * Message text variants.
 * MD3: body-medium, inverse-on-surface color.
 */
export const snackbarMessageVariants = cva([
  "flex-1",
  "text-body-medium",
  "text-inverse-on-surface",
]);

// ─── Supporting text ─────────────────────────────────────────────────────────

/**
 * Supporting text variants (two-line configuration).
 * Same color role as message text per MD3 spec.
 */
export const snackbarSupportingTextVariants = cva([
  "text-body-medium",
  "text-inverse-on-surface",
  "opacity-80",
]);

// ─── Action button wrapper ────────────────────────────────────────────────────

/**
 * Wrapper applied around the action `Button` to override its color to
 * `inverse-primary` as required by MD3 Snackbar spec.
 */
export const snackbarActionVariants = cva([
  "shrink-0",
  // Color override for the nested Button's text — applied via CSS variable
  // override on the wrapper; the Button(variant="text") reads text color
  // from the current text color context.
  "text-inverse-primary",
]);

// ─── Close icon button wrapper ────────────────────────────────────────────────

/**
 * Wrapper applied around the close `IconButton` to use `inverse-on-surface`
 * as required by MD3 Snackbar spec.
 */
export const snackbarCloseVariants = cva(["shrink-0", "text-inverse-on-surface"]);

// ─── Text+action layout ───────────────────────────────────────────────────────

/**
 * Inner content column (message + optional supporting text).
 */
export const snackbarContentVariants = cva(["flex", "flex-col", "flex-1", "min-w-0 py-2 pr-2"]);

// ─── Initial hidden state ─────────────────────────────────────────────────────

/**
 * Classes applied before the enter animation begins (component just mounted).
 * Positioned off-screen below and transparent.
 */
export const snackbarInitialVariants = cva(["translate-y-4", "opacity-0"]);

// ─── Position → direction helper ─────────────────────────────────────────────

/**
 * Derives the enter animation direction from the Snackbar position.
 * Bottom positions slide up; top positions slide down.
 */
export function getEnterDirection(position: string): "up" | "down" {
  return position.startsWith("top") ? "down" : "up";
}
