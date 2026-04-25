"use client";

import type { JSX } from "react";
import { HeadlessMenuDivider } from "./MenuHeadless";
import { menuDividerVariants } from "./Menu.variants";
import { cn } from "../../utils/cn";
import type { MenuDividerProps } from "./Menu.types";

/**
 * Material Design 3 Menu Divider (Layer 3: Styled).
 *
 * Renders a standalone horizontal separator between menu items. Uses
 * `HeadlessMenuDivider` (RAC `Separator`) for `role="separator"` semantics.
 *
 * Color: `border-outline-variant` per MD3 spec.
 *
 * @example
 * ```tsx
 * <MenuItem id="cut">Cut</MenuItem>
 * <MenuDivider />
 * <MenuItem id="select-all">Select all</MenuItem>
 * ```
 *
 * @see https://m3.material.io/components/menus/specs
 */
export function MenuDivider({ className }: MenuDividerProps): JSX.Element {
  return <HeadlessMenuDivider className={cn(menuDividerVariants(), className)} />;
}

MenuDivider.displayName = "MenuDivider";
