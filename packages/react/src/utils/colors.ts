/**
 * Color Utilities
 * 
 * Utilities for working with Material Design 3 color system.
 * Provides functions for color manipulation, CSS variable extraction,
 * and integration with material-color-utilities.
 */

import {
  argbFromHex,
  themeFromSourceColor,
  hexFromArgb,
  type Theme,
} from '@material/material-color-utilities';

/**
 * Material Design 3 color roles
 */
export type MD3ColorRole =
  | 'primary'
  | 'on-primary'
  | 'primary-container'
  | 'on-primary-container'
  | 'secondary'
  | 'on-secondary'
  | 'secondary-container'
  | 'on-secondary-container'
  | 'tertiary'
  | 'on-tertiary'
  | 'tertiary-container'
  | 'on-tertiary-container'
  | 'error'
  | 'on-error'
  | 'error-container'
  | 'on-error-container'
  | 'surface'
  | 'on-surface'
  | 'surface-variant'
  | 'on-surface-variant'
  | 'outline'
  | 'outline-variant'
  | 'background'
  | 'on-background';

/**
 * Get the computed value of a CSS variable
 * 
 * @param variable - CSS variable name (with or without `--` prefix)
 * @param element - Element to get computed style from (defaults to document root)
 * @returns The computed value of the CSS variable
 * 
 * @example
 * ```ts
 * const primaryColor = getColorValue('--md-sys-color-primary');
 * // Returns: '#6750a4'
 * 
 * const primaryColor = getColorValue('md-sys-color-primary');
 * // Also returns: '#6750a4'
 * ```
 */
export function getColorValue(
  variable: string,
  element: HTMLElement = document.documentElement
): string {
  const varName = variable.startsWith('--') ? variable : `--${variable}`;
  return getComputedStyle(element).getPropertyValue(varName).trim();
}

/**
 * Get a Material Design 3 color token value
 * 
 * @param role - MD3 color role name
 * @returns The hex color value
 * 
 * @example
 * ```ts
 * const primary = getMD3Color('primary');
 * // Returns: '#6750a4'
 * 
 * const onPrimary = getMD3Color('on-primary');
 * // Returns: '#ffffff'
 * ```
 */
export function getMD3Color(role: MD3ColorRole): string {
  return getColorValue(`--md-sys-color-${role}`);
}

/**
 * Add opacity to a hex color
 * 
 * @param color - Hex color string (with or without #)
 * @param opacity - Opacity value (0-1)
 * @returns Hex color with opacity (8-digit hex)
 * 
 * @example
 * ```ts
 * withOpacity('#6750a4', 0.5);
 * // Returns: '#6750a480'
 * 
 * withOpacity('6750a4', 0.12);
 * // Returns: '#6750a41f'
 * ```
 */
export function withOpacity(color: string, opacity: number): string {
  const hex = color.replace('#', '');
  const alpha = Math.round(Math.max(0, Math.min(1, opacity)) * 255)
    .toString(16)
    .padStart(2, '0');
  return `#${hex}${alpha}`;
}

/**
 * Convert hex color to RGB object
 * 
 * @param hex - Hex color string (with or without #)
 * @returns RGB object with r, g, b values (0-255)
 * 
 * @example
 * ```ts
 * hexToRgb('#6750a4');
 * // Returns: { r: 103, g: 80, b: 164 }
 * ```
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return { r, g, b };
}

/**
 * Convert RGB to hex color
 * 
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Hex color string
 * 
 * @example
 * ```ts
 * rgbToHex(103, 80, 164);
 * // Returns: '#6750a4'
 * ```
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.max(0, Math.min(255, Math.round(n))).toString(16);
    return hex.padStart(2, '0');
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Generate a complete Material Design 3 theme from a seed color
 * 
 * @param seedColor - Hex color to generate theme from
 * @returns Material Color Utilities Theme object
 * 
 * @example
 * ```ts
 * const theme = generateMD3Theme('#6750a4');
 * 
 * // Access light mode colors
 * const lightPrimary = hexFromArgb(theme.schemes.light.primary);
 * // Returns: '#6750a4'
 * 
 * // Access dark mode colors
 * const darkPrimary = hexFromArgb(theme.schemes.dark.primary);
 * // Returns: '#d0bcff'
 * ```
 */
export function generateMD3Theme(seedColor: string): Theme {
  const argb = argbFromHex(seedColor);
  return themeFromSourceColor(argb);
}

/**
 * Material Color Utilities type exports
 * 
 * Re-export commonly used types from material-color-utilities
 * for convenience and type safety.
 */
export type { Theme } from '@material/material-color-utilities';

/**
 * Material Color Utilities function exports
 * 
 * Re-export commonly used functions from material-color-utilities
 * for convenience.
 */
export { argbFromHex, hexFromArgb } from '@material/material-color-utilities';

/**
 * State layer opacity values (Material Design 3 spec)
 * 
 * These values are used for hover, focus, press, and drag states
 * in Material Design 3 components.
 * 
 * @see https://m3.material.io/foundations/interaction/states/state-layers
 */
export const STATE_LAYER_OPACITY = {
  hover: 0.08,
  focus: 0.12,
  press: 0.12,
  drag: 0.16,
} as const;

/**
 * Apply a state layer opacity to a color
 * 
 * @param color - Base hex color
 * @param state - State type ('hover' | 'focus' | 'press' | 'drag')
 * @returns Color with state layer opacity applied
 * 
 * @example
 * ```ts
 * applyStateLayer('#6750a4', 'hover');
 * // Returns: '#6750a414' (8% opacity)
 * 
 * applyStateLayer('#6750a4', 'focus');
 * // Returns: '#6750a41f' (12% opacity)
 * ```
 */
export function applyStateLayer(
  color: string,
  state: keyof typeof STATE_LAYER_OPACITY
): string {
  return withOpacity(color, STATE_LAYER_OPACITY[state]);
}

