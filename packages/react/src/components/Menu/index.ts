// ─── Layer 3: MD3 Styled Components (most users use these) ───────────────────
export { MenuTrigger, Menu } from "./Menu";
export { MenuItem } from "./MenuItem";
export { MenuSection } from "./MenuSection";
export { MenuDivider } from "./MenuDivider";
export { MenuGap } from "./MenuGap";
export { SubmenuTrigger } from "./SubmenuTrigger";
export { ContextMenuTrigger } from "./ContextMenuTrigger";

// ─── Layer 2: Headless Primitives (for advanced customization) ────────────────
export {
  HeadlessMenuTrigger,
  HeadlessMenu,
  HeadlessMenuItem,
  HeadlessMenuSection,
  HeadlessMenuDivider,
  HeadlessSubmenuTrigger,
  HeadlessContextMenuTrigger,
  MenuContext,
  useMenuContext,
} from "./MenuHeadless";

// ─── CVA Variants ─────────────────────────────────────────────────────────────
export {
  menuContainerVariants,
  menuPopoverVariants,
  menuItemVariants,
  menuItemHighlightVariants,
  menuItemStateLayerVariants,
  menuItemFocusRingVariants,
  menuItemIconVariants,
  menuSectionVariants,
  menuSectionHeaderVariants,
  menuDividerVariants,
  menuGapVariants,
  menuItemTrailingTextVariants,
  menuItemDescriptionVariants,
  type MenuContainerVariants,
  type MenuPopoverVariants,
  type MenuItemVariants,
  type MenuItemHighlightVariants,
  type MenuItemStateLayerVariants,
  type MenuItemFocusRingVariants,
  type MenuItemIconVariants,
  type MenuSectionVariants,
  type MenuSectionHeaderVariants,
  type MenuItemTrailingTextVariants,
  type MenuItemDescriptionVariants,
} from "./Menu.variants";

// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  MenuColorScheme,
  MenuStyle,
  MenuDensity,
  MenuProps,
  MenuTriggerProps,
  MenuItemProps,
  MenuSectionProps,
  MenuDividerProps,
  MenuGapProps,
  SubmenuTriggerProps,
  ContextMenuTriggerProps,
  HeadlessMenuProps,
  HeadlessMenuTriggerProps,
  HeadlessMenuItemProps,
  HeadlessMenuSectionProps,
  HeadlessSubmenuTriggerProps,
  HeadlessContextMenuTriggerProps,
  MenuContextValue,
} from "./Menu.types";
