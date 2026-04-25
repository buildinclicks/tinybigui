// Layer 3: MD3 Styled Components (most users use these)
export { NavigationBar } from "./NavigationBar";
export { NavigationBarItem } from "./NavigationBarItem";

// Layer 2: Headless Components (for advanced customization)
export {
  HeadlessNavigationBar,
  HeadlessNavigationBarItem,
  NavigationBarContext,
  type NavigationBarContextValue,
} from "./NavigationBarHeadless";

// CVA Variants (for external customization)
export {
  navigationBarVariants,
  navigationBarItemVariants,
  indicatorPillVariants,
  badgeVariants,
  iconWrapperVariants,
  labelVariants,
  type NavigationBarVariants,
  type NavigationBarItemVariants,
  type IndicatorPillVariants,
  type BadgeVariants,
} from "./NavigationBar.variants";

// Types
export type {
  NavigationBarBadge,
  NavigationBarItemConfig,
  NavigationBarProps,
  NavigationBarItemProps,
  HeadlessNavigationBarProps,
  HeadlessNavigationBarItemProps,
  NavigationBarItemRenderProps,
} from "./NavigationBar.types";
