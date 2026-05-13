import type {
  ButtonGroupContextValue,
  ButtonGroupShape,
  ButtonGroupSize,
} from "./ButtonGroup.types";

/**
 * Static lookup table for connected-variant inner corner radii.
 *
 * "Inner" corners are the adjacent sides of every button in a connected group.
 * These values are applied to ALL four corners first, then the outer corners of
 * the first/last buttons are selectively overridden with `OUTER_RADIUS_*`.
 *
 * All class strings are written statically here so that Tailwind v4 can detect
 * them during the build-time class scan.
 *
 * MD3 spec values (dp → Tailwind tokens):
 *   extra-small = 4dp  → rounded-xs   (--radius-xs = 4px)
 *   small       = 8dp  → rounded-sm   (--radius-sm = 8px)
 *   medium      = 8dp  → rounded-sm
 *   large       = 16dp → rounded-lg   (--radius-lg = 16px)
 *   extra-large = 20dp → rounded-[20px] (no matching token; --radius-xl is 28px)
 */
const INNER_RADIUS: Record<ButtonGroupSize, string> = {
  "extra-small": "rounded-xs",
  small: "rounded-sm",
  medium: "rounded-sm",
  large: "rounded-lg",
  "extra-large": "rounded-[20px]",
};

/**
 * Outer corner radius for the "round" shape: always full (pill).
 */
const OUTER_RADIUS_ROUND = "rounded-full";

/**
 * Outer corner radius lookup for the "square" shape.
 * Outer corners are the same value as inner corners (no distinction in square mode).
 */
const OUTER_RADIUS_SQUARE: Record<ButtonGroupSize, string> = {
  "extra-small": "rounded-xs",
  small: "rounded-sm",
  medium: "rounded-sm",
  large: "rounded-lg",
  "extra-large": "rounded-[20px]",
};

/**
 * Static class arrays for all (shape × size) combinations in the connected variant.
 *
 * Each array contains:
 *   [0] Inner radius class (applied to all corners of every button)
 *   … `first:` / `last:` overrides using **logical** `rounded-s-*` / `rounded-e-*` so
 *     outer vs inner corners stay correct in LTR and RTL.
 *
 * `round` shape: outer (exposed) corners use a graduated radius per size tier to avoid sharp
 *   contrast at the join — xs→`rounded-s-lg`, sm→`rounded-s-xl`, md→`rounded-s-3xl`,
 *   lg/xl→`rounded-s-4xl`. Inner (adjacent) corners shrink per size tier — xs=4dp, sm/md=8dp,
 *   lg=16dp, xl=20dp.
 *
 * `square` shape: outer corners are the same as inner corners — uniform radius on all
 *   four corners of every button. No distinction between outer and inner edges.
 *
 * Writing the full class strings statically (not via string concatenation) ensures
 * the Tailwind CSS v4 scanner can detect all classes at build time.
 */
const CONNECTED_RADIUS_CLASSES: Record<
  ButtonGroupShape,
  Record<ButtonGroupSize, readonly string[]>
> = {
  round: {
    "extra-small": ["rounded-xs", "first:rounded-s-lg", "last:rounded-e-lg"],
    small: ["rounded-sm", "first:rounded-s-xl", "last:rounded-e-xl"],
    medium: ["rounded-sm", "first:rounded-s-3xl", "last:rounded-e-3xl"],
    large: ["rounded-lg", "first:rounded-s-4xl", "last:rounded-e-4xl"],
    "extra-large": ["rounded-[20px]", "first:rounded-s-4xl", "last:rounded-e-4xl"],
  },
  square: {
    "extra-small": ["rounded-xs", "first:rounded-s-xs", "last:rounded-e-xs"],
    small: ["rounded-sm", "first:rounded-s-sm", "last:rounded-e-sm"],
    medium: ["rounded-sm", "first:rounded-s-sm", "last:rounded-e-sm"],
    large: ["rounded-lg", "first:rounded-s-lg", "last:rounded-e-lg"],
    "extra-large": ["rounded-[20px]", "first:rounded-s-[20px]", "last:rounded-e-[20px]"],
  },
};

/**
 * Returns the Tailwind class strings for connected-variant corner radius overrides.
 *
 * Call this inside `Button` or `IconButton` when `variant === 'connected'` is
 * detected from `useOptionalButtonGroup()`. The returned classes:
 *
 * 1. Override the button's default `rounded-full` with the correct inner radius
 * 2. Use `first:rounded-s-*` to restore outer corners on the first button
 * 3. Use `last:rounded-e-*` to restore outer corners on the last button
 *
 * Relies on CSS pseudo-class specificity — no React-level child enumeration needed.
 *
 * @example
 * ```tsx
 * const groupCtx = useOptionalButtonGroup();
 * if (groupCtx?.variant === 'connected') {
 *   const radiusClasses = getConnectedRadiusClasses(groupCtx);
 *   // → ['rounded-sm', 'first:rounded-s-3xl', 'last:rounded-e-3xl']
 * }
 * ```
 */
export function getConnectedRadiusClasses(
  ctx: ButtonGroupContextValue,
  value?: string
): readonly string[] {
  const connectedClasses = CONNECTED_RADIUS_CLASSES[ctx.shape][ctx.size];
  if (value && ctx.selectedValues.has(value)) {
    // round: morph to full pill on selection (MD3 segmented button selected state)
    // square: keep uniform inner radius — no pill morph in square mode
    return ctx.shape === "round" ? ["rounded-full"] : [INNER_RADIUS[ctx.size]];
  }
  return connectedClasses;
}

/**
 * Returns the inner corner radius Tailwind class for a given size.
 * Useful when computing context values in the headless layer.
 */
export function getInnerRadius(size: ButtonGroupSize): string {
  return INNER_RADIUS[size];
}

/**
 * Returns the outer corner radius Tailwind class for a given shape + size.
 * Useful when computing context values in the headless layer.
 */
export function getOuterRadius(shape: ButtonGroupShape, size: ButtonGroupSize): string {
  if (shape === "round") return OUTER_RADIUS_ROUND;
  return OUTER_RADIUS_SQUARE[size];
}
