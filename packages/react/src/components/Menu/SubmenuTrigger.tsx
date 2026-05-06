"use client";

import { Children, isValidElement, cloneElement, type JSX, type ReactNode } from "react";
import { HeadlessSubmenuTrigger } from "./MenuHeadless";
import { ChevronRightIcon } from "./MenuItem";
import type { SubmenuTriggerProps, MenuItemProps } from "./Menu.types";

/**
 * MD3 styled SubmenuTrigger component (Layer 3).
 *
 * Wraps a `MenuItem` (trigger) and a nested `Menu` to form a parent→child
 * submenu relationship. Automatically:
 * - Appends a `ChevronRight` trailing icon to the trigger `MenuItem`
 * - Wires `ArrowRight` / `ArrowLeft` keyboard navigation via RAC
 * - Passes `aria-haspopup="menu"` and `aria-expanded` to the trigger item
 *
 * @example
 * ```tsx
 * <SubmenuTrigger>
 *   <MenuItem id="share">Share</MenuItem>
 *   <MenuTrigger.Menu aria-label="Share via">
 *     <MenuItem id="email">Email</MenuItem>
 *     <MenuItem id="sms">SMS</MenuItem>
 *   </MenuTrigger.Menu>
 * </SubmenuTrigger>
 * ```
 */
export function SubmenuTrigger({ children, delay }: SubmenuTriggerProps): JSX.Element {
  const childArray = Children.toArray(children);
  const [triggerItem, submenuContent] = childArray as [ReactNode, ReactNode];

  // Inject ChevronRight trailing icon into the trigger MenuItem.
  // Omit trailingText by destructuring it out so we never pass undefined
  // explicitly, satisfying exactOptionalPropertyTypes.
  const enhancedTrigger = isValidElement<MenuItemProps>(triggerItem)
    ? (() => {
        const { trailingText: _omitted, ...rest } = triggerItem.props;
        return cloneElement(triggerItem, {
          ...rest,
          trailingIcon: <ChevronRightIcon />,
        } as Partial<MenuItemProps>);
      })()
    : triggerItem;

  return (
    // EOPT: only include delay when it has a definite value.
    <HeadlessSubmenuTrigger {...(delay !== undefined ? { delay } : {})}>
      {enhancedTrigger}
      {submenuContent}
    </HeadlessSubmenuTrigger>
  );
}
