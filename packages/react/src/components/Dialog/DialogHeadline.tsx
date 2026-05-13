"use client";

import { forwardRef } from "react";
import { cn } from "../../utils/cn";
import { useDialogContext } from "./DialogHeadless";
import { dialogHeadlineVariants, dialogHeadlineTitleVariants } from "./Dialog.variants";
import type { DialogHeadlineProps } from "./Dialog.types";

/**
 * `DialogHeadline` — Headline slot sub-component (Layer 3).
 *
 * Renders as an `<h2>` element and registers its `id` with the parent
 * `DialogContext` so the dialog panel can wire `aria-labelledby` correctly.
 *
 * For the `fullscreen` variant, the headline renders as a top app bar row
 * containing optional `closeButton` (leading icon button) and `confirmButton`
 * (trailing text action) per MD3 Full-screen Dialog spec.
 *
 * Must be rendered inside a `<Dialog>` or `<DialogHeadless>` component.
 *
 * @example
 * ```tsx
 * // Basic variant
 * <Dialog open onOpenChange={setOpen}>
 *   <DialogHeadline>Delete file?</DialogHeadline>
 *   ...
 * </Dialog>
 *
 * // Full-screen variant with app bar controls
 * <Dialog variant="fullscreen" open onOpenChange={setOpen}>
 *   <DialogHeadline
 *     closeButton={
 *       <IconButton aria-label="Close" onPress={() => setOpen(false)}>
 *         <CloseIcon />
 *       </IconButton>
 *     }
 *     confirmButton={
 *       <Button variant="text" onPress={handleSave}>Save</Button>
 *     }
 *   >
 *     New event
 *   </DialogHeadline>
 *   ...
 * </Dialog>
 * ```
 */
export const DialogHeadline = forwardRef<HTMLHeadingElement, DialogHeadlineProps>(
  function DialogHeadline({ children, className, closeButton, confirmButton }, ref) {
    const { headlineId, variant } = useDialogContext();

    if (variant === "fullscreen") {
      return (
        // Top app bar row for fullscreen variant
        <div className={cn(dialogHeadlineVariants({ variant: "fullscreen" }), className)}>
          {/* Leading close icon button */}
          {closeButton}

          {/* Headline text — grows to fill available space */}
          <h2 id={headlineId} className={dialogHeadlineTitleVariants()}>
            {children}
          </h2>

          {/* Trailing confirm action */}
          {confirmButton}
        </div>
      );
    }

    return (
      <h2
        ref={ref}
        id={headlineId}
        className={cn(dialogHeadlineVariants({ variant: "basic" }), className)}
      >
        {children}
      </h2>
    );
  }
);

DialogHeadline.displayName = "DialogHeadline";
