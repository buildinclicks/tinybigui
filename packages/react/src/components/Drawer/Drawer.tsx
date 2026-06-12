"use client";

import React, { forwardRef } from "react";
import { HeadlessDrawer } from "./DrawerHeadless";
import { DrawerSection } from "./DrawerSection";
import {
  drawerAnimationVariants,
  drawerScrimAnimationVariants,
  drawerVariants,
  drawerScrimVariants,
} from "./Drawer.variants";
import { cn } from "../../utils/cn";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { DrawerAnimationState, DrawerProps } from "./Drawer.types";

/**
 * Material Design 3 Navigation Drawer (Layer 3: Styled).
 *
 * Supports two structural variants driven by the `variant` prop:
 *
 * - **`standard`** — Inline `<nav>` landmark. Permanently visible or
 *   collapsible via controlled `open` prop. No overlay or focus trap.
 *   Surface: `bg-surface-container-low`, no elevation, square trailing edge.
 *   Slide motion: `transition-transform` + spring-standard-default-spatial
 *   (500ms, no overshoot) driven by translate-x via `drawerVariants`.
 *
 * - **`modal`** — Portal overlay with animation state machine, scrim backdrop,
 *   focus trap, and `Escape` to close.
 *   Surface: `bg-surface-container-low` + `shadow-elevation-1`.
 *   Shape: `rounded-r-lg` (16dp trailing corner per MD3).
 *   Motion: `animate-md-slide-in-left` / `animate-md-slide-out-left` via
 *   `drawerAnimationVariants` + `drawerScrimAnimationVariants`.
 *
 * Both variants:
 * - `role="navigation"` on the outer wrapper
 * - `w-drawer` (360dp)
 *
 * Reduced motion: when `prefers-reduced-motion: reduce` is active, all
 * animation classes are suppressed (`getAnimationClassName` returns `""`
 * and `transition-none` is appended to the standard variant panel).
 *
 * @example
 * ```tsx
 * // Standard variant (collapsible sidebar)
 * <Drawer
 *   variant="standard"
 *   open={sidebarOpen}
 *   onOpenChange={setSidebarOpen}
 *   aria-label="App navigation"
 * >
 *   <DrawerHeadline>Mail</DrawerHeadline>
 *   <DrawerItem icon={<HomeIcon />} label="Home" isActive />
 *   <DrawerSection header="Settings" showDivider>
 *     <DrawerItem icon={<SettingsIcon />} label="Preferences" />
 *   </DrawerSection>
 * </Drawer>
 *
 * // Modal variant
 * <Drawer variant="modal" open={open} onOpenChange={setOpen} aria-label="App navigation">
 *   <DrawerItem icon={<HomeIcon />} label="Home" isActive />
 * </Drawer>
 * ```
 *
 * @see https://m3.material.io/components/navigation-drawer/overview
 */
export const Drawer = forwardRef<HTMLElement, DrawerProps>(
  (
    {
      variant = "standard",
      open,
      defaultOpen = false,
      onOpenChange,
      "aria-label": ariaLabel,
      children,
      className,
      disableRipple = false,
      ...restProps
    },
    ref
  ) => {
    const isOpen = open ?? defaultOpen;
    const reducedMotion = useReducedMotion();

    // ── Panel class ───────────────────────────────────────────────────────────

    const drawerPanelClass = cn(
      drawerVariants({ variant, open: isOpen }),
      // Suppress spring transition when user has requested reduced motion
      reducedMotion && "transition-none",
      className
    );

    // ── Scrim base class (modal only) ─────────────────────────────────────────

    const scrimClass = drawerScrimVariants();

    // ── Animation class callback (modal only) ─────────────────────────────────
    //
    // Reduced motion: return "" so no animation classes are applied.
    // Normal: delegate to the CVA variants for panel and scrim independently.

    const getAnimationClassName = reducedMotion
      ? (_state: DrawerAnimationState): string => ""
      : (state: DrawerAnimationState): string => drawerAnimationVariants({ animationState: state });

    const getScrimAnimationClassName = reducedMotion
      ? (_state: DrawerAnimationState): string => ""
      : (state: DrawerAnimationState): string =>
          drawerScrimAnimationVariants({ animationState: state });

    // ── Children pre-processing ───────────────────────────────────────────────
    //
    // Mark the first DrawerSection to suppress its top divider so the drawer
    // does not open with a stray rule between the headline and the first group.

    let foundFirstSection = false;
    const processedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === DrawerSection) {
        if (!foundFirstSection) {
          foundFirstSection = true;
          return React.cloneElement(child as React.ReactElement<Record<string, unknown>>, {
            _isFirstSection: true,
          });
        }
      }
      return child;
    });

    return (
      <HeadlessDrawer
        ref={ref}
        variant={variant}
        {...(open !== undefined ? { open } : {})}
        {...(defaultOpen !== undefined ? { defaultOpen } : {})}
        {...(onOpenChange !== undefined ? { onOpenChange } : {})}
        aria-label={ariaLabel}
        className={drawerPanelClass}
        scrimClassName={scrimClass}
        getAnimationClassName={getAnimationClassName}
        getScrimAnimationClassName={getScrimAnimationClassName}
        disableRipple={disableRipple}
        {...restProps}
      >
        {processedChildren}
      </HeadlessDrawer>
    );
  }
);

Drawer.displayName = "Drawer";
