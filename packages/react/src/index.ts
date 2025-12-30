/**
 * @tinybigui/react
 * Material Design 3 components for React
 */

// Utilities
export { cn } from './utils/cn';
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
} from './utils/colors';
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
} from './utils/typography';

// Components will be exported here as they're built
// export { Button } from './components/Button';

