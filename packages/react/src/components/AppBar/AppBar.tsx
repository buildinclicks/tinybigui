"use client";

import { forwardRef } from "react";
import { AppBarHeadless } from "./AppBarHeadless";
import { appBarVariants, appBarTitleVariants } from "./AppBar.variants";
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
 * - Composable API: pass `<IconButton>` nodes into navigation and action slots
 * - Scroll elevation: flat at rest → elevated on scroll (MD3 motion tokens)
 * - Controlled and uncontrolled scroll state
 * - WCAG 2.1 AA: `role="banner"` landmark, keyboard accessible slots
 * - Dark mode via existing token system
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
 * // Medium with expanded title area
 * <AppBar
 *   variant="medium"
 *   title="Article Title"
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
            "flex items-center",
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

          {/* Title — rendered in top row for small and center-aligned variants */}
          {!isExpandedVariant && (
            <span
              data-testid="appbar-title"
              className={cn(
                "min-w-0 flex-1 px-1",
                appBarTitleVariants({ variant }),
                // Center-aligned: center the title text
                variant === "center-aligned" && "text-center"
              )}
            >
              {title}
            </span>
          )}

          {/* Actions slot (trailing) */}
          {actions != null && (
            <div data-slot="actions" className="flex shrink-0 items-center gap-0.5">
              {actions}
            </div>
          )}
        </div>

        {/* Expanded title row — only for medium and large variants */}
        {isExpandedVariant && (
          <div data-slot="expanded-title" className={cn("flex flex-1 items-end", "px-4 pb-4")}>
            <span
              data-testid="appbar-title"
              className={cn("min-w-0 truncate", appBarTitleVariants({ variant }))}
            >
              {title}
            </span>
          </div>
        )}
      </AppBarHeadless>
    );
  }
);

AppBar.displayName = "AppBar";
