"use client";

import { useRef } from "react";
import { useButton } from "react-aria";

import type { DatePickerModalHeaderProps } from "./DatePicker.types";

/**
 * Pencil/edit SVG icon for switching to keyboard input.
 * @internal
 */
function EditIcon(): JSX.Element {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  );
}

/**
 * Calendar SVG icon for switching to calendar view.
 * @internal
 */
function CalendarIcon(): JSX.Element {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
    </svg>
  );
}

/**
 * Headless DatePickerModalHeader (Layer 2)
 *
 * Renders the header section of a modal date picker:
 * - Headline text ("Select date" / "Select dates")
 * - Supporting text (formatted selected date, e.g., "Mon, Aug 17")
 * - Mode toggle icon button (calendar <-> keyboard)
 *
 * This is a headless component — it provides behavior, ARIA semantics, and
 * data attributes only. No styling classes are applied.
 *
 * @internal
 */
export function DatePickerModalHeader({
  headline = "Select date",
  supportingText,
  inputMode = "calendar",
  onModeToggle,
  headlineId,
  className,
}: DatePickerModalHeaderProps): JSX.Element {
  const toggleRef = useRef<HTMLButtonElement>(null);

  const toggleAriaLabel =
    inputMode === "calendar" ? "Switch to keyboard input" : "Switch to calendar";

  const { buttonProps: toggleButtonProps } = useButton(
    {
      "aria-label": toggleAriaLabel,
      ...(onModeToggle ? { onPress: onModeToggle } : {}),
    },
    toggleRef
  );

  return (
    <div className={className} data-modal-header>
      <div data-header-text>
        <p data-headline id={headlineId}>
          {headline}
        </p>
        {supportingText && <p data-supporting-text>{supportingText}</p>}
      </div>
      <button
        {...toggleButtonProps}
        ref={toggleRef}
        type="button"
        data-mode-toggle
        data-input-mode={inputMode}
      >
        {inputMode === "calendar" ? <EditIcon /> : <CalendarIcon />}
      </button>
    </div>
  );
}

DatePickerModalHeader.displayName = "DatePickerModalHeader";
