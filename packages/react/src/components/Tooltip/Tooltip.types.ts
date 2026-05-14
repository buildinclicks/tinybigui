import type { ReactNode, RefObject } from "react";

/**
 * The two MD3 tooltip variants.
 *
 * - `plain` – single-line text label, no title or action
 * - `rich` – multi-line with optional title and action button
 */
export type TooltipVariant = "plain" | "rich";

/**
 * Preferred placement of the tooltip relative to its trigger.
 *
 * React Aria's `useOverlayPosition` will automatically flip to the opposite
 * side if the preferred placement would overflow the viewport.
 *
 * @default 'top'
 */
export type TooltipPlacement = "top" | "bottom" | "left" | "right";

/**
 * Props for `TooltipTriggerHeadless` (Layer 2 trigger wrapper).
 *
 * Expects exactly two children: the interactive trigger element and the
 * tooltip overlay element (typically `TooltipOverlayHeadless`).
 *
 * @example
 * ```tsx
 * <TooltipTriggerHeadless delay={300} onOpenChange={setOpen}>
 *   <button>Hover me</button>
 *   <TooltipOverlayHeadless placement="top">Save</TooltipOverlayHeadless>
 * </TooltipTriggerHeadless>
 * ```
 */
export interface TooltipTriggerProps {
  /** [trigger element, tooltip element] */
  children: [ReactNode, ReactNode];
  /**
   * Hover delay in ms before the tooltip opens.
   * @default 300
   */
  delay?: number;
  /** When true, the tooltip will not open. */
  isDisabled?: boolean;
  /** Controlled open state. */
  isOpen?: boolean;
  /**
   * Uncontrolled initial open state.
   * @default false
   */
  defaultOpen?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (isOpen: boolean) => void;
  /**
   * Force-mount the overlay in the DOM even when `state.isOpen` is false.
   * Used by `TooltipTrigger` to keep the overlay alive during the exit animation
   * without feeding a controlled `isOpen=true` back into React Aria's state
   * machine (which would cause an open/close conflict and infinite flicker).
   * @default false
   */
  forceMount?: boolean;
}

/**
 * Props for the plain `Tooltip` styled component (Layer 3).
 *
 * @example
 * ```tsx
 * <Tooltip placement="bottom">Save file</Tooltip>
 * ```
 */
export interface TooltipProps {
  /** Tooltip content — plain text for plain variant, ReactNode for rich variant. */
  children: ReactNode;
  /** Additional Tailwind CSS classes. */
  className?: string;
  /**
   * Preferred placement relative to the trigger.
   * @default 'top'
   */
  placement?: TooltipPlacement;
}

/**
 * Props for the `RichTooltip` styled component (Layer 3).
 *
 * Rich tooltips support an optional title, multi-line supporting text, and an
 * optional action button per MD3 specification.
 *
 * @example
 * ```tsx
 * <RichTooltip
 *   title="Add to list"
 *   action={<Button variant="text">Learn more</Button>}
 * >
 *   Saved items appear in your personal list.
 * </RichTooltip>
 * ```
 */
export interface RichTooltipProps {
  /** Optional title shown above the supporting text. */
  title?: string;
  /** Supporting text content. */
  children: ReactNode;
  /** Optional action element (typically a text Button). */
  action?: ReactNode;
  /** Additional Tailwind CSS classes. */
  className?: string;
  /**
   * Preferred placement relative to the trigger.
   * @default 'top'
   */
  placement?: TooltipPlacement;
}

/**
 * Props consumed by `TooltipOverlayHeadless` (Layer 2 overlay).
 *
 * `tooltipProps` is the intermediate prop object returned by
 * `useTooltipTrigger` — it carries the `id` and `role` that `useTooltip`
 * needs to wire `aria-describedby` on the trigger.
 *
 * `triggerRef`, `placement`, and `offset` are injected by
 * `TooltipTriggerHeadless` via `cloneElement` and drive `useOverlayPosition`.
 *
 * @example
 * ```tsx
 * // TooltipTriggerHeadless injects tooltipProps + triggerRef automatically.
 * <TooltipOverlayHeadless placement="top">
 *   Save file
 * </TooltipOverlayHeadless>
 * ```
 */
export interface TooltipHeadlessProps {
  /** Intermediate props from `useTooltipTrigger` (id + role). Injected by the trigger. */
  tooltipProps: Record<string, unknown>;
  /** Additional Tailwind CSS classes on the overlay container. */
  className?: string;
  /** Tooltip content. */
  children: ReactNode;
  /** Trigger element ref for overlay positioning. Injected by the trigger. */
  triggerRef?: RefObject<Element | null>;
  /**
   * Preferred placement relative to the trigger.
   * @default 'top'
   */
  placement?: TooltipPlacement;
  /**
   * Distance in pixels between the trigger and the tooltip.
   * @default 4
   */
  offset?: number;
  /** Called when the pointer enters the overlay surface. */
  onPointerEnter?: () => void;
  /** Called when the pointer leaves the overlay surface. */
  onPointerLeave?: () => void;
}
