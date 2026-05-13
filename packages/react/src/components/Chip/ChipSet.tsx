import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import type { ChipSetProps } from "./Chip.types";

/**
 * Material Design 3 ChipSet Container
 *
 * A layout wrapper that arranges chips in a flowing flex row with
 * consistent 8dp gap. Renders as a `<div>` — no additional ARIA semantics
 * are required per MD3 spec (the individual chips carry their own roles).
 *
 * @example
 * ```tsx
 * <ChipSet>
 *   <Chip type="filter" label="React" />
 *   <Chip type="filter" label="TypeScript" />
 *   <Chip type="filter" label="Tailwind" />
 * </ChipSet>
 * ```
 */
export const ChipSet = forwardRef<HTMLDivElement, ChipSetProps>(({ className, children }, ref) => (
  <div ref={ref} className={cn("flex flex-wrap gap-2", className)}>
    {children}
  </div>
));

ChipSet.displayName = "ChipSet";
