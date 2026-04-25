"use client";

import { forwardRef, useContext } from "react";
import { HeadlessMenuItem } from "./MenuHeadless";
import { MenuContext } from "./MenuHeadless";
import { menuItemVariants, menuItemTrailingTextVariants } from "./Menu.variants";
import { cn } from "../../utils/cn";
import { useRipple } from "../../hooks/useRipple";
import type { MenuItemProps } from "./Menu.types";
import type { MenuItemRenderProps } from "react-aria-components";

/**
 * Material Design 3 Menu Item (Layer 3: Styled).
 *
 * A single interactive item within a Menu. Uses `HeadlessMenuItem` (RAC
 * `MenuItem`) for all behavior and ARIA semantics, CVA for MD3 visual states.
 *
 * Features:
 * - Item height: 48dp (`h-12`) per MD3 spec
 * - Label: `text-label-large text-on-surface`
 * - Optional leading icon slot: `text-on-surface-variant`
 * - Optional trailing icon slot: `text-on-surface-variant`
 * - Optional trailing text (keyboard shortcut): `text-label-large text-on-surface-variant`
 * - MD3 state layers via pseudo-element (`opacity-8` hover, `opacity-12`
 *   focus-visible / pressed)
 * - Ripple effect on press
 * - Disabled state: `opacity-38` + non-interactive
 * - Selected state (select variant): `bg-secondary-container` +
 *   `text-on-secondary-container`
 *
 * @example
 * ```tsx
 * // Basic item
 * <MenuItem id="cut">Cut</MenuItem>
 *
 * // With leading icon
 * <MenuItem id="copy" leadingIcon={<CopyIcon />}>Copy</MenuItem>
 *
 * // With keyboard shortcut
 * <MenuItem id="paste" leadingIcon={<PasteIcon />} trailingText="⌘V">Paste</MenuItem>
 *
 * // Disabled
 * <MenuItem id="undo" isDisabled>Undo</MenuItem>
 * ```
 *
 * @see https://m3.material.io/components/menus/specs
 */
export const MenuItem = forwardRef<HTMLElement, MenuItemProps>(
  (
    {
      leadingIcon,
      trailingIcon,
      trailingText,
      isDisabled = false,
      className,
      disableRipple: disableRippleProp,
      children,
      ...restProps
    },
    _ref
  ) => {
    const ctx = useContext(MenuContext);
    const contextDisableRipple = ctx?.disableRipple ?? false;
    const isRippleDisabled = (disableRippleProp ?? contextDisableRipple) || Boolean(isDisabled);

    const { onMouseDown: handleRipple, ripples } = useRipple({
      disabled: isRippleDisabled,
    });

    // RAC MenuItem accepts className as a function receiving render props,
    // which allows dynamic styling based on isDisabled / isSelected.
    const itemClassName = ({ isDisabled: d, isSelected: s }: MenuItemRenderProps): string =>
      cn(menuItemVariants({ isDisabled: d, isSelected: s }), className);

    return (
      <HeadlessMenuItem
        {...restProps}
        isDisabled={isDisabled}
        className={itemClassName as unknown as string}
        onMouseDown={handleRipple as React.MouseEventHandler<HTMLElement>}
      >
        {/* Ripple effect */}
        {ripples}

        {/* Leading icon slot */}
        {leadingIcon && (
          <span
            className="text-on-surface-variant relative z-10 flex shrink-0 items-center justify-center"
            aria-hidden="true"
          >
            {leadingIcon}
          </span>
        )}

        {/* Label */}
        <span className="relative z-10 flex-1 truncate text-left">{children}</span>

        {/* Trailing icon slot (mutually exclusive with trailingText) */}
        {trailingIcon && !trailingText && (
          <span
            className="text-on-surface-variant relative z-10 ml-auto flex shrink-0 items-center"
            aria-hidden="true"
          >
            {trailingIcon}
          </span>
        )}

        {/* Trailing text (keyboard shortcut) */}
        {trailingText && !trailingIcon && (
          <span className={cn("relative z-10", menuItemTrailingTextVariants())}>
            {trailingText}
          </span>
        )}
      </HeadlessMenuItem>
    );
  }
);

MenuItem.displayName = "MenuItem";
