import { forwardRef, useRef } from "react";
import { useButton } from "react-aria";
import type { AriaButtonProps } from "react-aria";
import { mergeProps } from "@react-aria/utils";

/**
 * Headless Button Component (Layer 2)
 *
 * Unstyled button primitive using React Aria for accessibility.
 * Provides behavior only - bring your own styles.
 *
 * Features:
 * - Full keyboard navigation (Enter, Space)
 * - Screen reader support
 * - Touch/pointer event handling
 * - Focus management
 * - Disabled state handling
 *
 * @example
 * ```tsx
 * // Use for custom styling
 * <ButtonHeadless className="custom-button-class">
 *   Click me
 * </ButtonHeadless>
 * ```
 */
export interface ButtonHeadlessProps extends AriaButtonProps {
  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Button content
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
}

export const ButtonHeadless = forwardRef<HTMLButtonElement, ButtonHeadlessProps>(
  ({ className, children, tabIndex = 0, onMouseDown, type, ...restProps }, forwardedRef) => {
    // Internal ref for React Aria
    const internalRef = useRef<HTMLButtonElement>(null);

    // Merge internal ref with forwarded ref
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLButtonElement>;

    // React Aria hook - handles all accessibility
    const { buttonProps } = useButton(
      {
        ...restProps,
        // Ensure element type is 'button' for proper semantics
        elementType: "button",
      },
      ref
    );

    // Filter out React Aria-specific props that shouldn't be on DOM elements
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      isDisabled,
      onPress,
      onPressStart,
      onPressEnd,
      onPressChange,
      onPressUp,
      ...htmlAttrs
    } = restProps;

    // Merge React Aria props with custom props and HTML attributes
    // Order matters: buttonProps first, then custom props/HTML attributes to allow overrides
    const mergedProps = mergeProps(
      buttonProps,
      {
        tabIndex,
        className,
        onMouseDown,
      },
      htmlAttrs // Pass through only HTML attributes (title, data-*, etc.)
    );

    return (
      // eslint-disable-next-line react/button-has-type -- type is dynamically passed from props
      <button {...mergedProps} ref={ref} type={type ?? "button"}>
        {children}
      </button>
    );
  }
);

ButtonHeadless.displayName = "ButtonHeadless";
