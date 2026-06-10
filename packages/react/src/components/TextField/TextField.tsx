/**
 * TextField Component (Layer 3)
 *
 * Material Design 3 Expressive styled text input component.
 * Composes TextFieldHeadless (Layer 2) via render-prop to obtain all
 * React Aria ARIA props without duplicating accessibility wiring.
 *
 * Architecture: Variants vs States
 * - All interaction/selection states are emitted as data-* attributes on the
 *   root div (group/text-field) via getInteractionDataAttributes + explicit
 *   derived content flags. CVA slots read them via group-data-[x]/text-field:.
 * - CVA variants hold only design-time choices (variant, position).
 *
 * MD3 Expressive spec:
 * - Single 56dp height (no size variants)
 * - Filled: rounded-top 4dp, surface-container-highest bg, active indicator
 * - Outlined: rounded 4dp all corners, transparent bg, notched fieldset border
 * - body-large typography for input, body-small for floating label + supporting text
 * - Standard fast motion tokens (utility form UI — no Expressive overshoot)
 */

"use client";

import { forwardRef } from "react";
import { useHover } from "react-aria";
import { cn } from "../../utils/cn";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import {
  textFieldRootVariants,
  textFieldFieldVariants,
  textFieldStateLayerVariants,
  textFieldActiveIndicatorVariants,
  textFieldOutlineVariants,
  textFieldNotchVariants,
  textFieldLabelVariants,
  textFieldInputVariants,
  textFieldIconVariants,
  textFieldAffixVariants,
  textFieldSupportingRowVariants,
  textFieldSupportingTextVariants,
  textFieldCounterVariants,
} from "./TextField.variants";
import { TextFieldHeadless } from "./TextFieldHeadless";
import type { TextFieldProps } from "./TextField.types";

