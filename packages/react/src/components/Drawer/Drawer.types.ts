import type { ReactNode } from "react";
import type { AriaButtonProps, AriaDialogProps, AriaLinkOptions } from "react-aria";

/**
 * Structural variant of the Navigation Drawer.
 *
 * - `standard` — inline `<nav>` landmark; no overlay or focus trap; supports
 *   controlled `open` prop for collapsible layouts.
 * - `modal` — overlay dialog with scrim backdrop, slide-in animation,
 *   focus trap, and `Escape` to close.
 */
export type DrawerVariant = "standard" | "modal";

/**
 * Material Design 3 Navigation Drawer props.
 *
 * Supports two structural variants — Standard (inline, permanently visible or
 * togglable) and Modal (overlay with scrim and focus trap).
 *
 * @example
 * ```tsx
 * // Standard variant
 * <Drawer variant="standard" open={open} onOpenChange={setOpen} aria-label="App navigation">
 *   <DrawerItem label="Home" isActive />
 *   <DrawerItem label="Settings" />
 * </Drawer>
 *
 * // Modal variant with trigger
 * <Drawer variant="modal" open={open} onOpenChange={setOpen} aria-label="App navigation">
 *   <DrawerItem label="Home" isActive />
 *   <DrawerSection header="Account">
 *     <DrawerItem label="Profile" />
 *   </DrawerSection>
 * </Drawer>
 * ```
 */
export interface DrawerProps extends AriaDialogProps {
  /**
   * Structural variant — drives which React Aria hooks and DOM structure are used.
   * @default 'standard'
   */
  variant?: DrawerVariant;

  /**
   * Controlled open state. Pair with `onOpenChange`.
   */
  open?: boolean;

  /**
   * Default open state for uncontrolled usage.
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Called when the open state changes (e.g. Escape key, scrim click).
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Accessible label for the drawer landmark/dialog. Required.
   *
   * @example "App navigation"
   */
  "aria-label": string;

  /**
   * Drawer content — typically `DrawerItem` and `DrawerSection` elements.
   */
  children: ReactNode;

  /**
   * Additional CSS classes merged onto the drawer panel element.
   */
  className?: string;

  /**
   * Disable ripple effect on all items within the drawer.
   * @default false
   */
  disableRipple?: boolean;
}

/**
 * Material Design 3 Navigation Drawer Item props.
 *
 * Renders as `<a>` when `href` is provided (using `useLink`), or as `<button>`
 * when no `href` is provided (using `useButton`).
 *
 * @example
 * ```tsx
 * // Button-based item (no href)
 * <DrawerItem
 *   icon={<HomeIcon />}
 *   label="Home"
 *   isActive
 *   onPress={() => setPage('home')}
 * />
 *
 * // Link-based item (with href)
 * <DrawerItem href="/settings" icon={<SettingsIcon />} label="Settings" />
 *
 * // With badge
 * <DrawerItem label="Inbox" badge={<span>3</span>} />
 *
 * // Disabled
 * <DrawerItem label="Disabled" isDisabled />
 * ```
 */
export interface DrawerItemProps extends AriaButtonProps, Pick<AriaLinkOptions, "href"> {
  /**
   * Optional URL — when provided, renders the item as `<a>` using `useLink`.
   * When absent, renders as `<button>` using `useButton`.
   */
  href?: string;

  /**
   * Optional leading icon (24dp).
   */
  icon?: ReactNode;

  /**
   * Visible label text. Required.
   */
  label: string;

  /**
   * Optional trailing badge or secondary indicator element.
   */
  badge?: ReactNode;

  /**
   * Optional secondary descriptive text rendered below the label.
   */
  secondaryText?: string;

  /**
   * When `true`, marks this item as the active destination.
   * Applies `aria-current="page"`, active indicator background, and
   * `text-on-secondary-container`.
   * @default false
   */
  isActive?: boolean;

  /**
   * Disable ripple effect on this specific item.
   * @default false
   */
  disableRipple?: boolean;

  /**
   * Additional CSS classes merged via `cn()`.
   */
  className?: string;
}

/**
 * Material Design 3 Navigation Drawer Section props.
 *
 * Groups related `DrawerItem` elements with an optional header label and
 * a preceding divider (except the first section).
 *
 * @example
 * ```tsx
 * <DrawerSection header="Account">
 *   <DrawerItem label="Profile" />
 *   <DrawerItem label="Logout" />
 * </DrawerSection>
 * ```
 */
export interface DrawerSectionProps {
  /**
   * Optional section header label rendered in `text-title-small`.
   */
  header?: string;

  /**
   * Section content — typically `DrawerItem` elements.
   */
  children: ReactNode;

  /**
   * When `true`, renders a top divider line above the section.
   * @default false
   */
  showDivider?: boolean;

  /**
   * Additional CSS classes merged via `cn()`.
   */
  className?: string;
}

/**
 * Props for the headless Drawer primitive (Layer 2).
 * Provides behavior and ARIA semantics without visual styling.
 */
export interface HeadlessDrawerProps {
  /**
   * Structural variant — drives which React Aria hooks are used.
   * @default 'standard'
   */
  variant?: DrawerVariant;

  /**
   * Controlled open state.
   */
  open?: boolean;

  /**
   * Default open state for uncontrolled usage.
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Called when the open state changes.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Accessible label. Required.
   */
  "aria-label": string;

  /**
   * Drawer content.
   */
  children: ReactNode;

  /**
   * Additional CSS classes for the drawer panel element.
   */
  className?: string;

  /**
   * Additional CSS classes for the scrim element (modal variant only).
   */
  scrimClassName?: string;

  /**
   * Disable ripple on all items.
   * @default false
   */
  disableRipple?: boolean;
}

/**
 * Props for the headless DrawerItem primitive (Layer 2).
 */
export interface HeadlessDrawerItemProps extends AriaButtonProps, Pick<AriaLinkOptions, "href"> {
  /**
   * Optional URL — determines `<a>` vs `<button>` rendering.
   */
  href?: string;

  /**
   * Whether this item is active (`aria-current="page"`).
   * @default false
   */
  isActive?: boolean;

  /**
   * Item content.
   */
  children: ReactNode;

  /**
   * Additional CSS classes.
   */
  className?: string;

  /**
   * Mouse down handler (for ripple effect).
   */
  onMouseDown?: (e: React.MouseEvent<HTMLElement>) => void;
}

/**
 * Context value shared between HeadlessDrawer and its children.
 * @internal
 */
export interface DrawerContextValue {
  /** Whether the drawer is currently open. */
  isOpen: boolean;
  /** Callback to close the drawer. */
  close: () => void;
  /** Whether ripple is disabled for all items. */
  disableRipple: boolean;
}
