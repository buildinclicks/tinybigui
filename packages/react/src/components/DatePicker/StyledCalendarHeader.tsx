"use client";

import { useRef } from "react";
import { useButton, useHover, useFocusRing, usePress, mergeProps } from "react-aria";

import { cn } from "../../utils/cn";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import { DropdownArrowIcon } from "./CalendarHeader";
import {
  calendarHeaderVariants,
  navButtonVariants,
  navButtonStateLayerVariants,
  navButtonFocusRingVariants,
  calendarTitleVariants,
  calendarTitleTextVariants,
  calendarTitleIconVariants,
  calendarTitleStateLayerVariants,
} from "./DatePicker.variants";

import type { NavButtonComponentProps, TitleComponentProps } from "./CalendarHeader";

/**
 * StyledNavButton (Layer 3 slot)
 *
 * MD3-styled navigation button for previous/next month.
 * 40dp circle, on-surface-variant icon, with state layer + focus ring.
 *
 * Architecture:
 * - `navButtonVariants`           — 40dp circle, on-surface-variant, group/nav-button
 * - `navButtonStateLayerVariants` — absolute opacity overlay
 * - `navButtonFocusRingVariants`  — keyboard-only outline ring
 *
 * @internal — passed to CalendarHeader via the NavButtonComponent slot
 */
export function StyledNavButton({
  children,
  isDisabled,
  onPress,
  "aria-label": ariaLabel,
}: NavButtonComponentProps): JSX.Element {
  const ref = useRef<HTMLButtonElement>(null);

  const { buttonProps, isPressed } = useButton(
    {
      isDisabled: isDisabled ?? false,
      ...(onPress ? { onPress } : {}),
      ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
    },
    ref
  );
  const { isFocusVisible, focusProps } = useFocusRing();
  const { isHovered, hoverProps } = useHover({ isDisabled: isDisabled ?? false });

  return (
    <button
      {...mergeProps(buttonProps, focusProps, hoverProps)}
      ref={ref}
      type="button"
      className={cn(navButtonVariants())}
      {...getInteractionDataAttributes({
        isHovered,
        isFocusVisible,
        isPressed,
        isDisabled: isDisabled ?? false,
      })}
    >
      {/* State layer */}
      <span className={cn(navButtonStateLayerVariants())} aria-hidden="true" />
      {/* Focus ring */}
      <span className={cn(navButtonFocusRingVariants())} aria-hidden="true" />
      {/* Icon */}
      <span className="pointer-events-none relative z-10 flex items-center justify-center">
        {children}
      </span>
    </button>
  );
}

StyledNavButton.displayName = "StyledNavButton";

/**
 * StyledCalendarTitle (Layer 3 slot)
 *
 * MD3-styled month/year title toggle pill.
 * Pill shape, label-large, on-surface-variant, with state layer.
 *
 * Architecture:
 * - `calendarTitleVariants`           — pill, group/calendar-title
 * - `calendarTitleStateLayerVariants` — absolute opacity overlay
 *
 * @internal — passed to CalendarHeader via the TitleComponent slot
 */
export function StyledCalendarTitle({
  title,
  onClick,
  showDropdownIndicator,
}: TitleComponentProps): JSX.Element {
  const ref = useRef<HTMLButtonElement>(null);
  const { isFocusVisible, focusProps } = useFocusRing();
  const { isHovered, hoverProps } = useHover({});
  const { pressProps, isPressed } = usePress({});

  if (onClick) {
    return (
      <button
        {...mergeProps(focusProps, hoverProps, pressProps)}
        ref={ref}
        type="button"
        className={cn(calendarTitleVariants())}
        aria-label={`${title}, click to select year`}
        onClick={onClick}
        {...getInteractionDataAttributes({ isHovered, isFocusVisible, isPressed })}
      >
        {/* State layer */}
        <span className={cn(calendarTitleStateLayerVariants())} aria-hidden="true" />
        {/* Content */}
        <h2 aria-live="polite" className={cn(calendarTitleTextVariants())}>
          {title}
        </h2>
        {showDropdownIndicator && (
          <span className={cn(calendarTitleIconVariants())}>
            <DropdownArrowIcon />
          </span>
        )}
      </button>
    );
  }

  return (
    <div className={cn(calendarTitleVariants(), "cursor-default")}>
      <h2 aria-live="polite" className={cn(calendarTitleTextVariants())}>
        {title}
      </h2>
    </div>
  );
}

StyledCalendarTitle.displayName = "StyledCalendarTitle";

/**
 * StyledCalendarHeaderRow (Layer 3 — header row wrapper)
 *
 * Applies MD3 calendarHeaderVariants (flex, px-3 py-2 layout) as a wrapper.
 * Used by the styled layer to style the `[data-calendar-header]` element.
 *
 * NOTE: The actual header DOM structure is owned by the headless CalendarHeader.
 * This variant is used by the *Styled wrappers via a minimal structural selector
 * `[&_[data-calendar-header]]` to apply layout tokens.
 */
export const CALENDAR_HEADER_CLASSES = calendarHeaderVariants();
