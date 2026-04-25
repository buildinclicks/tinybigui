"use client";

import { forwardRef } from "react";
import { HeadlessDrawerItem } from "./DrawerHeadless";
import { drawerItemVariants } from "./Drawer.variants";
import { cn } from "../../utils/cn";
import { useRipple } from "../../hooks/useRipple";
import type { DrawerItemProps } from "./Drawer.types";

/**
 * Material Design 3 Navigation Drawer Item (Layer 3: Styled).
 *
 * Renders a navigation destination row following MD3 Navigation Drawer specs.
 * Uses `HeadlessDrawerItem` for behavior and accessibility, CVA for variants.
 *
 * Renders as `<a>` when `href` is provided, `<button>` otherwise.
 *
 * Features:
 * - Active indicator: `bg-secondary-container` / `text-on-secondary-container`
 * - `aria-current="page"` on active item
 * - Ripple effect on interaction
 * - Hover/focus/pressed state layers (MD3 spec: 8% / 12%)
 * - Optional leading icon (24dp slot)
 * - Optional trailing badge or secondary text
 * - Disabled state: `opacity-38`, non-interactive
 *
 * @example
 * ```tsx
 * // Active item with icon
 * <DrawerItem icon={<HomeIcon />} label="Home" isActive onPress={() => navigate('/')} />
 *
 * // Link item
 * <DrawerItem href="/settings" icon={<SettingsIcon />} label="Settings" />
 *
 * // Item with badge
 * <DrawerItem label="Inbox" badge={<span>3</span>} />
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

    const { onMouseDown: handleRipple, ripples } = useRipple({
      disabled: isItemDisabled || disableRipple,
    });

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
        <span className="relative z-10 flex min-w-0 flex-1 flex-col text-left">
          <span className="truncate">{label}</span>
          {secondaryText && (
            <span className="text-body-small truncate opacity-70">{secondaryText}</span>
          )}
        </span>

        {/* Trailing badge */}
        {badge && (
          <span
            className="relative z-10 ml-auto flex shrink-0 items-center pr-2"
            aria-hidden="true"
          >
            {badge}
          </span>
        )}
      </HeadlessDrawerItem>
    );
  }
);

DrawerItem.displayName = "DrawerItem";
