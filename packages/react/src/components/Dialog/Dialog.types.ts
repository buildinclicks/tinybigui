import type { ReactNode } from "react";

// ─── Variant ──────────────────────────────────────────────────────────────────

/**
 * Structural variant of the MD3 Dialog.
 *
 * - `basic` — Floating dialog with headline, body, and action buttons.
 *   Supports scale + fade entry animation. Closes on scrim click or Escape.
 *   Max width 560dp per MD3 spec.
 *
 * - `fullscreen` — Full viewport overlay suited for mobile and complex forms.
 *   Replaces headline with a top app bar row (close icon + confirm action).
 *   Slide-up entry animation. Does NOT close on scrim click per MD3 spec.
 *
 * @default 'basic'
 */
export type DialogVariant = "basic" | "fullscreen";

// ─── Animation ────────────────────────────────────────────────────────────────

/**
 * Internal animation state machine for the Dialog.
 *
 * - `entering` — initial mount state before transition fires
 * - `visible`  — fully shown, entry animation complete
 * - `exiting`  — exit animation in progress
 * - `exited`   — removed from DOM
 */
export type DialogAnimationState = "entering" | "visible" | "exiting" | "exited";

// ─── DialogContextValue ───────────────────────────────────────────────────────

/**
 * Internal context shared between `DialogHeadless` and its slot sub-components
 * (`DialogHeadline`, `DialogContent`, `DialogActions`).
 *
 * Coordinates auto-generated `id` values for `aria-labelledby` and
 * `aria-describedby`, exposes the close callback, and propagates the variant.
 *
 * @internal
 */
export interface DialogContextValue {
  /** Stable id for the headline element — used as `aria-labelledby` on the dialog panel. */
  headlineId: string;
  /** Stable id for the content element — used as `aria-describedby` on the dialog panel. */
  contentId: string;
  /** Callback to programmatically close the dialog (triggers exit animation). */
  close: () => void;
  /** Current structural variant, propagated to sub-components for variant-specific rendering. */
  variant: DialogVariant;
}

// ─── DialogHeadlessProps ──────────────────────────────────────────────────────

/**
 * Props for the headless `DialogHeadless` primitive (Layer 2).
 *
 * Provides all Dialog behavior (ARIA roles, focus trap, scroll lock,
 * portal rendering, animation state machine, open/close state) without
 * any visual styling.
 *
 * @example
 * ```tsx
 * <DialogHeadless
 *   variant="basic"
 *   open={open}
 *   onOpenChange={setOpen}
 *   aria-label="Confirm action"
 *   className="bg-surface-container-high rounded-xl shadow-elevation-3"
 *   scrimClassName="fixed inset-0 z-40 bg-scrim opacity-32"
 * >
 *   <DialogHeadline>Confirm deletion?</DialogHeadline>
 *   <DialogContent>This action cannot be undone.</DialogContent>
 *   <DialogActions>
 *     <Button variant="text" onPress={() => setOpen(false)}>Cancel</Button>
 *     <Button variant="filled" onPress={handleDelete}>Delete</Button>
 *   </DialogActions>
 * </DialogHeadless>
 * ```
 */
export interface DialogHeadlessProps {
  /**
   * Structural variant — controls animation, scrim dismissal, and DOM structure.
   * @default 'basic'
   */
  variant?: DialogVariant;

  /**
   * Controlled open state. Pair with `onOpenChange`.
   */
  open?: boolean;

  /**
   * Default open state for uncontrolled usage.
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Called when the open state changes (e.g. Escape key, scrim click, close button).
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Accessible label for the dialog. Used when no `DialogHeadline` is provided.
   * When `DialogHeadline` is present, `aria-labelledby` is preferred automatically.
   */
  "aria-label"?: string;

  /**
   * Dialog slot content — typically `DialogHeadline`, `DialogContent`, `DialogActions`.
   */
  children: ReactNode;

  /**
   * Additional CSS classes applied to the dialog panel element.
   */
  className?: string;

  /**
   * Additional CSS classes applied to the scrim overlay element.
   */
  scrimClassName?: string;

  /**
   * Additional CSS classes injected based on the current animation state.
   * Called at render time to merge CVA animation classes onto the panel.
   *
   * @example
   * ```tsx
   * getAnimationClassName={(state) => dialogAnimationVariants({ animationState: state, variant })}
   * ```
   */
  getAnimationClassName?: (state: DialogAnimationState) => string;
}

// ─── DialogProps ──────────────────────────────────────────────────────────────

