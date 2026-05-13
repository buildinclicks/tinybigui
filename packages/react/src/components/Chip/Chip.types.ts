import type React from "react";
import type { PressEvent } from "react-aria";

/**
 * The four MD3 chip types, each with distinct interaction semantics.
 *
 * - `assist` – triggers an action (e.g. "Set alarm")
 * - `filter` – toggles a filter on/off (`aria-pressed`)
 * - `input` – represents a value the user entered; can be removed
 * - `suggestion` – offers a contextual suggestion (acts like assist)
 */
export type ChipType = "assist" | "filter" | "input" | "suggestion";

/**
 * Surface style for Assist and Suggestion chips.
 *
 * - `tonal` – uses secondary-container fill (default)
 * - `elevated` – uses surface-container-low fill with elevation shadow
 *
 * @default 'tonal'
 */
export type ChipSurface = "tonal" | "elevated";

/**
 * Material Design 3 Chip Component Props
 *
 * Unified prop interface covering all four MD3 chip types.
 * Use the `type` discriminant to understand which props apply.
 *
 * @example
 * ```tsx
 * // Assist chip
 * <Chip type="assist" label="Set alarm" onPress={handlePress} />
 *
 * // Filter chip (controlled)
 * <Chip type="filter" label="Vegetarian" selected={isVeg} onSelectionChange={setVeg} />
 *
 * // Input chip
 * <Chip type="input" label="React" onRemove={() => removeTag('React')} />
 *
 * // Suggestion chip
 * <Chip type="suggestion" label="See photos" onPress={handlePress} />
 * ```
 */
export interface ChipProps {
  /**
   * Chip type — determines interaction model and ARIA semantics.
   */
  type: ChipType;

  /**
   * Visible label text. Also used as `aria-label` on Input chips.
   */
  label: string;

  /**
   * Surface style (Assist and Suggestion chips only).
   * @default 'tonal'
   */
  surface?: ChipSurface;

  /**
   * Controlled selected state (Filter chips only).
   */
  selected?: boolean;

  /**
   * Uncontrolled initial selected state (Filter chips only).
   */
  defaultSelected?: boolean;

  /**
   * Called when the selected state changes (Filter chips only).
   */
  onSelectionChange?: (selected: boolean) => void;

  /**
   * Called when the chip is pressed (Assist and Suggestion chips only).
   */
  onPress?: (e: PressEvent) => void;

  /**
   * Called when the chip is removed (Input chips only).
   */
  onRemove?: () => void;

  /**
   * Icon rendered before the label.
   */
  leadingIcon?: React.ReactNode;

  /**
   * Icon rendered after the label (Assist and Suggestion chips only).
   */
  trailingIcon?: React.ReactNode;

  /**
   * Disables all interaction on the chip.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Additional CSS classes (Tailwind).
   */
  className?: string;
}

/**
 * Props for the headless ChipHeadless component (Layer 2).
 *
 * Strips visual-only props (`surface`, `leadingIcon`, `trailingIcon`)
 * and accepts `children` for custom slot content.
 *
 * @example
 * ```tsx
 * <ChipHeadless type="filter" label="Dark mode" onSelectionChange={handleChange}>
 *   <MyCustomIcon />
 *   Dark mode
 * </ChipHeadless>
 * ```
 */
export interface ChipHeadlessProps {
  /**
   * Chip type — determines interaction model and ARIA semantics.
   */
  type: ChipType;

  /**
   * Visible label text. Also used as `aria-label` on Input chips.
   */
  label: string;

  /**
   * Controlled selected state (Filter chips only).
   */
  selected?: boolean;

  /**
   * Uncontrolled initial selected state (Filter chips only).
   */
  defaultSelected?: boolean;

  /**
   * Called when the selected state changes (Filter chips only).
   */
  onSelectionChange?: (selected: boolean) => void;

  /**
   * Called when the chip is pressed (Assist and Suggestion chips only).
   */
  onPress?: (e: PressEvent) => void;

  /**
   * Called when the chip is removed (Input chips only).
   */
  onRemove?: () => void;

  /**
   * Disables all interaction on the chip.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Additional CSS classes (Tailwind).
   */
  className?: string;

  /**
   * Slot content rendered inside the chip body (icons, label text, etc.).
   */
  children?: React.ReactNode;

  /**
   * Icon rendered inside the remove button (Input chips only).
   * Typically an ×/close SVG.
   */
  removeIcon?: React.ReactNode;

  /**
   * Additional CSS classes applied to the remove button (Input chips only).
   */
  removeButtonClassName?: string;

  /**
   * Mouse-down handler forwarded to the chip body button.
   * Used by the styled layer to trigger the ripple effect.
   */
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
}

/**
 * Props for the ChipSet container component.
 *
 * A semantic wrapper for a group of chips that provides layout and spacing.
 *
 * @example
 * ```tsx
 * <ChipSet>
 *   <Chip type="filter" label="React" />
 *   <Chip type="filter" label="TypeScript" />
 * </ChipSet>
 * ```
 */
export interface ChipSetProps {
  /**
   * Additional CSS classes (Tailwind).
   */
  className?: string;

  /**
   * Chip elements to render inside the set.
   */
  children: React.ReactNode;
}
