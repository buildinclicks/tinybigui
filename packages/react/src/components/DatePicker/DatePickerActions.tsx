"use client";

import type React from "react";
import { useRef } from "react";
import { useButton } from "react-aria";

import type { DatePickerActionsProps } from "./DatePicker.types";

/**
 * Props for an injectable action button slot component.
 */
export interface ActionButtonSlotProps {
  /** Visible label text */
  label: string;
  /** Accessible label */
  "aria-label"?: string | undefined;
  /** Called when the button is pressed */
  onPress?: (() => void) | undefined;
  /** Whether the button is disabled */
  isDisabled?: boolean | undefined;
  /** data-action attribute value ("clear" | "cancel" | "confirm") */
  "data-action": string;
}

/**
 * Headless DatePickerActions (Layer 2)
 *
 * Renders Cancel, OK, and optionally Clear action buttons for the date picker.
 * Uses React Aria's `useButton` for accessibility and keyboard interaction.
 *
 * Accepts a `ButtonComponent` slot to allow the styled layer to inject CVA-styled
 * buttons with state layers without modifying this headless layer.
 *
 * This is a headless component — it provides behavior, ARIA semantics, and
 * data attributes only. The default buttons have no styling.
 *
 * @internal
 */

/**
 * Default unstyled button.
 * @internal
 */
function HeadlessActionButton({
  label,
  "aria-label": ariaLabel,
  onPress,
  isDisabled,
  "data-action": dataAction,
}: ActionButtonSlotProps): JSX.Element {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(
    {
      "aria-label": ariaLabel ?? label,
      isDisabled: isDisabled ?? false,
      ...(onPress ? { onPress } : {}),
    },
    ref
  );
  return (
    <button {...buttonProps} ref={ref} type="button" data-action={dataAction}>
      {label}
    </button>
  );
}

interface DatePickerActionsInternalProps extends DatePickerActionsProps {
  /**
   * Optional slot component for each action button.
   * Defaults to `HeadlessActionButton` (unstyled).
   * Pass a styled component from Layer 3 to inject CVA + state layers.
   */
  ButtonComponent?: React.ComponentType<ActionButtonSlotProps>;
}

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
  ButtonComponent = HeadlessActionButton,
}: DatePickerActionsInternalProps): JSX.Element {
  return (
    <div className={className} data-actions>
      {showClear && (
        <ButtonComponent
          label={clearLabel}
          aria-label={clearLabel}
          onPress={onClear}
          data-action="clear"
        />
      )}
      <ButtonComponent
        label={cancelLabel}
        aria-label={cancelLabel}
        onPress={onCancel}
        data-action="cancel"
      />
      <ButtonComponent
        label={confirmLabel}
        aria-label={confirmLabel}
        onPress={onConfirm}
        isDisabled={isConfirmDisabled}
        data-action="confirm"
      />
    </div>
  );
}

DatePickerActions.displayName = "DatePickerActions";
