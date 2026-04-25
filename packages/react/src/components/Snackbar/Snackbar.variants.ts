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
 * - Position: fixed bottom-4, horizontally centered
 * - Message text: body-medium
 * - Action text: label-large, inverse-primary color
 * - Entry motion: short4 (200ms) + ease-emphasized-decelerate (slide up + fade in)
 * - Exit motion:  short2 (100ms) + ease-emphasized-accelerate (fade out)
 */

// ─── Base container (positioning, surface, shape, layout) ────────────────────

/**
 * Snackbar base container variants — structural, surface, and layout classes.
 * Split from animation variants so the headless layer can merge its own
 * animation-state classes at render time.
 */
export const snackbarBaseVariants = cva(
  [
    // Positioning (portal renders to body; fixed centers at bottom)
    "fixed",
    "bottom-4",
    "left-1/2",
    "-translate-x-1/2",
    "z-50",

    // Sizing (MD3 spec: 288dp min, 568dp max)
    "min-w-72",
    "max-w-snackbar-max",
    "w-max",

    // Surface
    "bg-inverse-surface",

    // Shape: MD3 extra-small corner = 4dp
    "rounded-xs",

    // Elevation level 3
    "shadow-elevation-3",

    // Layout
    "flex",
    "items-center",
    "gap-x-2",
    "px-4",

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
        true: "py-4",
        false: "py-3",
      },
    },
    defaultVariants: {
      twoLine: false,
    },
  }
);

export type SnackbarBaseVariants = VariantProps<typeof snackbarBaseVariants>;

// ─── Animation state classes ──────────────────────────────────────────────────

/**
 * Snackbar animation state variants.
 * Applied by `SnackbarHeadless` based on its internal animation state machine.
 *
 * - `entering`: initial mount state — starts below + transparent before rAF
 * - `visible`:  slide up + fade in (short4 / emphasized-decelerate)
 * - `exiting`:  fade out (short2 / emphasized-accelerate)
 * - `exited`:   fully transparent (removed from DOM by provider)
 */
export const snackbarAnimationVariants = cva("", {
  variants: {
    animationState: {
      entering: ["translate-y-4", "opacity-0"],
      visible: ["translate-y-0", "opacity-100", "duration-short4", "ease-emphasized-decelerate"],
      exiting: ["translate-y-0", "opacity-0", "duration-short2", "ease-emphasized-accelerate"],
      exited: ["translate-y-0", "opacity-0", "duration-short2", "ease-emphasized-accelerate"],
    },
  },
  defaultVariants: {
    animationState: "entering",
  },
});

export type SnackbarAnimationVariants = VariantProps<typeof snackbarAnimationVariants>;

/**
 * Combined container variants (base + animation) for convenience.
 * The headless layer uses `snackbarAnimationVariants` directly; this export
 * is kept for consumers who want the full combined class string without the
 * render-prop pattern.
 */
export const snackbarContainerVariants = cva(
  [
    "fixed",
    "bottom-4",
    "left-1/2",
    "-translate-x-1/2",
    "z-50",
    "min-w-72",
    "max-w-snackbar-max",
    "w-max",
    "bg-inverse-surface",
    "rounded-xs",
    "shadow-elevation-3",
    "flex",
    "items-center",
    "gap-x-2",
    "px-4",
    "text-body-medium",
    "text-inverse-on-surface",
    "transition-[opacity,transform]",
    "will-change-[opacity,transform]",
  ],
  {
    variants: {
      animationState: {
        entering: ["translate-y-4", "opacity-0"],
        visible: ["translate-y-0", "opacity-100", "duration-short4", "ease-emphasized-decelerate"],
        exiting: ["translate-y-0", "opacity-0", "duration-short2", "ease-emphasized-accelerate"],
        exited: ["translate-y-0", "opacity-0", "duration-short2", "ease-emphasized-accelerate"],
      },
      twoLine: {
        true: "py-4",
        false: "py-3",
      },
    },
    defaultVariants: {
      animationState: "entering",
      twoLine: false,
    },
  }
);

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
export const snackbarContentVariants = cva(["flex", "flex-col", "flex-1", "min-w-0"]);

// ─── Initial hidden state ─────────────────────────────────────────────────────

/**
 * Classes applied before the enter animation begins (component just mounted).
 * Positioned off-screen below and transparent.
 */
export const snackbarInitialVariants = cva(["translate-y-4", "opacity-0"]);
