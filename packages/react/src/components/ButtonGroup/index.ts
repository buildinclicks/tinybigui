// Layer 3: MD3 Styled Component (most users use this)
export { ButtonGroup } from "./ButtonGroup";

// Layer 2: Headless Component (for advanced customization)
export { ButtonGroupHeadless } from "./ButtonGroupHeadless";

// CVA Variants (slot-based naming)
export {
  buttonGroupRootVariants,
  buttonGroupFocusRingVariants,
  type ButtonGroupRootVariants,
  type ButtonGroupFocusRingVariants,
} from "./ButtonGroup.variants";

// CVA Variants (backward compat — deprecated)
export { buttonGroupVariants, type ButtonGroupVariants } from "./ButtonGroup.variants";

// Context + hooks (for child button components)
export {
  ButtonGroupContext,
  ButtonGroupProvider,
  useButtonGroup,
  useOptionalButtonGroup,
} from "./ButtonGroupContext";
export type { ButtonGroupProviderProps } from "./ButtonGroupContext";

// Utilities (for custom button integration)
export { getConnectedRadiusClasses, getInnerRadius, getOuterRadius } from "./ButtonGroup.utils";

// Types
export type {
  ButtonGroupProps,
  ButtonGroupVariant,
  ButtonGroupSize,
  ButtonGroupShape,
  ButtonGroupSelectionMode,
  ButtonGroupContextValue,
} from "./ButtonGroup.types";
