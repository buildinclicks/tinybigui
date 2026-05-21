"use client";

import { useRef } from "react";
import { useButton } from "react-aria";

import type { DatePickerActionsProps } from "./DatePicker.types";

/**
 * Headless DatePickerActions (Layer 2)
 *
 * Renders Cancel and OK action buttons for the date picker.
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
  onCancel,
  onConfirm,
  className,
}: DatePickerActionsProps): JSX.Element {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

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
      ...(onConfirm ? { onPress: onConfirm } : {}),
    },
    confirmRef
  );

  return (
    <div className={className} data-actions>
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
