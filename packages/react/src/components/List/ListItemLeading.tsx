import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import type { ListItemLeadingProps } from "./List.types";

const typeClasses: Record<string, string> = {
  icon: "size-6 text-on-surface-variant",
  avatar: "size-10 overflow-hidden rounded-full",
  checkbox: "",
  radio: "",
};

/**
 * MD3 ListItem leading slot.
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
      <div
        ref={ref}
        className={cn("mr-4 flex shrink-0 items-center", typeClasses[type], className)}
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

ListItemLeading.displayName = "ListItemLeading";
