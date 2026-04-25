// Layer 3: MD3 Styled Component
export { Snackbar } from "./Snackbar";

// Layer 2: Headless Primitive (for advanced customization)
export { SnackbarHeadless } from "./SnackbarHeadless";
export type { SnackbarAnimationState } from "./SnackbarHeadless";

// Provider + Hook (required for imperative queue API)
export { SnackbarProvider, SnackbarContext, useSnackbar } from "./SnackbarProvider";

// CVA Variants
export {
  snackbarBaseVariants,
  snackbarAnimationVariants,
  snackbarContainerVariants,
  snackbarMessageVariants,
  snackbarSupportingTextVariants,
  snackbarActionVariants,
  snackbarCloseVariants,
  snackbarContentVariants,
  type SnackbarBaseVariants,
  type SnackbarAnimationVariants,
  type SnackbarContainerVariants,
} from "./Snackbar.variants";

// Types
export type {
  SnackbarSeverity,
  SnackbarProps,
  SnackbarHeadlessProps,
  SnackbarAction,
  SnackbarItem,
  SnackbarContextValue,
  SnackbarProviderProps,
} from "./Snackbar.types";
