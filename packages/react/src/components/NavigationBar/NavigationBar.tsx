"use client";

import { forwardRef, type JSX } from "react";
import { useRipple } from "../../hooks/useRipple";
import { cn } from "../../utils/cn";
import { HeadlessNavigationBar, HeadlessNavigationBarItem } from "./NavigationBarHeadless";
import {
  navigationBarVariants,
  indicatorPillVariants,
  badgeVariants,
  iconWrapperVariants,
  labelVariants,
} from "./NavigationBar.variants";
import type { NavigationBarProps, NavigationBarItemConfig } from "./NavigationBar.types";
import type { Key } from "react-aria";

// ─── Item count validation ────────────────────────────────────────────────────

const MIN_ITEMS = 3;
const MAX_ITEMS = 5;

function validateItemCount(count: number): void {
  if (process.env.NODE_ENV !== "production" && (count < MIN_ITEMS || count > MAX_ITEMS)) {
    console.warn(
      `[NavigationBar] MD3 Navigation Bar requires between ${MIN_ITEMS} and ${MAX_ITEMS} ` +
        `destination items. Received ${count}. ` +
        `See: https://m3.material.io/components/navigation-bar/overview`
    );
  }
}

// ─── Badge helpers ────────────────────────────────────────────────────────────

function getBadgeText(badge: number | true | undefined): string | null {
  if (badge === undefined || badge === 0) return null;
  if (badge === true) return null; // dot — no text
  if (badge > 999) return "999+";
  return String(badge);
}

function isBadgeVisible(badge: number | true | undefined): boolean {
  if (badge === undefined) return false;
  if (badge === 0) return false;
  return true;
}

// ─── Visual content ───────────────────────────────────────────────────────────

/**
 * Private — renders the visual content of a navigation bar item.
 * Intentionally has NO button wrapper (the button is provided by
 * `HeadlessNavigationBarItem` to avoid nested interactive elements).
 */
interface ItemVisualProps {
  config: NavigationBarItemConfig;
  isActive: boolean;
  hideLabels: boolean;
  disableRipple: boolean;
}

function ItemVisual({ config, isActive, hideLabels, disableRipple }: ItemVisualProps): JSX.Element {
  const isItemDisabled = config.isDisabled === true;
  const { onMouseDown, ripples } = useRipple({
    ...(disableRipple || isItemDisabled ? { disabled: true } : {}),
  });

  const showBadge = isBadgeVisible(config.badge);
  const isDot = config.badge === true;
  const badgeText = getBadgeText(config.badge);

  return (
    // Overflow-hidden wrapper required for ripple containment.
    // pointer-events-none is intentional: the parent <button> handles all interaction.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <span
      onMouseDown={onMouseDown}
      className="pointer-events-none relative flex h-full w-full flex-col items-center justify-center overflow-hidden"
    >
      {ripples}

      {/* Active indicator pill */}
      <span
        data-indicator-pill
        data-active={isActive}
        aria-hidden="true"
        className={cn(indicatorPillVariants({ isActive }), !hideLabels && "-mt-3.5")}
      />

      {/* Icon + Badge wrapper */}
      <span
        data-icon
        className={cn(
          iconWrapperVariants(),
          isActive ? "text-on-secondary-container" : "text-on-surface-variant"
        )}
      >
        <span className="relative z-10 flex h-6 w-6 items-center justify-center">
          {config.icon}
        </span>

        {showBadge && (
          <span
            data-badge
            data-badge-dot={isDot || undefined}
            aria-label={
              isDot ? "notification" : badgeText ? `${badgeText} notifications` : undefined
            }
            aria-live="polite"
            className={cn(badgeVariants({ isDot }))}
          >
            {isDot ? null : badgeText}
          </span>
        )}
      </span>

      {/* Label */}
      {!hideLabels && config.label && (
        <span
          data-label
          className={cn(labelVariants(), isActive ? "text-on-surface" : "text-on-surface-variant")}
        >
          {config.label}
        </span>
      )}
    </span>
  );
}

// ─── NavigationBar ────────────────────────────────────────────────────────────

