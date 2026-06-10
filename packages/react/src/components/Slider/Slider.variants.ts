import { cva } from "class-variance-authority";

// ─── Container ────────────────────────────────────────────────────────────────

/**
 * Slider root container variants.
 *
 * The root element carries:
 * - `group/slider` — scope for track/stop disabled-state selectors
 *   (`group-data-[disabled]/slider:*`)
 */
export const sliderContainerVariants = cva(
  ["group/slider", "flex", "items-center", "w-full", "relative", "select-none"],
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col w-auto",
      },
      size: {
        xsmall: "h-[44px]",
        small: "h-[44px]",
        medium: "h-[52px]",
        large: "h-[68px]",
        xlarge: "h-[108px]",
      },
    },
    compoundVariants: [
      {
        orientation: "vertical",
        size: "xsmall",
        class: "h-full w-[44px]",
      },
      {
        orientation: "vertical",
        size: "small",
        class: "h-full w-[44px]",
      },
      {
        orientation: "vertical",
        size: "medium",
        class: "h-full w-[52px]",
      },
      {
        orientation: "vertical",
        size: "large",
        class: "h-full w-[68px]",
      },
      {
        orientation: "vertical",
        size: "xlarge",
        class: "h-full w-[108px]",
      },
    ],
    defaultVariants: {
      orientation: "horizontal",
      size: "xsmall",
    },
  }
);

// ─── Track Layout ─────────────────────────────────────────────────────────────

/**
 * Inner flex container that holds the active and inactive track segments.
 *
 * The 6dp gap (MD3 `thumbTrackGapSize`) is preserved here as `gap-[6px]`
 * between the active and inactive track flex items.
 */
export const sliderTrackLayoutVariants = cva(
  ["relative", "flex", "items-center", "gap-[6px]", "w-full", "h-full"],
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col-reverse h-full",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

// ─── Active Track ─────────────────────────────────────────────────────────────

/**
 * The filled (active) portion of the slider track.
 *
 * **Color**: `bg-primary`
 * **Disabled**: driven by `group-data-[disabled]/slider:*` — no CVA disabled variant.
 * **Transition**: `flex-basis` spring (spatial) when not dragging/reduced-motion.
 */
export const sliderActiveTrackVariants = cva(
  [
    // Color
    "bg-primary",
    // Disabled — driven by root group/slider data-disabled attr
    "group-data-[disabled]/slider:bg-on-surface",
    "group-data-[disabled]/slider:opacity-38",
    // Layout
    "flex-shrink-0",
    "overflow-hidden",
    "relative",
  ],
  {
    variants: {
      size: {
        xsmall: "h-[16px] rounded-[8px]",
        small: "h-[16px] rounded-[8px]",
        medium: "h-[40px] rounded-[20px]",
        large: "h-[56px] rounded-[28px]",
        xlarge: "h-[96px] rounded-[48px]",
      },
      orientation: {
        horizontal: "",
        vertical: "w-full flex-1",
      },
    },
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
 */
export const sliderInactiveTrackVariants = cva(
  [
    // Color
    "bg-secondary-container",
    // Disabled — driven by root group/slider data-disabled attr
    "group-data-[disabled]/slider:bg-on-surface/10",
    // Layout
    "flex-1",
    "overflow-hidden",
    "relative",
  ],
  {
    variants: {
      size: {
        xsmall: "h-[16px] rounded-[8px]",
        small: "h-[16px] rounded-[8px]",
        medium: "h-[40px] rounded-[20px]",
        large: "h-[56px] rounded-[28px]",
        xlarge: "h-[96px] rounded-[48px]",
      },
      orientation: {
        horizontal: "",
        vertical: "w-full h-auto",
      },
    },
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
        vertical: "h-[4px] w-full",
      },
    },
    compoundVariants: [
      // Vertical: override to height-based narrowing
      {
        orientation: "vertical",
        class: "group-data-[pressed]/slider-thumb:h-[2px]",
      },
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
  // Will-change hint for browser compositing
  "will-change-[transform,opacity]",
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
