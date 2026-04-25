"use client";

/**
 * MenuHeadless — Layer 2: Behavior-only primitives.
 *
 * The trigger layer uses react-aria hooks (`useMenuTriggerState` +
 * `useMenuTrigger`) to spread ARIA attributes and event handlers onto any
 * trigger element via `cloneElement`. This supports raw `<button>` elements
 * as well as RAC `Button` components.
 *
 * The overlay uses RAC `Popover` with `OverlayTriggerStateContext` to handle
 * portal rendering, positioning, flip/shift, focus management (FocusScope +
 * restoreFocus + autoFocus), and Escape / outside-click dismissal.
 *
 * The menu list uses RAC `Menu`, `MenuItem`, `MenuSection`, `Separator` for
 * full collection management, keyboard navigation, and ARIA semantics.
 */

import {
  cloneElement,
  createContext,
  forwardRef,
  useContext,
  useRef,
  type JSX,
  type ReactElement,
  type ReactNode,
} from "react";
import {
  Menu as RACMenu,
  MenuItem as RACMenuItem,
  MenuSection as RACMenuSection,
  MenuContext as RACMenuContext,
  OverlayTriggerStateContext,
  Popover,
  Separator,
  type MenuProps as RACMenuProps,
  type MenuItemProps as RACMenuItemProps,
} from "react-aria-components";
import { mergeProps, useMenuTrigger } from "react-aria";
import { useMenuTriggerState } from "react-stately";
import type {
  HeadlessMenuProps,
  HeadlessMenuItemProps,
  HeadlessMenuSectionProps,
  HeadlessMenuTriggerProps,
  MenuContextValue,
} from "./Menu.types";

// ─── Our Menu Context (close / disableRipple / variant) ──────────────────────

/**
 * Context shared between the Menu and its item descendants.
 * Carries close(), disableRipple, and variant so items can
 * read them without prop-drilling.
 * @internal
 */
export const MenuContext = createContext<MenuContextValue | null>(null);

export function useMenuContext(): MenuContextValue {
  const ctx = useContext(MenuContext);
  if (ctx === null) {
    throw new Error("MenuItem must be rendered inside a MenuTrigger component.");
  }
  return ctx;
}

// ─── HeadlessMenuTrigger ──────────────────────────────────────────────────────

/**
 * Headless Menu Trigger (Layer 2).
 *
 * - Manages open/close state via `useMenuTriggerState`.
 * - Spreads `aria-haspopup`, `aria-expanded`, `aria-controls`, and pointer /
 *   keyboard event handlers onto the first child (trigger element) via
 *   `cloneElement`. Works with both RAC `Button` and native `<button>`.
 * - Renders the menu overlay via RAC `Popover` (with portal, positioning, flip,
 *   focus management, and Escape/outside-click dismissal).
 * - Provides `OverlayTriggerStateContext` so `Popover` knows the open state.
 * - Provides `RACMenuContext` so RAC `Menu` receives its `id` /
 *   `aria-labelledby` linkage.
 *
 * Children layout: `[trigger, menu]`
 *
 * @example
 * ```tsx
 * <HeadlessMenuTrigger>
 *   <button type="button">Open</button>
 *   <HeadlessMenu aria-label="Actions">
 *     <HeadlessMenuItem id="cut">Cut</HeadlessMenuItem>
 *   </HeadlessMenu>
 * </HeadlessMenuTrigger>
 * ```
 */
export function HeadlessMenuTrigger({
  children,
  placement = "bottom start",
  ...stateProps
}: HeadlessMenuTriggerProps): JSX.Element {
  const triggerRef = useRef<HTMLElement>(null);
  const state = useMenuTriggerState(stateProps);
  const { menuTriggerProps, menuProps } = useMenuTrigger({ type: "menu" }, state, triggerRef);

  const childrenArray = Array.isArray(children)
    ? (children as ReactElement[])
    : [children as ReactElement];
  const triggerChild = childrenArray[0]!;
  const menuChild = childrenArray[1]!;

  // Clone the trigger element and spread ARIA + event handler props onto it.
  // mergeProps handles merging multiple event listeners (e.g. existing onClick).
  // An explicit onClick calling state.toggle() ensures native button clicks
  // work reliably in all environments (JSDOM, browser, SSR hydration).
  const clonedTrigger = cloneElement(triggerChild, {
    ...(mergeProps(triggerChild.props as Record<string, unknown>, menuTriggerProps, {
      onClick: () => {
        state.toggle();
      },
    }) as Record<string, unknown>),
    ref: triggerRef,
  });

  return (
    // Provide OverlayTriggerStateContext so RAC Popover knows about open state
    <OverlayTriggerStateContext.Provider value={state}>
      {clonedTrigger}
      {/* Provide RACMenuContext so RAC Menu gets the aria-labelledby linkage */}
      <RACMenuContext.Provider value={menuProps as Record<string, unknown>}>
        <Popover triggerRef={triggerRef} placement={placement} offset={4} isNonModal>
          {menuChild}
        </Popover>
      </RACMenuContext.Provider>
    </OverlayTriggerStateContext.Provider>
  );
}

