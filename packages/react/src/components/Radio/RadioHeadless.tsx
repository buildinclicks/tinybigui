import { forwardRef, useRef, useContext } from "react";
import { useRadio, useFocusRing } from "react-aria";
import { RadioGroupContext } from "./RadioGroupHeadless";
import type { RadioHeadlessProps } from "./Radio.types";

/**
 * Headless Radio Component (Layer 2)
 *
 * Unstyled radio primitive using React Aria for accessibility.
 * Provides behavior only - bring your own styles.
 * Must be used within a RadioGroup for proper functionality.
 *
 * Features:
 * - Full keyboard navigation (Space to select)
 * - Screen reader support
 * - Touch/pointer event handling
 * - Focus management
 * - Disabled state handling
 * - Form integration
 *
 * @example
 * ```tsx
 * // Use for custom styling
 * <RadioGroupHeadless label="Options">
 *   <RadioHeadless value="a" className="custom-radio">
 *     Option A
 *   </RadioHeadless>
 * </RadioGroupHeadless>
 *
 * // With render prop for custom visual
 * <RadioHeadless
 *   value="a"
 *   renderRadio={({ isSelected }) => (
 *     <CustomRadioIcon checked={isSelected} />
 *   )}
 * >
 *   Custom visual
 * </RadioHeadless>
 * ```
 */
export const RadioHeadless = forwardRef<HTMLInputElement, RadioHeadlessProps>(
  ({ className, children, renderRadio, ...props }, forwardedRef) => {
    // Get RadioGroup state from context
    const state = useContext(RadioGroupContext);

    if (!state) {
      throw new Error("RadioHeadless must be used within a RadioGroupHeadless");
    }

    // Internal ref for React Aria
    const internalRef = useRef<HTMLInputElement>(null);

    // Merge internal ref with forwarded ref
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLInputElement>;

    // React Aria hook - handles all accessibility
    const { inputProps, isSelected, isDisabled, isPressed } = useRadio(props, state, ref);

    // Focus ring for keyboard navigation
    const { isFocusVisible, focusProps } = useFocusRing();

    return (
      <label className={className}>
        <input {...inputProps} {...focusProps} ref={ref} />
        {renderRadio?.({
          isSelected,
          isDisabled,
          isFocusVisible,
          isPressed,
        })}
        {children}
      </label>
    );
  }
);

RadioHeadless.displayName = "RadioHeadless";
