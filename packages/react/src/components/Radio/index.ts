/**
 * Material Design 3 Radio Component Exports
 *
 * Three-layer architecture:
 * - Layer 1: React Aria Foundation (useRadio, useRadioGroup)
 * - Layer 2: Headless Primitives (RadioHeadless, RadioGroupHeadless)
 * - Layer 3: Styled Components (Radio, RadioGroup)
 */

// Styled components (Layer 3) - Most users will use these
export { Radio } from "./Radio";
export { RadioGroup } from "./RadioGroup";

// Headless components (Layer 2) - For advanced customization
export { RadioHeadless } from "./RadioHeadless";
export { RadioGroupHeadless } from "./RadioGroupHeadless";

// Context for advanced use cases
export { RadioGroupContext } from "./RadioGroupHeadless";

// Types
export type {
  RadioProps,
  RadioGroupProps,
  RadioHeadlessProps,
  RadioGroupHeadlessProps,
} from "./Radio.types";

// Variants (for external customization if needed)
export type {
  RadioVariants,
  RadioGroupVariants,
  RadioContainerVariants,
  RadioIconOuterVariants,
  RadioIconInnerVariants,
  RadioLabelVariants,
  RadioGroupLabelVariants,
} from "./Radio.variants";
