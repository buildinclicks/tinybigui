"use client";

import { forwardRef, useCallback } from "react";
import { cn } from "../../utils/cn";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { DialogHeadless } from "./DialogHeadless";
import {
  dialogPanelVariants,
  dialogWrapperVariants,
  dialogScrimVariants,
  dialogAnimationVariants,
} from "./Dialog.variants";
import type { DialogAnimationState } from "./Dialog.types";
import type { DialogProps } from "./Dialog.types";

/**
 * `Dialog` — Layer 3 MD3 Styled Dialog Component.
 *
 * Supports two structural variants per MD3 spec, with a composable slot-based
 * API via `DialogHeadline`, `DialogContent`, and `DialogActions`:
 *
 * **Basic** (default):
 * - Floating card: `bg-surface-container-high`, `rounded-xl`, `shadow-elevation-3`
 * - Centered in viewport (min 280dp, max 560dp width)
 * - Scale + fade entry animation (`animate-md-scale-in`, expressive-fast-spatial 350ms)
 * - Scale + fade exit animation (`animate-md-scale-out`, emphasized-accelerate 200ms)
 * - Scrim fades in/out (`animate-md-fade-in` / `animate-md-fade-out`)
 * - Closes on scrim click or Escape key
 * - Optional hero icon above headline (`icon` prop) — centers headline + content text
 *
 * **Full-screen**:
 * - Full viewport coverage — suited for mobile and complex forms
 * - No rounded corners, no elevation shadow
 * - Slide-up entry / slide-down exit animation (`animate-md-slide-in-bottom` / out)
 * - Does NOT close on scrim click per MD3 spec (only via Escape or close button)
 * - Headline replaced by top app bar row (close icon + confirm action)
 *
 * **Reduced motion**:
 * - When `prefers-reduced-motion: reduce` is active, all keyframe animations are
 *   suppressed (no animate-md-* class applied). Dialog appears/disappears instantly.
 * - `transition-none` is appended so any inherited transitions are also disabled.
 *
 * Both variants:
 * - `role="dialog"` + `aria-modal="true"` (React Aria `useDialog`)
 * - `aria-labelledby` pointing to `DialogHeadline` id
 * - `aria-describedby` pointing to `DialogContent` id
 * - Focus trap active while open (`FocusScope`)
 * - Focus returns to trigger element on close (`FocusScope restoreFocus`)
 * - Body scroll locked while open (`usePreventScroll`)
 * - Escape key always closes the dialog
 * - Portal rendered to `document.body`
 *
 * @example
 * ```tsx
 * // Basic dialog — controlled
 * function DeleteDialog() {
 *   const [open, setOpen] = useState(false);
 *
 *   return (
 *     <>
 *       <Button onPress={() => setOpen(true)}>Delete file</Button>
 *       <Dialog open={open} onOpenChange={setOpen}>
 *         <DialogHeadline>Permanently delete?</DialogHeadline>
 *         <DialogContent>
 *           This action cannot be undone. The file and all associated data
 *           will be permanently removed.
 *         </DialogContent>
 *         <DialogActions>
 *           <Button variant="text" onPress={() => setOpen(false)}>Cancel</Button>
 *           <Button variant="filled" onPress={handleDelete}>Delete</Button>
 *         </DialogActions>
 *       </Dialog>
 *     </>
 *   );
 * }
 *
 * // With hero icon
 * <Dialog icon={<BookmarkIcon />} open={open} onOpenChange={setOpen}>
 *   <DialogHeadline>Save bookmark?</DialogHeadline>
 *   <DialogContent>The page will be saved to your bookmarks.</DialogContent>
 *   <DialogActions>
 *     <Button variant="text" onPress={() => setOpen(false)}>Cancel</Button>
 *     <Button variant="filled" onPress={handleSave}>Save</Button>
 *   </DialogActions>
 * </Dialog>
 *
 * // Full-screen dialog — mobile form flow
 * function NewEventDialog() {
 *   const [open, setOpen] = useState(false);
 *
 *   return (
 *     <>
 *       <Button onPress={() => setOpen(true)}>New event</Button>
 *       <Dialog variant="fullscreen" open={open} onOpenChange={setOpen}>
 *         <DialogHeadline
 *           closeButton={
 *             <IconButton aria-label="Close" onPress={() => setOpen(false)}>
 *               <CloseIcon />
 *             </IconButton>
 *           }
 *           confirmButton={
 *             <Button variant="text" onPress={handleSave}>Save</Button>
 *           }
 *         >
 *           New event
 *         </DialogHeadline>
 *         <DialogContent>
 *           <TextField label="Event name" />
 *           <TextField label="Date" type="date" />
 *         </DialogContent>
 *       </Dialog>
 *     </>
 *   );
 * }
 * ```
 *
 * @see https://m3.material.io/components/dialogs/overview
 * @see https://m3.material.io/components/dialogs/specs
 */
export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog(
  {
    variant = "basic",
    open,
    defaultOpen = false,
    onOpenChange,
    "aria-label": ariaLabel,
    icon,
    children,
    className,
  },
  _ref
) {
  const reducedMotion = useReducedMotion();

  // Panel class: structural + visual styles from CVA.
  // When reducedMotion is true, append transition-none to ensure no inherited
  // transitions fire during the instant show/hide.
  const panelClassName = cn(
    dialogPanelVariants({ variant }),
    reducedMotion && "transition-none",
    className
  );

  // Wrapper class: centering/positioning from CVA (was previously hardcoded in DialogHeadless).
  const wrapperClassName = dialogWrapperVariants({ variant });

  // Scrim class: state-driven fade animation, suppressed when reducedMotion.
  const getScrimClassName = useCallback(
    (state: DialogAnimationState): string => {
      if (reducedMotion) return "fixed inset-0 z-40 bg-scrim/32";
      return dialogScrimVariants({ animationState: state });
    },
    [reducedMotion]
  );

  // Animation class: MD3 Expressive composite keyframes, suppressed when reducedMotion.
  const getAnimationClassName = useCallback(
    (state: DialogAnimationState): string => {
      if (reducedMotion) return "";
      return dialogAnimationVariants({ animationState: state, variant });
    },
    [reducedMotion, variant]
  );

  return (
    <DialogHeadless
      variant={variant}
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange } : {})}
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
      {...(icon !== undefined ? { icon } : {})}
      className={panelClassName}
      wrapperClassName={wrapperClassName}
      getScrimClassName={getScrimClassName}
      getAnimationClassName={getAnimationClassName}
    >
      {children}
    </DialogHeadless>
  );
});

Dialog.displayName = "Dialog";
