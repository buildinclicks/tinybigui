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
import type { TooltipPlacement } from "./Tooltip.types";

// ─── Animation Context ────────────────────────────────────────────────────────

/**
 * Shared animation state provided by `TooltipTrigger` to its `Tooltip` /
 * `RichTooltip` children. Drives the CVA `isVisible` variant and the
 * `animationend` unmount callback.
 */
export interface TooltipAnimationContextValue {
  /**
   * True while the exit animation is playing.
   * `Tooltip` / `RichTooltip` apply the exit animation class when this is
   * `true` and stay mounted until `onAnimationEnd` fires.
   */
  isExiting: boolean;
  /** Called by the tooltip element's `onAnimationEnd` to unmount after exit. */
  onAnimationEnd: () => void;
}

export const TooltipAnimationContext = createContext<TooltipAnimationContextValue>({
  isExiting: false,
  onAnimationEnd: () => undefined,
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
 * Animation state machine:
 * 1. RA fires `onOpenChange(true)`  → mount overlay, play entry animation
 * 2. RA fires `onOpenChange(false)` → keep mounted, play exit animation
 * 3. `animationend` fires          → unmount overlay
 *
 * The controlled `isOpen={isMounted}` prop passed to `TooltipTriggerHeadless`
 * is what keeps the overlay alive during the exit animation phase.
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
  const [isMounted, setIsMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const isExitingRef = useRef(false);
  const isPointerOverTooltipRef = useRef(false);
  const pendingCloseRef = useRef(false);

  /**
   * Stable callback — React Aria calls this when it wants to open or close.
   *
   * On open  → cancel any pending close, mount overlay, play entry animation.
   * On close → if pointer is over the tooltip surface, defer the close until
   *            the pointer leaves (prevents flicker when hovering the portal).
   *            Otherwise start exit animation immediately.
   */
  const handleOpenChange = useCallback((open: boolean) => {
    if (open) {
      pendingCloseRef.current = false;
      isExitingRef.current = false;
      setIsMounted(true);
      setIsExiting(false);
    } else if (isPointerOverTooltipRef.current) {
      pendingCloseRef.current = true;
    } else if (!isExitingRef.current) {
      isExitingRef.current = true;
      setIsExiting(true);
    }
  }, []);

  /**
   * Stable callback — called by the tooltip element's `onAnimationEnd` event.
   * Unmounts the overlay after the exit animation completes.
   *
   * The guard ensures the entry animation's `animationend` event is ignored —
   * only the exit animation should trigger unmounting.
   */
  const handleAnimationEnd = useCallback(() => {
    if (!isExitingRef.current) return;
    isExitingRef.current = false;
    pendingCloseRef.current = false;
    setIsMounted(false);
    setIsExiting(false);
  }, []);

  const handleOverlayPointerEnter = useCallback(() => {
    isPointerOverTooltipRef.current = true;
    pendingCloseRef.current = false;
  }, []);

  const handleOverlayPointerLeave = useCallback(() => {
    isPointerOverTooltipRef.current = false;
    if (pendingCloseRef.current && !isExitingRef.current) {
      pendingCloseRef.current = false;
      isExitingRef.current = true;
      setIsExiting(true);
    }
  }, []);

  const contextValue: TooltipAnimationContextValue = {
    isExiting,
    onAnimationEnd: handleAnimationEnd,
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
