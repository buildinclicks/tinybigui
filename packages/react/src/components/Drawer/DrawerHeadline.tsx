"use client";

import { forwardRef } from "react";
import { drawerHeadlineVariants } from "./Drawer.variants";
import { cn } from "../../utils/cn";
import type { DrawerHeadlineProps } from "./Drawer.types";

/**
 * Material Design 3 Navigation Drawer Headline (Layer 3: Styled).
 *
 * MD3 anatomy element 2 — the header text displayed at the top of the drawer,
 * typically the app name or primary section label.
 *
 * Typography: `text-title-small`
 * Color:      `text-on-surface-variant`
 *
 * @example
 * ```tsx
 * <Drawer aria-label="App navigation">
 *   <DrawerHeadline>Mail</DrawerHeadline>
 *   <DrawerItem label="Inbox" isActive />
 * </Drawer>
 * ```
 *
 * @see https://m3.material.io/components/navigation-drawer/specs#anatomy
 */
export const DrawerHeadline = forwardRef<HTMLSpanElement, DrawerHeadlineProps>(
  ({ children, className, ...restProps }, ref) => (
    <span ref={ref} className={cn(drawerHeadlineVariants(), className)} {...restProps}>
      {children}
    </span>
  )
);

DrawerHeadline.displayName = "DrawerHeadline";
