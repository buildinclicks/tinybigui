import type { AriaButtonProps } from "react-aria";
import type React from "react";

/**
 * FAB size types
 */
export type FABSize = "small" | "medium" | "large" | "extended";

/**
 * FAB color scheme
 */
export type FABColor = "primary" | "secondary" | "tertiary" | "surface";

/**
 * Material Design 3 FAB (Floating Action Button) Component Props
 *
 * High-emphasis button for primary screen action.
 * Supports 4 sizes: small (40px), medium (56px), large (96px), extended (variable width with text)
 *
 * ⚠️ IMPORTANT:
 * - Only ONE FAB per screen
 * - aria-label is REQUIRED (even for extended FAB with text)
 * - Use for primary constructive actions only (create, add, compose)
 * - NOT for destructive (delete), navigation (back), or secondary actions
 *
 * @example
 * ```tsx
 * // Standard FAB (medium)
 * <FAB aria-label="Create new item" icon={<IconAdd />} />
 *
 * // Small FAB
 * <FAB aria-label="Add photo" icon={<IconCamera />} size="small" />
 *
 * // Large FAB
 * <FAB aria-label="Compose" icon={<IconEdit />} size="large" />
 *
 * // Extended FAB (with text)
 * <FAB aria-label="Create new document" icon={<IconAdd />} size="extended">
 *   Create
 * </FAB>
 *
 * // Loading state
 * <FAB aria-label="Creating" icon={<IconAdd />} loading />
 *
 * // Secondary color
 * <FAB aria-label="Edit" icon={<IconEdit />} color="secondary" />
 * ```
 */
export interface FABProps extends AriaButtonProps {
  /**
   * FAB size variant
   * - small: 40×40px (24px icon)
   * - medium: 56×56px (24px icon) - default
   * - large: 96×96px (36px icon)
   * - extended: Variable width with text (24px icon)
   * @default 'medium'
   */
  size?: FABSize;

  /**
   * Color scheme
   * @default 'primary'
   */
  color?: FABColor;

  /**
   * Icon content (required).
   * Recommended sizes:
   * - small/medium/extended: 24x24px
   * - large: 36x36px
   */
  icon: React.ReactNode;

  /**
   * Text label (required for extended FAB, ignored for other sizes)
   */
  children?: React.ReactNode;

  /**
   * Mandatory accessible label for the FAB.
   * This is crucial for screen readers as FAB is icon-based.
   * Even extended FAB with text requires aria-label.
   */
  "aria-label": string;

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
   * Can be used for positioning (e.g., "fixed bottom-4 right-4")
   */
  className?: string;

  /**
   * HTML title attribute for tooltip
   */
  title?: string;

  /**
   * Mouse down handler (for ripple effect and custom handling)
   */
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
