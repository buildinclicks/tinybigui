import { cva } from "class-variance-authority";

// ─── Container ────────────────────────────────────────────────────────────────

/**
 * Slider root container variants.
 *
 * The root element carries:
 * - `group/slider` — scope for track/stop disabled-state selectors
 *   (`group-data-[disabled]/slider:*`)
 *
 * Horizontal layout: CSS grid with label (col 1) + output (col 2) in the first
 * row, and the full-width track region spanning both columns in the second row.
 * This matches the canonical React Aria / MD3 layout and prevents the track
 * from collapsing when label + output are inline siblings.
 *
 * Vertical layout: flex-col so label is above the track.
 * The size-based HEIGHT lives on the track region, not here (the container is
 * auto-height in horizontal so it wraps the grid rows naturally).
 */
export const sliderContainerVariants = cva(["group/slider", "relative", "select-none"], {
  variants: {
    orientation: {
      // Grid: 1fr for label, auto for output value; gap-x for label↔output spacing
      horizontal: "grid grid-cols-[1fr_auto] items-center gap-x-2 w-full",
      // Flex column: label → track → output stacked; width = handle height (per size)
      vertical: "flex flex-col items-center h-full",
    },
    size: {
      // Vertical orientation: container width = handle height (dimensions transposed)
      // Applied only for vertical via compoundVariants below
      // NOTE: measurement-derived values from MD3 spec §4.2; permitted exception
      xsmall: "",
      small: "",
      medium: "",
      large: "",
      xlarge: "",
    },
  },
  compoundVariants: [
    // Vertical: container WIDTH = handle height (MD3 §10.9 — dimensions transposed)
    // NOTE: measurement-derived values from MD3 spec §4.2; permitted exception
    { orientation: "vertical", size: "xsmall", class: "w-[44px]" },
    { orientation: "vertical", size: "small", class: "w-[44px]" },
    { orientation: "vertical", size: "medium", class: "w-[52px]" },
    { orientation: "vertical", size: "large", class: "w-[68px]" },
    { orientation: "vertical", size: "xlarge", class: "w-[108px]" },
  ],
  defaultVariants: {
    orientation: "horizontal",
    size: "xsmall",
  },
});

// ─── Track Region ─────────────────────────────────────────────────────────────

/**
 * The track region element (`data-track`).
 *
 * This is the element that React Aria measures for pointer math. It must have
 * a defined width (horizontal) or height (vertical) and be `position: relative`
 * so the absolutely-positioned RA thumb children resolve correctly.
 *
 * In horizontal grid layout it spans both columns (`col-span-2`) and carries
 * the size HEIGHT that was previously on the container. In vertical layout it
 * fills the full parent height and carries the size WIDTH.
 *
 * NOTE: measurement-derived size values from MD3 spec §4.2; permitted exception.
 */
export const sliderTrackRegionVariants = cva(["relative", "touch-none"], {
  variants: {
    orientation: {
      horizontal: "col-span-2 w-full",
      // flex-1 fills the vertical container reliably; h-full collapses when the
      // container itself is a flex item without an explicit pixel height (CSS spec).
      // min-h-0 allows the flex child to shrink below its natural size if needed.
      vertical: "flex-1 min-h-0",
    },
    size: {
      // Horizontal: size controls track region HEIGHT (= handle height)
      // Vertical: size controls track region WIDTH (= handle height, dimensions transposed)
      // Applied as compound variants below to avoid cross-orientation conflicts
      xsmall: "",
      small: "",
      medium: "",
      large: "",
      xlarge: "",
    },
  },
  compoundVariants: [
    // Horizontal: height = handle height per MD3 §4.2
    { orientation: "horizontal", size: "xsmall", class: "h-[44px]" },
    { orientation: "horizontal", size: "small", class: "h-[44px]" },
    { orientation: "horizontal", size: "medium", class: "h-[52px]" },
    { orientation: "horizontal", size: "large", class: "h-[68px]" },
    { orientation: "horizontal", size: "xlarge", class: "h-[108px]" },
    // Vertical: width = handle height (transposed per MD3 §10.9)
    { orientation: "vertical", size: "xsmall", class: "w-[44px]" },
    { orientation: "vertical", size: "small", class: "w-[44px]" },
    { orientation: "vertical", size: "medium", class: "w-[52px]" },
    { orientation: "vertical", size: "large", class: "w-[68px]" },
    { orientation: "vertical", size: "xlarge", class: "w-[108px]" },
  ],
  defaultVariants: {
    orientation: "horizontal",
    size: "xsmall",
  },
});

