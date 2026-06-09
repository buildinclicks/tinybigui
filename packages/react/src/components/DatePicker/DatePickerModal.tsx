"use client";

import { forwardRef, useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOverlay, usePreventScroll, FocusScope, useDialog } from "react-aria";
import { useOverlayTriggerState } from "react-stately";

import { CalendarCore } from "./CalendarCore";
import { DatePickerModalHeader } from "./DatePickerModalHeader";
import { DatePickerActions } from "./DatePickerActions";

import type { DateValue } from "@internationalized/date";
import type { DatePickerModalProps } from "./DatePicker.types";

/**
 * Headless DatePickerModal (Layer 2)
 *
 * Full-overlay modal dialog for date selection, supporting both single-date
 * and date-range modes. Follows the MD3 Modal Date Picker specification.
 *
 * Features:
 * - Portal rendering for proper z-index stacking
 * - Focus trapping within the dialog
 * - Escape key and scrim click to dismiss
 * - `role="dialog"` with `aria-modal="true"` and `aria-labelledby`
 * - Header with headline, supporting text, and mode toggle
 * - CalendarCore for single date selection
 * - RangeCalendar for date range selection
 * - Action buttons (Clear, Cancel, OK)
 *
 * This is a headless component — it provides behavior, ARIA semantics, and
 * data attributes only. No styling classes are applied.
 *
 * @example
 * ```tsx
 * <DatePickerModal
 *   isOpen={open}
 *   onOpenChange={setOpen}
 *   onChange={(date) => console.log(date)}
 * />
 *
 * <DatePickerModal
 *   selectionMode="range"
 *   isOpen={open}
 *   onOpenChange={setOpen}
 *   onRangeChange={(range) => console.log(range)}
 * />
 * ```
 */
