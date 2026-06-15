"use client";

import { forwardRef } from "react";
import { Divider } from "../Divider";
import { drawerSectionVariants, drawerSectionHeaderVariants } from "./Drawer.variants";
import { cn } from "../../utils/cn";
import type { DrawerSectionProps } from "./Drawer.types";

/**
 * Internal props extending the public DrawerSectionProps.
 * `_isFirstSection` is injected by the parent `Drawer` to suppress
 * the top divider on the first section.
 * @internal
 */
interface DrawerSectionInternalProps extends DrawerSectionProps {
  /** @internal Injected by Drawer — suppresses the divider on the first section. */
  _isFirstSection?: boolean;
}

/**
 * Material Design 3 Navigation Drawer Section (Layer 3: Styled).
 *
 * Groups related `DrawerItem` elements with an optional header label and
 * a horizontal divider. Follows MD3 Navigation Drawer spec for section
 * grouping and typography.
 *
 * Features:
 * - Optional header label: `text-title-small text-on-surface-variant`
 * - Optional top divider via `Divider` component
 * - Divider auto-hidden on the first section inside a `Drawer`
 *
 * @example
 * ```tsx
 * // Section with header and divider
 * <DrawerSection header="Labels" showDivider>
 *   <DrawerItem icon={<LabelIcon />} label="Promotions" />
 *   <DrawerItem icon={<LabelIcon />} label="Social" />
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
export const DrawerSection = forwardRef<HTMLDivElement, DrawerSectionInternalProps>(
  ({ header, children, showDivider = true, _isFirstSection = false, className }, ref) => {
    const shouldShowDivider = showDivider && !_isFirstSection;

    return (
      <div ref={ref} className={cn(drawerSectionVariants(), className)} data-drawer-section>
        {shouldShowDivider && <Divider orientation="horizontal" className="my-1" />}

        {/* Section header label */}
        {header && <span className={drawerSectionHeaderVariants()}>{header}</span>}

        {/* Section items */}
        {children}
      </div>
    );
  }
);

DrawerSection.displayName = "DrawerSection";
