import type React from "react";

// ─── Variant ──────────────────────────────────────────────────────────────────

/**
 * Structural variant of the MD3 Slider.
 *
 * - `standard` — single handle, value fills from start (left/bottom) toward handle
 * - `centered` — single handle, value fills from center toward handle direction
 * - `range` — two handles defining a min/max range
 *
 * @see https://m3.material.io/components/sliders/overview
 * @default 'standard'
 */
export type SliderVariant = "standard" | "centered" | "range";

// ─── Size ─────────────────────────────────────────────────────────────────────

/**
 * MD3 Expressive size presets for the Slider.
 *
 * Each size controls track height, handle height, corner radius, and icon availability.
 *
 * | Size    | Track Height | Handle Height | Outer Corner       | Icon |
 * |---------|-------------|---------------|--------------------|------|
 * | xsmall  | 16dp        | 44dp          | corner.large       | No   |
 * | small   | 16dp        | 44dp          | corner.large       | No   |
 * | medium  | 40dp        | 52dp          | corner.medium      | Yes  |
 * | large   | 56dp        | 68dp          | corner.large       | Yes  |
 * | xlarge  | 96dp        | 108dp         | corner.extra-large | Yes  |
 *
 * @default 'xsmall'
 */
export type SliderSize = "xsmall" | "small" | "medium" | "large" | "xlarge";

// ─── Orientation ──────────────────────────────────────────────────────────────

/**
 * Orientation of the Slider track.
 *
 * - `horizontal` — track runs left-to-right (default)
 * - `vertical` — track runs bottom-to-top
 *
 * @default 'horizontal'
 */
export type SliderOrientation = "horizontal" | "vertical";

// ─── SliderRangeThumbLabels ───────────────────────────────────────────────────

/**
 * Custom aria-label values for range slider thumbs.
 * Tuple of [leftThumbLabel, rightThumbLabel].
 *
 * @default ['Minimum', 'Maximum']
 * @example ['Min price', 'Max price']
 */
export type SliderRangeThumbLabels = [string, string];

// ─── SliderThumbRenderState ───────────────────────────────────────────────────

/**
 * Render state provided to `renderThumbContent` for each thumb slot.
 *
 * The styled layer (`Slider`) uses this to render the visual handle,
 * state layer, and value indicator inside the React Aria thumb element.
 */
export interface SliderThumbRenderState {
  /** Zero-based index of this thumb (0 for single-thumb, 0 or 1 for range). */
  index: number;
  /** Current numeric value of this thumb (from React Stately state). */
  value: number;
  /** Whether this thumb is currently being dragged (pointer down). */
  isDragging: boolean;
  /** Whether keyboard focus ring is visible on this thumb. */
  isFocusVisible: boolean;
  /** Whether pointer is hovering over this thumb. */
  isHovered: boolean;
  /** Whether the slider is disabled. */
  isDisabled: boolean;
}

// ─── SliderHeadlessProps ──────────────────────────────────────────────────────

/**
 * Props for the headless `SliderHeadless` primitive (Layer 2).
 *
 * Provides all Slider behavior and ARIA semantics without any visual styling.
 * Uses React Aria's `useSlider` and `useSliderThumb` for accessibility.
 *
 * @example
 * ```tsx
 * // Standard continuous slider
 * <SliderHeadless
 *   label="Volume"
 *   minValue={0}
 *   maxValue={100}
 *   defaultValue={[50]}
 * />
 *
 * // Range slider
 * <SliderHeadless
 *   variant="range"
 *   label="Price range"
 *   minValue={0}
 *   maxValue={1000}
 *   defaultValue={[200, 800]}
 * />
 *
 * // Discrete slider with steps
 * <SliderHeadless
 *   label="Rating"
 *   minValue={1}
 *   maxValue={10}
 *   step={1}
 *   defaultValue={[5]}
 * />
 * ```
 */
export interface SliderHeadlessProps {
  /**
   * Structural variant.
   * @default 'standard'
   */
  variant?: SliderVariant;

  /**
   * Orientation of the slider track.
   * @default 'horizontal'
   */
  orientation?: SliderOrientation;

  /**
   * Minimum value of the slider range.
   * @default 0
   */
  minValue?: number;

  /**
   * Maximum value of the slider range.
   * @default 100
   */
  maxValue?: number;

  /**
   * Step increment for the slider value.
   * When set, the slider snaps to discrete values (step × n).
   * When undefined, the slider is continuous.
   */
  step?: number;

  /**
   * Controlled value(s). Array of one value for standard/centered, two for range.
   */
  value?: number[];

  /**
   * Default value(s) for uncontrolled usage.
   * @default [0] for standard, [0] for centered, [25, 75] for range
   */
  defaultValue?: number[];

  /**
   * Called when the value changes during interaction.
   */
  onChange?: (value: number[]) => void;

  /**
   * Called when the user finishes interacting (pointer up or keyboard commit).
   */
  onChangeEnd?: (value: number[]) => void;

  /**
   * Accessible label for the slider.
   * Required if no visible label is provided.
   */
  "aria-label"?: string;

  /**
   * ID of an element that labels this slider.
   * Alternative to `aria-label`.
   */
  "aria-labelledby"?: string;

  /**
   * Human-readable text alternative for the current value.
   * E.g., "$25" or "50 percent".
   */
  "aria-valuetext"?: string;

  /**
   * Visible label text rendered above/beside the slider.
   */
  label?: string;

  /**
   * Whether the slider is disabled.
   * @default false
   */
  isDisabled?: boolean;

