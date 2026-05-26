"use client";

import { useCallback, useRef, useState } from "react";

import type { UseClockDialOptions, UseClockDialReturn } from "./TimePicker.types";

/**
 * Radius threshold ratio for distinguishing inner vs outer ring in 24h mode.
 * Pointer distance from center below this fraction of the dial radius selects inner ring.
 */
const INNER_RING_THRESHOLD_RATIO = 0.65;

/**
 * Converts a pointer position relative to the clock dial center
 * into an angle in degrees measured clockwise from 12 o'clock.
 */
function pointerToAngle(clientX: number, clientY: number, rect: DOMRect): number {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = clientX - centerX;
  const dy = -(clientY - centerY);
  const radians = Math.atan2(dx, dy);
  return ((radians * 180) / Math.PI + 360) % 360;
}

/**
 * Returns the distance from the pointer to the center of the dial, normalised
 * to the dial radius (0 = center, 1 = edge).
 */
function pointerDistanceRatio(clientX: number, clientY: number, rect: DOMRect): number {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const dx = clientX - centerX;
  const dy = clientY - centerY;
  const radius = rect.width / 2;
  return Math.sqrt(dx * dx + dy * dy) / radius;
}

/**
 * Snaps an angle to the nearest hour value (12 positions, 30° each).
 * Returns the hour value (1-12).
 */
function angleToHour12(degrees: number): number {
  const snapped = Math.round(degrees / 30) % 12;
  return snapped === 0 ? 12 : snapped;
}

/**
 * Snaps an angle + distance to the nearest 24h hour value (0-23).
 * Outer ring: 1-12, inner ring: 13-24 (with 0 replacing 24).
 */
function angleToHour24(degrees: number, isInner: boolean): number {
  const snapped = Math.round(degrees / 30) % 12;
  if (isInner) {
    return snapped === 0 ? 0 : snapped + 12;
  }
  return snapped === 0 ? 12 : snapped;
}

/**
 * Snaps an angle to the nearest minute value (60 positions, 6° each).
 * Respects minuteStep by rounding to the nearest step.
 */
function angleToMinute(degrees: number, step: number): number {
  const rawMinute = Math.round(degrees / 6) % 60;
  if (step <= 1) return rawMinute;
  return (Math.round(rawMinute / step) * step) % 60;
}

/**
 * Converts a selected value back to an angle for clock hand rendering.
 */
function valueToAngle(value: number, mode: "hour" | "minute"): number {
  if (mode === "hour") {
    return ((value % 12) * 30) % 360;
  }
  return (value * 6) % 360;
}

/**
 * Custom hook for clock dial interaction.
 * Converts pointer position to angular value selection.
 *
 * @param options - Configuration for the clock dial hook
 * @returns Props to spread on the dial container, hand angle, and interaction state
 *
 * @example
 * ```tsx
 * const { dialProps, handAngle, isDragging, isInnerRing } = useClockDial({
 *   selectionMode: 'hour',
 *   hourCycle: 12,
 *   onSelect: (value) => setHour(value),
 *   containerRef: dialRef,
 * });
 * ```
 */
export function useClockDial(options: UseClockDialOptions): UseClockDialReturn {
  const {
    selectionMode,
    hourCycle,
    onSelect,
    containerRef,
    isDisabled = false,
    minuteStep = 1,
  } = options;

  const [isDragging, setIsDragging] = useState(false);
  const [isInnerRing, setIsInnerRing] = useState(false);
  const [handAngle, setHandAngle] = useState(0);
  const activePointerIdRef = useRef<number | null>(null);

  const resolveValue = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const angle = pointerToAngle(clientX, clientY, rect);

      if (selectionMode === "hour") {
        if (hourCycle === 24) {
          const distRatio = pointerDistanceRatio(clientX, clientY, rect);
          const inner = distRatio < INNER_RING_THRESHOLD_RATIO;
          setIsInnerRing(inner);
          const hour = angleToHour24(angle, inner);
          setHandAngle(valueToAngle(hour, "hour"));
          onSelect?.(hour);
        } else {
          setIsInnerRing(false);
          const hour = angleToHour12(angle);
          setHandAngle(valueToAngle(hour, "hour"));
          onSelect?.(hour);
        }
      } else {
        setIsInnerRing(false);
        const minute = angleToMinute(angle, minuteStep);
        setHandAngle(valueToAngle(minute, "minute"));
        onSelect?.(minute);
      }
    },
    [selectionMode, hourCycle, onSelect, containerRef, minuteStep]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isDisabled) return;
      e.preventDefault();
      activePointerIdRef.current = e.pointerId;
      const target = e.currentTarget as HTMLDivElement;
      if (typeof target.setPointerCapture === "function") {
        target.setPointerCapture(e.pointerId);
      }
      setIsDragging(true);
      resolveValue(e.clientX, e.clientY);
    },
    [isDisabled, resolveValue]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || isDisabled) return;
      if (e.pointerId !== activePointerIdRef.current) return;
      resolveValue(e.clientX, e.clientY);
    },
    [isDragging, isDisabled, resolveValue]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (isDisabled) return;
      if (e.pointerId !== activePointerIdRef.current) return;
      const target = e.currentTarget as HTMLDivElement;
      if (typeof target.releasePointerCapture === "function") {
        target.releasePointerCapture(e.pointerId);
      }
      activePointerIdRef.current = null;
      setIsDragging(false);
    },
    [isDisabled]
  );

  const dialProps: React.HTMLAttributes<HTMLDivElement> = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    ...(isDragging ? { "data-dragging": "" } : {}),
  };

  return {
    dialProps,
    handAngle,
    isDragging,
    isInnerRing,
  };
}
