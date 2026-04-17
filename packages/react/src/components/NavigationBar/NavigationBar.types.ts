import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { Key } from "react-aria";

/**
 * Badge value for a NavigationBarItem.
 *
 * - `true` — renders a dot indicator (no count)
 * - `number` — renders the count; 0 hides the badge; values > 999 display "999+"
 */
export type NavigationBarBadge = number | true;

/**
 * Configuration for a single NavigationBar destination item.
 *
 * @example
 * ```tsx
 * const item: NavigationBarItemConfig = {
 *   key: 'home',
 *   icon: <HomeIcon />,
 *   label: 'Home',
 *   badge: 3,
 * };
 * ```
 */
export interface NavigationBarItemConfig {
  /**
   * Unique identifier for this destination (used as the selection key).
   */
  key: string;

  /**
   * Icon element displayed at 24dp. Always visible regardless of `hideLabels`.
   */
  icon: ReactNode;

  /**
   * Visible label beneath the icon.
   * Required unless `aria-label` is provided (icon-only mode with `hideLabels`).
   */
  label?: string;

  /**
   * Badge displayed on the icon.
   * - `true` renders a dot indicator.
   * - `0` hides the badge.
   * - `1–999` renders the count.
   * - `> 999` renders "999+".
   */
  badge?: NavigationBarBadge;

  /**
   * When `true`, the item cannot be focused or activated.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Accessible name used when labels are hidden (`hideLabels` mode).
   * Required for icon-only items; enforced at runtime via dev warning.
   */
  "aria-label"?: string;
}

/**
 * Material Design 3 Navigation Bar (Bottom Navigation) props.
 *
 * Accepts 3–5 destination items. Item count outside this range triggers a
 * dev-only `console.warn`.
 *
 * **Controlled usage:**
 * ```tsx
 * <NavigationBar
 *   items={items}
 *   activeKey={activeKey}
 *   onActiveChange={setActiveKey}
 *   aria-label="Main navigation"
 * />
 * ```
 *
 * **Uncontrolled usage:**
 * ```tsx
 * <NavigationBar
 *   items={items}
 *   defaultActiveKey="home"
 *   aria-label="Main navigation"
 * />
 * ```
 *
 * @see https://m3.material.io/components/navigation-bar/overview
 */
export interface NavigationBarProps {
  /**
   * Array of 3–5 destination items.
   * Item count outside the 3–5 range triggers a dev warning.
   */
  items: NavigationBarItemConfig[];

  /**
   * Controlled active key. Pair with `onActiveChange`.
   * Use `null` to explicitly deselect all items.
   */
  activeKey?: Key | null;

  /**
   * Default active key for uncontrolled usage.
   */
  defaultActiveKey?: Key;

  /**
   * Called when the active destination changes.
   */
  onActiveChange?: (key: Key) => void;

  /**
   * When `true`, hides labels on all items (icon-only mode).
   * @default false
   */
  hideLabels?: boolean;

  /**
   * Accessible label for the `<nav>` landmark element. Required.
   *
   * @example "Main navigation"
   */
  "aria-label": string;

  /**
   * Disable ripple effect on all items.
   * @default false
   */
  disableRipple?: boolean;

  /**
   * Additional CSS classes merged onto the `<nav>` element via `cn()`.
   */
  className?: string;
}

/**
 * Standalone NavigationBarItem props.
 *
 * Used internally by `NavigationBar` and available for advanced consumers
 * composing with `HeadlessNavigationBar`.
 *
 * Extends `ButtonHTMLAttributes` (minus `disabled`) so that tab props from
 * `useTab` can be spread directly onto the rendered `<button>`.
 */