// ─── Track Layout ─────────────────────────────────────────────────────────────

/**
 * Absolute-fill container that holds the active and inactive track segments.
 *
 * Segments are `position: absolute` children sharing the same percentage
 * coordinate space as the React Aria thumbs, so fills always align with
 * handle positions regardless of value or orientation.
 *
 * The MD3 6dp thumb-track gap (`thumbTrackGapSize`) is applied as a symmetric
 * 3px offset on each side of the thumb in the parent's inline position styles.
 *
 * `pointer-events-none` lets React Aria's track click-to-seek events
 * reach the `data-track` region without interference.
 */
export const sliderTrackLayoutVariants = cva(["absolute", "inset-0", "pointer-events-none"]);

// ─── Active Track ─────────────────────────────────────────────────────────────

/**
 * The filled (active) portion of the slider track.
 *
 * **Color**: `bg-primary`
 * **Disabled**: driven by `group-data-[disabled]/slider:*` — no CVA disabled variant.
 * **Transition**: `flex-basis` spring (spatial) when not dragging/reduced-motion.
 *
 * MD3 §6, §10.2: outer corner = size corner token, inner corner (near handle) = 2dp.
 * NOTE: measurement-derived corner values from MD3 spec §6; permitted exception.
 */
export const sliderActiveTrackVariants = cva(
  [
    // Color
    "bg-primary",
    // Disabled — driven by root group/slider data-disabled attr
    "group-data-[disabled]/slider:bg-on-surface",
    "group-data-[disabled]/slider:opacity-38",
    // Layout — absolute fill within the track region
    "absolute",
    "overflow-hidden",
  ],
  {
    variants: {
      size: {
        // Horizontal: left (start) = outer corner, right (near handle) = 2dp inner
        // NOTE: measurement-derived values from MD3 spec §4.2, §6; permitted exception
        xsmall: "h-[16px] rounded-l-[16px] rounded-r-[2px]",
        small: "h-[16px] rounded-l-[16px] rounded-r-[2px]",
        medium: "h-[40px] rounded-l-[12px] rounded-r-[2px]",
        large: "h-[56px] rounded-l-[16px] rounded-r-[2px]",
        xlarge: "h-[96px] rounded-l-[28px] rounded-r-[2px]",
      },
      orientation: {
        // Horizontal: center vertically within track region
        horizontal: "top-1/2 -translate-y-1/2",
        // Vertical: center horizontally; length controlled by inline top/height styles
        vertical: "left-1/2 -translate-x-1/2",
      },
    },
    compoundVariants: [
      // Vertical: width = track thickness; bottom = outer corner, top = 2dp inner (near handle)
      // NOTE: measurement-derived values from MD3 spec §4.2, §6; permitted exception
      {
        orientation: "vertical",
        size: "xsmall",
        class: "w-[16px] rounded-tl-[2px] rounded-tr-[2px] rounded-bl-[16px] rounded-br-[16px]",
      },
      {
        orientation: "vertical",
        size: "small",
        class: "w-[16px] rounded-tl-[2px] rounded-tr-[2px] rounded-bl-[16px] rounded-br-[16px]",
      },
      {
        orientation: "vertical",
        size: "medium",
        class: "w-[40px] rounded-tl-[2px] rounded-tr-[2px] rounded-bl-[12px] rounded-br-[12px]",
      },
      {
        orientation: "vertical",
        size: "large",
        class: "w-[56px] rounded-tl-[2px] rounded-tr-[2px] rounded-bl-[16px] rounded-br-[16px]",
      },
      {
        orientation: "vertical",
        size: "xlarge",
        class: "w-[96px] rounded-tl-[2px] rounded-tr-[2px] rounded-bl-[28px] rounded-br-[28px]",
      },
    ],
    defaultVariants: {
      size: "xsmall",
      orientation: "horizontal",
    },
  }
);

