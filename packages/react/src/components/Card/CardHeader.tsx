import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import type { CardHeaderProps } from "./Card.types";

/**
 * `CardHeader` — Headline and subheader slot sub-component (Layer 3).
 *
 * Renders the primary headline (`h3`) and an optional subheader (`p`) per MD3 spec.
 * Default padding is `p-4` (16dp). When stacked directly after another slot
 * (e.g., `CardMedia`), consumers should apply `pt-0` to reduce top padding
 * per the MD3 adjacent-slot spacing rule.
 *
 * @example
 * ```tsx
 * <CardHeader headline="Card title" subheader="Supporting text" />
 *
 * // Stacked after CardMedia — reduce top padding
 * <>
 *   <CardMedia src="/hero.jpg" alt="Hero" aspectRatio="16/9" />
 *   <CardHeader className="pt-0" headline="Card title" subheader="Supporting text" />
 * </>
 * ```
 *
 * @see https://m3.material.io/components/cards/specs
 */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(function CardHeader(
  { headline, subheader, className },
  ref
) {
  return (
    <div ref={ref} className={cn("p-4", className)}>
      <h3 className="text-on-surface text-title-large">{headline}</h3>
      {subheader !== undefined && (
        <p className="text-on-surface-variant text-body-medium mt-1">{subheader}</p>
      )}
    </div>
  );
});

CardHeader.displayName = "CardHeader";
