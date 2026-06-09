"use client";

import type React from "react";
import { useRef } from "react";
import { useButton } from "react-aria";

import type { PressEvent } from "react-aria";

/**
 * Internal props for a calendar navigation button.
 * Matches the subset of AriaButtonProps returned by useCalendar.
 * @internal
 */
interface CalendarNavigationButtonProps {
  /** Accessible label for the button */
  "aria-label"?: string | undefined;
  /** Handler called when the button is pressed */
  onPress?: ((e: PressEvent) => void) | undefined;
  /** Whether the button is disabled */
  isDisabled?: boolean | undefined;
}

/**
 * Props for a slot navigation button component.
 * Receives all CalendarNavigationButtonProps plus children (the icon).
 */
export interface NavButtonComponentProps extends CalendarNavigationButtonProps {
  children?: React.ReactNode;
}

/**
 * Props for a slot title component.
 */
export interface TitleComponentProps {
  /** The formatted title string (e.g., "August 2025") */
  title: string;
  /** Handler when the title is clicked to toggle year view */
  onClick?: (() => void) | undefined;
  /** Whether to show the dropdown indicator */
  showDropdownIndicator?: boolean | undefined;
}

/**
 * Internal props for the CalendarHeader headless component.
 * @internal
 */
interface CalendarHeaderProps {
  /** Formatted title (e.g., "August 2025") */
  title: string;
  /** Props for the previous month navigation button */
  prevButtonProps: CalendarNavigationButtonProps;
  /** Props for the next month navigation button */
  nextButtonProps: CalendarNavigationButtonProps;
  /** Called when the title is clicked (to toggle year selection view) */
  onTitleClick?: () => void;
  /** Whether to show the dropdown indicator on the title */
  showDropdownIndicator?: boolean;
  /**
   * Optional slot component for rendering each nav button.
   * Defaults to the built-in unstyled NavigationButton.
   */
  NavButtonComponent?: React.ComponentType<NavButtonComponentProps>;
  /**
   * Optional slot component for rendering the title.
   * Defaults to the built-in unstyled title div/button.
   */
  TitleComponent?: React.ComponentType<TitleComponentProps>;
}

/**
 * Navigation button using React Aria's `useButton` for accessibility.
 * Default unstyled implementation.
 * @internal
 */
function NavigationButton({
  children,
  isDisabled,
  onPress,
  "aria-label": ariaLabel,
}: NavButtonComponentProps): JSX.Element {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(
    {
      isDisabled: isDisabled ?? false,
      ...(onPress ? { onPress } : {}),
      ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
    },
    ref
  );

  return (
    <button {...buttonProps} ref={ref} type="button" data-nav-button>
      {children}
    </button>
  );
}

/**
 * Chevron left SVG icon for previous month navigation.
 * @internal
 */
function ChevronLeftIcon(): JSX.Element {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
    </svg>
  );
}

/**
 * Chevron right SVG icon for next month navigation.
 * @internal
 */
function ChevronRightIcon(): JSX.Element {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  );
}

/**
 * Dropdown arrow SVG icon for year selection toggle.
 * @internal
 */
export function DropdownArrowIcon(): JSX.Element {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M7 10l5 5 5-5z" />
    </svg>
  );
}

/**
 * Default unstyled title renderer.
 * @internal
 */
function DefaultTitle({ title, onClick, showDropdownIndicator }: TitleComponentProps): JSX.Element {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        data-calendar-title
        aria-label={`${title}, click to select year`}
      >
        <h2 aria-live="polite">{title}</h2>
        {showDropdownIndicator && <DropdownArrowIcon />}
      </button>
    );
  }
  return (
    <div data-calendar-title>
      <h2 aria-live="polite">{title}</h2>
    </div>
  );
}

/**
 * Headless CalendarHeader (Layer 2)
 *
 * Renders month/year navigation controls with proper ARIA semantics.
 * Includes previous/next month buttons and an `aria-live="polite"` heading
 * for screen reader announcements of month changes.
 *
 * The `NavButtonComponent` and `TitleComponent` slots allow the styled layer
 * to inject CVA-styled navigation buttons and the title pill without touching
 * this headless layer.
 *
 * @internal
 */
export function CalendarHeader({
  title,
  prevButtonProps,
  nextButtonProps,
  onTitleClick,
  showDropdownIndicator = false,
  NavButtonComponent = NavigationButton,
  TitleComponent = DefaultTitle,
}: CalendarHeaderProps): JSX.Element {
  const enhancedPrevProps: CalendarNavigationButtonProps = {
    ...prevButtonProps,
    "aria-label": "Previous month",
  };

  const enhancedNextProps: CalendarNavigationButtonProps = {
    ...nextButtonProps,
    "aria-label": "Next month",
  };

  return (
    <div data-calendar-header>
      <TitleComponent
        title={title}
        onClick={onTitleClick}
        showDropdownIndicator={showDropdownIndicator}
      />
      <div data-calendar-nav>
        <NavButtonComponent {...enhancedPrevProps}>
          <ChevronLeftIcon />
        </NavButtonComponent>
        <NavButtonComponent {...enhancedNextProps}>
          <ChevronRightIcon />
        </NavButtonComponent>
      </div>
    </div>
  );
}

CalendarHeader.displayName = "CalendarHeader";
