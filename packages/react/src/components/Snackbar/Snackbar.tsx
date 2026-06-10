"use client";

import { forwardRef, useRef } from "react";
import { useButton, useHover, useFocusRing, mergeProps } from "react-aria";
import { cn } from "../../utils/cn";
import { getInteractionDataAttributes } from "../../utils/interactionStates";
import { useRipple } from "../../hooks/useRipple";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { SnackbarHeadless } from "./SnackbarHeadless";
import {
  snackbarAnimationVariants,
  snackbarBaseVariants,
  snackbarContentVariants,
  snackbarMessageVariants,
  snackbarSupportingTextVariants,
  snackbarActionVariants,
  snackbarActionStateLayerVariants,
  snackbarActionFocusRingVariants,
  snackbarCloseVariants,
  snackbarCloseStateLayerVariants,
  snackbarCloseFocusRingVariants,
  snackbarCloseIconVariants,
  getEnterDirection,
} from "./Snackbar.variants";
import type { SnackbarAnimationState } from "./SnackbarHeadless";
import type { SnackbarPosition, SnackbarProps } from "./Snackbar.types";

// ─── Close icon ───────────────────────────────────────────────────────────────

/**
 * Close icon SVG (24dp, MD3 standard close symbol).
 * Inline to avoid any icon library dependency.
 */
function CloseIcon(): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

// ─── SnackbarActionButton (internal) ─────────────────────────────────────────

/**
 * Internal action button for the MD3 Snackbar.
 *
 * Implements the slot-based "Variants vs States" architecture:
 * - React Aria `useButton` + `useHover` + `useFocusRing` for behavior
 * - `getInteractionDataAttributes` → `group-data-[x]/snackbar-action` selectors
 * - State-layer `bg-inverse-primary` — MD3-correct for the inverse-surface container
 * - Focus ring `outline-inverse-primary` — visible on inverse-surface
 *
 * NOT exported — use the styled `Snackbar` component or `SnackbarHeadless` with
 * a custom render function for custom action implementations.
 */
interface SnackbarActionButtonProps {
  /** Visible label text. Also used as the accessible button name. */
  label: string;
  /** Callback fired when the action is pressed. */
  onAction: () => void;
}

function SnackbarActionButton({ label, onAction }: SnackbarActionButtonProps): JSX.Element {
  const ref = useRef<HTMLButtonElement>(null);

  const { buttonProps, isPressed } = useButton({ onPress: onAction }, ref);
  const { isHovered, hoverProps } = useHover({});
  const { isFocusVisible, focusProps } = useFocusRing();
  const { onMouseDown, ripples } = useRipple();

  return (
    <button
      type="button"
      {...mergeProps(buttonProps, hoverProps, focusProps, { onMouseDown })}
      ref={ref}
      className={cn(snackbarActionVariants(), "group/snackbar-action")}
      {...getInteractionDataAttributes({ isHovered, isFocusVisible, isPressed })}
    >
      {/* Ripple feedback */}
      {ripples}

      {/* State layer — bg-inverse-primary per MD3 Snackbar spec */}
      <span className={snackbarActionStateLayerVariants()} aria-hidden="true" />

      {/* Focus ring — extends 3px outside; root has no overflow-hidden */}
      <span className={snackbarActionFocusRingVariants()} aria-hidden="true" />

      {/* Label text — z-10 keeps it above state layer and ripple */}
      <span className="relative z-10">{label}</span>
    </button>
  );
}

// ─── SnackbarCloseButton (internal) ──────────────────────────────────────────

/**
 * Internal close icon button for the MD3 Snackbar.
 *
 * Implements the slot-based "Variants vs States" architecture:
 * - React Aria `useButton` + `useHover` + `useFocusRing` for behavior
 * - `getInteractionDataAttributes` → `group-data-[x]/snackbar-close` selectors
 * - Container: 32dp (size-8) — fits within the 48dp snackbar with 8dp margin
 * - State-layer `bg-inverse-on-surface` — MD3-correct for the inverse-surface container
 *
 * NOT exported — use the styled `Snackbar` component's `showClose` prop.
 */
interface SnackbarCloseButtonProps {
  /** Callback fired when the close button is pressed. */
  onPress: () => void;
}

