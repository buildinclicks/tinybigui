"use client";

import type React from "react";
import { forwardRef, isValidElement, useContext } from "react";
import { HeadlessDrawerItem, DrawerIconOnlyContext } from "./DrawerHeadless";
import { Badge } from "../Badge";
import { drawerItemVariants } from "./Drawer.variants";
import { cn } from "../../utils/cn";
import { useRipple } from "../../hooks/useRipple";
import type { DrawerItemProps, DrawerItemBadgeConfig } from "./Drawer.types";

/**
 * Runtime type guard for the structured `DrawerItemBadgeConfig`.
 * Distinguishes config objects from React elements / primitives.
 */
function isBadgeConfig(badge: unknown): badge is DrawerItemBadgeConfig {
  return (
    typeof badge === "object" &&
    badge !== null &&
    !isValidElement(badge) &&
    ("count" in badge || "color" in badge)
  );
}

/**
 * Material Design 3 Navigation Drawer Item (Layer 3: Styled).
 *
 * Renders a navigation destination row following MD3 Navigation Drawer specs.
 * Uses `HeadlessDrawerItem` for behavior and accessibility, CVA for variants.
 *
 * Renders as `<a>` when `href` is provided, `<button>` otherwise.
 *
 * Features:
 * - Active indicator: 336dp pill, `bg-secondary-container` / `text-on-secondary-container`
 * - `aria-current="page"` on active item
 * - Ripple effect on interaction
 * - Hover/focus/pressed state layers (MD3 spec: 8% / 12%)
 * - Optional leading icon (24dp slot)
 * - Optional trailing badge — `ReactNode` or `{ count, color }` config
 * - Icon-only mode: label hidden, `title` tooltip via `DrawerIconOnlyContext`
 * - Disabled state: `opacity-38`, non-interactive
 *
 * @example
 * ```tsx
 * // Active item with icon
 * <DrawerItem icon={<HomeIcon />} label="Home" isActive onPress={() => navigate('/')} />
 *
 * // Item with Badge config
 * <DrawerItem label="Inbox" badge={{ count: 5, color: 'primary' }} />
 *
 * // Disabled
 * <DrawerItem label="Disabled Feature" isDisabled />
 * ```
 *
 * @see https://m3.material.io/components/navigation-drawer/specs
 */
export const DrawerItem = forwardRef<HTMLElement, DrawerItemProps>(
  (
    {
      href,
      icon,
      label,
      badge,
      secondaryText,
      isActive = false,
      isDisabled = false,
      disableRipple = false,
      className,
      onPress,
      onPressStart,
      onPressEnd,
      onPressChange,
      onPressUp,
      ...restProps
    },
    ref
  ) => {
    const isItemDisabled = isDisabled;
    const isIconOnly = useContext(DrawerIconOnlyContext);

    const { onMouseDown: handleRipple, ripples } = useRipple({
      disabled: isItemDisabled || disableRipple,
    });

    const renderBadge = (): React.ReactElement | null => {
      if (!badge) return null;

      if (isBadgeConfig(badge)) {
        return (
          <span className="relative z-10 ml-auto flex shrink-0 items-center pr-2">
            <Badge
              {...(badge.count !== undefined ? { count: badge.count } : {})}
              {...(badge.color !== undefined ? { color: badge.color } : {})}
            >
              <span />
            </Badge>
          </span>
        );
      }

      return (
        <span className="relative z-10 ml-auto flex shrink-0 items-center pr-2" aria-hidden="true">
          {badge}
        </span>
      );
    };

    return (
      <HeadlessDrawerItem
        {...restProps}
        ref={ref}
        {...(href !== undefined ? { href } : {})}
        isActive={isActive}
        {...(isItemDisabled !== undefined ? { isDisabled: isItemDisabled } : {})}
        {...(onPress !== undefined ? { onPress } : {})}
        {...(onPressStart !== undefined ? { onPressStart } : {})}
        {...(onPressEnd !== undefined ? { onPressEnd } : {})}
        {...(onPressChange !== undefined ? { onPressChange } : {})}
        {...(onPressUp !== undefined ? { onPressUp } : {})}
        onMouseDown={handleRipple}
        title={isIconOnly ? label : undefined}
        className={cn(
          drawerItemVariants({
            isActive,
            isDisabled: isItemDisabled,
          }),
          className
        )}
      >
        {/* Ripple effect */}
        {ripples}

        {/* Leading icon slot (24dp) */}
        {icon && (
          <span
            className="relative z-10 flex shrink-0 items-center justify-center"
            aria-hidden="true"
          >
            {icon}
          </span>
        )}

        {/* Label and optional secondary text */}
        <span
          className={cn(
            "relative z-10 flex min-w-0 flex-1 flex-col text-left",
            isIconOnly && "hidden"
          )}
        >
          <span className="truncate">{label}</span>
          {secondaryText && (
            <span className="text-body-small truncate opacity-70">{secondaryText}</span>
          )}
        </span>

        {/* Trailing badge */}
        {!isIconOnly && renderBadge()}
      </HeadlessDrawerItem>
    );
  }
);

DrawerItem.displayName = "DrawerItem";
