"use client";

import { forwardRef, useRef } from "react";
import type React from "react";
import { useButton } from "react-aria";
import { mergeProps } from "@react-aria/utils";
import type { CardHeadlessProps } from "./Card.types";

/**
 * `CardHeadless` — Layer 2 headless primitive.
 *
 * Provides MD3 Card interaction semantics (press, keyboard activation, link
 * behavior) without any visual styling. Pure behavior — all interaction-state
 * styling is driven by the Layer 3 `Card` via forwarded `data-*` attributes.
 *
 * ## Dual-mode behavior
 *
 * | Condition | Role | Keyboard |
 * |---|---|---|
 * | `onPress` or `href` present | `role="button"` | Enter / Space activate |
 * | Neither present | `role="article"` | No activation, not a tab stop |
 *
 * `useButton` is always called (Rules of Hooks); its `buttonProps` are only
 * applied to the element when the card is interactive, so a static card adds
 * no tab stop or keyboard handlers.
 *
 * ## Prop passthrough
 *
 * Any `data-*` attributes (e.g. `data-hovered`, `data-pressed`, `data-dragged`,
 * `data-interactive`) and DOM event handlers (`onMouseDown`, `onFocus`, …) are
 * spread onto the root element so the styled layer can drive `group-data-[x]/card`
 * selectors and ripple/drag tracking.
 *
 * @example
 * ```tsx
 * // Interactive
 * <CardHeadless onPress={handlePress} aria-label="View details" className="rounded-xl p-4">
 *   Card content
 * </CardHeadless>
 *
 * // Static
 * <CardHeadless className="rounded-xl p-4">Card content</CardHeadless>
 * ```
 */
export const CardHeadless = forwardRef<HTMLDivElement, CardHeadlessProps>(function CardHeadless(
  { className, children, onMouseDown, onMouseUp, onMouseLeave, ...rest },
  forwardedRef
) {
  const internalRef = useRef<HTMLDivElement>(null);

  // Prefer the forwarded ref; fall back to internal ref for React Aria hooks.
  const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLDivElement>;

  const isInteractive = !!(rest.onPress ?? rest.href);

  // Always call the hook unconditionally (Rules of Hooks). buttonProps are only
  // applied to the element when isInteractive is true.
  const { buttonProps } = useButton({ elementType: "div", ...rest }, ref);

  // Strip React Aria press/disabled/link props that must not land on the DOM.
  // Everything left in `htmlAttrs` (data-*, aria-label, forwarded handlers) is
  // safe to spread onto the root element.
  const {
    isDisabled: _isDisabled,
    onPress: _onPress,
    onPressStart: _onPressStart,
    onPressEnd: _onPressEnd,
    onPressChange: _onPressChange,
    onPressUp: _onPressUp,
    href: _href,
    target: _target,
    rel: _rel,
    ...htmlAttrs
  } = rest as Record<string, unknown>;

  const mouseHandlers = { onMouseDown, onMouseUp, onMouseLeave };

  if (isInteractive) {
    const interactiveProps = mergeProps(buttonProps, mouseHandlers, htmlAttrs, { className });

    return (
      <div {...interactiveProps} ref={ref}>
        {children}
      </div>
    );
  }

  return (
    <div role="article" className={className} ref={ref} {...mouseHandlers} {...htmlAttrs}>
      {children}
    </div>
  );
});

CardHeadless.displayName = "CardHeadless";
