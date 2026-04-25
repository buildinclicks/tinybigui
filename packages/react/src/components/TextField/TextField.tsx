/**
 * TextField Component (Layer 3)
 *
 * Material Design 3 styled text input component.
 * Composes TextFieldHeadless (Layer 2) via render-prop to obtain all
 * React Aria ARIA props without duplicating accessibility wiring.
 */

"use client";

import { forwardRef } from "react";
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
import { TextFieldHeadless } from "./TextFieldHeadless";
import type { TextFieldProps } from "./TextField.types";

/**
 * TextField - MD3 Text Input Component
 *
 * A text input field following Material Design 3 specifications.
 * Supports filled and outlined variants with comprehensive accessibility
 * provided by React Aria via the TextFieldHeadless layer.
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
      spellCheck,
      ...props
    },
    ref
  ) => {
    // Convert spellCheck to boolean if it arrives as a string (HTML attribute form)
    const spellCheckProp =
      spellCheck === undefined
        ? undefined
        : typeof spellCheck === "string"
          ? spellCheck === "true"
          : spellCheck;

    // Build headless props, omitting undefined optional values to satisfy exactOptionalPropertyTypes
    const headlessProps = {
      ...(label !== undefined ? { label } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(errorMessage !== undefined ? { errorMessage } : {}),
      ...(value !== undefined ? { value } : {}),
      ...(defaultValue !== undefined ? { defaultValue } : {}),
      ...(onChange !== undefined ? { onChange } : {}),
      ...(onFocus !== undefined ? { onFocus } : {}),
      ...(onBlur !== undefined ? { onBlur } : {}),
      ...(maxLength !== undefined ? { maxLength } : {}),
      fullWidth,
      multiline,
      rows,
      isDisabled,
      isInvalid,
      isRequired,
      isReadOnly,
      ...props,
    };

    return (
      <TextFieldHeadless ref={ref} {...headlessProps}>
        {({
          labelProps,
          inputProps,
          descriptionProps,
          errorMessageProps,
          isInvalid: fieldIsInvalid,
          isFocused,
          currentValue,
          inputRef,
        }) => {
          const hasValue = currentValue.length > 0;
          const shouldFloatLabel = isFocused || hasValue;
          const characterLength = currentValue.length;
          const isCharacterLimitExceeded = maxLength ? characterLength > maxLength : false;

          return (
            <div className={cn(textFieldContainerVariants({ fullWidth }), className)}>
              {/* Input wrapper with visual styling */}
              <div
                className={cn(
                  textFieldWrapperVariants({
                    variant,
                    size,
                    disabled: isDisabled,
                    error: fieldIsInvalid,
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

                {/* Floating label — uses labelProps from React Aria for proper htmlFor wiring */}
                {label && (
                  <label
                    {...labelProps}
                    className={cn(
                      textFieldLabelVariants({
                        variant,
                        size,
                        floating: shouldFloatLabel,
                        focused: isFocused,
                        error: fieldIsInvalid,
                        disabled: isDisabled,
                        hasLeadingIcon: !!leadingIcon,
                      })
                    )}
                  >
                    {label}
                    {isRequired && " *"}
                  </label>
                )}

                {/* Input/Textarea — uses inputProps from React Aria for full ARIA wiring */}
                {multiline ? (
                  <textarea
                    {...inputProps}
                    ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                    className={cn(
                      textFieldInputVariants({
                        variant,
                        size,
                        disabled: isDisabled,
                        hasLeadingIcon: !!leadingIcon,
                        hasTrailingIcon: !!trailingIcon,
                        multiline: true,
                      }),
                      label && "placeholder:opacity-0"
                    )}
                    rows={rows}
                    spellCheck={spellCheckProp}
                  />
                ) : (
                  <input
                    {...inputProps}
                    ref={inputRef as React.RefObject<HTMLInputElement>}
                    className={cn(
                      textFieldInputVariants({
                        variant,
                        size,
                        disabled: isDisabled,
                        hasLeadingIcon: !!leadingIcon,
                        hasTrailingIcon: !!trailingIcon,
                        multiline: false,
                      }),
                      label && "placeholder:opacity-0" // Hide placeholder when there's a value to prevent overlap with floating label
                    )}
                    spellCheck={spellCheckProp}
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

              {/* Helper text — only shown when not in error state */}
              {description && !fieldIsInvalid && (
                <div
                  {...descriptionProps}
                  className={textFieldHelperTextVariants({
                    type: "description",
                    disabled: isDisabled,
                  })}
                >
                  {description}
                </div>
              )}

              {/* Error message */}
              {fieldIsInvalid && errorMessage && (
                <div
                  {...errorMessageProps}
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
        }}
      </TextFieldHeadless>
    );
  }
);

TextField.displayName = "TextField";
