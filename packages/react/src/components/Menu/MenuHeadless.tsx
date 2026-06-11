"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useRef,
  useLayoutEffect,
  useState,
  isValidElement,
  cloneElement,
  type ReactNode,
  type ReactElement,
  type HTMLAttributes,
  type JSX,
} from "react";
import {
  Menu as RACMenu,
  MenuItem as RACMenuItem,
  MenuSection as RACMenuSection,
  Separator as RACSeparator,
  SubmenuTrigger as RACSubmenuTrigger,
  MenuTrigger as RACMenuTrigger,
  ButtonContext,
  Popover,
  OverlayTriggerStateContext,
  useSlottedContext,
  type SeparatorProps as RACSeparatorProps,
} from "react-aria-components";
import { useButton } from "react-aria";
import { useOverlayTriggerState } from "react-stately";
import { menuPopoverVariants } from "./Menu.variants";
import type {
  HeadlessMenuTriggerProps,
  HeadlessMenuProps,
  HeadlessMenuItemProps,
  HeadlessMenuSectionProps,
  HeadlessSubmenuTriggerProps,
  HeadlessContextMenuTriggerProps,
  MenuContextValue,
} from "./Menu.types";

// ─── MenuContext ──────────────────────────────────────────────────────────────

export const MenuContext = createContext<MenuContextValue | null>(null);

export function useMenuContext(): MenuContextValue | null {
  return useContext(MenuContext);
}

// ─── TriggerBridge ────────────────────────────────────────────────────────────
/**
 * Reads the button slot props from `ButtonContext` (provided by `RACMenuTrigger`)
 * and applies them to any plain HTML element child via `cloneElement`.
 *
 * This bridges the gap between RAC's context-based prop injection (which expects
 * a RAC `Button`) and our Layer 3 API that accepts any trigger element (e.g. a
 * native `<button>` or a custom component).
 *
 * @internal
 */
function TriggerBridge({ children }: { children: ReactNode }): ReactNode {
  // useSlottedContext gives a properly typed value (ButtonContextValue & { ref? })
  // without casting through any.
  const ctx = useSlottedContext(ButtonContext);
  const localRef = useRef<HTMLButtonElement | null>(null);

  const { ref: contextRef, ...ctxProps } = ctx ?? {};

  // Write to both the context ref (used by RACMenuTrigger for popover
  // positioning) and localRef (passed to useButton, which requires a stable
  // RefObject rather than a ForwardedRef).
  const mergedCallbackRef = useCallback(
    (node: HTMLButtonElement | null) => {
      localRef.current = node;
      if (!contextRef) return;
      if (typeof contextRef === "function") {
        contextRef(node);
      } else {
        // After the function check, contextRef is MutableRefObject<HTMLButtonElement | null>
        // (ForwardedRef<T> = callback | MutableRefObject<T | null> | null).
        contextRef.current = node;
      }
    },
    [contextRef]
  );

  // ButtonContext is populated by RACMenuTrigger with aria-haspopup,
  // aria-expanded, aria-controls, onPress, onKeyDown, etc.
  // useButton converts React Aria's onPress + keyboard props into standard
  // HTML events (onClick, onKeyDown, etc.) that work on native elements.
  const { buttonProps } = useButton({ ...ctxProps, elementType: "button" }, localRef);

  if (!isValidElement(children)) return <>{children}</>;

  return cloneElement(
    children as React.ReactElement<HTMLAttributes<HTMLElement>>,
    { ...buttonProps, ref: mergedCallbackRef } as HTMLAttributes<HTMLElement>
  );
}

// ─── HeadlessMenuTrigger ──────────────────────────────────────────────────────

/**
 * Layer 2 headless primitive.
 *
 * Uses `RACMenuTrigger` (Layer 1) as the foundation. `RACMenuTrigger` manages:
 * - `aria-haspopup="menu"` and `aria-expanded` on the trigger (dynamic)
 * - Open/close state and keyboard opening (ArrowDown → focus first item)
 * - `OverlayTriggerStateContext` so the Popover can close on Escape / outside click
 * - `PopoverGroupContext` so the Popover's `ariaHideOutside` does NOT hide the
 *   trigger button while the menu is open
 *
 * `TriggerBridge` adapts the context-injected button props to work with any
 * plain HTML element (native `<button>`, custom components, etc.).
 */