  /**
   * Content (children) rendered inside the slider track element.
   * Used by the styled layer to inject track layout.
   */
  children?: React.ReactNode;

  /**
   * Render prop called for each thumb to produce visual thumb content
   * (handle, state layer, value indicator). Receives the thumb's current
   * render state. When provided, visual content is rendered inside the
   * React Aria thumb element (which is absolutely positioned at the value %).
   *
   * Used by the styled `Slider` layer; advanced users of `SliderHeadless`
   * may supply custom thumb visuals.
   */
  renderThumbContent?: (state: SliderThumbRenderState) => React.ReactNode;

  /**
   * Called when any thumb's dragging state changes.
   * Receives the thumb index and a boolean indicating whether it is dragging.
   * Used by the styled layer to suppress track animation during pointer drag.
   */
  onThumbDraggingChange?: (index: number, isDragging: boolean) => void;

  /**
   * Additional CSS classes applied to the slider root element.
   */
  className?: string;

  /**
   * Additional inline styles (for orientation transforms).
   */
  style?: React.CSSProperties;

  /**
   * Formatter function for the value indicator display.
   * Receives the current numeric value, returns the display string.
   *
   * @default (value) => `${Math.round(value)}`
   * @example (value) => `$${value}` // "$50"
   */
  formatValue?: (value: number) => string;

  /**
   * Custom aria-labels for range slider thumbs (left and right).
   * Only applicable when variant="range".
   *
   * @default ['Minimum', 'Maximum']
   * @example ['Min price', 'Max price']
   */
  thumbLabels?: SliderRangeThumbLabels;
}

// ─── SliderThumbProps ─────────────────────────────────────────────────────────

/**
 * Props for an individual slider thumb/handle (internal sub-component).
 *
 * Each thumb represents one draggable value point. Standard/centered sliders
 * have one thumb; range sliders have two.
 *
 * @internal Used by SliderHeadless to render individual thumb elements
 */
export interface SliderThumbProps {
  /**
   * Index of this thumb in the slider's value array.
   * 0 for single-thumb sliders, 0 or 1 for range sliders.
   */
  index: number;

  /**
   * Accessible label for this specific thumb.
   * Required for range sliders to distinguish "Minimum" from "Maximum".
   */
  "aria-label"?: string;

  /**
   * Additional CSS classes for the thumb element.
   */
  className?: string;

  /**
   * Whether to show the value indicator (label) for this thumb.
   * @default false
   */
  showValueIndicator?: boolean;
}

// ─── SliderProps ──────────────────────────────────────────────────────────────

/**
 * Props for the MD3 Styled `Slider` component (Layer 3).
 *
 * @example
 * ```tsx
 * // Basic standard slider
 * <Slider label="Volume" defaultValue={[50]} />
 *
 * // Range slider with custom formatting
 * <Slider
 *   variant="range"
 *   label="Price range"
 *   minValue={0}
 *   maxValue={500}
 *   defaultValue={[100, 400]}
 *   formatValue={(v) => `$${v}`}
 * />
 *
 * // Large centered slider
 * <Slider
 *   variant="centered"
 *   size="large"
 *   label="Balance"
 *   minValue={-100}
 *   maxValue={100}
 *   defaultValue={[0]}
 * />
 *
 * // Discrete slider with stops
 * <Slider
 *   label="Rating"
 *   minValue={1}
 *   maxValue={5}
 *   step={1}
 *   showStops
 *   defaultValue={[3]}
 * />
 * ```
 */
export interface SliderProps extends Omit<
  SliderHeadlessProps,
  "children" | "renderThumbContent" | "onThumbDraggingChange"
> {
  /**
   * MD3 Expressive size preset.
   * Controls track height, handle height, corner radius, and icon size.
   * @default 'xsmall'
   */
  size?: SliderSize;

  /**
   * Whether to show stop indicators for discrete (stepped) sliders.
   * Only applicable when `step` is defined.
   * @default false
   */
  showStops?: boolean;

  /**
   * Whether to show the value indicator (floating label) when the thumb is pressed.
   * @default false
   */
  showValueIndicator?: boolean;

  /**
   * Optional icon element rendered inside the active track.
   * Only available for Medium, Large, and XLarge sizes.
   * Only applies to the Standard variant.
   */
  icon?: React.ReactNode;

  /**
   * Additional CSS classes merged onto the slider root.
   */
  className?: string;
}

// ─── Internal State Types (kept for public API compatibility) ─────────────────

/**
 * Interactive state of a slider thumb.
 *
 * @deprecated The styled Slider now drives interaction states via React Aria
 *   hooks + `data-*` attributes (group-data-[x]/slider-thumb selectors) instead
 *   of a manual state machine. This type is retained only for backwards
 *   compatibility with existing usages of `SliderHeadlessProps`.
 *
 * @internal
 */
export type SliderThumbState = "enabled" | "hovered" | "pressed" | "disabled";

/**
 * Render state passed to internal sub-components for conditional styling.
 *
 * @deprecated The styled Slider now uses `SliderThumbRenderState` (per-thumb
 *   render state) provided by the `renderThumbContent` render prop. This type
 *   is retained only for backwards compatibility.
 *
 * @internal
 */
export interface SliderRenderState {
  /** Whether the slider is disabled */
  isDisabled: boolean;
  /** Whether a thumb is currently being dragged */
  isDragging: boolean;
  /** The current interactive state of each thumb */
  thumbStates: SliderThumbState[];
  /** Current value(s) of the slider */
  values: number[];
  /** Percentage position(s) for each value (0–100) */
  percentages: number[];
}
