"use client";

import { forwardRef, useRef, useCallback } from "react";
import type React from "react";
import { useTab, useFocusRing, useHover } from "react-aria";
import { mergeProps } from "@react-aria/utils";
import { cn } from "../../utils/cn";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import { useRipple } from "../../hooks/useRipple";
import { useHeadlessTabsContext } from "./TabsHeadless";
import { useTabsContext } from "./Tabs";
import {
  tabVariants,
  tabStateLayerVariants,
  tabIconVariants,
  tabBadgeVariants,
} from "./Tabs.variants";
import type { TabProps, TabBadgeValue } from "./Tabs.types";

type TabElement = HTMLButtonElement;

/**
 * Resolves a badge value to a displayable string or null.
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
 * Architecture: Variants-vs-States
 * - Design-time variants (primary/secondary, fixed/scrollable) live in CVA.
 * - All interaction states are expressed as data-* attributes on the root button
 *   via getInteractionDataAttributes, consumed by slots using group-data-[x]/tab.
 * - Content flags (data-with-icon, data-with-label) describe structure, set explicitly.
 *
 * Slots:
 *   root button   — group/tab; typography, label color, disabled, content flags
 *   state layer   — absolute inset hover/focus/pressed overlay
 *   content span  — data-tab-content; measured by TabList for primary indicator width
 *   icon wrapper  — 24dp icon + badge anchor
 *   label span    — truncated text label
 *
 * MD3 Specifications:
 * - Minimum height: 48dp (label/icon-only), 64dp (icon+label stacked)
 * - Typography: Title Small (text-title-small, weight 500, tracking 0.1px)
 * - Icon: 24×24dp
 * - Active indicator: 3dp primary / 2dp secondary — both bg-primary
 * - State layers: hover 8%, focus/pressed 10%
 * - Disabled: 38% opacity (not focusable)
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
    // isPressed is available from useTab's TabAria return type.
    const {
      tabProps,
      isSelected,
      isDisabled: ariaIsDisabled,
      isPressed,
    } = useTab({ key: id, isDisabled }, state, ref as React.RefObject<HTMLElement>);

    // Focus ring for keyboard focus indicator
    const { isFocusVisible, focusProps } = useFocusRing();

    // Hover state for state-layer
    const finalIsDisabled = isDisabled || ariaIsDisabled;
    const { isHovered, hoverProps } = useHover({ isDisabled: finalIsDisabled });

    // Ripple effect
    const { onMouseDown: handleRipple, ripples } = useRipple({
      disabled: finalIsDisabled || disableRipple,
    });

    // Direct selection handler — ensures click works reliably across all environments.
    // React Aria's useTab uses shouldSelectOnPressUp which depends on pointerup events.
    // In some environments (jsdom), pointer capture can interfere with pointerup dispatch.
    const handleClick = useCallback(() => {
      if (!finalIsDisabled) {
        state.setSelectedKey(id);
      }
    }, [state, id, finalIsDisabled]);

    // Direct focus handler — ensures focusedKey is always in sync with DOM focus.
    // React Aria uses focusedKey to determine keyboard delegate's starting position.
    const handleFocus = useCallback(() => {
      if (!finalIsDisabled) {
        state.selectionManager.setFocusedKey(id);
      }
    }, [state.selectionManager, id, finalIsDisabled]);

    const mergedProps = mergeProps(tabProps, focusProps, hoverProps, {
      onMouseDown: disableRipple ? undefined : handleRipple,
      onClick: handleClick,
      onFocus: handleFocus,
    });

    const badgeDisplay = resolveBadgeDisplay(badge);
    const isDotBadge = badgeDisplay === "dot";
    const hasIcon = Boolean(icon);
    const hasLabel = Boolean(label);

    return (
      <button
        {...mergedProps}
        ref={ref}
        type="button"
        data-key={String(id)}
        // Roving tabIndex based on selection, not focus state
        tabIndex={finalIsDisabled ? -1 : isSelected ? 0 : -1}
        className={cn(tabVariants({ variant, layout }), className)}
        // ── Interaction data attributes (from React Aria state) ──────────
        {...getInteractionDataAttributes({
          isHovered,
          isFocusVisible,
          isPressed,
          isSelected,
          isDisabled: finalIsDisabled,
        })}
        // ── Content flags (describe structure, NOT interaction state) ────
        data-with-icon={hasIcon ? "" : undefined}
        data-with-label={hasLabel ? "" : undefined}
        {...htmlProps}
      >
        {/* Ripple effect */}
        {!disableRipple && ripples}

        {/* State layer — absolute inset, opacity driven by group-data-[x]/tab */}
        <span className={cn(tabStateLayerVariants({ variant }))} aria-hidden="true" />

        {/*
         * Content span — inline-flex, measured by TabList for primary indicator width.
         * data-tab-content is the measurement anchor; TabList queries this element's
         * bounding rect to center the primary indicator under the actual content.
         */}
        <span
          data-tab-content
          className="relative z-10 inline-flex flex-col items-center justify-center"
        >
          {/* Icon with optional badge */}
          {hasIcon && (
            <span className={cn(tabIconVariants({ hasLabel }))}>
              {icon}
              {/* Badge on icon — aria-hidden keeps tab's accessible name clean */}
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
            <span className="truncate">
              {label}
              {/* Badge next to label when no icon — aria-hidden keeps accessible name clean */}
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
        </span>
      </button>
    );
  }
);

Tab.displayName = "Tab";
