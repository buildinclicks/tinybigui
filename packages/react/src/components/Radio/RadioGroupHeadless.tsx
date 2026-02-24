import { createContext, forwardRef, useRef } from "react";
import { useRadioGroup } from "react-aria";
import { useRadioGroupState } from "react-stately";
import type { RadioGroupState } from "react-stately";
import type { RadioGroupHeadlessProps } from "./Radio.types";

/**
 * Context to provide RadioGroup state to child Radio components
 */
export const RadioGroupContext = createContext<RadioGroupState | null>(null);

/**
 * Headless RadioGroup Component (Layer 2)
 *
 * Unstyled radio group primitive using React Aria for accessibility.
 * Provides behavior only - bring your own styles.
 *
 * Features:
 * - Full keyboard navigation (Arrow keys, Tab)
 * - Screen reader support
 * - Single-selection enforcement
 * - Focus management
 * - Disabled state handling
 * - Form integration
 *
 * @example
 * ```tsx
 * // Use for custom styling
 * <RadioGroupHeadless label="Options" className="custom-group">
 *   <RadioHeadless value="a">Option A</RadioHeadless>
 *   <RadioHeadless value="b">Option B</RadioHeadless>
 * </RadioGroupHeadless>
 * ```
 */
export const RadioGroupHeadless = forwardRef<HTMLDivElement, RadioGroupHeadlessProps>(
  ({ className, children, ...props }, forwardedRef) => {
    // Internal ref for React Aria
    const internalRef = useRef<HTMLDivElement>(null);

    // Merge internal ref with forwarded ref
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLDivElement>;

    // State management using React Stately
    const state = useRadioGroupState(props);

    // React Aria hook - handles all accessibility
    const { radioGroupProps, labelProps } = useRadioGroup(props, state);

    // Extract data-testid if present
    const dataTestId = (props as unknown as { "data-testid"?: string })["data-testid"];

    return (
      <div {...radioGroupProps} ref={ref} className={className} data-testid={dataTestId}>
        {/* Group label */}
        {props.label && <span {...labelProps}>{props.label}</span>}

        {/* Provide state to child Radio components via context */}
        <RadioGroupContext.Provider value={state}>{children}</RadioGroupContext.Provider>
      </div>
    );
  }
);

RadioGroupHeadless.displayName = "RadioGroupHeadless";
