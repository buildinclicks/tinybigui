import type React from "react";

/**
 * Divider orientation — controls the axis of the visual rule.
 * @default 'horizontal'
 */
export type DividerOrientation = "horizontal" | "vertical";

/**
 * Divider inset — controls which end(s) of the rule are offset by 16dp.
 *
 * Uses logical inline properties (inline-start / inline-end) so insets adapt
 * correctly to RTL writing modes.
 *
 * @default 'none'
 */
export type DividerInset = "none" | "start" | "end" | "both";

/**
 * CSS custom properties supported by the Divider component.
 * Extends `React.CSSProperties` to allow the `--md-divider-thickness` variable.
 */
export interface DividerCSSProperties extends React.CSSProperties {
  /** Thickness of the divider rule. MD3 default: 1dp (1px). */
  "--md-divider-thickness"?: string;
}

/**
 * Material Design 3 Divider Component Props
 *
 * A thin line that groups content in lists and containers.
 * Supports horizontal/vertical orientations and four inset variants.
 *
 * Thickness is controlled via the `--md-divider-thickness` CSS custom property
 * (default `1px`, matching the MD3 1dp specification). Override it with a style
 * prop or an arbitrary Tailwind property:
 *
 * ```tsx
 * <Divider style={{ "--md-divider-thickness": "2px" }} />
 * ```
 *
 * @example
 * ```tsx
 * // Full-bleed horizontal divider (default)
 * <Divider />
 *
 * // Inset divider — logical 16dp from inline-start (RTL-aware)
 * <Divider inset="start" />
 *
 * // Vertical divider inside a flex row
 * <Divider orientation="vertical" />
 *
 * // Custom thickness
 * <Divider style={{ "--md-divider-thickness": "2px" }} />
 * ```
 */
export interface DividerProps {
  /**
   * Orientation of the divider rule.
   * @default 'horizontal'
   */
  orientation?: DividerOrientation;

  /**
   * Inset — shifts the start and/or end of the rule by 16dp (logical, RTL-aware).
   * @default 'none'
   */
  inset?: DividerInset;

  /**
   * Additional Tailwind CSS classes.
   */
  className?: string;

  /**
   * Inline styles. Supports the `--md-divider-thickness` CSS custom property
   * to override the default 1dp thickness.
   */
  style?: DividerCSSProperties;
}

/**
 * Props for the headless Divider primitive.
 *
 * Renders an unstyled separator element using React Aria's `useSeparator`
 * hook. Bring your own styles via `className`.
 *
 * @example
 * ```tsx
 * <DividerHeadless
 *   orientation="horizontal"
 *   className="w-full h-px bg-outline-variant"
 * />
 * ```
 */
export interface DividerHeadlessProps {
  /**
   * Orientation passed to `useSeparator` for correct ARIA semantics.
   * @default 'horizontal'
   */
  orientation?: DividerOrientation;

  /**
   * Additional Tailwind CSS classes.
   */
  className?: string;

  /**
   * Inline styles forwarded to the underlying element.
   */
  style?: DividerCSSProperties;
}
