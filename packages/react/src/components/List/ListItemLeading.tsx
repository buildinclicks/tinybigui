import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { listItemLeadingVariants } from "./List.variants";
import type { ListItemLeadingProps } from "./List.types";

/**
 * MD3 ListItem leading slot.
 *
 * Uses `listItemLeadingVariants` CVA so icon/text colors automatically react to
 * the parent `group/list-item` data-selected and data-disabled attributes.
 *
 * For `checkbox` and `radio` types the children are wrapped with
 * `aria-hidden="true"` and `tabIndex={-1}` because the parent
 * `ListItem`'s `useOption` already conveys selection state to
 * assistive technology.
 */
export const ListItemLeading = forwardRef<HTMLDivElement, ListItemLeadingProps>(
  function ListItemLeading({ type, children, className }, ref) {
    const isControl = type === "checkbox" || type === "radio";

    return (
      <div ref={ref} className={cn(listItemLeadingVariants({ type }), className)}>
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

ListItemLeading.displayName = "ListItemLeading";
