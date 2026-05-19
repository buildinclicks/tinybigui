"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import type { BottomSheetContextValue } from "./BottomSheet.types";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Options for the `useBottomSheetDrag` hook.
 */
export interface UseBottomSheetDragOptions {
  /**
   * Snap points as CSS percentage strings (e.g. `['25%', '50%', '100%']`).
   * Index 0 is the lowest (least expanded), last index is the highest (most expanded).
   */
  snapPoints: string[];
  /**
   * Called when a drag gesture resolves to a new snap point index.
   */
  onSnapChange?: (index: number) => void;
  /**
   * Called when the sheet should close — dragged below the lowest snap point
   * by more than 20% of the viewport height, or ArrowDown pressed at index 0.
   */
  onClose?: () => void;
}

/**
 * Return value of the `useBottomSheetDrag` hook.
 */
export interface UseBottomSheetDragReturn {
  /** Index of the currently active snap point (0 = lowest). */
  currentSnapIndex: number;
  /** `true` while a pointer drag gesture is in progress. */
  isDragging: boolean;
  /**
   * Inline translateY pixel offset during a drag gesture.
   * Positive = dragged down (sheet shrinks), negative = dragged up (sheet grows).
   * `null` when the sheet is snapped and not being dragged.
   */
  dragTranslateY: number | null;
  /** Props to spread onto the drag handle element. */
  handleProps: BottomSheetContextValue["handleProps"];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseSnapPercent(snap: string): number {
  return parseFloat(snap.replace("%", ""));
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Encapsulates all drag-handle interaction and snap-point logic for the Bottom Sheet.
 *
 * This is a pure behavior hook (Layer 2) — no Tailwind classes.
 *
 * - Tracks pointer drag with `setPointerCapture` and a `window` `pointermove` listener
 * - Calculates nearest snap point on `pointerup`
 * - Calls `onClose()` when dragged more than 20% below the lowest snap point
 * - Provides keyboard cycling (Space/Enter) and directional navigation (ArrowUp/ArrowDown)
 * - Satisfies WCAG 2.1 SC 2.1.1: every drag action has a keyboard equivalent
 *
 * @example
 * ```tsx
 * const { currentSnapIndex, isDragging, dragTranslateY, handleProps } = useBottomSheetDrag({
 *   snapPoints: ['25%', '50%', '100%'],
 *   onClose: close,
 * })
 * ```
 */
export function useBottomSheetDrag({
  snapPoints,
  onSnapChange,
  onClose,
}: UseBottomSheetDragOptions): UseBottomSheetDragReturn {
  const [currentSnapIndex, setCurrentSnapIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragTranslateY, setDragTranslateY] = useState<number | null>(null);

  // Refs for values consumed inside event callbacks — avoids stale closures
  const startYRef = useRef<number>(0);
  const currentSnapIndexRef = useRef<number>(0);
  const dragTranslateYRef = useRef<number | null>(null);

  // Sync currentSnapIndex ref whenever state changes
  useEffect(() => {
    currentSnapIndexRef.current = currentSnapIndex;
  }, [currentSnapIndex]);

  /** Update dragTranslateY in both ref and state atomically. */
  const setDragTranslateYSync = useCallback((val: number | null) => {
    dragTranslateYRef.current = val;
    setDragTranslateY(val);
  }, []);

  // ── pointermove attached to window during drag ────────────────────────────
  // Using window avoids missing events when the pointer moves faster than the
  // handle element's bounds (standard practice for drag implementations).

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent): void => {
      const deltaY = e.clientY - startYRef.current;
      const vh = window.innerHeight;

      // Cannot drag above the 100% snap point (top of viewport)
      const maxUpDelta = -vh;
      // Cannot drag more than 50% below the bottom edge (dismiss threshold)
      const maxDownDelta = vh * 0.5;

      const clamped = Math.max(maxUpDelta, Math.min(maxDownDelta, deltaY));
      setDragTranslateYSync(clamped);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [isDragging, setDragTranslateYSync]);

  // ── Pointer handlers ──────────────────────────────────────────────────────

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startYRef.current = e.clientY;
    setIsDragging(true);
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setIsDragging(false);

      const vh = window.innerHeight;
      // Use ref value (updated by window pointermove); fall back to raw delta
      const deltaY = dragTranslateYRef.current ?? e.clientY - startYRef.current;

      const snapFractions = snapPoints.map((s) => parseSnapPercent(s) / 100);
      const startFraction = snapFractions[currentSnapIndexRef.current] ?? 0.5;

      // Positive deltaY = dragged down = sheet is now shorter (lower fraction)
      const newHeightFraction = startFraction - deltaY / vh;

      const lowestFraction = Math.min(...snapFractions);

      // Dismiss if dragged more than 20% below the lowest snap point
      if (newHeightFraction < lowestFraction - 0.2) {
        setDragTranslateYSync(null);
        onClose?.();
        return;
      }

      // Find nearest snap point by minimum absolute distance
      let nearestIndex = 0;
      let minDist = Infinity;
      for (let i = 0; i < snapFractions.length; i++) {
        const dist = Math.abs((snapFractions[i] ?? 0) - newHeightFraction);
        if (dist < minDist) {
          minDist = dist;
          nearestIndex = i;
        }
      }

      currentSnapIndexRef.current = nearestIndex;
      setCurrentSnapIndex(nearestIndex);
      setDragTranslateYSync(null);
      onSnapChange?.(nearestIndex);
    },
    [snapPoints, onClose, onSnapChange, setDragTranslateYSync]
  );

  // ── Keyboard handler ──────────────────────────────────────────────────────

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        // Cycle to next snap point; wraps from last back to first
        const nextIndex = (currentSnapIndexRef.current + 1) % snapPoints.length;
        currentSnapIndexRef.current = nextIndex;
        setCurrentSnapIndex(nextIndex);
        onSnapChange?.(nextIndex);
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        // Move to higher snap point (more expanded) if not already at max
        if (currentSnapIndexRef.current < snapPoints.length - 1) {
          const nextIndex = currentSnapIndexRef.current + 1;
          currentSnapIndexRef.current = nextIndex;
          setCurrentSnapIndex(nextIndex);
          onSnapChange?.(nextIndex);
        }
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        // Move to lower snap point (less expanded); close if already at minimum
        if (currentSnapIndexRef.current > 0) {
          const nextIndex = currentSnapIndexRef.current - 1;
          currentSnapIndexRef.current = nextIndex;
          setCurrentSnapIndex(nextIndex);
          onSnapChange?.(nextIndex);
        } else {
          onClose?.();
        }
      }
    },
    [snapPoints, onClose, onSnapChange]
  );

  // ── Handle props ──────────────────────────────────────────────────────────

  const handleProps = useMemo<BottomSheetContextValue["handleProps"]>(
    () => ({
      onPointerDown,
      onPointerUp,
      onKeyDown,
      tabIndex: 0,
      role: "button" as const,
      // Default label — the styled layer (Layer 3) or BottomSheetHeadless
      // overrides this with the sheet's aria-label
      "aria-label": "Drag to resize",
    }),
    [onPointerDown, onPointerUp, onKeyDown]
  );

  return {
    currentSnapIndex,
    isDragging,
    dragTranslateY,
    handleProps,
  };
}
