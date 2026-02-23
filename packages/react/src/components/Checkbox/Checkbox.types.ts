import type React from "react";
import type { AriaCheckboxProps } from "react-aria";

/**
 * Material Design 3 Checkbox Component Props
 *
 * Built on React Aria for world-class accessibility.
 * Supports checked, unchecked, and indeterminate states.
 * Implementation uses CVA + Tailwind CSS classes mapped to MD3 tokens.
 *
 * @example
 * ```tsx
 * // Controlled checkbox
 * <Checkbox isSelected={isChecked} onChange={setIsChecked}>
 *   Accept terms
 * </Checkbox>
 *
 * // Uncontrolled with default value
 * <Checkbox defaultSelected>
 *   Subscribe to newsletter
 * </Checkbox>
 *
 * // Indeterminate state (partial selection)
 * <Checkbox isIndeterminate>
 *   Select all
 * </Checkbox>
 *
 * // Error state
 * <Checkbox isInvalid>
 *   Required field
 * </Checkbox>
 *
 * // Disabled
 * <Checkbox isDisabled>
 *   Disabled option
 * </Checkbox>
 *
 * // Headless version (custom styling)
 * <CheckboxHeadless className="my-custom-styles">
 *   Custom checkbox
 * </CheckboxHeadless>
 * ```
 */
export interface CheckboxProps
  extends
    AriaCheckboxProps,
    Omit<React.HTMLAttributes<HTMLLabelElement>, keyof AriaCheckboxProps | "children"> {
  /**
   * Checkbox label content
   */
  children?: React.ReactNode;

  /**
   * Indeterminate state (partial selection)
   * Visually shows a dash instead of checkmark
   * @default false
   */
  isIndeterminate?: boolean;

  /**
   * Error/invalid state
   * Shows error styling (typically red)
   * @default false
   */
  isInvalid?: boolean;

  /**
   * Disable ripple effect
   * @default false
   */
  disableRipple?: boolean;

  /**
   * Additional CSS classes (Tailwind)
   */
  className?: string;
}

/**
 * Props for the headless Checkbox component
 * Extends AriaCheckboxProps for accessibility
 */
export interface CheckboxHeadlessProps extends AriaCheckboxProps {
  /**
   * Additional CSS classes for the label wrapper
   */
  className?: string;

  /**
   * Checkbox label content
   */
  children?: React.ReactNode;

  /**
   * Indeterminate state (partial selection)
   * @default false
   */
  isIndeterminate?: boolean;

  /**
   * Render prop for custom checkbox visual
   * Receives state information
   */
  renderCheckbox?: (state: {
    isSelected: boolean;
    isIndeterminate: boolean;
    isDisabled: boolean;
    isFocusVisible: boolean;
    isPressed: boolean;
  }) => React.ReactNode;
}
