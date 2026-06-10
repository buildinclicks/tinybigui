"use client";

import { forwardRef, useState, useCallback } from "react";
import type React from "react";
import { useHover, useFocusRing, mergeProps } from "react-aria";
import { SearchBarHeadless } from "./SearchHeadless";
import {
  searchBarRootVariants,
  searchBarStateLayerVariants,
  searchBarFocusRingVariants,
  searchBarLeadingIconVariants,
  searchBarTrailingActionVariants,
  searchBarTrailingActionsVariants,
  searchBarAvatarVariants,
  searchBarInputVariants,
} from "./Search.variants";
import { cn } from "../../utils/cn";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import { useRipple } from "../../hooks/useRipple";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { SearchBarProps } from "./Search.types";

/**
 * MD3 default leading search icon — shown when no `leadingIcon` prop is provided.
 * Matches the MD3 Search Bar spec which states the leading slot defaults to a search icon.
 * 24×24, currentColor (inherits `text-on-surface` from the leading-icon slot wrapper).
 */
const DefaultSearchIcon = (): React.ReactElement => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

/**
 * Material Design 3 Search Bar Component (Layer 3: Styled)
 *
 * The collapsed/maximized search affordance that transitions to Focused State
 * (SearchView) on click/focus.
 *
 * Implements the Variants-vs-States architecture: all interaction states are
 * expressed as data-* attributes on the root via `getInteractionDataAttributes`
 * and consumed by each slot via `group-data-[x]/search` Tailwind selectors.
 *
 * Anatomy:
 *   [Leading icon] [Input / placeholder] [Trailing actions] [Avatar]
 *
 * Features:
 * - MD3 state layer: hover 8% / pressed 10% opacity (Standard fast effects spring)
 * - Ripple effect on press (Material Design press state)
 * - Focus ring: Secondary color, 3dp, rendered outside overflow-hidden (sibling pattern)
 * - M3 Expressive pane margin: 24dp → 12dp on focus (Expressive fast spatial spring)
 * - Content flag `data-with-actions` switches container spacing: 16dp → 4dp
 *
 * @example
 * ```tsx
 * <SearchBar
 *   placeholder="Search messages"
 *   leadingIcon={<SearchIcon />}
 *   trailingActions={[<IconButton key="mic" aria-label="Voice search"><MicIcon /></IconButton>]}
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
    const hasActions = (trailingActions != null && trailingActions.length > 0) || !!avatar;
    const reducedMotion = useReducedMotion();

    // Track focus for the M3 Expressive pane-margin transition.
    // This is a content/layout state, not an interaction data-attr, so local state is correct.
    const [isFocused, setIsFocused] = useState(false);

    const handleFocusInternal = useCallback(() => {
      setIsFocused(true);
      onFocus?.();
    }, [onFocus]);

    const handleBlurInternal = useCallback(() => {
      setIsFocused(false);
      onBlur?.();
    }, [onBlur]);

    // ── React Aria interaction state hooks ─────────────────────────────────────
    // useFocusRing with within:true tracks keyboard focus on any descendant.
    // focusProps spread on the container div lets isFocusVisible flow correctly.
    const { isHovered, hoverProps } = useHover({ isDisabled });
    const { isFocusVisible, focusProps } = useFocusRing({ within: true });
    const [isPressed, setIsPressed] = useState(false);

    // Ripple effect
    const { onMouseDown: handleRipple, ripples } = useRipple({ disabled: isDisabled });

    const handleMouseDown = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        setIsPressed(true);
        handleRipple(e);
      },
      [handleRipple]
    );

    const handleMouseUp = useCallback(() => setIsPressed(false), []);

    // ── Slot content ───────────────────────────────────────────────────────────
    // Leading icon: use the provided icon or fall back to the MD3 default search icon.
    // Both are wrapped in the 48dp tap-target + on-surface color slot.
    const styledLeadingIcon = (
      <span className={cn(searchBarLeadingIconVariants())}>
        <span className="size-6">{leadingIcon ?? <DefaultSearchIcon />}</span>
      </span>
    );

    // Each action pre-styled with 48dp tap target; the group flex wrapper is applied
    // via trailingActionsClassName on the <span data-slot="trailing-actions"> in headless.
    const styledTrailingActions = trailingActions?.map((action, index) => (
      <span key={index} className={cn(searchBarTrailingActionVariants())}>
        {action}
      </span>
    ));

    const styledAvatar = avatar ? (
      <span className={cn(searchBarAvatarVariants())}>
        <span className="size-[30px] overflow-hidden rounded-full">{avatar}</span>
      </span>
    ) : undefined;

    // ── M3 Expressive pane margin transition ────────────────────────────────────
    // Contained style only: margins shrink from 24dp → 12dp on focus.
    // Divided style uses fixed static margins (non-Expressive, no animation).
    const paneMarginClass = searchStyle === "contained" ? (isFocused ? "mx-3" : "mx-6") : "";

    const paneTransitionClass =
      searchStyle === "contained" && !reducedMotion
        ? "transition-[margin] duration-expressive-fast-spatial ease-expressive-fast-spatial"
        : "";

    return (
      <div
        role="presentation"
        {...mergeProps(hoverProps, focusProps)}
        className={cn(paneTransitionClass, paneMarginClass)}
        onMouseUp={handleMouseUp}
      >
        {/*
         * Relative wrapper — provides an absolute positioning context for the focus ring
         * that sits outside the inner container's overflow-hidden, so the 3dp ring
         * is never clipped. (Same sibling pattern as Button and Switch.)
         */}
        <div role="presentation" className="relative">
          {/* Focus ring — sibling of inner container, extends 3px beyond pill boundary */}
          <span className={cn(searchBarFocusRingVariants())} aria-hidden="true" />

          {/* Inner container — group/search anchor for data-* selectors */}
          <div
            role="presentation"
            {...getInteractionDataAttributes({
              isHovered,
              isFocusVisible,
              isPressed,
              isDisabled,
            })}
            data-with-actions={hasActions ? "" : undefined}
            className={cn(
              "group/search overflow-hidden",
              searchBarRootVariants({ style: searchStyle }),
              className
            )}
            onMouseDown={(e) => handleMouseDown(e as React.MouseEvent<HTMLElement>)}
          >
            {/* State layer — clipped to pill shape by parent overflow-hidden */}
            <span
              data-slot="state-layer"
              className={cn(searchBarStateLayerVariants())}
              aria-hidden="true"
            />

            {/* Ripple */}
            {ripples}

            {/* Headless form+input — carries all a11y wiring via React Aria */}
            <SearchBarHeadless
              ref={ref}
              {...(value !== undefined ? { value } : {})}
              {...(defaultValue !== undefined ? { defaultValue } : {})}
              {...(onChange !== undefined ? { onChange } : {})}
              {...(onSubmit !== undefined ? { onSubmit } : {})}
              {...(onClear !== undefined ? { onClear } : {})}
              {...(placeholder !== undefined ? { placeholder } : {})}
              leadingIcon={styledLeadingIcon}
              {...(styledTrailingActions !== undefined
                ? { trailingActions: styledTrailingActions }
                : {})}
              {...(styledAvatar !== undefined ? { avatar: styledAvatar } : {})}
              isDisabled={isDisabled}
              {...(ariaLabel !== undefined ? { "aria-label": ariaLabel } : {})}
              onFocus={handleFocusInternal}
              onBlur={handleBlurInternal}
              className="relative z-0 flex h-full w-full items-center"
              inputClassName={cn(searchBarInputVariants())}
              trailingActionsClassName={cn(searchBarTrailingActionsVariants())}
            />
          </div>
        </div>
      </div>
    );
  }
);

SearchBar.displayName = "SearchBar";
