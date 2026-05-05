"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type React from "react";
import { useDialog, useOverlay, usePreventScroll, FocusScope } from "react-aria";
import { useOverlayTriggerState } from "react-stately";
import { mergeProps } from "@react-aria/utils";
import { cn } from "../../utils/cn";
import type {
  DialogAnimationState,
  DialogContextValue,
  DialogHeadlessProps,
  DialogVariant,
} from "./Dialog.types";

// ─── Context ──────────────────────────────────────────────────────────────────

/**
 * Context shared between `DialogHeadless` and slot sub-components
 * (`DialogHeadline`, `DialogContent`, `DialogActions`).
 *
 * Provides stable IDs for aria-labelledby / aria-describedby wiring,
 * the close callback, and the active variant.
 *
 * @internal
 */
export const DialogContext = createContext<DialogContextValue | null>(null);

/**
 * Hook to consume `DialogContext` inside dialog slot sub-components.
 * Throws a descriptive error if used outside a `DialogHeadless` tree.
 *
 * @internal
 */
export function useDialogContext(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (ctx === null) {
    throw new Error(
      "[Dialog] DialogHeadline, DialogContent, and DialogActions must be rendered " +
        "inside a <Dialog> or <DialogHeadless> component."
    );
  }
  return ctx;
}

// ─── DialogPanel (internal) ───────────────────────────────────────────────────

/**
 * Inner dialog panel — wires React Aria hooks (`useDialog`, `useOverlay`,
 * `usePreventScroll`) and renders the accessible dialog element with the
 * centering wrapper.
 *
 * DOM structure:
 * ```
 *   <div> (centering / positioning wrapper, z-50)
 *     <div role="dialog" aria-modal> (panel — className, animation, data attrs)
 *       {children}
 *     </div>
 *   </div>
 * ```
 *
 * This allows `screen.getByRole("dialog")` to directly return the panel
 * (with `data-animation-state` and `data-variant` for test assertions).
 *
 * @internal
 */
interface DialogPanelProps {
  ariaLabel: string | undefined;
  headlineId: string;
  contentId: string;
  onClose: () => void;
  onTransitionEnd: () => void;
  variant: DialogVariant;
  isDismissable: boolean;
  wrapperClassName: string;
  className: string | undefined;
  animationState: DialogAnimationState;
  getAnimationClassName: ((state: DialogAnimationState) => string) | undefined;
  children: React.ReactNode;
}

const DialogPanel = ({
  ariaLabel,
  headlineId,
  contentId,
  onClose,
  onTransitionEnd,
  variant,
  isDismissable,
  wrapperClassName,
  className,
  animationState,
  getAnimationClassName,
  children,
}: DialogPanelProps): React.ReactElement => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while dialog is open
  usePreventScroll();

  // useDialog: applies role="dialog", aria-modal="true", aria-labelledby, aria-describedby
  const { dialogProps } = useDialog(
    {
      ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
      "aria-labelledby": headlineId,
      "aria-describedby": contentId,
    },
    panelRef
  );

  // useOverlay: handles Escape key dismissal and outside-click dismissal
  const { overlayProps } = useOverlay(
    {
      isOpen: true,
      onClose,
      isDismissable,
      shouldCloseOnBlur: false,
    },
    panelRef
  );

  // Merge animation classes onto the panel element
  const panelClassName = cn(className, getAnimationClassName?.(animationState));

  return (
    // Centering/positioning wrapper — structural only, no ARIA role
    <div className={wrapperClassName}>
      {/* Panel: semantic dialog element with React Aria hooks, animation, data attrs */}
      <div
        {...mergeProps(overlayProps, dialogProps)}
        ref={panelRef}
        aria-modal="true"
        className={panelClassName}
        data-animation-state={animationState}
        data-variant={variant}
        onTransitionEnd={onTransitionEnd}
      >
        {children}
      </div>
    </div>
  );
};

DialogPanel.displayName = "DialogPanel";

// ─── DialogHeadless ───────────────────────────────────────────────────────────

/**
 * `DialogHeadless` — Layer 2 headless primitive.
 *
 * Provides all MD3 Dialog behavior and ARIA semantics without any visual styling:
 *
 * - **Portal rendering**: dialog and scrim render in `document.body` via
 *   `createPortal` to avoid stacking context issues.
 * - **Open/close state**: via `useOverlayTriggerState` (supports controlled
 *   `open` + `onOpenChange` and uncontrolled `defaultOpen`).
 * - **Scroll lock**: `usePreventScroll` locks body scroll while open.
 * - **Focus trap**: `FocusScope` with `contain`, `restoreFocus`, `autoFocus`.
 * - **Dismiss behavior**: `useOverlay` handles Escape key and outside click.
 *   Basic variant is dismissable (Escape + outside click);
 *   Full-screen variant is Escape-dismissable only (no scrim click) per MD3 spec.
 * - **Animation state machine**: `entering → visible → exiting → exited`
 *   mirrors the Snackbar animation pattern.
 * - **ARIA wiring**: `DialogContext` provides stable IDs for `aria-labelledby`
 *   and `aria-describedby`, consumed by slot sub-components.
 *
 * React Aria hooks used:
 * - `useDialog` — `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`
 * - `useOverlay` — Escape key + outside-click dismissal
 * - `usePreventScroll` — body scroll lock
 * - `FocusScope` — focus trap + restoreFocus on close
 * - `useOverlayTriggerState` — open/close state management
 *
 * @example
 * ```tsx
 * // Controlled basic dialog
 * <DialogHeadless
 *   variant="basic"
 *   open={open}
 *   onOpenChange={setOpen}
 *   className={cn(dialogWrapperVariants({ variant: 'basic' }), dialogPanelVariants({ variant: 'basic' }))}
 *   scrimClassName={dialogScrimVariants()}
 *   getAnimationClassName={(state) =>
 *     dialogAnimationVariants({ animationState: state, variant: 'basic' })
 *   }
 * >
 *   <DialogHeadline>Confirm?</DialogHeadline>
 *   <DialogContent>This action cannot be undone.</DialogContent>
 *   <DialogActions>
 *     <Button variant="text" onPress={() => setOpen(false)}>Cancel</Button>
 *     <Button variant="filled" onPress={handleDelete}>Delete</Button>
 *   </DialogActions>
 * </DialogHeadless>
 * ```
 */
