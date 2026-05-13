"use client";

import { forwardRef } from "react";
import type { JSX } from "react";
import { cn } from "../../utils/cn";
import { useTooltipAnimation } from "./TooltipTrigger";
import { richTooltipVariants } from "./Tooltip.variants";
import type { RichTooltipProps } from "./Tooltip.types";

/**
 * `RichTooltip` — Layer 3 MD3 Rich Tooltip styled component.
 *
 * Supports an optional title, multi-line supporting text, and an optional
 * action button per MD3 Rich Tooltip specification.
 * Animation is driven by the `TooltipAnimationContext` provided by
 * `TooltipTrigger`:
 * - Entry: `animate-md-scale-in`  (scale 0.85 + fade → natural)
 * - Exit:  `animate-md-scale-out` (natural → scale 0.85 + fade)
 *
 * MD3 Tokens applied:
 * - `bg-surface-container`  — surface container background
 * - `text-on-surface`       — content color on surface
 * - `shadow-elevation-2`    — MD3 elevation level 2
 * - `rounded-md`            — medium corner radius
 * - `max-w-80`              — 320dp maximum width
 *
 * Must be used as the second child of `TooltipTrigger`.
 *
 * @example
 * ```tsx
 * <TooltipTrigger delay={300}>
 *   <button>Add to list</button>
 *   <RichTooltip
 *     title="Add to list"
 *     action={<Button variant="text">Learn more</Button>}
 *   >
 *     Saved items appear in your personal list.
 *   </RichTooltip>
 * </TooltipTrigger>
 * ```
 */
export const RichTooltip = forwardRef<HTMLDivElement, RichTooltipProps>(
  ({ title, children, action, className, placement: _placement }, ref): JSX.Element => {
    const { isExiting, onAnimationEnd } = useTooltipAnimation();

    return (
      <div
        ref={ref}
        className={cn(richTooltipVariants({ isVisible: !isExiting }), className)}
        onAnimationEnd={onAnimationEnd}
      >
        {title && <p className="text-on-surface text-title-small mb-1">{title}</p>}
        <p className="text-on-surface-variant text-body-medium">{children}</p>
        {action && action}
      </div>
    );
  }
);

RichTooltip.displayName = "RichTooltip";
