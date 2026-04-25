"use client";

import { createContext, forwardRef, useContext, useRef } from "react";
import { useTabList, useTab, useFocusRing } from "react-aria";
import { useTabListState, Item, type TabListState } from "react-stately";
import { mergeProps } from "@react-aria/utils";
import type {
  HeadlessNavigationBarProps,
  HeadlessNavigationBarItemProps,
} from "./NavigationBar.types";

// ─── Context ──────────────────────────────────────────────────────────────────

/**
 * Context value shared between HeadlessNavigationBar and HeadlessNavigationBarItem.
 * @internal
 */
export interface NavigationBarContextValue {
  state: TabListState<object>;
  hideLabels: boolean;
  disableRipple: boolean;
}

/**
 * Shared context between HeadlessNavigationBar and HeadlessNavigationBarItem.
 * Provides the React Aria TabListState and bar-level configuration.
 * @internal
 */
export const NavigationBarContext = createContext<NavigationBarContextValue | null>(null);

/**
 * Hook to read the NavigationBarContext inside HeadlessNavigationBarItem.
 * Throws a descriptive error if used outside HeadlessNavigationBar.
 * @internal
 */
function useNavigationBarContext(): NavigationBarContextValue {
  const ctx = useContext(NavigationBarContext);
  if (ctx === null) {
    throw new Error("HeadlessNavigationBarItem must be rendered inside HeadlessNavigationBar.");
  }
  return ctx;
}

// ─── HeadlessNavigationBar ────────────────────────────────────────────────────

/**
 * Headless Navigation Bar (Layer 2).
 *
 * Renders an accessible `<nav role="navigation">` landmark wrapping a
 * `<div role="tablist">`. Provides keyboard navigation (Arrow Left/Right,
 * Home, End) and full ARIA semantics via React Aria's `useTabList`.
 *
 * All item accessibility is handled by `HeadlessNavigationBarItem`.
 *
 * Use this component when you need complete visual control beyond what the
 * styled `NavigationBar` provides.
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
export const HeadlessNavigationBar = forwardRef<HTMLElement, HeadlessNavigationBarProps>(
  (
    {
      items,
      selectedKey,
      defaultSelectedKey,
      onSelectionChange,
      "aria-label": ariaLabel,
      className,
      renderItem,
    },
    ref
  ) => {
    // Build the React Aria collection from the items array.
    // Item children (text content) are used as the `textValue` for type-ahead.
    const collectionChildren = items.map((item) => (
      <Item key={item.key} textValue={item.label ?? item["aria-label"] ?? item.key}>
        {item.key}
      </Item>
    ));

    const disabledKeys = items.filter((item) => item.isDisabled).map((item) => item.key);

    // useTabListState manages selected key, keyboard navigation state, and
    // the internal React Aria Collection.
    // We conditionally spread optional props to satisfy exactOptionalPropertyTypes.
    // The generic T is asserted as NavigationBarItemConfig because JSX children
    // cause TypeScript to infer T=object (item data type isn't preserved via JSX).
    const state = useTabListState({
      children: collectionChildren,
      ...(selectedKey !== undefined ? { selectedKey } : {}),
      ...(defaultSelectedKey !== undefined ? { defaultSelectedKey } : {}),
      ...(onSelectionChange ? { onSelectionChange } : {}),
      disabledKeys,
    });

    const tabListRef = useRef<HTMLDivElement>(null);

    // useTabList provides the ARIA props for the tablist container:
    // role="tablist", keyboard event handlers (Arrow keys, Home, End).
    const { tabListProps } = useTabList({ "aria-label": ariaLabel }, state, tabListRef);

    return (
      <nav
        ref={ref as React.RefObject<HTMLElement>}
        role="navigation"
        aria-label={ariaLabel}
        className={className}
      >
        <NavigationBarContext.Provider value={{ state, hideLabels: false, disableRipple: false }}>
          {/* The tablist is a full-width flex row inside the nav */}
          <div {...tabListProps} ref={tabListRef} className="flex h-full w-full items-stretch">
            {[...state.collection].map((collectionItem) => {
              const itemConfig = items.find((i) => String(i.key) === String(collectionItem.key));
              if (!itemConfig) return null;
              return renderItem(itemConfig);
            })}
          </div>
        </NavigationBarContext.Provider>
      </nav>
    );
  }
);

HeadlessNavigationBar.displayName = "HeadlessNavigationBar";

// ─── HeadlessNavigationBarItem ────────────────────────────────────────────────

/**
 * Headless Navigation Bar Item (Layer 2).
 *
 * Renders an accessible `<button role="tab">` using React Aria's `useTab`.
 * Provides `aria-selected`, `aria-disabled`, roving `tabIndex`, and
 * focus management via `useFocusRing`.
 *
 * Must be rendered inside `HeadlessNavigationBar`.
 *
 * @example
 * ```tsx
 * <HeadlessNavigationBarItem itemKey="home" className="my-item">
 *   <HomeIcon aria-hidden />
 *   <span>Home</span>
 * </HeadlessNavigationBarItem>
 * ```
 */
export const HeadlessNavigationBarItem = forwardRef<
  HTMLButtonElement,
  HeadlessNavigationBarItemProps
>(({ itemKey, children, className, "aria-label": ariaLabel }, ref) => {
  const { state } = useNavigationBarContext();

  const internalRef = useRef<HTMLButtonElement>(null);
  const resolvedRef = (ref as React.RefObject<HTMLButtonElement>) ?? internalRef;

  // useTab in @react-aria/tabs 3.x takes { key } (not { item }).
  // It provides: role="tab", aria-selected, aria-disabled, tabIndex,
  // and keyboard event handling (selection on Enter/Space).
  const { tabProps, isSelected } = useTab({ key: itemKey }, state, resolvedRef);

  // Navigation bar has no tab panels, so remove aria-controls to avoid ARIA
  // validation errors (aria-controls must reference an existing element).
  const { "aria-controls": _controls, ...tabPropsWithoutControls } = tabProps;

  // useFocusRing provides isFocusVisible for focus ring management.
  const { focusProps, isFocusVisible } = useFocusRing();

  // Support both ReactNode children and render-function children.
  const content =
    typeof children === "function" ? children({ isSelected, isFocusVisible }) : children;

  return (
    <button
      type="button"
      {...mergeProps(tabPropsWithoutControls, focusProps)}
      ref={resolvedRef}
      className={className}
      aria-label={ariaLabel}
      data-focus-visible={isFocusVisible || undefined}
      data-selected={isSelected}
    >
      {content}
    </button>
  );
});

HeadlessNavigationBarItem.displayName = "HeadlessNavigationBarItem";
