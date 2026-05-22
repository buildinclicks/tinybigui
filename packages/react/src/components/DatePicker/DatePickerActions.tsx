"use client";

import { useRef } from "react";
import { useButton } from "react-aria";

import type { DatePickerActionsProps } from "./DatePicker.types";

/**
 * Headless DatePickerActions (Layer 2)
 *
 * Renders Cancel, OK, and optionally Clear action buttons for the date picker.
 * Uses React Aria's `useButton` for accessibility and keyboard interaction.
 *
 * This is a headless component — it provides behavior, ARIA semantics, and
 * data attributes only. No styling classes are applied.
 *
 * @internal
 */
export function DatePickerActions({
  cancelLabel = "Cancel",
  confirmLabel = "OK",
  clearLabel = "Clear",
  showClear = false,
  isConfirmDisabled = false,
  onCancel,
  onConfirm,
  onClear,
  className,
}: DatePickerActionsProps): JSX.Element {
  const clearRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  const { buttonProps: clearButtonProps } = useButton(
    {
      "aria-label": clearLabel,
      ...(onClear ? { onPress: onClear } : {}),
    },
    clearRef
  );

  const { buttonProps: cancelButtonProps } = useButton(
    {
      "aria-label": cancelLabel,
      ...(onCancel ? { onPress: onCancel } : {}),
    },
    cancelRef
  );

  const { buttonProps: confirmButtonProps } = useButton(
    {
      "aria-label": confirmLabel,
      isDisabled: isConfirmDisabled,
      ...(onConfirm ? { onPress: onConfirm } : {}),
    },
    confirmRef
  );

  return (
    <div className={className} data-actions>
      {showClear && (
        <button {...clearButtonProps} ref={clearRef} type="button" data-action="clear">
          {clearLabel}
        </button>
      )}
      <button {...cancelButtonProps} ref={cancelRef} type="button" data-action="cancel">
        {cancelLabel}
      </button>
      <button {...confirmButtonProps} ref={confirmRef} type="button" data-action="confirm">
        {confirmLabel}
      </button>
    </div>
  );
}

DatePickerActions.displayName = "DatePickerActions";
