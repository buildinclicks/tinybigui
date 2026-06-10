"use client";

import { useRef } from "react";
import { useButton, useHover, useFocusRing, mergeProps } from "react-aria";

import { cn } from "../../utils/cn";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import {
  actionButtonVariants,
  actionButtonStateLayerVariants,
  actionButtonFocusRingVariants,
} from "./DatePicker.variants";

import type { ActionButtonSlotProps } from "./DatePickerActions";

/**
 * StyledActionButton (Layer 3 slot)
 *
 * MD3-styled Cancel / OK / Clear text button.
 * label-large, primary color, pill shape, with state layer + focus ring.
 *
 * Architecture:
 * - `actionButtonVariants`           — pill, label-large, text-primary, group/action-button
 * - `actionButtonStateLayerVariants` — absolute opacity overlay; bg-primary
 * - `actionButtonFocusRingVariants`  — keyboard-only outline ring
 *
 * @internal — passed to DatePickerActions via `ButtonComponent` slot
 */
export function StyledActionButton({
  label,
  "aria-label": ariaLabel,
  onPress,
  isDisabled,
  "data-action": dataAction,
}: ActionButtonSlotProps): JSX.Element {
  const ref = useRef<HTMLButtonElement>(null);

  const { buttonProps, isPressed } = useButton(
    {
      "aria-label": ariaLabel ?? label,
      isDisabled: isDisabled ?? false,
      ...(onPress ? { onPress } : {}),
    },
    ref
  );
  const { isFocusVisible, focusProps } = useFocusRing();
  const { isHovered, hoverProps } = useHover({ isDisabled: isDisabled ?? false });

  return (
    <button
      {...mergeProps(buttonProps, focusProps, hoverProps)}
      ref={ref}
      type="button"
      data-action={dataAction}
      className={cn(actionButtonVariants())}
      {...getInteractionDataAttributes({
        isHovered,
        isFocusVisible,
        isPressed,
        isDisabled: isDisabled ?? false,
      })}
    >
      {/* State layer */}
      <span className={cn(actionButtonStateLayerVariants())} aria-hidden="true" />
      {/* Focus ring */}
      <span className={cn(actionButtonFocusRingVariants())} aria-hidden="true" />
      {/* Label */}
      <span className="pointer-events-none relative z-10">{label}</span>
    </button>
  );
}

StyledActionButton.displayName = "StyledActionButton";
