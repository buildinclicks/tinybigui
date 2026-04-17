import type React from "react";
import type { AriaTabListProps, AriaTabProps, AriaTabPanelProps } from "react-aria";
import type { Key, TabListState } from "react-stately";

/**
 * Tab variant following MD3 spec
 * - primary: active indicator uses bg-primary; active text: text-primary
 * - secondary: active indicator uses bg-on-surface-variant; active text: text-on-surface
 */
export type TabVariant = "primary" | "secondary";

/**
 * Tab layout mode
 * - fixed: tabs fill available width equally
 * - scrollable: tabs overflow horizontally with no wrapping
 */
export type TabLayout = "fixed" | "scrollable";

/**
 * Tab content mode (inferred from icon/label presence)
 * - icon: icon prop only
 * - label: label prop only
 * - icon-label: both icon and label stacked
 */
export type TabContentMode = "icon" | "label" | "icon-label";

/**
 * Badge value for a tab item
 * - number: displays count (999+ for values > 999, hidden for 0)
 * - true: displays a dot indicator
 * - false/undefined: no badge
 */
export type TabBadgeValue = number | boolean;

/**
 * Material Design 3 Tabs Wrapper Props
 *
 * The Tabs component manages shared state (selected key) and provides
 * context to TabList and TabPanel children.
 *
 * @example
 * ```tsx
 * // Uncontrolled
 * <Tabs defaultSelectedKey="tab1" aria-label="Settings tabs">
 *   <TabList>
 *     <Tab id="tab1" label="General" />
 *     <Tab id="tab2" label="Privacy" />
 *   </TabList>
 *   <TabPanel id="tab1">General content</TabPanel>
 *   <TabPanel id="tab2">Privacy content</TabPanel>
 * </Tabs>
 *
 * // Controlled
 * <Tabs selectedKey={selected} onSelectionChange={setSelected} aria-label="App tabs">
 *   <TabList variant="secondary">
 *     <Tab id="a" label="Overview" />
 *     <Tab id="b" label="Details" />
 *   </TabList>
 *   <TabPanel id="a">Overview content</TabPanel>
 *   <TabPanel id="b">Details content</TabPanel>
 * </Tabs>
 * ```
 */
export interface TabsProps {
  /**
   * Controlled selected tab key
   */
  selectedKey?: Key;

  /**
   * Default selected key for uncontrolled usage
   */
  defaultSelectedKey?: Key;

  /**
   * Callback when selected tab changes
   */
  onSelectionChange?: (key: Key) => void;

  /**
   * Tab variant — affects active indicator and label color
   * @default 'primary'
   */
  variant?: TabVariant;

  /**
   * Layout mode
   * @default 'fixed'
   */
  layout?: TabLayout;

  /**
   * TabList and TabPanel children
   */
  children: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Accessible label for the tabs widget
   */
  "aria-label"?: string;

  /**
   * Accessible labelledby reference
   */
  "aria-labelledby"?: string;
}

/**
 * Material Design 3 TabList Props
 *
 * Renders the tab row container with the active indicator.
 * Must be a child of Tabs.
 *
 * @example
 * ```tsx
 * <TabList>
 *   <Tab id="overview" label="Overview" />
 *   <Tab id="activity" label="Activity" icon={<ActivityIcon />} />
 * </TabList>
 * ```
 */
export interface TabListProps {
  /**
   * Tab child elements
   */
  children: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Material Design 3 Tab Props
 *
 * Represents a single tab item inside a TabList.
 * Supports icon-only, label-only, and icon+label content modes.
 *
 * @example
 * ```tsx
 * // Label only
 * <Tab id="overview" label="Overview" />
 *
 * // Icon + label
 * <Tab id="media" icon={<PhotoIcon />} label="Media" />
 *
 * // With badge
 * <Tab id="messages" label="Messages" badge={5} />
 *
 * // Dot badge
 * <Tab id="notifications" label="Notifications" badge={true} />
 *
 * // Disabled
 * <Tab id="archived" label="Archived" isDisabled />
 * ```
 */
export interface TabProps {
  /**
   * Unique key identifying this tab (used to match with TabPanel)
   */
  id: Key;

  /**
   * Icon element displayed above or instead of the label
   * Should be 24x24dp per MD3 Tabs spec
   */
  icon?: React.ReactNode;

  /**
   * Text label for the tab
   */
  label?: string;

  /**
   * Badge value
   * - number: shows count (999+ for values > 999, hidden for 0)
   * - true: shows dot indicator
   */
  badge?: TabBadgeValue;

  /**
   * Disables the tab (not focusable, not selectable)
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Disables ripple effect
   * @default false
   */
  disableRipple?: boolean;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Material Design 3 TabPanel Props
 *
 * Content area associated with a tab. Only the selected tab's panel is visible.
 * The `id` must match the corresponding Tab's `id`.
 *
 * @example
 * ```tsx
 * <TabPanel id="overview">
 *   <p>Overview content here</p>
 * </TabPanel>
 * ```
 */
export interface TabPanelProps {
  /**
   * Key matching the associated Tab's `id`
   */
  id: Key;

  /**
   * Panel content
   */
  children: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Context value shared between Tabs, TabList, Tab, and TabPanel
 */
export interface TabsContextValue {
  /**
   * Currently selected tab key
   */
  selectedKey: Key | null;

  /**
   * Tab variant for styling
   */
  variant: TabVariant;

  /**
   * Layout mode
   */
  layout: TabLayout;

  /**
   * Disabled keys set
   */
  disabledKeys?: Iterable<Key>;

  /**
   * Accessible label for the tab list (aria-label)
   */
  "aria-label"?: string;

  /**
   * Accessible labelledby reference
   */
  "aria-labelledby"?: string;
}

// ============================================================
// Headless Types
// ============================================================

/**
 * Props for HeadlessTabList
 * Extends AriaTabListProps for full React Aria accessibility support
 */
export interface HeadlessTabListProps extends Omit<AriaTabListProps<TabItem>, "children"> {
  /**
   * Tab item data for the collection
   */
  items: TabItem[];

  /**
   * Render function for each tab item
   */
  renderTab: (item: TabItem) => React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Internal tab item representation for React Aria collection
 */
export interface TabItem {
  key: Key;
  id: Key;
  label?: string;
  icon?: React.ReactNode;
  badge?: TabBadgeValue;
  isDisabled?: boolean;
  textValue?: string;
}

/**
 * Props for HeadlessTab
 * Extends AriaTabProps for full React Aria accessibility support
 */
export interface HeadlessTabProps extends AriaTabProps {
  /**
   * Tab item from the collection
   */
  item: TabItem;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Mouse down handler (for ripple effect)
   */
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Render function receiving interaction states
   */
  children?: (state: {
    isSelected: boolean;
    isDisabled: boolean;
    isFocusVisible: boolean;
    isPressed: boolean;
  }) => React.ReactNode;
}

/**
 * Props for HeadlessTabPanel
 * Extends AriaTabPanelProps for full React Aria accessibility support
 */
export interface HeadlessTabPanelProps extends AriaTabPanelProps {
  /**
   * Panel content
   */
  children: React.ReactNode;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Context value for headless tabs (React Aria state)
 */
export interface HeadlessTabsContextValue {
  state: TabListState<TabItem>;
}
