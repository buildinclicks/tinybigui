// Layer 3: MD3 Styled Component (most users use this)
export { AppBar } from "./AppBar";

// Layer 2: Headless Component (for advanced customization)
export { AppBarHeadless } from "./AppBarHeadless";

// CVA Slot Variants
export {
  appBarVariants,
  appBarTopRowVariants,
  appBarLeadingVariants,
  appBarHeadlineBlockVariants,
  appBarTitleVariants,
  appBarSubtitleVariants,
  appBarTrailingVariants,
  appBarExpandedTitleVariants,
  type AppBarVariants,
  type AppBarTopRowVariants,
  type AppBarHeadlineBlockVariants,
  type AppBarTitleVariants,
  type AppBarSubtitleVariants,
} from "./AppBar.variants";

// Types
export type { AppBarProps, AppBarHeadlessProps, AppBarVariant } from "./AppBar.types";