export function HeadlessMenuTrigger({
  children,
  placement = "bottom start",
  shouldFlip = true,
  ...rest
}: HeadlessMenuTriggerProps): JSX.Element {
  const childrenArray = Array.isArray(children) ? children : [children];
  const [triggerChild, menuChild] = childrenArray as [ReactNode, ReactNode];

  return (
    <RACMenuTrigger {...rest}>
      <TriggerBridge>{triggerChild}</TriggerBridge>
      {/*
       * RACMenuTrigger provides PopoverGroupContext which tells ariaHideOutside
       * to exclude the trigger button — so we do NOT need isNonModal here.
       * Without isNonModal the Popover uses the standard modal overlay underlay,
       * which correctly dismisses the menu on any outside pointer interaction.
       */}
      <Popover
        placement={placement}
        shouldFlip={shouldFlip}
        offset={4}
        className={menuPopoverVariants()}
      >
        {menuChild}
      </Popover>
    </RACMenuTrigger>
  );
}

// ─── HeadlessMenu ─────────────────────────────────────────────────────────────

/**
 * Layer 2 headless primitive wrapping RAC `Menu`.
 *
 * When nested inside `HeadlessMenuTrigger`, RAC automatically threads the
 * `MenuContext` (containing `autoFocus`, `onClose`, `aria-labelledby`, etc.)
 * from `RACMenuTrigger` through to `RACMenu`. No manual prop threading needed.
 *
 * **aria-label / aria-labelledby precedence fix**: `RACSubmenuTrigger` sets
 * `aria-labelledby` in `MenuContext` pointing to the trigger item. In ARIA
 * spec, `aria-labelledby` always overrides `aria-label`. So when the consumer
 * provides an explicit `aria-label`, we suppress the context's
 * `aria-labelledby` by passing `aria-labelledby={undefined}`, which takes
 * precedence over the `MenuContext` value in `useContextProps`'s `mergeProps`
 * call (last argument wins). This ensures `aria-label="My Submenu"` is
 * respected as the accessible name.
 */
export function HeadlessMenu<T extends object = object>({
  className,
  children,
  "aria-label": ariaLabel,
  ...props
}: HeadlessMenuProps<T>): JSX.Element {
  const menuRef = useRef<HTMLDivElement | null>(null);

  /**
   * `RACSubmenuTrigger` provides `MenuContext` with `aria-labelledby` pointing
   * to the trigger item's id. In the ARIA spec, `aria-labelledby` always beats
   * `aria-label`, so even if we pass `aria-label` as a prop it would be
   * overridden. `useContextProps` inside `RACMenu` merges context first then
   * explicit props, but passing `aria-labelledby={undefined}` doesn't reliably
   * clear the context-injected attribute in all RAC versions.
   *
   * The only reliable fix: imperatively remove the attribute from the DOM node
   * after every render. `useLayoutEffect` runs synchronously after DOM mutations,
   * so the accessibility tree is already correct when testing-library reads it.
   */
  useLayoutEffect(() => {
    if (ariaLabel && menuRef.current) {
      menuRef.current.removeAttribute("aria-labelledby");
    }
  });

  return (
    <RACMenu<T>
      {...props}
      ref={menuRef}
      {...(ariaLabel !== undefined ? { "aria-label": ariaLabel } : {})}
      className={className ?? ""}
    >
      {children}
    </RACMenu>
  );
}

// Expose HeadlessMenu as a static property so Layer 2 tests can use
// <HeadlessMenuTrigger.Menu> just like <MenuTrigger.Menu> at Layer 3.
HeadlessMenuTrigger.Menu = HeadlessMenu;

// ─── HeadlessMenuItem ─────────────────────────────────────────────────────────

/**
 * Layer 2 headless primitive wrapping RAC `MenuItem`.
 *
 * Accepts `className` as either a static string or a render-prop function
 * `(renderProps: MenuItemRenderProps) => string`, forwarding it directly to
 * `RACMenuItem` so MD3 selection-state styles are applied on the `<li>` element
 * (the element with `role="menuitem"`).
 */
export const HeadlessMenuItem = forwardRef<HTMLDivElement, HeadlessMenuItemProps>(
  function HeadlessMenuItem({ children, className, ...props }, ref) {
    return (
      <RACMenuItem {...props} ref={ref} className={className ?? ""}>
        {children}
      </RACMenuItem>
    );
  }
);

