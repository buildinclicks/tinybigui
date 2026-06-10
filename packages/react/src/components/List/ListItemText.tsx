import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import {
  listItemOverlineVariants,
  listItemHeadlineVariants,
  listItemSupportingTextVariants,
} from "./List.variants";
import type { ListItemTextProps } from "./List.types";

/**
 * MD3 ListItem text block — overline + headline + supporting text.
 *
 * Each text element uses its own slot CVA so colors automatically react to
 * the parent `group/list-item` data-selected and data-disabled attributes.
 *
 * Uses `min-w-0` to allow text truncation inside flex containers.
 */
export const ListItemText = forwardRef<HTMLDivElement, ListItemTextProps>(function ListItemText(
  { headline, supportingText, overline, className },
  ref
) {
  return (
    <div ref={ref} className={cn("min-w-0 flex-1", className)}>
      {overline && <p className={cn(listItemOverlineVariants())}>{overline}</p>}
      <p className={cn(listItemHeadlineVariants())}>{headline}</p>
      {supportingText && <p className={cn(listItemSupportingTextVariants())}>{supportingText}</p>}
    </div>
  );
});

ListItemText.displayName = "ListItemText";
