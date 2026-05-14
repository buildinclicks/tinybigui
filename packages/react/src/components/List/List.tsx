"use client";

import { Children, forwardRef } from "react";
import type React from "react";
import { cn } from "../../utils/cn";
import { ListHeadless } from "./ListHeadless";
import { listVariants } from "./List.variants";
import type { ListProps } from "./List.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Interleaves presentational `<hr>` dividers between each child.
 * Uses `role="presentation"` to keep the element out of the ARIA tree,
 * avoiding `aria-required-children` violations inside `<ul role="list">`.
 */
function interleaveWithDividers(children: React.ReactNode): React.ReactNode[] {
  const items = Children.toArray(children);

  return items.reduce<React.ReactNode[]>((acc, child, index) => {
    if (index > 0) {
      acc.push(
        <hr
          key={`divider-${index}`}
          role="presentation"
          className="border-outline-variant w-full border-t"
        />
      );
    }
    acc.push(child);
    return acc;
  }, []);
}

/**
 * Material Design 3 List Component (Layer 3: Styled)
 *
 * Wraps `ListHeadless` with MD3 surface color and layout tokens.
 *
 * @example
 * ```tsx
 * // Static list
 * <List aria-label="Settings">
 *   <ListItem value="wifi" headline="Wi-Fi" />
 *   <ListItem value="bt" headline="Bluetooth" />
 * </List>
 *
 * // Interactive single-select list
 * <List aria-label="Alignment" selectionMode="single" onSelectionChange={setSelection}>
 *   <ListItem value="left" headline="Left" />
 *   <ListItem value="center" headline="Center" />
 *   <ListItem value="right" headline="Right" />
 * </List>
 *
 * // With dividers between items
 * <List aria-label="Settings" showDividers>
 *   <ListItem value="wifi" headline="Wi-Fi" />
 *   <ListItem value="bt" headline="Bluetooth" />
 * </List>
 * ```
 */
export const List = forwardRef<HTMLUListElement, ListProps>(function List(
  { className, showDividers = false, children, ...props },
  ref
) {
  const renderedChildren = showDividers ? interleaveWithDividers(children) : children;

  return (
    <ListHeadless ref={ref} className={cn(listVariants(), className)} {...props}>
      {renderedChildren}
    </ListHeadless>
  );
});

List.displayName = "List";
