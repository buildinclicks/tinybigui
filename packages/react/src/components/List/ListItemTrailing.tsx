import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { listItemTrailingVariants } from "./List.variants";
import type { ListItemTrailingProps } from "./List.types";

/**
 * MD3 ListItem trailing slot.
 *
 * Uses `listItemTrailingVariants` CVA so icon/text colors automatically react to
 * the parent `group/list-item` data-selected and data-disabled attributes.
 *
 * For `checkbox` and `radio` types the children are wrapped with
 * `aria-hidden="true"` and `tabIndex={-1}` — selection semantics
 * come from the parent `ListItem`'s `useOption`.
 */
export const ListItemTrailing = forwardRef<HTMLDivElement, ListItemTrailingProps>(
  function ListItemTrailing({ type, children, className }, ref) {
    const isControl = type === "checkbox" || type === "radio";

    return (
      <div ref={ref} className={cn(listItemTrailingVariants({ type }), className)}>
        {isControl ? (
          <span aria-hidden="true" tabIndex={-1}>
            {children}
          </span>
        ) : (
          children
        )}
      </div>
    );
  }
);

ListItemTrailing.displayName = "ListItemTrailing";
