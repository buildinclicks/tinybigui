"use client";

import type React from "react";
import { useRef } from "react";
import { useButton, useHover, useFocusRing, mergeProps } from "react-aria";

import { cn } from "../../utils/cn";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import { modeToggleVariants, modeToggleStateLayerVariants } from "./DatePicker.variants";

/**
 * Props for the styled mode toggle button slot.
 */
export interface StyledModeToggleProps {
  "aria-label": string;
  onPress?: () => void;
  children: React.ReactNode;
  "data-input-mode"?: string;
}

/**
 * StyledModeToggle (Layer 3 slot)
 *
 * MD3-styled calendar/keyboard mode toggle button.
 * 48dp circle, on-surface-variant icon, with state layer.
 *
 * Architecture:
 * - `modeToggleVariants`           — 48dp circle, on-surface-variant, group/mode-toggle
 * - `modeToggleStateLayerVariants` — absolute opacity overlay
 *
 * @internal — used in DatePickerModalHeader styled wrapper
 */
export function StyledModeToggle({
  "aria-label": ariaLabel,
  onPress,
  children,
  "data-input-mode": dataInputMode,
}: StyledModeToggleProps): JSX.Element {
  const ref = useRef<HTMLButtonElement>(null);

  const { buttonProps } = useButton(
    {
      "aria-label": ariaLabel,
      ...(onPress ? { onPress } : {}),
    },
    ref
  );
  const { isFocusVisible, focusProps } = useFocusRing();
  const { isHovered, hoverProps } = useHover({});

  return (
    <button
      {...mergeProps(buttonProps, focusProps, hoverProps)}
      ref={ref}
      type="button"
      className={cn(modeToggleVariants())}
      data-mode-toggle
      {...(dataInputMode ? { "data-input-mode": dataInputMode } : {})}
      {...getInteractionDataAttributes({ isHovered, isFocusVisible })}
    >
      {/* State layer */}
      <span className={cn(modeToggleStateLayerVariants())} aria-hidden="true" />
      {/* Icon */}
      <span className="pointer-events-none relative z-10 flex items-center justify-center">
        {children}
      </span>
    </button>
  );
}

StyledModeToggle.displayName = "StyledModeToggle";
