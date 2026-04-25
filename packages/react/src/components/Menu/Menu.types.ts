import type { ReactNode, Key } from "react";
import type { AriaMenuProps, AriaMenuItemProps, AriaMenuTriggerProps } from "react-aria";
import type { SelectionMode } from "react-stately";

/**
 * Visual variant of the MD3 Menu.
 *
 * - `standard` — contextual action menu; items fire `onAction` callbacks; no
 *   persistent selection state.
 * - `select` — selection menu; items show a checkmark when selected; supports
 *   `selectionMode` of `"single"` or `"multiple"`.
 */
export type MenuVariant = "standard" | "select";

// ─── MenuTrigger ─────────────────────────────────────────────────────────────

/**
 * Props for the `MenuTrigger` component (styled Layer 3).
 *
 * Wraps a trigger element (e.g. `Button`, `IconButton`) and a `Menu`. The
 * first child must be the trigger; the second must be the `Menu`.
 *
 * @example
 * ```tsx
 * <MenuTrigger>
 *   <Button>Open</Button>
 *   <Menu aria-label="Actions">
 *     <MenuItem id="copy" onAction={() => {}}>Copy</MenuItem>
 *   </Menu>
 * </MenuTrigger>
 * ```
 */
export interface MenuTriggerProps extends AriaMenuTriggerProps {
  /** Trigger element + Menu children. */
  children: ReactNode;
  /**
   * Preferred placement of the menu relative to the trigger.
   * @default 'bottom start'
   */
  placement?: "bottom" | "bottom start" | "bottom end" | "top" | "top start" | "top end";
}

// ─── Menu ────────────────────────────────────────────────────────────────────

/**
 * Props for the `Menu` component (styled Layer 3).
 *
 * @example
 * ```tsx
 * <Menu aria-label="Edit">
 *   <MenuItem id="cut">Cut</MenuItem>
 *   <MenuItem id="copy">Copy</MenuItem>
 *   <MenuItem id="paste">Paste</MenuItem>
 * </Menu>
 * ```
 */
export interface MenuProps<T extends object = object> extends AriaMenuProps<T> {
  /**
   * Visual variant — standard (action) or select (selection with checkmark).
   * @default 'standard'
   */
  variant?: MenuVariant;
  /**
   * Additional CSS classes merged onto the menu container element.
   */
  className?: string;
  /**
   * Disable ripple on all menu items.
   * @default false
   */
  disableRipple?: boolean;
}

// ─── MenuItem ────────────────────────────────────────────────────────────────

/**
 * Props for the `MenuItem` component (styled Layer 3).
 *
 * A single interactive menu item with optional leading icon, trailing icon /
 * keyboard-shortcut label, and disabled state.
 *
 * @example
 * ```tsx
 * // With leading icon and keyboard shortcut
 * <MenuItem id="copy" leadingIcon={<CopyIcon />} trailingText="⌘C">
 *   Copy
 * </MenuItem>
 *
 * // Disabled
 * <MenuItem id="paste" isDisabled>Paste</MenuItem>
 * ```
 */
export interface MenuItemProps extends AriaMenuItemProps {
  /**
   * Item label content.
   */
  children?: ReactNode;
  /**
   * Optional leading icon element (24dp). Rendered with
   * `text-on-surface-variant`.
   */
  leadingIcon?: ReactNode;
  /**
   * Optional trailing icon element (24dp). Rendered with
   * `text-on-surface-variant`. Mutually exclusive with `trailingText`.
   */
  trailingIcon?: ReactNode;
  /**
   * Optional keyboard-shortcut label rendered at the trailing end of the item
   * (e.g. `"⌘C"`, `"Ctrl+V"`). Mutually exclusive with `trailingIcon`.
   */
  trailingText?: string;
  /**
   * Additional CSS classes merged onto the item element.
   */
  className?: string;
  /**
   * Disable the ripple effect on this specific item.
   * @default false
   */
  disableRipple?: boolean;
}

// ─── MenuSection ─────────────────────────────────────────────────────────────

/**
 * Props for the `MenuSection` component (styled Layer 3).
 *
 * Groups related `MenuItem` elements with an optional section header label
 * and a horizontal divider above the group (rendered for all sections except
 * the first when `showDivider` is true).
 *
 * @example
 * ```tsx
 * <MenuSection header="Clipboard" showDivider>
 *   <MenuItem id="cut">Cut</MenuItem>
 *   <MenuItem id="copy">Copy</MenuItem>
 * </MenuSection>
 * ```
 */
export interface MenuSectionProps {
  /**
   * Optional section header label rendered in `text-title-small
   * text-on-surface-variant`.
   */
  header?: string;
  /** Section content — typically `MenuItem` elements. */
  children: ReactNode;
  /**
   * When `true`, renders a horizontal divider above the section.
   * @default false
   */
  showDivider?: boolean;
  /**
   * Additional CSS classes merged onto the section container element.
   */
  className?: string;
  /**
   * Accessible label for the section. Required when `header` is not provided.
   */
  "aria-label"?: string;
}

// ─── MenuDivider ─────────────────────────────────────────────────────────────

/**
 * Props for the standalone `MenuDivider` component.
 *
 * Renders a semantic separator styled with `border-outline-variant`.
 *
 * @example
 * ```tsx
 * <MenuItem id="cut">Cut</MenuItem>
 * <MenuDivider />
 * <MenuItem id="select-all">Select all</MenuItem>
 * ```
 */
export interface MenuDividerProps {
  /** Additional CSS classes merged onto the separator element. */
  className?: string;
}

// ─── Headless types ───────────────────────────────────────────────────────────

/**
 * Props for the headless `HeadlessMenuTrigger` primitive (Layer 2).
 * Provides trigger + overlay behavior without visual styling.
 */
export interface HeadlessMenuTriggerProps extends AriaMenuTriggerProps {
  /** Trigger element + HeadlessMenu children. */
  children: ReactNode;
  /**
   * Preferred placement of the menu relative to the trigger.
   * @default 'bottom start'
   */
  placement?: MenuTriggerProps["placement"];
}

/**
 * Props for the headless `HeadlessMenu` primitive (Layer 2).
 */
export interface HeadlessMenuProps<T extends object = object> extends AriaMenuProps<T> {
  /** Additional CSS classes for the `<ul role="menu">` element. */
  className?: string;
}

/**
 * Props for the headless `HeadlessMenuItem` primitive (Layer 2).
 */
export interface HeadlessMenuItemProps extends AriaMenuItemProps {
  /** Item content. */
  children?: ReactNode;
  /** Additional CSS classes. */
  className?: string;
}

/**
 * Props for the headless `HeadlessMenuSection` primitive (Layer 2).
 */
export interface HeadlessMenuSectionProps {
  /** Optional header label. */
  header?: string;
  /** Section items. */
  children: ReactNode;
  /** CSS class for the section group container. */
  className?: string;
  /** Accessible label for the group. Required when no header is provided. */
  "aria-label"?: string;
}

// ─── Context ──────────────────────────────────────────────────────────────────

/**
 * Context value shared between the Menu and its item descendants.
 * @internal
 */
export interface MenuContextValue {
  /** Close the menu overlay. */
  close: () => void;
  /** Whether ripple is disabled for all items. */
  disableRipple: boolean;
  /** Visual variant passed down to items (e.g. for checkmark rendering). */
  variant: MenuVariant;
  /** Currently selected keys (for select variant). */
  selectedKeys?: Iterable<Key>;
  /** Current selection mode. */
  selectionMode?: SelectionMode;
}
