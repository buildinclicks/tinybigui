"use client";

import { forwardRef } from "react";
import type { JSX } from "react";
import { cn } from "../../utils/cn";
import { useTooltipAnimation } from "./TooltipTrigger";
import {
  richTooltipVariants,
  richTooltipTitleVariants,
  richTooltipSupportingTextVariants,
  richTooltipActionsVariants,
} from "./Tooltip.variants";
import type { TooltipAnimationState } from "./Tooltip.variants";
import type { RichTooltipProps } from "./Tooltip.types";

/**
 * `RichTooltip` — Layer 3 MD3 Rich Tooltip styled component.
 *
 * Supports an optional title (subhead), multi-line supporting text, and an
 * optional action button per MD3 Rich Tooltip specification.
 * Animation is driven by the `TooltipAnimationContext` provided by
 * `TooltipTrigger`:
 * - Entry: `animate-md-scale-in`  (expressive-fast-spatial: 350ms)
 * - Exit:  `animate-md-scale-out` (emphasized-accelerate: 200ms)
 * - None:  no animation class when `prefers-reduced-motion: reduce` is active
 *
 * MD3 Tokens applied — container:
 * - `bg-surface-container`   — surface container background
 * - `text-on-surface`        — base content colour
 * - `shadow-elevation-2`     — MD3 elevation level 2
 * - `rounded-md`             — 12dp corner radius (CornerMedium)
 * - `max-w-80`               — 320dp maximum width
 * - `px-4 py-3`              — 16dp × 12dp padding
 *
 * MD3 Tokens applied — subhead (title):
 * - `text-title-small`        — TitleSmall typescale
 * - `text-on-surface-variant` — subhead colour role per MD3 spec
 *
 * MD3 Tokens applied — supporting text:
 * - `text-body-medium`        — BodyMedium typescale
 * - `text-on-surface-variant` — same colour role as subhead
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
    const { isExiting, onAnimationEnd, reducedMotion } = useTooltipAnimation();

    const animation: TooltipAnimationState = reducedMotion ? "none" : isExiting ? "exit" : "enter";

    return (
      <div
        ref={ref}
        className={cn(richTooltipVariants({ animation }), className)}
        onAnimationEnd={onAnimationEnd}
      >
        {title && <p className={richTooltipTitleVariants()}>{title}</p>}
        <p className={richTooltipSupportingTextVariants()}>{children}</p>
        {action && <div className={richTooltipActionsVariants()}>{action}</div>}
      </div>
    );
  }
);

RichTooltip.displayName = "RichTooltip";
