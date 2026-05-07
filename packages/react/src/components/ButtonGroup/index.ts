// Layer 3: MD3 Styled Component (most users use this)
export { ButtonGroup } from "./ButtonGroup";

// Layer 2: Headless Component (for advanced customization)
export { ButtonGroupHeadless } from "./ButtonGroupHeadless";

// CVA Variants
export { buttonGroupVariants, type ButtonGroupVariants } from "./ButtonGroup.variants";

// Context + hook (for child button components)
export { ButtonGroupContext, ButtonGroupProvider, useButtonGroup } from "./ButtonGroupContext";
export type { ButtonGroupProviderProps } from "./ButtonGroupContext";

// Types
export type {
  ButtonGroupProps,
  ButtonGroupVariant,
  ButtonGroupSize,
  ButtonGroupShape,
  ButtonGroupSelectionMode,
  ButtonGroupContextValue,
} from "./ButtonGroup.types";
