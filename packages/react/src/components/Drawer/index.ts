// Layer 3: MD3 Styled Components (most users use these)
export { Drawer } from "./Drawer";
export { DrawerItem } from "./DrawerItem";
export { DrawerSection } from "./DrawerSection";
export { DrawerHeadline } from "./DrawerHeadline";

// Layer 2: Headless Primitives (for advanced customization)
export { HeadlessDrawer, HeadlessDrawerItem, DrawerContext } from "./DrawerHeadless";

// CVA Variants
export {
  drawerVariants,
  drawerItemVariants,
  drawerItemActiveIndicatorVariants,
  drawerItemStateLayerVariants,
  drawerItemFocusRingVariants,
  drawerItemIconVariants,
  drawerItemLabelVariants,
  drawerItemBadgeVariants,
  drawerHeadlineVariants,
  scrimVariants,
  drawerSectionVariants,
  drawerSectionHeaderVariants,
  drawerDividerVariants,
  type DrawerVariants,
  type DrawerItemVariants,
  type DrawerItemActiveIndicatorVariants,
  type DrawerItemStateLayerVariants,
  type DrawerItemFocusRingVariants,
  type DrawerItemIconVariants,
  type DrawerItemLabelVariants,
  type DrawerItemBadgeVariants,
  type DrawerHeadlineVariants,
  type ScrimVariants,
  type DrawerSectionVariants,
} from "./Drawer.variants";

// Types
export type {
  DrawerVariant,
  DrawerProps,
  DrawerItemProps,
  DrawerHeadlineProps,
  DrawerSectionProps,
  HeadlessDrawerProps,
  HeadlessDrawerItemProps,
  DrawerContextValue,
} from "./Drawer.types";
