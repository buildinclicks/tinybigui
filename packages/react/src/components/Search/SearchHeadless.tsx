"use client";

import { forwardRef, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useSearchField, useOverlay, usePreventScroll, useButton, FocusScope } from "react-aria";
import { useSearchFieldState } from "react-stately";
import type { SearchBarHeadlessProps, SearchViewHeadlessProps } from "./Search.types";

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
 * - Back arrow (leading icon) + input + clear button header
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
      >
        {children}
      </SearchViewPanel>,
      document.body
    );
  }
);

SearchViewHeadless.displayName = "SearchViewHeadless";

// ─── SearchViewPanel (internal) ──────────────────────────────────────────────

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

    const defaultBackArrow = (
      <button type="button" aria-label="Back" onClick={handleBackClick} data-slot="back-button">
        ←
      </button>
    );

    const clearButton = state.value ? (
      <button
        {...clearBtnDomProps}
        ref={clearButtonRef}
        type="button"
        aria-label="Clear search"
        data-slot="clear-button"
      >
        ✕
      </button>
    ) : null;

    return (
      <FocusScope contain restoreFocus autoFocus>
        <div {...overlayProps} ref={ref} role="search" aria-label={ariaLabel} className={className}>
          <div data-slot="header">
            <span data-slot="leading-icon">{leadingIcon ?? defaultBackArrow}</span>
            <input {...inputProps} ref={inputRef} role="searchbox" />
            {clearButton}
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
          {showDivider && <hr data-slot="divider" />}
          <div data-slot="content" aria-live="polite">
            {children}
          </div>
        </div>
      </FocusScope>
    );
  }
);

SearchViewPanel.displayName = "SearchViewPanel";
