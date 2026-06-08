import type React from "react";
import type { AriaButtonProps } from "react-aria";

/**
 * Button variant types (Material Design 3)
 */
export type ButtonVariant = "filled" | "outlined" | "tonal" | "elevated" | "text";

/**
 * Button sizes (Material Design 3)
 */
export type ButtonSize = "small" | "medium" | "large";

/**
 * Material Design 3 Button Component Props
 *
 * Built on React Aria for world-class accessibility.
 * Supports 5 strict MD3 variants: filled, outlined, tonal, elevated, text.
 * Each variant uses its spec-defined color roles — no color override prop.
 *
 * Interaction states (hover, focus, press, disabled) are managed via
 * React Aria hooks and expressed as data-* attributes on the root element,
 * consumed by slot classes via group-data-[x]/button selectors.
 *
 * @example
 * ```tsx
 * // Filled button (default, highest emphasis)
 * <Button variant="filled">Save</Button>
 *
 * // Outlined button (medium emphasis)
 * <Button variant="outlined">Cancel</Button>
 *
 * // Tonal button (secondary emphasis)
 * <Button variant="tonal">Learn more</Button>
 *
 * // With icon (MD3 spec: 18px × 18px)
 * <Button variant="filled" icon={<IconAdd className="h-[18px] w-[18px]" />}>
 *   Add Item
 * </Button>
 *
 * // Loading state
 * <Button variant="elevated" loading>Saving...</Button>
 *
 * // Disabled
 * <Button variant="outlined" isDisabled>Disabled</Button>
 *
 * // Headless version (custom styling)
 * <ButtonHeadless className="my-custom-styles">Click me</ButtonHeadless>
 * ```
 */
export interface ButtonProps
  extends
    AriaButtonProps,
    Omit<React.HTMLAttributes<HTMLButtonElement>, keyof AriaButtonProps | "children"> {
  /**
   * Button variant (MD3 specification).
   * Determines visual emphasis and color roles.
   * @default 'filled'
   */
  variant?: ButtonVariant;

  /**
   * Size variant.
   * MD3 heights: small=32dp, medium=40dp, large=56dp
   * @default 'medium'
   */
  size?: ButtonSize;

  /**
   * Leading icon (before label text).
   *
   * MD3 Specification: Icons must be 18px × 18px.
   *
   * @example
   * ```tsx
   * <Button icon={<IconAdd className="h-[18px] w-[18px]" />}>
   *   Add Item
   * </Button>
   * ```
   */
  icon?: React.ReactNode;

  /**
   * Trailing icon (after label text).
   *
   * MD3 Specification: Icons must be 18px × 18px.
   *
   * @example
   * ```tsx
   * <Button trailingIcon={<IconArrow className="h-[18px] w-[18px]" />}>
   *   Continue
   * </Button>
   * ```
   */
  trailingIcon?: React.ReactNode;

  /**
   * Button label content.
   */
  children: React.ReactNode;

  /**
   * Full width button (spans container width).
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Loading state — shows spinner and disables interaction.
   * The button remains in the DOM as disabled while loading.
   * @default false
   */
  loading?: boolean;

  /**
   * Disable the ripple effect on press.
   * @default false
   */
  disableRipple?: boolean;

  /**
   * Additional Tailwind CSS classes applied to the root element.
   */
  className?: string;

  /**
   * Tab index for keyboard navigation.
   * @default 0
   */
  tabIndex?: number;

  /**
   * Button type attribute.
   * @default 'button'
   */
  type?: "button" | "submit" | "reset";
}

/**
 * Props for the headless Button component.
 * Extends AriaButtonProps for accessibility primitives.
 */
export interface ButtonHeadlessProps extends AriaButtonProps {
  /**
   * Additional CSS classes.
   */
  className?: string;

  /**
   * Button content.
   */
  children: React.ReactNode;

  /**
   * Tab index for keyboard navigation.
   * @default 0
   */
  tabIndex?: number;

  /**
   * Mouse down handler (for ripple effect).
   */
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
