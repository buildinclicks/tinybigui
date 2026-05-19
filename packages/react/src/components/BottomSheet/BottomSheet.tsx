"use client";

// BottomSheet — Layer 3 MD3 styled Bottom Sheet component.
//
// Wraps BottomSheetHeadless with CVA styling, renders BottomSheetHandle
// automatically as the first child inside the sheet panel.
// M06: Wires getAnimationClassName (slide in/out) and useReducedMotion guard.

import { forwardRef, useCallback } from "react";
import { cn } from "../../utils/cn";
import { BottomSheetHeadless } from "./BottomSheetHeadless";
import { BottomSheetHandle } from "./BottomSheetHandle";
import {
  bottomSheetVariants,
  bottomSheetScrimVariants,
  bottomSheetAnimationVariants,
} from "./BottomSheet.variants";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { BottomSheetProps, BottomSheetAnimationState } from "./BottomSheet.types";

/**
 * `BottomSheet` — Layer 3 MD3 Styled Bottom Sheet Component.
 *
 * Applies Material Design 3 visual tokens via CVA variants, renders the drag
 * handle automatically, and wires up the scrim overlay for the modal variant.
 * Built on top of `BottomSheetHeadless` (Layer 2) for full accessibility.
 *
 * **Modal** (default):
 * - `bg-surface-container-low`, `shadow-elevation-1`, `rounded-t-xl`
 * - Full-width scrim overlay (`z-40`) with 32% opacity
 * - Sheet panel at `z-50`, dismissable via Escape, scrim click, or drag
 *
 * **Standard**:
 * - Same visual surface, no scrim, no focus trap, co-exists with content
 * - Sheet panel at `z-10`
 *
 * Responsive layout (> 640dp viewport):
 * - 56dp side margins and 56dp top margin (`sm:mx-14 sm:top-14`)
 * - All corners rounded (`sm:rounded-xl`) — sheet floats away from screen edge
 *
 * @example
 * ```tsx
 * // Modal variant — controlled
 * <BottomSheet
 *   open={open}
 *   onOpenChange={setOpen}
 *   snapPoints={['50%', '90%']}
 *   aria-label="Share options"
 * >
 *   <p>Share to...</p>
 * </BottomSheet>
 *
 * // Standard variant — uncontrolled
 * <BottomSheet variant="standard" defaultOpen aria-label="Now playing">
 *   <p>Song title</p>
 * </BottomSheet>
 * ```
 *
 * @see https://m3.material.io/components/bottom-sheets/overview
 */
export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(function BottomSheet(
  {
    variant = "modal",
    open,
    defaultOpen,
    onOpenChange,
    snapPoints,
    "aria-label": ariaLabel,
    children,
    className,
  },
  ref
) {
  const reducedMotion = useReducedMotion();

  /**
   * Returns the CVA animation class for the current animation state.
   * Returns empty string when the user prefers reduced motion, suppressing
   * all JS-driven slide animations per WCAG 2.1 AA and MD3 reduce-motion spec.
   */
  const getAnimationClassName = useCallback(
    (state: BottomSheetAnimationState): string => {
      if (reducedMotion) return "";
      return bottomSheetAnimationVariants({ animationState: state });
    },
    [reducedMotion]
  );

  // When reducedMotion is true, append transition-none to override the snap
  // spring transition-transform added in bottomSheetVariants base.
  // tailwind-merge resolves the conflict and keeps transition-none.
  const panelClassName = cn(
    bottomSheetVariants({ variant }),
    reducedMotion && "transition-none",
    className
  );
  const scrimClassName = bottomSheetScrimVariants();

  return (
    <BottomSheetHeadless
      ref={ref}
      variant={variant}
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange } : {})}
      {...(snapPoints !== undefined ? { snapPoints } : {})}
      aria-label={ariaLabel}
      className={panelClassName}
      scrimClassName={scrimClassName}
      getAnimationClassName={getAnimationClassName}
    >
      <BottomSheetHandle />
      {children}
    </BottomSheetHeadless>
  );
});

BottomSheet.displayName = "BottomSheet";
