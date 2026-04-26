import type { ReactNode } from "react";

// ─── Position ────────────────────────────────────────────────────────────────

/**
 * Screen position of the Snackbar.
 *
 * MD3 default is `bottom-center`. All six positions are supported for
 * application-specific layout needs (e.g. presence of a FAB or navigation bar).
 *
 * @default 'bottom-center'
 */
export type SnackbarPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

// ─── Severity ────────────────────────────────────────────────────────────────

/**
 * Severity level of the Snackbar message.
 *
 * Controls the ARIA live region role:
 * - `default` → `role="status" aria-live="polite"` (non-urgent information)
 * - `error`   → `role="alert"  aria-live="assertive"` (urgent error messages)
 *
 * @default 'default'
 */
export type SnackbarSeverity = "default" | "error";

// ─── Animation ───────────────────────────────────────────────────────────────

/**
 * Internal animation state machine for the Snackbar.
 *
 * - `entering` → slide-up + fade-in (MD3 entry: short4 / emphasized-decelerate)
 * - `visible`  → fully shown, auto-dismiss timer running
 * - `exiting`  → fade-out (MD3 exit: short2 / emphasized-accelerate)
 * - `exited`   → removed from DOM / queue advanced
 */
export type SnackbarAnimationState = "entering" | "visible" | "exiting" | "exited";

// ─── Action ──────────────────────────────────────────────────────────────────

/**
 * Configuration for the single text action button on the Snackbar.
 *
 * @example
 * ```tsx
 * action={{ label: "Undo", onAction: () => handleUndo() }}
 * ```
 */
export interface SnackbarAction {
  /** Visible label for the action button. Also used as the accessible name. */
  label: string;
  /** Callback fired when the action button is pressed. */
  onAction: () => void;
}

// ─── SnackbarProps ───────────────────────────────────────────────────────────

/**
 * Props for the MD3 Styled `Snackbar` component (Layer 3).
 *
 * Renders one of four MD3 content configurations:
 * 1. Single-line message only
 * 2. Two-line (message + supportingText)
 * 3. Single-line with action button
 * 4. Single-line with close icon
 *
 * @example
 * ```tsx
 * // Single-line
 * <Snackbar message="File deleted" />
 *
 * // With action
 * <Snackbar message="File deleted" action={{ label: "Undo", onAction: handleUndo }} />
 *
 * // With close icon
 * <Snackbar message="Connection lost" showClose onClose={() => {}} />
 *
 * // Error severity (assertive announcement)
 * <Snackbar message="Upload failed" severity="error" />
 * ```
 */
export interface SnackbarProps {
  /**
   * Primary message text shown on the Snackbar.
   * Styled with `text-body-medium`.
   */
  message: string;

  /**
   * Optional supporting text shown below the message (two-line configuration).
   * Styled with `text-body-medium`.
   */
  supportingText?: string;

  /**
   * Optional text action button configuration.
   * Action button is styled as `Button variant="text"` with `inverse-primary` color.
   */
  action?: SnackbarAction;

  /**
   * When `true`, renders a close icon button at the trailing end.
   * @default false
   */
  showClose?: boolean;

  /**
   * Auto-dismiss duration in milliseconds. Set to `0` to disable auto-dismiss.
   * Timer pauses on pointer hover and keyboard focus.
   * @default 4000
   */
  duration?: number;

  /**
   * Severity level — controls the ARIA live region role.
   * @default 'default'
   */
  severity?: SnackbarSeverity;

  /**
   * Screen position of the Snackbar.
   * @default 'bottom-center'
   */
  position?: SnackbarPosition;

  /**
   * Callback fired when the Snackbar finishes its exit animation and is removed.
   * Also fires when the close icon is pressed.
   */
  onClose?: () => void;

  /**
   * Additional CSS classes merged onto the Snackbar container.
   */
  className?: string;
}

// ─── SnackbarHeadlessProps ───────────────────────────────────────────────────

/**
 * Props for the headless `SnackbarHeadless` primitive (Layer 2).
 *
 * Provides all Snackbar behavior (ARIA live region, auto-dismiss timer with
 * pause/resume, animation state machine) without any visual styling.
 *
 * @example
 * ```tsx
 * <SnackbarHeadless message="Hello" duration={3000} onClose={dismiss}>
 *   {({ animationState }) => (
 *     <div className={animationState === 'visible' ? 'opacity-100' : 'opacity-0'}>
 *       Hello
 *     </div>
 *   )}
 * </SnackbarHeadless>
 * ```
 */
export interface SnackbarHeadlessProps extends Omit<SnackbarProps, "className"> {
  /**
   * Children as a render function receiving the current animation state and
   * an imperative `onClose` callback to trigger the exit animation, or
   * static ReactNode content.
   */
  children?:
    | ReactNode
    | ((state: { animationState: SnackbarAnimationState; onClose: () => void }) => ReactNode);

  /**
   * Additional CSS classes passed to the container element (base/structural classes).
   */
  className?: string;

  /**
   * Optional callback that returns additional CSS classes based on the current
   * animation state and position. Used by the styled `Snackbar` layer to inject
   * CVA animation + position variant classes onto the headless container div.
   *
   * @example
   * ```tsx
   * getAnimationClassName={(state, pos) =>
   *   snackbarAnimationVariants({ animationState: state, enterDirection: getEnterDirection(pos) })
   * }
   * ```
   */
  getAnimationClassName?: (state: SnackbarAnimationState, position: SnackbarPosition) => string;
}

// ─── Queue ───────────────────────────────────────────────────────────────────

/**
 * Internal queue entry type used by `SnackbarProvider`.
 * Extends `SnackbarProps` with a unique `id` for queue management.
 */
export interface SnackbarItem extends SnackbarProps {
  /** Unique identifier for this Snackbar instance. */
  id: string;
}

// ─── Context ─────────────────────────────────────────────────────────────────

/**
 * Value exposed by `SnackbarContext` and consumed via `useSnackbar`.
 *
 * @example
 * ```tsx
 * const { showSnackbar } = useSnackbar();
 * showSnackbar({ message: "Saved successfully" });
 * ```
 */
export interface SnackbarContextValue {
  /**
   * Enqueue a new Snackbar. Returns the unique id assigned to this item.
   * Multiple calls are displayed sequentially, not stacked.
   */
  showSnackbar: (options: SnackbarProps) => string;
  /**
   * Imperatively dismiss the currently displayed Snackbar (triggers exit animation).
   */
  closeSnackbar: () => void;
}

// ─── Provider ────────────────────────────────────────────────────────────────

/**
 * Props for `SnackbarProvider`.
 *
 * Wrap your application (or Storybook decorator) with this provider to enable
 * the Snackbar queue and portal.
 *
 * @example
 * ```tsx
 * <SnackbarProvider>
 *   <App />
 * </SnackbarProvider>
 * ```
 */
export interface SnackbarProviderProps {
  /** Application children. */
  children: ReactNode;
}