export const DatePickerModal = forwardRef<HTMLDivElement, DatePickerModalProps>(
  (props, forwardedRef) => {
    const {
      selectionMode = "single",
      value,
      defaultValue,
      rangeValue,
      defaultRangeValue,
      onChange,
      onRangeChange,
      minValue,
      maxValue,
      isDateUnavailable,
      isOpen,
      defaultOpen = false,
      onOpenChange,
      headline,
      supportingText,
      cancelLabel = "Cancel",
      confirmLabel = "OK",
      clearLabel = "Clear",
      showClear = true,
      onCancel,
      onConfirm,
      onClear,
      className,
      slots,
      ActionButtonComponent,
    } = props;

    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLDivElement>;
    const dialogRef = useRef<HTMLDivElement>(null);

    const headlineId = useId();
    const defaultHeadline = selectionMode === "range" ? "Select dates" : "Select date";
    const resolvedHeadline = headline ?? defaultHeadline;

    // ── Open/close state ─────────────────────────────────────────────────────

    const state = useOverlayTriggerState({
      ...(isOpen !== undefined ? { isOpen } : {}),
      defaultOpen,
      ...(onOpenChange ? { onOpenChange } : {}),
    });

    // ── Internal selection state ─────────────────────────────────────────────

    const [internalValue, setInternalValue] = useState<DateValue | null>(
      value ?? defaultValue ?? null
    );
    const [internalRangeValue, setInternalRangeValue] = useState<{
      start: DateValue;
      end: DateValue;
    } | null>(rangeValue ?? defaultRangeValue ?? null);

    const [inputMode, setInputMode] = useState<"calendar" | "keyboard">("calendar");

    // Sync controlled value
    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    useEffect(() => {
      if (rangeValue !== undefined) {
        setInternalRangeValue(rangeValue);
      }
    }, [rangeValue]);

    // Store value at time of open for cancel/revert
    const valueOnOpenRef = useRef<DateValue | null>(null);
    const rangeOnOpenRef = useRef<{ start: DateValue; end: DateValue } | null>(null);

    useEffect(() => {
      if (state.isOpen) {
        valueOnOpenRef.current = internalValue;
        rangeOnOpenRef.current = internalRangeValue;
      }
    }, [state.isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Handlers ─────────────────────────────────────────────────────────────

    const handleSingleChange = useCallback((newValue: DateValue) => {
      setInternalValue(newValue);
    }, []);

    const handleRangeChange = useCallback((newRange: { start: DateValue; end: DateValue }) => {
      setInternalRangeValue(newRange);
    }, []);

    const handleConfirm = useCallback(() => {
      if (selectionMode === "single") {
        onChange?.(internalValue);
        onConfirm?.(internalValue);
      } else {
        onRangeChange?.(internalRangeValue);
        onConfirm?.(internalRangeValue);
      }
      state.close();
    }, [
      selectionMode,
      internalValue,
      internalRangeValue,
      onChange,
      onRangeChange,
      onConfirm,
      state,
    ]);

    const handleCancel = useCallback(() => {
      setInternalValue(valueOnOpenRef.current);
      setInternalRangeValue(rangeOnOpenRef.current);
      onCancel?.();
      state.close();
    }, [onCancel, state]);

    const handleClear = useCallback(() => {
      setInternalValue(null);
      setInternalRangeValue(null);
      onClear?.();
    }, [onClear]);

    const handleModeToggle = useCallback(() => {
      setInputMode((prev) => (prev === "calendar" ? "keyboard" : "calendar"));
    }, []);

    const handleClose = useCallback(() => {
      handleCancel();
    }, [handleCancel]);

    // ── Format supporting text ───────────────────────────────────────────────

    const resolvedSupportingText = (() => {
      if (supportingText !== undefined) return supportingText;
      if (selectionMode === "single" && internalValue) {
        const date = internalValue;
        const formatter = new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });
        return formatter.format(new Date(date.year, date.month - 1, date.day));
      }
      if (selectionMode === "range" && internalRangeValue) {
        const formatter = new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
        });
        const start = formatter.format(
          new Date(
            internalRangeValue.start.year,
            internalRangeValue.start.month - 1,
            internalRangeValue.start.day
          )
        );
        const end = formatter.format(
          new Date(
            internalRangeValue.end.year,
            internalRangeValue.end.month - 1,
            internalRangeValue.end.day
          )
        );
        return `${start} – ${end}`;
      }
      return undefined;
    })();

    // ── Portal gate ──────────────────────────────────────────────────────────

    if (!state.isOpen) {
      return null;
    }

    if (typeof document === "undefined") {
      return null;
    }

    // ── Render ───────────────────────────────────────────────────────────────

    const content = (
      <FocusScope contain restoreFocus autoFocus>
        <ModalOverlay
          dialogRef={dialogRef}
          headlineId={headlineId}
          onClose={handleClose}
          {...(className ? { className } : {})}
          isOpen={state.isOpen}
        >
          <DatePickerModalHeader
            headline={resolvedHeadline}
            {...(resolvedSupportingText ? { supportingText: resolvedSupportingText } : {})}
            inputMode={inputMode}
            onModeToggle={handleModeToggle}
            headlineId={headlineId}
          />
          <hr data-divider />
          {selectionMode === "single" ? (
            <CalendarCore
              aria-label="Calendar"
              value={internalValue}
              onChange={handleSingleChange}
              {...(minValue ? { minValue } : {})}
              {...(maxValue ? { maxValue } : {})}
              {...(isDateUnavailable ? { isDateUnavailable } : {})}
              {...(slots ? { slots } : {})}
            />
          ) : (
            <CalendarCore
              aria-label="Range calendar"
              selectionMode="range"
              {...(internalRangeValue ? { rangeValue: internalRangeValue } : {})}
              {...(internalRangeValue ? { defaultRangeValue: internalRangeValue } : {})}
              onRangeChange={handleRangeChange}
              {...(minValue ? { minValue } : {})}
              {...(maxValue ? { maxValue } : {})}
              {...(isDateUnavailable ? { isDateUnavailable } : {})}
              {...(slots ? { slots } : {})}
            />
          )}
          <DatePickerActions
            cancelLabel={cancelLabel}
            confirmLabel={confirmLabel}
            clearLabel={clearLabel}
            showClear={showClear}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            onClear={handleClear}
            {...(ActionButtonComponent ? { ButtonComponent: ActionButtonComponent } : {})}
          />
        </ModalOverlay>
      </FocusScope>
    );

    return createPortal(
      <div ref={ref} data-variant="modal" data-selection-mode={selectionMode} data-open>
        {content}
      </div>,
      document.body
    ) as React.ReactElement;
  }
);

DatePickerModal.displayName = "DatePickerModal";

// ─── Internal ModalOverlay ───────────────────────────────────────────────────

interface ModalOverlayProps {
  dialogRef: React.RefObject<HTMLDivElement>;
  headlineId: string;
  onClose: () => void;
  className?: string;
  isOpen: boolean;
  children: React.ReactNode;
}

/**
 * Internal modal overlay that wires useDialog, useOverlay, usePreventScroll.
 * Renders scrim + dialog panel with proper ARIA attributes.
 * @internal
 */
function ModalOverlay({
  dialogRef,
  headlineId,
  onClose,
  className,
  isOpen,
  children,
}: ModalOverlayProps): JSX.Element {
  usePreventScroll();

  const { dialogProps } = useDialog(
    {
      "aria-labelledby": headlineId,
    },
    dialogRef
  );

  const { overlayProps } = useOverlay(
    {
      isOpen,
      onClose,
      isDismissable: true,
      shouldCloseOnBlur: false,
    },
    dialogRef
  );

  return (
    <>
      <div data-scrim aria-hidden="true" onClick={onClose} />
      <div
        {...overlayProps}
        {...dialogProps}
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headlineId}
        className={className}
        data-modal-dialog
      >
        {children}
      </div>
    </>
  );
}

ModalOverlay.displayName = "ModalOverlay";
