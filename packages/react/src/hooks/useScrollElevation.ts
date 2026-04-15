"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Options for useScrollElevation hook
 */
interface UseScrollElevationOptions {
  /**
   * Controlled scroll state.
   * When provided, the hook operates in controlled mode and does not
   * attach a scroll listener — the consumer manages state externally.
   * When `undefined`, the hook uses internal scroll detection (uncontrolled).
   */
  scrolled?: boolean | undefined;

  /**
   * Callback fired when scroll elevation state changes.
   * In uncontrolled mode: fires when user scrolls past threshold.
   * In controlled mode: fires to inform the consumer of scroll events.
   */
  onScrollStateChange?: ((scrolled: boolean) => void) | undefined;

  /**
   * Scroll threshold in pixels before elevation activates
   * @default 0
   */
  threshold?: number | undefined;
}

/**
 * Hook for MD3 AppBar scroll-triggered elevation behavior.
 *
 * Manages the transition between flat (at rest) and elevated (on scroll)
 * surface states per the Material Design 3 Top App Bar spec.
 *
 * Supports both controlled and uncontrolled modes:
 * - **Uncontrolled**: Attaches a `scroll` listener to `window` and manages
 *   elevation state internally. Calls `onScrollStateChange` when the state changes.
 * - **Controlled**: Uses the `scrolled` prop directly. No internal scroll listener
 *   is attached. The consumer is responsible for updating `scrolled`.
 *
 * @example Uncontrolled (recommended for most cases)
 * ```tsx
 * const { isScrolled } = useScrollElevation({
 *   onScrollStateChange: (scrolled) => console.log('scrolled:', scrolled),
 * });
 * ```
 *
 * @example Controlled
 * ```tsx
 * const [scrolled, setScrolled] = useState(false);
 * const { isScrolled } = useScrollElevation({ scrolled, onScrollStateChange: setScrolled });
 * ```
 */
export function useScrollElevation(options: UseScrollElevationOptions = {}): {
  isScrolled: boolean;
} {
  const { scrolled: controlledScrolled, onScrollStateChange, threshold = 0 } = options;

  const isControlled = controlledScrolled !== undefined;

  const [internalScrolled, setInternalScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    const currentlyScrolled = window.scrollY > threshold;
    setInternalScrolled((prev) => {
      if (prev !== currentlyScrolled) {
        onScrollStateChange?.(currentlyScrolled);
        return currentlyScrolled;
      }
      return prev;
    });
  }, [threshold, onScrollStateChange]);

  useEffect(() => {
    // Only attach the scroll listener in uncontrolled mode
    if (isControlled) return;

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Check initial scroll position
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isControlled, handleScroll]);

  return {
    isScrolled: isControlled ? controlledScrolled : internalScrolled,
  };
}
