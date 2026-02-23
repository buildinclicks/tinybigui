/**
 * TextField Type Definitions
 *
 * Type definitions for the Material Design 3 TextField component.
 * Supports both filled and outlined variants with full accessibility.
 */

import type { AriaTextFieldProps } from "react-aria";

/**
 * TextField visual variants
 *
 * - `filled`: Solid background with bottom border (default)
 * - `outlined`: Border around entire field
 */
export type TextFieldVariant = "filled" | "outlined";

/**
 * TextField size variants
 *
 * - `small`: Compact height
 * - `medium`: Standard height (default)
 * - `large`: Larger height
 */
export type TextFieldSize = "small" | "medium" | "large";

/**
 * Props for the headless TextField component (Layer 2)
 *
 * Extends React Aria's AriaTextFieldProps for accessibility.
 * Provides behavior without styling.
 */
export interface TextFieldHeadlessProps extends Omit<
  AriaTextFieldProps,
  "children" | "onFocus" | "onBlur"
> {
  /**
   * Label text for the input
   */
  label?: string;

  /**
   * Helper text displayed below the input
   * @example "Enter your email address"
   */
  description?: string;

  /**
   * Error message to display when input is invalid
   * @example "Email is required"
   */
  errorMessage?: string;

  /**
   * Whether the input should expand to fill its container
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Enable multiline mode (textarea)
   * @default false
   */
  multiline?: boolean;

  /**
   * Number of visible rows for multiline input
   * @default 3
   */
  rows?: number;

  /**
   * Custom className for the container
   */
  className?: string;

  /**
   * Custom className for the input element
   */
  inputClassName?: string;

  /**
   * Custom className for the label element
   */
  labelClassName?: string;

  /**
   * Custom className for the description element
   */
  descriptionClassName?: string;

  /**
   * Custom className for the error message element
   */
  errorClassName?: string;

  /**
   * Handler called when the input is focused
   */
  onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

  /**
   * Handler called when the input loses focus
   */
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

/**
 * Props for the styled TextField component (Layer 3)
 *
 * Extends TextFieldHeadlessProps with MD3 visual styling options.
 */
export interface TextFieldProps extends TextFieldHeadlessProps {
  /**
   * Visual variant of the text field
   * @default 'filled'
   */
  variant?: TextFieldVariant;

  /**
   * Size variant
   * @default 'medium'
   */
  size?: TextFieldSize;

  /**
   * Leading icon (before input text)
   * MD3 Specification: Icons should be 18px × 18px
   */
  leadingIcon?: React.ReactNode;

  /**
   * Trailing icon (after input text)
   * MD3 Specification: Icons should be 18px × 18px
   */
  trailingIcon?: React.ReactNode;

  /**
   * Show character counter below the input
   * Requires maxLength to be set
   * @default false
   */
  characterCount?: boolean;

  /**
   * Maximum number of characters allowed
   * Enables character counter if characterCount is true
   */
  maxLength?: number;
}
