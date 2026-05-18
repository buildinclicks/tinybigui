"use client";

import { forwardRef, useState, useCallback } from "react";
import { SearchBar } from "./SearchBar";
import { SearchView } from "./SearchView";
import type { SearchProps } from "./Search.types";

/**
 * Material Design 3 Search Compound Component (Layer 3: Styled)
 *
 * Combines SearchBar + SearchView in one controlled/uncontrolled unit.
 * Manages the open/close lifecycle between the collapsed bar and expanded view.
 *
 * - When closed: renders SearchBar; focus → opens SearchView
 * - When open: renders SearchView; back/Escape → closes to SearchBar
 *
 * @example
 * ```tsx
 * // Uncontrolled
 * <Search placeholder="Search messages">
 *   <List>{suggestions.map(s => <ListItem key={s.id} headline={s.label} />)}</List>
 * </Search>
 *
 * // Controlled
 * <Search
 *   isOpen={isOpen}
 *   onOpenChange={setOpen}
 *   value={query}
 *   onChange={setQuery}
 *   placeholder="Search files"
 * >
 *   <List>{results.map(r => <ListItem key={r.id} headline={r.label} />)}</List>
 * </Search>
 * ```
 */
export const Search = forwardRef<HTMLFormElement, SearchProps>(
  (
    {
      isOpen: controlledIsOpen,
      onOpenChange,
      value,
      defaultValue,
      onChange,
      onSubmit,
      onClear,
      placeholder,
      leadingIcon,
      trailingActions,
      avatar,
      isDisabled = false,
      "aria-label": ariaLabel,
      className,
      searchStyle = "contained",
      layout = "fullscreen",
      children,
      viewAriaLabel,
    },
    ref
  ) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const isControlled = controlledIsOpen !== undefined;
    const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

    const handleOpenChange = useCallback(
      (open: boolean) => {
        if (!isControlled) {
          setInternalIsOpen(open);
        }
        onOpenChange?.(open);
      },
      [isControlled, onOpenChange]
    );

    const handleFocus = useCallback(() => {
      handleOpenChange(true);
    }, [handleOpenChange]);

    const handleClose = useCallback(() => {
      handleOpenChange(false);
    }, [handleOpenChange]);

    if (isOpen) {
      return (
        <SearchView
          isOpen
          onClose={handleClose}
          {...(value !== undefined ? { value } : {})}
          {...(defaultValue !== undefined ? { defaultValue } : {})}
          {...(onChange !== undefined ? { onChange } : {})}
          {...(onSubmit !== undefined ? { onSubmit } : {})}
          {...(placeholder !== undefined ? { placeholder } : {})}
          aria-label={viewAriaLabel ?? ariaLabel ?? placeholder ?? "Search"}
          searchStyle={searchStyle}
          layout={layout}
          {...(trailingActions !== undefined ? { trailingActions } : {})}
        >
          {children}
        </SearchView>
      );
    }

    return (
      <SearchBar
        ref={ref}
        {...(value !== undefined ? { value } : {})}
        {...(defaultValue !== undefined ? { defaultValue } : {})}
        {...(onChange !== undefined ? { onChange } : {})}
        {...(onSubmit !== undefined ? { onSubmit } : {})}
        {...(onClear !== undefined ? { onClear } : {})}
        {...(placeholder !== undefined ? { placeholder } : {})}
        {...(leadingIcon !== undefined ? { leadingIcon } : {})}
        {...(trailingActions !== undefined ? { trailingActions } : {})}
        {...(avatar !== undefined ? { avatar } : {})}
        isDisabled={isDisabled}
        {...(ariaLabel !== undefined ? { "aria-label": ariaLabel } : {})}
        {...(className !== undefined ? { className } : {})}
        searchStyle={searchStyle}
        onFocus={handleFocus}
      />
    );
  }
);

Search.displayName = "Search";
