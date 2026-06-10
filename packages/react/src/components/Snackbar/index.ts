// Layer 3: MD3 Styled Component
export { Snackbar } from "./Snackbar";

// Layer 2: Headless Primitive (for advanced customization)
export { SnackbarHeadless } from "./SnackbarHeadless";
export type { SnackbarAnimationState } from "./SnackbarHeadless";

// Provider + Hook (required for imperative queue API)
export { SnackbarProvider, SnackbarContext, useSnackbar } from "./SnackbarProvider";

// CVA Variants — base + animation
export {
  snackbarStackContainerVariants,
  snackbarBaseVariants,
  snackbarAnimationVariants,
  snackbarPositionVariants,
  snackbarContainerVariants,
  snackbarContentVariants,
  snackbarMessageVariants,
  snackbarSupportingTextVariants,
  snackbarInitialVariants,
  getEnterDirection,
  type SnackbarStackContainerVariants,
  type SnackbarBaseVariants,
  type SnackbarAnimationVariants,
  type SnackbarPositionVariants,
  type SnackbarContainerVariants,
} from "./Snackbar.variants";

// CVA Variants — action button slots
export {
  snackbarActionVariants,
  snackbarActionStateLayerVariants,
  snackbarActionFocusRingVariants,
  type SnackbarActionVariants,
  type SnackbarActionStateLayerVariants,
  type SnackbarActionFocusRingVariants,
} from "./Snackbar.variants";

// CVA Variants — close button slots
export {
  snackbarCloseVariants,
  snackbarCloseStateLayerVariants,
  snackbarCloseFocusRingVariants,
  snackbarCloseIconVariants,
  type SnackbarCloseVariants,
  type SnackbarCloseStateLayerVariants,
  type SnackbarCloseFocusRingVariants,
  type SnackbarCloseIconVariants,
} from "./Snackbar.variants";

// Types
export type {
  SnackbarSeverity,
  SnackbarPosition,
  SnackbarProps,
  SnackbarHeadlessProps,
  SnackbarAction,
  SnackbarItem,
  SnackbarContextValue,
  SnackbarProviderProps,
} from "./Snackbar.types";