// ─── HeadlessMenuSection ──────────────────────────────────────────────────────

export function HeadlessMenuSection({
  children,
  "aria-label": ariaLabel,
  className,
}: HeadlessMenuSectionProps): JSX.Element {
  return (
    <RACMenuSection
      {...(ariaLabel !== undefined ? { "aria-label": ariaLabel } : {})}
      className={className ?? ""}
    >
      {children}
    </RACMenuSection>
  );
}

// ─── HeadlessMenuDivider ──────────────────────────────────────────────────────

export function HeadlessMenuDivider({
  className,
  ...props
}: RACSeparatorProps & { className?: string }): JSX.Element {
  return <RACSeparator {...props} className={className ?? ""} />;
}

// ─── HeadlessSubmenuTrigger ───────────────────────────────────────────────────

/**
 * Layer 2 headless primitive wrapping RAC `SubmenuTrigger`.
 *
 * RAC `SubmenuTrigger` expects its children to be a `[MenuItem, Popover>Menu]`
 * pair. The first child is the trigger item; the second is a `Popover` wrapping
 * the submenu `Menu`. We wrap the menu child in a `Popover` here so the consumer
 * only needs to provide `[MenuItem, Menu]`.
 */
export function HeadlessSubmenuTrigger({
  children,
  delay,
}: HeadlessSubmenuTriggerProps): JSX.Element {
  const childrenArray = Array.isArray(children) ? children : [children];
  const [triggerItem, menuChild] = childrenArray as [ReactNode, ReactNode];

  // RACSubmenuTrigger requires ReactElement[] children — first child is the
  // trigger MenuItem, second is a Popover wrapping the submenu.
  const racChildren: ReactElement[] = [
    triggerItem as ReactElement,
    <Popover key="submenu-popover" className={menuPopoverVariants()}>
      {menuChild}
    </Popover>,
  ];

  return (
    <RACSubmenuTrigger {...(delay !== undefined ? { delay } : {})}>{racChildren}</RACSubmenuTrigger>
  );
}

// ─── HeadlessContextMenuTrigger ───────────────────────────────────────────────

/**
 * Layer 2 headless primitive for context menus (right-click / two-finger tap).
 * Positions the menu at cursor coordinates via a virtual 0×0 anchor element.
 */
export function HeadlessContextMenuTrigger({
  children,
  isOpen: isOpenProp,
  onOpenChange,
}: HeadlessContextMenuTriggerProps): JSX.Element {
  const virtualTriggerRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const isControlled = isOpenProp !== undefined;

  // Conditionally spread EOPT-sensitive props: isOpen/onOpenChange must not be
  // present with value `undefined` under exactOptionalPropertyTypes.
  const internalState = useOverlayTriggerState({
    ...(isControlled
      ? { isOpen: isOpenProp, ...(onOpenChange !== undefined ? { onOpenChange } : {}) }
      : {}),
  });

  const handleContextMenu = (e: React.MouseEvent): void => {
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
    internalState.open();
    if (!isControlled) onOpenChange?.(true);
  };

  const childrenArray = Array.isArray(children) ? children : [children];
  const [contentChild, menuChild] = childrenArray as [ReactNode, ReactNode];

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions -- display:contents sink; not focusable itself, keyboard dismissal handled by RAC Popover Escape handler */}
      <div onContextMenu={handleContextMenu} style={{ display: "contents" }}>
        {contentChild}
      </div>

      {/* Virtual 0×0 anchor positioned at cursor coordinates */}
      <span
        ref={virtualTriggerRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: position.y,
          left: position.x,
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
      />

      {/*
       * OverlayTriggerStateContext is provided OUTSIDE the Popover so the
       * Popover reads internalState directly (not a derived localState).
       * We intentionally do NOT pass isOpen as a prop — when isOpen is a prop,
       * the Popover creates a separate localState whose close() doesn't update
       * internalState. By relying solely on OverlayTriggerStateContext, the
       * Popover's DismissButton / Escape key handler call internalState.close()
       * directly, which correctly dismisses the context menu.
       */}
      <OverlayTriggerStateContext.Provider value={internalState}>
        <Popover
          triggerRef={virtualTriggerRef}
          placement="bottom start"
          shouldFlip
          offset={0}
          className={menuPopoverVariants()}
        >
          {menuChild}
        </Popover>
      </OverlayTriggerStateContext.Provider>
    </>
  );
}