/**
 * TextField — MD3 Expressive Text Input Component
 *
 * A text input field strictly following Material Design 3 Expressive specifications.
 * Supports filled and outlined variants with full accessibility via React Aria.
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
 * // With icons and affixes
 * <TextField
 *   label="Price"
 *   prefix="$"
 *   suffix="USD"
 *   leadingIcon={<IconDollar />}
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
      label,
      description,
      errorMessage,
      leadingIcon,
      trailingIcon,
      prefix,
      suffix,
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

    // React Aria hover state for the field box
    const { isHovered, hoverProps } = useHover({ isDisabled });

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
          isFocusVisible,
          currentValue,
          inputRef,
        }) => {
          const hasValue = currentValue.length > 0;
          // Placeholder value — we need it to determine float state
          const hasPlaceholder = !!(props as { placeholder?: string }).placeholder;
          const hasPrefix = !!prefix;
          const hasSuffix = !!suffix;
          // Label floats when: focused, has a value, has a placeholder, or has a prefix
          const shouldFloat = isFocused || hasValue || hasPlaceholder || hasPrefix;
          const characterLength = currentValue.length;
          const isCharacterLimitExceeded = maxLength ? characterLength > maxLength : false;

          const hasLeadingIcon = !!leadingIcon;
          const hasTrailingIcon = !!trailingIcon;
          const hasLabel = !!label;

          // Supporting row is shown when description OR counter is present
          const showDescription = !!description && !fieldIsInvalid;
          const showError = fieldIsInvalid && !!errorMessage;
          const showCounter = characterCount && maxLength !== undefined;
          const showSupportingRow = showDescription || showError || showCounter;

          return (
            <div
              className={cn(textFieldRootVariants({ fullWidth }), "group/text-field", className)}
              // ── Interaction data attributes (from React Aria state) ──────
              {...getInteractionDataAttributes({
                isHovered,
                isFocusVisible,
                isDisabled,
                isReadOnly,
                isInvalid: fieldIsInvalid,
              })}
              // ── Derived state flags ──────────────────────────────────────
              data-focused={isFocused ? "" : undefined}
              data-float={shouldFloat ? "" : undefined}
              // ── Content flags (structural composition) ───────────────────
              data-with-leading-icon={hasLeadingIcon ? "" : undefined}
              data-with-trailing-icon={hasTrailingIcon ? "" : undefined}
              data-with-prefix={hasPrefix ? "" : undefined}
              data-with-suffix={hasSuffix ? "" : undefined}
              data-no-label={!hasLabel ? "" : undefined}
              data-multiline={multiline ? "" : undefined}
            >
              {/* Field box — 56dp visual container */}
              <div {...hoverProps} className={cn(textFieldFieldVariants({ variant }))}>
                {/* ── State layer (filled variant only) ───────────────────── */}
                {variant === "filled" && (
                  <span className={cn(textFieldStateLayerVariants())} aria-hidden="true" />
                )}

                {/* ── Leading icon ────────────────────────────────────────── */}
                {leadingIcon && (
                  <span
                    className={cn(textFieldIconVariants({ position: "leading" }))}
                    aria-hidden="true"
                  >
                    {leadingIcon}
                  </span>
                )}

                {/* ── Content column (label + prefix + input + suffix) ─────── */}
                <div className="relative flex h-full min-w-0 flex-1 items-center">
                  {/* Floating label — uses labelProps from React Aria for htmlFor wiring */}
                  {label && (
                    <label {...labelProps} className={cn(textFieldLabelVariants({ variant }))}>
                      {label}
                      {isRequired && <span aria-hidden="true">&thinsp;*</span>}
                    </label>
                  )}

                  {/* Prefix affix */}
                  {prefix && (
                    <span className={cn(textFieldAffixVariants({ variant, position: "prefix" }))}>
                      {prefix}
                    </span>
                  )}

                  {/* Input / Textarea */}
                  {multiline ? (
                    <textarea
                      {...inputProps}
                      ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                      className={cn(textFieldInputVariants({ variant, multiline: true }))}
                      rows={rows}
                      spellCheck={spellCheckProp}
                    />
                  ) : (
                    <input
                      {...inputProps}
                      ref={inputRef as React.RefObject<HTMLInputElement>}
                      className={cn(textFieldInputVariants({ variant, multiline: false }))}
                      spellCheck={spellCheckProp}
                    />
                  )}

                  {/* Suffix affix */}
                  {suffix && (
                    <span className={cn(textFieldAffixVariants({ variant, position: "suffix" }))}>
                      {suffix}
                    </span>
                  )}
                </div>

                {/* ── Trailing icon ────────────────────────────────────────── */}
                {trailingIcon && (
                  <span
                    className={cn(textFieldIconVariants({ position: "trailing" }))}
                    aria-hidden="true"
                  >
                    {trailingIcon}
                  </span>
                )}

                {/* ── Active indicator (filled variant only) ───────────────── */}
                {variant === "filled" && (
                  <span className={cn(textFieldActiveIndicatorVariants())} aria-hidden="true" />
                )}

                {/* ── Outlined border with notch ───────────────────────────── */}
                {variant === "outlined" && (
                  <fieldset aria-hidden="true" className={cn(textFieldOutlineVariants())}>
                    <legend className={cn(textFieldNotchVariants())}>
                      {/* Invisible copy of label drives the notch width */}
                      {label && (
                        <span>
                          {label}
                          {isRequired && "\u2009*"}
                        </span>
                      )}
                    </legend>
                  </fieldset>
                )}
              </div>

              {/* ── Supporting row (description / error + counter) ──────────── */}
              {showSupportingRow && (
                <div className={cn(textFieldSupportingRowVariants())}>
                  {/* Left: supporting text or error message (flex-1 pushes counter right) */}
                  <div className="min-w-0 flex-1">
                    {showDescription && (
                      <p
                        {...descriptionProps}
                        className={cn(textFieldSupportingTextVariants({ type: "description" }))}
                      >
                        {description}
                      </p>
                    )}
                    {showError && (
                      <p
                        {...errorMessageProps}
                        className={cn(textFieldSupportingTextVariants({ type: "error" }))}
                      >
                        {errorMessage}
                      </p>
                    )}
                  </div>

                  {/* Right: character counter */}
                  {showCounter && (
                    <span
                      className={cn(
                        textFieldCounterVariants({ exceeded: isCharacterLimitExceeded })
                      )}
                      aria-live="polite"
                    >
                      {characterLength}&thinsp;/&thinsp;{maxLength}
                    </span>
                  )}
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
