import { forwardRef, useRef } from "react";
import { useButton } from "react-aria";
import type { AriaButtonProps } from "react-aria";
import { mergeProps } from "@react-aria/utils";
import { filterDOMProps } from "react-aria";

/**
 * Headless IconButton Component (Layer 2)
 *
 * Unstyled icon button primitive using React Aria for accessibility.
 * Provides behavior only - bring your own styles.
 *
 * Features:
 * - Full keyboard navigation (Enter, Space)
 * - Screen reader support
 * - Touch/pointer event handling
 * - Focus management
 * - Disabled state handling
 * - Toggle button support (aria-pressed)
 *
 * @example
 * ```tsx
 * // Use for custom styling
 * <IconButtonHeadless className="custom-icon-button-class" aria-label="Delete">
 *   <IconDelete />
 * </IconButtonHeadless>
 * ```
 */
export interface IconButtonHeadlessProps extends AriaButtonProps {
  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Icon content (React node)
   */
  children: React.ReactNode;

  /**
   * Tab index for keyboard navigation
   * @default 0
   */
  tabIndex?: number;

  /**
   * Mouse down handler (for ripple effect)
   */
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Button type attribute
   * @default 'button'
   */
  type?: "button" | "submit" | "reset";

  /**
   * Toggle state (for toggle buttons)
   * Sets aria-pressed attribute
   */
  selected?: boolean;

  /**
   * REQUIRED: Accessible label for screen readers
   */
  "aria-label": string;
}

export const IconButtonHeadless = forwardRef<HTMLButtonElement, IconButtonHeadlessProps>(
  (
    {
      className,
      children,
      tabIndex = 0,
      onMouseDown,
      type,
      selected,
      "aria-label": ariaLabel,
      ...props
    },
    forwardedRef
  ) => {
    // Internal ref for React Aria
    const internalRef = useRef<HTMLButtonElement>(null);

    // Merge internal ref with forwarded ref
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLButtonElement>;

    // React Aria hook - handles all accessibility
    const { buttonProps } = useButton(
      {
        ...props,
        // Ensure element type is 'button' for proper semantics
        elementType: "button",
        // Pass aria-label
        "aria-label": ariaLabel,
      },
      ref
    );

    // Filter out React Aria-specific props that shouldn't be passed to the DOM element
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    const domProps = filterDOMProps(props);

    // Merge React Aria props with custom props and filtered DOM props
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const mergedProps: React.ButtonHTMLAttributes<HTMLButtonElement> = mergeProps(
      buttonProps,
      domProps,
      {
        tabIndex,
        className,
        onMouseDown,
        type: type ?? "button",
        // Add aria-pressed for toggle buttons
        ...(selected !== undefined && { "aria-pressed": selected }),
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) as any;

    return (
      // eslint-disable-next-line react/button-has-type
      <button {...mergedProps} ref={ref} type={type ?? "button"}>
        {children}
      </button>
    );
  }
);

IconButtonHeadless.displayName = "IconButtonHeadless";