/**
 * Props for the MD3 Styled `Dialog` component (Layer 3).
 *
 * Supports two structural variants — Basic (floating dialog) and Full-screen
 * (full viewport overlay for mobile / complex forms) — with a composable
 * slot-based API via `DialogHeadline`, `DialogContent`, and `DialogActions`.
 *
 * Supports both controlled (`open` + `onOpenChange`) and uncontrolled
 * (`defaultOpen`) usage patterns.
 *
 * @example
 * ```tsx
 * // Basic dialog (controlled)
 * <Dialog open={open} onOpenChange={setOpen}>
 *   <DialogHeadline>Delete file?</DialogHeadline>
 *   <DialogContent>This action cannot be undone.</DialogContent>
 *   <DialogActions>
 *     <Button variant="text" onPress={() => setOpen(false)}>Cancel</Button>
 *     <Button variant="filled" onPress={handleDelete}>Delete</Button>
 *   </DialogActions>
 * </Dialog>
 *
 * // Full-screen dialog (controlled)
 * <Dialog variant="fullscreen" open={open} onOpenChange={setOpen}>
 *   <DialogHeadline
 *     closeButton={<IconButton aria-label="Close" onPress={() => setOpen(false)}><CloseIcon /></IconButton>}
 *     confirmButton={<Button variant="text" onPress={handleSave}>Save</Button>}
 *   >
 *     New event
 *   </DialogHeadline>
 *   <DialogContent>
 *     <TextField label="Event name" />
 *   </DialogContent>
 * </Dialog>
 * ```
 */
export interface DialogProps {
  /**
   * Structural variant — `basic` (default) or `fullscreen`.
   * @default 'basic'
   */
  variant?: DialogVariant;

  /**
   * Controlled open state. Pair with `onOpenChange`.
   */
  open?: boolean;

  /**
   * Default open state for uncontrolled usage.
   * @default false
   */
  defaultOpen?: boolean;

  /**
   * Called when the open state changes.
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Accessible label for the dialog when no `DialogHeadline` is present.
   */
  "aria-label"?: string;

  /**
   * Dialog slot content — `DialogHeadline`, `DialogContent`, `DialogActions`.
   */
  children: ReactNode;

  /**
   * Additional CSS classes merged onto the dialog panel element.
   */
  className?: string;
}

// ─── DialogHeadlineProps ──────────────────────────────────────────────────────

/**
 * Props for the `DialogHeadline` slot sub-component.
 *
 * Renders as an `<h2>` element and provides its `id` to `DialogContext`
 * so the parent dialog panel can reference it via `aria-labelledby`.
 *
 * For the `fullscreen` variant, accepts optional `closeButton` and
 * `confirmButton` slots that are rendered in the top app bar row per MD3 spec.
 *
 * @example
 * ```tsx
 * // Basic variant
 * <DialogHeadline>Confirm deletion?</DialogHeadline>
 *
 * // Full-screen variant
 * <DialogHeadline
 *   closeButton={<IconButton aria-label="Close" onPress={onClose}><CloseIcon /></IconButton>}
 *   confirmButton={<Button variant="text" onPress={onSave}>Save</Button>}
 * >
 *   New event
 * </DialogHeadline>
 * ```
 */
export interface DialogHeadlineProps {
  /**
   * Headline text content.
   */
  children: ReactNode;

  /**
   * Additional CSS classes merged onto the headline element.
   */
  className?: string;

  /**
   * Close icon button slot — rendered leading in the top app bar row
   * for the `fullscreen` variant only.
   */
  closeButton?: ReactNode;

  /**
   * Confirm action slot — rendered trailing in the top app bar row
   * for the `fullscreen` variant only.
   */
  confirmButton?: ReactNode;
}

// ─── DialogContentProps ───────────────────────────────────────────────────────

/**
 * Props for the `DialogContent` slot sub-component.
 *
 * Renders as a scrollable `<div>` and provides its `id` to `DialogContext`
 * so the parent dialog panel can reference it via `aria-describedby`.
 *
 * @example
 * ```tsx
 * <DialogContent>
 *   <p>This action cannot be undone. All associated data will be permanently removed.</p>
 * </DialogContent>
 * ```
 */
export interface DialogContentProps {
  /**
   * Body content — can be any React node.
   */
  children: ReactNode;

  /**
   * Additional CSS classes merged onto the content element.
   */
  className?: string;
}

// ─── DialogActionsProps ───────────────────────────────────────────────────────

/**
 * Props for the `DialogActions` slot sub-component.
 *
 * Renders a right-aligned flex row of action buttons per MD3 spec.
 * Typically contains `Button` components with `variant="text"` (secondary)
 * and `variant="filled"` (primary action).
 *
 * Not used in the `fullscreen` variant (confirm action is in the headline row).
 *
 * @example
 * ```tsx
 * <DialogActions>
 *   <Button variant="text" onPress={onCancel}>Cancel</Button>
 *   <Button variant="filled" onPress={onConfirm}>Confirm</Button>
 * </DialogActions>
 * ```
 */
export interface DialogActionsProps {
  /**
   * Action button elements — typically `Button` components.
   */
  children: ReactNode;

  /**
   * Additional CSS classes merged onto the actions container.
   */
  className?: string;
}
