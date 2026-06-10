"use client";

import { forwardRef } from "react";
import type { JSX } from "react";
import { cn } from "../../utils/cn";
import { useTooltipAnimation } from "./TooltipTrigger";
import { tooltipVariants } from "./Tooltip.variants";
import type { TooltipAnimationState } from "./Tooltip.variants";
import type { TooltipProps } from "./Tooltip.types";

/**
 * `Tooltip` — Layer 3 MD3 Plain Tooltip styled component.
 *
 * Renders a single-line text label with MD3 inverse-surface styling.
 * Animation is driven by the `TooltipAnimationContext` provided by
 * `TooltipTrigger`:
 * - Entry: `animate-md-scale-in`  (expressive-fast-spatial: 350ms, scale 0.85 → 1 + fade)
 * - Exit:  `animate-md-scale-out` (emphasized-accelerate: 200ms, scale 1 → 0.85 + fade)
 * - None:  no animation class when `prefers-reduced-motion: reduce` is active
 *
 * MD3 Tokens applied:
 * - `bg-inverse-surface`      — inverted surface for maximum contrast
 * - `text-inverse-on-surface` — content colour on inverted surface
 * - `rounded-xs`              — 4dp corner radius (CornerExtraSmall)
 * - `text-body-small`         — BodySmall typescale (12sp)
 * - `min-h-6`                 — 24dp minimum height
 * - `max-w-50`                — 200dp maximum width
 * - `px-2 py-1`               — 8dp × 4dp padding
 *
 * Must be used as the second child of `TooltipTrigger`.
 *
 * @example
 * ```tsx
 * <TooltipTrigger delay={300}>
 *   <button>Save</button>
 *   <Tooltip placement="top">Save file</Tooltip>
 * </TooltipTrigger>
 * ```
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, className, placement: _placement }, ref): JSX.Element => {
    const { isExiting, onAnimationEnd, reducedMotion } = useTooltipAnimation();

    const animation: TooltipAnimationState = reducedMotion ? "none" : isExiting ? "exit" : "enter";

    return (
      <div
        ref={ref}
        className={cn(tooltipVariants({ animation }), className)}
        onAnimationEnd={onAnimationEnd}
      >
        {children}
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";
