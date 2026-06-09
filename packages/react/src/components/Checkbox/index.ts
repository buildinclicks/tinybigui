// Layer 3: MD3 Styled Component (most users use this)
export { Checkbox } from "./Checkbox";

// Layer 2: Headless Component (for advanced customization)
export { CheckboxHeadless } from "./CheckboxHeadless";

// CVA Variants (slot-based, Variants-vs-States architecture)
export {
  checkboxRootVariants,
  checkboxControlVariants,
  checkboxStateLayerVariants,
  checkboxFocusRingVariants,
  checkboxBoxVariants,
  checkboxIconVariants,
  checkboxLabelVariants,
  type CheckboxRootVariants,
  type CheckboxControlVariants,
  type CheckboxStateLayerVariants,
  type CheckboxFocusRingVariants,
  type CheckboxBoxVariants,
  type CheckboxIconVariants,
  type CheckboxLabelVariants,
} from "./Checkbox.variants";

// Types
export type { CheckboxProps, CheckboxHeadlessProps } from "./Checkbox.types";
