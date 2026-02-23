/**
 * TextFieldHeadless Component (Layer 2)
 *
 * Headless primitive for the TextField component.
 * Provides behavior and accessibility via React Aria without styling.
 */

import { forwardRef, useRef } from "react";
import { useTextField } from "react-aria";
import { mergeProps } from "@react-aria/utils";
import type { TextFieldHeadlessProps } from "./TextField.types";

/**
 * TextFieldHeadless - Headless text input primitive
 *
 * This component provides the foundation for accessible text input fields
 * using React Aria. It handles:
 * - Label association
 * - Description text (helper text)
 * - Error message display
 * - Validation state management
 * - Keyboard accessibility
 * - Screen reader support
 *
 * @example
 * ```tsx
 * <TextFieldHeadless
 *   label="Email"
 *   description="Enter your email address"
 *   isRequired
 * />
 * ```
 */
export const TextFieldHeadless = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextFieldHeadlessProps
>(
  (
    {
      label,
      description,
      errorMessage,
      fullWidth = false,
      multiline = false,
      rows = 3,
      className,
      inputClassName,
      labelClassName,
      descriptionClassName,
      errorClassName,
      isInvalid,
      ...restProps
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<
      HTMLInputElement & HTMLTextAreaElement
    >;

    // Use React Aria's useTextField hook for accessibility
    const {
      labelProps,
      inputProps,
      descriptionProps,
      errorMessageProps,
      isInvalid: ariaIsInvalid,
      validationErrors,
    } = useTextField(
      {
        ...restProps,
        label,
        description,
        errorMessage,
        isInvalid: isInvalid ?? false,
        inputElementType: multiline ? "textarea" : "input",
      },
      ref
    );

    // Determine if field is invalid (from prop or React Aria validation)
    const invalid = isInvalid ?? ariaIsInvalid;

    // Determine which message to show: errorMessage prop, validation errors, or description
    const showErrorMessage = invalid && (errorMessage ?? validationErrors.length > 0);
    const displayErrorMessage = errorMessage ?? validationErrors.join(" ");

    // Filter React Aria-specific props that shouldn't go to DOM
    const {
      isDisabled: _isDisabled,
      isRequired: _isRequired,
      isReadOnly: _isReadOnly,
      validationBehavior: _validationBehavior,
      validate: _validate,
      autoFocus: _autoFocus,
      value: _value,
      defaultValue: _defaultValue,
      onChange: _onChange,
      onFocus: _onFocus,
      onBlur: _onBlur,
      onKeyDown: _onKeyDown,
      onKeyUp: _onKeyUp,
      onCopy: _onCopy,
      onCut: _onCut,
      onPaste: _onPaste,
      onCompositionStart: _onCompositionStart,
      onCompositionEnd: _onCompositionEnd,
      onCompositionUpdate: _onCompositionUpdate,
      onSelect: _onSelect,
      onBeforeInput: _onBeforeInput,
      onInput: _onInput,
      ...htmlAttrs
    } = restProps;

    // Merge input props
    const mergedInputProps = mergeProps(inputProps, htmlAttrs, {
      className: inputClassName,
    }) as React.InputHTMLAttributes<HTMLInputElement> &
      React.TextareaHTMLAttributes<HTMLTextAreaElement>;

    return (
      <div className={className} style={fullWidth ? { width: "100%" } : undefined}>
        {/* Label */}
        {label && (
          <label {...labelProps} className={labelClassName}>
            {label}
          </label>
        )}

        {/* Input or Textarea */}
        {multiline ? (
          <textarea
            {...mergedInputProps}
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            rows={rows}
          />
        ) : (
          <input {...mergedInputProps} ref={ref as React.RefObject<HTMLInputElement>} />
        )}

        {/* Description (helper text) - only show if not showing error */}
        {description && !showErrorMessage && (
          <div {...descriptionProps} className={descriptionClassName}>
            {description}
          </div>
        )}

        {/* Error message */}
        {showErrorMessage && (
          <div {...errorMessageProps} className={errorClassName}>
            {displayErrorMessage}
          </div>
        )}
      </div>
    );
  }
);

TextFieldHeadless.displayName = "TextFieldHeadless";
