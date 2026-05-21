"use client";

import { useCallback, useRef, useState } from "react";

import type { TimeInputFieldProps } from "./TimePicker.types";

/**
 * Formats a numeric value as a two-digit string with leading zero.
 */
function formatValue(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * Headless TimeInputField (Layer 2)
 *
 * An individual time input field with `role="spinbutton"` semantics.
 * Supports direct numeric keyboard entry, Arrow Up/Down increment/decrement,
 * wrapping at boundaries, auto-advance after two digits, and validation on blur.
 *
 * This is a headless component — it provides behavior, ARIA semantics, and
 * data attributes only. No styling classes are applied.
 *
 * @internal
 */
export function TimeInputField({
  field,
  value,
  onChange,
  onFocus,
  onBlur,
  onAutoAdvance,
  min,
  max,
  isDisabled = false,
  className,
}: TimeInputFieldProps): JSX.Element {
  const [isFocused, setIsFocused] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const bufferRef = useRef<string>("");
  const bufferTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const label = field === "hour" ? "Hour" : "Minute";

  const clamp = useCallback((val: number): number => Math.max(min, Math.min(max, val)), [min, max]);

  const commitBuffer = useCallback(() => {
    const buffer = bufferRef.current;
    if (buffer.length > 0) {
      const parsed = parseInt(buffer, 10);
      const clamped = clamp(parsed);
      onChange(clamped);
      setIsInvalid(parsed < min || parsed > max);
      bufferRef.current = "";
    }
  }, [clamp, min, max, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (isDisabled) return;

      if (e.key === "ArrowUp") {
        e.preventDefault();
        bufferRef.current = "";
        const next = value >= max ? min : value + 1;
        onChange(next);
        setIsInvalid(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        bufferRef.current = "";
        const next = value <= min ? max : value - 1;
        onChange(next);
        setIsInvalid(false);
      } else if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        if (bufferTimerRef.current !== null) {
          clearTimeout(bufferTimerRef.current);
        }

        bufferRef.current += e.key;
        const parsed = parseInt(bufferRef.current, 10);

        if (bufferRef.current.length >= 2) {
          const clamped = clamp(parsed);
          onChange(clamped);
          setIsInvalid(parsed < min || parsed > max);
          bufferRef.current = "";
          onAutoAdvance?.();
        } else {
          onChange(parsed);
          setIsInvalid(false);
          bufferTimerRef.current = setTimeout(() => {
            commitBuffer();
          }, 1000);
        }
      }
    },
    [isDisabled, value, min, max, onChange, onAutoAdvance, clamp, commitBuffer]
  );

  const handleFocus = useCallback(() => {
    if (isDisabled) return;
    setIsFocused(true);
    bufferRef.current = "";
    onFocus?.();
  }, [isDisabled, onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    commitBuffer();
    const clamped = clamp(value);
    if (clamped !== value) {
      onChange(clamped);
    }
    setIsInvalid(value < min || value > max);
    onBlur?.();
  }, [value, min, max, clamp, onChange, commitBuffer, onBlur]);

  return (
    <div
      role="spinbutton"
      tabIndex={isDisabled ? -1 : 0}
      aria-label={label}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-disabled={isDisabled || undefined}
      aria-invalid={isInvalid || undefined}
      className={className}
      data-time-input-field={field}
      {...(isFocused ? { "data-focused": "" } : {})}
      {...(isInvalid ? { "data-invalid": "" } : {})}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <span data-value>{formatValue(value)}</span>
      <span data-supporting-text>{label}</span>
    </div>
  );
}

TimeInputField.displayName = "TimeInputField";