// ─── Inactive Track ───────────────────────────────────────────────────────────

/**
 * The unfilled (inactive) portion of the slider track.
 *
 * **Color**: `bg-secondary-container`
 * **Disabled**: driven by `group-data-[disabled]/slider:*` — no CVA disabled variant.
 *
 * MD3 §6, §10.2: inner corner (near handle) = 2dp, outer corner = size corner token.
 * NOTE: measurement-derived corner values from MD3 spec §6; permitted exception.
 */
export const sliderInactiveTrackVariants = cva(
  [
    // Color
    "bg-secondary-container",
    // Disabled — driven by root group/slider data-disabled attr
    "group-data-[disabled]/slider:bg-on-surface/10",
    // Layout — absolute fill within the track region
    "absolute",
    "overflow-hidden",
  ],
  {
    variants: {
      size: {
        // Horizontal: left (near handle) = 2dp inner, right (end) = outer corner
        // NOTE: measurement-derived values from MD3 spec §4.2, §6; permitted exception
        xsmall: "h-[16px] rounded-l-[2px] rounded-r-[16px]",
        small: "h-[16px] rounded-l-[2px] rounded-r-[16px]",
        medium: "h-[40px] rounded-l-[2px] rounded-r-[12px]",
        large: "h-[56px] rounded-l-[2px] rounded-r-[16px]",
        xlarge: "h-[96px] rounded-l-[2px] rounded-r-[28px]",
      },
      orientation: {
        // Horizontal: center vertically within track region
        horizontal: "top-1/2 -translate-y-1/2",
        // Vertical: center horizontally; length controlled by inline top/height styles
        vertical: "left-1/2 -translate-x-1/2",
      },
    },
    compoundVariants: [
      // Vertical: width = track thickness; top = outer corner, bottom = 2dp inner (near handle)
      // NOTE: measurement-derived values from MD3 spec §4.2, §6; permitted exception
      {
        orientation: "vertical",
        size: "xsmall",
        class: "w-[16px] rounded-tl-[16px] rounded-tr-[16px] rounded-bl-[2px] rounded-br-[2px]",
      },
      {
        orientation: "vertical",
        size: "small",
        class: "w-[16px] rounded-tl-[16px] rounded-tr-[16px] rounded-bl-[2px] rounded-br-[2px]",
      },
      {
        orientation: "vertical",
        size: "medium",
        class: "w-[40px] rounded-tl-[12px] rounded-tr-[12px] rounded-bl-[2px] rounded-br-[2px]",
      },
      {
        orientation: "vertical",
        size: "large",
        class: "w-[56px] rounded-tl-[16px] rounded-tr-[16px] rounded-bl-[2px] rounded-br-[2px]",
      },
      {
        orientation: "vertical",
        size: "xlarge",
        class: "w-[96px] rounded-tl-[28px] rounded-tr-[28px] rounded-bl-[2px] rounded-br-[2px]",
      },
    ],
    defaultVariants: {
      size: "xsmall",
      orientation: "horizontal",
    },
  }
);

// ─── Handle ───────────────────────────────────────────────────────────────────

/**
 * Visual handle (thumb indicator) element inside the React Aria thumb container.
 *
 * **Architecture**: This element lives inside the `group/slider-thumb` scope (the
 * RA-positioned thumb div). All interaction states are driven by
 * `group-data-[x]/slider-thumb:*` selectors — no CVA interaction-state variants.
 *
 * **Pressed width**: `group-data-[pressed]/slider-thumb:w-[2px]` (4dp → 2dp, MD3 spec)
 * **Motion**: `transition-[width]` with spring-standard-fast-spatial tokens.
 *   Applied conditionally in `Slider.tsx` (suppressed for `useReducedMotion()`).
 */
