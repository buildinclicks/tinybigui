"use client";

import { forwardRef } from "react";

import { cn } from "../../utils/cn";
import { DividerHeadless } from "./DividerHeadless";
import { dividerVariants } from "./Divider.variants";
import type { DividerProps } from "./Divider.types";

/**
 * Divider — MD3 Styled Component (Layer 3)
 *
 * A thin rule that separates content in lists and containers.
 * Supports horizontal/vertical orientations, inset variants, and an
 * optional subheader label that renders the text centered between two rules.
 *
 * Built on `DividerHeadless` (React Aria `useSeparator`) for accessible
 * ARIA semantics. Uses CVA variants mapped to MD3 design tokens.
 *
 * @example
 * ```tsx
 * // Full-bleed horizontal divider
 * <Divider />
 *
 * // Inset from the start (16dp)
 * <Divider inset="start" />
 *
 * // Vertical divider inside a flex row
 * <Divider orientation="vertical" />
 *
 * // Subheader divider
 * <Divider label="Section Title" />
 * ```
 */
export const Divider = forwardRef<HTMLElement, DividerProps>(
  ({ orientation = "horizontal", inset = "none", label, className }, ref) => {
    if (label) {
      return (
        <div
          ref={ref as React.ForwardedRef<HTMLDivElement>}
          role="group"
          aria-label={label}
          className={cn("flex items-center gap-4", className)}
        >
          <DividerHeadless
            orientation="horizontal"
            className={cn(dividerVariants({ orientation: "horizontal", inset: "none" }), "flex-1")}
          />
          <span className="text-on-surface-variant text-label-large whitespace-nowrap">
            {label}
          </span>
          <DividerHeadless
            orientation="horizontal"
            className={cn(dividerVariants({ orientation: "horizontal", inset: "none" }), "flex-1")}
          />
        </div>
      );
    }

    return (
      <DividerHeadless
        ref={ref}
        orientation={orientation}
        className={cn(dividerVariants({ orientation, inset }), className)}
      />
    );
  }
);

Divider.displayName = "Divider";
