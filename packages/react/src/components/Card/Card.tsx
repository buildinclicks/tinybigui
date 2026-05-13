"use client";

import { forwardRef, useState } from "react";
import type React from "react";
import { CardHeadless } from "./CardHeadless";
import { cardVariants } from "./Card.variants";
import { cn } from "../../utils/cn";
import { useRipple } from "../../hooks/useRipple";
import type { CardProps } from "./Card.types";

/**
 * `Card` — Layer 3 MD3 Styled Card Component.
 *
 * Wraps `CardHeadless` with Material Design 3 visual styling: elevation shadows,
 * state layer, ripple feedback, and all three card variants.
 *
 * ## Modes
 *
 * | Condition | Rendered as | Ripple | State layer |
 * |---|---|---|---|
 * | `onPress` or `href` provided | `role="button"` | ✅ | ✅ |
 * | Neither provided | `role="article"` | ❌ | ❌ |
 *
 * ## Variants
 *
 * - **elevated** — `surface-container-low` background, elevation 1dp at rest (2dp on hover).
 * - **filled** — `surface-container-highest` background, no elevation.
 * - **outlined** — `surface` background, `outline-variant` border, no elevation.
 *
 * ## Dragged state
 *
 * When `isDraggable` is `true`, the card tracks its own drag state via mouse events.
 * While dragging, the `elevated` variant jumps to elevation 4dp using a slower,
 * decelerate transition curve per MD3 motion spec.
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
  const isInteractive = !!(onPress ?? href);

  const [isDragged, setIsDragged] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

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

  const handlePressStart = (): void => setIsPressed(true);
  const handlePressEnd = (): void => setIsPressed(false);

  return (
    <CardHeadless
      ref={ref}
      {...(onPress !== undefined && { onPress })}
      {...(href !== undefined && { href })}
      isDisabled={isDisabled}
      {...(ariaLabel !== undefined && { "aria-label": ariaLabel })}
      onPressStart={handlePressStart}
      onPressEnd={handlePressEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className={cn(
        cardVariants({ variant, isInteractive, isDragged, isDisabled }),
        "group",
        className
      )}
    >
      {/* State layer — rendered below content via DOM order; pointer-events-none passes clicks through */}
      {isInteractive && (
        <div
          data-testid="card-state-layer"
          data-pressed={isPressed ? "" : undefined}
          aria-hidden="true"
          className={cn(
            "bg-on-surface pointer-events-none absolute inset-0 rounded-md",
            "opacity-0 group-hover:opacity-8 hover:opacity-8 data-[pressed]:opacity-12",
            "duration-spring-standard-fast-effects ease-spring-standard-fast-effects transition-opacity"
          )}
        />
      )}

      {/* Ripple — rendered below content via DOM order */}
      {isInteractive && ripples}

      {/* Slot content — painted on top of state layer and ripple via DOM stacking order */}
      {children}
    </CardHeadless>
  );
});

Card.displayName = "Card";
