/**
 * TextFieldHeadless Component (Layer 2)
 *
 * Headless primitive for the TextField component.
 * Provides behavior and accessibility via React Aria without styling.
 */

import { forwardRef, useRef } from "react";
import { useTextField, useFocusRing } from "react-aria";
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
 * When `children` is a function (render-prop), the component delegates
 * all DOM rendering to the caller, passing React Aria props and derived
 * state. This is how the styled TextField (Layer 3) composes this layer.
 *
 * When `children` is absent, a minimal accessible DOM renders (for
 * advanced consumers who want headless behaviour with their own markup).
 *
 * @example
 * ```tsx
 * // Default DOM (minimal accessible input)
 * <TextFieldHeadless
 *   label="Email"
 *   description="Enter your email address"
 *   isRequired
 * />
 *
 * // Render-prop (styled layer composition)
 * <TextFieldHeadless label="Email" value={value} onChange={onChange}>
 *   {({ labelProps, inputProps, isFocused, currentValue }) => (
 *     <div>
 *       <label {...labelProps} className={isFocused ? 'focused' : ''}>Email</label>
 *       <input {...inputProps} />
 *       <span>{currentValue.length} chars</span>
 *     </div>
 *   )}
 * </TextFieldHeadless>
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
      children,
      ...restProps
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<
      HTMLInputElement & HTMLTextAreaElement
    >;

    const inputElementType = multiline ? ("textarea" as const) : ("input" as const);

    // React Aria's useTextField provides fully-wired labelProps, inputProps,
    // descriptionProps, and errorMessageProps with stable IDs and ARIA linkages.
    const {
      labelProps,
      inputProps,
      descriptionProps,
      errorMessageProps,
      isInvalid: ariaIsInvalid,
      validationErrors,
    } = useTextField(
      {
        label,
        description,
        errorMessage,
        isInvalid: isInvalid ?? false,
        inputElementType,
        ...restProps,
      },
      ref
    );

    // useFocusRing distinguishes keyboard focus (isFocusVisible) from pointer focus (isFocused).
    const { isFocused, isFocusVisible, focusProps } = useFocusRing({ within: false });

    // Determine if field is invalid (from prop or React Aria validation)
    const invalid = isInvalid ?? ariaIsInvalid;

    const showErrorMessage = invalid && (errorMessage ?? validationErrors.length > 0);
    const displayErrorMessage = errorMessage ?? validationErrors.join(" ");

    // Derive current displayed value for the render-prop (controlled or uncontrolled).
    // React Aria puts the current value in inputProps.value for controlled fields
    // and defaultValue for uncontrolled. We normalise to a string for character counting.
    const currentValue =
      typeof inputProps.value === "string"
        ? inputProps.value
        : typeof inputProps.defaultValue === "string"
          ? inputProps.defaultValue
          : "";

    // --- Render-prop branch ---
    // When children is a function, delegate all DOM rendering to the caller.
    if (typeof children === "function") {
      // Merge focusProps into inputProps so the caller gets focus tracking for free.
      const mergedInputProps = mergeProps(
        inputProps,
        focusProps
      ) as React.InputHTMLAttributes<HTMLInputElement> &
        React.TextareaHTMLAttributes<HTMLTextAreaElement>;

      return children({
        labelProps,
        inputProps: mergedInputProps,
        descriptionProps,
        errorMessageProps,
        isInvalid: invalid,
        isFocused,
        isFocusVisible,
        currentValue,
        inputRef: ref,
      });
    }

    // --- Default DOM branch ---
    // Filter React Aria-specific props that shouldn't go to DOM elements.
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
      onFocusChange: _onFocusChange,
      ...htmlAttrs
    } = restProps;

    const mergedInputProps = mergeProps(inputProps, focusProps, htmlAttrs, {
      className: inputClassName,
    }) as React.InputHTMLAttributes<HTMLInputElement> &
      React.TextareaHTMLAttributes<HTMLTextAreaElement>;

    return (
      <div className={className} style={fullWidth ? { width: "100%" } : undefined}>
        {label && (
          <label {...labelProps} className={labelClassName}>
            {label}
          </label>
        )}

        {multiline ? (
          <textarea
            {...mergedInputProps}
            ref={ref as React.RefObject<HTMLTextAreaElement>}
            rows={rows}
          />
        ) : (
          <input {...mergedInputProps} ref={ref as React.RefObject<HTMLInputElement>} />
        )}

        {description && !showErrorMessage && (
          <div {...descriptionProps} className={descriptionClassName}>
            {description}
          </div>
        )}

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
