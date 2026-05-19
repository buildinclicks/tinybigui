import { cva, type VariantProps } from "class-variance-authority";

/**
 * CVA variants for the Slider container (root element — the `role="group"` div).
 *
 * MD3 spec §4.2: Container height equals handle height for each size.
 * MD3 spec §4.1, §10.9: In vertical orientation, container width = handle height (dimensions transposed).
 * Applied via className on SliderHeadless so the groupProps div receives these classes.
 */
export const sliderContainerVariants = cva(
  [
    "relative",
    "flex",
    "items-center",
    "w-full",
    "touch-none", // NOTE: measurement-derived value from MD3 spec; permitted exception — prevents browser scroll on drag
    "select-none",
  ],
  {
    variants: {
      size: {
        // NOTE: measurement-derived values from MD3 spec §4.2; permitted exception
        xsmall: "h-[44px]",
        small: "h-[44px]",
        medium: "h-[52px]",
        large: "h-[68px]",
        xlarge: "h-[108px]",
      },
      orientation: {
        // Horizontal: w-full already in base; flex-row is default flex direction
        horizontal: "",
        // Vertical: transposed — container height fills parent, width = handle height (per size)
        // flex-col stacks label → track → output vertically
        // NOTE: h-full requires a parent with defined height; w-[...] set via compound variants
        vertical: "h-full flex-col",
      },
      disabled: {
        true: "cursor-not-allowed pointer-events-none",
        false: "cursor-pointer",
      },
    },
    compoundVariants: [
      // Vertical: container WIDTH = handle height (MD3 §10.9 — dimensions transposed)
      // Overrides w-full from base via tailwind-merge in cn()
      // NOTE: measurement-derived values from MD3 spec §4.2; permitted exception
      { orientation: "vertical", size: "xsmall", className: "w-[44px]" },
      { orientation: "vertical", size: "small", className: "w-[44px]" },
      { orientation: "vertical", size: "medium", className: "w-[52px]" },
      { orientation: "vertical", size: "large", className: "w-[68px]" },
      { orientation: "vertical", size: "xlarge", className: "w-[108px]" },
    ],
    defaultVariants: {
      size: "xsmall",
      orientation: "horizontal",
      disabled: false,
    },
  }
);

/**
 * CVA for the active track (filled portion).
 *
 * MD3 spec §6, §8.1, §10.2: `bg-primary`, size-dependent outer corners, 2dp inner corners.
 * Inner corner (near handle) is always 2dp regardless of size.
 * MD3 spec §10.9: In vertical orientation, track thickness becomes width (not height).
 * Transition: flex-basis spatial spring (md3-motion spring-standard-fast-spatial).
 */
