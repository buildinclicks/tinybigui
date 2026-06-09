import type React from "react";

/**
 * MD3 Checkbox checkmark icon.
 *
 * Icon size: 18×18dp (fills the checkbox container per MD3 specs).
 * Mark stroke: 2dp with square caps, matching Material Web and Compose M3.
 *
 * Path coordinates align with `androidx.compose.material3.Checkbox` `drawCheck()`
 * when `ComposeMaterial3Flags.isCheckboxStylingFixEnabled` is true.
 *
 * @see https://m3.material.io/components/checkbox/specs
 *
 * @example
 * ```tsx
 * <span className="text-on-primary">
 *   <CheckboxCheckIcon />
 * </span>
 * ```
 */
export function CheckboxCheckIcon(): React.ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4.5 9L7.2 11.7L13.5 5.4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

/**
 * MD3 Checkbox indeterminate icon.
 *
 * A 10×2dp horizontal dash centered in the 18dp icon area (1dp corner radius),
 * matching Material Web's indeterminate mark dimensions.
 *
 * @see https://m3.material.io/components/checkbox/specs
 *
 * @example
 * ```tsx
 * <span className="text-on-primary">
 *   <CheckboxIndeterminateIcon />
 * </span>
 * ```
 */
export function CheckboxIndeterminateIcon(): React.ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <rect x="4" y="8" width="10" height="2" rx="1" fill="currentColor" />
    </svg>
  );
}
