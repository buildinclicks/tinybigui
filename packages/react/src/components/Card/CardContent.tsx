import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import type { CardContentProps } from "./Card.types";

/**
 * `CardContent` — Body content slot sub-component (Layer 3).
 *
 * Renders the main body area of the card with `p-4` (16dp) padding per MD3 spec.
 * No forced text styling is applied — consumers control typography of children.
 *
 * @example
 * ```tsx
 * <CardContent>
 *   <p>Supporting text about the card content.</p>
 * </CardContent>
 * ```
 *
 * @see https://m3.material.io/components/cards/specs
 */
export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(function CardContent(
  { children, className },
  ref
) {
  return (
    <div ref={ref} className={cn("p-4", className)}>
      {children}
    </div>
  );
});

CardContent.displayName = "CardContent";
