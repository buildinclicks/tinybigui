import type React from "react";
import type { AriaProgressBarProps } from "react-aria";

/**
 * Material Design 3 Progress Indicator Component Props
 *
 * Built on React Aria for world-class accessibility.
 * Supports four variants: Linear Determinate, Linear Indeterminate,
 * Circular Determinate, and Circular Indeterminate.
 * Implementation uses CVA + Tailwind CSS classes mapped to MD3 tokens.
 *
 * @example
 * ```tsx
 * // Linear determinate
 * <Progress type="linear" value={60} label="Loading" />
 *
 * // Linear indeterminate
 * <Progress type="linear" indeterminate aria-label="Loading content" />
 *
 * // Circular determinate
 * <Progress type="circular" value={75} label="Uploading" />
 *
 * // Circular indeterminate (default spinner)
 * <Progress type="circular" indeterminate aria-label="Loading" />
 *
 * // Circular with size
 * <Progress type="circular" indeterminate size="small" aria-label="Loading" />
 *
 * // Custom range
 * <Progress type="linear" minValue={0} maxValue={200} value={150} label="Progress" />
 * ```
 */
export interface ProgressProps extends AriaProgressBarProps {
  /**
   * The visual type of the progress indicator.
   * @default "linear"
   */
  type?: "linear" | "circular";

  /**
   * When true, renders indeterminate (unknown progress) animation.
   * `value` is ignored when indeterminate is true.
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Size of the circular progress indicator (ignored for linear).
   * small=24dp, medium=48dp (default), large=64dp per MD3 spec.
   * @default "medium"
   */
  size?: "small" | "medium" | "large";

  /**
   * Additional CSS classes (Tailwind).
   */
  className?: string;
}

/**
 * Props for the headless Progress component.
 * Provides behavior and accessibility only — bring your own styles.
 *
 * @example
 * ```tsx
 * <ProgressHeadless
 *   type="linear"
 *   value={50}
 *   label="Upload"
 *   renderProgress={({ percentage }) => (
 *     <div style={{ width: `${percentage}%` }} />
 *   )}
 * />
 * ```
 */
export interface ProgressHeadlessProps extends AriaProgressBarProps {
  /**
   * The visual type of the progress indicator.
   * @default "linear"
   */
  type?: "linear" | "circular";

  /**
   * When true, renders indeterminate animation.
   * @default false
   */
  indeterminate?: boolean;

  /**
   * Size for circular variant.
   * @default "medium"
   */
  size?: "small" | "medium" | "large";

  /**
   * Additional CSS classes.
   */
  className?: string;

  /**
   * Children rendered inside the container.
   */
  children?: React.ReactNode;

  /**
   * Render prop for custom progress visual.
   * Receives computed state for building custom visuals.
   */
  renderProgress?: (state: {
    percentage: number;
    isIndeterminate: boolean;
    type: "linear" | "circular";
    size: "small" | "medium" | "large";
  }) => React.ReactNode;
}
