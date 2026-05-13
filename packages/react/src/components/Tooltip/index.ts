// Layer 3: MD3 Styled Components (most users use these)
export { TooltipTrigger } from "./TooltipTrigger";
export { Tooltip } from "./Tooltip";
export { RichTooltip } from "./RichTooltip";

// Layer 2: Headless Primitives (for advanced customization)
export { TooltipTriggerHeadless, TooltipOverlayHeadless } from "./TooltipHeadless";

// CVA Variants
export { tooltipVariants, richTooltipVariants, type TooltipVariants } from "./Tooltip.variants";

// Types
export type {
  TooltipVariant,
  TooltipPlacement,
  TooltipTriggerProps,
  TooltipProps,
  RichTooltipProps,
  TooltipHeadlessProps,
} from "./Tooltip.types";
