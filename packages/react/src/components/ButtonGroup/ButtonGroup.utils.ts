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
 *   xs = 4dp  → rounded-xs   (--radius-xs = 4px)
 *   sm = 8dp  → rounded-sm   (--radius-sm = 8px)
 *   md = 8dp  → rounded-sm
 *   lg = 16dp → rounded-lg   (--radius-lg = 16px)
 *   xl = 20dp → rounded-[20px] (no matching token; --radius-xl is 28px)
 */
const INNER_RADIUS: Record<ButtonGroupSize, string> = {
  xs: "rounded-xs",
  sm: "rounded-sm",
  md: "rounded-sm",
  lg: "rounded-lg",
  xl: "rounded-[20px]",
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
  xs: "rounded-xs",
  sm: "rounded-sm",
  md: "rounded-sm",
  lg: "rounded-lg",
  xl: "rounded-[20px]",
};

/**
 * Static class arrays for all (shape × size) combinations in the connected variant.
 *
 * Each array contains:
 *   [0] Inner radius class (applied to all corners of every button)
 *   … `first:` / `last:` overrides using **logical** `rounded-s-*` / `rounded-e-*` so
 *     outer vs inner corners stay correct in LTR and RTL (MD3 pill outer, inner lg tier).
 *
 * Writing the full class strings statically (not via string concatenation) ensures
 * the Tailwind CSS v4 scanner can detect all classes at build time.
 */
const CONNECTED_RADIUS_CLASSES: Record<
  ButtonGroupShape,
  Record<ButtonGroupSize, readonly string[]>
> = {
  round: {
    xs: ["rounded-xs", "first:rounded-s-4xl", "last:rounded-e-4xl"],
    sm: ["rounded-sm", "first:rounded-s-4xl", "last:rounded-e-4xl"],
    md: ["rounded-sm", "first:rounded-s-4xl", "last:rounded-e-4xl"],
    lg: ["rounded-lg", "first:rounded-s-4xl", "last:rounded-e-4xl"],
    xl: ["rounded-xl", "first:rounded-s-4xl", "last:rounded-e-4xl"],
  },
  square: {
    xs: ["rounded-xs", "first:rounded-s-4xl", "last:rounded-e-4xl"],
    sm: ["rounded-sm", "first:rounded-s-4xl", "last:rounded-e-4xl"],
    md: ["rounded-sm", "first:rounded-s-4xl", "last:rounded-e-4xl"],
    lg: ["rounded-lg", "first:rounded-s-4xl", "last:rounded-e-4xl"],
    xl: ["rounded-xl", "first:rounded-s-4xl", "last:rounded-e-4xl"],
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
 *   // → ['rounded-sm', 'first:rounded-s-full', 'last:rounded-e-full']
 * }
 * ```
 */
export function getConnectedRadiusClasses(
  ctx: ButtonGroupContextValue,
  value?: string
): readonly string[] {
  const connectedClasses = CONNECTED_RADIUS_CLASSES[ctx.shape][ctx.size];
  if (value) {
    return ctx.selectedValues.has(value)
      ? [...connectedClasses, "rounded-full", "first:rounded-s-full", "last:rounded-e-full"]
      : connectedClasses;
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
