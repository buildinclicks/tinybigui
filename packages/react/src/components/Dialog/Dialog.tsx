"use client";

import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { DialogHeadless } from "./DialogHeadless";
import {
  dialogPanelVariants,
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
 * - Scale + fade entry animation (`duration-medium4 / ease-emphasized-decelerate`)
 * - Fade exit animation (`duration-short2 / ease-emphasized-accelerate`)
 * - Closes on scrim click or Escape key
 *
 * **Full-screen**:
 * - Full viewport coverage — suited for mobile and complex forms
 * - No rounded corners, no elevation shadow
 * - Slide-up entry / slide-down exit animation
 * - Does NOT close on scrim click per MD3 spec (only via Escape or close button)
 * - Headline replaced by top app bar row (close icon + confirm action)
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
    children,
    className,
  },
  _ref
) {
  // Build panel class: structural + visual styles from CVA
  const panelClassName = cn(dialogPanelVariants({ variant }), className);

  // Scrim class shared between variants
  const scrimClass = dialogScrimVariants();

  return (
    <DialogHeadless
      variant={variant}
      {...(open !== undefined ? { open } : {})}
      {...(defaultOpen !== undefined ? { defaultOpen } : {})}
      {...(onOpenChange !== undefined ? { onOpenChange } : {})}
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
      className={panelClassName}
      scrimClassName={scrimClass}
      getAnimationClassName={(state: DialogAnimationState) =>
        dialogAnimationVariants({ animationState: state, variant })
      }
    >
      {children}
    </DialogHeadless>
  );
});

Dialog.displayName = "Dialog";
