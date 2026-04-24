"use client";

import { forwardRef } from "react";
import {
  drawerSectionVariants,
  drawerSectionHeaderVariants,
  drawerDividerVariants,
} from "./Drawer.variants";
import { cn } from "../../utils/cn";
import type { DrawerSectionProps } from "./Drawer.types";

/**
 * Material Design 3 Navigation Drawer Section (Layer 3: Styled).
 *
 * Groups related `DrawerItem` elements with an optional header label and
 * a horizontal divider. Follows MD3 Navigation Drawer spec for section
 * grouping and typography.
 *
 * Features:
 * - Optional header label: `text-title-small text-on-surface-variant`
 * - Optional top divider: `border-outline-variant`
 * - Semantic `<hr role="separator">` for the divider
 *
 * @example
 * ```tsx
 * // Section with header and divider
 * <DrawerSection header="Account" showDivider>
 *   <DrawerItem icon={<ProfileIcon />} label="Profile" />
 *   <DrawerItem icon={<LogoutIcon />} label="Logout" />
 * </DrawerSection>
 *
 * // Section without header (just a visual group)
 * <DrawerSection showDivider>
 *   <DrawerItem label="Help" />
 * </DrawerSection>
 * ```
 *
 * @see https://m3.material.io/components/navigation-drawer/specs
 */
export const DrawerSection = forwardRef<HTMLDivElement, DrawerSectionProps>(
  ({ header, children, showDivider = false, className }, ref) => {
    return (
      <div ref={ref} className={cn(drawerSectionVariants(), className)}>
        {/* Divider above the section */}
        {showDivider && (
          <hr role="separator" aria-hidden="true" className={drawerDividerVariants()} />
        )}

        {/* Section header label */}
        {header && <span className={drawerSectionHeaderVariants()}>{header}</span>}

        {/* Section items */}
        {children}
      </div>
    );
  }
);

DrawerSection.displayName = "DrawerSection";
