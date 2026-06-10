"use client";

import { forwardRef, useRef, useCallback } from "react";
import type React from "react";
import { createPortal } from "react-dom";
import { useSearchField, useOverlay, usePreventScroll, useButton, FocusScope } from "react-aria";
import { useSearchFieldState } from "react-stately";
import type { SearchBarHeadlessProps, SearchViewHeadlessProps } from "./Search.types";

// ─── MD3 Icons ────────────────────────────────────────────────────────────────

/**
 * MD3 Arrow Back icon — 24×24, currentColor, aria-hidden.
 * Used as the leading button in Search View to close/collapse back to bar.
 */
const ArrowBackIcon = (): React.ReactElement => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);

/**
 * MD3 Close icon — 24×24, currentColor, aria-hidden.
 * Used as the clear button in Search View to reset input text.
 */
const CloseIcon = (): React.ReactElement => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

// ─── SearchBarHeadless ────────────────────────────────────────────────────────

/**
 * SearchBarHeadless — Layer 2 headless primitive for the MD3 Search bar.
 *
 * Renders `<form role="search">` wrapping an accessible search input.
 * Uses `useSearchField` + `useSearchFieldState` from React Aria/Stately.
 *
 * Features:
 * - `role="search"` on the form wrapper
 * - `role="searchbox"` on the input (via type="search")
 * - Keyboard: Enter → onSubmit, Escape (with value) → onClear
 * - Leading icon, trailing actions, and avatar slots
 * - aria-label falls back to placeholder per MD3 labeling spec
 *
 * @example
 * ```tsx
 * <SearchBarHeadless
 *   placeholder="Search messages"
 *   onFocus={() => setOpen(true)}
 *   className="my-search-bar"
 * />
 * ```
 */
export const SearchBarHeadless = forwardRef<HTMLFormElement, SearchBarHeadlessProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      onSubmit,
      onClear,
      placeholder,
      leadingIcon,
      trailingActions,
      avatar,
      isDisabled,
      "aria-label": ariaLabel,
      className,
      onFocus,
      onBlur,
    },
    forwardedRef
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const internalFormRef = useRef<HTMLFormElement>(null);
    const formRef = (forwardedRef ?? internalFormRef) as React.RefObject<HTMLFormElement>;

    const state = useSearchFieldState({
      ...(value !== undefined ? { value } : {}),
      ...(defaultValue !== undefined ? { defaultValue } : {}),
      ...(onChange !== undefined ? { onChange } : {}),
      ...(onSubmit !== undefined ? { onSubmit } : {}),
      ...(onClear !== undefined ? { onClear } : {}),
    });

    const { inputProps } = useSearchField(
      {
        "aria-label": ariaLabel ?? placeholder ?? "Search",
        ...(placeholder !== undefined ? { placeholder } : {}),
        ...(isDisabled !== undefined ? { isDisabled } : {}),
        ...(onSubmit !== undefined ? { onSubmit } : {}),
        ...(onClear !== undefined ? { onClear } : {}),
        ...(onFocus !== undefined ? { onFocus: () => onFocus() } : {}),
        ...(onBlur !== undefined ? { onBlur: () => onBlur() } : {}),
      },
      state,
      inputRef
    );

    const handleFormSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(state.value);
      },
      [onSubmit, state.value]
    );

    return (
      <form ref={formRef} role="search" className={className} onSubmit={handleFormSubmit}>
        {leadingIcon && <span data-slot="leading-icon">{leadingIcon}</span>}
        <input {...inputProps} ref={inputRef} role="searchbox" />
        {trailingActions && trailingActions.length > 0 && (
          <span data-slot="trailing-actions">
            {trailingActions.map((action, index) => (
              <span key={index} data-slot="trailing-action">
                {action}
              </span>
            ))}
          </span>
        )}
        {avatar && <span data-slot="avatar">{avatar}</span>}
      </form>
    );
  }
);

SearchBarHeadless.displayName = "SearchBarHeadless";

// ─── SearchViewHeadless ───────────────────────────────────────────────────────

/**
 * SearchViewHeadless — Layer 2 headless primitive for the MD3 Search view.
 *
 * Renders in a portal when `isOpen={true}`. Does not render when closed.
 * Uses `useOverlay` for Escape-key dismissal, `usePreventScroll` to lock
 * body scrolling, and `FocusScope` for focus trapping.
 *
 * Features:
 * - Portal rendering via `createPortal`
 * - Escape key → onClose
 * - Body scroll lock when open
 * - Focus trap with auto-focus and restore on close
 * - aria-live region for autosuggest announcements
 * - Back arrow (MD3 SVG icon) + input + clear button (MD3 SVG icon) header
 *
 * Slot class names (`headerClassName`, `backButtonClassName`, etc.) are passed
 * from the styled `SearchView` layer so per-slot CVA classes apply directly to
 * each element — no descendant-selector blobs needed.
 *
 * @example
 * ```tsx
 * <SearchViewHeadless
 *   isOpen={isOpen}
 *   onClose={() => setOpen(false)}
 *   aria-label="Search messages"
 * >
 *   <List>{results.map(r => <ListItem key={r.id} headline={r.label} />)}</List>
 * </SearchViewHeadless>
 * ```
 */
