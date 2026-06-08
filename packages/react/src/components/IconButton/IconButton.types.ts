import type { AriaButtonProps } from "react-aria";
import type React from "react";

/**
 * IconButton variant types (MD3 specification)
 */
export type IconButtonVariant = "standard" | "filled" | "tonal" | "outlined";

/**
 * Color scheme (MD3 color roles)
 */
export type IconButtonColor = "primary" | "secondary" | "tertiary" | "error";

/**
 * Icon button sizes — M3 Expressive 5-tier system.
 *
 * Container heights (dp → px):
 * - xsmall: 32dp
 * - small:  40dp
 * - medium: 56dp (default)
 * - large:  96dp
 * - xlarge: 136dp
 */
export type IconButtonSize = "xsmall" | "small" | "medium" | "large" | "xlarge";

/**
 * Width variant — adjusts container width relative to height.
 * - narrow: narrower than height
 * - default: same width as height (square container)
 * - wide: wider than height
 */
export type IconButtonWidth = "narrow" | "default" | "wide";

/**
 * Shape variant — controls corner rounding.
 * - round: fully circular (rounded-full)
 * - square: size-tiered corner radius (MD3 shape scale)
 */
export type IconButtonShape = "round" | "square";

/**
 * Material Design 3 Expressive IconButton Component Props
 *
 * Icon-only button component following the M3 Expressive spec with:
 * - 5 sizes: xsmall, small, medium (default), large, xlarge
 * - 3 width options: narrow, default, wide
 * - 2 shapes: round (circular), square (corner-radius scale)
 * - Press shape-morph: corners tighten on press when `shape="round"`
 * - Toggle support: `selected` + `selectedIcon`
 * - 4 variants: standard, filled, tonal, outlined
 * - Mandatory `aria-label` for accessibility
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
 * // Toggle button with selectedIcon
 * <IconButton
 *   aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
 *   selected={isFavorite}
 *   onPress={() => setIsFavorite(!isFavorite)}
 *   selectedIcon={<IconStarFilled />}
 * >
 *   <IconStarOutline />
 * </IconButton>
 *
 * // Large square shape
 * <IconButton aria-label="Settings" size="large" shape="square">
 *   <IconSettings />
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
   * Size tier (M3 Expressive 5-tier system)
   * @default 'medium'
   */
  size?: IconButtonSize;

  /**
   * Container width relative to height.
   * - `narrow`: slimmer than the container height
   * - `default`: square container (width = height)
   * - `wide`: wider than the container height
   *
   * @default 'default'
   */
  width?: IconButtonWidth;

  /**
   * Corner shape.
   * - `round`: fully circular (pill-shaped)
   * - `square`: size-tiered corner radius from the MD3 shape scale
   *
   * Applies a press shape-morph (corners tighten on press, spring back on release).
   *
   * @default 'round'
   */
  shape?: IconButtonShape;

  /**
   * Icon content. Recommended icon sizes per container size:
   * - xsmall: 20×20px
   * - small / medium: 24×24px
   * - large: 32×32px
   * - xlarge: 40×40px
   */
  children: React.ReactNode;

  /**
   * Icon to display when `selected` is `true`.
   * When provided with a `selected` prop the button becomes a toggle button.
   * If omitted, `children` is shown in both states.
   */
  selectedIcon?: React.ReactNode;

  /**
   * Toggle state.
   * When defined (even as `false`) the button behaves as a toggle button and
   * `aria-pressed` is set.
   * @default undefined
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
   * Value string used by ButtonGroup context for selection tracking and
   * shape-morph logic in connected groups. Required when the IconButton is
   * inside a `<ButtonGroup selectionMode="...">`.
   */
  value?: string;

  /**
   * HTML title attribute for tooltip.
   * Recommended for better UX on desktop.
   */
  title?: string;

  /**
   * Mouse down handler (for ripple effect and custom handling)
   */
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * REQUIRED: Accessible label for screen readers.
   * Since IconButton has no visible text, this is mandatory.
   *
   * @example
   * aria-label="Delete item"
   * aria-label="Add to favorites"
   * aria-label="Close dialog"
   */
  "aria-label": string;
}
