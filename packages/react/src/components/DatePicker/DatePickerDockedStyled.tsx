"use client";

import { forwardRef } from "react";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../utils/cn";
import { DatePickerDocked } from "./DatePickerDocked";
import { datePickerContainerVariants, popoverVariants } from "./DatePicker.variants";
import { StyledCalendarCell } from "./StyledCalendarCell";
import { StyledNavButton, StyledCalendarTitle } from "./StyledCalendarHeader";
import { StyledYearItem } from "./StyledYearItem";
import { StyledWeekday } from "./StyledWeekday";
import { StyledActionButton } from "./StyledActionButton";
import {
  DOCKED_ROOT_STRUCTURAL,
  DOCKED_POPOVER_PANEL_STRUCTURAL,
  DOCKED_POPOVER_MOTION,
} from "./datePickerStructuralStyles";

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
 * - Purely structural wrappers on the root (field group, label, trigger) and on
 *   the portaled popover panel (calendar header row, divider, action row) use
 *   consolidated descendant-selector strings — acceptable for layout-only,
 *   non-interactive elements.
 * - The calendar popover is portaled to `document.body` so it is never clipped
 *   by ancestor overflow containers (forms, Storybook story blocks, etc.).
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
          DOCKED_ROOT_STRUCTURAL,
          className
        )}
        popoverClassName={cn(
          popoverVariants(),
          DOCKED_POPOVER_PANEL_STRUCTURAL,
          !reducedMotion && DOCKED_POPOVER_MOTION
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
