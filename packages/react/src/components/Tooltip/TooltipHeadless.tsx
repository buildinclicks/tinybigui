"use client";

import {
  cloneElement,
  isValidElement,
  useRef,
  type JSX,
  type ReactElement,
  type HTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { useTooltip, useTooltipTrigger, useOverlayPosition } from "react-aria";
import { useTooltipTriggerState } from "react-stately";
import { mergeProps } from "@react-aria/utils";
import type { AriaTooltipProps } from "react-aria";
import type { TooltipTriggerProps, TooltipHeadlessProps } from "./Tooltip.types";

// ─── TooltipTriggerHeadless ───────────────────────────────────────────────────

/**
 * `TooltipTriggerHeadless` — Layer 2 headless trigger primitive.
 *
 * Manages open/close state and wires all React Aria tooltip hooks:
 *
 * - **State**: `useTooltipTriggerState` — 300ms hover delay, instant focus
 *   show, Escape / blur dismiss.
 * - **Wiring**: `useTooltipTrigger` — injects `aria-describedby` on the
 *   trigger and provides the tooltip `id`/`role` needed by `useTooltip`.
 * - **Portal**: the tooltip overlay is only mounted while `state.isOpen` is
 *   `true`; actual portal rendering happens inside `TooltipOverlayHeadless`.
 *
 * Expects exactly two children:
 * 1. The interactive trigger element (button, anchor, etc.)
 * 2. A `TooltipOverlayHeadless` element — `tooltipProps` and `triggerRef` are
 *    injected automatically via `cloneElement`.
 *
 * React Aria hooks used:
 * - `useTooltipTriggerState` — open/close state with delay and warm-up
 * - `useTooltipTrigger` — trigger ARIA wiring and event handlers
 *
 * @example
 * ```tsx
 * <TooltipTriggerHeadless delay={300} onOpenChange={setOpen}>
 *   <button>Save</button>
 *   <TooltipOverlayHeadless placement="top">Save file</TooltipOverlayHeadless>
 * </TooltipTriggerHeadless>
 * ```
 */
export function TooltipTriggerHeadless({
  children,
  delay = 300,
  isDisabled,
  isOpen,
  defaultOpen,
  onOpenChange,
  forceMount = false,
}: TooltipTriggerProps): JSX.Element {
  const triggerRef = useRef<HTMLElement>(null);

  // Manages open/close state with hover delay and instant-focus show.
  const state = useTooltipTriggerState({
    delay,
    ...(isDisabled !== undefined && { isDisabled }),
    ...(isOpen !== undefined && { isOpen }),
    ...(defaultOpen !== undefined && { defaultOpen }),
    ...(onOpenChange !== undefined && { onOpenChange }),
  });

  // Wires trigger → tooltip: injects aria-describedby on the trigger and
  // provides the id/role props that useTooltip needs to complete the pairing.
  const { triggerProps, tooltipProps } = useTooltipTrigger(
    {
      delay,
      ...(isDisabled !== undefined && { isDisabled }),
    },
    state,
    triggerRef
  );

  const [triggerChild, tooltipChild] = children;

  // Inject triggerProps (aria-describedby, event handlers) + ref onto the
  // trigger element. We accept any valid ReactElement as the trigger.
  const trigger = isValidElement(triggerChild)
    ? cloneElement(
        triggerChild as ReactElement<
          HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
        >,
        {
          ...triggerProps,
          ref: triggerRef as React.Ref<HTMLElement>,
        }
      )
    : triggerChild;

  // Inject tooltipProps (id, role) + triggerRef onto the overlay element.
  // forceMount keeps the overlay alive during exit animations without overriding
  // React Aria's isOpen state (which would cause an open/close conflict).
  const overlay =
    (state.isOpen || forceMount) && isValidElement(tooltipChild)
      ? cloneElement(tooltipChild as ReactElement<Partial<TooltipHeadlessProps>>, {
          tooltipProps: tooltipProps as Record<string, unknown>,
          triggerRef,
        })
      : null;

  return (
    <>
      {trigger}
      {overlay}
    </>
  );
}

// ─── TooltipOverlayHeadless ───────────────────────────────────────────────────

/**
 * `TooltipOverlayHeadless` — Layer 2 headless overlay primitive.
 *
 * Handles all tooltip overlay concerns without any visual styling:
 *
 * - **ARIA**: `useTooltip` applies `role="tooltip"` and the stable `id`
 *   used by the trigger's `aria-describedby`.
 * - **Positioning**: `useOverlayPosition` computes pixel-precise placement
 *   with automatic viewport flip. Positioning values come from the DOM so
 *   inline styles are the only viable approach (the one exception to the
 *   no-inline-styles rule).
 * - **Portal**: the tooltip is rendered in `document.body` via
 *   `ReactDOM.createPortal` so it is never a DOM descendant of the trigger,
 *   avoiding stacking-context and overflow issues.
 *
 * `tooltipProps` and `triggerRef` are injected by `TooltipTriggerHeadless`
 * via `cloneElement` — consumers do not need to pass them manually.
 *
 * React Aria hooks used:
 * - `useTooltip` — `role="tooltip"`, stable `id`
 * - `useOverlayPosition` — viewport-aware placement with automatic flip
 *
 * @example
 * ```tsx
 * // Used as the second child of TooltipTriggerHeadless — tooltipProps and
 * // triggerRef are injected automatically.
 * <TooltipOverlayHeadless placement="top" className="my-tooltip">
 *   Save file
 * </TooltipOverlayHeadless>
 * ```
 */
export function TooltipOverlayHeadless({
  tooltipProps: incomingTooltipProps = {},
  triggerRef,
  placement = "top",
  offset = 4,
  className,
  children,
}: TooltipHeadlessProps): JSX.Element | null {
  const overlayRef = useRef<HTMLDivElement>(null);

  // useTooltip receives the intermediate props from useTooltipTrigger
  // (carries the stable id for aria-describedby) and returns the final
  // DOM props including role="tooltip".
  const { tooltipProps } = useTooltip(incomingTooltipProps as AriaTooltipProps);

  // useOverlayPosition computes pixel-precise coordinates relative to the
  // trigger. DOM measurements require inline styles — this is the one
  // permitted use of inline styles in this codebase.
  const { overlayProps, placement: computedPlacement } = useOverlayPosition({
    targetRef: triggerRef ?? { current: null },
    overlayRef,
    placement,
    offset,
    isOpen: true,
  });

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={overlayRef}
      data-placement={placement}
      data-computed-placement={computedPlacement}
      {...mergeProps(tooltipProps, overlayProps)}
      className={className}
    >
      {children}
    </div>,
    document.body
  ) as JSX.Element;
}
