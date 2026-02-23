/**
 * TextField Component (Layer 3)
 *
 * Material Design 3 styled text input component.
 * Built on React Aria for accessibility with MD3 visual design.
 */

"use client";

import { forwardRef, useState, useId } from "react";
import { useFocusRing } from "react-aria";
import { cn } from "../../utils/cn";
import {
  textFieldContainerVariants,
  textFieldWrapperVariants,
  textFieldInputVariants,
  textFieldLabelVariants,
  textFieldIconVariants,
  textFieldHelperTextVariants,
  textFieldCharacterCountVariants,
} from "./TextField.variants";
import type { TextFieldProps } from "./TextField.types";

/**
 * TextField - MD3 Text Input Component
 *
 * A text input field following Material Design 3 specifications.
 * Supports filled and outlined variants with comprehensive accessibility.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <TextField label="Email" />
 *
 * // With validation
 * <TextField
 *   label="Email"
 *   type="email"
 *   isRequired
 *   errorMessage="Please enter a valid email"
 * />
 *
 * // Multiline with character counter
 * <TextField
 *   label="Bio"
 *   multiline
 *   rows={4}
 *   maxLength={500}
 *   characterCount
 * />
 * ```
 */
export const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(
  (
    {
      variant = "filled",
      size = "medium",
      label,
      description,
      errorMessage,
      leadingIcon,
      trailingIcon,
      characterCount = false,
      maxLength,
      fullWidth = false,
      multiline = false,
      rows = 3,
      className,
      isDisabled = false,
      isInvalid = false,
      isRequired = false,
      isReadOnly = false,
      value,
      defaultValue,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [currentValue, setCurrentValue] = useState(value ?? defaultValue ?? "");
    const labelId = useId();
    const descriptionId = useId();
    const errorId = useId();

    // Use React Aria's focus ring for keyboard navigation
    const { focusProps } = useFocusRing();

    // Determine if label should float
    const hasValue = currentValue.length > 0;
    const shouldFloatLabel = isFocused || hasValue;

    // Calculate character count
    const characterLength = currentValue.length;
    const isCharacterLimitExceeded = maxLength ? characterLength > maxLength : false;

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      const newValue = e.target.value;
      if (value === undefined) {
        setCurrentValue(newValue);
      }
      if (onChange) {
        onChange(e);
      }
    };

    // Handle focus
    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setIsFocused(true);
      if (focusProps.onFocus) {
        focusProps.onFocus(e);
      }
      if (onFocus) {
        onFocus(e);
      }
    };

    // Handle blur
    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setIsFocused(false);
      if (focusProps.onBlur) {
        focusProps.onBlur(e);
      }
      if (onBlur) {
        onBlur(e);
      }
    };

    // Sync controlled value
    if (value !== undefined && value !== currentValue) {
      setCurrentValue(value);
    }

    // Build aria-describedby
    const ariaDescribedBy = [];
    if (description && !isInvalid) {
      ariaDescribedBy.push(descriptionId);
    }
    if (isInvalid && errorMessage) {
      ariaDescribedBy.push(errorId);
    }
    const ariaDescribedByString =
      ariaDescribedBy.length > 0 ? ariaDescribedBy.join(" ") : undefined;

    return (
      <div className={cn(textFieldContainerVariants({ fullWidth }), className)}>
        {/* Input wrapper with visual styling */}
        <div
          className={cn(
            textFieldWrapperVariants({
              variant,
              size,
              disabled: isDisabled,
              error: isInvalid,
              focused: isFocused,
            })
          )}
        >
          {/* Leading icon */}
          {leadingIcon && (
            <span
              className={textFieldIconVariants({
                position: "leading",
                size,
                disabled: isDisabled,
              })}
            >
              {leadingIcon}
            </span>
          )}

          {/* Label (floating) */}
          {label && (
            <label
              id={labelId}
              htmlFor={props.id}
              className={cn(
                textFieldLabelVariants({
                  variant,
                  size,
                  floating: shouldFloatLabel,
                  focused: isFocused,
                  error: isInvalid,
                  disabled: isDisabled,
                  hasLeadingIcon: !!leadingIcon,
                })
              )}
            >
              {label}
              {isRequired && " *"}
            </label>
          )}

          {/* Input/Textarea element */}
          {multiline ? (
            <textarea
              ref={ref as React.RefObject<HTMLTextAreaElement>}
              className={cn(
                textFieldInputVariants({
                  variant,
                  size,
                  disabled: isDisabled,
                  hasLeadingIcon: !!leadingIcon,
                  hasTrailingIcon: !!trailingIcon,
                  multiline: true,
                })
              )}
              disabled={isDisabled}
              required={isRequired}
              readOnly={isReadOnly}
              value={value}
              defaultValue={defaultValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              rows={rows}
              maxLength={maxLength}
              aria-labelledby={label ? labelId : undefined}
              aria-describedby={ariaDescribedByString}
              aria-invalid={isInvalid}
              {...props}
            />
          ) : (
            <input
              ref={ref as React.RefObject<HTMLInputElement>}
              className={cn(
                textFieldInputVariants({
                  variant,
                  size,
                  disabled: isDisabled,
                  hasLeadingIcon: !!leadingIcon,
                  hasTrailingIcon: !!trailingIcon,
                  multiline: false,
                })
              )}
              disabled={isDisabled}
              required={isRequired}
              readOnly={isReadOnly}
              value={value}
              defaultValue={defaultValue}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              maxLength={maxLength}
              aria-labelledby={label ? labelId : undefined}
              aria-describedby={ariaDescribedByString}
              aria-invalid={isInvalid}
              {...props}
            />
          )}

          {/* Trailing icon */}
          {trailingIcon && (
            <span
              className={textFieldIconVariants({
                position: "trailing",
                size,
                disabled: isDisabled,
              })}
            >
              {trailingIcon}
            </span>
          )}
        </div>

        {/* Helper text or error message */}
        {description && !isInvalid && (
          <div
            id={descriptionId}
            className={textFieldHelperTextVariants({
              type: "description",
              disabled: isDisabled,
            })}
          >
            {description}
          </div>
        )}

        {isInvalid && errorMessage && (
          <div
            id={errorId}
            className={textFieldHelperTextVariants({
              type: "error",
              disabled: isDisabled,
            })}
          >
            {errorMessage}
          </div>
        )}

        {/* Character counter */}
        {characterCount && maxLength && (
          <div
            className={textFieldCharacterCountVariants({
              exceeded: isCharacterLimitExceeded,
              disabled: isDisabled,
            })}
          >
            {characterLength} / {maxLength}
          </div>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";
