import type React from "react";

/**
 * Divider orientation — controls the axis of the visual rule.
 * @default 'horizontal'
 */
export type DividerOrientation = "horizontal" | "vertical";

/**
 * Divider inset — controls which end(s) of the rule are inset by 16dp.
 * Per MD3 spec: insets create visual association with list content.
 * @default 'none'
 */
export type DividerInset = "none" | "start" | "end" | "both";

/**
 * Material Design 3 Divider Component Props
 *
 * A thin line that groups content in lists and containers.
 * Supports horizontal/vertical orientations, inset variants, and a
 * subheader label variant.
 *
 * @example
 * ```tsx
 * // Full-bleed horizontal divider (default)
 * <Divider />
 *
 * // Inset divider (16dp from start)
 * <Divider inset="start" />
 *
 * // Vertical divider
 * <Divider orientation="vertical" />
 *
 * // Subheader / labeled divider
 * <Divider label="Section Title" />
 * ```
 */
export interface DividerProps {
  /**
   * Orientation of the divider rule.
   * @default 'horizontal'
   */
  orientation?: DividerOrientation;

  /**
   * Inset — shifts the start and/or end of the rule by 16dp.
   * @default 'none'
   */
  inset?: DividerInset;

  /**
   * When provided, renders a subheader (labeled) divider with the text
   * centered between two rule lines.
   */
  label?: string;

  /**
   * Additional Tailwind CSS classes.
   */
  className?: string;
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
 *   className="border-t border-outline-variant w-full"
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
   * Subheader label text. Declared for interface completeness;
   * rendering is handled by the styled `Divider` layer.
   */
  label?: string;

  /**
   * Child content. Declared for interface extensibility;
   * the headless primitive itself is a void/leaf element.
   */
  children?: React.ReactNode;
}
