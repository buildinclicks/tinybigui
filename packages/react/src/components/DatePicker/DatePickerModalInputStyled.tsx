"use client";

import { forwardRef } from "react";

import { cn } from "../../utils/cn";
import { DatePickerModalInput } from "./DatePickerModalInput";
import { datePickerContainerVariants } from "./DatePicker.variants";

import type { DatePickerModalInputProps } from "./DatePicker.types";

/**
 * Tailwind descendant selectors for styling the modal-input date picker's internal elements.
 */
const MODAL_INPUT_STYLES = [
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
  "[&_[data-modal-dialog]]:w-[328px]",

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
  "[&_[data-supporting-text]]:mt-4",
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

  // ── Date input fields ─────────────────────────────────────────────────────
  "[&_[data-date-input-field]]:px-6",
  "[&_[data-date-input-field]]:py-2",

  "[&_[data-date-input-field]_[data-field]]:flex",
  "[&_[data-date-input-field]_[data-field]]:items-center",
  "[&_[data-date-input-field]_[data-field]]:border",
  "[&_[data-date-input-field]_[data-field]]:border-outline",
  "[&_[data-date-input-field]_[data-field]]:rounded-sm",
  "[&_[data-date-input-field]_[data-field]]:px-4",
  "[&_[data-date-input-field]_[data-field]]:py-3",
  "[&_[data-date-input-field]_[data-field]]:text-body-large",
  "[&_[data-date-input-field]_[data-field]]:text-on-surface",

  "[&_[data-date-input-field]_[data-segment]]:outline-none",
  "[&_[data-date-input-field]_[data-segment][data-placeholder]]:text-on-surface-variant",

  "[&_[data-date-input-field][data-focused]_[data-field]]:border-primary",
  "[&_[data-date-input-field][data-focused]_[data-field]]:border-2",

  "[&_[data-date-input-field][data-invalid]_[data-field]]:border-error",

  "[&_[data-date-input-field]_[data-label]]:text-body-small",
  "[&_[data-date-input-field]_[data-label]]:text-on-surface-variant",

  "[&_[data-date-input-field]_[data-error-message]]:text-body-small",
  "[&_[data-date-input-field]_[data-error-message]]:text-error",
  "[&_[data-date-input-field]_[data-error-message]]:mt-1",

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
  "[&_[data-action]]:bg-transparent",
  "[&_[data-action]]:border-none",
  "[&_[data-action]]:transition-colors",
  "[&_[data-action]]:duration-spring-standard-fast-effects",
  "[&_[data-action]]:ease-spring-standard-fast-effects",
  "[&_[data-action]:hover]:bg-primary/8",
].join(" ");

/**
 * Styled DatePickerModalInput (Layer 3)
 *
 * Wraps the headless `DatePickerModalInput` with MD3 visual styling.
 * Applies modal-input container, scrim, header, input field, and action button tokens.
 *
 * @internal
 */
export const DatePickerModalInputStyled = forwardRef<HTMLDivElement, DatePickerModalInputProps>(
  (props, ref) => {
    const { className, ...rest } = props;

    return (
      <DatePickerModalInput
        ref={ref}
        {...rest}
        className={cn(
          datePickerContainerVariants({ variant: "modal-input" }),
          MODAL_INPUT_STYLES,
          className
        )}
      />
    );
  }
);

DatePickerModalInputStyled.displayName = "DatePickerModalInputStyled";
