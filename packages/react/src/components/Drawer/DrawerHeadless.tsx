"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type React from "react";
import {
  useDialog,
  useOverlay,
  usePreventScroll,
  useButton,
  useLink,
  FocusScope,
} from "react-aria";
import { useOverlayTriggerState } from "react-stately";
import { mergeProps } from "@react-aria/utils";
import { cn } from "../../utils/cn";
import type {
  DrawerAnimationState,
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

// ─── ModalDrawerPanel (internal) ─────────────────────────────────────────────

/**
 * Internal dialog panel for the modal drawer variant.
 *
 * Wires `useDialog`, `useOverlay`, `usePreventScroll`, and handles the
 * forwarded ref merge. Receives the current `animationState` and
 * `getAnimationClassName` from the state machine in `HeadlessDrawer` so that
 * the exit animation plays before the portal gate removes the element.
 *
 * @internal
 */
interface ModalDrawerPanelProps {
  ariaLabel: string;
  onClose: () => void;
  className: string | undefined;
  animationState: DrawerAnimationState;
  getAnimationClassName: ((state: DrawerAnimationState) => string) | undefined;
  onTransitionEnd: () => void;
  forwardedRef: React.Ref<HTMLElement> | null;
  children: React.ReactNode;
}

const ModalDrawerPanel = ({
  ariaLabel,
  onClose,
  className,
  animationState,
  getAnimationClassName,
  onTransitionEnd,
  forwardedRef,
  children,
}: ModalDrawerPanelProps): React.ReactElement => {
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Lock body scroll while the modal panel is mounted
  usePreventScroll();

  // role="dialog", aria-label, aria-modal
  const { dialogProps } = useDialog(
    { "aria-label": ariaLabel },
    panelRef as React.RefObject<HTMLDivElement>
  );

  // Escape key + outside-click dismissal
  const { overlayProps } = useOverlay(
    { isOpen: true, onClose, isDismissable: true, shouldCloseOnBlur: false },
    panelRef as React.RefObject<HTMLDivElement>
  );

  // Merge the internal panelRef with the forwarded ref
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      panelRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef !== null && forwardedRef !== undefined) {
        (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [forwardedRef]
  );

  return (
    <div
      {...mergeProps(overlayProps, dialogProps)}
      ref={setRef}
      aria-modal="true"
      className={cn(className, getAnimationClassName?.(animationState))}
      data-animation-state={animationState}
      onTransitionEnd={onTransitionEnd}
    >
      {children}
    </div>
  );
};

ModalDrawerPanel.displayName = "ModalDrawerPanel";

// ─── HeadlessDrawer ───────────────────────────────────────────────────────────

/**
 * Headless Navigation Drawer (Layer 2).
 *
 * Provides all behavior and ARIA semantics without any visual styling.
 * Renders two distinct DOM structures based on the `variant` prop:
 *
 * - **`standard`**: `<nav role="navigation">` — no overlay, no focus trap,
 *   translate-x driven by the `open` prop (spring-standard-spatial via CVA).
 *
 * - **`modal`**: portal to `document.body` with animation state machine
 *   (`entering → visible → exiting → exited`), `createPortal` + portal gate,
 *   `FocusScope`, `useDialog`, `useOverlay`, `usePreventScroll`, scrim, and
 *   `data-animation-state` on both the panel and scrim elements.
 *
 * React Aria hooks used (modal):
 * - `useDialog`              — `role="dialog"`, `aria-modal`, `aria-label`
 * - `useOverlay`             — Escape key + outside-click dismissal
 * - `usePreventScroll`       — locks body scroll when panel is mounted
 * - `FocusScope`             — focus trap + restoreFocus on close
 * - `useOverlayTriggerState` — open/close state management
 *
 * @example
 * ```tsx
 * <HeadlessDrawer variant="modal" open aria-label="Navigation"
 *   getAnimationClassName={(s) => drawerAnimationVariants({ animationState: s })}>
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
      getAnimationClassName,
      getScrimAnimationClassName,
      disableRipple = false,
    },
    ref
  ) => {
    const state = useOverlayTriggerState({
      ...(open !== undefined ? { isOpen: open } : {}),
      ...(defaultOpen !== undefined ? { defaultOpen } : {}),
      ...(onOpenChange !== undefined ? { onOpenChange } : {}),
    });

    const isOpen = state.isOpen;

    const close = useCallback(() => {
      state.close();
    }, [state]);

    // ── Animation state machine (modal only) ──────────────────────────────────

    const [animationState, setAnimationState] = useState<DrawerAnimationState>("exited");
    const closedRef = useRef<boolean>(false);
    const exitFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Entry: isOpen true → 'entering' → rAF → 'visible'
    useEffect(() => {
      if (!isOpen) return;

      closedRef.current = false;
      setAnimationState("entering");

      // Zero-delay timer lets 'entering' paint (initial CSS values applied)
      // before advancing to 'visible' to fire the enter animation.
      const id = setTimeout(() => {
        setAnimationState("visible");
      }, 0);

      return () => clearTimeout(id);
    }, [isOpen]);

    // Exit: isOpen false + currently visible → 'exiting' → fallback → 'exited'
    useEffect(() => {
      if (isOpen) return;
      if (animationState === "exited" || animationState === "entering") return;

      if (animationState === "visible") {
        setAnimationState("exiting");

        // 500ms fallback — longer than MD3 emphasized-accelerate (200ms) to give
        // onTransitionEnd a chance to fire first under normal conditions.
        exitFallbackRef.current = setTimeout(() => {
          if (!closedRef.current) {
            closedRef.current = true;
            setAnimationState("exited");
          }
        }, 500);
      }
    }, [isOpen, animationState]);

    // Cleanup fallback timer on unmount
    useEffect(
      () => () => {
        if (exitFallbackRef.current !== null) {
          clearTimeout(exitFallbackRef.current);
        }
      },
      []
    );

    const handleTransitionEnd = useCallback(() => {
      if (animationState === "exiting" && !closedRef.current) {
        if (exitFallbackRef.current !== null) {
          clearTimeout(exitFallbackRef.current);
          exitFallbackRef.current = null;
        }
        closedRef.current = true;
        setAnimationState("exited");
      }
    }, [animationState]);

    const contextValue: DrawerContextValue = {
      isOpen,
      close,
      disableRipple,
    };

    // ── Standard variant — inline nav, spring-slide via CVA classes ───────────

    if (variant === "standard") {
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

    // ── Modal variant — portal gate ───────────────────────────────────────────

    // Remove portal content entirely once the exit animation has fully completed
    if (!isOpen && animationState === "exited") {
      return null;
    }

    // SSR guard
    if (typeof document === "undefined") return null;

    const content = (
      <DrawerContext.Provider value={contextValue}>
        <FocusScope contain restoreFocus autoFocus>
          {/* Scrim — aria-hidden, click closes the drawer. Uses scrim-specific
              animation class (fade in/out) separate from the panel slide. */}
          <div
            data-testid="drawer-scrim"
            className={cn(scrimClassName, getScrimAnimationClassName?.(animationState))}
            data-animation-state={animationState}
            onClick={close}
            aria-hidden="true"
          />
          <ModalDrawerPanel
            ariaLabel={ariaLabel}
            onClose={close}
            className={className}
            animationState={animationState}
            getAnimationClassName={getAnimationClassName}
            onTransitionEnd={handleTransitionEnd}
            forwardedRef={ref}
          >
            {children}
          </ModalDrawerPanel>
        </FocusScope>
      </DrawerContext.Provider>
    );

    return createPortal(content, document.body) as React.ReactElement;
  }
);

