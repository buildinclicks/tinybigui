"use client";

import { forwardRef, useRef, useLayoutEffect, useState, useCallback } from "react";
import type React from "react";
import { useTabList } from "react-aria";
import { cn } from "../../utils/cn";
import { useHeadlessTabsContext } from "./TabsHeadless";
import { useTabsContext } from "./Tabs";
import { tabListVariants, tabIndicatorVariants } from "./Tabs.variants";
import type { TabListProps } from "./Tabs.types";

/**
 * Indicator position and width state for the animated sliding underline
 */
interface IndicatorStyle {
  left: number;
  width: number;
}

/**
 * Material Design 3 TabList Component (Layer 3: Styled)
 *
 * Renders the tab row container with an animated active indicator.
 * Uses React Aria's useTabList for role="tablist", keyboard navigation,
 * and accessibility attributes.
 *
 * The active indicator slides to the selected tab using CSS transitions
 * with MD3 motion tokens (medium2 duration, emphasized easing).
 *
 * MD3 Specifications:
 * - Container background: bg-surface
 * - Container height: 48dp
 * - Bottom border: 1dp, outline-variant color
 * - Fixed layout: tabs fill width equally
 * - Scrollable layout: overflow-x, no wrapping
 *
 * @example
 * ```tsx
 * <Tabs aria-label="Settings" defaultSelectedKey="general">
 *   <TabList>
 *     <Tab id="general" label="General" />
 *     <Tab id="privacy" label="Privacy" />
 *   </TabList>
 *   ...
 * </Tabs>
 * ```
 */
export const TabList = forwardRef<HTMLDivElement, TabListProps>(
  ({ children, className }, forwardedRef) => {
    const { state } = useHeadlessTabsContext("TabList");
    const {
      variant,
      layout,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
    } = useTabsContext();

    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLDivElement>;

    // React Aria provides role="tablist", aria-label, and keyboard navigation.
    // Conditionally spread ARIA props to satisfy exactOptionalPropertyTypes:
    // passing undefined values explicitly would violate the strict optional type constraint.
    const { tabListProps } = useTabList(
      {
        ...(ariaLabel !== undefined && { "aria-label": ariaLabel }),
        ...(ariaLabelledBy !== undefined && { "aria-labelledby": ariaLabelledBy }),
      },
      state,
      ref
    );

    // ── Keyboard navigation ────────────────────────────────────────────────
    /**
     * Custom keyboard handler that reads from document.activeElement rather than
     * state.focusedKey. This is critical for test reliability: when a tab is focused
     * via element.focus() outside React's act() boundary, the setFocusedKey state
     * update is deferred and state.focusedKey may still be null when the keydown fires.
     * Reading from the DOM directly avoids this race condition entirely.
     */
    const handleNavKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;

        const container = ref.current;
        if (!container) return;

        const focusedEl = document.activeElement as HTMLElement | null;
        const currentKey = focusedEl?.dataset?.key;
        if (!currentKey) return;

        // Read the ordered tab keys and disabled state directly from the DOM.
        // This is more reliable than state.collection.getKeys() because React Stately 3.x
        // builds its collection through a virtual rendering context; when we compute
        // <Item> elements programmatically inside Tabs.tsx, that context is never entered
        // and state.collection remains empty. DOM attributes are always authoritative.
        const allTabEls = [...container.querySelectorAll<HTMLElement>("[data-key]")];
        const allKeys = allTabEls.map((el) => el.dataset.key!).filter(Boolean);
        const enabledKeys = allKeys.filter(
          (k) =>
            allTabEls.find((el) => el.dataset.key === k)?.getAttribute("aria-disabled") !== "true"
        );

        const currentIndex = enabledKeys.indexOf(currentKey);
        if (currentIndex === -1) return;

        let nextKey: string | null = null;
        switch (e.key) {
          case "ArrowRight":
            nextKey = enabledKeys[(currentIndex + 1) % enabledKeys.length] ?? null;
            break;
          case "ArrowLeft":
            nextKey =
              enabledKeys[(currentIndex - 1 + enabledKeys.length) % enabledKeys.length] ?? null;
            break;
          case "Home":
            nextKey = enabledKeys[0] ?? null;
            break;
          case "End":
            nextKey = enabledKeys[enabledKeys.length - 1] ?? null;
            break;
        }

        if (nextKey != null) {
          e.preventDefault();
          state.setSelectedKey(nextKey);
          const nextEl = container.querySelector<HTMLElement>(
            `[data-key="${CSS.escape(nextKey)}"]`
          );
          nextEl?.focus();
        }
      },
      [state, ref]
    );

    // Destructure onKeyDown so it can be used as a stable useCallback dependency.
    const { onKeyDown: tabListKeyDown } = tabListProps;

    /**
     * Combined keyboard handler: our DOM-based navigation runs first for arrow/home/end.
     * If we call e.preventDefault() (signalling we handled it), React Aria's handler is
     * skipped for that key. Other keys (Enter, Space, Tab) pass through to React Aria.
     */
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        handleNavKeyDown(e);
        if (!e.defaultPrevented) {
          tabListKeyDown?.(e);
        }
      },
      [handleNavKeyDown, tabListKeyDown]
    );

    // ── Active indicator animation ─────────────────────────────────────────
    const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({ left: 0, width: 0 });
    const [indicatorReady, setIndicatorReady] = useState(false);

    /**
     * Recalculates indicator position/width from the selected tab's DOM rect.
     * Uses the [aria-selected="true"] element as the target.
     * Only calls setState if values changed to prevent infinite update loops.
     */
    const updateIndicator = useCallback(() => {
      const container = ref.current;
      if (!container) return;

      const selectedTab = container.querySelector<HTMLElement>('[aria-selected="true"]');
      if (!selectedTab) return;

      const containerRect = container.getBoundingClientRect();
      const tabRect = selectedTab.getBoundingClientRect();

      const newLeft = tabRect.left - containerRect.left + container.scrollLeft;
      const newWidth = tabRect.width;

      // Use functional update to avoid stale closure and prevent needless re-renders
      setIndicatorStyle((prev) => {
        if (prev.left === newLeft && prev.width === newWidth) return prev;
        return { left: newLeft, width: newWidth };
      });
      setIndicatorReady(true);
    }, [ref]);

    // Only re-run when the selected key changes (not every render)
    useLayoutEffect(() => {
      updateIndicator();
    }, [state.selectedKey, updateIndicator]);

    // ── Render ──────────────────────────────────────────────────────────────
    // Merge handleKeyDown into tabListProps so jsx-a11y can't flag a "static" div with
    // an explicit onKeyDown. The role="tablist" (from tabListProps) makes it interactive,
    // but ESLint can't trace roles through spread operators — this avoids the false positive.
    const mergedTabListProps = { ...tabListProps, onKeyDown: handleKeyDown };

    return (
      <div {...mergedTabListProps} ref={ref} className={cn(tabListVariants({ layout }), className)}>
        {children}

        {/* Animated active indicator (sliding underline) */}
        <span
          data-tab-indicator
          aria-hidden="true"
          className={cn(
            tabIndicatorVariants({ variant }),
            // Hide until first position is calculated to avoid flash
            !indicatorReady && "opacity-0"
          )}
          style={{
            // Dynamic left/width values from DOM measurements
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
        />
      </div>
    );
  }
);

TabList.displayName = "TabList";
