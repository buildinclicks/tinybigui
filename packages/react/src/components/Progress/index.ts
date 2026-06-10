/**
 * @tinybigui/react — Progress Component
 * Material Design 3 Expressive Progress Indicator with accessibility support.
 *
 * Four variants:
 *   - Linear Determinate    (two-segment gap rendering)
 *   - Linear Indeterminate
 *   - Circular Determinate  (arc gap)
 *   - Circular Indeterminate
 *
 * MD3 Expressive additions:
 *   - Colorful track: primary-container
 *   - 4dp indicator-track gap
 *   - Optional thick (8dp) track via `thickness` prop
 *   - Optional wavy shape via `shape` prop
 */

// Layer 3: MD3 Styled Component (most consumers use this)
export { Progress } from "./Progress";

// Layer 2: Headless Component (for advanced customization)
export { ProgressHeadless } from "./ProgressHeadless";

// Types
export type { ProgressProps, ProgressHeadlessProps } from "./Progress.types";

// Variants (for advanced customization)
export {
  progressContainerVariants,
  progressLabelVariants,
  progressTrackVariants,
  progressActiveIndicatorVariants,
  progressInactiveSegmentVariants,
  progressStopIndicatorVariants,
  progressCircularSizeVariants,
  // backward-compat alias
  progressIndicatorVariants,
} from "./Progress.variants";

export type {
  ProgressContainerVariants,
  ProgressLabelVariants,
  ProgressTrackVariants,
  ProgressActiveIndicatorVariants,
  ProgressInactiveSegmentVariants,
  ProgressStopIndicatorVariants,
  ProgressCircularSizeVariants,
  // backward-compat alias
  ProgressIndicatorVariants,
} from "./Progress.variants";
