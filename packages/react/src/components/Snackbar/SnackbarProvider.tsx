"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type JSX,
} from "react";
import { createPortal } from "react-dom";
import { Snackbar } from "./Snackbar";
import { snackbarStackContainerVariants } from "./Snackbar.variants";
import type {
  SnackbarContextValue,
  SnackbarItem,
  SnackbarPosition,
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
 * the Snackbar stack and portal rendering.
 *
 * - Multiple `showSnackbar` calls are displayed simultaneously in a vertical
 *   stack, grouped by their `position` prop.
 * - Each position group is rendered in its own fixed container via `createPortal`
 *   into `document.body`.
 * - Bottom positions stack upward (newest at bottom); top positions stack
 *   downward (newest at top).
 * - The `maxVisible` prop caps how many snackbars can be visible at once per
 *   position group. Snackbars beyond the cap are queued and shown as existing
 *   ones are dismissed.
 *
 * @example
 * ```tsx
 * // Application root
 * <SnackbarProvider>
 *   <App />
 * </SnackbarProvider>
 *
 * // With custom cap (default is 5)
 * <SnackbarProvider maxVisible={3}>
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
export function SnackbarProvider({ children, maxVisible = 5 }: SnackbarProviderProps): JSX.Element {
  const [queue, setQueue] = useState<SnackbarItem[]>([]);
  const counterRef = useRef<number>(0);
  const baseId = useId();

  /**
   * Enqueue a new Snackbar. Returns the assigned id.
   * The snackbar is immediately visible if the position group has fewer than
   * `maxVisible` items currently displayed.
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
   * Imperatively dismiss the oldest snackbar across all position groups.
   * The snackbar's own exit animation plays before it is removed.
   */
  const closeSnackbar = useCallback(() => {
    setQueue((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(1);
    });
  }, []);

  /**
   * Removes a specific snackbar by id after its exit animation completes.
   */
  const removeById = useCallback((id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const contextValue: SnackbarContextValue = { showSnackbar, closeSnackbar };

  // Group visible queue items by position, respecting maxVisible per group.
  const positionGroups = useMemo(() => {
    const groups = new Map<SnackbarPosition, SnackbarItem[]>();
    const countByPosition = new Map<SnackbarPosition, number>();

    for (const item of queue) {
      const pos: SnackbarPosition = item.position ?? "bottom-center";
      const count = countByPosition.get(pos) ?? 0;
      if (count < maxVisible) {
        const existing = groups.get(pos) ?? [];
        groups.set(pos, [...existing, item]);
        countByPosition.set(pos, count + 1);
      }
    }

    return groups;
  }, [queue, maxVisible]);

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <>
            {Array.from(positionGroups.entries()).map(([position, items]) => (
              <div key={position} className={snackbarStackContainerVariants({ position })}>
                {items.map((item) => (
                  <Snackbar
                    key={item.id}
                    message={item.message}
                    {...(item.supportingText !== undefined && {
                      supportingText: item.supportingText,
                    })}
                    {...(item.action !== undefined && { action: item.action })}
                    {...(item.showClose !== undefined && { showClose: item.showClose })}
                    {...(item.duration !== undefined && { duration: item.duration })}
                    {...(item.severity !== undefined && { severity: item.severity })}
                    {...(item.position !== undefined && { position: item.position })}
                    {...(item.className !== undefined && { className: item.className })}
                    onClose={() => {
                      item.onClose?.();
                      removeById(item.id);
                    }}
                  />
                ))}
              </div>
            ))}
          </>,
          document.body
        )}
    </SnackbarContext.Provider>
  );
}