HeadlessMenuTrigger.displayName = "HeadlessMenuTrigger";

// Attach as static sub-component for convenience
(HeadlessMenuTrigger as unknown as Record<string, unknown>).Menu = null; // set below

// ─── HeadlessMenu ─────────────────────────────────────────────────────────────

/**
 * Headless Menu list (Layer 2).
 *
 * Wraps RAC `Menu` which renders `<ul role="menu">` with full keyboard
 * navigation, type-ahead, and collection management.
 *
 * @example
 * ```tsx
 * <HeadlessMenu aria-label="Actions" className={menuContainerVariants()}>
 *   <HeadlessMenuItem id="cut">Cut</HeadlessMenuItem>
 *   <HeadlessMenuItem id="copy">Copy</HeadlessMenuItem>
 * </HeadlessMenu>
 * ```
 */
export const HeadlessMenu = forwardRef<HTMLElement, HeadlessMenuProps>(
  function HeadlessMenuComponent({ className, children, ...props }, _ref) {
    return (
      <RACMenu
        {...(props as RACMenuProps<object>)}
        {...(className !== undefined ? { className } : {})}
      >
        {children}
      </RACMenu>
    );
  }
);

HeadlessMenu.displayName = "HeadlessMenu";

// Attach static sub-component
(HeadlessMenuTrigger as unknown as Record<string, unknown>).Menu = HeadlessMenu;

// ─── HeadlessMenuItem ─────────────────────────────────────────────────────────

/**
 * Headless Menu Item (Layer 2).
 *
 * Wraps RAC `MenuItem` which renders `<li role="menuitem">` (or
 * `role="menuitemradio"` / `role="menuitemcheckbox"` for selection menus).
 * RAC manages aria-disabled, aria-checked, and keyboard activation.
 *
 * @example
 * ```tsx
 * <HeadlessMenuItem id="cut" className={menuItemVariants()}>
 *   Cut
 * </HeadlessMenuItem>
 * ```
 */
export const HeadlessMenuItem = forwardRef<
  HTMLElement,
  HeadlessMenuItemProps & { onMouseDown?: React.MouseEventHandler<HTMLElement> }
>(function HeadlessMenuItemComponent({ className, children, onMouseDown, ...props }, _ref) {
  return (
    <RACMenuItem
      {...(props as unknown as RACMenuItemProps)}
      {...(className !== undefined ? { className } : {})}
      {...(onMouseDown !== undefined ? { onMouseDown } : {})}
    >
      {children}
    </RACMenuItem>
  );
});

HeadlessMenuItem.displayName = "HeadlessMenuItem";

// ─── HeadlessMenuSection ──────────────────────────────────────────────────────

/**
 * Headless Menu Section (Layer 2).
 *
 * Wraps RAC `MenuSection` which renders `role="group"` with an optional
 * accessible header. RAC handles `aria-labelledby` automatically.
 *
 * @example
 * ```tsx
 * <HeadlessMenuSection className={menuSectionVariants()} aria-label="Clipboard">
 *   <HeadlessMenuItem id="cut">Cut</HeadlessMenuItem>
 * </HeadlessMenuSection>
 * ```
 */
export const HeadlessMenuSection = forwardRef<
  HTMLElement,
  HeadlessMenuSectionProps & { className?: string; children: ReactNode }
>(function HeadlessMenuSectionComponent(
  { children, className, "aria-label": ariaLabel, ...props },
  _ref
) {
  return (
    <RACMenuSection
      {...props}
      {...(className !== undefined ? { className } : {})}
      {...(ariaLabel !== undefined ? { "aria-label": ariaLabel } : {})}
    >
      {children}
    </RACMenuSection>
  );
});

HeadlessMenuSection.displayName = "HeadlessMenuSection";

// ─── HeadlessMenuDivider ──────────────────────────────────────────────────────

/**
 * Headless Menu Divider (Layer 2).
 *
 * Wraps RAC `Separator` which renders `role="separator"`.
 *
 * @example
 * ```tsx
 * <HeadlessMenuDivider className={menuDividerVariants()} />
 * ```
 */
export function HeadlessMenuDivider({ className }: { className?: string }): JSX.Element {
  return <Separator {...(className !== undefined ? { className } : {})} />;
}

HeadlessMenuDivider.displayName = "HeadlessMenuDivider";
