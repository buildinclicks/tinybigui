"use client";

import { cn } from "../../utils/cn";
import { TimePickerDial } from "./TimePickerDial";
import { timePickerContainerVariants } from "./TimePicker.variants";

import type { TimePickerDialProps } from "./TimePicker.types";

/**
 * Tailwind descendant selectors for styling the headless TimePickerDial elements.
 * Each selector targets internal sub-components by their data attributes.
 */
const DIAL_STYLES = [
  // ── Headline ──────────────────────────────────────────────────────────────────
  "[&_[data-headline]]:text-label-medium",
  "[&_[data-headline]]:text-on-surface-variant",

  // ── Time selector ─────────────────────────────────────────────────────────────
  "[&_[data-time-selector]]:flex",
  "[&_[data-time-selector]]:items-center",

  // Time selector fields (hour/minute)
  "[&_[data-time-field]]:w-[96px]",
  "[&_[data-time-field]]:h-[80px]",
  "[&_[data-time-field]]:rounded-lg",
  "[&_[data-time-field]]:flex",
  "[&_[data-time-field]]:items-center",
  "[&_[data-time-field]]:justify-center",
  "[&_[data-time-field]]:text-display-large",
  "[&_[data-time-field]]:cursor-pointer",
  "[&_[data-time-field]]:transition-colors",
  "[&_[data-time-field]]:duration-spring-standard-fast-effects",
  "[&_[data-time-field]]:ease-spring-standard-fast-effects",
  "[&_[data-time-field]]:bg-surface-container-highest",
  "[&_[data-time-field]]:text-on-surface",
  "[&_[data-time-field][data-selected]]:bg-primary-container",
  "[&_[data-time-field][data-selected]]:text-on-primary-container",
  "[&_[data-time-field]:not([data-selected]):hover]:bg-surface-container-highest/80",
  "[&_[data-time-field][data-selected]:hover]:bg-primary-container/80",

  // Separator colon
  "[&_[data-time-separator]]:text-display-large",
  "[&_[data-time-separator]]:text-on-surface",
  "[&_[data-time-separator]]:select-none",
  "[&_[data-time-separator]]:px-1",

  // ── Period selector ───────────────────────────────────────────────────────────
  "[&_[data-period-selector]]:rounded-lg",
  "[&_[data-period-selector]]:border",
  "[&_[data-period-selector]]:border-outline",
  "[&_[data-period-selector]]:overflow-hidden",
  "[&_[data-period-selector]]:flex",
  '[&_[data-period-selector][data-orientation="vertical"]]:w-[52px]',
  '[&_[data-period-selector][data-orientation="vertical"]]:h-[80px]',
  '[&_[data-period-selector][data-orientation="vertical"]]:flex-col',
  '[&_[data-period-selector][data-orientation="horizontal"]]:w-[216px]',
  '[&_[data-period-selector][data-orientation="horizontal"]]:h-[38px]',
  '[&_[data-period-selector][data-orientation="horizontal"]]:flex-row',
  "[&_[data-period-selector]]:ml-3",

  // Period items (AM/PM)
  '[&_[data-period-selector]>[role="radio"]]:flex-1',
  '[&_[data-period-selector]>[role="radio"]]:flex',
  '[&_[data-period-selector]>[role="radio"]]:items-center',
  '[&_[data-period-selector]>[role="radio"]]:justify-center',
  '[&_[data-period-selector]>[role="radio"]]:text-title-medium',
  '[&_[data-period-selector]>[role="radio"]]:cursor-pointer',
  '[&_[data-period-selector]>[role="radio"]]:border-outline',
  '[&_[data-period-selector]>[role="radio"]]:transition-colors',
  '[&_[data-period-selector]>[role="radio"]]:duration-spring-standard-fast-effects',
  '[&_[data-period-selector]>[role="radio"]]:ease-spring-standard-fast-effects',
  '[&_[data-period-selector]>[role="radio"]]:text-on-surface-variant',
  '[&_[data-period-selector]>[role="radio"][data-selected]]:bg-tertiary-container',
  '[&_[data-period-selector]>[role="radio"][data-selected]]:text-on-tertiary-container',
  '[&_[data-period-selector]>[role="radio"][data-selected]]:border-transparent',
  '[&_[data-period-selector]>[role="radio"]:not([data-selected]):hover]:bg-on-surface-variant/8',

  // ── Clock dial ────────────────────────────────────────────────────────────────
  "[&_[data-clock-dial]]:w-[256px]",
  "[&_[data-clock-dial]]:h-[256px]",
  "[&_[data-clock-dial]]:rounded-full",
  "[&_[data-clock-dial]]:bg-surface-container-highest",
  "[&_[data-clock-dial]]:mx-auto",

  // Clock numbers
  "[&_[data-clock-number]]:w-[48px]",
  "[&_[data-clock-number]]:h-[48px]",
  "[&_[data-clock-number]]:rounded-full",
  "[&_[data-clock-number]]:flex",
  "[&_[data-clock-number]]:items-center",
  "[&_[data-clock-number]]:justify-center",
  "[&_[data-clock-number]]:text-body-large",
  "[&_[data-clock-number]]:cursor-pointer",
  "[&_[data-clock-number]]:transition-colors",
  "[&_[data-clock-number]]:duration-spring-standard-fast-effects",
  "[&_[data-clock-number]]:ease-spring-standard-fast-effects",
  "[&_[data-clock-number]]:text-on-surface",
  "[&_[data-clock-number][data-selected]]:bg-primary",
  "[&_[data-clock-number][data-selected]]:text-on-primary",
  "[&_[data-clock-number][data-selected]]:z-10",
  "[&_[data-clock-number]:not([data-selected]):hover]:bg-on-surface/8",

  // ── Clock hand ────────────────────────────────────────────────────────────────
  "[&_[data-clock-hand]]:absolute",
  "[&_[data-clock-hand]]:top-1/2",
  "[&_[data-clock-hand]]:left-1/2",
  "[&_[data-clock-hand]]:origin-bottom",

  "[&_[data-clock-hand-center]]:absolute",
  "[&_[data-clock-hand-center]]:top-1/2",
  "[&_[data-clock-hand-center]]:left-1/2",
  "[&_[data-clock-hand-center]]:-translate-x-1/2",
  "[&_[data-clock-hand-center]]:-translate-y-1/2",
  "[&_[data-clock-hand-center]]:w-[8px]",
  "[&_[data-clock-hand-center]]:h-[8px]",
  "[&_[data-clock-hand-center]]:rounded-full",
  "[&_[data-clock-hand-center]]:bg-primary",
  "[&_[data-clock-hand-center]]:z-20",

  "[&_[data-clock-hand-track]]:absolute",
  "[&_[data-clock-hand-track]]:top-1/2",
  "[&_[data-clock-hand-track]]:left-1/2",
  "[&_[data-clock-hand-track]]:w-[2px]",
  "[&_[data-clock-hand-track]]:bg-primary",
  "[&_[data-clock-hand-track]]:origin-bottom",
  "[&_[data-clock-hand-track]]:z-10",

  "[&_[data-clock-hand-handle]]:w-[48px]",
  "[&_[data-clock-hand-handle]]:h-[48px]",
  "[&_[data-clock-hand-handle]]:rounded-full",
  "[&_[data-clock-hand-handle]]:bg-primary",
  "[&_[data-clock-hand-handle]]:flex",
  "[&_[data-clock-hand-handle]]:items-center",
  "[&_[data-clock-hand-handle]]:justify-center",
  "[&_[data-clock-hand-handle]]:text-on-primary",
  "[&_[data-clock-hand-handle]]:text-body-large",

  // ── Actions ───────────────────────────────────────────────────────────────────
  "[&_[data-actions]]:flex",
  "[&_[data-actions]]:items-center",
  "[&_[data-actions]]:justify-end",
  "[&_[data-actions]]:gap-2",

  "[&_[data-action]]:text-primary",
  "[&_[data-action]]:text-label-large",
  "[&_[data-action]]:rounded-full",
  "[&_[data-action]]:px-3",
  "[&_[data-action]]:py-2",
  "[&_[data-action]]:transition-colors",
  "[&_[data-action]]:duration-spring-standard-fast-effects",
  "[&_[data-action]]:ease-spring-standard-fast-effects",
  "[&_[data-action]:hover]:bg-primary/8",
  "[&_[data-action]:focus-visible]:bg-primary/10",

  // Mode toggle
  '[&_[data-action="mode-toggle"]]:text-on-surface-variant',
  '[&_[data-action="mode-toggle"]]:mr-auto',
  '[&_[data-action="mode-toggle"]]:w-12',
  '[&_[data-action="mode-toggle"]]:h-12',
  '[&_[data-action="mode-toggle"]]:flex',
  '[&_[data-action="mode-toggle"]]:items-center',
  '[&_[data-action="mode-toggle"]]:justify-center',
  '[&_[data-action="mode-toggle"]:hover]:bg-on-surface-variant/8',
].join(" ");

/**
 * Styled TimePickerDial (Layer 3)
 *
 * Wraps the headless `TimePickerDial` with MD3 visual styling via CVA variants
 * and descendant selectors. Applies container, clock dial, time selector,
 * period selector, clock hand, and action button tokens.
 *
 * @internal
 */
export function TimePickerDialStyled(props: TimePickerDialProps): JSX.Element {
  const { className, orientation = "vertical", ...rest } = props;

  return (
    <TimePickerDial
      {...rest}
      orientation={orientation}
      className={cn(
        timePickerContainerVariants({ variant: "dial", orientation }),
        DIAL_STYLES,
        className
      )}
    />
  );
}

TimePickerDialStyled.displayName = "TimePickerDialStyled";
