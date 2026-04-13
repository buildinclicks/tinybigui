/**
 * TextField Component Exports
 *
 * Barrel exports for the TextField component and related types.
 */

// Layer 3: MD3 Styled Component (most users use this)
export { TextField } from "./TextField";

// Layer 2: Headless Component (for advanced customization)
export { TextFieldHeadless } from "./TextFieldHeadless";

// CVA Variants
export {
  textFieldContainerVariants,
  textFieldWrapperVariants,
  textFieldInputVariants,
  textFieldLabelVariants,
  textFieldIconVariants,
  textFieldHelperTextVariants,
  textFieldCharacterCountVariants,
} from "./TextField.variants";

export type {
  TextFieldContainerVariants,
  TextFieldWrapperVariants,
  TextFieldInputVariants,
  TextFieldLabelVariants,
  TextFieldIconVariants,
  TextFieldHelperTextVariants,
  TextFieldCharacterCountVariants,
} from "./TextField.variants";

// Types
export type {
  TextFieldProps,
  TextFieldHeadlessProps,
  TextFieldRenderProps,
  TextFieldVariant,
  TextFieldSize,
} from "./TextField.types";
