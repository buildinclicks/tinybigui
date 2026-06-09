"use client";

import { forwardRef } from "react";

import { cn } from "../../utils/cn";
import { DatePickerModalInput } from "./DatePickerModalInput";
import { datePickerContainerVariants } from "./DatePicker.variants";
import { StyledActionButton } from "./StyledActionButton";
import { MODAL_INPUT_STRUCTURAL } from "./datePickerStructuralStyles";

import type { DatePickerModalInputProps } from "./DatePicker.types";

/**
 * Styled DatePickerModalInput (Layer 3)
 *
 * Wraps the headless `DatePickerModalInput` with MD3 visual styling.
 *
 * Architecture:
 * - Action buttons are injected via the `ActionButtonComponent` slot using the
 *   two-axis CVA + group-data interaction state model.
 * - Structural wrappers (modal dialog, scrim, header, date input fields, divider,
 *   action row container) use a minimal consolidated `MODAL_INPUT_STRUCTURAL`
 *   descendant-selector string.
 * - No `useReducedMotion` gating needed — modal-input has no calendar month
 *   navigation animations (keyboard-only input, no calendar grid).
 *
 * @internal
 */
export const DatePickerModalInputStyled = forwardRef<HTMLDivElement, DatePickerModalInputProps>(
  (props, ref) => {
    const { className, ...rest } = props;

    return (
      <DatePickerModalInput
        ref={ref}
        {...rest}
        className={cn(
          datePickerContainerVariants({ variant: "modal-input" }),
          MODAL_INPUT_STRUCTURAL,
          className
        )}
        ActionButtonComponent={StyledActionButton}
      />
    );
  }
);

DatePickerModalInputStyled.displayName = "DatePickerModalInputStyled";
