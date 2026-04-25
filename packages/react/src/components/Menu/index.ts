// Layer 3: MD3 Styled Components (most users use these)
export { MenuTrigger, Menu } from "./Menu";
export { MenuItem } from "./MenuItem";
export { MenuSection } from "./MenuSection";
export { MenuDivider } from "./MenuDivider";

// Layer 2: Headless Primitives (for advanced customization)
export {
  HeadlessMenuTrigger,
  HeadlessMenu,
  HeadlessMenuItem,
  HeadlessMenuSection,
  HeadlessMenuDivider,
  MenuContext,
  useMenuContext,
} from "./MenuHeadless";

// CVA Variants
export {
  menuContainerVariants,
  menuItemVariants,
  menuSectionVariants,
  menuSectionHeaderVariants,
  menuDividerVariants,
  menuItemTrailingTextVariants,
  type MenuContainerVariants,
  type MenuItemVariants,
  type MenuSectionVariants,
} from "./Menu.variants";

// Types
export type {
  MenuVariant,
  MenuProps,
  MenuTriggerProps,
  MenuItemProps,
  MenuSectionProps,
  MenuDividerProps,
  HeadlessMenuProps,
  HeadlessMenuTriggerProps,
  HeadlessMenuItemProps,
  HeadlessMenuSectionProps,
  MenuContextValue,
} from "./Menu.types";
