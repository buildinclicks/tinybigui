"use client";

import { forwardRef, type JSX } from "react";
import { HeadlessMenuTrigger, HeadlessMenu, MenuContext } from "./MenuHeadless";
import { menuContainerVariants } from "./Menu.variants";
import { cn } from "../../utils/cn";
import type { MenuProps, MenuTriggerProps } from "./Menu.types";

// ─── Menu ─────────────────────────────────────────────────────────────────────

/**
 * Material Design 3 Menu list container (Layer 3: Styled).
 *
 * Renders `<ul role="menu">` with MD3 surface, elevation, shape, and entry
 * animation. Must be a child of `MenuTrigger`.
 *
 * Features:
 * - Surface: `bg-surface-container`
 * - Elevation: `shadow-elevation-2`
 * - Shape: `rounded-xs` (4dp per MD3 shape extra-small)
 * - Width: min 112dp / max 280dp per MD3 spec
 * - Entry animation: scale-y + fade-in (`duration-medium2` /
 *   `ease-emphasized-decelerate`)
 * - Focus management handled by RAC `Popover` (FocusScope + restoreFocus)
 *
 * @example
 * ```tsx
 * <MenuTrigger>
 *   <Button>Open</Button>
 *   <Menu aria-label="Actions">
 *     <MenuItem id="cut">Cut</MenuItem>
 *     <MenuItem id="copy">Copy</MenuItem>
 *   </Menu>
 * </MenuTrigger>
 * ```
 *
 * @see https://m3.material.io/components/menus/overview
 */
export const Menu = forwardRef<HTMLElement, MenuProps>(
  ({ variant = "standard", className, disableRipple = false, children, ...props }, _ref) => {
    const menuClass = cn(menuContainerVariants({ open: true }), className);

    return (
      <MenuContext.Provider
        value={{
          close: () => {
            /* RAC Popover handles close internally */
          },
          disableRipple,
          variant,
          ...(props.selectionMode !== undefined ? { selectionMode: props.selectionMode } : {}),
          ...(props.selectedKeys !== undefined
            ? { selectedKeys: props.selectedKeys as Iterable<string | number> }
            : {}),
        }}
      >
        <HeadlessMenu {...props} className={menuClass}>
          {children}
        </HeadlessMenu>
      </MenuContext.Provider>
    );
  }
);

Menu.displayName = "Menu";

// ─── MenuTrigger ─────────────────────────────────────────────────────────────

/**
 * Material Design 3 Menu Trigger (Layer 3: Styled).
 *
 * Compound component that manages trigger state and positions the menu
 * overlay. Uses `HeadlessMenuTrigger` for accessible overlay management.
 *
 * The first child is the trigger element (any pressable element such as
 * `Button`, `IconButton`, or a native `<button>`). The second child must be a
 * `Menu` component.
 *
 * The trigger element automatically receives:
 * - `aria-haspopup="menu"`
 * - `aria-expanded` (true when open, false when closed)
 * - `aria-controls` (linked to the menu element id)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <MenuTrigger>
 *   <Button>More actions</Button>
 *   <Menu aria-label="Actions">
 *     <MenuItem id="copy">Copy</MenuItem>
 *     <MenuItem id="paste">Paste</MenuItem>
 *   </Menu>
 * </MenuTrigger>
 *
 * // Controlled
 * <MenuTrigger isOpen={open} onOpenChange={setOpen}>
 *   <IconButton aria-label="More"><MoreVertIcon /></IconButton>
 *   <Menu aria-label="Context menu">
 *     <MenuItem id="rename">Rename</MenuItem>
 *     <MenuItem id="delete">Delete</MenuItem>
 *   </Menu>
 * </MenuTrigger>
 * ```
 *
 * @see https://m3.material.io/components/menus/overview
 */
export function MenuTrigger({
  children,
  placement = "bottom start",
  ...triggerProps
}: MenuTriggerProps): JSX.Element {
  return (
    <HeadlessMenuTrigger {...triggerProps} placement={placement}>
      {children}
    </HeadlessMenuTrigger>
  );
}

MenuTrigger.displayName = "MenuTrigger";

// Attach Menu as a static sub-component so tests can use MenuTrigger.Menu
(MenuTrigger as unknown as Record<string, unknown>).Menu = Menu;