export const sliderHandleVariants = cva(
  [
    // Color
    "bg-primary",
    // Disabled — driven by thumb group/slider-thumb data-disabled attr
    "group-data-[disabled]/slider-thumb:bg-on-surface",
    "group-data-[disabled]/slider-thumb:opacity-38",
    // Pressed width (MD3: 4dp → 2dp on press, spatial spring)
    "group-data-[pressed]/slider-thumb:w-[2px]",
    // Shape
    "rounded-[2px]",
    // Layout
    "flex-shrink-0",
    "pointer-events-none",
  ],
  {
    variants: {
      size: {
        xsmall: "w-[4px] h-[44px]",
        small: "w-[4px] h-[44px]",
        medium: "w-[4px] h-[52px]",
        large: "w-[4px] h-[68px]",
        xlarge: "w-[4px] h-[108px]",
      },
      orientation: {
        horizontal: "",
        // Vertical: handle is a thin horizontal bar. h-[4px] overrides the base
        // h-[44px..108px]. Width is explicitly set per size below so the RA thumb
        // (which is shrink-to-fit) assumes the correct measured width — this also
        // fixes the hit-area (w-full) and state-layer (inset-0) widths.
        vertical: "h-[4px]",
      },
    },
    compoundVariants: [
      // Vertical: override to height-based narrowing on press
      {
        orientation: "vertical",
        class: "group-data-[pressed]/slider-thumb:h-[2px]",
      },
      // Vertical per-size widths (transposed handle length = track region width per MD3 §10.9)
      // NOTE: measurement-derived values from MD3 spec §4.2; permitted exception
      { orientation: "vertical", size: "xsmall", class: "w-[44px]" },
      { orientation: "vertical", size: "small", class: "w-[44px]" },
      { orientation: "vertical", size: "medium", class: "w-[52px]" },
      { orientation: "vertical", size: "large", class: "w-[68px]" },
      { orientation: "vertical", size: "xlarge", class: "w-[108px]" },
    ],
    defaultVariants: {
      size: "xsmall",
      orientation: "horizontal",
    },
  }
);

// ─── State Layer ──────────────────────────────────────────────────────────────

/**
 * State layer overlay on the handle (hover ripple).
 *
 * **Architecture**: Lives inside `group/slider-thumb`; opacity driven entirely
 * by `group-data-[x]/slider-thumb:opacity-*` selectors — no CVA state variant.
 *
 * State-layer opacities per MD3 spec:
 * - hover:   8%   (`opacity-8`)
 * - focused: 10%  (`opacity-10`)
 * - pressed: 10%  (`opacity-10`)
 * - dragged: 16%  (`opacity-16`) — note: drag = pressed in RA isDragging → data-pressed
 *
 * **Motion**: `transition-opacity` with spring-standard-fast-effects tokens.
 *   Always present; `@media prefers-reduced-motion` suppresses the transition at
 *   the CSS level.
 */
export const sliderHandleStateLayerVariants = cva([
  // Color
  "bg-primary",
  // Positioning — covers the handle
  "absolute",
  "inset-0",
  "rounded-[2px]",
  // Interaction: hidden by default
  "opacity-0",
  "pointer-events-none",
  // State opacities — driven by group/slider-thumb data attrs
  "group-data-[hovered]/slider-thumb:opacity-8",
  "group-data-[focus-visible]/slider-thumb:opacity-10",
  "group-data-[pressed]/slider-thumb:opacity-10",
  // Disabled: hide state layer (no interaction feedback)
  "group-data-[disabled]/slider-thumb:hidden",
  // Motion: effects spring (opacity transition only)
  "transition-opacity",
  "duration-spring-standard-fast-effects",
  "ease-spring-standard-fast-effects",
]);

// ─── Value Indicator ──────────────────────────────────────────────────────────

