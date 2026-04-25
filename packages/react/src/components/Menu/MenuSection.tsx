"use client";

import { forwardRef } from "react";
import { Header, Separator } from "react-aria-components";
import { HeadlessMenuSection } from "./MenuHeadless";
import {
  menuSectionVariants,
  menuSectionHeaderVariants,
  menuDividerVariants,
} from "./Menu.variants";
import { cn } from "../../utils/cn";
import type { MenuSectionProps } from "./Menu.types";

/**
 * Material Design 3 Menu Section (Layer 3: Styled).
 *
 * Groups related `MenuItem` elements with an optional section header label
 * and a horizontal divider. Follows MD3 Menu spec for section grouping and
 * typography.
 *
 * The divider (`showDivider`) is rendered as a RAC `Separator` INSIDE the
 * section (as the first collection item). This ensures RAC's collection API
 * processes it correctly without breaking sibling sections.
 *
 * Features:
 * - Optional header label: `text-title-small text-on-surface-variant`
 * - Optional top divider: `role="separator"` rendered via RAC `Separator`
 *
 * @example
 * ```tsx
 * // Section with header and divider
 * <MenuSection header="Clipboard" showDivider>
 *   <MenuItem id="cut">Cut</MenuItem>
 *   <MenuItem id="copy">Copy</MenuItem>
 * </MenuSection>
 *
 * // Section without header (requires aria-label for accessibility)
 * <MenuSection aria-label="Formatting" showDivider>
 *   <MenuItem id="bold">Bold</MenuItem>
 * </MenuSection>
 * ```
 *
 * @see https://m3.material.io/components/menus/specs
 */
export const MenuSection = forwardRef<HTMLElement, MenuSectionProps>(
  ({ header, children, showDivider = false, className, "aria-label": ariaLabel }, _ref) => {
    return (
      <HeadlessMenuSection
        className={cn(menuSectionVariants(), className)}
        {...(ariaLabel !== undefined ? { "aria-label": ariaLabel } : {})}
      >
        {/* Render divider as a RAC Separator INSIDE the section so it is a
            proper collection item and does not break sibling section rendering */}
        {showDivider && <Separator className={menuDividerVariants()} />}
        {header && <Header className={menuSectionHeaderVariants()}>{header}</Header>}
        {children}
      </HeadlessMenuSection>
    );
  }
);

MenuSection.displayName = "MenuSection";
