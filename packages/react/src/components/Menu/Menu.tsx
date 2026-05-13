"use client";

import { forwardRef, type JSX } from "react";
import { HeadlessMenuTrigger } from "./MenuHeadless";
import { MenuContext } from "./MenuHeadless";
import { HeadlessMenu } from "./MenuHeadless";
import { menuContainerVariants } from "./Menu.variants";
import { cn } from "../../utils/cn";
import type {
  MenuProps,
  MenuTriggerProps,
  MenuColorScheme,
  MenuStyle,
  MenuDensity,
} from "./Menu.types";

// ─── Menu ────────────────────────────────────────────────────────────────────

/**
 * MD3 styled Menu component (Layer 3).
 *
 * Renders a list of `MenuItem`, `MenuSection`, or `MenuDivider` children.
 * Intended to be used as `MenuTrigger.Menu` (nested inside a `MenuTrigger`).
 *
 * @example
 * ```tsx
 * <MenuTrigger>
 *   <Button>Open</Button>
 *   <Menu aria-label="Actions">
 *     <MenuItem id="copy">Copy</MenuItem>
 *     <MenuItem id="paste">Paste</MenuItem>
 *   </Menu>
 * </MenuTrigger>
 * ```
 */
const Menu = forwardRef<HTMLElement, MenuProps>(function Menu(
  {
    children,
    className,
    colorScheme = "standard",
    menuStyle = "baseline",
    density = 0,
    disableRipple = false,
    selectionMode,
    selectedKeys,
    onSelectionChange,
    ...props
  },
  _ref
) {
  /**
   * Close function injected by parent MenuTrigger.
   * The Popover's onClose handles the actual close; we provide a no-op here
   * unless wrapped by a trigger. When used inside MenuTrigger, the context
   * is overridden by the trigger's close handler.
   */
  const close = (): void => {
    // Controlled via RAC Popover — handled by overlay state context.
  };

  // Conditionally include optional EOPT-sensitive context fields.
  const contextValue = {
    close,
    disableRipple,
    colorScheme,
    menuStyle,
    density,
    ...(selectionMode !== undefined ? { selectionMode } : {}),
    ...(selectedKeys !== undefined ? { selectedKeys } : {}),
  };

  return (
    <MenuContext.Provider value={contextValue}>
      <HeadlessMenu
        {...props}
        {...(selectionMode !== undefined ? { selectionMode } : {})}
        {...(selectedKeys !== undefined ? { selectedKeys } : {})}
        {...(onSelectionChange !== undefined ? { onSelectionChange } : {})}
        className={cn(menuContainerVariants({ colorScheme, menuStyle }), className)}
      >
        {children}
      </HeadlessMenu>
    </MenuContext.Provider>
  );
});

// ─── MenuTrigger ─────────────────────────────────────────────────────────────

/**
 * MD3 styled MenuTrigger component (Layer 3).
 *
 * Wraps a trigger element and a `Menu` to create a dropdown.
 * Attach `MenuTrigger.Menu` to specify the menu content, which gives IDE
 * autocompletion and makes the parent/child relationship explicit.
 *
 * @example
 * ```tsx
 * <MenuTrigger>
 *   <button type="button">Open Menu</button>
 *   <MenuTrigger.Menu aria-label="Actions">
 *     <MenuItem id="cut">Cut</MenuItem>
 *   </MenuTrigger.Menu>
 * </MenuTrigger>
 * ```
 */
function MenuTrigger({
  children,
  placement = "bottom start",
  shouldFlip = true,
  ...rest
}: MenuTriggerProps): JSX.Element {
  return (
    <HeadlessMenuTrigger placement={placement} shouldFlip={shouldFlip} {...rest}>
      {children}
    </HeadlessMenuTrigger>
  );
}

MenuTrigger.Menu = Menu;

export { Menu, MenuTrigger };
export type { MenuColorScheme, MenuStyle, MenuDensity };
