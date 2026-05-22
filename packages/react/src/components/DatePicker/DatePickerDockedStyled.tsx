"use client";

import { forwardRef } from "react";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../utils/cn";
import { DatePickerDocked } from "./DatePickerDocked";
import { datePickerContainerVariants } from "./DatePicker.variants";

import type { DatePickerDockedProps } from "./DatePicker.types";

/**
 * Tailwind descendant selectors for styling headless calendar elements.
 * Applied to the container that wraps CalendarCore.
 * Each selector targets internal sub-components by their DOM structure and data attributes.
 */
const CALENDAR_STYLES = [
  // ── Label ─────────────────────────────────────────────────────────────────
  "[&_[data-label]]:text-body-small",
  "[&_[data-label]]:text-on-surface-variant",
  "[&_[data-label]]:mb-1",
  "[&_[data-label]]:block",

  // ── Field group (outlined text field container) ───────────────────────────
  "[&_[data-field-group]]:flex",
  "[&_[data-field-group]]:items-center",
  "[&_[data-field-group]]:border",
  "[&_[data-field-group]]:border-outline",
  "[&_[data-field-group]]:rounded",
  "[&_[data-field-group]]:h-14",
  "[&_[data-field-group]]:px-3",
  "[&_[data-field-group]]:gap-2",
  "[&_[data-field-group]]:bg-transparent",
  "[&_[data-field-group]:focus-within]:border-primary",
  "[&_[data-field-group]:focus-within]:border-2",

  // ── Date field segments (inline rendering) ────────────────────────────────
  "[&_[data-field]]:flex",
  "[&_[data-field]]:items-center",
  "[&_[data-field]]:flex-1",
  "[&_[data-field]]:text-body-large",
  "[&_[data-field]]:text-on-surface",
  "[&_[data-segment]]:outline-none",
  "[&_[data-segment][data-placeholder]]:text-on-surface-variant",

  // ── Trigger button (calendar icon) ────────────────────────────────────────
  "[&_[data-trigger]]:flex",
  "[&_[data-trigger]]:items-center",
  "[&_[data-trigger]]:justify-center",
  "[&_[data-trigger]]:w-10",
  "[&_[data-trigger]]:h-10",
  "[&_[data-trigger]]:rounded-full",
  "[&_[data-trigger]]:text-on-surface-variant",
  "[&_[data-trigger]]:transition-colors",
  "[&_[data-trigger]]:duration-spring-standard-fast-effects",
  "[&_[data-trigger]]:ease-spring-standard-fast-effects",
  "[&_[data-trigger]:hover]:bg-on-surface/8",

  // ── Popover ───────────────────────────────────────────────────────────────
  "[&_[data-popover]]:bg-surface-container-high",
  "[&_[data-popover]]:rounded-3xl",
  "[&_[data-popover]]:mt-1",
  "[&_[data-popover]]:shadow-elevation-2",
  "[&_[data-popover]]:overflow-hidden",
  "[&_[data-popover]]:z-50",

  // ── Calendar header ───────────────────────────────────────────────────────
  "[&_[data-calendar-header]]:flex",
  "[&_[data-calendar-header]]:items-center",
  "[&_[data-calendar-header]]:justify-between",
  "[&_[data-calendar-header]]:px-3",
  "[&_[data-calendar-header]]:py-2",

  // ── Calendar title (month/year label) ─────────────────────────────────────
  "[&_[data-calendar-title]]:flex",
  "[&_[data-calendar-title]]:items-center",
  "[&_[data-calendar-title]]:gap-0.5",
  "[&_[data-calendar-title]]:bg-transparent",
  "[&_[data-calendar-title]]:border-none",
  "[&_[data-calendar-title]]:cursor-pointer",
  "[&_[data-calendar-title]]:rounded-full",
  "[&_[data-calendar-title]]:px-2",
  "[&_[data-calendar-title]]:py-1",
  "[&_[data-calendar-title]]:transition-colors",
  "[&_[data-calendar-title]]:duration-spring-standard-fast-effects",
  "[&_[data-calendar-title]]:ease-spring-standard-fast-effects",
  "[&_[data-calendar-title]:hover]:bg-on-surface/8",
  "[&_[data-calendar-title]_h2]:text-label-large",
  "[&_[data-calendar-title]_h2]:text-on-surface-variant",
  "[&_[data-calendar-title]_h2]:m-0",
  "[&_[data-calendar-title]_svg]:text-on-surface-variant",

  // ── Calendar navigation buttons ───────────────────────────────────────────
  "[&_[data-calendar-nav]]:flex",
  "[&_[data-calendar-nav]]:items-center",
  "[&_[data-calendar-nav]]:gap-1",
  "[&_[data-nav-button]]:w-10",
  "[&_[data-nav-button]]:h-10",
  "[&_[data-nav-button]]:rounded-full",
  "[&_[data-nav-button]]:flex",
  "[&_[data-nav-button]]:items-center",
  "[&_[data-nav-button]]:justify-center",
  "[&_[data-nav-button]]:text-on-surface-variant",
  "[&_[data-nav-button]]:bg-transparent",
  "[&_[data-nav-button]]:border-none",
  "[&_[data-nav-button]]:transition-colors",
  "[&_[data-nav-button]]:duration-spring-standard-fast-effects",
  "[&_[data-nav-button]]:ease-spring-standard-fast-effects",
  "[&_[data-nav-button]:hover]:bg-on-surface/8",
  "[&_[data-nav-button]:focus-visible]:bg-on-surface/10",
  "[&_[data-nav-button]:disabled]:text-on-surface/38",
  "[&_[data-nav-button]:disabled]:cursor-not-allowed",

  // ── Cell base ─────────────────────────────────────────────────────────────
  "[&_td>div]:w-[48px]",
  "[&_td>div]:h-[48px]",
  "[&_td>div]:rounded-full",
  "[&_td>div]:flex",
  "[&_td>div]:items-center",
  "[&_td>div]:justify-center",
  "[&_td>div]:text-body-large",
  "[&_td>div]:text-on-surface",
  "[&_td>div]:relative",
  "[&_td>div]:cursor-pointer",
  "[&_td>div]:select-none",
  "[&_td>div]:transition-colors",
  "[&_td>div]:duration-spring-standard-fast-effects",
  "[&_td>div]:ease-spring-standard-fast-effects",

  // ── Today (not selected) ──────────────────────────────────────────────────
  "[&_td>div[data-today]:not([data-selected])]:text-primary",
  "[&_td>div[data-today]:not([data-selected])]:border",
  "[&_td>div[data-today]:not([data-selected])]:border-primary",

  // ── Selected ──────────────────────────────────────────────────────────────
  "[&_td>div[data-selected]]:bg-primary",
  "[&_td>div[data-selected]]:text-on-primary",

  // ── Range middle ──────────────────────────────────────────────────────────
  "[&_td>div[data-range-middle]]:bg-secondary-container",
  "[&_td>div[data-range-middle]]:text-on-secondary-container",
  "[&_td>div[data-range-middle]]:rounded-none",

  // ── Outside month ─────────────────────────────────────────────────────────
  "[&_td>div[data-outside-month]:not([data-selected])]:text-on-surface-variant",

  // ── Disabled ──────────────────────────────────────────────────────────────
  "[&_td>div[data-disabled]]:text-on-surface/38",
  "[&_td>div[data-disabled]]:cursor-not-allowed",

  // ── Cell hover states ─────────────────────────────────────────────────────
  "[&_td>div:not([data-selected]):not([data-today]):not([data-disabled]):hover]:bg-on-surface/8",
  "[&_td>div[data-today]:not([data-selected]):hover]:bg-primary/8",
  "[&_td>div[data-selected]:hover]:shadow-sm",

  // ── Cell focus-visible states ─────────────────────────────────────────────
  "[&_td>div[data-focus-visible]:not([data-selected]):not([data-today])]:ring-2",
  "[&_td>div[data-focus-visible]:not([data-selected]):not([data-today])]:ring-on-surface",
  "[&_td>div[data-focus-visible]:not([data-selected]):not([data-today])]:bg-on-surface/10",
  "[&_td>div[data-today][data-focus-visible]:not([data-selected])]:bg-primary/10",

  // ── Weekday labels ────────────────────────────────────────────────────────
  "[&_th]:text-body-small",
  "[&_th]:text-on-surface",
  "[&_th]:font-normal",
  "[&_th]:w-[48px]",
  "[&_th]:h-[48px]",

  // ── Year grid ─────────────────────────────────────────────────────────────
  "[&_[data-year-grid]]:grid",
  "[&_[data-year-grid]]:grid-cols-3",
  "[&_[data-year-grid]]:gap-2",
  "[&_[data-year-grid]]:px-3",
  "[&_[data-year-grid]]:py-2",
  "[&_[data-year-grid]]:max-h-[280px]",
  "[&_[data-year-grid]]:overflow-y-auto",
  "[&_[data-year-grid]]:place-items-center",

  "[&_[data-year-item]]:w-[88px]",
  "[&_[data-year-item]]:h-[52px]",
  "[&_[data-year-item]]:rounded-full",
  "[&_[data-year-item]]:flex",
  "[&_[data-year-item]]:items-center",
  "[&_[data-year-item]]:justify-center",
  "[&_[data-year-item]]:text-body-large",
  "[&_[data-year-item]]:text-on-surface-variant",
  "[&_[data-year-item]]:bg-transparent",
  "[&_[data-year-item]]:border-none",
  "[&_[data-year-item]]:cursor-pointer",
  "[&_[data-year-item]]:transition-colors",
  "[&_[data-year-item]]:duration-spring-standard-fast-effects",
  "[&_[data-year-item]]:ease-spring-standard-fast-effects",
  "[&_[data-year-item]:hover]:bg-on-surface/8",
  "[&_[data-year-item][data-selected]]:bg-primary",
  "[&_[data-year-item][data-selected]]:text-on-primary",

  // ── Divider ───────────────────────────────────────────────────────────────
  "[&_hr[data-divider]]:border-outline-variant",

  // ── Action buttons ────────────────────────────────────────────────────────
  "[&_[data-actions]]:flex",
  "[&_[data-actions]]:items-center",
  "[&_[data-actions]]:justify-end",
  "[&_[data-actions]]:gap-2",
  "[&_[data-actions]]:px-3",
  "[&_[data-actions]]:py-2",
  "[&_[data-action]]:text-primary",
  "[&_[data-action]]:text-label-large",
  "[&_[data-action]]:rounded-full",
  "[&_[data-action]]:px-3",
  "[&_[data-action]]:py-2",
  "[&_[data-action]]:min-h-12",
  "[&_[data-action]]:bg-transparent",
  "[&_[data-action]]:border-none",
  "[&_[data-action]]:transition-colors",
  "[&_[data-action]]:duration-spring-standard-fast-effects",
  "[&_[data-action]]:ease-spring-standard-fast-effects",
  "[&_[data-action]:hover]:bg-primary/8",
  "[&_[data-action]:focus-visible]:ring-2",
  "[&_[data-action]:focus-visible]:ring-primary",
  "[&_[data-action]:focus-visible]:bg-primary/10",
].join(" ");

