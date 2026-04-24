"use client";

import { createContext, forwardRef, useContext, useRef, useCallback } from "react";
import type React from "react";
import {
  useDialog,
  useOverlay,
  usePreventScroll,
  useFocusRing,
  useButton,
  useLink,
  FocusScope,
} from "react-aria";
import { useOverlayTriggerState } from "react-stately";
import { mergeProps } from "@react-aria/utils";
import type {
  HeadlessDrawerProps,
  HeadlessDrawerItemProps,
  DrawerContextValue,
} from "./Drawer.types";

// ─── Context ──────────────────────────────────────────────────────────────────

/**
 * Context shared between HeadlessDrawer and its children.
 * @internal
 */
export const DrawerContext = createContext<DrawerContextValue | null>(null);

/**
 * Hook to access DrawerContext inside drawer children.
 * @internal
 */
function useDrawerContext(): DrawerContextValue {
  const ctx = useContext(DrawerContext);
  if (ctx === null) {
    throw new Error("DrawerItem must be rendered inside a Drawer component.");
  }
  return ctx;
}

// ─── HeadlessDrawer ───────────────────────────────────────────────────────────

/**
 * Headless Navigation Drawer (Layer 2).
 *
 * Provides all behavior and ARIA semantics without any visual styling.
 * Renders two distinct DOM structures based on the `variant` prop:
 *
 * - **`standard`**: `<nav role="navigation">` — no overlay, no focus trap
 * - **`modal`**: `<nav role="navigation">` containing a `FocusScope`-wrapped
 *   `<div role="dialog" aria-modal="true">` with scrim overlay
 *
 * React Aria hooks used:
 * - `useDialog` — `role="dialog"`, `aria-modal`, `aria-label` on modal panel
 * - `useOverlay` — dismiss on Escape key and outside click (modal)
 * - `usePreventScroll` — locks body scroll when modal is open
 * - `FocusScope` — focus trap + restoreFocus when modal closes
 * - `useOverlayTriggerState` — open/close state management
 *
 * @example
 * ```tsx
 * <HeadlessDrawer variant="modal" open aria-label="Navigation">
 *   <HeadlessDrawerItem onPress={() => {}}>Home</HeadlessDrawerItem>
 * </HeadlessDrawer>
 * ```
 */
export const HeadlessDrawer = forwardRef<HTMLElement, HeadlessDrawerProps>(
  (
    {
      variant = "standard",
      open,
      defaultOpen = false,
      onOpenChange,
      "aria-label": ariaLabel,
      children,
      className,
      scrimClassName,
      disableRipple = false,
    },
    ref
  ) => {
    // Manage open/close state with react-stately
    // Use conditional spreading to satisfy exactOptionalPropertyTypes
    const state = useOverlayTriggerState({
      ...(open !== undefined ? { isOpen: open } : {}),
      ...(defaultOpen !== undefined ? { defaultOpen } : {}),
      ...(onOpenChange !== undefined ? { onOpenChange } : {}),
    });

    const isOpen = state.isOpen;

    const close = useCallback(() => {
      state.close();
    }, [state]);

    const contextValue: DrawerContextValue = {
      isOpen,
      close,
      disableRipple,
    };

    if (variant === "modal") {
      return (
        <DrawerContext.Provider value={contextValue}>
          <nav ref={ref as React.RefObject<HTMLElement>} role="navigation" aria-label={ariaLabel}>
            {isOpen && (
              <>
                {/* Scrim overlay — clicking it closes the drawer */}
                <div
                  data-testid="drawer-scrim"
                  className={scrimClassName}
                  onClick={() => state.close()}
                  aria-hidden="true"
                />
                {/* FocusScope: traps focus and restores it to trigger on close */}
                <FocusScope contain restoreFocus autoFocus>
                  <ModalDrawerPanel
                    ariaLabel={ariaLabel}
                    onClose={() => state.close()}
                    className={className}
                  >
                    {children}
                  </ModalDrawerPanel>
                </FocusScope>
              </>
            )}
          </nav>
        </DrawerContext.Provider>
      );
    }

    // Standard variant — inline nav, no overlay
    return (
      <DrawerContext.Provider value={contextValue}>
        <nav
          ref={ref as React.RefObject<HTMLElement>}
          role="navigation"
          aria-label={ariaLabel}
          className={className}
        >
          {children}
        </nav>
      </DrawerContext.Provider>
    );
  }
);

HeadlessDrawer.displayName = "HeadlessDrawer";

// ─── ModalDrawerPanel ─────────────────────────────────────────────────────────