export const sliderActiveTrackVariants = cva(
  ["bg-primary", "flex-shrink-0", "overflow-hidden", "relative"],
  {
    variants: {
      size: {
        // NOTE: measurement-derived values from MD3 spec §4.2, §6 Corner tokens; permitted exception
        // Corner classes are in compound variants to avoid conflicts with vertical orientation corners
        xsmall: "h-[16px] rounded-l-[16px] rounded-r-[2px]", // corner.large outer (16dp), 2dp inner
        small: "h-[16px] rounded-l-[16px] rounded-r-[2px]",
        medium: "h-[40px] rounded-l-[12px] rounded-r-[2px]", // corner.medium outer (12dp), 2dp inner
        large: "h-[56px] rounded-l-[16px] rounded-r-[2px]", // corner.large outer (16dp), 2dp inner
        xlarge: "h-[96px] rounded-l-[28px] rounded-r-[2px]", // corner.extra-large outer (28dp), 2dp inner
      },
      orientation: {
        horizontal: "",
        // Vertical: track thickness is now width; flex-basis (inline style) controls height.
        // h-[...] from size variant is overridden by flex-basis in a flex-col container.
        // Individual corner classes (rounded-tl/tr/bl/br) override the horizontal rounded-l/r
        // via tailwind-merge conflict resolution in cn().
        vertical: "",
      },
      disabled: {
        true: "bg-on-surface opacity-38",
        false: "",
      },
    },
    compoundVariants: [
      // Vertical: width = track thickness, corners transposed (bottom = outer, top = inner near handle)
      // Using individual corner utilities so tailwind-merge correctly resolves conflicts with
      // the horizontal rounded-l/rounded-r classes from size variants.
      // NOTE: measurement-derived values from MD3 spec §4.2, §6 Corner tokens; permitted exception
      {
        orientation: "vertical",
        size: "xsmall",
        className: "w-[16px] rounded-tl-[2px] rounded-tr-[2px] rounded-bl-[16px] rounded-br-[16px]",
      },
      {
        orientation: "vertical",
        size: "small",
        className: "w-[16px] rounded-tl-[2px] rounded-tr-[2px] rounded-bl-[16px] rounded-br-[16px]",
      },
      {
        orientation: "vertical",
        size: "medium",
        className: "w-[40px] rounded-tl-[2px] rounded-tr-[2px] rounded-bl-[12px] rounded-br-[12px]",
      },
      {
        orientation: "vertical",
        size: "large",
        className: "w-[56px] rounded-tl-[2px] rounded-tr-[2px] rounded-bl-[16px] rounded-br-[16px]",
      },
      {
        orientation: "vertical",
        size: "xlarge",
        className: "w-[96px] rounded-tl-[2px] rounded-tr-[2px] rounded-bl-[28px] rounded-br-[28px]",
      },
    ],
    defaultVariants: {
      size: "xsmall",
      orientation: "horizontal",
      disabled: false,
    },
  }
);

/**
 * CVA for the inactive track (unfilled portion).
 *
 * MD3 spec §6, §8.1, §10.2: `bg-secondary-container`, 2dp inner corners, size-dependent outer corners.
 * MD3 spec §10.9: In vertical orientation, track thickness becomes width (not height).
 * Disabled: `bg-on-surface` at 10% opacity via Tailwind alpha modifier.
 */
export const sliderInactiveTrackVariants = cva(
  ["bg-secondary-container", "flex-1", "overflow-hidden", "relative"],
  {
    variants: {
      size: {
        // NOTE: measurement-derived values from MD3 spec §4.2, §6 Corner tokens; permitted exception
        xsmall: "h-[16px] rounded-l-[2px] rounded-r-[16px]",
        small: "h-[16px] rounded-l-[2px] rounded-r-[16px]",
        medium: "h-[40px] rounded-l-[2px] rounded-r-[12px]",
        large: "h-[56px] rounded-l-[2px] rounded-r-[16px]",
        xlarge: "h-[96px] rounded-l-[2px] rounded-r-[28px]",
      },
      orientation: {
        horizontal: "",
        // Vertical: track thickness is width; flex-1 controls height growth.
        // Individual corner classes override horizontal rounded-l/r via tailwind-merge.
        vertical: "",
      },
      disabled: {
        true: "bg-on-surface/10", // MD3 §8.2: 10% opacity via background alpha
        false: "",
      },
    },
    compoundVariants: [
      // Vertical: width = track thickness, corners transposed (top = outer, bottom = inner near handle)
      // NOTE: measurement-derived values from MD3 spec §4.2, §6 Corner tokens; permitted exception
      {
        orientation: "vertical",
        size: "xsmall",
        className: "w-[16px] rounded-tl-[16px] rounded-tr-[16px] rounded-bl-[2px] rounded-br-[2px]",
      },
      {
        orientation: "vertical",
        size: "small",
        className: "w-[16px] rounded-tl-[16px] rounded-tr-[16px] rounded-bl-[2px] rounded-br-[2px]",
      },
      {
        orientation: "vertical",
        size: "medium",
        className: "w-[40px] rounded-tl-[12px] rounded-tr-[12px] rounded-bl-[2px] rounded-br-[2px]",
      },
      {
        orientation: "vertical",
        size: "large",
        className: "w-[56px] rounded-tl-[16px] rounded-tr-[16px] rounded-bl-[2px] rounded-br-[2px]",
      },
      {
        orientation: "vertical",
        size: "xlarge",
        className: "w-[96px] rounded-tl-[28px] rounded-tr-[28px] rounded-bl-[2px] rounded-br-[2px]",
      },
    ],
    defaultVariants: {
      size: "xsmall",
      orientation: "horizontal",
      disabled: false,
    },
  }
);

