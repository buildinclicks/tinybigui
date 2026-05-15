"use client";

import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import type { BadgeHeadlessProps } from "./Badge.types";

/**
 * Headless Badge Wrapper (Layer 2)
 *
 * Provides the structural `relative inline-flex` container that
 * positions badge content absolutely over the host element.
 * Unstyled beyond positioning — bring your own badge indicator.
 *
 * @example
 * ```tsx
 * <BadgeHeadless>
 *   <IconButton icon={<BellIcon />} aria-label="Notifications" />
 *   <span className="absolute -top-1 -right-1 ...">3</span>
 * </BadgeHeadless>
 * ```
 */
export const BadgeHeadless = forwardRef<HTMLDivElement, BadgeHeadlessProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("relative inline-flex", className)} {...props}>
        {children}
      </div>
    );
  }
);

BadgeHeadless.displayName = "BadgeHeadless";