HeadlessDrawer.displayName = "HeadlessDrawer";

// ─── HeadlessDrawerItem ────────────────────────────────────────────────────────

/**
 * Headless Navigation Drawer Item (Layer 2).
 *
 * Thin primitive — handles only behavior and ARIA semantics. All interaction
 * state tracking (hover, focus-visible, pressed) and data-* attributes live
 * in the styled layer (DrawerItem), mirroring the ButtonHeadless pattern.
 *
 * Renders as:
 * - `<a>` using `useLink` when `href` is provided
 * - `<button>` using `useButton` when no `href`
 *
 * Applies `aria-current="page"` when `isActive` is true.
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
      title,
      ...restProps
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLElement>(null);

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
          {...mergeProps(linkProps, { onMouseDown })}
          ref={linkRef}
          href={href}
          className={className}
          title={title}
          aria-current={isActive ? "page" : undefined}
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
        {...mergeProps(buttonProps, { onMouseDown })}
        ref={buttonRef}
        className={className}
        title={title}
        aria-current={isActive ? "page" : undefined}
      >
        {children}
      </button>
    );
  }
);

HeadlessDrawerItem.displayName = "HeadlessDrawerItem";

// ─── Re-export context hook for styled layer ──────────────────────────────────

export { useDrawerContext };
