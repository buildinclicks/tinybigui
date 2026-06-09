"use client";

import { forwardRef } from "react";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../utils/cn";
import { DatePickerModal } from "./DatePickerModal";
import { datePickerContainerVariants } from "./DatePicker.variants";
import { StyledCalendarCell } from "./StyledCalendarCell";
import { StyledNavButton, StyledCalendarTitle } from "./StyledCalendarHeader";
import { StyledYearItem } from "./StyledYearItem";
import { StyledWeekday } from "./StyledWeekday";
import { StyledActionButton } from "./StyledActionButton";
import { MODAL_STRUCTURAL, MODAL_MOTION_STRUCTURAL } from "./datePickerStructuralStyles";

import type { DatePickerModalProps } from "./DatePicker.types";

/**
 * Styled DatePickerModal (Layer 3)
 *
 * Wraps the headless `DatePickerModal` with MD3 visual styling.
 *
 * Architecture:
 * - Interactive calendar slots (cells, nav buttons, year items, action buttons)
 *   are injected as styled slot components using the two-axis CVA +
 *   group-data interaction state model.
 * - Purely structural wrappers (modal dialog, scrim, header, divider, action
 *   row container, year grid container) use a minimal consolidated
 *   `MODAL_STRUCTURAL` descendant-selector string.
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
          datePickerContainerVariants({ variant: "modal" }),
          MODAL_STRUCTURAL,
          !reducedMotion && MODAL_MOTION_STRUCTURAL,
          className
        )}
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
