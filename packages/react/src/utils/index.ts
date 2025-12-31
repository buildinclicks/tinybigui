/**
 * @tinybigui/react - Utilities
 *
 * Barrel export for all utility functions.
 * Provides a single import point for utilities used throughout the library.
 */

// Class name utilities
export { cn } from "./cn";

// Color utilities
export {
  getColorValue,
  getMD3Color,
  withOpacity,
  hexToRgb,
  rgbToHex,
  generateMD3Theme,
  applyStateLayer,
  STATE_LAYER_OPACITY,
  argbFromHex,
  hexFromArgb,
  type MD3ColorRole,
  type Theme,
} from "./colors";

// Typography utilities
export {
  getTypographyToken,
  getTypographyStyle,
  getFontFamily,
  getTypographyForElement,
  getTypographyClassName,
  getResponsiveTypography,
  remToPx,
  pxToRem,
  truncateText,
  TYPOGRAPHY_ELEMENT_MAP,
  TYPOGRAPHY_USAGE,
  type MD3TypographyScale,
  type MD3TypographySize,
  type MD3TypographyStyle,
  type TypographyProperty,
  type TypographyStyleObject,
} from "./typography";