export interface NavigationBarItemProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "disabled"
> {
  /**
   * The unique key for this item (passed to the headless layer).
   */
  itemKey: Key;

  /**
   * Icon element displayed at 24dp.
   */
  icon: ReactNode;

  /**
   * Visible label beneath the icon.
   */
  label?: string;

  /**
   * Badge value.
   */
  badge?: NavigationBarBadge;

  /**
   * Whether this item is the currently selected destination.
   * @default false
   */
  isActive?: boolean;

  /**
   * When `true`, hides the label for this item.
   * @default false
   */
  hideLabels?: boolean;

  /**
   * Whether this item is disabled.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Disable ripple effect on this item.
   * @default false
   */
  disableRipple?: boolean;
}

/**
 * HeadlessNavigationBar props.
 *
 * Provides the accessibility foundation (`role="navigation"`, `role="tablist"`,
 * `useTabList`, `useTabListState`) without any visual styling.
 * Intended for advanced consumers who need full visual control.
 *
 * @example
 * ```tsx
 * <HeadlessNavigationBar
 *   items={items}
 *   defaultSelectedKey="home"
 *   aria-label="Main navigation"
 *   renderItem={(config) => (
 *     <HeadlessNavigationBarItem key={config.key} itemKey={config.key}>
 *       {config.icon}
 *       <span>{config.label}</span>
 *     </HeadlessNavigationBarItem>
 *   )}
 * />
 * ```
 */
export interface HeadlessNavigationBarProps {
  /**
   * Array of item configs used to build the React Aria collection.
   */
  items: NavigationBarItemConfig[];

  /**
   * Controlled selected key. Pair with `onSelectionChange`.
   * Use `null` to explicitly deselect all items.
   */
  selectedKey?: Key | null;

  /**
   * Default selected key for uncontrolled usage.
   */
  defaultSelectedKey?: Key;

  /**
   * Called when the selected key changes.
   */
  onSelectionChange?: (key: Key) => void;

  /**
   * Accessible label for the `<nav>` landmark.
   */
  "aria-label": string;

  /**
   * Additional CSS classes for the inner `<div role="tablist">`.
   */
  className?: string;

  /**
   * Render function called for each item in the collection.
   * Receives the item config; use `HeadlessNavigationBarItem` inside.
   */
  renderItem: (config: NavigationBarItemConfig) => ReactNode;
}

/**
 * Render props passed to `HeadlessNavigationBarItem`'s children when used as
 * a render function.
 */
export interface NavigationBarItemRenderProps {
  /** Whether this item is the active destination. */
  isSelected: boolean;
  /** Whether the item has a visible keyboard focus ring. */
  isFocusVisible: boolean;
}

/**
 * HeadlessNavigationBarItem props.
 *
 * Renders a single tab-accessible button using `useTab` from React Aria.
 * Must be rendered inside `HeadlessNavigationBar` (reads state from context).
 *
 * Accepts children as ReactNode or as a render function receiving state props.
 *
 * @example
 * ```tsx
 * // Static children
 * <HeadlessNavigationBarItem itemKey="home">
 *   Home
 * </HeadlessNavigationBarItem>
 *
 * // Render function (access to isSelected / isFocusVisible)
 * <HeadlessNavigationBarItem itemKey="home">
 *   {({ isSelected }) => (
 *     <span style={{ fontWeight: isSelected ? 'bold' : 'normal' }}>Home</span>
 *   )}
 * </HeadlessNavigationBarItem>
 * ```
 */
export interface HeadlessNavigationBarItemProps {
  /**
   * The key matching `NavigationBarItemConfig.key`. Used to look up the
   * item in the React Aria collection state.
   */
  itemKey: Key;

  /**
   * Content to render inside the button — either a ReactNode or a render
   * function receiving `{ isSelected, isFocusVisible }`.
   */
  children: ReactNode | ((renderProps: NavigationBarItemRenderProps) => ReactNode);

  /**
   * Additional CSS classes merged onto the `<button>` element.
   */
  className?: string;

  /**
   * Accessible label for icon-only items (when no visible text label is present).
   * Applied as `aria-label` on the `<button>` element.
   */
  "aria-label"?: string;
}
