/**
 * @tinybigui/react
 * Material Design 3 components for React
 */

// Utilities
export {
  // Class name utilities
  cn,
  // Color utilities
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
  // Typography utilities
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
  // Types
  type MD3ColorRole,
  type Theme,
  type MD3TypographyScale,
  type MD3TypographySize,
  type MD3TypographyStyle,
  type TypographyProperty,
  type TypographyStyleObject,
} from "./utils";

// Components
export { Button } from "./components/Button";
export type { ButtonProps, ButtonVariant, ButtonColor, ButtonSize } from "./components/Button";

export { TextField } from "./components/TextField";
export type { TextFieldProps, TextFieldVariant, TextFieldSize } from "./components/TextField";

export { Checkbox } from "./components/Checkbox";
export type { CheckboxProps } from "./components/Checkbox";
