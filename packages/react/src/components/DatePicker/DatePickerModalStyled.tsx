"use client";

import { forwardRef } from "react";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../utils/cn";
import { DatePickerModal } from "./DatePickerModal";
import { modalDialogVariants, scrimVariants } from "./DatePicker.variants";
import { StyledCalendarCell } from "./StyledCalendarCell";
import { StyledNavButton, StyledCalendarTitle } from "./StyledCalendarHeader";
import { StyledYearItem } from "./StyledYearItem";
import { StyledWeekday } from "./StyledWeekday";
import { StyledActionButton } from "./StyledActionButton";
import { MODAL_CONTENT_STRUCTURAL, MODAL_DIALOG_MOTION } from "./datePickerStructuralStyles";

import type { DatePickerModalProps } from "./DatePicker.types";

/**
 * Styled DatePickerModal (Layer 3)
 *
 * Wraps the headless `DatePickerModal` with MD3 visual styling.
 *
 * Architecture:
 * - `className` is applied directly on the `[data-modal-dialog]` element, so
 *   `modalDialogVariants` provides `fixed` centering immediately — no descendant
 *   selectors needed for the dialog surface or positioning.
 * - `scrimClassName` is applied directly on the `[data-scrim]` element via the
 *   new `scrimClassName` headless prop — `scrimVariants()` styles work correctly.
 * - Interactive calendar slots (cells, nav buttons, year items, action buttons)
 *   are injected as styled slot components using the two-axis CVA +
 *   group-data interaction state model.
 * - Purely structural content inside the dialog (header, calendar layout, divider,
 *   action row) uses `MODAL_CONTENT_STRUCTURAL` descendant selectors — acceptable
 *   since they are layout-only, non-interactive wrappers.
 * - Motion is guarded by `useReducedMotion` and uses screen-level legacy tokens
 *   for the modal dialog container enter/exit.
 *
 * @internal
 */
export const DatePickerModalStyled = forwardRef<HTMLDivElement, DatePickerModalProps>(
  (props, ref) => {
    const { className, ...rest } = props;
    const reducedMotion = useReducedMotion();

    return (
      <DatePickerModal
        ref={ref}
        {...rest}
        className={cn(
          modalDialogVariants({ variant: "modal" }),
          MODAL_CONTENT_STRUCTURAL,
          !reducedMotion && MODAL_DIALOG_MOTION,
          className
        )}
        scrimClassName={cn(scrimVariants())}
        slots={{
          CellComponent: StyledCalendarCell,
          NavButtonComponent: StyledNavButton,
          TitleComponent: StyledCalendarTitle,
          YearItemComponent: StyledYearItem,
          WeekdayComponent: StyledWeekday,
        }}
        ActionButtonComponent={StyledActionButton}
      />
    );
  }
);

DatePickerModalStyled.displayName = "DatePickerModalStyled";
