"use client";

import type { ReactElement } from "react";
import { cn } from "../../utils/cn";
import { useBottomSheetContext } from "./BottomSheetHeadless";
import {
  bottomSheetHandleWrapperVariants,
  bottomSheetHandlePillVariants,
} from "./BottomSheet.variants";
import type { BottomSheetHandleProps } from "./BottomSheet.types";

function BottomSheetHandle({
  className,
  "aria-label": ariaLabelOverride,
}: BottomSheetHandleProps): ReactElement {
  const { handleProps, isDragging } = useBottomSheetContext();

  return (
    <div
      {...handleProps}
      {...(ariaLabelOverride !== undefined ? { "aria-label": ariaLabelOverride } : {})}
      className={cn(bottomSheetHandleWrapperVariants(), className)}
      data-testid="bottom-sheet-handle"
      data-dragging={isDragging || undefined}
    >
      <span className={bottomSheetHandlePillVariants()} aria-hidden="true" />
    </div>
  );
}

BottomSheetHandle.displayName = "BottomSheetHandle";

export { BottomSheetHandle };
