"use client";

import { type JSX } from "react";
import { HeadlessMenuDivider } from "./MenuHeadless";
import { menuDividerVariants } from "./Menu.variants";
import { cn } from "../../utils/cn";
import type { MenuDividerProps } from "./Menu.types";

/**
 * MD3 styled MenuDivider component (Layer 3).
 *
 * Renders a horizontal `role="separator"` with `border-outline-variant` styling.
 * 8dp top/bottom padding (`my-2`) per MD3 spec.
 *
 * @example
 * ```tsx
 * <MenuItem id="cut">Cut</MenuItem>
 * <MenuDivider />
 * <MenuItem id="select-all">Select all</MenuItem>
 * ```
 */
export function MenuDivider({ className }: MenuDividerProps): JSX.Element {
  return <HeadlessMenuDivider className={cn(menuDividerVariants(), className)} />;
}
