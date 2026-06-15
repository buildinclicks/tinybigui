"use client";

import { type JSX } from "react";
import { HeadlessMenuSection, useMenuContext } from "./MenuHeadless";
import { menuItemGroupVariants } from "./Menu.variants";
import { MenuGap } from "./MenuGap";
import { cn } from "../../utils/cn";
import type { MenuItemGroupProps } from "./Menu.types";

/**
 * MD3 styled MenuItemGroup component (Layer 3).
 *
 * Groups related `MenuItem` elements into a semantic `role="group"` block and
 * automatically inserts a 2dp MD3 Expressive gap before the group when
 * `menuStyle="vertical"`. The gap is hidden on the first group via
 * `first:hidden`, so N sibling groups produce exactly N−1 visible gaps —
 * one between each pair.
 *
 * Unlike `MenuSection` (which is header-driven and optionally shows a divider
 * line), `MenuItemGroup` is gap-driven and requires only an `aria-label` to
 * satisfy the ARIA `group` role accessible-name requirement.
 *
 * **Gap mechanics**: a `MenuGap` leaf (registered in RAC's collection with
 * `data-menu-gap`) is emitted as the leading sibling of the `<section>`. The
 * adjacent-sibling CSS selectors in `menuItemVariants` already watch
 * `[data-menu-gap]` to apply segment corner rounding, so the auto-gap is
 * fully compatible with the existing vertical segmented-card model.
 *
 * **Baseline menus**: in `menuStyle="baseline"` the ARIA group is still
 * rendered but no gap is injected. A dev-mode `console.warn` is emitted to
 * flag the mismatch, mirroring ButtonGroup's development-only warnings.
 *
 * @example
 * ```tsx
 * <MenuTrigger.Menu menuStyle="vertical" aria-label="Edit actions">
 *   <MenuItemGroup aria-label="Clipboard">
 *     <MenuItem id="cut">Cut</MenuItem>
 *     <MenuItem id="copy">Copy</MenuItem>
 *     <MenuItem id="paste">Paste</MenuItem>
 *   </MenuItemGroup>
 *   <MenuItemGroup aria-label="History">
 *     <MenuItem id="undo">Undo</MenuItem>
 *     <MenuItem id="redo">Redo</MenuItem>
 *   </MenuItemGroup>
 * </MenuTrigger.Menu>
 * ```
 */
export function MenuItemGroup({
  children,
  "aria-label": ariaLabel,
  className,
}: MenuItemGroupProps): JSX.Element {
  const ctx = useMenuContext();
  const menuStyle = ctx?.menuStyle ?? "baseline";
  const colorScheme = ctx?.colorScheme ?? "standard";

  if (process.env.NODE_ENV === "development" && menuStyle === "baseline") {
    console.warn(
      '[MenuItemGroup] MenuItemGroup is designed for `menuStyle="vertical"` (MD3 Expressive) menus.',
      "In `baseline` menus no gap is injected. Use `MenuSection` with `showDivider` instead."
    );
  }

  return (
    <>
      {menuStyle === "vertical" && <MenuGap className="first:hidden" />}
      <HeadlessMenuSection
        aria-label={ariaLabel}
        className={cn(menuItemGroupVariants({ menuStyle, colorScheme }), className)}
      >
        {children}
      </HeadlessMenuSection>
    </>
  );
}
