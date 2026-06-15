import type { ReactNode, Key } from "react";
import type { AriaMenuProps, AriaMenuTriggerProps } from "react-aria";
import type { MenuItemProps as RACMenuItemProps } from "react-aria-components";
import type { SelectionMode } from "react-stately";

// ─── Color, Style, and Density Types ─────────────────────────────────────────

/**
 * Color scheme for the MD3 Menu container and items.
 *
 * - `standard` — surface-based colors; default for most use cases
 * - `vibrant` — tertiary-based colors; higher visual emphasis; use sparingly
 *
 * @see https://m3.material.io/components/menus/specs#color
 */
export type MenuColorScheme = "standard" | "vibrant";

/**
 * Visual style of the MD3 Menu.
 *
 * - `baseline` — original M3 design; 4dp corner radius; surface container background
 * - `vertical` — M3 Expressive style; 16dp corner radius; more expressive shapes and motion
 *
 * @see https://m3.material.io/components/menus/specs#variants
 */
export type MenuStyle = "baseline" | "vertical";

/**
 * Density level for the MD3 Menu (web only).
 *
 * Controls item height via top/bottom padding reduction:
 * - `0`  → 48dp (default)
 * - `-1` → 44dp
 * - `-2` → 40dp
 * - `-3` → 36dp
 *
 * @see https://m3.material.io/m3/pages/understanding-layout/density
 */
export type MenuDensity = 0 | -1 | -2 | -3;

// ─── MenuTrigger ─────────────────────────────────────────────────────────────

/**
 * Props for the `MenuTrigger` component (styled Layer 3).
 *
 * Wraps a trigger element and a `Menu`. The first child must be the trigger;
 * the second must be a `Menu` component.
 *
 * @example
 * ```tsx
 * <MenuTrigger>
 *   <Button>Open</Button>
 *   <Menu aria-label="Actions">
 *     <MenuItem id="copy">Copy</MenuItem>
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
  /**
   * Whether the menu should automatically flip to the opposite side when it
   * would be cut off by the viewport edge.
   * @default true
   */
  shouldFlip?: boolean;
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
   * Color scheme — standard (surface-based) or vibrant (tertiary-based).
   * Vibrant is more prominent and should be used sparingly.
   * @default 'standard'
   */
  colorScheme?: MenuColorScheme;
  /**
   * Visual style — baseline (4dp corners) or vertical (16dp corners, expressive).
   * @default 'baseline'
   */
  menuStyle?: MenuStyle;
  /**
   * Density level controlling item height (web only).
   * 0 = 48dp, -1 = 44dp, -2 = 40dp, -3 = 36dp.
   * @default 0
   */
  density?: MenuDensity;
  /** Additional CSS classes merged onto the menu container element. */
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
 * A single interactive item within a Menu. Supports leading/trailing icons,
 * keyboard shortcut labels, supporting text (description), and a badge slot.
 *
 * @example
 * ```tsx
 * // With leading icon and keyboard shortcut
 * <MenuItem id="copy" leadingIcon={<CopyIcon />} trailingText="⌘C">
 *   Copy
 * </MenuItem>
 *
 * // With description
 * <MenuItem id="export" description="Export to various formats">
 *   Export
 * </MenuItem>
 *
 * // Disabled
 * <MenuItem id="paste" isDisabled>Paste</MenuItem>
 * ```
 */
