"use client";

import { forwardRef, useCallback, useEffect, useRef } from "react";
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
 * **Scroll dividers**: Shows `border-outline-variant` dividers at the top and/or
 * bottom edge when content overflows and is not scrolled to the respective edge.
 * Dividers are toggled by setting `data-scroll-divider-top` / `data-scroll-divider-bottom`
 * presence attributes on the element. The CVA base class uses
 * `data-[scroll-divider-top]:border-t` and `data-[scroll-divider-bottom]:border-b`
 * to apply the borders — no style props needed.
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
  forwardedRef
) {
  const { contentId, variant } = useDialogContext();

  // Internal ref for scroll measurements — merged with forwarded ref below.
  // useRef<HTMLDivElement | null>(null) returns MutableRefObject so .current is writable.
  const internalRef = useRef<HTMLDivElement | null>(null);

  // Merge the internal ref with any forwarded ref so callers can still access the element.
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef !== null && forwardedRef !== undefined) {
        // RefObject.current is readonly in the React types, but ForwardedRef is
        // always a mutable ref when it is an object. Cast to a writable shape.
        (forwardedRef as { current: HTMLDivElement | null }).current = node;
      }
    },
    [forwardedRef]
  );

  // Computes scroll-divider attributes based on current scroll position.
  // Divider at top: shown when content is scrolled down (scrollTop > 0).
  // Divider at bottom: shown when content is not yet scrolled to the bottom.
  // A 1px threshold avoids floating-point rounding issues on fractional pixels.
  const updateDividers = useCallback(() => {
    const el = internalRef.current;
    if (!el) return;

    const isScrollable = el.scrollHeight > el.clientHeight;

    if (!isScrollable) {
      el.removeAttribute("data-scroll-divider-top");
      el.removeAttribute("data-scroll-divider-bottom");
      return;
    }

    const scrolledFromTop = el.scrollTop > 1;
    const scrolledToBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

    if (scrolledFromTop) {
      el.setAttribute("data-scroll-divider-top", "");
    } else {
      el.removeAttribute("data-scroll-divider-top");
    }

    if (!scrolledToBottom) {
      el.setAttribute("data-scroll-divider-bottom", "");
    } else {
      el.removeAttribute("data-scroll-divider-bottom");
    }
  }, []);

  // Attach scroll listener and a ResizeObserver to re-evaluate dividers when
  // the content dimensions change (e.g. accordion, dynamic content).
  useEffect(() => {
    const el = internalRef.current;
    if (!el) return;

    // Initial calculation
    updateDividers();

    el.addEventListener("scroll", updateDividers, { passive: true });

    const observer = new ResizeObserver(updateDividers);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", updateDividers);
      observer.disconnect();
    };
  }, [updateDividers]);

  return (
    <div ref={setRef} id={contentId} className={cn(dialogContentVariants({ variant }), className)}>
      {children}
    </div>
  );
});

DialogContent.displayName = "DialogContent";
