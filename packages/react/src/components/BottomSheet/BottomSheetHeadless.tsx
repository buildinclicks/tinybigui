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
import { FocusScope, useDialog, useOverlay, usePreventScroll } from "react-aria";
import { mergeProps } from "@react-aria/utils";
import { useOverlayTriggerState } from "react-stately";
import { cn } from "../../utils/cn";
import type {
  BottomSheetAnimationState,
  BottomSheetContextValue,
  BottomSheetHeadlessProps,
} from "./BottomSheet.types";
import { useBottomSheetDrag } from "./useBottomSheetDrag";

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

// ─── BottomSheetModalPanel (internal) ────────────────────────────────────────

/**
 * Internal panel component for the modal variant.
 * Wires `useDialog`, `useOverlay`, and `usePreventScroll`, then renders the
 * accessible dialog element.
 *
 * Follows the same pattern as `ModalDrawerPanel` in `DrawerHeadless` and
 * `DialogPanel` in `DialogHeadless`.
 *
 * @internal
 */
interface BottomSheetModalPanelProps {
  ariaLabel: string;
  onClose: () => void;
  className: string | undefined;
  animationState: BottomSheetAnimationState;
  getAnimationClassName: ((state: BottomSheetAnimationState) => string) | undefined;
  onTransitionEnd: () => void;
  forwardedRef: React.Ref<HTMLDivElement> | null;
  children: React.ReactNode;
}

const BottomSheetModalPanel = ({
  ariaLabel,
  onClose,
  className,
  animationState,
  getAnimationClassName,
  onTransitionEnd,
  forwardedRef,
  children,
}: BottomSheetModalPanelProps): React.ReactElement => {
  // Internal ref for React Aria hooks — always an object ref
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Lock body scroll while the modal sheet is mounted
  usePreventScroll();

  // Provides role="dialog", aria-label, aria-modal
  const { dialogProps } = useDialog(
    { "aria-label": ariaLabel },
    panelRef as React.RefObject<HTMLDivElement>
  );

  // Handles Escape key and outside-pointer dismissal
  const { overlayProps } = useOverlay(
    { isOpen: true, onClose, isDismissable: true, shouldCloseOnBlur: false },
    panelRef as React.RefObject<HTMLDivElement>
  );

  // Merge the internal panelRef with the forwarded ref from BottomSheetHeadless
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      panelRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef !== null) {
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

BottomSheetModalPanel.displayName = "BottomSheetModalPanel";

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
      scrimClassName,
      getAnimationClassName,
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

    // ── Drag handle interaction and snap logic (M04) ──────────────────────────

    const {
      currentSnapIndex,
      isDragging,
      dragTranslateY,
      handleProps: dragHandleProps,
    } = useBottomSheetDrag({ snapPoints, onClose: close });

    // The hook's default aria-label "Adjust sheet height" is the correct label per MD3 spec.
    // Consumers can override via BottomSheetHandleProps["aria-label"] on <BottomSheetHandle />.
    const handleProps = dragHandleProps;

    // ── Context value ─────────────────────────────────────────────────────────

    const contextValue: BottomSheetContextValue = {
      isOpen,
      variant,
      snapPoints,
      currentSnapIndex,
      isDragging,
      dragTranslateY,
      close,
      handleProps,
    };

    // ── Scrim dismissal (modal always dismissable per MD3 spec) ───────────────

    const handleScrimClick = (): void => {
      close();
    };

    // ── Portal gate ───────────────────────────────────────────────────────────

    // Remove portal content entirely once the exit animation has fully completed
    if (!isOpen && animationState === "exited") {
      return null;
    }

    // ── SSR guard ─────────────────────────────────────────────────────────────

    if (typeof document === "undefined") return null;

    // ── Portal content ────────────────────────────────────────────────────────

    const content =
      variant === "modal" ? (
        // Modal: dialog semantics + focus trap + scrim
        <BottomSheetContext.Provider value={contextValue}>
          <FocusScope contain restoreFocus autoFocus>
            {/* Scrim — aria-hidden so assistive tech ignores it */}
            <div
              data-testid="bottom-sheet-scrim"
              className={scrimClassName}
              onClick={handleScrimClick}
              aria-hidden="true"
            />
            <BottomSheetModalPanel
              ariaLabel={ariaLabel}
              onClose={close}
              className={className}
              animationState={animationState}
              getAnimationClassName={getAnimationClassName}
              onTransitionEnd={handleTransitionEnd}
              forwardedRef={ref}
            >
              {children}
            </BottomSheetModalPanel>
          </FocusScope>
        </BottomSheetContext.Provider>
      ) : (
        // Standard: plain surface, no dialog role, no scrim, no focus trap
        <BottomSheetContext.Provider value={contextValue}>
          <div
            ref={ref}
            className={cn(className, getAnimationClassName?.(animationState))}
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
