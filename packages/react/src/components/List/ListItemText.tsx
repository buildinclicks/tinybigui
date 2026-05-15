import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import type { ListItemTextProps } from "./List.types";

/**
 * MD3 ListItem text block — overline + headline + supporting text.
 *
 * Uses `min-w-0` to allow text truncation inside flex containers.
 */
export const ListItemText = forwardRef<HTMLDivElement, ListItemTextProps>(function ListItemText(
  { headline, supportingText, overline, className },
  ref
) {
  return (
    <div ref={ref} className={cn("min-w-0 flex-1", className)}>
      {overline && <p className="text-on-surface-variant text-label-small">{overline}</p>}
      <p className="text-on-surface text-body-large">{headline}</p>
      {supportingText && (
        <p className="text-on-surface-variant text-body-medium">{supportingText}</p>
      )}
    </div>
  );
});

ListItemText.displayName = "ListItemText";
