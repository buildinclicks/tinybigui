"use client";

import { forwardRef } from "react";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../utils/cn";
import { DatePickerDocked } from "./DatePickerDocked";
import { datePickerContainerVariants } from "./DatePicker.variants";
import { StyledCalendarCell } from "./StyledCalendarCell";
import { StyledNavButton, StyledCalendarTitle } from "./StyledCalendarHeader";
import { StyledYearItem } from "./StyledYearItem";
import { StyledWeekday } from "./StyledWeekday";
import { StyledActionButton } from "./StyledActionButton";
import { DOCKED_STRUCTURAL, DOCKED_MOTION_STRUCTURAL } from "./datePickerStructuralStyles";

import type { DatePickerDockedProps } from "./DatePicker.types";

/**
 * Styled DatePickerDocked (Layer 3)
 *
 * Wraps the headless `DatePickerDocked` with MD3 visual styling.
 *
 * Architecture:
 * - Interactive calendar slots (cells, nav buttons, year items, action buttons)
 *   are injected as styled slot components that use the two-axis CVA +
 *   group-data interaction state model (no descendant selectors for states).
 * - Purely structural wrappers (field group, popover panel, calendar header row,
 *   divider, action row container, year grid container) use a minimal consolidated
 *   `DOCKED_STRUCTURAL` descendant-selector string — acceptable for layout-only,
 *   non-interactive elements.
 * - Motion is guarded by `useReducedMotion` and uses screen-level legacy tokens
 *   for the popover container enter/exit (standard-decelerate / standard-accelerate).
 *
 * @internal
 */
export const DatePickerDockedStyled = forwardRef<HTMLDivElement, DatePickerDockedProps>(
  (props, ref) => {
    const { className, ...rest } = props;
    const reducedMotion = useReducedMotion();

    return (
      <DatePickerDocked
        ref={ref}
        {...rest}
        className={cn(
          datePickerContainerVariants({ variant: "docked" }),
          DOCKED_STRUCTURAL,
          !reducedMotion && DOCKED_MOTION_STRUCTURAL,
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

DatePickerDockedStyled.displayName = "DatePickerDockedStyled";
