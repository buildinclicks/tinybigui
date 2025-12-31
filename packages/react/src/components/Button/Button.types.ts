import type React from "react";
import type { AriaButtonProps } from "react-aria";

/**
 * Button variant types (Material Design 3)
 */
export type ButtonVariant = "filled" | "outlined" | "tonal" | "elevated" | "text";

/**
 * Button color schemes (Material Design 3 color roles)
 */
export type ButtonColor = "primary" | "secondary" | "tertiary" | "error";

/**
 * Button sizes
 */
export type ButtonSize = "small" | "medium" | "large";

/**
 * Material Design 3 Button Component Props
 *
 * Built on React Aria for world-class accessibility.
 * Supports 5 variants: filled, outlined, tonal, elevated, text
 * Implementation uses CVA + Tailwind CSS classes mapped to MD3 tokens.
 *
 * @example
 * ```tsx
 * // Filled button (default)
 * <Button variant="filled" color="primary">
 *   Click me
 * </Button>
 *
 * // With icon
 * <Button variant="tonal" icon={<IconAdd />}>
 *   Add Item
 * </Button>
 *
 * // Loading state
 * <Button variant="elevated" loading>
 *   Saving...
 * </Button>
 *
 * // Disabled
 * <Button variant="outlined" isDisabled>
 *   Disabled
 * </Button>
 *
 * // Headless version (custom styling)
 * <ButtonHeadless className="my-custom-styles">
 *   Click me
 * </ButtonHeadless>
 * ```
 */
export interface ButtonProps
  extends
    AriaButtonProps,
    Omit<React.HTMLAttributes<HTMLButtonElement>, keyof AriaButtonProps | "children"> {
  /**
   * Button variant
   * @default 'filled'
   */
  variant?: ButtonVariant;

  /**
   * Color scheme
   * @default 'primary'
   */
  color?: ButtonColor;

  /**
   * Size variant
   * @default 'medium'
   */
  size?: ButtonSize;

  /**
   * Leading icon (before text)
   */
  icon?: React.ReactNode;

  /**
   * Trailing icon (after text)
   */
  trailingIcon?: React.ReactNode;

  /**
   * Button content (text)
   */
  children: React.ReactNode;

  /**
   * Full width button (spans container)
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Loading state - shows spinner, disables interaction
   * @default false
   */
  loading?: boolean;

  /**
   * Disable ripple effect
   * @default false
   */
  disableRipple?: boolean;

  /**
   * Additional CSS classes (Tailwind)
   */
  className?: string;

  /**
   * Tab index for keyboard navigation
   * @default 0
   */
  tabIndex?: number;

  /**
   * Button type attribute
   * @default 'button'
   */
  type?: "button" | "submit" | "reset";
}

/**
 * Props for the headless Button component
 * Extends AriaButtonProps for accessibility
 */
export interface ButtonHeadlessProps extends AriaButtonProps {
  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Button content
   */
  children: React.ReactNode;

  /**
   * Tab index for keyboard navigation
   * @default 0
   */
  tabIndex?: number;

  /**
   * Mouse down handler (for ripple effect)
   */
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
