"use client";

import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { useDialogContext } from "./DialogHeadless";
import { dialogActionsVariants } from "./Dialog.variants";
import type { DialogActionsProps } from "./Dialog.types";

/**
 * `DialogActions` — Action button row slot sub-component (Layer 3).
 *
 * Renders a right-aligned flex row of action buttons per MD3 spec.
 * Intended to contain `Button` components (typically `variant="text"` for
 * secondary actions and `variant="filled"` for the primary action).
 *
 * Not used in the `fullscreen` variant — the confirm action is placed in the
 * headline top app bar row via `DialogHeadline`'s `confirmButton` slot.
 *
 * Must be rendered inside a `<Dialog>` or `<DialogHeadless>` component.
 *
 * @example
 * ```tsx
 * <Dialog open onOpenChange={setOpen}>
 *   <DialogHeadline>Discard changes?</DialogHeadline>
 *   <DialogContent>Your unsaved changes will be lost.</DialogContent>
 *   <DialogActions>
 *     <Button variant="text" onPress={() => setOpen(false)}>Cancel</Button>
 *     <Button variant="filled" onPress={handleDiscard}>Discard</Button>
 *   </DialogActions>
 * </Dialog>
 * ```
 */
export const DialogActions = forwardRef<HTMLDivElement, DialogActionsProps>(function DialogActions(
  { children, className },
  ref
) {
  // Consume context to validate sub-component is used inside Dialog
  useDialogContext();

  return (
    <div ref={ref} className={cn(dialogActionsVariants(), className)}>
      {children}
    </div>
  );
});

DialogActions.displayName = "DialogActions";
