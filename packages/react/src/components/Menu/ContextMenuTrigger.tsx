"use client";

import { type JSX } from "react";
import { HeadlessContextMenuTrigger } from "./MenuHeadless";
import type { ContextMenuTriggerProps } from "./Menu.types";

/**
 * MD3 styled ContextMenuTrigger component (Layer 3).
 *
 * Wraps arbitrary content and opens a menu on right-click or two-finger tap.
 * The menu is positioned at the pointer coordinates.
 *
 * Keyboard: `Escape` closes the menu.
 *
 * @example
 * ```tsx
 * <ContextMenuTrigger>
 *   <div>Right-click me</div>
 *   <MenuTrigger.Menu aria-label="Context actions">
 *     <MenuItem id="copy">Copy</MenuItem>
 *     <MenuItem id="paste">Paste</MenuItem>
 *   </MenuTrigger.Menu>
 * </ContextMenuTrigger>
 * ```
 */
export function ContextMenuTrigger({
  children,
  isOpen,
  onOpenChange,
}: ContextMenuTriggerProps): JSX.Element {
  return (
    <HeadlessContextMenuTrigger
      {...(isOpen !== undefined ? { isOpen } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange } : {})}
    >
      {children}
    </HeadlessContextMenuTrigger>
  );
}
