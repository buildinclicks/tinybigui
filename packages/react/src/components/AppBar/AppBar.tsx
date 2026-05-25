"use client";

import { forwardRef } from "react";
import { AppBarHeadless } from "./AppBarHeadless";
import { appBarVariants, appBarTitleVariants, appBarSubtitleVariants } from "./AppBar.variants";
import { cn } from "../../utils/cn";
import { useScrollElevation } from "../../hooks/useScrollElevation";
import type { AppBarProps } from "./AppBar.types";

/**
 * Material Design 3 Top App Bar Component
 *
 * Provides context and actions for the current screen. Supports four size variants,
 * a navigation icon slot, title, and trailing action icon slots. Implements
 * scroll-triggered elevation changes per MD3 specification.
 *
 * **Architecture:**
 * - Layer 3 (this file): MD3 styled, CVA variants, layout composition
 * - Layer 2: `AppBarHeadless` — `<header role="banner">`, scroll state
 * - Layer 1: React Aria via `<IconButton>` in consumer slots
 *
 * **Key Features:**
 * - 4 MD3 variants: small, center-aligned, medium, large
 * - Optional subtitle (per M3 Expressive spec) with per-variant typography
 * - Composable API: pass `<IconButton>` nodes into navigation and action slots
 * - Scroll elevation: flat (bg-surface) at rest → bg-surface-container + shadow-elevation-2 on scroll
 * - Controlled and uncontrolled scroll state
 * - WCAG 2.1 AA: `role="banner"` landmark, keyboard accessible slots
 * - Dark mode via existing token system
 *
 * **MD3 Accessibility (m3.material.io/components/app-bars/accessibility):**
 * - Focus lands on the leading navigation button first (first interactive element in DOM)
 * - Tab navigates: leading icon → trailing action icons (left to right)
 * - Space / Enter activates the focused element
 * - All icon buttons MUST have descriptive `aria-label` attributes
 * - Title text is the accessibility label for the current page context
 *
 * @example
 * ```tsx
 * // Small variant (default)
 * <AppBar
 *   title="Page Title"
 *   navigationIcon={
 *     <IconButton aria-label="Open navigation menu">
 *       <MenuIcon />
 *     </IconButton>
 *   }
 *   actions={
 *     <IconButton aria-label="Search">
 *       <SearchIcon />
 *     </IconButton>
 *   }
 * />
 *
 * // Center-aligned with scroll elevation
 * <AppBar
 *   variant="center-aligned"
 *   title="My App"
 *   scrolled={isScrolled}
 *   onScrollStateChange={setIsScrolled}
 * />
 *
 * // Medium with expanded title and subtitle
 * <AppBar
 *   variant="medium"
 *   title="Article Title"
 *   subtitle="Author · 5 min read"
 *   navigationIcon={
 *     <IconButton aria-label="Go back">
 *       <ArrowBackIcon />
 *     </IconButton>
 *   }
 * />
 * ```
 */
export const AppBar = forwardRef<HTMLElement, AppBarProps>(
  (
    {
      variant = "small",
      title,
      subtitle,
      navigationIcon,
      actions,
      scrolled: scrolledProp,
      onScrollStateChange,
      className,
    },
    ref
  ) => {
    const { isScrolled } = useScrollElevation({
      scrolled: scrolledProp,
      onScrollStateChange,
    });

    const isExpandedVariant = variant === "medium" || variant === "large";

    return (
      <AppBarHeadless
        ref={ref}
        // Pass scrolled as controlled (already resolved by useScrollElevation above)
        scrolled={isScrolled}
        className={cn(appBarVariants({ variant, scrolled: isScrolled }), className)}
      >
        {/* Top row: navigation icon + title (small/center-aligned) + actions */}
        <div
          data-slot="top-row"
          className={cn(
            "flex items-center justify-between",
            "px-1",
            // Small and center-aligned: fill the full bar height
            !isExpandedVariant && "flex-1",
            // Expanded variants: fixed height for the top row (64dp)
            isExpandedVariant && "h-16 shrink-0"
          )}
        >
          {/* Navigation icon slot (leading) */}
          {navigationIcon != null && (
            <div data-slot="navigation" className="flex shrink-0 items-center">
              {navigationIcon}
            </div>
          )}

          {/* Title + subtitle — rendered in top row for small and center-aligned variants */}
          {!isExpandedVariant && (
            <div
              className={cn(
                "flex min-w-0 flex-1 flex-col justify-center px-1",
                variant === "center-aligned" && "text-center"
              )}
            >
              <span data-testid="appbar-title" className={cn(appBarTitleVariants({ variant }))}>
                {title}
              </span>
              {subtitle != null && (
                <span
                  data-testid="appbar-subtitle"
                  className={cn(appBarSubtitleVariants({ variant }))}
                >
                  {subtitle}
                </span>
              )}
            </div>
          )}

          {/* Actions slot (trailing) */}
          {actions != null && (
            <div data-slot="actions" className="flex shrink-0 items-center gap-0.5">
              {actions}
            </div>
          )}
        </div>

        {/* Expanded title + subtitle row — only for medium and large variants */}
        {isExpandedVariant && (
          <div
            data-slot="expanded-title"
            className={cn("flex flex-1 flex-col justify-end", "gap-0.5 px-4 pb-4")}
          >
            <span
              data-testid="appbar-title"
              className={cn("min-w-0", appBarTitleVariants({ variant }))}
            >
              {title}
            </span>
            {subtitle != null && (
              <span
                data-testid="appbar-subtitle"
                className={cn("min-w-0", appBarSubtitleVariants({ variant }))}
              >
                {subtitle}
              </span>
            )}
          </div>
        )}
      </AppBarHeadless>
    );
  }
);

AppBar.displayName = "AppBar";
