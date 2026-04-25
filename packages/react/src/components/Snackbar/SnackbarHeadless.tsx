"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";
import type { SnackbarAnimationState, SnackbarHeadlessProps } from "./Snackbar.types";

/**
 * SnackbarHeadless — Layer 2 headless primitive.
 *
 * Handles all Snackbar behavior without opinionated visual styling:
 * - ARIA live region with correct `role`/`aria-live` pairing per severity
 * - Auto-dismiss timer with configurable `duration`
 * - Timer pause/resume on pointer hover (`mouseenter`/`mouseleave`) and
 *   keyboard focus (`focusin`/`focusout`)
 * - Animation state machine: `entering → visible → exiting → exited`
 * - Exposes `onClose` imperative trigger via render-prop for close icon/action
 * - Merges base `className` with animation-state-dependent classes via
 *   the optional `getAnimationClassName` prop
 *
 * No React Aria hook covers Snackbar; ARIA live region patterns follow the
 * ARIA authoring practices specification for status/alert regions.
 *
 * @example
 * ```tsx
 * // With render-prop children (typical usage from styled layer)
 * <SnackbarHeadless
 *   message="Saved"
 *   duration={3000}
 *   onClose={dismiss}
 *   className={baseClasses}
 *   getAnimationClassName={(state) => snackbarAnimationVariants({ animationState: state })}
 * >
 *   {({ onClose }) => (
 *     <>
 *       <span>Saved</span>
 *       <button onClick={onClose}>Dismiss</button>
 *     </>
 *   )}
 * </SnackbarHeadless>
 * ```
 */
