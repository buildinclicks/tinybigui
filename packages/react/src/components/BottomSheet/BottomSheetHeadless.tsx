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
import { useOverlayTriggerState } from "react-stately";
import type {
  BottomSheetAnimationState,
  BottomSheetContextValue,
  BottomSheetHeadlessProps,
} from "./BottomSheet.types";

// ─── Context ──────────────────────────────────────────────────────────────────

/**
 * Context shared between `BottomSheetHeadless` and its sub-components
 * (`BottomSheetHandle` and others).
 *
 * @internal
 */
export const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

/**
 * Hook to consume `BottomSheetContext` inside bottom sheet sub-components.
 * Throws a descriptive error if used outside a `BottomSheetHeadless` tree.
 *
 * @internal
 */
export function useBottomSheetContext(): BottomSheetContextValue {
  const ctx = useContext(BottomSheetContext);
  if (ctx === null) {
    throw new Error(
      "[BottomSheet] BottomSheetHandle and other sub-components must be rendered " +
        "inside a <BottomSheet> or <BottomSheetHeadless> component."
    );
  }
  return ctx;
}

// ─── BottomSheetHeadless ──────────────────────────────────────────────────────

/**
 * `BottomSheetHeadless` — Layer 2 headless primitive (Milestone 2: state + portal).
 *
 * Implements open/close state management, portal rendering to `document.body`,
 * the animation state machine, and `BottomSheetContext` provisioning.
 * Dialog semantics, scrim, focus trap, and drag/snap logic are added in M03+.
 *
 * - **Portal rendering**: content renders in `document.body` via `createPortal`
 * - **Open/close state**: `useOverlayTriggerState` (controlled + uncontrolled)
 * - **Animation state machine**: `entering → visible → exiting → exited`
 * - **Portal gate**: removes DOM content when `!isOpen && animationState === 'exited'`
 * - **SSR guard**: returns `null` when `document` is undefined
 *
 * @example
 * ```tsx
 * // Controlled
 * <BottomSheetHeadless open={open} onOpenChange={setOpen} aria-label="Options">
 *   <BottomSheetHandle />
 *   <p>Content here</p>
 * </BottomSheetHeadless>
 *
 * // Uncontrolled
 * <BottomSheetHeadless defaultOpen aria-label="Player">
 *   <p>Audio player</p>
 * </BottomSheetHeadless>
 * ```
 */
export const BottomSheetHeadless = forwardRef<HTMLDivElement, BottomSheetHeadlessProps>(
  function BottomSheetHeadless(
    {
      variant = "modal",
      open,
      defaultOpen = false,
      onOpenChange,
      snapPoints = ["50%"],
      "aria-label": ariaLabel,
      children,
      className,
    },
    ref
  ) {
    // ── Open/close state ──────────────────────────────────────────────────────

    const state = useOverlayTriggerState({
      ...(open !== undefined ? { isOpen: open } : {}),
      ...(defaultOpen !== undefined ? { defaultOpen } : {}),
      ...(onOpenChange !== undefined ? { onOpenChange } : {}),
    });

    const isOpen = state.isOpen;

    const close = useCallback(() => {
      state.close();
    }, [state]);

    // ── Animation state machine ───────────────────────────────────────────────

    const [animationState, setAnimationState] = useState<BottomSheetAnimationState>("exited");
    // Guard against calling state updates after the exit animation completes multiple times
    const closedRef = useRef<boolean>(false);
    // Fallback timer for exit animation — fires if onTransitionEnd doesn't fire in time
    const exitFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Entry: isOpen becomes true → 'entering' → setTimeout(0) → 'visible'
    useEffect(() => {
      if (!isOpen) return;

      closedRef.current = false;
      setAnimationState("entering");

      // Zero-delay timer ensures 'entering' state is committed (allowing CSS
      // transition initial values to paint) before advancing to 'visible'.
      const id = setTimeout(() => {
        setAnimationState("visible");
      }, 0);

      return () => clearTimeout(id);
    }, [isOpen]);

    // Exit: isOpen becomes false while 'visible' → 'exiting' → 300ms fallback → 'exited'
    useEffect(() => {
      if (isOpen) return;
      if (animationState === "exited" || animationState === "entering") return;

      if (animationState === "visible") {
        setAnimationState("exiting");

        // 300ms fallback (longer than Dialog's 150ms — slide animations take longer)
        exitFallbackRef.current = setTimeout(() => {
          if (!closedRef.current) {
            closedRef.current = true;
            setAnimationState("exited");
          }
        }, 300);
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

    // ── Stub handle props (expanded in M04 with real drag logic) ──────────────

    const stubHandleProps: BottomSheetContextValue["handleProps"] = {
      onPointerDown: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
      onKeyDown: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
      tabIndex: 0,
      role: "button",
      "aria-label": ariaLabel,
    };

    // ── Context value ─────────────────────────────────────────────────────────

    const contextValue: BottomSheetContextValue = {
      isOpen,
      variant,
      snapPoints,
      currentSnapIndex: 0,
      isDragging: false,
      close,
      handleProps: stubHandleProps,
    };

    // ── Portal gate ───────────────────────────────────────────────────────────

    // Remove portal content entirely once the exit animation has fully completed
    if (!isOpen && animationState === "exited") {
      return null;
    }

    // ── SSR guard ─────────────────────────────────────────────────────────────

    if (typeof document === "undefined") return null;

    // ── Portal content ────────────────────────────────────────────────────────

    const content = (
      <BottomSheetContext.Provider value={contextValue}>
        {null /* scrim element — populated in M03 */}
        <div
          ref={ref}
          className={className}
          data-animation-state={animationState}
          onTransitionEnd={handleTransitionEnd}
        >
          {children}
        </div>
      </BottomSheetContext.Provider>
    );

    return createPortal(content, document.body) as React.ReactElement;
  }
);

BottomSheetHeadless.displayName = "BottomSheetHeadless";
