"use client";

import { forwardRef } from "react";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { cn } from "../../utils/cn";
import { SnackbarHeadless } from "./SnackbarHeadless";
import {
  snackbarAnimationVariants,
  snackbarBaseVariants,
  snackbarContentVariants,
  snackbarMessageVariants,
  snackbarSupportingTextVariants,
  snackbarActionVariants,
  snackbarCloseVariants,
} from "./Snackbar.variants";
import type { SnackbarAnimationState } from "./SnackbarHeadless";
import type { SnackbarProps } from "./Snackbar.types";

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

/**
 * `Snackbar` — Layer 3 MD3 Styled Component.
 *
 * Renders one of four MD3 Snackbar content configurations:
 * 1. Single-line message only
 * 2. Two-line message + `supportingText`
 * 3. Single-line with text `action` button (styled `Button variant="text"` with
 *    `inverse-primary` color per MD3 spec)
 * 4. Single-line with close icon (or combined with action)
 *
 * Uses `SnackbarHeadless` for all behavioral concerns (ARIA live region,
 * auto-dismiss timer with pause/resume, animation state machine) and CVA
 * variants for MD3-compliant visual styling.
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
    onClose,
    className,
  },
  ref
) {
  const isTwoLine = Boolean(supportingText);

  // Base structural classes (not animation-state-dependent)
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
      {...(onClose !== undefined && { onClose })}
      className={baseClassName}
      getAnimationClassName={(state: SnackbarAnimationState) =>
        snackbarAnimationVariants({ animationState: state })
      }
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

          {/* Action button — MD3: text variant with inverse-primary color */}
          {action && (
            <span className={snackbarActionVariants()}>
              <Button
                variant="text"
                onPress={action.onAction}
                className="text-inverse-primary hover:text-inverse-primary"
              >
                {action.label}
              </Button>
            </span>
          )}

          {/* Close icon button — MD3: standard icon button with inverse-on-surface */}
          {showClose && (
            <span className={snackbarCloseVariants()}>
              <IconButton
                variant="standard"
                aria-label="Close"
                onPress={triggerClose}
                className="text-inverse-on-surface hover:text-inverse-on-surface"
              >
                <CloseIcon />
              </IconButton>
            </span>
          )}
        </>
      )}
    </SnackbarHeadless>
  );
});

Snackbar.displayName = "Snackbar";
