"use client";

import type { ReactNode } from "react";

// ─── Variant ──────────────────────────────────────────────────────────────────

/**
 * Structural variant of the MD3 Bottom Sheet.
 *
 * - `standard` — co-exists with page content; no overlay, no scrim, no focus trap.
 *   Draggable handle allows expand/collapse. Standard bottom sheets do not block
 *   access to the rest of the screen.
 *
 * - `modal` — overlays app content with a scrim backdrop, blocks all other
 *   interaction, traps focus, and locks body scroll. Dismissable via Escape,
 *   scrim click, or drag handle.
 *
 * @see https://m3.material.io/components/bottom-sheets/overview
 * @default 'modal'
 */
export type BottomSheetVariant = "standard" | "modal";

// ─── Animation state ──────────────────────────────────────────────────────────

/**
 * Internal animation state machine for the Bottom Sheet.
 *
 * - `entering` — initial mount frame before CSS transition fires
 * - `visible`  — fully visible, entry animation complete
 * - `exiting`  — exit animation in progress
 * - `exited`   — portal content removed from DOM
 */
export type BottomSheetAnimationState = "entering" | "visible" | "exiting" | "exited";

// ─── Context ──────────────────────────────────────────────────────────────────

/**
 * Context shared between BottomSheetHeadless and its sub-components
 * (BottomSheetHandle).
 *
 * @internal
 */
export interface BottomSheetContextValue {
  /** Whether the sheet is currently open. */
  isOpen: boolean;
  /** Active structural variant. */
  variant: BottomSheetVariant;
  /** Configured snap points (array of CSS percentage strings, e.g. ['25%', '50%', '100%']). */
  snapPoints: string[];
  /** Index of the currently active snap point. */
  currentSnapIndex: number;
  /** Whether a drag gesture is in progress. */
  isDragging: boolean;
  /** Callback to programmatically close the sheet. */
  close: () => void;
  /** Props to spread onto the drag handle element — includes pointer and keyboard handlers. */
  handleProps: {
    onPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => void;
    tabIndex: number;
    role: "button";
    "aria-label": string;
  };
}

// ─── BottomSheetHeadlessProps ─────────────────────────────────────────────────

/**
 * Props for the headless `BottomSheetHeadless` primitive (Layer 2).
 *
 * Provides all Bottom Sheet behavior and ARIA semantics without any visual
 * styling. Supports both controlled and uncontrolled open state, draggable
 * handle with snap points, and variant-specific dialog semantics.
 *
 * @example
 * ```tsx
 * // Controlled modal variant
 * <BottomSheetHeadless
 *   variant="modal"
 *   open={open}
 *   onOpenChange={setOpen}
 *   snapPoints={['50%', '100%']}
 *   aria-label="Options"
 *   className={cn(sheetVariants({ variant: 'modal' }))}
 *   scrimClassName={scrimVariants()}
 * >
 *   <BottomSheetHandle />
 *   <p>Content here</p>
 * </BottomSheetHeadless>
 *
 * // Uncontrolled standard variant
 * <BottomSheetHeadless variant="standard" defaultOpen aria-label="Player">
 *   <BottomSheetHandle />
 *   <p>Audio player content</p>
 * </BottomSheetHeadless>
 * ```
 */
export interface BottomSheetHeadlessProps {
  /**
   * Structural variant — drives ARIA semantics, scrim, and focus behavior.
   * @default 'modal'
   */
  variant?: BottomSheetVariant;

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
   * Called when the open state changes (e.g. Escape key, scrim click, drag dismiss).
   */
  onOpenChange?: (open: boolean) => void;

  /**
   * Snap points as CSS percentage strings relative to viewport height.
   * The sheet snaps to the nearest point after a drag gesture is released.
   *
   * @default ['50%']
   * @example ['25%', '50%', '100%']
   */
  snapPoints?: string[];

  /**
   * Accessible label for the sheet.
   * Required for the modal variant (becomes the dialog's `aria-label`).
   * Used as the drag handle's `aria-label` in the standard variant.
   */
  "aria-label": string;

  /**
   * Content of the bottom sheet.
   */
  children?: ReactNode;

  /**
   * Additional CSS classes applied to the sheet panel element.
   */
  className?: string;

  /**
   * Additional CSS classes applied to the scrim overlay (modal variant only).
   */
  scrimClassName?: string;

  /**
   * Callback that receives the current animation state so the styled layer
   * can inject CVA animation classes.
   */
  getAnimationClassName?: (state: BottomSheetAnimationState) => string;
}

// ─── BottomSheetProps ─────────────────────────────────────────────────────────

/**
 * Props for the MD3 Styled `BottomSheet` component (Layer 3).
 *
 * @example
 * ```tsx
 * // Modal variant
 * <BottomSheet
 *   variant="modal"
 *   open={open}
 *   onOpenChange={setOpen}
 *   snapPoints={['50%', '90%']}
 *   aria-label="Share options"
 * >
 *   <p>Share to...</p>
 * </BottomSheet>
 *
 * // Standard variant (co-exists with content)
 * <BottomSheet variant="standard" defaultOpen aria-label="Now playing">
 *   <p>Song title</p>
 * </BottomSheet>
 * ```
 */
export interface BottomSheetProps {
  /**
   * Structural variant.
   * @default 'modal'
   */
  variant?: BottomSheetVariant;

  /**
   * Controlled open state.
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
   * Snap points as CSS percentage strings relative to viewport height.
   * @default ['50%']
   */
  snapPoints?: string[];

  /**
   * Accessible label. Required.
   */
  "aria-label": string;

  /**
   * Sheet content — typically includes a BottomSheetHandle and body content.
   */
  children?: ReactNode;

  /**
   * Additional CSS classes merged onto the sheet panel.
   */
  className?: string;
}

// ─── BottomSheetHandleProps ───────────────────────────────────────────────────

/**
 * Props for the `BottomSheetHandle` sub-component.
 *
 * The drag handle is automatically wired to BottomSheetContext —
 * pointer and keyboard handlers are injected from context.
 * It renders as a visual pill indicator centered at the top of the sheet.
 *
 * MD3 spec: 32dp × 4dp, `bg-on-surface-variant`, `rounded-full`, centered,
 * top padding 22dp, accessible as `role="button"`.
 *
 * @example
 * ```tsx
 * <BottomSheet variant="modal" open={open} onOpenChange={setOpen} aria-label="Options">
 *   <BottomSheetHandle />
 *   <p>Content</p>
 * </BottomSheet>
 * ```
 */
export interface BottomSheetHandleProps {
  /**
   * Additional CSS classes merged onto the handle wrapper element.
   */
  className?: string;
}
