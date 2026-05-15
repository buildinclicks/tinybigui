"use client";

import { forwardRef } from "react";
import { BadgeHeadless } from "./BadgeHeadless";
import { BadgeContent } from "./BadgeContent";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { BadgeProps } from "./Badge.types";

/**
 * Material Design 3 Badge Component (Layer 3: Styled)
 *
 * Composes `BadgeHeadless` (positioning wrapper) with `BadgeContent`
 * (dot or count indicator). Automatically hides the badge when
 * `count` is `0` or `invisible` is `true`.
 *
 * Respects `prefers-reduced-motion` — transitions are omitted when
 * the user has requested reduced motion.
 *
 * @example
 * ```tsx
 * // Dot badge
 * <Badge>
 *   <IconButton icon={<BellIcon />} aria-label="Notifications" />
 * </Badge>
 *
 * // Count badge
 * <Badge count={5}>
 *   <IconButton icon={<BellIcon />} aria-label="Notifications" />
 * </Badge>
 *
 * // Capped at 99
 * <Badge count={150} max={99}>
 *   <IconButton icon={<MailIcon />} aria-label="Messages" />
 * </Badge>
 * ```
 */
export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      count,
      max = 999,
      color = "error",
      invisible = false,
      "aria-label": ariaLabel,
      className,
      children,
    },
    ref
  ) => {
    const isReduced = useReducedMotion();
    const shouldShow = !invisible && (count === undefined || count > 0);

    return (
      <BadgeHeadless ref={ref} {...(className ? { className } : {})}>
        {children}
        <BadgeContent
          {...(count !== undefined ? { count } : {})}
          max={max}
          color={color}
          invisible={!shouldShow}
          {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
          reducedMotion={isReduced}
        />
      </BadgeHeadless>
    );
  }
);

Badge.displayName = "Badge";
