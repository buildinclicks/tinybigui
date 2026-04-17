import { forwardRef } from "react";
import { useScrollElevation } from "../../hooks/useScrollElevation";
import type { AppBarHeadlessProps } from "./AppBar.types";

/**
 * Headless AppBar Component (Layer 2)
 *
 * Unstyled Top App Bar primitive. Renders a `<header role="banner">` landmark
 * and manages scroll elevation state via the `useScrollElevation` hook.
 *
 * Features:
 * - Semantic `<header>` element with `role="banner"` ARIA landmark
 * - Controlled scroll state via `scrolled` prop
 * - Uncontrolled scroll state with internal `window` scroll detection
 * - `onScrollStateChange` callback for both modes
 * - Full ref forwarding to the header element
 *
 * Use this layer when you need full visual control beyond what the styled
 * `AppBar` provides.
 *
 * @example
 * ```tsx
 * // Uncontrolled (auto scroll detection)
 * <AppBarHeadless className="my-custom-appbar">
 *   <div>My custom layout</div>
 * </AppBarHeadless>
 *
 * // Controlled scroll state
 * <AppBarHeadless
 *   scrolled={isScrolled}
 *   onScrollStateChange={setIsScrolled}
 *   className="my-custom-appbar"
 * >
 *   <div>My custom layout</div>
 * </AppBarHeadless>
 * ```
 */
export const AppBarHeadless = forwardRef<HTMLElement, AppBarHeadlessProps>(
  ({ className, children, scrolled: scrolledProp, onScrollStateChange }, ref) => {
    const { isScrolled } = useScrollElevation({
      scrolled: scrolledProp,
      onScrollStateChange,
    });

    return (
      <header ref={ref} role="banner" className={className} data-scrolled={isScrolled}>
        {children}
      </header>
    );
  }
);

AppBarHeadless.displayName = "AppBarHeadless";
