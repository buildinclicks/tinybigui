"use client";

import { createContext, forwardRef, useContext, useMemo, Children, isValidElement } from "react";
import type React from "react";
import { Item } from "react-stately";
import { useTabListState } from "react-stately";
import { cn } from "../../utils/cn";
import { HeadlessTabsContext } from "./TabsHeadless";
import type {
  TabsProps,
  TabsContextValue,
  TabVariant,
  TabLayout,
  TabProps,
  TabItem,
} from "./Tabs.types";
import type { Key } from "react-stately";

/**
 * Context providing MD3 styling context (variant, layout) to Tab, TabList, TabPanel
 */
export const TabsContext = createContext<TabsContextValue | null>(null);

/**
 * Hook to consume the tabs styling context
 * @internal
 */
export function useTabsContext(): TabsContextValue {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Component must be used within a Tabs component");
  }
  return context;
}

/**
 * Resolves a React component's display name safely.
 * Handles both regular function components and exotic components (forwardRef, memo, etc.)
 * where `typeof component` is "object", not "function".
 */
function getComponentName(type: unknown): string {
  if (typeof type === "string") return type;
  // forwardRef / memo return exotic objects — check displayName/name on the object itself
  const exotic = type as { displayName?: string; name?: string };
  return exotic.displayName ?? exotic.name ?? "";
}

/**
 * Extracts Tab props from the children tree (TabList > Tab children)
 * Used to build the React Aria collection for state management
 */
function extractTabItemsFromChildren(children: React.ReactNode): Array<{
  key: Key;
  label?: string;
  icon?: React.ReactNode;
  isDisabled?: boolean;
  "aria-label"?: string;
}> {
  const items: Array<{
    key: Key;
    label?: string;
    icon?: React.ReactNode;
    isDisabled?: boolean;
    "aria-label"?: string;
  }> = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;

    if (getComponentName(child.type) === "TabList") {
      // Extract Tab children from the TabList
      const tabListProps = child.props as { children?: React.ReactNode };
      Children.forEach(tabListProps.children, (tabChild) => {
        if (!isValidElement(tabChild)) return;

        if (getComponentName(tabChild.type) === "Tab") {
          const tabProps = tabChild.props as TabProps & { "aria-label"?: string };
          // Conditionally include optional properties to satisfy exactOptionalPropertyTypes.
          // Passing undefined explicitly would violate the strict optional type constraint.
          items.push({
            key: tabProps.id,
            ...(tabProps.label !== undefined && { label: tabProps.label }),
            ...(tabProps.icon !== undefined && { icon: tabProps.icon }),
            ...(tabProps.isDisabled !== undefined && { isDisabled: tabProps.isDisabled }),
            ...(tabProps["aria-label"] !== undefined && { "aria-label": tabProps["aria-label"] }),
          });
        }
      });
    }
  });

  return items;
}

/**
 * Material Design 3 Tabs Component (Layer 3: Styled Wrapper)
 *
 * The Tabs component manages shared selected state via useTabListState (React Aria + Stately),
 * and provides this state to all child TabList, Tab, and TabPanel components via context.
 *
 * Architecture:
 * 1. Extracts Tab metadata from children to build the React Aria collection
 * 2. Creates tab list state with useTabListState
 * 3. Provides React Aria state via HeadlessTabsContext
 * 4. Provides MD3 styling context via TabsContext
 *
 * Features:
 * - ✅ Controlled and uncontrolled selection
 * - ✅ Primary and secondary variants
 * - ✅ Fixed and scrollable layouts
 * - ✅ Full keyboard navigation (via React Aria)
 * - ✅ WCAG 2.1 AA compliant
 *
 * @example
 * ```tsx
 * // Uncontrolled
 * <Tabs defaultSelectedKey="tab1" aria-label="Settings">
 *   <TabList>
 *     <Tab id="tab1" label="General" />
 *     <Tab id="tab2" label="Privacy" />
 *   </TabList>
 *   <TabPanel id="tab1">General content</TabPanel>
 *   <TabPanel id="tab2">Privacy content</TabPanel>
 * </Tabs>
 *
 * // Controlled
 * <Tabs selectedKey={tab} onSelectionChange={setTab} aria-label="App">
 *   <TabList variant="secondary">
 *     <Tab id="overview" label="Overview" />
 *     <Tab id="details" label="Details" />
 *   </TabList>
 *   <TabPanel id="overview">Overview</TabPanel>
 *   <TabPanel id="details">Details</TabPanel>
 * </Tabs>
 * ```
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      selectedKey,
      defaultSelectedKey,
      onSelectionChange,
      variant = "primary",
      layout = "fixed",
      children,
      className,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
    },
    ref
  ) => {
    // Extract tab items from children tree to build the React Aria collection
    const tabItems = useMemo(() => extractTabItemsFromChildren(children), [children]);

    // Create React Aria tab list state with Item-based collection.
    // ARIA label props (aria-label / aria-labelledby) are NOT part of TabListStateOptions —
    // they belong to useTabList (the React Aria hook in TabList.tsx).
    // Conditionally spread optional props to satisfy exactOptionalPropertyTypes: passing
    // undefined explicitly would violate the strict optional type constraint.
    const state = useTabListState<TabItem>({
      ...(selectedKey !== undefined && { selectedKey }),
      ...(defaultSelectedKey !== undefined && { defaultSelectedKey }),
      ...(onSelectionChange !== undefined && { onSelectionChange }),
      disabledKeys: tabItems.filter((t) => t.isDisabled).map((t) => t.key),
      children: tabItems.map((item) => (
        <Item key={item.key} textValue={item.label ?? item["aria-label"] ?? String(item.key)}>
          {item.label ?? item["aria-label"] ?? ""}
        </Item>
      )),
    });

    // MD3 styling context — conditionally include ARIA label props (exactOptionalPropertyTypes)
    const tabsContextValue = useMemo<TabsContextValue>(
      () => ({
        selectedKey: state.selectedKey,
        variant,
        layout,
        disabledKeys: tabItems.filter((t) => t.isDisabled).map((t) => t.key),
        ...(ariaLabel !== undefined && { "aria-label": ariaLabel }),
        ...(ariaLabelledBy !== undefined && { "aria-labelledby": ariaLabelledBy }),
      }),
      [state.selectedKey, variant, layout, tabItems, ariaLabel, ariaLabelledBy]
    );

    // Headless context providing React Aria state
    const headlessContextValue = useMemo(() => ({ state }), [state]);

    return (
      <HeadlessTabsContext.Provider value={headlessContextValue}>
        <TabsContext.Provider value={tabsContextValue}>
          <div ref={ref} className={cn("flex flex-col", className)}>
            {children}
          </div>
        </TabsContext.Provider>
      </HeadlessTabsContext.Provider>
    );
  }
);

Tabs.displayName = "Tabs";

// Export context helpers for use by child components
export type { TabVariant, TabLayout };
