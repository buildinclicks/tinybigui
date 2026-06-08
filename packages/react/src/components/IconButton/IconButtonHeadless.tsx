"use client";

import { forwardRef, useRef } from "react";
import { useButton, useHover, useFocusRing } from "react-aria";
import { mergeProps, filterDOMProps } from "@react-aria/utils";
import type { AriaButtonProps } from "react-aria";
import { getInteractionDataAttributes } from "../../utils/interactionStates";

/**
 * Headless IconButton Component (Layer 2)
 *
 * Unstyled icon button primitive using React Aria for accessibility.
 * Provides behavior AND emits MD3-compliant data-* interaction attributes
 * so the styled Layer 3 can drive all visual states through CSS alone.
 *
 * Emitted data attributes (via getInteractionDataAttributes):
 * - `data-hovered`       — pointer is over the button
 * - `data-focus-visible` — keyboard/programmatic focus is visible
 * - `data-pressed`       — button is being pressed
 * - `data-selected`      — toggle button is in the ON state
 * - `data-disabled`      — button is non-interactive
 *
 * Content flags (set explicitly):
 * - `data-toggle`        — button is a toggle (selected prop is defined)
 *
 * Features:
 * - Full keyboard navigation (Enter, Space)
 * - Screen reader support (aria-pressed for toggle buttons)
 * - Touch/pointer event handling
 * - Focus management
 * - Hover detection (useHover — pointer-only, not keyboard)
 * - Disabled state handling
 *
 * @example
 * ```tsx
 * // Advanced custom styling
 * <IconButtonHeadless
 *   aria-label="Delete"
 *   className="group/icon-button my-custom-classes"
 *   isSelected={false}
 *   isToggle={false}
 *   isDisabled={false}
 * >
 *   <IconDelete />
 * </IconButtonHeadless>
 * ```
 */
export interface IconButtonHeadlessProps extends AriaButtonProps {
  /** Additional CSS classes */
  className?: string;

  /** Icon content */
  children: React.ReactNode;

  /** Tab index for keyboard navigation @default 0 */
  tabIndex?: number;

  /** Mouse down handler (for ripple effect) */
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  /** Button type attribute @default 'button' */
  type?: "button" | "submit" | "reset";

  /**
   * Toggle selected state.
   * When defined, sets aria-pressed and emits data-selected / data-toggle.
   */
  isSelected?: boolean;

  /**
   * Whether this button behaves as a toggle (i.e. selected prop was passed).
   * Drives `data-toggle` attribute; determines whether aria-pressed is set.
   */
  isToggle?: boolean;

  /** Whether the button is disabled */
  isDisabled?: boolean;

  /** REQUIRED: Accessible label for screen readers */
  "aria-label": string;

  /** HTML title attribute for tooltip */
  title?: string;
}

export const IconButtonHeadless = forwardRef<HTMLButtonElement, IconButtonHeadlessProps>(
  (
    {
      className,
      children,
      tabIndex = 0,
      onMouseDown,
      type,
      isSelected,
      isToggle = false,
      isDisabled = false,
      "aria-label": ariaLabel,
      title,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLButtonElement>(null);
    const ref = (forwardedRef ?? internalRef) as React.RefObject<HTMLButtonElement>;

    // React Aria hooks — behavior layer
    const { buttonProps, isPressed } = useButton(
      {
        ...props,
        elementType: "button",
        "aria-label": ariaLabel,
        isDisabled,
      },
      ref
    );

    const { isHovered, hoverProps } = useHover({ isDisabled });
    const { isFocusVisible, focusProps } = useFocusRing();

    // Filter non-DOM props before spreading
    const domProps = filterDOMProps(props);

    const mergedProps = mergeProps(buttonProps, hoverProps, focusProps, domProps, {
      tabIndex,
      className,
      onMouseDown,
      type: type ?? "button",
      ...(title && { title }),
      // aria-pressed only when acting as a toggle button
      ...(isToggle && { "aria-pressed": isSelected ?? false }),
    }) as React.ButtonHTMLAttributes<HTMLButtonElement>;

    return (
      <button
        {...mergedProps}
        ref={ref}
        type={type === "submit" ? "submit" : type === "reset" ? "reset" : "button"}
        // Interaction state attributes — consumed by group-data-[x]/icon-button selectors
        {...getInteractionDataAttributes({
          isHovered,
          isFocusVisible,
          isPressed,
          ...(isToggle ? { isSelected: isSelected ?? false } : {}),
          isDisabled,
        })}
        // Content flag: present when acting as a toggle, absent otherwise
        data-toggle={isToggle ? "" : undefined}
      >
        {children}
      </button>
    );
  }
);

IconButtonHeadless.displayName = "IconButtonHeadless";