function SnackbarCloseButton({ onPress }: SnackbarCloseButtonProps): JSX.Element {
  const ref = useRef<HTMLButtonElement>(null);

  const { buttonProps, isPressed } = useButton({ onPress, "aria-label": "Close" }, ref);
  const { isHovered, hoverProps } = useHover({});
  const { isFocusVisible, focusProps } = useFocusRing();
  const { onMouseDown, ripples } = useRipple();

  return (
    <button
      type="button"
      {...mergeProps(buttonProps, hoverProps, focusProps, { onMouseDown })}
      ref={ref}
      className={cn(snackbarCloseVariants(), "group/snackbar-close")}
      {...getInteractionDataAttributes({ isHovered, isFocusVisible, isPressed })}
    >
      {/* Ripple feedback */}
      {ripples}

      {/* State layer — bg-inverse-on-surface per MD3 Snackbar spec */}
      <span className={snackbarCloseStateLayerVariants()} aria-hidden="true" />

      {/* Focus ring — extends 3px outside; root has no overflow-hidden */}
      <span className={snackbarCloseFocusRingVariants()} aria-hidden="true" />

      {/* Icon — 24dp per MD3, z-10 keeps it above state layer */}
      <span className={snackbarCloseIconVariants()} aria-hidden="true">
        <CloseIcon />
      </span>
    </button>
  );
}

// ─── Snackbar (Layer 3: MD3 Styled) ──────────────────────────────────────────

/**
 * `Snackbar` — Layer 3 MD3 Styled Component.
 *
 * Renders one of four MD3 Snackbar content configurations:
 * 1. Single-line message only
 * 2. Two-line message + `supportingText`
 * 3. Single-line with text `action` button (styled with `inverse-primary` per MD3 spec)
 * 4. Single-line with close icon (or combined with action)
 *
 * Uses `SnackbarHeadless` for all behavioral concerns (ARIA live region,
 * auto-dismiss timer with pause/resume, animation state machine) and CVA
 * variants for MD3-compliant visual styling.
 *
 * **Motion**: Position-aware slide + fade using spring-standard effects tokens.
 * Automatically respects `prefers-reduced-motion` (fade-only when reduced motion
 * is preferred — no translate offset).
 *
 * **State layers**: Dedicated slot components (`SnackbarActionButton`,
 * `SnackbarCloseButton`) replace the shared `Button`/`IconButton` components.
 * This ensures the state-layer colors are MD3-correct on an `inverse-surface`:
 * - Action button state layer: `bg-inverse-primary`
 * - Close button state layer: `bg-inverse-on-surface`
 *
 * For typical app usage, render inside `SnackbarProvider` and trigger via
 * the `useSnackbar` hook. For declarative/test usage, it can be rendered
 * standalone.
 *
 * @example
 * ```tsx
 * // Imperative via hook (typical)
 * const { showSnackbar } = useSnackbar();
 * showSnackbar({ message: "File deleted", action: { label: "Undo", onAction: handleUndo } });
 *
 * // Declarative standalone
 * <SnackbarProvider>
 *   <Snackbar message="Saved" severity="default" showClose onClose={() => {}} />
 * </SnackbarProvider>
 * ```
 */
export const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(function Snackbar(
  {
    message,
    supportingText,
    action,
    showClose = false,
    duration = 4000,
    severity = "default",
    position = "bottom-center",
    onClose,
    className,
  },
  ref
) {
  const isTwoLine = Boolean(supportingText);
  const reducedMotion = useReducedMotion();

  const baseClassName = cn(snackbarBaseVariants({ twoLine: isTwoLine }), className);

  return (
    <SnackbarHeadless
      ref={ref}
      message={message}
      {...(supportingText !== undefined && { supportingText })}
      {...(action !== undefined && { action })}
      showClose={showClose}
      duration={duration}
      severity={severity}
      position={position}
      {...(onClose !== undefined && { onClose })}
      className={baseClassName}
      getAnimationClassName={(state: SnackbarAnimationState, pos: SnackbarPosition) => {
        // Reduced motion: fade-only — no translate offset
        if (reducedMotion) {
          return state === "visible"
            ? "opacity-100 duration-spring-standard-default-effects ease-spring-standard-default-effects"
            : "opacity-0";
        }
        return snackbarAnimationVariants({
          animationState: state,
          enterDirection: getEnterDirection(pos),
        });
      }}
    >
      {({ onClose: triggerClose }) => (
        <>
          {/* Content column: message + optional supporting text */}
          <div className={snackbarContentVariants()}>
            <span className={snackbarMessageVariants()}>{message}</span>
            {supportingText && (
              <span className={snackbarSupportingTextVariants()}>{supportingText}</span>
            )}
          </div>

          {/* Action button — MD3: inverse-primary label + state layer */}
          {action && <SnackbarActionButton label={action.label} onAction={action.onAction} />}

          {/* Close icon button — MD3: inverse-on-surface icon + state layer, 32dp */}
          {showClose && <SnackbarCloseButton onPress={triggerClose} />}
        </>
      )}
    </SnackbarHeadless>
  );
});

Snackbar.displayName = "Snackbar";
