import { forwardRef, useRef } from "react";
import { useButton } from "react-aria";
import type { AriaButtonProps } from "react-aria";
import { mergeProps } from "@react-aria/utils";

/**
 * Headless FAB Component (Layer 2)
 *
 * Unstyled FAB primitive using React Aria for accessibility.
 * Provides behavior only — bring your own styles.
 *
 * Features:
 * - Full keyboard navigation (Enter, Space)
 * - Screen reader support (requires aria-label)
 * - Touch/pointer event handling
 * - Focus management
 * - Disabled state handling
 * - Press lifecycle callbacks (onPressStart/onPressEnd) for pressed state tracking
 *
 * @example
 * ```tsx
 * <FABHeadless aria-label="Add" className="custom-fab">
 *   <IconAdd />
 * </FABHeadless>
 * ```
 */
export interface FABHeadlessProps extends AriaButtonProps {
  /** Additional CSS classes */
  className?: string;

  /** FAB content (icon and optional text) */
  children: React.ReactNode;

  /**
   * Tab index for keyboard navigation.
   * @default 0
   */
  tabIndex?: number;

  /** Mouse down handler (for ripple effect) */
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Button type attribute.
   * @default 'button'
   */
  type?: "button" | "submit" | "reset";

  /** REQUIRED: Accessible label for screen readers */
  "aria-label": string;

  /** HTML title attribute for tooltip */
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
      ...restProps
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLButtonElement>;

    // React Aria hook — handles all accessibility
    const { buttonProps } = useButton(
      {
        ...restProps,
        elementType: "button",
      },
      ref
    );

    // Strip React Aria-specific event props that must not reach the DOM,
    // then pass the remainder (data-*, interaction callbacks, etc.) through.
    const {
      isDisabled: _isDisabled,
      onPress: _onPress,
      onPressStart: _onPressStart,
      onPressEnd: _onPressEnd,
      onPressChange: _onPressChange,
      onPressUp: _onPressUp,
      ...htmlAttrs
    } = restProps;

    const mergedProps = mergeProps(
      buttonProps,
      {
        tabIndex,
        className,
        onMouseDown,
        "aria-label": ariaLabel,
        ...(title !== undefined && { title }),
      },
      htmlAttrs
    ) as React.ButtonHTMLAttributes<HTMLButtonElement>;

    return (
      // eslint-disable-next-line react/button-has-type -- type is dynamically passed from props
      <button {...mergedProps} ref={ref} type={type ?? "button"}>
        {children}
      </button>
    );
  }
);

FABHeadless.displayName = "FABHeadless";
