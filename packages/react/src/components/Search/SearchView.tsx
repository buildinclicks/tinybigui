"use client";

import { forwardRef } from "react";
import { SearchViewHeadless } from "./SearchHeadless";
import { searchViewVariants } from "./Search.variants";
import { cn } from "../../utils/cn";
import type { SearchViewProps } from "./Search.types";

/**
 * Material Design 3 Search View Component (Layer 3: Styled)
 *
 * The expanded/focused search experience with input and results.
 * Displayed in a portal over page content.
 *
 * Anatomy:
 *   Header: [Back arrow] [Input] [Clear button] [Optional trailing actions]
 *   Divider (divided style only)
 *   Content area: children (suggestions/results via List component)
 *
 * Features:
 * - Portal rendering with focus trap and scroll lock (via headless)
 * - Compound variants for 4 style+layout combinations
 * - Animate on mount with `animate-md-scale-in`
 * - Clear button visible only when input has value
 * - aria-live region for autosuggest announcements
 *
 * @example
 * ```tsx
 * <SearchView
 *   isOpen={isOpen}
 *   onClose={() => setOpen(false)}
 *   aria-label="Search messages"
 *   searchStyle="contained"
 *   layout="fullscreen"
 * >
 *   <List>{suggestions.map(s => <ListItem key={s.id} headline={s.label} />)}</List>
 * </SearchView>
 * ```
 */
export const SearchView = forwardRef<HTMLDivElement, SearchViewProps>(
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
      searchStyle = "contained",
      layout = "fullscreen",
      leadingIcon,
      trailingActions,
      showDivider,
    },
    ref
  ) => {
    const resolvedShowDivider = showDivider ?? searchStyle === "divided";

    const styledLeadingIcon = leadingIcon ? (
      <span className="text-on-surface flex size-12 shrink-0 items-center justify-center">
        {leadingIcon}
      </span>
    ) : undefined;

    const styledTrailingActions = trailingActions?.map((action, index) => (
      <span
        key={index}
        className="text-on-surface-variant flex size-12 shrink-0 items-center justify-center"
      >
        {action}
      </span>
    ));

    return (
      <SearchViewHeadless
        ref={ref}
        isOpen={isOpen}
        onClose={onClose}
        {...(value !== undefined ? { value } : {})}
        {...(defaultValue !== undefined ? { defaultValue } : {})}
        {...(onChange !== undefined ? { onChange } : {})}
        {...(onSubmit !== undefined ? { onSubmit } : {})}
        {...(placeholder !== undefined ? { placeholder } : {})}
        aria-label={ariaLabel}
        {...(styledLeadingIcon !== undefined ? { leadingIcon: styledLeadingIcon } : {})}
        {...(styledTrailingActions !== undefined ? { trailingActions: styledTrailingActions } : {})}
        showDivider={resolvedShowDivider}
        className={cn(
          searchViewVariants({ style: searchStyle, layout }),
          "animate-md-scale-in",
          getHeaderClasses(searchStyle, layout),
          slotClasses,
          className
        )}
      >
        {children}
      </SearchViewHeadless>
    );
  }
);

SearchView.displayName = "SearchView";

/**
 * Static slot styling applied via descendant selectors on the container.
 * Targets data-slot attributes rendered by SearchViewHeadless.
 */
const slotClasses = cn(
  // Input styling
  "[&_input]:flex-1 [&_input]:bg-transparent [&_input]:outline-none",
  "[&_input]:text-body-large [&_input]:text-on-surface",
  "[&_input]:placeholder:text-on-surface-variant",
  // Divider
  "[&>[data-slot=divider]]:border-outline",
  // Content area
  "[&>[data-slot=content]]:flex-1 [&>[data-slot=content]]:overflow-y-auto",
  // Clear button
  "[&_[data-slot=clear-button]]:size-12 [&_[data-slot=clear-button]]:flex",
  "[&_[data-slot=clear-button]]:items-center [&_[data-slot=clear-button]]:justify-center",
  "[&_[data-slot=clear-button]]:text-on-surface-variant",
  "[&_[data-slot=clear-button]]:transition-opacity [&_[data-slot=clear-button]]:duration-short4",
  "[&_[data-slot=clear-button]]:ease-standard",
  // Back button
  "[&_[data-slot=back-button]]:size-12 [&_[data-slot=back-button]]:flex",
  "[&_[data-slot=back-button]]:items-center [&_[data-slot=back-button]]:justify-center",
  "[&_[data-slot=back-button]]:text-on-surface"
);

/**
 * Resolves header height and padding based on style + layout combination.
 * Contained: 56dp height, 12dp (px-3) side padding.
 * Divided + fullscreen: 72dp height, 16dp (px-4) side padding.
 * Divided + docked (or any docked): 56dp height.
 */
function getHeaderClasses(style: "contained" | "divided", layout: "fullscreen" | "docked"): string {
  const base =
    "[&>[data-slot=header]]:flex [&>[data-slot=header]]:items-center [&>[data-slot=header]]:w-full [&>[data-slot=header]]:bg-surface-container-high [&>[data-slot=header]]:gap-1";

  if (layout === "docked") {
    return cn(
      base,
      "[&>[data-slot=header]]:h-14",
      style === "contained" ? "[&>[data-slot=header]]:px-3" : "[&>[data-slot=header]]:px-4"
    );
  }

  if (style === "contained") {
    return cn(base, "[&>[data-slot=header]]:h-14 [&>[data-slot=header]]:px-3");
  }

  return cn(base, "[&>[data-slot=header]]:h-[72px] [&>[data-slot=header]]:px-4");
}
