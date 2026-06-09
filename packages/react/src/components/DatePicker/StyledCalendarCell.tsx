"use client";

import { cn } from "../../utils/cn";
import { CalendarCell } from "./CalendarCell";
import {
  calendarCellVariants,
  calendarCellStateLayerVariants,
  calendarCellFocusRingVariants,
} from "./DatePicker.variants";

import type { CalendarCellComponentProps } from "./CalendarGrid";

/**
 * StyledCalendarCell (Layer 3 slot)
 *
 * Wraps the headless `CalendarCell` with MD3 styling via CVA slot variants.
 * Injects the CVA class string as `className`, and renders the state-layer and
 * focus-ring overlays as children inside the cell (alongside the date text,
 * which the headless layer always renders).
 *
 * Architecture:
 * - `calendarCellVariants`          — 48dp circle, body-large, data-* state tokens
 *                                     Carries `group/calendar-cell`.
 * - `calendarCellStateLayerVariants` — absolute opacity overlay; responds to
 *                                     `group-data-[hovered|focus-visible|pressed]/calendar-cell`
 * - `calendarCellFocusRingVariants`  — absolute outline ring; keyboard-only
 *
 * @internal — passed to CalendarCore via `slots.CellComponent`
 */
export function StyledCalendarCell({ date, state }: CalendarCellComponentProps): JSX.Element {
  return (
    <CalendarCell date={date} state={state} className={cn(calendarCellVariants())}>
      {/* State layer — absolute overlay responding to data-* interaction attributes */}
      <span className={cn(calendarCellStateLayerVariants())} aria-hidden="true" />
      {/* Focus ring — keyboard-only visible outline */}
      <span className={cn(calendarCellFocusRingVariants())} aria-hidden="true" />
    </CalendarCell>
  );
}

StyledCalendarCell.displayName = "StyledCalendarCell";
