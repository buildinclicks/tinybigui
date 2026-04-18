"use client";

import { forwardRef } from "react";
import { useRipple } from "../../hooks/useRipple";
import { cn } from "../../utils/cn";
import {
  navigationBarItemVariants,
  indicatorPillVariants,
  badgeVariants,
  iconWrapperVariants,
  labelVariants,
} from "./NavigationBar.variants";
import type { NavigationBarItemProps, NavigationBarBadge } from "./NavigationBar.types";

// ─── Badge helper ─────────────────────────────────────────────────────────────

/**
 * Returns the display string for a badge value.
 * - `true`  → renders dot (no text)
 * - `0`     → hidden
 * - `1–999` → count as string
 * - `> 999` → "999+"
 */
function getBadgeContent(badge: NavigationBarBadge): string | null {
  if (badge === true) return null; // dot — no text
  if (badge === 0) return ""; // hidden
  if (badge > 999) return "999+";
  return String(badge);
}

/**
 * Whether a badge value should be rendered at all.
 */
function isBadgeVisible(badge: NavigationBarBadge | undefined): boolean {
  if (badge === undefined) return false;
  if (badge === 0) return false;
  return true;
}

// ─── NavigationBarItem ────────────────────────────────────────────────────────

/**
 * Material Design 3 Navigation Bar Item (Layer 3).
 *
 * Renders a single destination item within a `NavigationBar`. Handles:
 * - Active indicator pill (`rounded-full`, animated with MD3 motion tokens)
 * - Icon slot (24dp, always visible)
 * - Badge (dot, numeric count, 999+ truncation)
 * - Label (hidden in `hideLabels` mode)
 * - MD3 state layers (hover `opacity-8`, pressed `opacity-12`)
 * - Ripple effect via `useRipple`
 * - Focus ring via `data-focus-visible`
 *
 * Used internally by `NavigationBar`. Can also be composed with
 * `HeadlessNavigationBarItem` for advanced customization.
 *
 * **Future — Navigation Rail:**
 * At wider viewports, a NavigationBar may transition to a Navigation Rail.
 * This is a separate component tracked as a future Phase 5+ item.
 *
 * @example
 * ```tsx
 * // Used standalone (advanced consumer with HeadlessNavigationBar)
 * <NavigationBarItem
 *   itemKey="home"
 *   icon={<HomeIcon />}
 *   label="Home"
 *   isActive
 * />
 * ```
 */
export const NavigationBarItem = forwardRef<HTMLButtonElement, NavigationBarItemProps>(
  (
    {
      itemKey: _itemKey,
      icon,
      label,
      badge,
      isActive = false,
      hideLabels = false,
      isDisabled = false,
      disableRipple = false,
      className,
      "aria-label": ariaLabel,
      // Spread remaining props (e.g. tabProps from useTab)
      ...rest
    },
    ref
  ) => {
    const { onMouseDown, ripples } = useRipple({
      ...(disableRipple || isDisabled ? { disabled: true } : {}),
    });

    const showBadge = isBadgeVisible(badge);
    const isDot = badge === true;
    const badgeContent = badge !== undefined ? getBadgeContent(badge) : null;

    return (
      <button
        type="button"
        ref={ref}
        onMouseDown={onMouseDown}
        disabled={isDisabled}
        aria-label={ariaLabel}
        className={cn(
          navigationBarItemVariants({
            isActive,
            isDisabled,
          }),
          className
        )}
        {...rest}
      >
        {/* Overflow hidden container for ripple */}
        <span className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-none">
          {/* Ripple nodes */}
          {ripples}

          {/* Active indicator pill — animates behind the icon */}
          <span
            data-indicator-pill
            data-active={isActive}
            className={cn(
              indicatorPillVariants({ isActive }),
              !hideLabels && !showBadge && "-mt-3.5"
            )}
            aria-hidden="true"
          />

          {/* Icon + Badge wrapper */}
          <span data-icon className={cn(iconWrapperVariants())}>
            {/* Icon (24dp, aria-hidden is set by the consumer on the SVG) */}
            <span className="relative z-10 flex h-6 w-6 items-center justify-center">{icon}</span>

            {/* Badge */}
            {showBadge && (
              <span
                data-badge
                data-badge-dot={isDot || undefined}
                aria-label={
                  isDot
                    ? "notification"
                    : badgeContent
                      ? `${badgeContent} notifications`
                      : undefined
                }
                aria-live="polite"
                className={cn(badgeVariants({ isDot }))}
              >
                {isDot ? null : badgeContent}
              </span>
            )}
          </span>

          {/* Label */}
          {!hideLabels && label && (
            <span data-label className={cn(labelVariants())}>
              {label}
            </span>
          )}
        </span>
      </button>
    );
  }
);

NavigationBarItem.displayName = "NavigationBarItem";
