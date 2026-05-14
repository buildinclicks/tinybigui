// Layer 3: MD3 Styled Components (most users use this)
export { List } from "./List";
export { ListItem } from "./ListItem";
export { ListItemLeading } from "./ListItemLeading";
export { ListItemTrailing } from "./ListItemTrailing";
export { ListItemText } from "./ListItemText";

// Layer 2: Headless Primitives (for advanced customization)
export { ListHeadless, ListItemHeadless } from "./ListHeadless";

// CVA Variants
export {
  listVariants,
  listItemVariants,
  type ListVariants,
  type ListItemVariants,
} from "./List.variants";

// Types
export type {
  ListDensity,
  ListLeadingType,
  ListTrailingType,
  ListProps,
  ListItemProps,
  ListItemLeadingProps,
  ListItemTrailingProps,
  ListItemTextProps,
  ListHeadlessProps,
} from "./List.types";
