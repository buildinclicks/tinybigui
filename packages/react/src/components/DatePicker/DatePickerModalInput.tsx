"use client";

import { forwardRef, useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOverlay, usePreventScroll, FocusScope, useDialog } from "react-aria";
import { useOverlayTriggerState } from "react-stately";

import { DateInputField } from "./DateInputField";
import { DatePickerModalHeader } from "./DatePickerModalHeader";
import { DatePickerActions } from "./DatePickerActions";

import type { DateValue } from "@internationalized/date";
import type { DatePickerModalInputProps } from "./DatePicker.types";

/**
 * Headless DatePickerModalInput (Layer 2)
 *
 * Modal dialog for manual keyboard entry of dates via outlined text fields.
 * Supports single-date and range-date input modes with validation.
 *
 * Features:
 * - Portal rendering for proper z-index stacking
 * - Focus trapping within the dialog
 * - Auto-focus first input field on open
 * - Escape key and scrim click to dismiss
 * - `role="dialog"` with `aria-modal="true"` and `aria-labelledby`
 * - Header with headline, supporting text, and mode toggle
 * - One or two outlined date input fields
 * - Validation feedback for invalid date input
 * - OK button disabled when input is invalid
 * - Action buttons (Cancel, OK)
 *
 * This is a headless component — it provides behavior, ARIA semantics, and
 * data attributes only. No styling classes are applied.
 *
 * @example
 * ```tsx
 * <DatePickerModalInput
 *   isOpen={open}
 *   onOpenChange={setOpen}
 *   onChange={(date) => console.log(date)}
 * />
 *
 * <DatePickerModalInput
 *   selectionMode="range"
 *   isOpen={open}
 *   onOpenChange={setOpen}
 *   onRangeChange={(range) => console.log(range)}
 * />
 * ```
 */