/**
 * Inner dialog panel for the modal drawer variant.
 * Applies `useDialog`, `useOverlay`, and `usePreventScroll`.
 * @internal
 */
interface ModalDrawerPanelProps {
  ariaLabel: string;
  onClose: () => void;
  className: string | undefined;
  children: React.ReactNode;
}

const ModalDrawerPanel = ({
  ariaLabel,
  onClose,
  className,
  children,
}: ModalDrawerPanelProps): React.ReactElement => {
  const panelRef = useRef<HTMLDivElement>(null);

  // usePreventScroll locks the body scroll while the modal is open
  usePreventScroll();

  // useDialog provides role="dialog", aria-modal="true", and aria-label
  const { dialogProps } = useDialog({ "aria-label": ariaLabel }, panelRef);

  // useOverlay handles Escape key and outside-click dismissal
  const { overlayProps } = useOverlay(
    {
      isOpen: true,
      onClose,
      isDismissable: true,
      shouldCloseOnBlur: false,
    },
    panelRef
  );

  return (
    <div
      {...mergeProps(overlayProps, dialogProps)}
      ref={panelRef}
      className={className}
      aria-modal="true"
    >
      {children}
    </div>
  );
};

ModalDrawerPanel.displayName = "ModalDrawerPanel";

// ─── HeadlessDrawerItem ────────────────────────────────────────────────────────

/**
 * Headless Navigation Drawer Item (Layer 2).
 *
 * Renders as:
 * - `<a>` using `useLink` when `href` is provided
 * - `<button>` using `useButton` when no `href`
 *
 * Applies `aria-current="page"` when `isActive` is true.
 * Uses `useFocusRing` for visible keyboard focus.
 *
 * @example
 * ```tsx
 * // Button-based item
 * <HeadlessDrawerItem onPress={() => navigate('home')} isActive>
 *   Home
 * </HeadlessDrawerItem>
 *
 * // Link-based item
 * <HeadlessDrawerItem href="/settings">
 *   Settings
 * </HeadlessDrawerItem>
 * ```
 */
export const HeadlessDrawerItem = forwardRef<HTMLElement, HeadlessDrawerItemProps>(
  (
    {
      href,
      isActive = false,
      children,
      className,
      isDisabled,
      onMouseDown,
      onPress,
      onPressStart,
      onPressEnd,
      onPressChange,
      onPressUp,
      ...restProps
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLElement>(null);
    const { isFocusVisible, focusProps } = useFocusRing();

    if (href) {
      // ── Link variant ──────────────────────────────────────────────────────
      const linkRef = (forwardedRef ?? internalRef) as React.RefObject<HTMLAnchorElement>;

      // eslint-disable-next-line react-hooks/rules-of-hooks
      const { linkProps } = useLink(
        {
          href,
          ...(isDisabled !== undefined ? { isDisabled } : {}),
          ...(onPress !== undefined ? { onPress } : {}),
        },
        linkRef
      );

      return (
        <a
          {...mergeProps(linkProps, focusProps, { onMouseDown })}
          ref={linkRef}
          href={href}
          className={className}
          aria-current={isActive ? "page" : undefined}
          data-focus-visible={isFocusVisible || undefined}
          data-active={isActive || undefined}
        >
          {children}
        </a>
      );
    }

    // ── Button variant ────────────────────────────────────────────────────────
    const buttonRef = (forwardedRef ?? internalRef) as React.RefObject<HTMLButtonElement>;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { buttonProps } = useButton(
      {
        ...restProps,
        ...(isDisabled !== undefined ? { isDisabled } : {}),
        ...(onPress !== undefined ? { onPress } : {}),
        ...(onPressStart !== undefined ? { onPressStart } : {}),
        ...(onPressEnd !== undefined ? { onPressEnd } : {}),
        ...(onPressChange !== undefined ? { onPressChange } : {}),
        ...(onPressUp !== undefined ? { onPressUp } : {}),
        elementType: "button",
      },
      buttonRef
    );

    return (
      <button
        type="button"
        {...mergeProps(buttonProps, focusProps, { onMouseDown })}
        ref={buttonRef}
        className={className}
        aria-current={isActive ? "page" : undefined}
        data-focus-visible={isFocusVisible || undefined}
        data-active={isActive || undefined}
      >
        {children}
      </button>
    );
  }
);

HeadlessDrawerItem.displayName = "HeadlessDrawerItem";

// ─── Re-export context hook for styled layer ──────────────────────────────────

export { useDrawerContext };
