"use client";

import { forwardRef } from "react";

import { cn } from "../../utils/cn";
import { DatePickerModalInput } from "./DatePickerModalInput";
import { modalDialogVariants, scrimVariants } from "./DatePicker.variants";
import { StyledActionButton } from "./StyledActionButton";
import { MODAL_INPUT_CONTENT_STRUCTURAL } from "./datePickerStructuralStyles";

import type { DatePickerModalInputProps } from "./DatePicker.types";

/**
 * Styled DatePickerModalInput (Layer 3)
 *
 * Wraps the headless `DatePickerModalInput` with MD3 visual styling.
 *
 * Architecture:
 * - `className` is applied directly on the `[data-modal-dialog]` element, so
 *   `modalDialogVariants` provides `fixed` centering immediately — no descendant
 *   selectors needed for the dialog surface or positioning.
 * - `scrimClassName` is applied directly on the `[data-scrim]` element via the
 *   new `scrimClassName` headless prop — `scrimVariants()` styles work correctly.
 * - Action buttons are injected via the `ActionButtonComponent` slot using the
 *   two-axis CVA + group-data interaction state model.
 * - Structural content inside the dialog (header, date input fields, divider,
 *   action row container) uses `MODAL_INPUT_CONTENT_STRUCTURAL` descendant
 *   selectors — acceptable for layout-only, non-interactive wrappers.
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
          modalDialogVariants({ variant: "modal-input" }),
          MODAL_INPUT_CONTENT_STRUCTURAL,
          className
        )}
        scrimClassName={cn(scrimVariants())}
        ActionButtonComponent={StyledActionButton}
      />
    );
  }
);

DatePickerModalInputStyled.displayName = "DatePickerModalInputStyled";
