"use client";

import React, { forwardRef } from "react";
import { HeadlessDrawer, DrawerIconOnlyContext } from "./DrawerHeadless";
import { DrawerSection } from "./DrawerSection";
import { drawerVariants, scrimVariants } from "./Drawer.variants";
import { cn } from "../../utils/cn";
import type { DrawerProps } from "./Drawer.types";

/**
 * Material Design 3 Navigation Drawer (Layer 3: Styled).
 *
 * Supports two structural variants driven by the `variant` prop:
 *
 * - **`standard`** — Inline `<nav>` landmark. Permanently visible or
 *   collapsible via controlled `open` prop. No overlay or focus trap.
 *   Surface: `bg-surface-container-low`.
 *
 * - **`modal`** — Overlay dialog with scrim backdrop, slide-in animation,
 *   focus trap, and `Escape` to close.
 *   Surface: `bg-surface-container`, `shadow-elevation-1`.
 *
 * Both variants:
 * - `role="navigation"` on the outer wrapper
 * - `rounded-r-xl` (28px per MD3 shape extra-large on right side only)
 * - Slide-in animation: `translate-x` driven by MD3 motion tokens
 * - `w-drawer` (360dp) or `w-20` (80dp) in `iconOnly` mode
 *
 * Modal-only:
 * - `role="dialog"` + `aria-modal="true"` on the panel
 * - `FocusScope` containing focus + restoring on close
 * - `usePreventScroll` to lock body scroll
 * - Scrim: `bg-scrim opacity-32` — click closes drawer
 * - `Escape` key closes drawer
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
 *   <DrawerItem icon={<HomeIcon />} label="Home" isActive />
 *   <DrawerSection header="Settings" showDivider>
 *     <DrawerItem icon={<SettingsIcon />} label="Preferences" />
 *   </DrawerSection>
 * </Drawer>
 *
 * // Icon-only mode (prep for NavigationRail)
 * <Drawer variant="standard" open iconOnly aria-label="App navigation">
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
      iconOnly = false,
      ...restProps
    },
    ref
  ) => {
    const isOpen = open ?? defaultOpen;

    const drawerPanelClass = cn(
      drawerVariants({
        variant,
        open: isOpen,
        iconOnly,
      }),
      className
    );

    const scrimClass = scrimVariants();

    // Mark the first DrawerSection to suppress its divider
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
      <DrawerIconOnlyContext.Provider value={iconOnly}>
        <HeadlessDrawer
          ref={ref}
          variant={variant}
          {...(open !== undefined ? { open } : {})}
          {...(defaultOpen !== undefined ? { defaultOpen } : {})}
          {...(onOpenChange !== undefined ? { onOpenChange } : {})}
          aria-label={ariaLabel}
          className={drawerPanelClass}
          scrimClassName={scrimClass}
          disableRipple={disableRipple}
          iconOnly={iconOnly}
          {...restProps}
        >
          {processedChildren}
        </HeadlessDrawer>
      </DrawerIconOnlyContext.Provider>
    );
  }
);

Drawer.displayName = "Drawer";