/**
 * Floating pill label above the handle showing the current value.
 *
 * **Architecture**: Always rendered in DOM when `showValueIndicator=true`.
 * Visibility is driven by `group-data-[pressed]/slider-thumb:*` CSS selectors;
 * hidden by default via `opacity-0 scale-0`, revealed on press.
 *
 * **Motion**: `transition-[transform,opacity]` with spring-standard-fast-spatial
 *   tokens (dominant animation is scale/transform — spatial personality).
 *   Applied conditionally in `SliderValueIndicator.tsx` (suppressed for
 *   `useReducedMotion()`).
 */
export const sliderValueIndicatorVariants = cva([
  // Positioning: float above handle center
  "absolute",
  "left-1/2",
  "-translate-x-1/2",
  "bottom-[calc(100%+4px)]",
  // Shape & color
  "bg-inverse-surface",
  "rounded-full",
  "px-[12px]",
  "py-[6px]",
  "min-w-[48px]",
  "text-center",
  // Hidden by default; revealed when thumb group has data-pressed
  "opacity-0",
  "scale-0",
  "group-data-[pressed]/slider-thumb:opacity-100",
  "group-data-[pressed]/slider-thumb:scale-100",
  // Prevent interaction (value display only)
  "pointer-events-none",
  // Z-index above track overlays
  "z-10",
  // In Tailwind v4, scale-* maps to the CSS `scale` property (not `transform`),
  // so we must list `scale` here — not `transform` — to animate the reveal.
  "will-change-[scale,opacity]",
]);

// ─── Stop Dots ────────────────────────────────────────────────────────────────

/**
 * Individual stop indicator dot for discrete sliders.
 */
export const sliderStopDotVariants = cva(["rounded-full", "flex-shrink-0", "pointer-events-none"], {
  variants: {
    region: {
      active: "bg-on-primary",
      inactive: "bg-on-secondary-container",
    },
    size: {
      xsmall: "w-[4px] h-[4px]",
      small: "w-[4px] h-[4px]",
      medium: "w-[6px] h-[6px]",
      large: "w-[6px] h-[6px]",
      xlarge: "w-[8px] h-[8px]",
    },
  },
  defaultVariants: {
    region: "inactive",
    size: "xsmall",
  },
});

// ─── Stops Container ──────────────────────────────────────────────────────────

/**
 * Absolute overlay container for discrete stop indicator dots.
 */
export const sliderStopsContainerVariants = cva([
  "absolute",
  "inset-0",
  "flex",
  "items-center",
  "justify-between",
  "px-[4px]",
  "pointer-events-none",
  "z-10",
]);

// ─── Track Stop (end cap) ─────────────────────────────────────────────────────

/**
 * Absolute-positioned stop indicator at the start or end of a track segment.
 * Used for the terminal positions in range and standard sliders.
 */
export const sliderTrackStopVariants = cva(
  [
    "absolute",
    "rounded-full",
    "bg-on-secondary-container",
    "pointer-events-none",
    "w-[4px]",
    "h-[4px]",
  ],
  {
    variants: {
      position: {
        start: "left-[4px]",
        end: "right-[4px]",
      },
    },
    defaultVariants: {
      position: "end",
    },
  }
);

// ─── Value Indicator Text ─────────────────────────────────────────────────────

/**
 * Text span inside the value indicator pill.
 */
export const sliderValueIndicatorTextVariants = cva([
  "text-inverse-on-surface",
  "text-label-large",
  "select-none",
  "whitespace-nowrap",
]);

// ─── Inset Icon ───────────────────────────────────────────────────────────────

/**
 * Icon rendered inside the active track (medium/large/xlarge sizes only).
 */
export const sliderInsetIconVariants = cva(
  ["absolute", "text-on-primary", "pointer-events-none", "flex", "items-center", "justify-center"],
  {
    variants: {
      size: {
        medium: "w-[24px] h-[24px]",
        large: "w-[24px] h-[24px]",
        xlarge: "w-[32px] h-[32px]",
      },
      orientation: {
        horizontal: "left-[8px] top-1/2 -translate-y-1/2",
        vertical: "bottom-[8px] left-1/2 -translate-x-1/2",
      },
    },
    defaultVariants: {
      size: "medium",
      orientation: "horizontal",
    },
  }
);
