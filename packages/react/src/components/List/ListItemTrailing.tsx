import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import type { ListItemTrailingProps } from "./List.types";

const typeClasses: Record<string, string> = {
  icon: "size-6 text-on-surface-variant",
  text: "text-on-surface-variant text-label-small",
  checkbox: "",
  radio: "",
};

/**
 * MD3 ListItem trailing slot.
 *
 * For `checkbox` and `radio` types the children are wrapped with
 * `aria-hidden="true"` and `tabIndex={-1}` — selection semantics
 * come from the parent `ListItem`'s `useOption`.
 */
export const ListItemTrailing = forwardRef<HTMLDivElement, ListItemTrailingProps>(
  function ListItemTrailing({ type, children, className }, ref) {
    const isControl = type === "checkbox" || type === "radio";

    return (
      <div
        ref={ref}
        className={cn("ml-auto flex shrink-0 items-center", typeClasses[type], className)}
      >
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
