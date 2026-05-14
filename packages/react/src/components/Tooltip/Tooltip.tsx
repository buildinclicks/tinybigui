"use client";

import { forwardRef } from "react";
import type { JSX } from "react";
import { cn } from "../../utils/cn";
import { useTooltipAnimation } from "./TooltipTrigger";
import { tooltipVariants } from "./Tooltip.variants";
import type { TooltipProps } from "./Tooltip.types";

/**
 * `Tooltip` — Layer 3 MD3 Plain Tooltip styled component.
 *
 * Renders a single-line text label with MD3 inverse-surface styling.
 * Animation is driven by the `TooltipAnimationContext` provided by
 * `TooltipTrigger`:
 * - Entry: `animate-md-scale-in`  (scale 0.85 + fade → natural)
 * - Exit:  `animate-md-scale-out` (natural → scale 0.85 + fade)
 *
 * MD3 Tokens applied:
 * - `bg-inverse-surface`     — inverted surface for max contrast
 * - `text-inverse-on-surface` — content color on inverted surface
 * - `rounded-xs`             — 4dp corner radius
 * - `max-w-50`               — 200dp maximum width
 * - `text-body-small`        — MD3 body-small typography
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
    const { isExiting, onAnimationEnd } = useTooltipAnimation();

    return (
      <div
        ref={ref}
        className={cn(tooltipVariants({ isVisible: !isExiting }), className)}
        onAnimationEnd={onAnimationEnd}
      >
        {children}
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";
