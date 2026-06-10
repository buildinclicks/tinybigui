"use client";

import { forwardRef } from "react";
import { SearchViewHeadless } from "./SearchHeadless";
import {
  searchViewVariants,
  searchViewHeaderVariants,
  searchViewBackButtonVariants,
  searchViewClearButtonVariants,
  searchViewTrailingActionVariants,
  searchViewTrailingActionsVariants,
  searchViewInputVariants,
  searchViewDividerVariants,
  searchViewContentVariants,
} from "./Search.variants";
import { cn } from "../../utils/cn";
import type { SearchViewProps } from "./Search.types";

/**
 * Material Design 3 Search View Component (Layer 3: Styled)
 *
 * The expanded/focused search experience rendered in a portal over page content.
 * Uses per-slot CVAs for all styling — no descendant-selector blobs.
 *
 * Anatomy:
 *   Header: [Back arrow] [Input] [Clear button] [Optional trailing actions]
 *   Divider (divided style only)
 *   Content area: children (suggestions/results via List component)
 *
 * Features:
 * - Portal rendering with focus trap and scroll lock (via headless)
 * - Compound variants for all 4 style × layout combinations
 * - Docked layout: animate-md-scale-in on mount
 * - Fullscreen layout: animate-md-fade-in on mount
 * - Clear button visible only when input has value (controlled by headless)
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

    // Enter motion: docked uses scale-in (feels contained/popover-like),
    // fullscreen uses fade-in (covers the screen, no scale distortion).
    const enterMotionClass = layout === "docked" ? "animate-md-scale-in" : "animate-md-fade-in";

    // ── Slot class strings resolved from CVAs ────────────────────────────────
    const containerClass = cn(
      searchViewVariants({ style: searchStyle, layout }),
      enterMotionClass,
      className
    );

    const headerClass = cn(searchViewHeaderVariants({ style: searchStyle, layout }));

    const backButtonClass = cn(searchViewBackButtonVariants());

    const clearButtonClass = cn(searchViewClearButtonVariants());

    const trailingActionClass = cn(searchViewTrailingActionVariants());
    const trailingActionsGroupClass = cn(searchViewTrailingActionsVariants());

    const inputClass = cn(searchViewInputVariants());

    const dividerClass = cn(searchViewDividerVariants());

    const contentClass = cn(searchViewContentVariants());

    // ── Styled leading icon ──────────────────────────────────────────────────
    const styledLeadingIcon = leadingIcon ? (
      <span className="text-on-surface flex size-12 shrink-0 items-center justify-center">
        {leadingIcon}
      </span>
    ) : undefined;

    // ── Styled trailing actions ───────────────────────────────────────────────
    const styledTrailingActions = trailingActions?.map((action, index) => (
      <span key={index} className={trailingActionClass}>
        {action}
      </span>
    ));

    return (
      <SearchViewHeadless
        ref={ref}
        isOpen={isOpen}
        onClose={onClose}
        layout={layout}
        {...(value !== undefined ? { value } : {})}
        {...(defaultValue !== undefined ? { defaultValue } : {})}
        {...(onChange !== undefined ? { onChange } : {})}
        {...(onSubmit !== undefined ? { onSubmit } : {})}
        {...(placeholder !== undefined ? { placeholder } : {})}
        aria-label={ariaLabel}
        {...(styledLeadingIcon !== undefined ? { leadingIcon: styledLeadingIcon } : {})}
        {...(styledTrailingActions !== undefined ? { trailingActions: styledTrailingActions } : {})}
        showDivider={resolvedShowDivider}
        // ── Slot class names passed to headless for direct application ────────
        className={containerClass}
        headerClassName={headerClass}
        backButtonClassName={backButtonClass}
        clearButtonClassName={clearButtonClass}
        inputClassName={inputClass}
        trailingActionsClassName={trailingActionsGroupClass}
        dividerClassName={dividerClass}
        contentClassName={contentClass}
      >
        {children}
      </SearchViewHeadless>
    );
  }
);

SearchView.displayName = "SearchView";
