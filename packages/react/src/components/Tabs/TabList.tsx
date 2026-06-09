"use client";

import { forwardRef, useRef, useLayoutEffect, useState, useCallback, useEffect } from "react";
import type React from "react";
import { useTabList } from "react-aria";
import { cn } from "../../utils/cn";
import { useHeadlessTabsContext } from "./TabsHeadless";
import { useTabsContext } from "./Tabs";
import { tabListVariants, tabIndicatorVariants } from "./Tabs.variants";
import type { TabListProps } from "./Tabs.types";

/**
 * Indicator position and width state for the animated sliding underline.
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
 * Active indicator behavior (MD3 spec):
 * - Primary: indicator width = content (label/icon) width, centered under content.
 *   Measured via the [data-tab-content] child span of the selected tab.
 * - Secondary: indicator spans the full tab button width.
 *
 * Motion: left and width are spatial properties → spring-standard-default-spatial.
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
    // Conditionally spread ARIA props to satisfy exactOptionalPropertyTypes.
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
     */
    const handleNavKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(e.key)) return;

        const container = ref.current;
        if (!container) return;

        const focusedEl = document.activeElement as HTMLElement | null;
        const currentKey = focusedEl?.dataset?.key;
        if (!currentKey) return;

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

    const { onKeyDown: tabListKeyDown } = tabListProps;

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
     * Recalculates indicator position and width from the selected tab's DOM.
     *
     * Primary variant: measures the [data-tab-content] inner span of the selected tab,
     * which contains only the icon/label. The indicator is centered under this content
     * (MD3 spec: indicator hugs content, not the full tab width).
     *
     * Secondary variant: measures the full selected tab button rect (full tab width).
     */
    const updateIndicator = useCallback(() => {
      const container = ref.current;
      if (!container) return;

      const selectedTab = container.querySelector<HTMLElement>('[aria-selected="true"]');
      if (!selectedTab) return;

      const containerRect = container.getBoundingClientRect();

      if (variant === "primary") {
        // Primary: measure the content span centered under icon/label
        const contentEl = selectedTab.querySelector<HTMLElement>("[data-tab-content]");
        if (!contentEl) return;

        const contentRect = contentEl.getBoundingClientRect();
        const newLeft = contentRect.left - containerRect.left + container.scrollLeft;
        const newWidth = contentRect.width;

        setIndicatorStyle((prev) => {
          if (prev.left === newLeft && prev.width === newWidth) return prev;
          return { left: newLeft, width: newWidth };
        });
      } else {
        // Secondary: indicator spans the full tab button width
        const tabRect = selectedTab.getBoundingClientRect();
        const newLeft = tabRect.left - containerRect.left + container.scrollLeft;
        const newWidth = tabRect.width;

        setIndicatorStyle((prev) => {
          if (prev.left === newLeft && prev.width === newWidth) return prev;
          return { left: newLeft, width: newWidth };
        });
      }

      setIndicatorReady(true);
    }, [ref, variant]);

    // Re-measure when selection changes or variant changes
    useLayoutEffect(() => {
      updateIndicator();
    }, [state.selectedKey, updateIndicator]);

    // Re-measure on container resize (e.g. window resize, flex layout reflow)
    useEffect(() => {
      const container = ref.current;
      if (!container || typeof ResizeObserver === "undefined") return;

      const observer = new ResizeObserver(() => {
        updateIndicator();
      });
      observer.observe(container);

      return () => {
        observer.disconnect();
      };
    }, [ref, updateIndicator]);

    // ── Render ──────────────────────────────────────────────────────────────
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
            left: `${indicatorStyle.left}px`,
            width: `${indicatorStyle.width}px`,
          }}
        />
      </div>
    );
  }
);

TabList.displayName = "TabList";
