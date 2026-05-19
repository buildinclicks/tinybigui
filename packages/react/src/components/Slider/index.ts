// Layer 3 — MD3 Styled Component
export { Slider } from "./Slider";

// Layer 2 — Headless Primitive
export { SliderHeadless } from "./SliderHeadless";

// Styled Sub-components
export { SliderStops } from "./SliderStops";
export { SliderValueIndicator } from "./SliderValueIndicator";

// CVA Variants
export {
  sliderContainerVariants,
  sliderActiveTrackVariants,
  sliderInactiveTrackVariants,
  sliderHandleVariants,
  sliderHandleStateLayerVariants,
  sliderTrackLayoutVariants,
  sliderStopsContainerVariants,
  sliderStopDotVariants,
  sliderTrackStopVariants,
  sliderValueIndicatorVariants,
  sliderValueIndicatorTextVariants,
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