export interface MenuItemProps extends RACMenuItemProps {
  /** Item label content. */
  children?: ReactNode;
  /**
   * Optional leading icon element (24×24dp).
   * Rendered with `text-on-surface-variant`.
   */
  leadingIcon?: ReactNode;
  /**
   * Optional trailing icon element (24×24dp).
   * Rendered with `text-on-surface-variant`.
   * Mutually exclusive with `trailingText`.
   */
  trailingIcon?: ReactNode;
  /**
   * Optional keyboard-shortcut label at the trailing end (e.g. `"⌘C"`, `"Ctrl+V"`).
   * Screen readers announce this via `aria-keyshortcuts`.
   * Mutually exclusive with `trailingIcon`.
   */
  trailingText?: string;
  /**
   * Optional supporting text (description) rendered below the label.
   * Uses `text-body-medium text-on-surface-variant`.
   * When present, item height becomes auto (multi-line).
   *
   * @see https://m3.material.io/components/menus/specs - Anatomy item 8
   */
  description?: ReactNode;
  /**
   * Optional badge element rendered between the label and trailing content.
   *
   * @see https://m3.material.io/components/menus/specs - Anatomy item 5
   */
  badge?: ReactNode;
  /** Additional CSS classes merged onto the item element. */
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
 * Groups related `MenuItem` elements with an optional section header and
 * an optional top divider.
 *
 * @example
 * ```tsx
 * <MenuSection header="Clipboard" showDivider>
 *   <MenuItem id="cut">Cut</MenuItem>
 *   <MenuItem id="copy">Copy</MenuItem>
 * </MenuSection>
 * ```
 */
/**
 * Base props shared by both `MenuSection` variants.
 */
interface MenuSectionBaseProps {
  /** Section content — typically `MenuItem` elements. */
  children: ReactNode;
  /**
   * When `true`, renders a horizontal divider above the section.
   * @default false
   */
  showDivider?: boolean;
  /** Additional CSS classes. */
  className?: string;
}

/**
 * Props for the `MenuSection` component (styled Layer 3).
 *
 * Either `header` or `aria-label` must be provided so the section has an
 * accessible name, as required by WCAG 2.1 (ARIA `group` role).
 *
 * @example
 * ```tsx
 * <MenuSection header="Clipboard" showDivider>
 *   <MenuItem id="cut">Cut</MenuItem>
 *   <MenuItem id="copy">Copy</MenuItem>
 * </MenuSection>
 * ```
 */
export type MenuSectionProps =
  | (MenuSectionBaseProps & {
      /**
       * Section header label (rendered visually and used as the accessible name).
       * Uses `text-title-small text-on-surface-variant`.
       */
      header: string;
      "aria-label"?: string;
    })
  | (MenuSectionBaseProps & {
      header?: string;
      /**
       * Accessible label for the section. Required when `header` is not provided.
       */
      "aria-label": string;
    });

// ─── MenuDivider ─────────────────────────────────────────────────────────────

/**
 * Props for the standalone `MenuDivider` component.
 *
 * Renders a semantic `role="separator"` with `border-outline-variant` styling.
 * 8dp top/bottom padding per MD3 spec.
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

// ─── MenuGap ─────────────────────────────────────────────────────────────────

/**
 * Props for the `MenuGap` component.
 *
 * A visual gap separator for M3 Expressive vertical menus. Unlike `MenuDivider`
 * (which renders a border line), `MenuGap` creates a blank spacing area between
 * item groups. Recommended over dividers for vertical menus.
 *
 * @see https://m3.material.io/components/menus/guidelines#gaps-and-dividers
 *
 * @example
 * ```tsx
 * <MenuTrigger.Menu menuStyle="vertical">
 *   <MenuItem id="copy">Copy</MenuItem>
 *   <MenuGap />
 *   <MenuItem id="paste">Paste</MenuItem>
 * </MenuTrigger.Menu>
 * ```
 */
export interface MenuGapProps {
  /** Additional CSS classes. */
  className?: string;
}

// ─── MenuItemGroup ────────────────────────────────────────────────────────────

/**
 * Props for the `MenuItemGroup` component (styled Layer 3).
 *
 * Wraps related `MenuItem` elements in a semantic `role="group"` (via
 * `HeadlessMenuSection`) and automatically inserts a 2dp MD3 Expressive gap
 * before the group so that consecutive sibling groups are visually separated.
 * The leading gap is hidden on the first group, so exactly N−1 gaps appear
 * between N groups.
 *
 * The auto-gap behaviour is active only when `menuStyle="vertical"` — in a
 * `baseline` menu the group still renders with its ARIA role, but no gap is
 * injected (a dev warning is emitted instead).
 *
 * `aria-label` is required so the group has an accessible name per WCAG 2.1
 * (ARIA `group` role requirement).
 *
 * @example
 * ```tsx
 * <MenuTrigger.Menu menuStyle="vertical" aria-label="Edit actions">
 *   <MenuItemGroup aria-label="Clipboard">
 *     <MenuItem id="cut">Cut</MenuItem>
 *     <MenuItem id="copy">Copy</MenuItem>
 *     <MenuItem id="paste">Paste</MenuItem>
 *   </MenuItemGroup>
 *   <MenuItemGroup aria-label="History">
 *     <MenuItem id="undo">Undo</MenuItem>
 *     <MenuItem id="redo">Redo</MenuItem>
 *   </MenuItemGroup>
 * </MenuTrigger.Menu>
 * ```
 */
export interface MenuItemGroupProps {
  /** Group content — typically `MenuItem` elements. */
  children: ReactNode;
  /**
   * Accessible label for the group.
   * Required so the ARIA `group` role has a visible name.
   */
  "aria-label": string;
  /** Additional CSS classes merged onto the group container element. */
  className?: string;
}

// ─── SubmenuTrigger ──────────────────────────────────────────────────────────

/**
 * Props for the `SubmenuTrigger` component (styled Layer 3).
 *
 * Wraps a `MenuItem` (trigger) and a nested `Menu` to create a submenu.
 * The submenu opens to the side with a chevron indicator on the trigger item.
 *
 * Keyboard: `ArrowRight` opens, `ArrowLeft` / `Escape` closes.
 *
 * @example
 * ```tsx
 * <SubmenuTrigger>
 *   <MenuItem id="share">Share</MenuItem>
 *   <Menu aria-label="Share via">
 *     <MenuItem id="email">Email</MenuItem>
 *     <MenuItem id="sms">SMS</MenuItem>
 *   </Menu>
 * </SubmenuTrigger>
 * ```
 */
export interface SubmenuTriggerProps {
  /** Must be a `[MenuItem, Menu]` pair. */
  children: ReactNode;
  /**
   * Hover delay in milliseconds before the submenu opens.
   * @default 200
   */
  delay?: number;
}

// ─── ContextMenuTrigger ──────────────────────────────────────────────────────

/**
 * Props for the `ContextMenuTrigger` component (styled Layer 3).
 *
 * Wraps content and opens a context menu on right-click or two-finger tap.
 * The menu is positioned at the pointer coordinates.
 *
 * @example
 * ```tsx
 * <ContextMenuTrigger>
 *   <div>Right-click me</div>
 *   <Menu aria-label="Context actions">
 *     <MenuItem id="copy">Copy</MenuItem>
 *     <MenuItem id="paste">Paste</MenuItem>
 *   </Menu>
 * </ContextMenuTrigger>
 * ```
 */
export interface ContextMenuTriggerProps {
  /** Content element + Menu children. */
  children: ReactNode;
  /** Controlled open state. */
  isOpen?: boolean;
  /** Called when open state changes. */
  onOpenChange?: (isOpen: boolean) => void;
}

// ─── Headless Types ───────────────────────────────────────────────────────────

/**
 * Props for the headless `HeadlessMenuTrigger` primitive (Layer 2).
 */
export interface HeadlessMenuTriggerProps extends AriaMenuTriggerProps {
  children: ReactNode;
  placement?: MenuTriggerProps["placement"];
  shouldFlip?: boolean;
}

/**
 * Props for the headless `HeadlessMenu` primitive (Layer 2).
 */
export interface HeadlessMenuProps<T extends object = object> extends AriaMenuProps<T> {
  className?: string;
}

/**
 * Props for the headless `HeadlessMenuItem` primitive (Layer 2).
 *
 * `className` accepts either a static string or a render-prop function so
 * MD3 state-dependent styles (selection, disabled) can be applied directly
 * to the `<li role="menuitem">` element via RAC's render-prop mechanism.
 */
// HeadlessMenuItemProps inherits children (ChildrenOrFunction) and className
// (ClassNameOrFunction) directly from RACMenuItemProps — no overrides needed.
export type HeadlessMenuItemProps = RACMenuItemProps;

/**
 * Props for the headless `HeadlessMenuSection` primitive (Layer 2).
 *
 * The section header is handled at Layer 3 (`MenuSection`) using RAC's
 * `Header` component. At Layer 2, only `aria-label` is used for accessibility.
 */
export interface HeadlessMenuSectionProps {
  children: ReactNode;
  className?: string;
  "aria-label"?: string;
}

/**
 * Props for the headless `HeadlessSubmenuTrigger` primitive (Layer 2).
 */
export interface HeadlessSubmenuTriggerProps {
  children: ReactNode;
  delay?: number;
}

/**
 * Props for the headless `HeadlessContextMenuTrigger` primitive (Layer 2).
 */
export interface HeadlessContextMenuTriggerProps {
  children: ReactNode;
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
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
  /** Color scheme — standard or vibrant. */
  colorScheme: MenuColorScheme;
  /** Visual style — baseline or vertical. */
  menuStyle: MenuStyle;
  /** Density level controlling item height. */
  density: MenuDensity;
  /** Currently selected keys (for selection menus). */
  selectedKeys?: Iterable<Key>;
  /** Current selection mode. */
  selectionMode?: SelectionMode;
}