/**
 * CVA for the handle/thumb element.
 *
 * MD3 spec §6, §9, §10.3: 4dp wide, full container height, 2dp border-radius.
 * MD3 spec §10.9: In vertical orientation, width and height are transposed —
 *   handle becomes 4dp tall (main axis) × full width (cross axis).
 * Width narrows to 2dp on press (md3 spec §9.3).
 * Motion: transition-[width] with duration-short2 + ease-standard (Appendix E).
 */
export const sliderHandleVariants = cva(
  [
    "bg-primary",
    "rounded-[2px]", // NOTE: measurement-derived value from MD3 spec §10.3 (2dp handle border-radius); permitted exception
    "flex-shrink-0",
    "relative",
    "z-10",
    "outline-none",
    // Motion — handle width change on press (MD3 Appendix E: duration-short2 + ease-standard)
    "transition-[width]",
    "duration-short2",
    "ease-standard",
  ],
  {
    variants: {
      size: {
        // NOTE: measurement-derived values from MD3 spec §4.2, §10.3; permitted exception
        xsmall: "w-[4px] h-[44px]",
        small: "w-[4px] h-[44px]",
        medium: "w-[4px] h-[52px]",
        large: "w-[4px] h-[68px]",
        xlarge: "w-[4px] h-[108px]",
      },
      orientation: {
        horizontal: "",
        // Vertical: dimensions transposed. h-[4px] overrides size-variant h-[...] via tailwind-merge;
        // w-full overrides size-variant w-[4px] via tailwind-merge (both in cn() call at styled layer).
        // NOTE: measurement-derived value from MD3 spec §10.3 (4dp handle width); permitted exception
        vertical: "h-[4px] w-full",
      },
      pressed: {
        true: "w-[2px]", // NOTE: measurement-derived value from MD3 spec §10.3 (2dp pressed width); permitted exception
        false: "",
      },
      disabled: {
        true: "bg-on-surface opacity-38",
        false: "",
      },
    },
    defaultVariants: {
      size: "xsmall",
      orientation: "horizontal",
      pressed: false,
      disabled: false,
    },
  }
);

/**
 * CVA for the handle's state layer overlay.
 *
 * MD3 spec §8.3: Inset overlay within the handle.
 * - Hover: on-primary at 8% opacity
 * - Focus/Pressed: on-primary at 10% opacity
 * Motion: transition-opacity with duration-short1 + ease-standard (Appendix E).
 */
export const sliderHandleStateLayerVariants = cva(
  [
    "absolute",
    "inset-0",
    "rounded-[4px]", // NOTE: measurement-derived value from MD3 spec §10.3 (4dp state layer border-radius); permitted exception
    "bg-on-primary",
    "pointer-events-none",
    // Motion — state layer opacity (MD3 Appendix E: duration-short1 + ease-standard)
    "transition-opacity",
    "duration-short1",
    "ease-standard",
  ],
  {
    variants: {
      state: {
        enabled: "opacity-0",
        hovered: "opacity-8", // MD3 §8.3: 8% hover
        pressed: "opacity-10", // MD3 §8.3: 10% pressed
        focused: "opacity-10", // MD3 §8.3: 10% focus
        disabled: "opacity-0",
      },
    },
    defaultVariants: {
      state: "enabled",
    },
  }
);

