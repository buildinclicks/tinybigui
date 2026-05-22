"use client";

import { useReducedMotion } from "../../hooks/useReducedMotion";
import { cn } from "../../utils/cn";
import { TimePickerInput } from "./TimePickerInput";
import { timePickerContainerVariants } from "./TimePicker.variants";

import type { TimePickerInputProps } from "./TimePicker.types";

/**
 * Tailwind descendant selectors for styling the headless TimePickerInput elements.
 * Each selector targets internal sub-components by their data attributes.
 */
const INPUT_STYLES = [
  // ── Headline ──────────────────────────────────────────────────────────────────
  "[&_[data-headline]]:text-label-medium",
  "[&_[data-headline]]:text-on-surface-variant",
  "[&_[data-headline]]:mb-4",

  // ── Input row ─────────────────────────────────────────────────────────────────
  "[&_[data-input-row]]:flex",
  "[&_[data-input-row]]:items-center",

  // Time input fields
  "[&_[data-time-input-field]]:w-[96px]",
  "[&_[data-time-input-field]]:h-[72px]",
  "[&_[data-time-input-field]]:rounded-lg",
  "[&_[data-time-input-field]]:flex",
  "[&_[data-time-input-field]]:flex-col",
  "[&_[data-time-input-field]]:items-center",
  "[&_[data-time-input-field]]:justify-center",
  "[&_[data-time-input-field]]:cursor-text",
  "[&_[data-time-input-field]]:transition-colors",
  "[&_[data-time-input-field]]:duration-spring-standard-fast-effects",
  "[&_[data-time-input-field]]:ease-spring-standard-fast-effects",
  "[&_[data-time-input-field]]:bg-surface-container-highest",
  "[&_[data-time-input-field]]:text-on-surface",

  // Input field value text
  "[&_[data-time-input-field]_[data-value]]:text-display-large",

  // Input field supporting text
  "[&_[data-time-input-field]_[data-supporting-text]]:text-body-small",
  "[&_[data-time-input-field]_[data-supporting-text]]:text-on-surface-variant",

  // Focused state (selected)
  "[&_[data-time-input-field][data-focused]]:bg-primary-container",
  "[&_[data-time-input-field][data-focused]]:text-on-primary-container",
  "[&_[data-time-input-field][data-focused]]:border-2",
  "[&_[data-time-input-field][data-focused]]:border-primary",

  // Focus-visible ring
  "[&_[data-time-input-field]:focus-visible]:ring-2",
  "[&_[data-time-input-field]:focus-visible]:ring-primary",

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
  '[&_[data-period-selector]>[role="radio"][data-focus-visible]]:ring-2',
  '[&_[data-period-selector]>[role="radio"][data-focus-visible]]:ring-primary',

  // ── Actions ───────────────────────────────────────────────────────────────────
  "[&_[data-actions]]:flex",
  "[&_[data-actions]]:items-center",
  "[&_[data-actions]]:justify-end",
  "[&_[data-actions]]:gap-2",
  "[&_[data-actions]]:mt-4",

  "[&_[data-action]]:text-primary",
  "[&_[data-action]]:text-label-large",
  "[&_[data-action]]:rounded-full",
  "[&_[data-action]]:px-3",
  "[&_[data-action]]:py-2",
  "[&_[data-action]]:min-h-12",
  "[&_[data-action]]:transition-colors",
  "[&_[data-action]]:duration-spring-standard-fast-effects",
  "[&_[data-action]]:ease-spring-standard-fast-effects",
  "[&_[data-action]:hover]:bg-primary/8",
  "[&_[data-action]:focus-visible]:bg-primary/10",
  "[&_[data-action]:focus-visible]:ring-2",
  "[&_[data-action]:focus-visible]:ring-primary",

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
 * Motion-specific descendant selectors for the time picker input variant.
 * Applied conditionally — omitted when `prefers-reduced-motion: reduce` is active.
 */
export const INPUT_MOTION_STYLES = [
  // ── Time input field focus ───────────────────────────────────────────────────
  "[&_[data-time-input-field][data-focused]]:duration-short2",
  "[&_[data-time-input-field][data-focused]]:ease-standard",

  // ── Period selector toggle ───────────────────────────────────────────────────
  '[&_[data-period-selector]>[role="radio"][data-selected]]:duration-short2',
  '[&_[data-period-selector]>[role="radio"][data-selected]]:ease-standard',
].join(" ");

/**
 * Styled TimePickerInput (Layer 3)
 *
 * Wraps the headless `TimePickerInput` with MD3 visual styling via CVA variants
 * and descendant selectors. Applies container, time input fields, separator,
 * period selector, and action button tokens.
 *
 * @internal
 */
export function TimePickerInputStyled(props: TimePickerInputProps): JSX.Element {
  const { className, ...rest } = props;
  const reducedMotion = useReducedMotion();

  return (
    <TimePickerInput
      {...rest}
      className={cn(
        timePickerContainerVariants({ variant: "input", orientation: "vertical" }),
        INPUT_STYLES,
        !reducedMotion && INPUT_MOTION_STYLES,
        className
      )}
    />
  );
}

TimePickerInputStyled.displayName = "TimePickerInputStyled";
