"use client";

import { type JSX } from "react";
import { Header as RACHeader } from "react-aria-components";
import { HeadlessMenuSection, HeadlessMenuDivider, useMenuContext } from "./MenuHeadless";
import {
  menuSectionVariants,
  menuSectionHeaderVariants,
  menuDividerVariants,
} from "./Menu.variants";
import { cn } from "../../utils/cn";
import type { MenuSectionProps } from "./Menu.types";

/**
 * MD3 styled MenuSection component (Layer 3).
 *
 * Groups related `MenuItem` elements with an optional section header and an
 * optional top divider.
 *
 * The section header color adapts to the `colorScheme` from `MenuContext`:
 *   standard → text-on-surface-variant
 *   vibrant  → text-on-tertiary-container
 *
 * **Implementation note**: The divider is rendered as a SIBLING BEFORE the
 * `RACMenuSection`, NOT inside it. RAC's `Section`/`MenuSection` only accepts
 * `Header` and `MenuItem` children — placing a `Separator` inside the section
 * would create invalid HTML (`<li>` inside `<li role="group">`) and break RAC's
 * collection rendering.
 *
 * @example
 * ```tsx
 * <MenuSection header="Clipboard" showDivider aria-label="Clipboard">
 *   <MenuItem id="cut">Cut</MenuItem>
 *   <MenuItem id="copy">Copy</MenuItem>
 * </MenuSection>
 * ```
 */
export function MenuSection({
  children,
  header,
  showDivider = false,
  className,
  "aria-label": ariaLabel,
}: MenuSectionProps): JSX.Element {
  const ctx = useMenuContext();
  const colorScheme = ctx?.colorScheme ?? "standard";

  // The union type guarantees at least one of these is a string.
  const sectionAriaLabel = (ariaLabel ?? header)!;

  return (
    <>
      {/* Divider is a sibling of the section, placed before it in the menu list */}
      {showDivider && <HeadlessMenuDivider className={menuDividerVariants()} />}
      <HeadlessMenuSection
        aria-label={sectionAriaLabel}
        className={cn(menuSectionVariants(), className)}
      >
        {/* RAC Header component renders a semantic section header inside the group */}
        {header && (
          <RACHeader className={menuSectionHeaderVariants({ colorScheme })} aria-hidden="true">
            {header}
          </RACHeader>
        )}
        {children}
      </HeadlessMenuSection>
    </>
  );
}
