"use client";

import { forwardRef } from "react";
import { AppBarHeadless } from "./AppBarHeadless";
import {
  appBarVariants,
  appBarTopRowVariants,
  appBarLeadingVariants,
  appBarHeadlineBlockVariants,
  appBarTitleVariants,
  appBarSubtitleVariants,
  appBarTrailingVariants,
  appBarExpandedTitleVariants,
} from "./AppBar.variants";
import { cn } from "../../utils/cn";
import { useScrollElevation } from "../../hooks/useScrollElevation";
import type { AppBarProps } from "./AppBar.types";

/**
 * Material Design 3 Top App Bar Component (M3 Expressive Flexible)
 *
 * Provides context and actions for the current screen. Supports four size variants,
 * a navigation icon slot, title, optional subtitle, and trailing action icon slots.
 * Implements scroll-triggered elevation changes per MD3 specification.
 *
 * **Architecture:**
 * - Layer 3 (this file): MD3 styled, CVA slot variants, layout composition
 * - Layer 2: `AppBarHeadless` — `<header role="banner">`, scroll state
 * - Layer 1: React Aria via `<IconButton>` in consumer slots
 *
 * **Slot-based styling:**
 * All layout and state styling follows the Variants vs States pattern:
 * - `variant` prop drives design-time choices (height, type scale, alignment)
 * - Scroll elevation state is emitted as `data-scrolled=""` on the root and
 *   consumed by `group-data-[scrolled]/appbar:*` selectors (presence-based)
 * - Subtitle presence is emitted as `data-with-subtitle=""` on the root and
 *   used to grow medium/large bar heights (group-data-[with-subtitle]/appbar:*)
 *
 * **Key Features:**
 * - 4 MD3 variants: small, center-aligned, medium, large
 * - M3 Expressive flexible: medium and large grow vertically with a subtitle
 *   (136dp / 152dp respectively), per the M3 Expressive flexible spec
 * - Composable API: pass `<IconButton>` nodes into navigation and action slots
 * - Scroll elevation: bg-surface at rest → bg-surface-container + shadow-elevation-2
 * - Controlled and uncontrolled scroll state
 * - MD3 motion: background-color + box-shadow use standard effects spring pair
 * - WCAG 2.1 AA: `role="banner"` landmark, keyboard accessible slots
 * - Dark mode via existing token system
 *
 * **M3 Expressive Flexible subtitle type scales:**
 * - small / center-aligned: label-medium, on-surface-variant
 * - medium expanded: label-large, on-surface-variant
 * - large expanded: title-medium, on-surface-variant
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
 * // Medium with expanded title and subtitle (grows to 136dp with subtitle)
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
    const hasSubtitle = subtitle != null;

    return (
      <AppBarHeadless
        ref={ref}
        scrolled={isScrolled}
        className={cn(
          appBarVariants({ variant }),
          // group/appbar: enables group-data-[scrolled]/appbar and
          // group-data-[with-subtitle]/appbar child selectors in all slots
          "group/appbar",
          className
        )}
        // Content flag — subtitle presence drives height growth on medium/large
        data-with-subtitle={hasSubtitle ? "" : undefined}
      >
        {/* Top row: navigation icon + title (small/center-aligned) + actions */}
        <div data-slot="top-row" className={cn(appBarTopRowVariants({ variant }))}>
          {/* Leading: navigation icon slot */}
          {navigationIcon != null && (
            <div data-slot="navigation" className={cn(appBarLeadingVariants())}>
              {navigationIcon}
            </div>
          )}

          {/* Collapsed headline block — title + subtitle in top row (small / center-aligned only) */}
          {!isExpandedVariant && (
            <div className={cn(appBarHeadlineBlockVariants({ variant }))}>
              <span data-testid="appbar-title" className={cn(appBarTitleVariants({ variant }))}>
                {title}
              </span>
              {hasSubtitle && (
                <span
                  data-testid="appbar-subtitle"
                  className={cn(appBarSubtitleVariants({ variant }))}
                >
                  {subtitle}
                </span>
              )}
            </div>
          )}

          {/* Trailing: action icon slots */}
          {actions != null && (
            <div data-slot="actions" className={cn(appBarTrailingVariants())}>
              {actions}
            </div>
          )}
        </div>

        {/* Expanded headline block — title + subtitle below the top row (medium / large only) */}
        {isExpandedVariant && (
          <div data-slot="expanded-title" className={cn(appBarExpandedTitleVariants())}>
            <span
              data-testid="appbar-title"
              className={cn("min-w-0", appBarTitleVariants({ variant }))}
            >
              {title}
            </span>
            {hasSubtitle && (
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
