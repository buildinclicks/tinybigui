"use client";

// BottomSheetHandle — Layer 3 styled drag handle sub-component.
//
// Reads handleProps, isDragging from BottomSheetContext.
// Renders: wrapper (touch target) + pill (visual indicator).
// aria-label and role are injected by handleProps from context.

import type { ReactElement } from "react";
import { cn } from "../../utils/cn";
import { useBottomSheetContext } from "./BottomSheetHeadless";
import {
  bottomSheetHandleWrapperVariants,
  bottomSheetHandlePillVariants,
} from "./BottomSheet.variants";
import type { BottomSheetHandleProps } from "./BottomSheet.types";

function BottomSheetHandle({ className }: BottomSheetHandleProps): ReactElement {
  const { handleProps, isDragging } = useBottomSheetContext();

  return (
    <div
      {...handleProps}
      className={cn(bottomSheetHandleWrapperVariants(), className)}
      data-dragging={isDragging || undefined}
    >
      <span className={bottomSheetHandlePillVariants()} aria-hidden="true" />
    </div>
  );
}

BottomSheetHandle.displayName = "BottomSheetHandle";

export { BottomSheetHandle };