/**
 * Material Design 3 Navigation Bar (Bottom Navigation) — Layer 3.
 *
 * Renders a fixed bottom navigation bar with 3–5 destination items, each with
 * an icon, optional label, animated active indicator pill, and optional badge.
 *
 * **Architecture:**
 * - Layer 3 (this file): MD3 styled, CVA variants, `'use client'`
 * - Layer 2: `HeadlessNavigationBar` + `HeadlessNavigationBarItem` — React Aria
 * - Layer 1: `useTabList`, `useTab`, `useFocusRing` — accessibility foundation
 *
 * **Key Features:**
 * - 3–5 destination items (dev warning outside this range)
 * - Animated indicator pill per MD3 motion tokens (scale + opacity)
 * - Badge: dot, numeric count, "999+" truncation, hidden at 0
 * - `hideLabels` for icon-only mode
 * - Controlled (`activeKey` + `onActiveChange`) and uncontrolled (`defaultActiveKey`)
 * - Full keyboard navigation: Arrow Left/Right, Home, End, roving `tabIndex`
 * - WCAG 2.1 AA: `role="navigation"` + `aria-label`, `role="tablist"`,
 *   `role="tab"` + `aria-selected`, visible focus ring
 *
 * **Future — Navigation Rail:**
 * At wider viewports, a NavigationBar may transition to a Navigation Rail.
 * This is a separate component tracked as a future Phase 5+ item.
 *
 * @example
 * ```tsx
 * // Uncontrolled
 * <NavigationBar
 *   items={[
 *     { key: 'home', icon: <HomeIcon />, label: 'Home' },
 *     { key: 'search', icon: <SearchIcon />, label: 'Search', badge: 3 },
 *     { key: 'profile', icon: <ProfileIcon />, label: 'Profile' },
 *   ]}
 *   defaultActiveKey="home"
 *   aria-label="Main navigation"
 * />
 *
 * // Controlled
 * <NavigationBar
 *   items={items}
 *   activeKey={activeKey}
 *   onActiveChange={setActiveKey}
 *   aria-label="Main navigation"
 * />
 *
 * // Icon-only mode
 * <NavigationBar
 *   items={iconOnlyItems}
 *   defaultActiveKey="home"
 *   aria-label="Main navigation"
 *   hideLabels
 * />
 * ```
 *
 * @see https://m3.material.io/components/navigation-bar/overview
 * @see https://m3.material.io/components/navigation-bar/specs
 */
export const NavigationBar = forwardRef<HTMLElement, NavigationBarProps>(
  (
    {
      items,
      activeKey,
      defaultActiveKey,
      onActiveChange,
      hideLabels = false,
      "aria-label": ariaLabel,
      disableRipple = false,
      className,
    },
    ref
  ) => {
    validateItemCount(items.length);

    return (
      <HeadlessNavigationBar
        ref={ref}
        items={items}
        {...(activeKey !== undefined ? { selectedKey: activeKey } : {})}
        {...(defaultActiveKey !== undefined ? { defaultSelectedKey: defaultActiveKey } : {})}
        {...(onActiveChange ? { onSelectionChange: onActiveChange as (key: Key) => void } : {})}
        aria-label={ariaLabel}
        className={cn(navigationBarVariants(), className)}
        renderItem={(config: NavigationBarItemConfig) => (
          // HeadlessNavigationBarItem renders the <button role="tab"> with all
          // ARIA semantics. ItemVisual renders the icon/pill/badge/label inside
          // — no nested <button> elements.
          <HeadlessNavigationBarItem
            key={config.key}
            itemKey={config.key}
            {...(config["aria-label"] !== undefined ? { "aria-label": config["aria-label"] } : {})}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center",
              "cursor-pointer outline-none select-none",
              "duration-short2 ease-standard transition-colors",
              // State layer pseudo-element
              "before:absolute before:inset-0 before:rounded-none",
              "before:bg-on-surface-variant before:opacity-0",
              "before:duration-short2 before:ease-standard before:transition-opacity",
              "hover:before:opacity-8",
              "active:before:opacity-12",
              // Focus ring
              "focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2",
              // Disabled styling
              config.isDisabled && "pointer-events-none cursor-not-allowed opacity-38"
            )}
          >
            {({ isSelected }: { isSelected: boolean }) => (
              <ItemVisual
                config={config}
                isActive={isSelected}
                hideLabels={hideLabels}
                disableRipple={disableRipple}
              />
            )}
          </HeadlessNavigationBarItem>
        )}
      />
    );
  }
);

NavigationBar.displayName = "NavigationBar";
