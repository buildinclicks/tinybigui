"use client";

import { forwardRef } from "react";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../utils/cn";
import { DatePickerModal } from "./DatePickerModal";
import { datePickerContainerVariants } from "./DatePicker.variants";

import type { DatePickerModalProps } from "./DatePicker.types";

/**
 * Tailwind descendant selectors for styling the modal date picker's internal elements.
 */
const MODAL_STYLES = [
  // ── Container structure ───────────────────────────────────────────────────
  "[&_[data-modal-dialog]]:bg-surface-container-high",
  "[&_[data-modal-dialog]]:rounded-3xl",
  "[&_[data-modal-dialog]]:overflow-hidden",
  "[&_[data-modal-dialog]]:fixed",
  "[&_[data-modal-dialog]]:top-1/2",
  "[&_[data-modal-dialog]]:left-1/2",
  "[&_[data-modal-dialog]]:-translate-x-1/2",
  "[&_[data-modal-dialog]]:-translate-y-1/2",
  "[&_[data-modal-dialog]]:z-50",
  "[&_[data-modal-dialog]]:w-[360px]",
  "[&_[data-modal-dialog]]:max-h-[90vh]",
  "[&_[data-modal-dialog]]:overflow-y-auto",

  // ── Header ────────────────────────────────────────────────────────────────
  "[&_[data-modal-header]]:px-6",
  "[&_[data-modal-header]]:pt-4",
  "[&_[data-modal-header]]:pb-3",
  "[&_[data-modal-header]]:flex",
  "[&_[data-modal-header]]:items-start",
  "[&_[data-modal-header]]:justify-between",

  "[&_[data-headline]]:text-label-large",
  "[&_[data-headline]]:text-on-surface-variant",
  "[&_[data-headline]]:m-0",

  "[&_[data-supporting-text]]:text-headline-large",
  "[&_[data-supporting-text]]:text-on-surface",
  "[&_[data-supporting-text]]:mt-9",
  "[&_[data-supporting-text]]:m-0",

  "[&_[data-mode-toggle]]:w-12",
  "[&_[data-mode-toggle]]:h-12",
  "[&_[data-mode-toggle]]:rounded-full",
  "[&_[data-mode-toggle]]:flex",
  "[&_[data-mode-toggle]]:items-center",
  "[&_[data-mode-toggle]]:justify-center",
  "[&_[data-mode-toggle]]:text-on-surface-variant",
  "[&_[data-mode-toggle]]:bg-transparent",
  "[&_[data-mode-toggle]]:border-none",
  "[&_[data-mode-toggle]]:self-end",
  "[&_[data-mode-toggle]]:transition-colors",
  "[&_[data-mode-toggle]]:duration-spring-standard-fast-effects",
  "[&_[data-mode-toggle]]:ease-spring-standard-fast-effects",
  "[&_[data-mode-toggle]:hover]:bg-on-surface-variant/8",

  // ── Divider ───────────────────────────────────────────────────────────────
  "[&_hr[data-divider]]:border-outline-variant",

  // ── Calendar header ───────────────────────────────────────────────────────
  "[&_[data-calendar-header]]:flex",
  "[&_[data-calendar-header]]:items-center",
  "[&_[data-calendar-header]]:justify-between",
  "[&_[data-calendar-header]]:px-3",
  "[&_[data-calendar-header]]:py-2",

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

  // ── Calendar cells ────────────────────────────────────────────────────────
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

  "[&_td>div[data-today]:not([data-selected])]:text-primary",
  "[&_td>div[data-today]:not([data-selected])]:border",
  "[&_td>div[data-today]:not([data-selected])]:border-primary",
  "[&_td>div[data-selected]]:bg-primary",
  "[&_td>div[data-selected]]:text-on-primary",
  "[&_td>div[data-range-middle]]:bg-secondary-container",
  "[&_td>div[data-range-middle]]:text-on-secondary-container",
  "[&_td>div[data-range-middle]]:rounded-none",
  "[&_td>div[data-outside-month]:not([data-selected])]:text-on-surface-variant",
  "[&_td>div[data-disabled]]:text-on-surface/38",
  "[&_td>div[data-disabled]]:cursor-not-allowed",

  "[&_td>div:not([data-selected]):not([data-today]):not([data-disabled]):hover]:bg-on-surface/8",
  "[&_td>div[data-today]:not([data-selected]):hover]:bg-primary/8",
  "[&_td>div[data-selected]:hover]:shadow-sm",

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

  // ── Scrim ─────────────────────────────────────────────────────────────────
  "[&_[data-scrim]]:fixed",
  "[&_[data-scrim]]:inset-0",
  "[&_[data-scrim]]:z-40",
  "[&_[data-scrim]]:bg-scrim",
  "[&_[data-scrim]]:opacity-32",
  "[&_[data-scrim]]:transition-opacity",
  "[&_[data-scrim]]:duration-medium2",
  "[&_[data-scrim]]:ease-standard",

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
 * Motion-specific descendant selectors for the modal date picker.
 * Applied conditionally — omitted when `prefers-reduced-motion: reduce` is active.
 *
 * Uses legacy MD3 motion tokens for screen-level container enter/exit
 * and emphasized easing for calendar month shared-axis navigation.
 */
export const MODAL_MOTION_STYLES = [
  // ── Modal container enter ──────────────────────────────────────────────────
  "[&_[data-modal-dialog]]:transition-[transform,opacity]",
  "[&_[data-modal-dialog]]:duration-medium2",
  "[&_[data-modal-dialog]]:ease-standard-decelerate",

  // ── Modal container exit ───────────────────────────────────────────────────
  "[&_[data-modal-dialog][data-exiting]]:duration-medium1",
  "[&_[data-modal-dialog][data-exiting]]:ease-standard-accelerate",

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
 * Styled DatePickerModal (Layer 3)
 *
 * Wraps the headless `DatePickerModal` with MD3 visual styling.
 * Applies modal container, scrim, header, calendar, and action button tokens.
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
          MODAL_STYLES,
          !reducedMotion && MODAL_MOTION_STYLES,
          className
        )}
      />
    );
  }
);

DatePickerModalStyled.displayName = "DatePickerModalStyled";
