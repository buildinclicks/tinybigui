// Layer 3 — MD3 Styled Components
export { BottomSheet } from "./BottomSheet";
export { BottomSheetHandle } from "./BottomSheetHandle";

// Layer 2 — Headless Primitive
export {
  BottomSheetHeadless,
  BottomSheetContext,
  useBottomSheetContext,
} from "./BottomSheetHeadless";

// Drag hook
export { useBottomSheetDrag } from "./useBottomSheetDrag";

// CVA Variants
export {
  bottomSheetVariants,
  bottomSheetScrimVariants,
  bottomSheetAnimationVariants,
  bottomSheetHandleWrapperVariants,
  bottomSheetHandleStateLayerVariants,
  bottomSheetHandleFocusRingVariants,
  bottomSheetHandlePillVariants,
} from "./BottomSheet.variants";

// Types
export type {
  BottomSheetVariant,
  BottomSheetAnimationState,
  BottomSheetContextValue,
  BottomSheetHeadlessProps,
  BottomSheetProps,
  BottomSheetHandleProps,
} from "./BottomSheet.types";
export type { UseBottomSheetDragOptions, UseBottomSheetDragReturn } from "./useBottomSheetDrag";
export type {
  BottomSheetAnimationVariants,
  BottomSheetVariants,
  BottomSheetScrimVariants,
  BottomSheetHandleVariants,
  BottomSheetHandleWrapperVariants,
  BottomSheetHandleStateLayerVariants,
  BottomSheetHandleFocusRingVariants,
  BottomSheetHandlePillVariants,
} from "./BottomSheet.variants";
