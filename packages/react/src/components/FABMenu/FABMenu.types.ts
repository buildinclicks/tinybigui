import type { PressEvent } from "react-aria";
import type React from "react";

/**
 * Direction in which FABMenu action items expand from the trigger.
 *
 * @default 'up'
 */
export type FABMenuDirection = "up" | "down" | "left" | "right";

/**
 * Color role for individual FABMenu action items.
 *
 * Matches the MD3 Expressive FAB color roles:
 * - Container variants: `primary-container` (default), `secondary-container`, `tertiary-container`
 * - Solid variants (M3 Expressive): `primary`, `secondary`, `tertiary`
 *
 * The state-layer color equals the icon/on-color per MD3 spec.
 *
 * @default 'primary-container'
 */
export type FABMenuItemColor =
  | "primary-container"
  | "secondary-container"
  | "tertiary-container"
  | "primary"
  | "secondary"
  | "tertiary";

/**
 * Props for an individual FABMenu action item (MD3 Expressive pill menu item).
 *
 * Each item renders as a full-rounded 56dp pill button with a leading icon
 * and an inline text label. `label` or `aria-label` must be provided.
 *
 * @example
 * ```tsx
 * <FABMenuItem
 *   icon={<IconEdit />}
 *   label="Edit"
 *   onPress={() => console.log('edit')}
 * />
 *
 * // Icon-only (requires aria-label)
 * <FABMenuItem icon={<IconEdit />} aria-label="Edit item" />
 * ```
 */
export interface FABMenuItemProps {
  /** Leading icon for the menu item. */
  icon: React.ReactNode;

  /**
   * Inline text label displayed inside the pill button.
   * Provides the accessible name when `aria-label` is not supplied.
   */
  label?: string;

  /**
   * Explicit accessible label for screen readers.
   * Required when `label` is not provided.
   * When both are present, `aria-label` takes precedence.
   */
  "aria-label"?: string;

  /** Handler called when the action item is pressed. */
  onPress?: (e: PressEvent) => void;

  /**
   * Color role for the menu item container.
   * Controls the background, text, and state-layer colors.
   *
   * @default 'primary-container'
   */
  color?: FABMenuItemColor;

  /**
   * Whether the action item is disabled.
   * @default false
   */
  isDisabled?: boolean;

  /** Additional CSS classes applied to the root pill button. */
  className?: string;
}

/**
 * Props for the headless FABMenu primitive (Layer 2).
 *
 * Manages open/close state, keyboard interactions, focus management,
 * and accessibility attributes without opinionated styling.
 *
 * Supports both controlled (`open` + `onOpenChange`) and uncontrolled
 * (`defaultOpen`) usage patterns.
 *
 * @example
 * ```tsx
 * // Uncontrolled
 * <FABMenuHeadless aria-label="Actions" direction="up">
 *   <FABMenuItem icon={<IconEdit />} label="Edit" />
 * </FABMenuHeadless>
 *
 * // Controlled
 * <FABMenuHeadless
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   aria-label="Quick actions"
 * >
 *   <FABMenuItem icon={<IconAdd />} label="Add" />
 * </FABMenuHeadless>
 * ```
 */
export interface FABMenuHeadlessProps {
  /**
   * Controlled open state.
   * When provided, the component becomes controlled and `onOpenChange`
   * must be used to update the state.
   */
  open?: boolean;

  /**
   * Default open state for uncontrolled usage.
   * @default false
   */
  defaultOpen?: boolean;

  /** Called when the open state changes (both controlled and uncontrolled). */
  onOpenChange?: (open: boolean) => void;

  /**
   * Direction in which action items expand from the trigger FAB.
   * @default 'up'
   */
  direction?: FABMenuDirection;

  /**
   * REQUIRED: Accessible label for the trigger FAB.
   * Describes the FAB menu purpose to screen readers.
   */
  "aria-label": string;

  /** Additional CSS classes for the root container. */
  className?: string;

  /** FABMenuItem children rendered as action items when the menu is open. */
  children?: React.ReactNode;
}

/**
 * Props for the styled FABMenu component (Layer 3).
 *
 * Extends the headless props. No additional required props at this layer.
 */
export type FABMenuProps = FABMenuHeadlessProps;

/**
 * Context value shared between FABMenu and its item descendants.
 *
 * Exposed via `FABMenuContext` so `FABMenuItem` components can read
 * the current menu state without prop drilling.
 */
export interface FABMenuContextValue {
  /** Whether the menu is currently open. */
  isOpen: boolean;

  /**
   * Whether the menu is currently playing the exit animation.
   * Items remain mounted during this phase so `animate-md-scale-out` can run.
   */
  isExiting: boolean;

  /** Direction in which action items expand. */
  direction: FABMenuDirection;

  /** Whether the user prefers reduced motion. */
  reducedMotion: boolean;

  /**
   * Total number of action items.
   * Used by `FABMenuItem` to compute reverse stagger delays during exit.
   */
  itemCount: number;
}
