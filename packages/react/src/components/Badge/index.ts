// Layer 3: MD3 Styled Component (most users use this)
export { Badge } from "./Badge";

// Layer 2: Headless Component (for advanced customization)
export { BadgeHeadless } from "./BadgeHeadless";

// Sub-component
export { BadgeContent } from "./BadgeContent";

// CVA Variants
export {
  badgeVariants,
  badgeStaticVariants,
  type BadgeVariants,
  type BadgeStaticVariants,
} from "./Badge.variants";

// Types
export type { BadgeProps, BadgeHeadlessProps, BadgeContentProps } from "./Badge.types";
