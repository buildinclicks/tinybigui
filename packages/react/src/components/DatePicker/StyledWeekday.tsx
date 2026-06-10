"use client";

import { cn } from "../../utils/cn";
import { weekdayVariants } from "./DatePicker.variants";

/**
 * StyledWeekday (Layer 3 slot)
 *
 * MD3-styled weekday column header cell.
 * body-small, on-surface-variant, 48dp width and height, centered.
 *
 * @internal — passed to CalendarCore via `slots.WeekdayComponent`
 */
export function StyledWeekday({ label }: { label: string }): JSX.Element {
  return <span className={cn(weekdayVariants())}>{label}</span>;
}

StyledWeekday.displayName = "StyledWeekday";
