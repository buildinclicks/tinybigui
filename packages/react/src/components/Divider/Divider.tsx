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
 * Supports horizontal/vertical orientations and four inset variants.
 *
 * Built on `DividerHeadless` (React Aria `useSeparator`) for accessible
 * ARIA semantics. Uses CVA variants mapped to MD3 design tokens.
 *
 * Thickness is controlled via the `--md-divider-thickness` CSS custom property
 * (default `1px`, matching the MD3 1dp spec). Override with a `style` prop:
 *
 * ```tsx
 * <Divider style={{ "--md-divider-thickness": "2px" }} />
 * ```
 *
 * @example
 * ```tsx
 * // Full-bleed horizontal divider
 * <Divider />
 *
 * // Inset from inline-start (RTL-aware, 16dp)
 * <Divider inset="start" />
 *
 * // Vertical divider inside a flex row
 * <Divider orientation="vertical" />
 *
 * // Custom thickness
 * <Divider style={{ "--md-divider-thickness": "2px" }} />
 * ```
 */
export const Divider = forwardRef<HTMLElement, DividerProps>(
  ({ orientation = "horizontal", inset = "none", className, style }, ref) => (
    <DividerHeadless
      ref={ref}
      orientation={orientation}
      className={cn(dividerVariants({ orientation, inset }), className)}
      {...(style !== undefined && { style })}
    />
  )
);

Divider.displayName = "Divider";
