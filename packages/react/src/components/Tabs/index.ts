/**
 * Material Design 3 Tabs Component Exports
 *
 * Three-layer architecture:
 * - Layer 1: React Aria Foundation (useTabList, useTab, useTabPanel, useTabListState)
 * - Layer 2: Headless Primitives (HeadlessTabList, HeadlessTab, HeadlessTabPanel)
 * - Layer 3: Styled Components (Tabs, TabList, Tab, TabPanel)
 */

// Styled components (Layer 3) — Most users will use these
export { Tabs } from "./Tabs";
export { TabList } from "./TabList";
export { Tab } from "./Tab";
export { TabPanel } from "./TabPanel";

// Headless components (Layer 2) — For advanced customization
export {
  HeadlessTabList,
  HeadlessTab,
  HeadlessTabPanel,
  HeadlessTabsContext,
} from "./TabsHeadless";

// Contexts — For advanced use cases
export { TabsContext } from "./Tabs";

// Types
export type {
  TabsProps,
  TabListProps,
  TabProps,
  TabPanelProps,
  TabVariant,
  TabLayout,
  TabContentMode,
  TabBadgeValue,
  TabsContextValue,
  TabItem,
  HeadlessTabListProps,
  HeadlessTabProps,
  HeadlessTabPanelProps,
  HeadlessTabsContextValue,
} from "./Tabs.types";

// Variants — For external customization
export {
  tabListVariants,
  tabVariants,
  tabIndicatorVariants,
  tabPanelVariants,
  tabBadgeVariants,
  tabIconVariants,
} from "./Tabs.variants";

export type {
  TabListVariants,
  TabVariants,
  TabIndicatorVariants,
  TabPanelVariants,
  TabBadgeVariants,
  TabIconVariants,
} from "./Tabs.variants";
