"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  isValidElement,
  type JSX,
  type ReactNode,
} from "react";
import { TooltipTriggerHeadless, TooltipOverlayHeadless } from "./TooltipHeadless";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { TooltipPlacement } from "./Tooltip.types";

// ─── Animation Context ────────────────────────────────────────────────────────

/**
 * Shared animation state provided by `TooltipTrigger` to its `Tooltip` /
 * `RichTooltip` children. Drives the CVA `animation` variant and the
 * `animationend` unmount callback.
 */
export interface TooltipAnimationContextValue {
  /**
   * True while the exit animation is playing.
   * `Tooltip` / `RichTooltip` apply the exit animation class when this is
   * `true` and stay mounted until `onAnimationEnd` fires.
   * Always `false` when `reducedMotion` is `true` (immediate unmount).
   */
  isExiting: boolean;
  /** Called by the tooltip element's `onAnimationEnd` to unmount after exit. */
  onAnimationEnd: () => void;
  /**
   * Whether `prefers-reduced-motion: reduce` is currently active.
   * When `true`, styled components must skip animation classes and the
   * `TooltipTrigger` unmounts the overlay immediately on close (no
   * `animationend` dependency).
   */
  reducedMotion: boolean;
}

export const TooltipAnimationContext = createContext<TooltipAnimationContextValue>({
  isExiting: false,
  onAnimationEnd: () => undefined,
  reducedMotion: false,
});

/**
 * Convenience hook for `Tooltip` / `RichTooltip` to consume the animation
 * context without importing the raw context object.
 */
export function useTooltipAnimation(): TooltipAnimationContextValue {
  return useContext(TooltipAnimationContext);
}

// ─── TooltipTrigger ───────────────────────────────────────────────────────────

export interface TooltipTriggerStyledProps {
  /**
   * Exactly two children:
   * 1. The interactive trigger element (button, anchor, etc.)
   * 2. A `Tooltip` or `RichTooltip` component
   */
  children: [ReactNode, ReactNode];
  /**
   * Hover delay in ms before the tooltip opens.
   * @default 300
   */
  delay?: number;
  /** When true, the tooltip will not open. */
  isDisabled?: boolean;
}

/**
 * `TooltipTrigger` — Layer 3 styled trigger wrapper with MD3 animation.
 *
 * Wraps `TooltipTriggerHeadless` and manages the enter/exit animation state
 * machine so that tooltips fade/scale in on open and fade/scale out before
 * unmounting from the DOM, per MD3 motion specs.
 *
 * When `prefers-reduced-motion: reduce` is active the overlay is unmounted
 * immediately on close — no exit animation, no `animationend` dependency.
 * This prevents the stuck-mount bug that occurs when the global CSS reset
 * collapses animations and `animationend` never fires.
 *
 * Animation state machine (standard motion):
 * 1. RA fires `onOpenChange(true)`  → mount overlay, play entry animation
 * 2. RA fires `onOpenChange(false)` → keep mounted, play exit animation
 * 3. `animationend` fires          → unmount overlay
 *
 * Animation state machine (reduced motion):
 * 1. RA fires `onOpenChange(true)`  → mount overlay, no animation
 * 2. RA fires `onOpenChange(false)` → unmount overlay immediately
 *
 * @example
 * ```tsx
 * <TooltipTrigger delay={300}>
 *   <button>Save</button>
 *   <Tooltip placement="top">Save file</Tooltip>
 * </TooltipTrigger>
 * ```
 */
export function TooltipTrigger({
  children,
  delay = 300,
  isDisabled,
}: TooltipTriggerStyledProps): JSX.Element {
  const reducedMotion = useReducedMotion();

  const [isMounted, setIsMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const isExitingRef = useRef(false);
  const isPointerOverTooltipRef = useRef(false);
  const pendingCloseRef = useRef(false);

  /**
   * Unmounts the overlay immediately (reduced motion path or forced close).
   * Resets all animation refs to a clean state.
   */
  const unmountImmediately = useCallback(() => {
    isExitingRef.current = false;
    pendingCloseRef.current = false;
    setIsMounted(false);
    setIsExiting(false);
  }, []);

  /**
   * Stable callback — React Aria calls this when it wants to open or close.
   *
   * On open  → cancel any pending close, mount overlay, play entry animation.
   * On close → if pointer is over the tooltip surface, defer the close until
   *            the pointer leaves (prevents flicker when hovering the portal).
   *            Otherwise:
   *              - reduced motion: unmount immediately (no animationend needed)
   *              - standard motion: start exit animation, unmount on animationend
   */
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        pendingCloseRef.current = false;
        isExitingRef.current = false;
        setIsMounted(true);
        setIsExiting(false);
      } else if (isPointerOverTooltipRef.current) {
        pendingCloseRef.current = true;
      } else if (reducedMotion) {
        unmountImmediately();
      } else if (!isExitingRef.current) {
        isExitingRef.current = true;
        setIsExiting(true);
      }
    },
    [reducedMotion, unmountImmediately]
  );

  /**
   * Stable callback — called by the tooltip element's `onAnimationEnd` event.
   * Unmounts the overlay after the exit animation completes (standard motion only).
   *
   * The guard ensures the entry animation's `animationend` event is ignored —
   * only the exit animation should trigger unmounting.
   */
  const handleAnimationEnd = useCallback(() => {
    if (!isExitingRef.current) return;
    unmountImmediately();
  }, [unmountImmediately]);

  const handleOverlayPointerEnter = useCallback(() => {
    isPointerOverTooltipRef.current = true;
    pendingCloseRef.current = false;
  }, []);

  const handleOverlayPointerLeave = useCallback(() => {
    isPointerOverTooltipRef.current = false;
    if (pendingCloseRef.current) {
      pendingCloseRef.current = false;
      if (reducedMotion) {
        unmountImmediately();
      } else if (!isExitingRef.current) {
        isExitingRef.current = true;
        setIsExiting(true);
      }
    }
  }, [reducedMotion, unmountImmediately]);

  const contextValue: TooltipAnimationContextValue = {
    isExiting,
    onAnimationEnd: handleAnimationEnd,
    reducedMotion,
  };

  const [triggerChild, tooltipChild] = children;

  // Extract placement from the tooltip child's props so TooltipOverlayHeadless
  // can position correctly without requiring an extra prop on TooltipTrigger.
  const placement: TooltipPlacement = isValidElement<{ placement?: TooltipPlacement }>(tooltipChild)
    ? (tooltipChild.props.placement ?? "top")
    : "top";

  return (
    <TooltipAnimationContext.Provider value={contextValue}>
      <TooltipTriggerHeadless
        delay={delay}
        forceMount={isMounted}
        onOpenChange={handleOpenChange}
        {...(isDisabled !== undefined && { isDisabled })}
      >
        {triggerChild}
        {/*
         * TooltipTriggerHeadless clones this element and injects:
         *   - tooltipProps (id, role) from useTooltipTrigger
         *   - triggerRef   for useOverlayPosition
         * offset={4} = 4dp gap per MD3 spec.
         */}
        <TooltipOverlayHeadless
          tooltipProps={{}}
          placement={placement}
          offset={4}
          onPointerEnter={handleOverlayPointerEnter}
          onPointerLeave={handleOverlayPointerLeave}
        >
          {tooltipChild}
        </TooltipOverlayHeadless>
      </TooltipTriggerHeadless>
    </TooltipAnimationContext.Provider>
  );
}
