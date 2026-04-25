import { createContext, forwardRef, useContext, useRef } from "react";
import { useTab, useTabList, useTabPanel, useFocusRing } from "react-aria";
import { mergeProps } from "@react-aria/utils";
import type { TabListState } from "react-stately";
import type {
  HeadlessTabProps,
  HeadlessTabPanelProps,
  TabItem,
  HeadlessTabsContextValue,
} from "./Tabs.types";

/**
 * Context providing React Aria tab state to all headless primitives.
 * State is created in the Tabs wrapper and shared here.
 */
export const HeadlessTabsContext = createContext<HeadlessTabsContextValue | null>(null);

/**
 * Hook to consume the headless tabs context
 * @internal
 */
export function useHeadlessTabsContext(componentName: string): HeadlessTabsContextValue {
  const context = useContext(HeadlessTabsContext);
  if (!context) {
    throw new Error(`${componentName} must be used within a Tabs component`);
  }
  return context;
}

/**
 * Props for the HeadlessTabList container.
 * State is injected from HeadlessTabsContext (created in Tabs wrapper).
 */
export interface HeadlessTabListContainerProps {
  /** Children are Tab elements */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Headless TabList Component (Layer 2)
 *
 * Unstyled tab list container. Applies useTabList to the container element
 * which wires up role="tablist", aria-label, and keyboard navigation.
 * State must be provided via HeadlessTabsContext (from the Tabs wrapper).
 *
 * @example
 * ```tsx
 * // Advanced usage via headless primitives
 * // State is provided by the Tabs wrapper above in the tree
 * <HeadlessTabList className="my-tablist">
 *   {items.map(item => <HeadlessTab key={item.key} item={item} />)}
 * </HeadlessTabList>
 * ```
 */
export const HeadlessTabList = forwardRef<HTMLDivElement, HeadlessTabListContainerProps>(
  ({ children, className }, forwardedRef) => {
    const { state } = useHeadlessTabsContext("HeadlessTabList");

    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLDivElement>;

    const { tabListProps } = useTabList({}, state, ref);

    return (
      <div {...tabListProps} ref={ref} className={className}>
        {children}
      </div>
    );
  }
);

HeadlessTabList.displayName = "HeadlessTabList";

/**
 * Headless Tab Component (Layer 2)
 *
 * Unstyled individual tab item. Provides full React Aria accessibility:
 * - role="tab"
 * - aria-selected
 * - aria-controls (pointing to panel)
 * - roving tabIndex
 * - keyboard activation
 *
 * Must be used within HeadlessTabsContext.
 *
 * @example
 * ```tsx
 * <HeadlessTab item={item}>
 *   {({ isSelected, isFocusVisible }) => (
 *     <span className={isSelected ? 'font-bold' : ''}>
 *       {item.label}
 *     </span>
 *   )}
 * </HeadlessTab>
 * ```
 */
export const HeadlessTab = forwardRef<HTMLButtonElement, HeadlessTabProps>(
  ({ item, className, onMouseDown, children, ...props }, forwardedRef) => {
    const { state } = useHeadlessTabsContext("HeadlessTab");

    const internalRef = useRef<HTMLButtonElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLButtonElement>;

    const { tabProps, isSelected, isDisabled, isPressed } = useTab(
      {
        key: item.key,
        ...(item.isDisabled !== undefined && { isDisabled: item.isDisabled }),
      },
      state,
      ref as React.RefObject<HTMLElement>
    );

    const { isFocusVisible, focusProps } = useFocusRing();

    const mergedProps = mergeProps(tabProps, focusProps, {
      className,
      onMouseDown,
    });

    return (
      <button {...mergedProps} ref={ref} type="button" data-key={String(item.key)} {...props}>
        {typeof children === "function"
          ? children({ isSelected, isDisabled, isFocusVisible, isPressed })
          : children}
      </button>
    );
  }
);

HeadlessTab.displayName = "HeadlessTab";

/**
 * Headless TabPanel Component (Layer 2)
 *
 * Unstyled tab panel. Provides:
 * - role="tabpanel"
 * - aria-labelledby (pointing to its tab)
 * - Focus management for panels without focusable children
 *
 * Must be used within HeadlessTabsContext.
 *
 * @example
 * ```tsx
 * <HeadlessTabPanel>
 *   <p>Panel content here</p>
 * </HeadlessTabPanel>
 * ```
 */
export const HeadlessTabPanel = forwardRef<HTMLDivElement, HeadlessTabPanelProps>(
  ({ children, className, ...props }, forwardedRef) => {
    const { state } = useHeadlessTabsContext("HeadlessTabPanel");

    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLDivElement>;

    const { tabPanelProps } = useTabPanel(props, state, ref);

    return (
      <div {...tabPanelProps} ref={ref} className={className}>
        {children}
      </div>
    );
  }
);

HeadlessTabPanel.displayName = "HeadlessTabPanel";

/**
 * Expose TabListState type for advanced consumers
 */
export type { TabListState, TabItem };