export const DialogHeadless = forwardRef<HTMLDivElement, DialogHeadlessProps>(
  function DialogHeadless(
    {
      variant = "basic",
      open,
      defaultOpen = false,
      onOpenChange,
      "aria-label": ariaLabel,
      children,
      className,
      scrimClassName,
      getAnimationClassName,
    },
    _ref
  ) {
    // ── Open/close state ─────────────────────────────────────────────────────

    const state = useOverlayTriggerState({
      ...(open !== undefined ? { isOpen: open } : {}),
      ...(defaultOpen !== undefined ? { defaultOpen } : {}),
      ...(onOpenChange !== undefined ? { onOpenChange } : {}),
    });

    const isOpen = state.isOpen;

    const close = useCallback(() => {
      state.close();
    }, [state]);

    // ── Animation state machine ───────────────────────────────────────────────

    const [animationState, setAnimationState] = useState<DialogAnimationState>("exited");
    // Guard against calling state updates after unmount / multiple times
    const closedRef = useRef<boolean>(false);
    // Fallback timer for exit animation in case onTransitionEnd doesn't fire
    const exitFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // When isOpen becomes true → start entry animation cycle
    useEffect(() => {
      if (!isOpen) return;

      closedRef.current = false;
      setAnimationState("entering");

      // Zero-delay timer ensures "entering" state is rendered (allowing CSS
      // transition initial values) before transitioning to "visible".
      const id = setTimeout(() => {
        setAnimationState("visible");
      }, 0);

      return () => clearTimeout(id);
    }, [isOpen]);

    // When isOpen becomes false while visible → start exit animation cycle
    useEffect(() => {
      if (isOpen) return;
      if (animationState === "exited" || animationState === "entering") return;

      if (animationState === "visible") {
        setAnimationState("exiting");

        // Fallback: advance to exited if CSS transition doesn't fire
        exitFallbackRef.current = setTimeout(() => {
          if (!closedRef.current) {
            closedRef.current = true;
            setAnimationState("exited");
          }
        }, 150);
      }
    }, [isOpen, animationState]);

    // Cleanup on unmount
    useEffect(
      () => () => {
        if (exitFallbackRef.current !== null) {
          clearTimeout(exitFallbackRef.current);
        }
      },
      []
    );

    const handleTransitionEnd = useCallback(() => {
      if (animationState === "exiting" && !closedRef.current) {
        if (exitFallbackRef.current !== null) {
          clearTimeout(exitFallbackRef.current);
          exitFallbackRef.current = null;
        }
        closedRef.current = true;
        setAnimationState("exited");
      }
    }, [animationState]);

    // ── ARIA ID coordination ──────────────────────────────────────────────────

    const baseId = useId();
    const headlineId = `${baseId}-dialog-headline`;
    const contentId = `${baseId}-dialog-content`;

    const contextValue: DialogContextValue = {
      headlineId,
      contentId,
      close,
      variant,
    };

    // ── Scrim dismissal ───────────────────────────────────────────────────────

    // Basic variant: scrim click closes dialog. Full-screen: scrim is inert.
    const handleScrimClick = useCallback(() => {
      if (variant === "basic") {
        close();
      }
    }, [variant, close]);

    // ── Portal gate ───────────────────────────────────────────────────────────

    // Do not render portal until open, and remove once animation is fully exited
    if (!isOpen && animationState === "exited") {
      return null;
    }

    // ── Portal content ────────────────────────────────────────────────────────

    const content = (
      <DialogContext.Provider value={contextValue}>
        {/* Scrim overlay — click closes for basic, inert for fullscreen */}
        <div
          data-testid="dialog-scrim"
          className={scrimClassName}
          onClick={handleScrimClick}
          aria-hidden="true"
        />

        {/* FocusScope: traps focus, restores focus to trigger on close, auto-focuses first element */}
        <FocusScope contain restoreFocus autoFocus>
          <DialogPanel
            ariaLabel={ariaLabel}
            headlineId={headlineId}
            contentId={contentId}
            onClose={close}
            onTransitionEnd={handleTransitionEnd}
            variant={variant}
            isDismissable={variant === "basic"}
            wrapperClassName={
              variant === "basic"
                ? "fixed inset-0 z-50 flex items-center justify-center px-4"
                : "fixed inset-0 z-50"
            }
            className={className}
            animationState={animationState}
            getAnimationClassName={getAnimationClassName}
          >
            {children}
          </DialogPanel>
        </FocusScope>
      </DialogContext.Provider>
    );

    if (typeof document === "undefined") return null;

    return createPortal(content, document.body) as React.ReactElement;
  }
);

DialogHeadless.displayName = "DialogHeadless";
