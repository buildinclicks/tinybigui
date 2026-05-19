// Layer 3 — MD3 Styled Component
export { Slider } from "./Slider";

// Layer 2 — Headless Primitive
export { SliderHeadless } from "./SliderHeadless";

// CVA Variants
export {
  sliderContainerVariants,
  sliderActiveTrackVariants,
  sliderInactiveTrackVariants,
  sliderHandleVariants,
  sliderHandleStateLayerVariants,
  sliderTrackLayoutVariants,
} from "./Slider.variants";

// Types
export type {
  SliderVariant,
  SliderSize,
  SliderOrientation,
  SliderHeadlessProps,
  SliderThumbProps,
  SliderProps,
  SliderThumbState,
  SliderRenderState,
  SliderRangeThumbLabels,
} from "./Slider.types";
