"use client";

import { forwardRef } from "react";
import { badgeVariants } from "./Badge.variants";
import { cn } from "../../utils/cn";
import type { BadgeContentProps } from "./Badge.types";

/**
 * Derives the visible text for the badge indicator.
 *
 * - No `count` → empty string (dot badge, no text)
 * - `count` ≤ `max` → count as string
 * - `count` > `max` → `"${max}+"`
 */
const getDisplayValue = (count: number | undefined, max: number): string => {
  if (count === undefined) return "";
  return count > max ? `${max}+` : count.toString();
};

/**
 * Derives the accessible label for the badge indicator.
 *
 * - Explicit override → use as-is
 * - No `count` → `"New"`
 * - With `count` → `"${count} notifications"`
 */
const getAriaLabel = (count: number | undefined, override: string | undefined): string => {
  if (override) return override;
  return count === undefined ? "New" : `${count} notifications`;
};

/**
 * Badge Content Indicator
 *
 * Renders the badge's visual element — either a small dot (no count)
 * or a count pill. Applies CVA variants for size, color, and visibility.
 *
 * Uses `role="status"` so screen readers announce changes to the count.
 */
export const BadgeContent = forwardRef<HTMLSpanElement, BadgeContentProps>(
  (
    {
      count,
      max = 999,
      color = "error",
      invisible = false,
      "aria-label": ariaLabelOverride,
      reducedMotion = false,
      className,
    },
    ref
  ) => {
    const size = count === undefined ? "small" : "large";
    const displayValue = getDisplayValue(count, max);
    const ariaLabel = getAriaLabel(count, ariaLabelOverride);

    return (
      <span
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        className={cn(badgeVariants({ size, color, invisible, reducedMotion }), className)}
      >
        {displayValue}
      </span>
    );
  }
);

BadgeContent.displayName = "BadgeContent";
