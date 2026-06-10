import type { PressEvent } from "react-aria";

/**
 * Split Button variant types (Material Design 3 Expressive).
 *
 * Split buttons support elevated, filled, tonal, and outlined variants,
 * mirroring the standard Button color schemes per the MD3 Expressive spec.
 *
 * @see https://m3.material.io/components/split-button/specs
 */
export type SplitButtonVariant = "elevated" | "filled" | "tonal" | "outlined";

/**
 * Split Button size options (MD3 Expressive size scale).
 *
 * | Token | Height | Typography         |
 * |-------|--------|--------------------|
 * | xs    | 32dp   | Label Large        |
 * | sm    | 40dp   | Label Large        |
 * | md    | 56dp   | Title Medium       |
 * | lg    | 96dp   | Headline Small     |
 * | xl    | 136dp  | Headline Large     |
 *
 * @default 'sm'
 */
export type SplitButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Represents a single item in the split button dropdown menu.
 *
 * @example
 * ```tsx
 * const items: SplitButtonMenuItem[] = [
 *   { label: 'Save as PDF', onAction: () => savePDF() },
 *   { label: 'Save as PNG', onAction: () => savePNG(), isDisabled: true },
 * ]
 * ```
 */
export interface SplitButtonMenuItem {
  /** Display label for the menu item. */
  label: string;
  /** Callback invoked when the menu item is selected. */
  onAction: () => void;
  /**
   * Whether the menu item is disabled.
   * @default false
   */
  isDisabled?: boolean;
}

/**
 * Props for the headless `SplitButtonHeadless` primitive (Layer 2).
 *
 * A Split Button groups a leading action button with a trailing dropdown
 * trigger that reveals secondary actions in a menu. Both segments are
 * independently focusable and accessible.
 *
 * @example
 * ```tsx
 * <SplitButtonHeadless
 *   primaryLabel="Save"
 *   onPrimaryAction={() => save()}
 *   items={[
 *     { label: 'Save as PDF', onAction: () => savePDF() },
 *     { label: 'Save as PNG', onAction: () => savePNG() },
 *   ]}
 * />
 * ```
 */
export interface SplitButtonHeadlessProps {
  /**
   * Visual variant of the split button.
   * @default 'filled'
   */
  variant?: SplitButtonVariant;

  /**
   * Size of the split button per the MD3 Expressive size scale.
   * @default 'sm'
   */
  size?: SplitButtonSize;

  /** Label text displayed in the leading action segment. */
  primaryLabel: string;

  /** Callback invoked when the leading action segment is pressed. */
  onPrimaryAction: (e: PressEvent) => void;

  /** Menu items displayed in the dropdown when the trailing trigger is activated. */
  items: SplitButtonMenuItem[];

  /**
   * Whether both segments are disabled.
   * @default false
   */
  isDisabled?: boolean;

  /** Accessible label for the split button group container. */
  "aria-label"?: string;

  /** Additional CSS classes applied to the root element. */
  className?: string;
}

/**
 * Props for the styled `SplitButton` component (Layer 3).
 *
 * Extends the headless props with identical API surface; the styled layer
 * applies MD3 Expressive visual tokens and CVA variants on top of the
 * headless primitive.
 */
export type SplitButtonProps = SplitButtonHeadlessProps;
