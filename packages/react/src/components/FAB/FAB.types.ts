import type { AriaButtonProps } from "react-aria";
import type React from "react";

/**
 * FAB size types — MD3 Expressive scale.
 *
 * | Value      | Height | Icon  | Corner | Notes                        |
 * |------------|--------|-------|--------|------------------------------|
 * | `fab`      | 56dp   | 24dp  | 16dp   | Default. Regular FAB.        |
 * | `medium`   | 80dp   | 28dp  | 20dp   | Medium FAB (M3 Expressive).  |
 * | `large`    | 96dp   | 36dp  | 28dp   | Large FAB.                   |
 * | `extended` | 56dp   | 24dp  | 16dp   | Extended FAB with text label.|
 * | `small`    | 40dp   | 24dp  | 12dp   | @deprecated — Use `fab`.     |
 *
 * @default 'fab'
 */
export type FABSize = "fab" | "medium" | "large" | "extended" | "small";

/**
 * FAB color styles — MD3 Expressive color roles.
 *
 * **Container styles (default set):**
 * - `primary-container` — bg-primary-container / text-on-primary-container (default)
 * - `secondary-container` — bg-secondary-container / text-on-secondary-container
 * - `tertiary-container` — bg-tertiary-container / text-on-tertiary-container
 *
 * **Solid styles (M3 Expressive):**
 * - `primary` — bg-primary / text-on-primary
 * - `secondary` — bg-secondary / text-on-secondary
 * - `tertiary` — bg-tertiary / text-on-tertiary
 *
 * **Deprecated:**
 * - `surface` — @deprecated Use `primary-container`. Maps to surface-container-high.
 *
 * @default 'primary-container'
 */
export type FABColor =
  | "primary-container"
  | "secondary-container"
  | "tertiary-container"
  | "primary"
  | "secondary"
  | "tertiary"
  | "surface";

/**
 * Material Design 3 FAB (Floating Action Button) Component Props
 *
 * High-emphasis button for the primary screen action.
 * Implements the MD3 Expressive FAB spec with a slot-based architecture
 * matching Button and Switch for consistent interaction state handling.
 *
 * @example
 * ```tsx
 * // Default FAB (56dp)
 * <FAB aria-label="Create" icon={<IconAdd />} />
 *
 * // Medium FAB (80dp, M3 Expressive)
 * <FAB aria-label="Create" icon={<IconAdd />} size="medium" />
 *
 * // Large FAB (96dp)
 * <FAB aria-label="Compose" icon={<IconEdit />} size="large" />
 *
 * // Extended FAB (with text label)
 * <FAB aria-label="Create document" icon={<IconAdd />} size="extended">
 *   Create
 * </FAB>
 *
 * // Solid primary color (M3 Expressive)
 * <FAB aria-label="Add" icon={<IconAdd />} color="primary" />
 *
 * // Loading state
 * <FAB aria-label="Creating" icon={<IconAdd />} loading />
 * ```
 */
export interface FABProps extends AriaButtonProps {
  /**
   * FAB size variant.
   *
   * - `fab` (56dp) — Default. Standard FAB.
   * - `medium` (80dp) — Medium FAB. M3 Expressive. Previously 56dp; now remapped.
   * - `large` (96dp) — Large FAB.
   * - `extended` (56dp height) — Extended FAB with icon and text label.
   * - `small` (40dp) — @deprecated. Use `fab` instead.
   *
   * @default 'fab'
   */
  size?: FABSize;

  /**
   * Color style for the FAB.
   *
   * - `primary-container` — Default. bg-primary-container / text-on-primary-container.
   * - `secondary-container` — bg-secondary-container / text-on-secondary-container.
   * - `tertiary-container` — bg-tertiary-container / text-on-tertiary-container.
   * - `primary` — Solid. bg-primary / text-on-primary (M3 Expressive).
   * - `secondary` — Solid. bg-secondary / text-on-secondary (M3 Expressive).
   * - `tertiary` — Solid. bg-tertiary / text-on-tertiary (M3 Expressive).
   * - `surface` — @deprecated. Use `primary-container`.
   *
   * @default 'primary-container'
   */
  color?: FABColor;

  /**
   * Icon content (required).
   * Recommended icon sizes per variant:
   * - `fab` / `extended` / `small`: 24×24px
   * - `medium`: 28×28px
   * - `large`: 36×36px
   */
  icon: React.ReactNode;

  /**
   * Text label — only rendered for `size="extended"`.
   */
  children?: React.ReactNode;

  /**
   * Mandatory accessible label for all FAB sizes.
   * Required even for extended FABs that have visible text.
   */
  "aria-label": string;

  /**
   * Shows a loading spinner and disables interaction.
   * @default false
   */
  loading?: boolean;

  /**
   * Disables the MD3 ripple press-feedback animation.
   * @default false
   */
  disableRipple?: boolean;

  /**
   * Additional Tailwind classes — commonly used for positioning
   * (e.g. `className="fixed bottom-4 right-4"`).
   */
  className?: string;

  /**
   * HTML title attribute for tooltip.
   */
  title?: string;

  /**
   * Mouse down handler (merged with the internal ripple handler).
   */
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;

  /**
   * Tab index for keyboard navigation.
   * @default 0
   */
  tabIndex?: number | undefined;

  /**
   * Button type attribute.
   * @default 'button'
   */
  type?: "button" | "submit" | "reset";
}
