import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import type { CardActionsProps } from "./Card.types";

/**
 * `CardActions` — Action buttons row slot sub-component (Layer 3).
 *
 * Renders a right-aligned flex row of action buttons at the bottom of the card
 * per MD3 spec. Top padding is reduced (`pt-0`) because this slot always
 * follows a content area. Typically contains `Button` components.
 *
 * @example
 * ```tsx
 * <CardActions>
 *   <Button variant="text" onPress={onCancel}>Cancel</Button>
 *   <Button variant="filled" onPress={onConfirm}>Confirm</Button>
 * </CardActions>
 * ```
 *
 * @see https://m3.material.io/components/cards/specs
 */
export const CardActions = forwardRef<HTMLDivElement, CardActionsProps>(function CardActions(
  { children, className },
  ref
) {
  return (
    <div ref={ref} className={cn("flex items-center justify-end gap-2 p-4 pt-0", className)}>
      {children}
    </div>
  );
});

CardActions.displayName = "CardActions";
