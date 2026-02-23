import { forwardRef, useRef } from "react";
import { useSwitch } from "react-aria";
import { useToggleState } from "react-stately";
import type { SwitchHeadlessProps } from "./Switch.types";

/**
 * Headless Switch Component (Layer 2)
 *
 * Unstyled switch primitive using React Aria for accessibility.
 * Provides behavior only - bring your own styles.
 *
 * Features:
 * - Full keyboard navigation (Space/Enter to toggle)
 * - Screen reader support with role="switch"
 * - Touch/pointer event handling
 * - Focus management
 * - Disabled state handling
 * - Read-only state support
 *
 * @example
 * ```tsx
 * // Use for custom styling
 * <SwitchHeadless className="custom-switch-class">
 *   Low power mode
 * </SwitchHeadless>
 *
 * // With render prop for custom visual
 * <SwitchHeadless
 *   renderSwitch={({ isSelected, isDisabled }) => (
 *     <CustomSwitchVisual on={isSelected} disabled={isDisabled} />
 *   )}
 * >
 *   Custom visual
 * </SwitchHeadless>
 * ```
 */
export const SwitchHeadless = forwardRef<HTMLInputElement, SwitchHeadlessProps>(
  ({ className, children, renderSwitch, ...restProps }, forwardedRef) => {
    // Internal ref for React Aria
    const internalRef = useRef<HTMLInputElement>(null);

    // Merge internal ref with forwarded ref
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLInputElement>;

    // State management using React Stately
    const state = useToggleState(restProps);

    // React Aria hook - handles all accessibility
    const { inputProps, labelProps, isPressed, isDisabled, isReadOnly } = useSwitch(
      restProps,
      state,
      ref
    );

    // Get selected state
    const isSelected = state.isSelected;

    return (
      <label {...labelProps} className={className}>
        <input {...inputProps} ref={ref} />
        {renderSwitch?.({
          isSelected,
          isDisabled,
          isFocusVisible: false, // Will be managed in styled component
          isPressed,
          isReadOnly,
        })}
        {children}
      </label>
    );
  }
);

SwitchHeadless.displayName = "SwitchHeadless";
