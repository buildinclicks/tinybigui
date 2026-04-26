"use client";

import { createContext, useCallback, useContext, useId, useRef, useState, type JSX } from "react";
import { createPortal } from "react-dom";
import { Snackbar } from "./Snackbar";
import type {
  SnackbarContextValue,
  SnackbarItem,
  SnackbarProps,
  SnackbarProviderProps,
} from "./Snackbar.types";

// ─── Context ─────────────────────────────────────────────────────────────────

/**
 * React context for the Snackbar queue.
 * Consumed via the `useSnackbar` hook.
 */
export const SnackbarContext = createContext<SnackbarContextValue | null>(null);

// ─── Hook ────────────────────────────────────────────────────────────────────

/**
 * `useSnackbar` — imperative API for triggering Snackbars.
 *
 * Must be called inside a component that is a descendant of `SnackbarProvider`.
 * Throws a descriptive error in development if used outside the provider.
 *
 * @example
 * ```tsx
 * const { showSnackbar } = useSnackbar();
 *
 * // Single-line
 * showSnackbar({ message: "File deleted" });
 *
 * // With action
 * showSnackbar({
 *   message: "File deleted",
 *   action: { label: "Undo", onAction: () => handleUndo() },
 * });
 *
 * // Error severity (assertive announcement)
 * showSnackbar({ message: "Upload failed", severity: "error" });
 * ```
 */
export function useSnackbar(): SnackbarContextValue {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error(
      "[Snackbar] useSnackbar must be used inside <SnackbarProvider>. " +
        "Wrap your application (or Storybook decorator) with <SnackbarProvider>."
    );
  }
  return ctx;
}

// ─── Provider ────────────────────────────────────────────────────────────────

/**
 * `SnackbarProvider` — context provider, queue manager, and portal host.
 *
 * Wrap your application (or Storybook preview) with this component to enable
 * the Snackbar queue and portal rendering.
 *
 * - Multiple `showSnackbar` calls are **queued** and displayed sequentially
 *   (never stacked) per MD3 spec.
 * - The active Snackbar is rendered via `createPortal` into `document.body`,
 *   positioned `fixed bottom-4 left-1/2 -translate-x-1/2` per MD3 spec.
 *
 * @example
 * ```tsx
 * // Application root
 * <SnackbarProvider>
 *   <App />
 * </SnackbarProvider>
 *
 * // Storybook preview.tsx decorator
 * export const decorators = [
 *   (Story) => (
 *     <SnackbarProvider>
 *       <Story />
 *     </SnackbarProvider>
 *   ),
 * ];
 * ```
 */
export function SnackbarProvider({ children }: SnackbarProviderProps): JSX.Element {
  const [queue, setQueue] = useState<SnackbarItem[]>([]);
  // Monotonically increasing counter for unique id generation without hooks
  const counterRef = useRef<number>(0);
  const baseId = useId();

  /**
   * Enqueue a new Snackbar. Returns the assigned id.
   * If no Snackbar is currently shown, the new item is displayed immediately.
   * Otherwise it is appended to the queue.
   */
  const showSnackbar = useCallback(
    (options: SnackbarProps): string => {
      const id = `${baseId}-snackbar-${++counterRef.current}`;
      setQueue((prev) => [...prev, { ...options, id }]);
      return id;
    },
    [baseId]
  );

  /**
   * Imperatively dismiss the currently displayed Snackbar.
   * Triggers the exit animation; removal happens via the `onClose` callback.
   */
  const closeSnackbar = useCallback(() => {
    setQueue((prev) => {
      if (prev.length === 0) return prev;
      // Mark the current item for removal by clearing the queue head.
      // The Snackbar's own onClose callback (fired after exit animation)
      // will drive the actual dequeue below.
      return prev;
    });
    // Signal to the active Snackbar to begin its exit animation by removing
    // it from the queue head — we do this by firing handleClose on the current item.
    // The onClose callback below handles the actual shift.
    setQueue((prev) => (prev.length > 0 ? prev.slice(1) : prev));
  }, []);

  /**
   * Called by the active Snackbar after its exit animation completes.
   * Shifts the queue so the next item (if any) is displayed.
   */
  const handleCurrentClose = useCallback(() => {
    setQueue((prev) => prev.slice(1));
  }, []);

  const contextValue: SnackbarContextValue = { showSnackbar, closeSnackbar };

  // The active Snackbar is always the first item in the queue (if any).
  const active = queue[0];

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      {active &&
        typeof document !== "undefined" &&
        createPortal(
          <Snackbar
            key={active.id}
            message={active.message}
            {...(active.supportingText !== undefined && { supportingText: active.supportingText })}
            {...(active.action !== undefined && { action: active.action })}
            {...(active.showClose !== undefined && { showClose: active.showClose })}
            {...(active.duration !== undefined && { duration: active.duration })}
            {...(active.severity !== undefined && { severity: active.severity })}
            {...(active.position !== undefined && { position: active.position })}
            {...(active.className !== undefined && { className: active.className })}
            onClose={() => {
              active.onClose?.();
              handleCurrentClose();
            }}
          />,
          document.body
        )}
    </SnackbarContext.Provider>
  );
}
