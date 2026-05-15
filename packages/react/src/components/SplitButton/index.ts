// ─── Layer 3: MD3 Styled Component (most users use this) ──────────────────────
export { SplitButton } from "./SplitButton";

// ─── Layer 2: Headless Primitives (for advanced customization) ────────────────
export { SplitButtonHeadless } from "./SplitButtonHeadless";

// ─── CVA Variants ─────────────────────────────────────────────────────────────
export {
  splitButtonVariants,
  splitButtonContainerVariants,
  splitButtonPrimaryVariants,
  splitButtonDropdownVariants,
  type SplitButtonContainerVariants,
  type SplitButtonPrimaryVariants,
  type SplitButtonDropdownVariants,
} from "./SplitButton.variants";

// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  SplitButtonVariant,
  SplitButtonSize,
  SplitButtonMenuItem,
  SplitButtonHeadlessProps,
  SplitButtonProps,
} from "./SplitButton.types";
