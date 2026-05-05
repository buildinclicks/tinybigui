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
 * - Entry motion: medium1 (250ms) + ease-emphasized-decelerate (zoom in)
 * - Exit motion:  short4 (200ms) + ease-standard-accelerate (fade out)
 */

// ─── Stack container (fixed viewport anchor, per-position group) ──────────────

/**
 * Outer wrapper rendered once per active position group by `SnackbarProvider`.
 * Handles the fixed viewport positioning and stacking direction for all
 * snackbars sharing the same `position` value.
 *
 * - Bottom positions use `flex-col-reverse` so the newest snackbar sits at
 *   the bottom edge and older ones push upward.
 * - Top positions use `flex-col` so the newest sits at the top edge and
 *   older ones push downward.
 * - `pointer-events-none` on the container lets clicks pass through the gaps
 *   between snackbars; each snackbar restores `pointer-events-auto`.
 */
export const snackbarStackContainerVariants = cva(
  ["fixed", "z-50", "flex", "gap-2", "pointer-events-none"],
  {
    variants: {
      position: {
        "bottom-center": [
          "bottom-4",
          "left-1/2",
          "-translate-x-1/2",
          "flex-col-reverse",
          "items-center",
        ],
        "bottom-left": ["bottom-4", "left-4", "flex-col-reverse", "items-start"],
        "bottom-right": ["bottom-4", "right-4", "flex-col-reverse", "items-end"],
        "top-center": ["top-4", "left-1/2", "-translate-x-1/2", "flex-col", "items-center"],
        "top-left": ["top-4", "left-4", "flex-col", "items-start"],
        "top-right": ["top-4", "right-4", "flex-col", "items-end"],
      },
    },
    defaultVariants: { position: "bottom-center" },
  }
);

export type SnackbarStackContainerVariants = VariantProps<typeof snackbarStackContainerVariants>;

// ─── Base container (surface, shape, layout — no positioning) ─────────────────

/**
 * Snackbar base container variants — structural, surface, and layout classes.
 * Positioning is handled by the stack container (`snackbarStackContainerVariants`)
 * so individual snackbars only carry surface/shape/layout concerns.
 */
export const snackbarBaseVariants = cva(
  [
    // Sizing (MD3 spec: 288dp min, 568dp max)
    "min-w-72",
    "max-w-snackbar-max",
    "w-max",
    "min-h-12",

    // Restore pointer events so hover/focus timer pause works
    "pointer-events-auto",

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
 * These classes are now applied to the **stack container** rather than
 * individual snackbars. Kept as a separate export so standalone (non-provider)
 * usage of `SnackbarHeadless` can still apply position classes directly.
 *
 * MD3 default is `bottom-center`.
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
 * The `enterDirection` sets the transform-origin for the scale animation so the
 * snackbar appears to grow from the correct viewport edge:
 * - `up`   (bottom positions): `origin-bottom` — scales up from the bottom edge
 * - `down` (top positions):    `origin-top`    — scales up from the top edge
 *
 * MD3 motion spec (Emphasized easing set — appropriate for high-attention UI entries):
 * - `entering`: initial mount state — scaled down (75%) + transparent (no duration)
 * - `visible`:  scale-100 + opacity-100 (medium1 / emphasized-decelerate = 250ms) — zoom in
 * - `exiting`:  scale-75 + opacity-0 (short4 / standard-accelerate = 200ms) — zoom out
 * - `exited`:   fully transparent (removed from DOM by provider)
 *
 * `ease-emphasized-decelerate` (cubic-bezier(0.05, 0.7, 0.1, 1)) is used for entry
 * instead of `ease-standard-decelerate` (cubic-bezier(0, 0, 0, 1)) because the
 * standard-decelerate curve has an infinite initial velocity — it snaps to ~50%
 * progress in the first few milliseconds, making the zoom feel abrupt. The
 * emphasized-decelerate curve has a finite (but high) initial velocity that
 * produces a visible, smooth movement from scale-75 to scale-100.
 */
export const snackbarAnimationVariants = cva("", {
  variants: {
    animationState: {
      entering: ["opacity-0", "scale-75"],
      visible: ["scale-100", "opacity-100", "duration-medium1", "ease-emphasized-decelerate"],
      exiting: ["scale-75", "opacity-0", "duration-short4", "ease-standard-accelerate"],
      exited: ["scale-75", "opacity-0", "duration-short4", "ease-standard-accelerate"],
    },
    enterDirection: {
      up: ["origin-bottom"],
      down: ["origin-top"],
    },
  },
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
 * render-prop pattern (e.g. standalone headless usage outside the provider).
 */
export const snackbarContainerVariants = cva([...snackbarBaseVariants()], {
  variants: {
    animationState: {
      entering: ["opacity-0", "scale-75"],
      visible: ["scale-100", "opacity-100", "duration-medium1", "ease-emphasized-decelerate"],
      exiting: ["scale-75", "opacity-0", "duration-short4", "ease-standard-accelerate"],
      exited: ["scale-75", "opacity-0", "duration-short4", "ease-standard-accelerate"],
    },
    enterDirection: {
      up: ["origin-bottom"],
      down: ["origin-top"],
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
export const snackbarActionVariants = cva(["shrink-0", "text-inverse-primary"]);

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
 * Scaled down and transparent — the zoom-in entry starts from this state.
 */
export const snackbarInitialVariants = cva(["scale-75", "opacity-0"]);

// ─── Position → direction helper ─────────────────────────────────────────────

/**
 * Derives the enter animation direction from the Snackbar position.
 * Bottom positions slide up; top positions slide down.
 */
export function getEnterDirection(position: string): "up" | "down" {
  return position.startsWith("top") ? "down" : "up";
}
