/**
 * Typography Utilities
 *
 * Utilities for working with Material Design 3 typography system.
 * Provides type-safe access to typography tokens and helper functions
 * for applying complete text styles.
 */

import { getColorValue } from "./colors";

/**
 * Material Design 3 typography scales
 *
 * MD3 defines 5 categories of typography, each with 3 size variants.
 */
export type MD3TypographyScale = "display" | "headline" | "title" | "body" | "label";

/**
 * Typography size variants
 */
export type MD3TypographySize = "large" | "medium" | "small";

/**
 * Complete typography style name
 * Combination of scale and size (e.g., 'display-large', 'body-medium')
 */
export type MD3TypographyStyle =
  | "display-large"
  | "display-medium"
  | "display-small"
  | "headline-large"
  | "headline-medium"
  | "headline-small"
  | "title-large"
  | "title-medium"
  | "title-small"
  | "body-large"
  | "body-medium"
  | "body-small"
  | "label-large"
  | "label-medium"
  | "label-small";

/**
 * Typography token properties
 */
export type TypographyProperty = "size" | "line-height" | "weight" | "tracking";

/**
 * Typography style object returned by getTypographyStyle()
 */
export interface TypographyStyleObject {
  fontSize: string;
  lineHeight: string;
  fontWeight: string;
  letterSpacing: string;
  fontFamily?: string;
}

/**
 * Get a typography token value
 *
 * @param style - Typography style name (e.g., 'display-large', 'body-medium')
 * @param property - Property to retrieve ('size' | 'line-height' | 'weight' | 'tracking')
 * @returns The token value as a string
 *
 * @example
 * ```ts
 * getTypographyToken('display-large', 'size');
 * // Returns: '3.5625rem' (57px)
 *
 * getTypographyToken('body-medium', 'weight');
 * // Returns: '400'
 * ```
 */
export function getTypographyToken(
  style: MD3TypographyStyle,
  property: TypographyProperty
): string {
  return getColorValue(`--md-sys-typescale-${style}-${property}`);
}

/**
 * Get a complete typography style object
 *
 * Returns a style object with all typography properties that can be
 * spread directly into a React component's style prop.
 *
 * @param style - Typography style name
 * @param includeFontFamily - Whether to include font-family (default: false)
 * @returns Typography style object for React inline styles
 *
 * @example
 * ```tsx
 * const displayStyle = getTypographyStyle('display-large');
 * // Returns: {
 * //   fontSize: '3.5625rem',
 * //   lineHeight: '4rem',
 * //   fontWeight: '400',
 * //   letterSpacing: '-0.25px'
 * // }
 *
 * <h1 style={displayStyle}>Display Large Text</h1>
 * ```
 *
 * @example
 * ```tsx
 * // With font family
 * const bodyStyle = getTypographyStyle('body-medium', true);
 * // Returns: {
 * //   fontSize: '0.875rem',
 * //   lineHeight: '1.25rem',
 * //   fontWeight: '400',
 * //   letterSpacing: '0.25px',
 * //   fontFamily: 'system-ui, -apple-system, ...'
 * // }
 * ```
 */
export function getTypographyStyle(
  style: MD3TypographyStyle,
  includeFontFamily = false
): TypographyStyleObject {
  const styleObject: TypographyStyleObject = {
    fontSize: getTypographyToken(style, "size"),
    lineHeight: getTypographyToken(style, "line-height"),
    fontWeight: getTypographyToken(style, "weight"),
    letterSpacing: getTypographyToken(style, "tracking"),
  };

  if (includeFontFamily) {
    styleObject.fontFamily = getColorValue("--md-sys-typescale-font-family-plain");
  }

  return styleObject;
}

/**
 * Get font family token value
 *
 * @param variant - Font family variant ('plain' | 'brand')
 * @returns Font family stack
 *
 * @example
 * ```ts
 * getFontFamily('plain');
 * // Returns: 'system-ui, -apple-system, Segoe UI, Roboto, ...'
 *
 * getFontFamily('brand');
 * // Returns: Same as plain (can be customized via CSS variables)
 * ```
 */
export function getFontFamily(variant: "plain" | "brand" = "plain"): string {
  return getColorValue(`--md-sys-typescale-font-family-${variant}`);
}

/**
 * Typography scale recommendations for semantic HTML elements
 *
 * Maps HTML elements to recommended MD3 typography styles.
 * Based on Material Design 3 guidelines.
 */
export const TYPOGRAPHY_ELEMENT_MAP = {
  h1: "display-large",
  h2: "display-medium",
  h3: "headline-large",
  h4: "headline-medium",
  h5: "headline-small",
  h6: "title-large",
  p: "body-large",
  span: "body-medium",
  small: "body-small",
  button: "label-large",
  label: "label-medium",
  caption: "label-small",
} as const satisfies Record<string, MD3TypographyStyle>;

