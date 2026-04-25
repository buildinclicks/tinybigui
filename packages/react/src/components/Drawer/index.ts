// Layer 3: MD3 Styled Components (most users use these)
export { Drawer } from "./Drawer";
export { DrawerItem } from "./DrawerItem";
export { DrawerSection } from "./DrawerSection";

// Layer 2: Headless Primitives (for advanced customization)
export { HeadlessDrawer, HeadlessDrawerItem, DrawerContext } from "./DrawerHeadless";

// CVA Variants
export {
  drawerVariants,
  drawerItemVariants,
  scrimVariants,
  drawerSectionVariants,
  drawerSectionHeaderVariants,
  drawerDividerVariants,
  type DrawerVariants,
  type DrawerItemVariants,
  type ScrimVariants,
  type DrawerSectionVariants,
} from "./Drawer.variants";

// Types
export type {
  DrawerVariant,
  DrawerProps,
  DrawerItemProps,
  DrawerSectionProps,
  HeadlessDrawerProps,
  HeadlessDrawerItemProps,
  DrawerContextValue,
} from "./Drawer.types";
