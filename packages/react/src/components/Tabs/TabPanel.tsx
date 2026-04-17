"use client";

import { forwardRef, useRef } from "react";
import type React from "react";
import { useTabPanel } from "react-aria";
import { cn } from "../../utils/cn";
import { useHeadlessTabsContext } from "./TabsHeadless";
import { useTabsContext } from "./Tabs";
import { tabPanelVariants } from "./Tabs.variants";
import type { TabPanelProps } from "./Tabs.types";

/**
 * Material Design 3 TabPanel Component (Layer 3: Styled)
 *
 * Renders the content area associated with a tab.
 * Only the selected tab's panel content is shown.
 *
 * Provides full accessibility:
 * - role="tabpanel"
 * - aria-labelledby (pointing to the associated tab)
 * - Focus management for panels without focusable children (tabIndex=-1)
 *
 * MD3 Specifications:
 * - No specific container styling mandated by MD3 for the panel itself
 * - The panel should be keyboard-reachable per WCAG requirements
 *
 * @example
 * ```tsx
 * <TabPanel id="overview">
 *   <h2>Overview</h2>
 *   <p>Content here...</p>
 * </TabPanel>
 * ```
 */
export const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(
  ({ id, children, className }, forwardedRef) => {
    const { state } = useHeadlessTabsContext("TabPanel");
    useTabsContext(); // consume context to validate component is inside Tabs

    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLDivElement>;

    // React Aria: provides role="tabpanel", aria-labelledby, tabIndex
    const { tabPanelProps } = useTabPanel({}, state, ref);

    // Only render the selected panel
    if (state.selectedKey !== id) {
      return null;
    }

    return (
      <div {...tabPanelProps} ref={ref} className={cn(tabPanelVariants(), className)}>
        {children}
      </div>
    );
  }
);

TabPanel.displayName = "TabPanel";
