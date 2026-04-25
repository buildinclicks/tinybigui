"use client";

import { forwardRef, useRef, useCallback } from "react";
import type React from "react";
import { useTab, useFocusRing } from "react-aria";
import { mergeProps } from "@react-aria/utils";
import { cn } from "../../utils/cn";
import { useRipple } from "../../hooks/useRipple";
import { useHeadlessTabsContext } from "./TabsHeadless";
import { useTabsContext } from "./Tabs";
import { tabVariants, tabIconVariants, tabBadgeVariants } from "./Tabs.variants";
import type { TabProps, TabBadgeValue } from "./Tabs.types";

type TabElement = HTMLButtonElement;

/**
 * Resolves a badge value to a displayable string or null
 */
function resolveBadgeDisplay(badge: TabBadgeValue | undefined): string | null {
  if (badge === undefined || badge === false) return null;
  if (badge === true) return "dot";
  if (typeof badge === "number") {
    if (badge === 0) return null;
    return badge > 999 ? "999+" : String(badge);
  }
  return null;
}

/**
 * Material Design 3 Tab Component (Layer 3: Styled)
 *
 * Renders a single tab item inside a TabList.
 * Supports three content modes: icon-only, label-only, icon + label (stacked).
 *
 * Features:
 * - ✅ Icon-only, label-only, icon + label (stacked) content modes
 * - ✅ Ripple effect (Material Design)
 * - ✅ MD3 state layers (hover 8%, pressed 12%)
 * - ✅ Badge support (numeric, dot, 999+)
 * - ✅ Disabled state (opacity-38, not focusable)
 * - ✅ Full keyboard accessibility (via React Aria)
 * - ✅ Primary/secondary variant colors
 *
 * MD3 Specifications:
 * - Minimum height: 48dp
 * - Minimum width: 90dp
 * - Typography: Title Small (14px, weight 500, tracking 0.1px)
 * - Icon: 24x24dp
 * - Active indicator: 3dp primary / 2dp secondary
 * - State layers: 8% hover, 12% pressed/focus
 *
 * @example
 * ```tsx
 * // Label only
 * <Tab id="overview" label="Overview" />
 *
 * // Icon + label
 * <Tab id="media" icon={<PhotoIcon />} label="Media" />
 *
 * // With numeric badge
 * <Tab id="messages" label="Messages" badge={5} />
 *
 * // With dot badge
 * <Tab id="notifications" label="Notifications" badge={true} />
 *
 * // Disabled
 * <Tab id="archived" label="Archived" isDisabled />
 * ```
 */
export const Tab = forwardRef<TabElement, TabProps>(
  (
    { id, icon, label, badge, isDisabled = false, disableRipple = false, className, ...htmlProps },
    forwardedRef
  ) => {
    const { state } = useHeadlessTabsContext("Tab");
    const { variant, layout } = useTabsContext();

    const internalRef = useRef<TabElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<TabElement>;

    // React Aria: provides tabProps (role, aria-selected, aria-controls, tabIndex, keyboard events).
    // HTMLButtonElement is structurally compatible with FocusableElement (@react-aria/focus),
    // which is not exported. Casting through HTMLElement satisfies the ref parameter type.
    const {
      tabProps,
      isSelected,
      isDisabled: ariaIsDisabled,
    } = useTab({ key: id, isDisabled }, state, ref as React.RefObject<HTMLElement>);

    // Focus ring for keyboard focus indicator
    const { isFocusVisible, focusProps } = useFocusRing();

    const finalIsDisabled = isDisabled || ariaIsDisabled;

    // Ripple effect
    const { onMouseDown: handleRipple, ripples } = useRipple({
      disabled: finalIsDisabled || disableRipple,
    });

    // Direct selection handler — ensures click works reliably across all environments.
    // React Aria's useTab uses shouldSelectOnPressUp which depends on pointerup events.
    // In some environments (jsdom), pointer capture can interfere with pointerup dispatch.
    // Adding a direct onClick fallback ensures selection always works on user click.
    const handleClick = useCallback(() => {
      if (!finalIsDisabled) {
        state.setSelectedKey(id);
      }
    }, [state, id, finalIsDisabled]);

    // Direct focus handler — ensures focusedKey is always in sync with DOM focus.
    // React Aria uses focusedKey to determine keyboard delegate's starting position.
    // Without this, focusedKey may be null after programmatic DOM focus, breaking Arrow navigation.
    const handleFocus = useCallback(() => {
      if (!finalIsDisabled) {
        state.selectionManager.setFocusedKey(id);
      }
    }, [state.selectionManager, id, finalIsDisabled]);

    // Merge all event handlers — tabProps includes ARIA attrs and keyboard handlers from React Aria.
    // Keyboard navigation (ArrowRight/ArrowLeft/Home/End) is handled at the TabList level,
    // not here, so we don't add an onKeyDown. Events bubble naturally from Tab → TabList.
    const mergedProps = mergeProps(tabProps, focusProps, {
      onMouseDown: disableRipple ? undefined : handleRipple,
      onClick: handleClick,
      onFocus: handleFocus,
    });

    // Badge display
    const badgeDisplay = resolveBadgeDisplay(badge);
    const isDotBadge = badgeDisplay === "dot";
    const hasIcon = Boolean(icon);
    const hasLabel = Boolean(label);

    // Use button for native click handling. role="tab" from tabProps overrides default button role.
    // tabIndex: use isSelected (not isFocused from React Aria) so the selected tab is always reachable
    // via Tab key, regardless of whether React Aria has initialized its internal focusedKey.
    return (
      <button
        {...mergedProps}
        ref={ref}
        type="button"
        // Ensure data-key is set so React Aria's keyboard delegate can find this element by key
        data-key={String(id)}
        // Override React Aria's isFocused-based tabIndex with selection-based roving tabIndex
        tabIndex={finalIsDisabled ? -1 : isSelected ? 0 : -1}
        className={cn(
          tabVariants({
            variant,
            selected: isSelected,
            disabled: finalIsDisabled,
            layout,
          }),
          isFocusVisible && "outline-primary outline-2 outline-offset-2",
          hasLabel && hasIcon && "min-h-16",
          className
        )}
        {...htmlProps}
      >
        {/* Ripple effect */}
        {!disableRipple && ripples}

        {/* Icon with optional badge */}
        {hasIcon && (
          <span className={cn(tabIconVariants({ hasLabel }))}>
            {icon}
            {/* Badge on icon — aria-hidden to keep tab's accessible name clean */}
            {badgeDisplay && (
              <span
                data-badge-type={isDotBadge ? "dot" : "count"}
                aria-hidden="true"
                className={cn(tabBadgeVariants({ type: isDotBadge ? "dot" : "count" }))}
              >
                {!isDotBadge && badgeDisplay}
              </span>
            )}
          </span>
        )}

        {/* Label */}
        {hasLabel && (
          <span className="relative z-10 truncate">
            {label}
            {/* Badge next to label — aria-hidden keeps accessible name clean */}
            {!hasIcon && badgeDisplay && (
              <span
                data-badge-type={isDotBadge ? "dot" : "count"}
                aria-hidden="true"
                className={cn(
                  "relative ml-1",
                  tabBadgeVariants({ type: isDotBadge ? "dot" : "count" })
                )}
              >
                {!isDotBadge && badgeDisplay}
              </span>
            )}
          </span>
        )}
      </button>
    );
  }
);

Tab.displayName = "Tab";