/**
 * Motion-specific descendant selectors for the docked date picker.
 * Applied conditionally — omitted when `prefers-reduced-motion: reduce` is active.
 *
 * Uses legacy MD3 motion tokens for screen-level container transitions
 * and emphasized easing for calendar month navigation (shared-axis motion).
 */
export const DOCKED_MOTION_STYLES = [
  // ── Popover container enter ────────────────────────────────────────────────
  "[&_[data-popover]]:transition-[transform,opacity]",
  "[&_[data-popover]]:duration-short3",
  "[&_[data-popover]]:ease-standard-decelerate",

  // ── Popover container exit ─────────────────────────────────────────────────
  "[&_[data-popover][data-exiting]]:duration-short2",
  "[&_[data-popover][data-exiting]]:ease-standard-accelerate",

  // ── Calendar month slide ───────────────────────────────────────────────────
  "[&_table]:transition-transform",
  "[&_table]:duration-medium1",
  "[&_table]:ease-emphasized-decelerate",

  // ── Cell selection animation (scale + background) ──────────────────────────
  "[&_td>div[data-selected]]:transition-[background-color,transform]",
  "[&_td>div[data-selected]]:duration-short2",
  "[&_td>div[data-selected]]:ease-standard",

  // ── State layer opacity ────────────────────────────────────────────────────
  "[&_td>div::after]:transition-opacity",
  "[&_td>div::after]:duration-short1",
  "[&_td>div::after]:ease-standard",
].join(" ");

/**
 * Styled DatePickerDocked (Layer 3)
 *
 * Wraps the headless `DatePickerDocked` with MD3 visual styling via CVA variants.
 * Applies container, calendar cell, weekday, navigation, and action button tokens.
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
          CALENDAR_STYLES,
          !reducedMotion && DOCKED_MOTION_STYLES,
          className
        )}
      />
    );
  }
);

DatePickerDockedStyled.displayName = "DatePickerDockedStyled";