/**
 * Get recommended typography style for an HTML element
 *
 * @param element - HTML element tag name
 * @returns Recommended MD3 typography style
 *
 * @example
 * ```ts
 * getTypographyForElement('h1');
 * // Returns: 'display-large'
 *
 * getTypographyForElement('button');
 * // Returns: 'label-large'
 * ```
 */
export function getTypographyForElement(
  element: keyof typeof TYPOGRAPHY_ELEMENT_MAP
): MD3TypographyStyle {
  return TYPOGRAPHY_ELEMENT_MAP[element];
}

/**
 * Typography scale usage guidelines
 *
 * Provides semantic context for when to use each typography scale.
 */
export const TYPOGRAPHY_USAGE = {
  display: "Large, expressive text for hero sections and marketing",
  headline: "High-emphasis text for titles and important headings",
  title: "Medium-emphasis text for section headers and card titles",
  body: "Plain text for paragraphs, lists, and general content",
  label: "UI labels, buttons, tabs, and form elements",
} as const satisfies Record<MD3TypographyScale, string>;

/**
 * Create a typography CSS class name
 *
 * Generates a consistent class name for typography styles.
 * Useful for creating utility classes or component variants.
 *
 * @param style - Typography style name
 * @returns CSS class name string
 *
 * @example
 * ```ts
 * getTypographyClassName('display-large');
 * // Returns: 'text-display-large'
 *
 * getTypographyClassName('body-medium');
 * // Returns: 'text-body-medium'
 * ```
 */
export function getTypographyClassName(style: MD3TypographyStyle): string {
  return `text-${style}`;
}

/**
 * Responsive typography helper
 *
 * Creates a style object that adapts typography across breakpoints.
 *
 * @param mobile - Typography style for mobile screens
 * @param tablet - Typography style for tablet screens (optional)
 * @param desktop - Typography style for desktop screens (optional)
 * @returns Object with styles for different breakpoints
 *
 * @example
 * ```tsx
 * const responsiveTitle = getResponsiveTypography(
 *   'headline-small',
 *   'headline-medium',
 *   'headline-large'
 * );
 *
 * // Use with CSS-in-JS or styled-components
 * const Title = styled.h2`
 *   ${responsiveTitle.mobile}
 *
 *   @media (min-width: 768px) {
 *     ${responsiveTitle.tablet}
 *   }
 *
 *   @media (min-width: 1024px) {
 *     ${responsiveTitle.desktop}
 *   }
 * `;
 * ```
 */
export function getResponsiveTypography(
  mobile: MD3TypographyStyle,
  tablet?: MD3TypographyStyle,
  desktop?: MD3TypographyStyle
): {
  mobile: TypographyStyleObject;
  tablet?: TypographyStyleObject;
  desktop?: TypographyStyleObject;
} {
  return {
    mobile: getTypographyStyle(mobile),
    ...(tablet && { tablet: getTypographyStyle(tablet) }),
    ...(desktop && { desktop: getTypographyStyle(desktop) }),
  };
}

/**
 * Convert rem to pixels (assuming 16px base)
 *
 * @param rem - Rem value (with or without 'rem' suffix)
 * @returns Pixel value
 *
 * @example
 * ```ts
 * remToPx('1.5rem');
 * // Returns: 24
 *
 * remToPx('3.5625rem');
 * // Returns: 57
 * ```
 */
export function remToPx(rem: string): number {
  const remValue = parseFloat(rem.replace("rem", ""));
  return remValue * 16;
}

/**
 * Convert pixels to rem (assuming 16px base)
 *
 * @param px - Pixel value (with or without 'px' suffix)
 * @returns Rem value as string
 *
 * @example
 * ```ts
 * pxToRem(24);
 * // Returns: '1.5rem'
 *
 * pxToRem('57px');
 * // Returns: '3.5625rem'
 * ```
 */
export function pxToRem(px: number | string): string {
  const pxValue = typeof px === "string" ? parseFloat(px.replace("px", "")) : px;
  return `${pxValue / 16}rem`;
}

/**
 * Truncate text with ellipsis
 *
 * Returns CSS properties for single or multi-line text truncation.
 *
 * @param lines - Number of lines before truncation (1 for single-line)
 * @returns CSS properties object
 *
 * @example
 * ```tsx
 * // Single line truncation
 * const singleLine = truncateText(1);
 * <div style={singleLine}>Long text here...</div>
 *
 * // Multi-line truncation (3 lines)
 * const multiLine = truncateText(3);
 * <p style={multiLine}>Long paragraph text here...</p>
 * ```
 */
export function truncateText(lines = 1): React.CSSProperties {
  if (lines === 1) {
    return {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    };
  }

  return {
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
  };
}
