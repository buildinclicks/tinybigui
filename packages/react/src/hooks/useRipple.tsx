import { useRef, useCallback, useState, type MouseEvent } from "react";

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
   * Duration of ripple animation in ms
   * @default 450
   */
  duration?: number;
}

/**
 * Hook for Material Design 3 ripple effect
 *
 * Creates a ripple animation that emanates from the click/touch point.
 * The ripple is bounded to the container and follows MD3 motion specs.
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

  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleKeyCounter = useRef(0);

  /**
   * Create ripple on mouse down
   */
  const onMouseDown = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (disabled) return;

      const element = event.currentTarget;
      const rect = element.getBoundingClientRect();

      // Calculate ripple position relative to element
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Calculate ripple size (diameter that covers entire element)
      const sizeX = Math.max(x, rect.width - x);
      const sizeY = Math.max(y, rect.height - y);
      const size = Math.sqrt(sizeX ** 2 + sizeY ** 2) * 2;

      const key = rippleKeyCounter.current++;

      // Add new ripple
      setRipples((prev) => [...prev, { key, x, y, size }]);

      // Remove ripple after animation completes
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.key !== key));
      }, duration);
    },
    [disabled, duration]
  );

  /**
   * Ripple elements to render
   */
  const rippleElements = disabled ? null : (
    <span
      data-ripple-container
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.key}
          className="animate-ripple absolute rounded-full opacity-12"
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
