"use client";

import { forwardRef, useRef, useState, useCallback } from "react";
import type React from "react";
import { useHover, useFocusRing, mergeProps } from "react-aria";
import { CardHeadless } from "./CardHeadless";
import { cardVariants, cardStateLayerVariants, cardFocusRingVariants } from "./Card.variants";
import { cn } from "../../utils/cn";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import { useRipple } from "../../hooks/useRipple";
import type { CardProps } from "./Card.types";

/**
 * Material Design 3 Card Component (Layer 3: Styled).
 *
 * Wraps `CardHeadless` with MD3 visual styling using the Variants-vs-States
 * architecture: all interaction states are expressed as `data-*` attributes on
 * the root and consumed by each slot via `group-data-[x]/card` selectors — no
 * state variants live in CVA.
 *
 * ## Modes
 *
 * | Condition | Rendered as | Ripple | State layer | Focus ring |
 * |---|---|---|---|---|
 * | `onPress` or `href` provided | `role="button"` | ✅ | ✅ | ✅ |
 * | Neither provided | `role="article"` | ❌ | ❌ | ❌ |
 *
 * ## Variants & elevation per state (MD3 comp tokens)
 *
 * - **elevated** — `surface-container-low`; 1 base → 2 hover → 1 focus/pressed → 4 dragged.
 * - **filled** — `surface-container-highest`; 0 base → 1 hover → 0 focus/pressed → 3 dragged.
 * - **outlined** — `surface` + `outline-variant` border; 0 base → 1 hover → 0 focus/pressed → 3 dragged.
 *
 * ## State layer (interactive only)
 *
 * `on-surface` overlay: 8% hover, 10% focus/pressed, 16% dragged. Rendered below
 * the content (which carries `z-10`) so the surface is tinted without reducing
 * text legibility.
 *
 * ## Dragged state
 *
 * When `isDraggable` is `true`, the card tracks its own drag state via mouse
 * events and exposes it as `data-dragged`. While dragging, elevation rises to
 * its MD3 dragged level and the state layer reaches 16% opacity.
 *
 * @example
 * ```tsx
 * // Non-interactive
 * <Card variant="outlined">
 *   <CardHeader headline="Title" subheader="Subheader" />
 *   <CardContent>Body text</CardContent>
 * </Card>
 *
 * // Interactive
 * <Card variant="elevated" onPress={() => navigate('/details')} aria-label="View product details">
 *   <CardMedia src="/image.jpg" alt="Product" />
 *   <CardHeader headline="Product Name" />
 *   <CardActions>
 *     <Button variant="text">Buy Now</Button>
 *   </CardActions>
 * </Card>
 * ```
 *
 * @see https://m3.material.io/components/cards/overview
 * @see https://m3.material.io/components/cards/specs
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant = "elevated",
    onPress,
    href,
    isDraggable = false,
    isDisabled = false,
    className,
    children,
    "aria-label": ariaLabel,
  },
  ref
) {
  const internalRef = useRef<HTMLDivElement>(null);
  const resolvedRef = (ref ?? internalRef) as React.RefObject<HTMLDivElement>;

  const isInteractive = !!(onPress ?? href);

  const [isDragged, setIsDragged] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // ── Interaction state (React Aria) ──────────────────────────────────────────
  // useHover/useFocusRing are always called (Rules of Hooks); their props are
  // only attached to the root when the card is interactive.
  const { isHovered, hoverProps } = useHover({ isDisabled: !isInteractive || isDisabled });
  const { isFocusVisible, focusProps } = useFocusRing();

  const handlePressStart = useCallback(() => setIsPressed(true), []);
  const handlePressEnd = useCallback(() => setIsPressed(false), []);

  // Ripple effect (interactive, non-disabled only)
  const { onMouseDown: handleRipple, ripples } = useRipple({
    disabled: !isInteractive || isDisabled,
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLElement>): void => {
    handleRipple(e);
    if (isDraggable) setIsDragged(true);
  };

  const handleMouseUp = (): void => {
    if (isDraggable) setIsDragged(false);
  };

  const handleMouseLeave = (): void => {
    if (isDraggable) setIsDragged(false);
  };

  // Interaction data attributes (only meaningful when interactive).
  const interactionAttrs = isInteractive
    ? getInteractionDataAttributes({ isHovered, isFocusVisible, isPressed, isDisabled })
    : {};

  // React Aria hover/focus/press wiring, attached only when interactive.
  const interactiveHandlers = isInteractive
    ? mergeProps(hoverProps, focusProps, {
        onPressStart: handlePressStart,
        onPressEnd: handlePressEnd,
      })
    : {};

  return (
    <CardHeadless
      ref={resolvedRef}
      {...(onPress !== undefined && { onPress })}
      {...(href !== undefined && { href })}
      isDisabled={isDisabled}
      {...(ariaLabel !== undefined && { "aria-label": ariaLabel })}
      {...interactiveHandlers}
      {...(isInteractive && { onMouseDown: handleMouseDown })}
      {...(isInteractive &&
        isDraggable && {
          onMouseUp: handleMouseUp,
          onMouseLeave: handleMouseLeave,
        })}
      {...interactionAttrs}
      // ── Content flags (structure, NOT interaction state) ──────────────────
      data-interactive={isInteractive ? "" : undefined}
      // ── Dragged is a valid MD3 card state but is not part of the shared
      //    interaction helper, so it is set explicitly here. ─────────────────
      data-dragged={isInteractive && isDragged ? "" : undefined}
      className={cn(cardVariants({ variant }), "group/card", className)}
    >
      {/* State layer — tints the surface below the content (z-10 wrapper) */}
      {isInteractive && (
        <span
          data-testid="card-state-layer"
          aria-hidden="true"
          className={cn(cardStateLayerVariants())}
        />
      )}

      {/* Ripple — press feedback, clipped to the card shape, below content */}
      {isInteractive && ripples}

      {/* Focus ring — inset overlay above content, visible on keyboard focus */}
      {isInteractive && <span aria-hidden="true" className={cn(cardFocusRingVariants())} />}

      {/* Content — z-10 keeps slots above the state layer and ripple */}
      <div className="relative z-10">{children}</div>
    </CardHeadless>
  );
});

Card.displayName = "Card";
