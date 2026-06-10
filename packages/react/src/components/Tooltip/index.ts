// Layer 3: MD3 Styled Components (most users use these)
export { TooltipTrigger } from "./TooltipTrigger";
export type { TooltipTriggerStyledProps } from "./TooltipTrigger";
export { Tooltip } from "./Tooltip";
export { RichTooltip } from "./RichTooltip";

// Layer 2: Headless Primitives (for advanced customization)
export { TooltipTriggerHeadless, TooltipOverlayHeadless } from "./TooltipHeadless";

// CVA Variants — containers
export {
  tooltipVariants,
  richTooltipVariants,
  type TooltipVariants,
  type RichTooltipVariants,
} from "./Tooltip.variants";

// CVA Variants — rich tooltip slots
export {
  richTooltipTitleVariants,
  richTooltipSupportingTextVariants,
  richTooltipActionsVariants,
  type RichTooltipTitleVariants,
  type RichTooltipSupportingTextVariants,
  type RichTooltipActionsVariants,
  type TooltipAnimationState,
} from "./Tooltip.variants";

// Types
export type {
  TooltipVariant,
  TooltipPlacement,
  TooltipTriggerProps,
  TooltipProps,
  RichTooltipProps,
  TooltipHeadlessProps,
} from "./Tooltip.types";
