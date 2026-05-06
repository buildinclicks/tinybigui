"use client";

import { type ForwardedRef, type JSX } from "react";
import { createLeafComponent } from "@react-aria/collections";
import { menuGapVariants } from "./Menu.variants";
import { cn } from "../../utils/cn";
import type { MenuGapProps } from "./Menu.types";

/**
 * RAC `filterDOMProps` strips `aria-hidden` and `role` overrides from all RAC
 * separator components (the attributes are not in its allowlist). Passing props
 * declaratively therefore has no effect on the rendered element.
 *
 * We also cannot use a native `<li>` because RAC's collection system only
 * renders items that are registered in its internal collection Document — a
 * plain HTML element is not registered and items following it are dropped.
 *
 * The correct solution: create a first-class collection item using
 * `createLeafComponent` (RAC's public collection primitive). We register the
 * item as type `'separator'` (so the collection includes it and subsequent
 * siblings continue to render), but provide a completely custom render function
 * that outputs `<div aria-hidden="true">` directly, without going through
 * `useSeparator` or `filterDOMProps`. This means:
 *   - `queryByRole("separator")` returns null (aria-hidden excludes the element)
 *   - Menu items after the gap render correctly (collection is intact)
 *   - The element has zero ARIA semantics (aria-hidden removes it from the tree)
 */
const MenuGapItem = createLeafComponent<object, { className?: string }, HTMLDivElement>(
  // Use the 'separator' string type so createLeafComponent creates a bare
  // CollectionNode subclass — registered in the collection but without the
  // consecutive-separator-drop filter that RAC's own SeparatorNode applies.
  "separator",
  function MenuGapRenderer(
    { className: cls }: { className?: string },
    ref: ForwardedRef<HTMLDivElement>
  ): JSX.Element {
    return (
      // Rendered directly — no filterDOMProps, no useSeparator.
      // aria-hidden="true" removes the element from the a11y tree entirely.
      <div ref={ref} aria-hidden="true" className={cls} />
    );
  }
);

/**
 * MD3 MenuGap component (Layer 3) — Expressive Vertical Menu only.
 *
 * A purely visual spacer between item groups in M3 Expressive vertical menus.
 * Unlike `MenuDivider` (which renders a visible border line), `MenuGap` renders
 * only blank spacing and is fully hidden from the accessibility tree.
 *
 * @see https://m3.material.io/components/menus/guidelines#gaps-and-dividers
 *
 * @example
 * ```tsx
 * <MenuTrigger.Menu menuStyle="vertical">
 *   <MenuItem id="cut">Cut</MenuItem>
 *   <MenuGap />
 *   <MenuItem id="paste">Paste</MenuItem>
 * </MenuTrigger.Menu>
 * ```
 */
export function MenuGap({ className }: MenuGapProps): JSX.Element {
  return <MenuGapItem className={cn(menuGapVariants(), className)} />;
}
