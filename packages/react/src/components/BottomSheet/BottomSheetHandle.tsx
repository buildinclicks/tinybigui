"use client";

import type { ReactElement } from "react";
import { useHover, useFocusRing, mergeProps } from "react-aria";
import { cn } from "../../utils/cn";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import { useBottomSheetContext } from "./BottomSheetHeadless";
import {
  bottomSheetHandleWrapperVariants,
  bottomSheetHandleStateLayerVariants,
  bottomSheetHandleFocusRingVariants,
  bottomSheetHandlePillVariants,
} from "./BottomSheet.variants";
import type { BottomSheetHandleProps } from "./BottomSheet.types";

/**
 * `BottomSheetHandle` — the draggable handle at the top of the Bottom Sheet.
 *
 * Implements the Variants-vs-States architecture used across TinyBigUI:
 * - Carries `group/handle` on its wrapper so child slots consume data-* selectors.
 * - Emits `getInteractionDataAttributes` for hover/focus/pressed states from React Aria.
 * - Emits `data-dragging` as a component-specific content flag (ternary encoding).
 * - Renders three slots inside the wrapper (stacked via absolute positioning):
 *   1. State layer — hover/focus/pressed/dragged opacity feedback (aria-hidden)
 *   2. Focus ring overlay — keyboard focus indicator (aria-hidden)
 *   3. Pill — the visible 32×4dp decoration (aria-hidden)
 *
 * Pointer and keyboard props are injected from `BottomSheetContext` (via `useBottomSheetDrag`).
 * React Aria `useHover` and `useFocusRing` are merged on top — they do not conflict with the
 * existing `onPointerDown`/`onPointerUp` drag handlers.
 */
function BottomSheetHandle({
  className,
  "aria-label": ariaLabelOverride,
}: BottomSheetHandleProps): ReactElement {
  const { handleProps, isDragging } = useBottomSheetContext();

  // React Aria hooks — provide hover and focus-ring interaction state booleans.
  // usePress is intentionally omitted: the drag hook's onPointerDown/onPointerUp
  // already manage pressed state semantics; using usePress alongside would conflict.
  const { isHovered, hoverProps } = useHover({});
  const { isFocusVisible, focusProps } = useFocusRing();

  // isDragging acts as the "pressed" analogue for the handle (MD3 dragged = 16% opacity).
  // We pass it as isPressed so the state layer reacts to drag at the standard pressed tier,
  // then also set data-dragging for the 16% dragged-specific override.
  const mergedHandleProps = mergeProps(handleProps, hoverProps, focusProps);

  return (
    <div
      {...mergedHandleProps}
      {...(ariaLabelOverride !== undefined ? { "aria-label": ariaLabelOverride } : {})}
      className={cn(bottomSheetHandleWrapperVariants(), "group/handle", className)}
      data-testid="bottom-sheet-handle"
      // Interaction states via shared helper (presence-based ternary encoding)
      {...getInteractionDataAttributes({
        isHovered,
        isFocusVisible,
        // Treat active drag as pressed — drives the state layer to 10% opacity
        isPressed: isDragging,
      })}
      // data-dragging is a component-specific content flag (not an interaction state)
      // driving the 16% dragged-tier opacity on the state layer
      data-dragging={isDragging ? "" : undefined}
    >
      {/* State layer — absolute, behind pill, aria-hidden */}
      <span className={cn(bottomSheetHandleStateLayerVariants())} aria-hidden="true" />

      {/* Focus ring overlay — absolute, behind pill, aria-hidden */}
      <span className={cn(bottomSheetHandleFocusRingVariants())} aria-hidden="true" />

      {/* Pill decoration — relative z-10, sits above overlays, aria-hidden */}
      <span className={cn(bottomSheetHandlePillVariants())} aria-hidden="true" />
    </div>
  );
}

BottomSheetHandle.displayName = "BottomSheetHandle";

export { BottomSheetHandle };