export const DatePickerModalInput = forwardRef<HTMLDivElement, DatePickerModalInputProps>(
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
      isOpen,
      defaultOpen = false,
      onOpenChange,
      headline,
      supportingText,
      cancelLabel = "Cancel",
      confirmLabel = "OK",
      onCancel,
      onConfirm,
      onModeToggle,
      className,
    } = props;

    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLDivElement>;
    const dialogRef = useRef<HTMLDivElement>(null);

    const headlineId = useId();

    const defaultHeadline = selectionMode === "range" ? "Select dates" : "Select date";
    const resolvedHeadline = headline ?? defaultHeadline;

    const defaultSupportingText = selectionMode === "range" ? "Enter dates" : "Enter date";
    const resolvedSupportingText = supportingText ?? defaultSupportingText;

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
    const [internalStartValue, setInternalStartValue] = useState<DateValue | null>(
      rangeValue?.start ?? defaultRangeValue?.start ?? null
    );
    const [internalEndValue, setInternalEndValue] = useState<DateValue | null>(
      rangeValue?.end ?? defaultRangeValue?.end ?? null
    );

    // Sync controlled values
    useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    useEffect(() => {
      if (rangeValue !== undefined) {
        setInternalStartValue(rangeValue?.start ?? null);
        setInternalEndValue(rangeValue?.end ?? null);
      }
    }, [rangeValue]);

    // Store value at time of open for cancel/revert
    const valueOnOpenRef = useRef<DateValue | null>(null);
    const startOnOpenRef = useRef<DateValue | null>(null);
    const endOnOpenRef = useRef<DateValue | null>(null);

    useEffect(() => {
      if (state.isOpen) {
        valueOnOpenRef.current = internalValue;
        startOnOpenRef.current = internalStartValue;
        endOnOpenRef.current = internalEndValue;
      }
    }, [state.isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

    // ── Validation ───────────────────────────────────────────────────────────

    const isDateValid = useCallback(
      (date: DateValue | null): boolean => {
        if (!date) return false;
        if (minValue && date.compare(minValue) < 0) return false;
        if (maxValue && date.compare(maxValue) > 0) return false;
        return true;
      },
      [minValue, maxValue]
    );

    const isSingleValid = selectionMode === "single" && isDateValid(internalValue);

    const isRangeValid = (() => {
      if (selectionMode !== "range") return false;
      if (!internalStartValue || !internalEndValue) return false;
      if (!isDateValid(internalStartValue) || !isDateValid(internalEndValue)) return false;
      if (internalEndValue.compare(internalStartValue) < 0) return false;
      return true;
    })();

    const isFormValid = selectionMode === "single" ? isSingleValid : isRangeValid;

    // ── Handlers ─────────────────────────────────────────────────────────────

    const handleSingleChange = useCallback((newValue: DateValue | null) => {
      setInternalValue(newValue);
    }, []);

    const handleStartChange = useCallback((newValue: DateValue | null) => {
      setInternalStartValue(newValue);
    }, []);

    const handleEndChange = useCallback((newValue: DateValue | null) => {
      setInternalEndValue(newValue);
    }, []);

    const handleConfirm = useCallback(() => {
      if (!isFormValid) return;

      if (selectionMode === "single") {
        onChange?.(internalValue);
        onConfirm?.(internalValue);
      } else {
        const range =
          internalStartValue && internalEndValue
            ? { start: internalStartValue, end: internalEndValue }
            : null;
        onRangeChange?.(range);
        onConfirm?.(range);
      }
      state.close();
    }, [
      isFormValid,
      selectionMode,
      internalValue,
      internalStartValue,
      internalEndValue,
      onChange,
      onRangeChange,
      onConfirm,
      state,
    ]);

    const handleCancel = useCallback(() => {
      setInternalValue(valueOnOpenRef.current);
      setInternalStartValue(startOnOpenRef.current);
      setInternalEndValue(endOnOpenRef.current);
      onCancel?.();
      state.close();
    }, [onCancel, state]);

    const handleModeToggle = useCallback(() => {
      onModeToggle?.();
    }, [onModeToggle]);

    const handleClose = useCallback(() => {
      handleCancel();
    }, [handleCancel]);

    // ── Validation error messages ────────────────────────────────────────────

    const getSingleErrorMessage = (): string | undefined => {
      if (!internalValue) return undefined;
      if (minValue && internalValue.compare(minValue) < 0) {
        return "Date is before minimum allowed date";
      }
      if (maxValue && internalValue.compare(maxValue) > 0) {
        return "Date is after maximum allowed date";
      }
      return undefined;
    };

    const getStartErrorMessage = (): string | undefined => {
      if (!internalStartValue) return undefined;
      if (minValue && internalStartValue.compare(minValue) < 0) {
        return "Date is before minimum allowed date";
      }
      if (maxValue && internalStartValue.compare(maxValue) > 0) {
        return "Date is after maximum allowed date";
      }
      return undefined;
    };

    const getEndErrorMessage = (): string | undefined => {
      if (!internalEndValue) return undefined;
      if (minValue && internalEndValue.compare(minValue) < 0) {
        return "Date is before minimum allowed date";
      }
      if (maxValue && internalEndValue.compare(maxValue) > 0) {
        return "Date is after maximum allowed date";
      }
      if (internalStartValue && internalEndValue.compare(internalStartValue) < 0) {
        return "End date must be after start date";
      }
      return undefined;
    };

    const singleErrorMessage = getSingleErrorMessage();
    const startErrorMessage = getStartErrorMessage();
    const endErrorMessage = getEndErrorMessage();

    const isSingleInvalid = !!singleErrorMessage;
    const isStartInvalid = !!startErrorMessage;
    const isEndInvalid = !!endErrorMessage;

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
        <ModalInputOverlay
          dialogRef={dialogRef}
          headlineId={headlineId}
          onClose={handleClose}
          {...(className ? { className } : {})}
          isOpen={state.isOpen}
        >
          <DatePickerModalHeader
            headline={resolvedHeadline}
            supportingText={resolvedSupportingText}
            inputMode="keyboard"
            onModeToggle={handleModeToggle}
            headlineId={headlineId}
          />
          <hr data-divider />
          {selectionMode === "single" ? (
            <DateInputField
              label="Date"
              placeholder="mm/dd/yyyy"
              value={internalValue}
              onChange={handleSingleChange}
              {...(minValue ? { minValue } : {})}
              {...(maxValue ? { maxValue } : {})}
              isInvalid={isSingleInvalid}
              errorMessage={singleErrorMessage}
              autoFocus
            />
          ) : (
            <>
              <DateInputField
                label="Start date"
                placeholder="mm/dd/yyyy"
                value={internalStartValue}
                onChange={handleStartChange}
                {...(minValue ? { minValue } : {})}
                {...(maxValue ? { maxValue } : {})}
                isInvalid={isStartInvalid}
                errorMessage={startErrorMessage}
                autoFocus
              />
              <DateInputField
                label="End date"
                placeholder="mm/dd/yyyy"
                value={internalEndValue}
                onChange={handleEndChange}
                {...(minValue ? { minValue } : {})}
                {...(maxValue ? { maxValue } : {})}
                isInvalid={isEndInvalid}
                errorMessage={endErrorMessage}
              />
            </>
          )}
          <DatePickerActions
            cancelLabel={cancelLabel}
            confirmLabel={confirmLabel}
            onCancel={handleCancel}
            onConfirm={handleConfirm}
            isConfirmDisabled={!isFormValid}
          />
        </ModalInputOverlay>
      </FocusScope>
    );

    return createPortal(
      <div ref={ref} data-variant="modal-input" data-selection-mode={selectionMode} data-open>
        {content}
      </div>,
      document.body
    ) as React.ReactElement;
  }
);

DatePickerModalInput.displayName = "DatePickerModalInput";

// ─── Internal ModalInputOverlay ─────────────────────────────────────────────

interface ModalInputOverlayProps {
  dialogRef: React.RefObject<HTMLDivElement>;
  headlineId: string;
  onClose: () => void;
  className?: string;
  isOpen: boolean;
  children: React.ReactNode;
}

/**
 * Internal modal overlay for the modal input variant.
 * Wires useDialog, useOverlay, usePreventScroll.
 * @internal
 */
function ModalInputOverlay({
  dialogRef,
  headlineId,
  onClose,
  className,
  isOpen,
  children,
}: ModalInputOverlayProps): JSX.Element {
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

ModalInputOverlay.displayName = "ModalInputOverlay";
