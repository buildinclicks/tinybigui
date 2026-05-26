"use client";

import { forwardRef } from "react";
import type { ForwardedRef } from "react";
import { useSeparator } from "react-aria";

import type { DividerHeadlessProps } from "./Divider.types";

/**
 * DividerHeadless — Layer 2 unstyled separator primitive.
 *
 * Uses React Aria's `useSeparator` hook to attach the correct
 * `role="separator"` and `aria-orientation` attributes.
 *
 * - Horizontal → renders `<hr>` (implicit ARIA separator role)
 * - Vertical   → renders `<div>` with explicit `role="separator"`
 *
 * Bring your own styles via the `className` prop.
 *
 * @example
 * ```tsx
 * // Used inside the styled Divider, or directly for custom styling:
 * <DividerHeadless
 *   orientation="horizontal"
 *   className="border-t border-outline-variant w-full"
 * />
 * ```
 */
export const DividerHeadless = forwardRef<HTMLElement, DividerHeadlessProps>(
  ({ orientation = "horizontal", className }, ref) => {
    const { separatorProps } = useSeparator({
      orientation,
      elementType: orientation === "vertical" ? "div" : "hr",
    });

    if (orientation === "vertical") {
      return (
        <div {...separatorProps} ref={ref as ForwardedRef<HTMLDivElement>} className={className} />
      );
    }

    return (
      <hr
        {...separatorProps}
        aria-orientation="horizontal"
        ref={ref as ForwardedRef<HTMLHRElement>}
        className={className}
      />
    );
  }
);

DividerHeadless.displayName = "DividerHeadless";
