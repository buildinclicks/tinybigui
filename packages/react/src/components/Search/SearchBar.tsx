"use client";

import { forwardRef, useState, useCallback } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { SearchBarHeadless } from "./SearchHeadless";
import { searchBarVariants } from "./Search.variants";
import { cn } from "../../utils/cn";
import { useRipple } from "../../hooks/useRipple";
import type { SearchBarProps } from "./Search.types";

/**
 * Material Design 3 Search Bar Component (Layer 3: Styled)
 *
 * The collapsed/maximized state search affordance that transitions
 * to Focused State (SearchView) on click/focus.
 *
 * Anatomy:
 *   [Container] [Leading icon] [Supporting text/input] [Trailing actions] [Avatar]
 *
 * Features:
 * - MD3 state layer with hover/active opacity transitions
 * - Ripple effect on press (Material Design state 4)
 * - Focus indicator: 3dp ring in secondary color
 * - M3 Expressive pane margin transition (24dp → 12dp on focus)
 * - Automatic `noActions` variant when no trailing actions/avatar
 *
 * @example
 * ```tsx
 * <SearchBar
 *   placeholder="Search messages"
 *   leadingIcon={<SearchIcon />}
 *   trailingActions={[<IconButton key="mic" icon={<MicIcon />} aria-label="Voice search" />]}
 *   onFocus={() => setOpen(true)}
 * />
 * ```
 */
export const SearchBar = forwardRef<HTMLFormElement, SearchBarProps>(
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
      isDisabled = false,
      "aria-label": ariaLabel,
      className,
      searchStyle = "contained",
      onFocus,
      onBlur,
    },
    ref
  ) => {
    const hasNoActions = (!trailingActions || trailingActions.length === 0) && !avatar;

    const reducedMotion = useReducedMotion();
    const [isFocused, setIsFocused] = useState(false);

    const handleFocusInternal = useCallback(() => {
      setIsFocused(true);
      onFocus?.();
    }, [onFocus]);

    const handleBlurInternal = useCallback(() => {
      setIsFocused(false);
      onBlur?.();
    }, [onBlur]);

    const { onMouseDown: handleRipple, ripples } = useRipple({
      disabled: isDisabled,
    });

    const styledLeadingIcon = leadingIcon ? (
      <span className="text-on-surface flex size-12 shrink-0 items-center justify-center">
        <span className="size-6">{leadingIcon}</span>
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

    const styledAvatar = avatar ? (
      <span className="flex size-12 shrink-0 items-center justify-center">
        <span className="size-[30px] overflow-hidden rounded-full">{avatar}</span>
      </span>
    ) : undefined;

    return (
      <div
        className={cn(
          reducedMotion ? "" : "duration-short4 ease-standard transition-[margin]",
          isFocused ? "mx-3" : "mx-6"
        )}
      >
        <div
          role="presentation"
          className={cn(
            "group relative overflow-hidden rounded-full",
            "has-[:focus-visible]:ring-secondary has-[:focus-visible]:ring-3",
            searchBarVariants({
              style: searchStyle,
              noActions: hasNoActions,
              disabled: isDisabled,
            }),
            className
          )}
          onMouseDown={handleRipple}
        >
          <span
            data-slot="state-layer"
            className={cn(
              "bg-on-surface pointer-events-none absolute inset-0 rounded-full opacity-0",
              "group-hover:opacity-8 group-active:opacity-10",
              "duration-spring-standard-fast-effects ease-spring-standard-fast-effects transition-opacity"
            )}
          />

          <SearchBarHeadless
            ref={ref}
            {...(value !== undefined ? { value } : {})}
            {...(defaultValue !== undefined ? { defaultValue } : {})}
            {...(onChange !== undefined ? { onChange } : {})}
            {...(onSubmit !== undefined ? { onSubmit } : {})}
            {...(onClear !== undefined ? { onClear } : {})}
            {...(placeholder !== undefined ? { placeholder } : {})}
            {...(styledLeadingIcon !== undefined ? { leadingIcon: styledLeadingIcon } : {})}
            {...(styledTrailingActions !== undefined
              ? { trailingActions: styledTrailingActions }
              : {})}
            {...(styledAvatar !== undefined ? { avatar: styledAvatar } : {})}
            {...(isDisabled !== undefined ? { isDisabled } : {})}
            {...(ariaLabel !== undefined ? { "aria-label": ariaLabel } : {})}
            onFocus={handleFocusInternal}
            onBlur={handleBlurInternal}
            className={cn(
              "relative z-0 flex h-full w-full items-center",
              "[&_input]:flex-1 [&_input]:bg-transparent [&_input]:outline-none",
              "[&_input]:text-body-large [&_input]:text-on-surface",
              "[&_input]:placeholder:text-on-surface-variant",
              "[&_input]:focus-visible:outline-none"
            )}
          />

          {ripples}
        </div>
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";