export const SearchViewHeadless = forwardRef<HTMLDivElement, SearchViewHeadlessProps>(
  (
    {
      isOpen,
      onClose,
      value,
      defaultValue,
      onChange,
      onSubmit,
      placeholder,
      "aria-label": ariaLabel,
      className,
      children,
      leadingIcon,
      trailingActions,
      showDivider,
      headerClassName,
      backButtonClassName,
      clearButtonClassName,
      inputClassName,
      dividerClassName,
      contentClassName,
    },
    forwardedRef
  ) => {
    if (!isOpen) {
      return null;
    }

    return createPortal(
      <SearchViewPanel
        ref={forwardedRef}
        onClose={onClose}
        ariaLabel={ariaLabel}
        {...(className !== undefined ? { className } : {})}
        {...(leadingIcon !== undefined ? { leadingIcon } : {})}
        {...(trailingActions !== undefined ? { trailingActions } : {})}
        {...(showDivider !== undefined ? { showDivider } : {})}
        {...(value !== undefined ? { value } : {})}
        {...(defaultValue !== undefined ? { defaultValue } : {})}
        {...(onChange !== undefined ? { onChange } : {})}
        {...(onSubmit !== undefined ? { onSubmit } : {})}
        {...(placeholder !== undefined ? { placeholder } : {})}
        headerClassName={headerClassName}
        backButtonClassName={backButtonClassName}
        clearButtonClassName={clearButtonClassName}
        inputClassName={inputClassName}
        dividerClassName={dividerClassName}
        contentClassName={contentClassName}
      >
        {children}
      </SearchViewPanel>,
      document.body
    );
  }
);

SearchViewHeadless.displayName = "SearchViewHeadless";

// ─── SearchViewPanel (internal) ───────────────────────────────────────────────

interface SearchViewPanelProps {
  onClose: () => void;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  ariaLabel: string;
  className?: string;
  children?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  trailingActions?: React.ReactNode[];
  showDivider?: boolean;
  // Slot class names from the styled layer
  headerClassName?: string | undefined;
  backButtonClassName?: string | undefined;
  clearButtonClassName?: string | undefined;
  inputClassName?: string | undefined;
  dividerClassName?: string | undefined;
  contentClassName?: string | undefined;
}

/**
 * Inner panel for the search view. Separated to allow hooks
 * (`usePreventScroll`, `useOverlay`) which must be called unconditionally.
 * @internal
 */
const SearchViewPanel = forwardRef<HTMLDivElement, SearchViewPanelProps>(
  (
    {
      onClose,
      value,
      defaultValue,
      onChange,
      onSubmit,
      placeholder,
      ariaLabel,
      className,
      children,
      leadingIcon,
      trailingActions,
      showDivider,
      headerClassName,
      backButtonClassName,
      clearButtonClassName,
      inputClassName,
      dividerClassName,
      contentClassName,
    },
    forwardedRef
  ) => {
    const panelRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const ref = (forwardedRef ?? panelRef) as React.RefObject<HTMLDivElement>;

    usePreventScroll();

    const { overlayProps } = useOverlay(
      {
        isOpen: true,
        onClose,
        isDismissable: true,
        shouldCloseOnBlur: false,
      },
      ref
    );

    const state = useSearchFieldState({
      ...(value !== undefined ? { value } : {}),
      ...(defaultValue !== undefined ? { defaultValue } : {}),
      ...(onChange !== undefined ? { onChange } : {}),
      ...(onSubmit !== undefined ? { onSubmit } : {}),
    });

    const { inputProps, clearButtonProps } = useSearchField(
      {
        "aria-label": ariaLabel,
        ...(placeholder !== undefined ? { placeholder } : {}),
        ...(onSubmit !== undefined ? { onSubmit } : {}),
        onClear: () => {
          state.setValue("");
        },
      },
      state,
      inputRef
    );

    const clearButtonRef = useRef<HTMLButtonElement>(null);
    const { buttonProps: clearBtnDomProps } = useButton(clearButtonProps, clearButtonRef);

    const handleBackClick = useCallback(() => {
      onClose();
    }, [onClose]);

    // MD3 SVG back arrow — replaces the former literal "←" glyph
    const defaultBackButton = (
      <button
        type="button"
        aria-label="Back"
        onClick={handleBackClick}
        data-slot="back-button"
        className={backButtonClassName}
      >
        <ArrowBackIcon />
      </button>
    );

    // MD3 SVG close icon — replaces the former literal "✕" glyph
    // Visible only when input has a value (controlled by state.value)
    const clearButton = state.value ? (
      <button
        {...clearBtnDomProps}
        ref={clearButtonRef}
        type="button"
        aria-label="Clear search"
        data-slot="clear-button"
        className={clearButtonClassName}
      >
        <CloseIcon />
      </button>
    ) : null;

    return (
      <FocusScope contain restoreFocus autoFocus>
        <div {...overlayProps} ref={ref} role="search" aria-label={ariaLabel} className={className}>
          <div data-slot="header" className={headerClassName}>
            {/* Leading icon: custom override or default MD3 back arrow */}
            {leadingIcon ?? defaultBackButton}

            {/* Search input */}
            <input
              {...inputProps}
              ref={inputRef}
              role="searchbox"
              data-slot="input"
              className={inputClassName}
            />

            {/* Clear button */}
            {clearButton}

            {/* Trailing actions (view-state only) */}
            {trailingActions && trailingActions.length > 0 && (
              <span data-slot="trailing-actions">
                {trailingActions.map((action, index) => (
                  <span key={index} data-slot="trailing-action">
                    {action}
                  </span>
                ))}
              </span>
            )}
          </div>

          {/* Divider (divided style only) */}
          {showDivider && <hr data-slot="divider" className={dividerClassName} />}

          {/* Results / suggestions content area */}
          <div data-slot="content" aria-live="polite" className={contentClassName}>
            {children}
          </div>
        </div>
      </FocusScope>
    );
  }
);

SearchViewPanel.displayName = "SearchViewPanel";
