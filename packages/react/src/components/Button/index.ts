// Layer 3: MD3 Styled Component (most users use this)
export { Button } from "./Button";

// Layer 2: Headless Component (for advanced customization)
export { ButtonHeadless } from "./ButtonHeadless";

// CVA Variants (for advanced customization)
export {
  buttonVariants,
  buttonStateLayerVariants,
  buttonFocusRingVariants,
  buttonIconVariants,
  buttonLabelVariants,
  type ButtonVariants,
  type ButtonStateLayerVariants,
  type ButtonIconVariants,
  type ButtonLabelVariants,
} from "./Button.variants";

// Types
export type { ButtonProps, ButtonHeadlessProps, ButtonVariant, ButtonSize } from "./Button.types";