export const SnackbarHeadless = forwardRef<HTMLDivElement, SnackbarHeadlessProps>(
  function SnackbarHeadless(
    {
      message,
      supportingText,
      action,
      showClose,
      duration = 4000,
      severity = "default",
      onClose,
      children,
      className,
      getAnimationClassName,
    },
    ref
  ) {
    const [animationState, setAnimationState] = useState<SnackbarAnimationState>("entering");

    // Tracks how many ms remain when the timer is paused
    const remainingRef = useRef<number>(duration);
    // Tracks wall-clock time when the current timer segment started
    const startedAtRef = useRef<number>(Date.now());
    // Active auto-dismiss setTimeout handle (separate from exit fallback)
    const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Fallback timer for exit animation (fires onClose if onTransitionEnd doesn't)
    const exitFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    // Whether the timer is currently paused (hover / focus)
    const pausedRef = useRef<boolean>(false);
    // Guard against calling onClose multiple times
    const closedRef = useRef<boolean>(false);

    const clearDismissTimer = useCallback(() => {
      if (dismissTimerRef.current !== null) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
    }, []);

    const triggerExit = useCallback(() => {
      if (closedRef.current) return;
      clearDismissTimer(); // stop auto-dismiss timer
      setAnimationState("exiting");
      // Fallback: if onTransitionEnd does not fire (jsdom, reduced-motion,
      // or CSS transitions disabled), ensure onClose is called after the
      // exit animation duration (MD3 short2 = 100ms + small buffer).
      exitFallbackRef.current = setTimeout(() => {
        if (!closedRef.current) {
          closedRef.current = true;
          setAnimationState("exited");
          onClose?.();
        }
      }, 150);
    }, [clearDismissTimer, onClose]);

    const startDismissTimer = useCallback(
      (ms: number) => {
        if (ms <= 0) return;
        clearDismissTimer();
        startedAtRef.current = Date.now();
        dismissTimerRef.current = setTimeout(triggerExit, ms);
      },
      [clearDismissTimer, triggerExit]
    );

    // Entry animation: a zero-delay timer ensures the component is painted
    // in its initial "entering" state before transitioning to "visible",
    // allowing CSS transitions to fire. Using setTimeout instead of rAF
    // ensures compatibility with vi.useFakeTimers() in tests.
    useEffect(() => {
      const id = setTimeout(() => {
        setAnimationState("visible");
      }, 0);
      return () => clearTimeout(id);
    }, []);

    // Start auto-dismiss timer once the component is in `visible` state.
    useEffect(() => {
      if (animationState !== "visible") return;
      if (duration <= 0) return;

      remainingRef.current = duration;
      startDismissTimer(duration);

      // Only clear the dismiss timer on cleanup (not the exit fallback)
      return clearDismissTimer;
    }, [animationState, duration, startDismissTimer, clearDismissTimer]);

    // Cleanup all timers on unmount
    useEffect(
      () => () => {
        clearDismissTimer();
        if (exitFallbackRef.current !== null) {
          clearTimeout(exitFallbackRef.current);
          exitFallbackRef.current = null;
        }
      },
      [clearDismissTimer]
    );

    // When the exit CSS transition completes, advance to `exited` and fire onClose.
    // Also cancels the fallback timer since the transition fired properly.
    const handleTransitionEnd = useCallback(() => {
      if (animationState === "exiting" && !closedRef.current) {
        if (exitFallbackRef.current !== null) {
          clearTimeout(exitFallbackRef.current);
          exitFallbackRef.current = null;
        }
        closedRef.current = true;
        setAnimationState("exited");
        onClose?.();
      }
    }, [animationState, onClose]);

    // Pause timer on pointer hover ─────────────────────────────────────────────

    const handleMouseEnter = useCallback(() => {
      if (pausedRef.current || animationState !== "visible") return;
      pausedRef.current = true;
      const elapsed = Date.now() - startedAtRef.current;
      remainingRef.current = Math.max(remainingRef.current - elapsed, 0);
      clearDismissTimer();
    }, [animationState, clearDismissTimer]);

    const handleMouseLeave = useCallback(() => {
      if (!pausedRef.current || animationState !== "visible") return;
      pausedRef.current = false;
      if (duration > 0) startDismissTimer(remainingRef.current);
    }, [animationState, duration, startDismissTimer]);

    // Pause timer on keyboard focus ────────────────────────────────────────────

    const handleFocusIn = useCallback(() => {
      if (pausedRef.current || animationState !== "visible") return;
      pausedRef.current = true;
      const elapsed = Date.now() - startedAtRef.current;
      remainingRef.current = Math.max(remainingRef.current - elapsed, 0);
      clearDismissTimer();
    }, [animationState, clearDismissTimer]);

    const handleFocusOut = useCallback(() => {
      if (!pausedRef.current || animationState !== "visible") return;
      pausedRef.current = false;
      if (duration > 0) startDismissTimer(remainingRef.current);
    }, [animationState, duration, startDismissTimer]);

    // Imperative close (close icon pressed, action button, programmatic close)
    const handleClose = useCallback(() => {
      triggerExit();
    }, [triggerExit]);

    // ARIA live region attributes per MD3 / ARIA authoring practices spec
    const ariaProps =
      severity === "error"
        ? ({ role: "alert", "aria-live": "assertive", "aria-atomic": "true" } as const)
        : ({ role: "status", "aria-live": "polite", "aria-atomic": "true" } as const);

    // Merge base className with animation-state-dependent classes
    const computedClassName = cn(className, getAnimationClassName?.(animationState));

    // Resolve children — render-prop or static ReactNode
    const childContent =
      typeof children === "function"
        ? children({ animationState, onClose: handleClose })
        : (children ?? (
            <>
              <span>{message}</span>
              {supportingText && <span>{supportingText}</span>}
              {action && (
                <button type="button" onClick={action.onAction}>
                  {action.label}
                </button>
              )}
              {showClose && (
                <button type="button" aria-label="Close" onClick={handleClose}>
                  ✕
                </button>
              )}
            </>
          ));

    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div
        ref={ref}
        className={computedClassName}
        {...ariaProps}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocusIn}
        onBlur={handleFocusOut}
        onTransitionEnd={handleTransitionEnd}
        data-animation-state={animationState}
      >
        {childContent}
      </div>
    );
  }
);

SnackbarHeadless.displayName = "SnackbarHeadless";

export type { SnackbarAnimationState };
