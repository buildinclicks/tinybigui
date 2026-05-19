import { cva, type VariantProps } from "class-variance-authority";

/**
 * CVA variants for the Slider container (root element — the `role="group"` div).
 *
 * MD3 spec §4.2: Container height equals handle height for each size.
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
      disabled: {
        true: "cursor-not-allowed pointer-events-none",
        false: "cursor-pointer",
      },
    },
    defaultVariants: {
      size: "xsmall",
      disabled: false,
    },
  }
);

/**
 * CVA for the active track (filled portion).
 *
 * MD3 spec §6, §8.1, §10.2: `bg-primary`, size-dependent outer corners, 2dp inner corners.
 * Inner corner (near handle) is always 2dp regardless of size.
 * Transition: flex-basis spatial spring (md3-motion spring-standard-fast-spatial).
 */
export const sliderActiveTrackVariants = cva(
  ["bg-primary", "flex-shrink-0", "overflow-hidden", "relative"],
  {
    variants: {
      size: {
        // NOTE: measurement-derived values from MD3 spec §4.2, §6 Corner tokens; permitted exception
        xsmall: "h-[16px] rounded-l-[16px] rounded-r-[2px]", // corner.large outer (16dp), 2dp inner
        small: "h-[16px] rounded-l-[16px] rounded-r-[2px]",
        medium: "h-[40px] rounded-l-[12px] rounded-r-[2px]", // corner.medium outer (12dp), 2dp inner
        large: "h-[56px] rounded-l-[16px] rounded-r-[2px]", // corner.large outer (16dp), 2dp inner
        xlarge: "h-[96px] rounded-l-[28px] rounded-r-[2px]", // corner.extra-large outer (28dp), 2dp inner
      },
      disabled: {
        true: "bg-on-surface opacity-38",
        false: "",
      },
    },
    defaultVariants: {
      size: "xsmall",
      disabled: false,
    },
  }
);

/**
 * CVA for the inactive track (unfilled portion).
 *
 * MD3 spec §6, §8.1, §10.2: `bg-secondary-container`, 2dp inner corners, size-dependent outer corners.
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
      disabled: {
        true: "bg-on-surface/10", // MD3 §8.2: 10% opacity via background alpha
        false: "",
      },
    },
    defaultVariants: {
      size: "xsmall",
      disabled: false,
    },
  }
);

/**
 * CVA for the handle/thumb element.
 *
 * MD3 spec §6, §9, §10.3: 4dp wide, full container height, 2dp border-radius.
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
 */
export const sliderTrackLayoutVariants = cva(
  [
    "flex",
    "items-center",
    "w-full",
    "gap-[6px]", // NOTE: measurement-derived value from MD3 spec §2, §6 (thumbTrackGapSize: 6dp); permitted exception
  ],
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col-reverse", // Bottom-to-top fill for vertical orientation
      },
    },
    defaultVariants: {
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
