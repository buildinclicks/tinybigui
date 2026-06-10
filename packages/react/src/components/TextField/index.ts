/**
 * TextField Component Exports
 *
 * Barrel exports for the MD3 TextField component and related types.
 */

// Layer 3: MD3 Styled Component (most users use this)
export { TextField } from "./TextField";

// Layer 2: Headless Component (for advanced customization)
export { TextFieldHeadless } from "./TextFieldHeadless";

// CVA Variants (all slots)
export {
  textFieldRootVariants,
  textFieldFieldVariants,
  textFieldStateLayerVariants,
  textFieldActiveIndicatorVariants,
  textFieldOutlineVariants,
  textFieldNotchVariants,
  textFieldLabelVariants,
  textFieldInputVariants,
  textFieldIconVariants,
  textFieldAffixVariants,
  textFieldSupportingRowVariants,
  textFieldSupportingTextVariants,
  textFieldCounterVariants,
} from "./TextField.variants";

export type {
  TextFieldRootVariants,
  TextFieldFieldVariants,
  TextFieldLabelVariants,
  TextFieldInputVariants,
  TextFieldIconVariants,
  TextFieldSupportingTextVariants,
  TextFieldCounterVariants,
} from "./TextField.variants";

// Types
export type {
  TextFieldProps,
  TextFieldHeadlessProps,
  TextFieldRenderProps,
  TextFieldVariant,
} from "./TextField.types";
