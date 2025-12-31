// Layer 3: MD3 Styled Component (most users use this)
export { Button } from "./Button";

// Layer 2: Headless Component (for advanced customization)
export { ButtonHeadless } from "./ButtonHeadless";

// CVA Variants
export { buttonVariants, type ButtonVariants } from "./Button.variants";

// Types
export type {
  ButtonProps,
  ButtonHeadlessProps,
  ButtonVariant,
  ButtonColor,
  ButtonSize,
} from "./Button.types";
