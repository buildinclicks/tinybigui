import type { PressEvent } from "react-aria";
import type React from "react";

/**
 * Direction in which FABMenu action items expand from the trigger.
 *
 * @default 'up'
 */
export type FABMenuDirection = "up" | "down" | "left" | "right";

/**
 * Props for an individual FABMenu action item (mini FAB).
 *
 * Each item renders as a small FAB with an icon and optional label.
 * `aria-label` is required for accessibility since items are icon-based.
 *
 * @example
 * ```tsx
 * <FABMenuItem
 *   icon={<IconEdit />}
 *   label="Edit"
 *   aria-label="Edit item"
 *   onPress={() => console.log('edit')}
 * />
 * ```
 */
export interface FABMenuItemProps {
  /** Icon content for the mini FAB action item. */
  icon: React.ReactNode;

  /**
   * Optional text label displayed beside the mini FAB.
   * Acts as a tooltip or visible label depending on the styled layer.
   */
  label?: string;

  /** Handler called when the action item is pressed. */
  onPress?: (e: PressEvent) => void;

  /**
   * REQUIRED: Accessible label for screen readers.
   * Mandatory since action items are icon-based.
   */
  "aria-label": string;

  /**
   * Whether the action item is disabled.
   * @default false
   */
  isDisabled?: boolean;

  /** Additional CSS classes. */
  className?: string;
}

/**
 * Props for the headless FABMenu primitive (Layer 2).
 *
 * Manages open/close state, keyboard navigation, focus management,
 * and accessibility attributes without opinionated styling.
 *
 * Supports both controlled (`open` + `onOpenChange`) and uncontrolled
 * (`defaultOpen`) usage patterns.
 *
 * @example
 * ```tsx
 * // Uncontrolled
 * <FABMenuHeadless aria-label="Actions" direction="up">
 *   <FABMenuItem icon={<IconEdit />} aria-label="Edit" />
 * </FABMenuHeadless>
 *
 * // Controlled
 * <FABMenuHeadless
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   aria-label="Quick actions"
 * >
 *   <FABMenuItem icon={<IconAdd />} aria-label="Add" />
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
 * Extends the headless props — no additional required props at this layer.
 * Styling, variants, and CVA will be added when the styled layer is built.
 */
export interface FABMenuProps extends FABMenuHeadlessProps {
  /** Placeholder for future styled-layer extensions (e.g., variant, color). */
  _brand?: never;
}

/**
 * Context value shared between FABMenu and its item descendants.
 *
 * Exposed via `FABMenuContext` so `FABMenuItem` components can read
 * the current menu state without prop drilling.
 */
export interface FABMenuContextValue {
  /** Whether the menu is currently open. */
  isOpen: boolean;

  /** Direction in which action items expand. */
  direction: FABMenuDirection;

  /** Whether the user prefers reduced motion. */
  reducedMotion: boolean;
}
