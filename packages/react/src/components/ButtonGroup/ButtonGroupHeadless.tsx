import { forwardRef, useId, useRef, useState } from "react";
import type React from "react";
import { ButtonGroupProvider } from "./ButtonGroupContext";
import type { ButtonGroupProps } from "./ButtonGroup.types";

/**
 * Headless ButtonGroup Component (Layer 2)
 *
 * Unstyled group container using a `<div role="group">` for semantic grouping.
 * Provides behavior only — bring your own styles via the styled `ButtonGroup`
 * or your own className.
 *
 * Responsibilities:
 * - Renders a non-focusable `<div role="group">` (ARIA group landmark)
 * - Manages selection state (uncontrolled) or delegates to parent (controlled)
 * - Provides all group metadata to children via `ButtonGroupContext`
 *
 * @example
 * ```tsx
 * // Uncontrolled with default value
 * <ButtonGroupHeadless selectionMode="single" defaultValue="md" className="flex gap-2">
 *   <MyButton value="sm">Small</MyButton>
 *   <MyButton value="md">Medium</MyButton>
 *   <MyButton value="lg">Large</MyButton>
 * </ButtonGroupHeadless>
 *
 * // Controlled
 * <ButtonGroupHeadless
 *   selectionMode="multi"
 *   selectedValues={selected}
 *   onSelectionChange={setSelected}
 *   className="inline-flex gap-[18px]"
 * >
 *   <MyButton value="b">Bold</MyButton>
 *   <MyButton value="i">Italic</MyButton>
 * </ButtonGroupHeadless>
 * ```
 */
export const ButtonGroupHeadless = forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      // Group configuration
      variant = "standard",
      size = "md",
      shape = "round",
      selectionMode,

      // Selection — controlled
      selectedValues: controlledValues,
      onSelectionChange: onControlledChange,

      // Selection — uncontrolled
      defaultValue,

      // DOM
      children,
      className,
      ...htmlProps
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLDivElement>;

    // Generate stable id for the group
    const groupId = useId();

    // Derive initial uncontrolled set from defaultValue
    const initialSelected = (): Set<string> => {
      if (!defaultValue) return new Set<string>();
      return new Set<string>(Array.isArray(defaultValue) ? defaultValue : [defaultValue]);
    };

    // Uncontrolled selection state (only used when selectedValues is NOT provided)
    const [uncontrolledValues, setUncontrolledValues] = useState<Set<string>>(initialSelected);

    const isControlled = controlledValues !== undefined;
    const selectedValues = isControlled ? controlledValues : uncontrolledValues;

    /**
     * Handles selection change from child buttons.
     * Computes the new Set according to the selectionMode and notifies the parent.
     */
    const handleSelectionChange = (value: string): void => {
      if (!selectionMode) return;

      let nextValues: Set<string>;

      if (selectionMode === "multi") {
        nextValues = new Set(selectedValues);
        if (nextValues.has(value)) {
          nextValues.delete(value);
        } else {
          nextValues.add(value);
        }
      } else if (selectionMode === "required") {
        // Must always have exactly one selected — pressing the current selection is a no-op
        if (selectedValues.has(value)) {
          nextValues = new Set(selectedValues);
        } else {
          nextValues = new Set([value]);
        }
      } else {
        // single — toggle the value (deselectable)
        nextValues = selectedValues.has(value) ? new Set<string>() : new Set([value]);
      }

      if (!isControlled) {
        setUncontrolledValues(nextValues);
      }
      onControlledChange?.(nextValues);
    };

    return (
      <div
        {...htmlProps}
        ref={ref}
        role="group"
        id={groupId}
        className={className}
        // Explicitly NOT setting tabIndex — the container must not be focusable
      >
        <ButtonGroupProvider
          value={{
            variant,
            size,
            shape,
            selectionMode,
            selectedValues,
            onSelectionChange: handleSelectionChange,
          }}
        >
          {children}
        </ButtonGroupProvider>
      </div>
    );
  }
);

ButtonGroupHeadless.displayName = "ButtonGroupHeadless";
