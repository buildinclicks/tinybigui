import { forwardRef, useRef } from "react";
import { useCheckbox } from "react-aria";
import { useToggleState } from "react-stately";
import type { CheckboxHeadlessProps } from "./Checkbox.types";

/**
 * Headless Checkbox Component (Layer 2)
 *
 * Unstyled checkbox primitive using React Aria for accessibility.
 * Provides behavior only - bring your own styles.
 *
 * Features:
 * - Full keyboard navigation (Space to toggle)
 * - Screen reader support
 * - Touch/pointer event handling
 * - Focus management
 * - Indeterminate state support
 * - Disabled state handling
 *
 * @example
 * ```tsx
 * // Use for custom styling
 * <CheckboxHeadless className="custom-checkbox-class">
 *   Accept terms
 * </CheckboxHeadless>
 *
 * // With render prop for custom visual
 * <CheckboxHeadless
 *   renderCheckbox={({ isSelected, isIndeterminate }) => (
 *     <CustomCheckboxIcon checked={isSelected} indeterminate={isIndeterminate} />
 *   )}
 * >
 *   Custom visual
 * </CheckboxHeadless>
 * ```
 */
export const CheckboxHeadless = forwardRef<HTMLInputElement, CheckboxHeadlessProps>(
  (
    { className, children, isIndeterminate = false, renderCheckbox, ...restProps },
    forwardedRef
  ) => {
    // Internal ref for React Aria
    const internalRef = useRef<HTMLInputElement>(null);

    // Merge internal ref with forwarded ref
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLInputElement>;

    // State management using React Stately
    const state = useToggleState(restProps);

    // React Aria hook - handles all accessibility
    const { inputProps, labelProps, isPressed, isDisabled } = useCheckbox(restProps, state, ref);

    // Get selected state
    const isSelected = state.isSelected;

    return (
      <label {...labelProps} className={className}>
        <input {...inputProps} ref={ref} />
        {renderCheckbox?.({
          isSelected,
          isIndeterminate,
          isDisabled,
          isFocusVisible: false, // Will be managed in styled component
          isPressed,
        })}
        {children}
      </label>
    );
  }
);

CheckboxHeadless.displayName = "CheckboxHeadless";
