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
 * or a count pill. Applies the `badgeVariants` base classes and sets
 * content/visibility data flags directly on the element.
 *
 * Content flags (structural — not interaction state):
 *   `data-dot`       → element is a dot badge (no count)
 *   `data-invisible` → element is hidden (scale-0)
 *
 * Motion:
 *   `transition-transform duration-expressive-fast-spatial ease-expressive-fast-spatial`
 *   is applied when `reducedMotion` is false (component-level guard, per
 *   md3-motion.mdc: JS-driven animations must guard at the component level).
 *
 * Uses `role="status"` so screen readers announce changes to the count.
 */
export const BadgeContent = forwardRef<HTMLSpanElement, BadgeContentProps>(
  (
    {
      count,
      max = 999,
      invisible = false,
      "aria-label": ariaLabelOverride,
      reducedMotion = false,
      className,
    },
    ref
  ) => {
    const isDot = count === undefined;
    const displayValue = getDisplayValue(count, max);
    const ariaLabel = getAriaLabel(count, ariaLabelOverride);

    return (
      <span
        ref={ref}
        role="status"
        aria-label={ariaLabel}
        // ── Content flag: dot vs count ──────────────────────────────────────
        data-dot={isDot ? "" : undefined}
        // ── Visibility runtime flag ─────────────────────────────────────────
        data-invisible={invisible ? "" : undefined}
        className={cn(
          badgeVariants(),
          // MD3 Expressive spatial motion for show/hide scale animation.
          // Spatial pairing: scale transform → expressive-fast-spatial token.
          // Guarded at the component level; do NOT use CSS-only reduced-motion
          // because this is a JS-conditional class, not a persistent transition.
          !reducedMotion &&
            "duration-expressive-fast-spatial ease-expressive-fast-spatial transition-transform",
          className
        )}
      >
        {displayValue}
      </span>
    );
  }
);

BadgeContent.displayName = "BadgeContent";
