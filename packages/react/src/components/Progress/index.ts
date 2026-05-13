/**
 * @tinybigui/react — Progress Component
 * Material Design 3 Progress Indicator with accessibility support.
 *
 * Four variants:
 *   - Linear Determinate
 *   - Linear Indeterminate
 *   - Circular Determinate
 *   - Circular Indeterminate
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
  progressTrackVariants,
  progressIndicatorVariants,
  progressStopIndicatorVariants,
  progressCircularSizeVariants,
  progressLabelVariants,
} from "./Progress.variants";
export type {
  ProgressContainerVariants,
  ProgressTrackVariants,
  ProgressIndicatorVariants,
  ProgressCircularSizeVariants,
  ProgressLabelVariants,
} from "./Progress.variants";
