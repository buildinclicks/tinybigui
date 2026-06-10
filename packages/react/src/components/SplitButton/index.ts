// ─── Layer 3: MD3 Styled Component (most users use this) ──────────────────────
export { SplitButton } from "./SplitButton";

// ─── Layer 2: Headless Primitives (for advanced customization) ────────────────
export { SplitButtonHeadless } from "./SplitButtonHeadless";

// ─── CVA Variants (slot-based) ────────────────────────────────────────────────
export {
  splitButtonVariants,
  splitButtonContainerVariants,
  splitButtonLeadingVariants,
  splitButtonTrailingVariants,
  splitButtonStateLayerVariants,
  splitButtonFocusRingVariants,
  splitButtonLabelVariants,
  splitButtonIconVariants,
  splitButtonMenuVariants,
  splitButtonMenuItemVariants,
  type SplitButtonContainerVariants,
  type SplitButtonLeadingVariants,
  type SplitButtonTrailingVariants,
  type SplitButtonStateLayerVariants,
  type SplitButtonFocusRingVariants,
  type SplitButtonIconVariants,
  type SplitButtonMenuItemVariantProps,
} from "./SplitButton.variants";

// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  SplitButtonVariant,
  SplitButtonSize,
  SplitButtonMenuItem,
  SplitButtonHeadlessProps,
  SplitButtonProps,
} from "./SplitButton.types";
