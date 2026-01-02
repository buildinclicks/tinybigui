import { forwardRef, useRef } from "react";
import { useButton } from "react-aria";
import type { AriaButtonProps } from "react-aria";
import { mergeProps, filterDOMProps } from "@react-aria/utils";

/**
 * Headless FAB Component (Layer 2)
 *
 * Unstyled FAB primitive using React Aria for accessibility.
 * Provides behavior only - bring your own styles.
 *
 * Features:
 * - Full keyboard navigation (Enter, Space)
 * - Screen reader support (requires aria-label)
 * - Touch/pointer event handling
 * - Focus management
 * - Disabled state handling
 *
 * @example
 * ```tsx
 * // Use for custom styling
 * <FABHeadless className="custom-fab-class" aria-label="Add">
 *   <IconAdd />
 * </FABHeadless>
 * ```
 */
export interface FABHeadlessProps extends AriaButtonProps {
  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * FAB content (icon and optional text)
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
   * REQUIRED: Accessible label for screen readers
   */
  "aria-label": string;

  /**
   * HTML title attribute for tooltip
   */
  title?: string;
}

export const FABHeadless = forwardRef<HTMLButtonElement, FABHeadlessProps>(
  (
    {
      className,
      children,
      tabIndex = 0,
      onMouseDown,
      type,
      "aria-label": ariaLabel,
      title,
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
        elementType: "button",
      },
      ref
    );

    // Filter out React Aria-specific props that shouldn't be passed to the DOM element
    const domProps = filterDOMProps(props);

    // Merge React Aria props with custom props and filtered DOM props
    const mergedProps = mergeProps(buttonProps, domProps, {
      tabIndex,
      className,
      onMouseDown,
      type: type ?? "button",
      "aria-label": ariaLabel, // Add aria-label
      // Add title if provided
      ...(title && { title }),
    }) as React.ButtonHTMLAttributes<HTMLButtonElement>;

    return (
      // eslint-disable-next-line react/button-has-type
      <button {...mergedProps} ref={ref}>
        {children}
      </button>
    );
  }
);

FABHeadless.displayName = "FABHeadless";
