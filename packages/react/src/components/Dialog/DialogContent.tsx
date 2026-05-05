"use client";

import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { useDialogContext } from "./DialogHeadless";
import { dialogContentVariants } from "./Dialog.variants";
import type { DialogContentProps } from "./Dialog.types";

/**
 * `DialogContent` — Scrollable body slot sub-component (Layer 3).
 *
 * Renders as a scrollable `<div>` and registers its `id` with the parent
 * `DialogContext` so the dialog panel can wire `aria-describedby` correctly.
 *
 * Styled with `text-body-medium` and `text-on-surface-variant` per MD3 spec.
 * Overflows vertically when content exceeds the available height.
 *
 * Must be rendered inside a `<Dialog>` or `<DialogHeadless>` component.
 *
 * @example
 * ```tsx
 * <Dialog open onOpenChange={setOpen}>
 *   <DialogHeadline>Confirm deletion?</DialogHeadline>
 *   <DialogContent>
 *     <p>
 *       This will permanently delete the file and all associated data.
 *       This action cannot be undone.
 *     </p>
 *   </DialogContent>
 *   <DialogActions>
 *     <Button variant="text" onPress={() => setOpen(false)}>Cancel</Button>
 *     <Button variant="filled" onPress={handleDelete}>Delete</Button>
 *   </DialogActions>
 * </Dialog>
 * ```
 */
export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(function DialogContent(
  { children, className },
  ref
) {
  const { contentId, variant } = useDialogContext();

  return (
    <div ref={ref} id={contentId} className={cn(dialogContentVariants({ variant }), className)}>
      {children}
    </div>
  );
});

DialogContent.displayName = "DialogContent";
