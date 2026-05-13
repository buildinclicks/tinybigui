"use client";

import { forwardRef, useRef } from "react";
import type React from "react";
import { useButton, useFocusRing } from "react-aria";
import { mergeProps } from "@react-aria/utils";
import type { CardHeadlessProps } from "./Card.types";

/**
 * `CardHeadless` — Layer 2 headless primitive.
 *
 * Provides all MD3 Card interaction semantics without any visual styling.
 *
 * ## Dual-mode behavior
 *
 * | Condition | Role | Keyboard | Focus ring |
 * |---|---|---|---|
 * | `onPress` or `href` present | `role="button"` | Enter / Space activate | `data-focus-visible="true"` on keyboard focus |
 * | Neither present | `role="article"` | No activation | Not applicable |
 *
 * Both `useButton` and `useFocusRing` are **always** called (React Rules of Hooks).
 * When the card is non-interactive, `buttonProps` are not spread onto the element
 * so no keyboard interaction or tab-stop is added.
 *
 * ## Focus ring
 *
 * The `data-focus-visible` attribute is set to `"true"` only when focus was
 * triggered by keyboard navigation (`useFocusRing` → `isFocusVisible`).
 * Mouse/touch focus leaves the attribute unset. The styled Card layer reads
 * this attribute to conditionally render the MD3 focus ring.
 *
 * @example
 * ```tsx
 * // Interactive
 * <CardHeadless
 *   onPress={handlePress}
 *   aria-label="View details"
 *   className="rounded-xl p-4"
 * >
 *   Card content
 * </CardHeadless>
 *
 * // Static
 * <CardHeadless className="rounded-xl p-4">
 *   Card content
 * </CardHeadless>
 * ```
 */
export const CardHeadless = forwardRef<HTMLDivElement, CardHeadlessProps>(function CardHeadless(
  { className, children, ...ariaButtonProps },
  forwardedRef
) {
  const internalRef = useRef<HTMLDivElement>(null);

  // Prefer the forwarded ref; fall back to internal ref for React Aria hooks.
  const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLDivElement>;

  const isInteractive = !!(ariaButtonProps.onPress ?? ariaButtonProps.href);

  // Always call both hooks unconditionally (Rules of Hooks).
  // All AriaButtonProps flow through the spread to satisfy exactOptionalPropertyTypes —
  // explicitly re-listing optional props as `key: value` would force `T | undefined`
  // onto required positions and cause TS2769.
  // `buttonProps` is only applied to the element when isInteractive is true.
  const { buttonProps } = useButton({ elementType: "div", ...ariaButtonProps }, ref);

  const { focusProps, isFocusVisible } = useFocusRing();

  if (isInteractive) {
    const interactiveProps = mergeProps(buttonProps, focusProps, {
      className,
      "data-focus-visible": isFocusVisible ? "true" : undefined,
    });

    return (
      <div {...interactiveProps} ref={ref}>
        {children}
      </div>
    );
  }

  return (
    <div role="article" className={className} ref={ref}>
      {children}
    </div>
  );
});

CardHeadless.displayName = "CardHeadless";