/**
 * CVA for the track layout container (holds active track + handle + inactive track).
 *
 * MD3 spec §7, §10.2: Flex row with 6dp gap between handle and track segments.
 * The 6dp gap is the `thumbTrackGapSize` token from MD3 spec.
 * MD3 spec §10.9: Vertical orientation uses flex-col-reverse for bottom-to-top fill.
 * `relative` is required so the absolute stops overlay is positioned within.
 */
export const sliderTrackLayoutVariants = cva(
  [
    "relative",
    "flex",
    "items-center",
    "gap-[6px]", // NOTE: measurement-derived value from MD3 spec §2, §6 (thumbTrackGapSize: 6dp); permitted exception
  ],
  {
    variants: {
      orientation: {
        // Horizontal: full width, left-to-right fill
        horizontal: "flex-row w-full",
        // Vertical: full height, bottom-to-top fill (flex-col-reverse places active track at bottom)
        vertical: "flex-col-reverse h-full",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

/**
 * CVA for the stops overlay container.
 *
 * An absolute overlay positioned within the track layout, spanning its full area.
 * Dots are distributed with justify-between.
 * Padding from track edges: 4dp.
 * MD3 spec §5.2, §10.5.
 */
export const sliderStopsContainerVariants = cva([
  "absolute",
  "inset-0",
  "flex",
  "items-center",
  "justify-between",
  "px-[4px]", // NOTE: measurement-derived value from MD3 spec §10.5 (stopPadding: 4dp); permitted exception
  "pointer-events-none",
  "z-0",
]);

/**
 * CVA for individual stop indicator dots.
 *
 * MD3 spec §5.2, §10.5: 4dp circular dots, color depends on whether dot is on
 * active or inactive track.
 */
export const sliderStopDotVariants = cva(
  [
    "rounded-full",
    "flex-shrink-0",
    "w-[4px]", // NOTE: measurement-derived value from MD3 spec §10.5 (stopIndicatorSize: 4dp); permitted exception
    "h-[4px]",
  ],
  {
    variants: {
      /**
       * Whether this dot is positioned on the active track portion.
       * Determines the dot color per MD3 spec §5.2.
       */
      onActiveTrack: {
        true: "bg-on-primary", // Light dots on primary background
        false: "bg-on-secondary-container", // Dark dots on secondary-container background
      },
      disabled: {
        true: "opacity-38",
        false: "",
      },
    },
    defaultVariants: {
      onActiveTrack: false,
      disabled: false,
    },
  }
);

/**
 * CVA for end track stops (4dp dots at track endpoints).
 *
 * MD3 spec §10.6: positioned 4dp from track edge, vertically centered.
 */
export const sliderTrackStopVariants = cva(
  [
    "absolute",
    "top-1/2",
    "-translate-y-1/2",
    "w-[4px]", // NOTE: measurement-derived value from MD3 spec §10.6 (trackStopDiameter: 4dp); permitted exception
    "h-[4px]",
    "rounded-full",
    "bg-on-secondary-container",
    "pointer-events-none",
  ],
  {
    variants: {
      position: {
        start: "left-[4px]", // NOTE: measurement-derived (trackStopOffset: 4dp); permitted exception
        end: "right-[4px]",
      },
    },
    defaultVariants: {
      position: "end",
    },
  }
);

/**
 * CVA for the value indicator (floating pill label above the handle).
 *
 * MD3 spec §5.3, §10.4:
 * - Shape: pill (border-radius 1000dp = rounded-full)
 * - Background: inverse-surface
 * - Min-width: 48dp
 * - Padding: 16dp horizontal, 12dp vertical
 * - Position: centered above handle via absolute + left-1/2 + -translate-x-1/2
 * - Only visible during Pressed state; hidden with opacity-0 + scale-0
 * Motion: standard fast effects (small component, utility tooltip).
 */
export const sliderValueIndicatorVariants = cva(
  [
    "absolute",
    "left-1/2",
    "-translate-x-1/2",
    "bottom-[calc(100%+4px)]", // NOTE: measurement-derived (4dp gap above handle); permitted exception
    "bg-inverse-surface",
    "rounded-full", // pill shape (1000dp radius)
    "px-[16px]", // NOTE: measurement-derived (valueIndicatorPaddingH: 16dp); permitted exception
    "py-[12px]", // NOTE: measurement-derived (valueIndicatorPaddingV: 12dp); permitted exception
    "min-w-[48px]", // NOTE: measurement-derived (valueIndicatorWidth: 48dp); permitted exception
    "flex",
    "items-center",
    "justify-center",
    "pointer-events-none",
    "z-20",
    // Motion — value indicator appear/disappear (MD3 §9.3: standard fast effects for small tooltip)
    "transition-[opacity,transform]",
    "duration-spring-standard-fast-effects",
    "ease-spring-standard-fast-effects",
  ],
  {
    variants: {
      visible: {
        true: "opacity-100 scale-100",
        false: "opacity-0 scale-0",
      },
    },
    defaultVariants: {
      visible: false,
    },
  }
);

/**
 * CVA for value indicator text content.
 *
 * MD3 spec §5.3: Label Large typography — 14px, weight 500, line-height 20px, tracking 0.1px.
 * Color: inverse-on-surface.
 */
export const sliderValueIndicatorTextVariants = cva([
  "text-inverse-on-surface",
  "text-label-large", // MD3 Label Large typescale token
  "whitespace-nowrap",
  "text-center",
]);

/**
 * CVA for the inset icon element rendered inside the active track.
 *
 * MD3 spec §5.1, §10.7:
 * - Only available for Medium, Large, XLarge sizes (Standard variant only)
 * - Positioned absolutely inside the active track
 * - Horizontal: 8dp from left edge, vertically centered
 * - Vertical: 8dp from bottom edge, horizontally centered
 * - Icon sizes: 24×24dp (Medium, Large), 32×32dp (XLarge)
 * - Color: on-primary (icon sits on primary-colored active track)
 */
export const sliderInsetIconVariants = cva(
  ["absolute", "text-on-primary", "pointer-events-none", "flex", "items-center", "justify-center"],
  {
    variants: {
      size: {
        // NOTE: measurement-derived values from MD3 spec §10.7 (icon sizes); permitted exception
        medium: "w-[24px] h-[24px]",
        large: "w-[24px] h-[24px]",
        xlarge: "w-[32px] h-[32px]",
      },
      orientation: {
        // Horizontal: 8dp from active track left edge, vertically centered
        // NOTE: measurement-derived value from MD3 spec §10.7 (iconOffset: 8dp); permitted exception
        horizontal: "left-[8px] top-1/2 -translate-y-1/2",
        // Vertical: 8dp from active track bottom edge (outer end), horizontally centered
        vertical: "bottom-[8px] left-1/2 -translate-x-1/2",
      },
    },
    defaultVariants: {
      size: "medium",
      orientation: "horizontal",
    },
  }
);

// ─── Variant Prop Types ────────────────────────────────────────────────────────

export type SliderContainerVariants = VariantProps<typeof sliderContainerVariants>;
export type SliderActiveTrackVariants = VariantProps<typeof sliderActiveTrackVariants>;
export type SliderInactiveTrackVariants = VariantProps<typeof sliderInactiveTrackVariants>;
export type SliderHandleVariants = VariantProps<typeof sliderHandleVariants>;
export type SliderHandleStateLayerVariants = VariantProps<typeof sliderHandleStateLayerVariants>;
export type SliderTrackLayoutVariants = VariantProps<typeof sliderTrackLayoutVariants>;
export type SliderStopsContainerVariants = VariantProps<typeof sliderStopsContainerVariants>;
export type SliderStopDotVariants = VariantProps<typeof sliderStopDotVariants>;
export type SliderTrackStopVariants = VariantProps<typeof sliderTrackStopVariants>;
export type SliderValueIndicatorVariants = VariantProps<typeof sliderValueIndicatorVariants>;
export type SliderInsetIconVariants = VariantProps<typeof sliderInsetIconVariants>;
