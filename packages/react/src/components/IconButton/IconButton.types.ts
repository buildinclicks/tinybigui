import type { AriaButtonProps } from "react-aria";
import type React from "react";

/**
 * IconButton variant types (MD3 specification)
 */
export type IconButtonVariant = "standard" | "filled" | "tonal" | "outlined";

/**
 * Color scheme
 */
export type IconButtonColor = "primary" | "secondary" | "tertiary" | "error";

/**
 * IconButton sizes (square dimensions)
 */
export type IconButtonSize = "small" | "medium" | "large";

/**
 * Material Design 3 IconButton Component Props
 *
 * Icon-only button component with 4 variants and mandatory accessibility.
 *
 * **Key Features:**
 * - 4 variants: standard, filled, tonal, outlined
 * - Icon only (no text content)
 * - Circular shape (MD3 specification)
 * - Mandatory `aria-label` for accessibility
 * - Toggle support with `selected` prop
 * - 48×48px minimum touch target
 *
 * @example
 * ```tsx
 * // Standard icon button
 * <IconButton aria-label="Delete" variant="standard">
 *   <IconDelete />
 * </IconButton>
 *
 * // Filled with color
 * <IconButton aria-label="Favorite" variant="filled" color="error">
 *   <IconHeart />
 * </IconButton>
 *
 * // Toggle button
 * <IconButton
 *   aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
 *   selected={isFavorite}
 *   onPress={() => setIsFavorite(!isFavorite)}
 * >
 *   {isFavorite ? <IconStarFilled /> : <IconStarOutline />}
 * </IconButton>
 *
 * // Disabled
 * <IconButton aria-label="Edit" isDisabled>
 *   <IconEdit />
 * </IconButton>
 * ```
 */
export interface IconButtonProps extends AriaButtonProps {
  /**
   * Button variant
   * @default 'standard'
   */
  variant?: IconButtonVariant;

  /**
   * Color scheme
   * @default 'primary'
   */
  color?: IconButtonColor;

  /**
   * Size variant
   * @default 'medium'
   */
  size?: IconButtonSize;

  /**
   * Icon content (React node). Recommended size:
   * - small: 20×20px
   * - medium: 24×24px
   * - large: 28×28px
   */
  children: React.ReactNode;

  /**
   * Toggle state (for toggle buttons)
   * When true, button shows selected state
   * @default false
   */
  selected?: boolean;

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
   * HTML title attribute for tooltip
   * Recommended for better UX on desktop
   */
  title?: string;

  /**
   * Mouse down handler (for ripple effect and custom handling)
   */
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * REQUIRED: Accessible label for screen readers
   * Since IconButton has no visible text, this is mandatory
   *
   * @example
   * aria-label="Delete item"
   * aria-label="Add to favorites"
   * aria-label="Close dialog"
   */
  "aria-label": string; // Make it required by removing the optional marker
}
