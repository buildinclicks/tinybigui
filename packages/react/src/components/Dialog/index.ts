// Layer 3: MD3 Styled Components (most users use these)
export { Dialog } from "./Dialog";
export { DialogHeadline } from "./DialogHeadline";
export { DialogContent } from "./DialogContent";
export { DialogActions } from "./DialogActions";

// Layer 2: Headless Primitive (for advanced customization)
export { DialogHeadless, DialogContext, useDialogContext } from "./DialogHeadless";

// CVA Variants
export {
  dialogScrimVariants,
  dialogPanelVariants,
  dialogWrapperVariants,
  dialogAnimationVariants,
  dialogHeadlineVariants,
  dialogHeadlineTitleVariants,
  dialogContentVariants,
  dialogActionsVariants,
  type DialogScrimVariants,
  type DialogPanelVariants,
  type DialogWrapperVariants,
  type DialogAnimationVariants,
  type DialogHeadlineVariants,
  type DialogContentVariants,
  type DialogActionsVariants,
} from "./Dialog.variants";

// Types
export type {
  DialogVariant,
  DialogAnimationState,
  DialogProps,
  DialogHeadlessProps,
  DialogHeadlineProps,
  DialogContentProps,
  DialogActionsProps,
  DialogContextValue,
} from "./Dialog.types";
