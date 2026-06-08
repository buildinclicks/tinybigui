import { useRef, useCallback, useState, useEffect, type MouseEvent } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Ripple state for tracking individual ripple animations
 */
interface Ripple {
  key: number;
  x: number;
  y: number;
  size: number;
}

/**
 * Options for useRipple hook
 */
interface UseRippleOptions {
  /**
   * Disable ripple effect
   * @default false
   */
  disabled?: boolean;

  /**
   * Color of the ripple (currentColor by default)
   */
  color?: string;

  /**
   * Duration of ripple animation in ms.
   * Must match the `--animate-md-ripple` token duration (450ms).
   * @default 450
   */
  duration?: number;
}

/**
 * Hook for Material Design 3 ripple effect.
 *
 * Creates a ripple animation that emanates from the pointer-down origin,
 * expanding to cover the entire container element. Uses the `animate-md-ripple`
 * composite token (md-ripple keyframe + 450ms emphasized spatial curve) so
 * the animation is always in sync with the MD3 motion system.
 *
 * Automatically respects `prefers-reduced-motion`: when the OS/browser
 * requests reduced motion the ripple is fully suppressed (no DOM nodes are
 * created, no JS timers fire). This is a non-negotiable accessibility
 * requirement per `md3-motion.mdc`.
 *
 * @example
 * ```tsx
 * function MyButton() {
 *   const { onMouseDown, ripples } = useRipple();
 *
 *   return (
 *     <button onMouseDown={onMouseDown}>
 *       Click me
 *       {ripples}
 *     </button>
 *   );
 * }
 * ```
 */
export function useRipple(options: UseRippleOptions = {}): {
  onMouseDown: (event: MouseEvent<HTMLElement>) => void;
  ripples: React.ReactNode;
} {
  const { disabled = false, color = "currentColor", duration = 450 } = options;

  // MD3 motion rule: JS-driven animations must gate on useReducedMotion().
  // When reduced motion is preferred, suppress the ripple entirely —
  // do not just shorten it (shortened motion can still cause discomfort).
  const prefersReducedMotion = useReducedMotion();

  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleKeyCounter = useRef(0);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  /**
   * Create ripple on pointer down (mouse or touch)
   */
  const onMouseDown = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (disabled || prefersReducedMotion) return;

      const element = event.currentTarget;
      const rect = element.getBoundingClientRect();

      // Position relative to the element's own coordinate system
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Diameter that guarantees coverage of all four corners
      const sizeX = Math.max(x, rect.width - x);
      const sizeY = Math.max(y, rect.height - y);
      const size = Math.sqrt(sizeX ** 2 + sizeY ** 2) * 2;

      const key = rippleKeyCounter.current++;

      setRipples((prev) => [...prev, { key, x, y, size }]);

      // Remove after animation completes so DOM stays clean
      const timer = setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.key !== key));
        timersRef.current = timersRef.current.filter((t) => t !== timer);
      }, duration);
      timersRef.current.push(timer);
    },
    [disabled, duration, prefersReducedMotion]
  );

  /**
   * Ripple container and individual ripple elements.
   *
   * animate-md-ripple   — MD3 composite token: md-ripple keyframe + 450ms
   *                       cubic-bezier(0.2, 0, 0, 1) (emphasized spatial)
   * opacity-12          — MD3 press state layer opacity for ripple fill
   * rounded-full        — circular ripple shape
   */
  const rippleElements =
    disabled || prefersReducedMotion ? null : (
      <span
        data-ripple-container
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      >
        {ripples.map((ripple) => (
          <span
            key={ripple.key}
            className="animate-md-ripple absolute rounded-full opacity-12"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
              transform: "translate(-50%, -50%) scale(0)",
              backgroundColor: color,
              animationDuration: `${duration}ms`,
            }}
          />
        ))}
      </span>
    );

  return {
    onMouseDown,
    ripples: rippleElements,
  };
}
