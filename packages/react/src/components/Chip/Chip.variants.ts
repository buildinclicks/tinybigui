import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Chip Variants (Slot-based "Variants vs States" architecture)
 *
 * Architecture: Variants vs States
 * - CVA holds design-time structure only (chipType × surface).
 * - All interaction/selection states are driven by data-* attributes on the root
 *   via group-data-[x]/chip Tailwind selectors in each slot's base classes.
 * - Content flags (data-with-leading, data-with-trailing) are set explicitly by
 *   the component and consumed by the root slot for padding adjustments.
 *
 * Slot responsibilities:
 *   chipVariants             — root button/span; shape, color, elevation, padding
 *   chipStateLayerVariants   — hover/focus/press opacity overlay (absolute inset)
 *   chipFocusRingVariants    — keyboard focus outline, outside overflow-hidden
 *   chipLeadingIconVariants  — leading icon wrapper; color per type + selected/disabled
 *   chipTrailingIconVariants — trailing icon wrapper; assist/suggestion only
 *   chipCheckmarkVariants    — filter chip checkmark container (width spring)
 *   chipLabelVariants        — label text slot
 *   chipRemoveButtonVariants — input chip remove button wrapper
 *   chipRemoveStateLayerVariants — state layer inside remove button circle
 *
 * MD3 Spec (Expressive):
 *   Shape:   corner-small (8dp) → rounded-sm
 *   Height:  32dp → h-8
 *   Padding: 16dp base; 8dp leading side with icon
 *   Gap:     8dp → gap-2
 *   Icon:    18px × 18px
 *   State-layer opacities: hover 8% | focus 10% | pressed 10%
 *   Disabled: container transparent, border 12% opacity, content 38% opacity
 *
 * Per-type color tokens (MD3 strict):
 *   assist:     bg=transparent border=outline      label=on-surface     leadingIcon=primary   stateLayer=on-surface
 *   filter:     bg=transparent border=outline      label=on-surface-variant                   stateLayer=on-surface-variant
 *   filter sel: bg=secondary-container border=none label=on-secondary-container               stateLayer=on-secondary-container
 *   input:      bg=transparent border=outline-variant label=on-surface-variant                stateLayer=on-surface-variant
 *   suggestion: bg=transparent border=outline      label=on-surface-variant                   stateLayer=on-surface-variant
 *
 * Elevation per state (elevated surface):
 *   base=1 → hover=2 → focus/pressed=1 (doubled pressed selector wins over hover)
 */

// ─── ROOT ─────────────────────────────────────────────────────────────────────

/**
 * Root chip element.
 *
 * IMPORTANT — overflow is intentionally NOT on the root.
 * Clipping is delegated to the state-layer and ripple containers via
 * `overflow-hidden rounded-[inherit]` so the focus ring span (inset-[-3px])
 * can extend outside the chip boundary and remain fully visible.
 *
 * Padding is driven by content flags:
 *   base px-4 (16dp)
 *   data-[with-leading]: pl-2 pr-4  (8dp leading, 16dp trailing)
 *   data-[with-trailing]: pl-4 pr-2
 *   data-[with-leading][with-trailing]: pl-2 pr-2
 * These are self-targeting data-[x]: selectors (no group scope needed).
 */
export const chipVariants = cva(
  [
    // Layout + shape
    "relative inline-flex items-center justify-center",
    "h-8 rounded-sm cursor-pointer select-none",
    "text-label-large gap-2",
    // Base padding (no icons)
    "px-4",
    // Content-flag padding overrides (self-targeting)
    "data-[with-leading]:pl-2 data-[with-leading]:pr-4",
    "data-[with-trailing]:pr-2",
    // Effects transition (color/bg/shadow/border)
    "transition-[background-color,border-color,box-shadow,color]",
    "duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
    // Disabled self-targeting
    "data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none",
    "data-[disabled]:text-on-surface/38 data-[disabled]:border-on-surface/12",
    "data-[disabled]:bg-transparent data-[disabled]:shadow-none",
  ],
  {
    variants: {
      /**
       * MD3 chip type — determines base color tokens.
       */
      chipType: {
        /**
         * Assist — transparent + outline border; label on-surface; leading icon primary.
         * State layer color: on-surface.
         */
        assist: ["bg-transparent border border-outline text-on-surface"],

        /**
         * Filter — transparent + outline border; label on-surface-variant.
         * Selected state via group-data selectors (no CVA variant key).
         * State layer color: on-surface-variant → on-secondary-container when selected.
         */
        filter: [
          "bg-transparent border border-outline text-on-surface-variant",
          // Selected: secondary-container fill, no border, on-secondary-container label
          "group-data-[selected]/chip:bg-secondary-container",
          "group-data-[selected]/chip:border-0",
          "group-data-[selected]/chip:text-on-secondary-container",
          // Disabled + selected overrides (self-targeting, doubled to win over singly-chained selected)
          "data-[selected]:data-[disabled]:bg-on-surface/12",
          "data-[selected]:data-[disabled]:border-0",
        ],

        /**
         * Input — transparent + outline-variant border; label/icons on-surface-variant.
         * State layer color: on-surface-variant.
         */
        input: ["bg-transparent border border-outline-variant text-on-surface-variant"],

        /**
         * Suggestion — transparent + outline border; label on-surface-variant.
         * State layer color: on-surface-variant.
         */
        suggestion: ["bg-transparent border border-outline text-on-surface-variant"],
      },

      /**
       * Surface style — elevated adds shadow and surface-container-low background.
       * All four chip types support elevated.
       * Note: "flat" and the deprecated "tonal" both resolve to the same base style
       * (transparent + border from chipType). The elevated compound variant overrides.
       */
      surface: {
        flat: "",
        elevated: "",
        /** @deprecated Use `flat` instead. */
        tonal: "",
      },
    },

    compoundVariants: [
      // ── Elevated surface (all chip types) ─────────────────────────────────
      // Shared elevated base: surface-container-low fill, no border, level-1 elevation
      {
        surface: "elevated",
        chipType: "assist",
        className: [
          "bg-surface-container-low border-0 shadow-elevation-1",
          "data-[hovered]:shadow-elevation-2",
          "data-[focus-visible]:shadow-elevation-1",
          "data-[pressed]:data-[pressed]:shadow-elevation-1",
        ],
      },
      {
        surface: "elevated",
        chipType: "filter",
        className: [
          "bg-surface-container-low border-0 shadow-elevation-1",
          "data-[hovered]:shadow-elevation-2",
          "data-[focus-visible]:shadow-elevation-1",
          "data-[pressed]:data-[pressed]:shadow-elevation-1",
          // Selected overrides bg; elevation stays
          "group-data-[selected]/chip:bg-secondary-container",
        ],
      },
      {
        surface: "elevated",
        chipType: "input",
        className: [
          "bg-surface-container-low border-0 shadow-elevation-1",
          "data-[hovered]:shadow-elevation-2",
          "data-[focus-visible]:shadow-elevation-1",
          "data-[pressed]:data-[pressed]:shadow-elevation-1",
        ],
      },
      {
        surface: "elevated",
        chipType: "suggestion",
        className: [
          "bg-surface-container-low border-0 shadow-elevation-1",
          "data-[hovered]:shadow-elevation-2",
          "data-[focus-visible]:shadow-elevation-1",
          "data-[pressed]:data-[pressed]:shadow-elevation-1",
        ],
      },
      // Deprecated tonal maps to flat (same as no override)
      {
        surface: "tonal",
        chipType: "assist",
        className: "",
      },
      {
        surface: "tonal",
        chipType: "filter",
        className: "",
      },
      {
        surface: "tonal",
        chipType: "input",
        className: "",
      },
      {
        surface: "tonal",
        chipType: "suggestion",
        className: "",
      },
    ],

    defaultVariants: {
      chipType: "assist",
      surface: "flat",
    },
  }
);

// ─── STATE LAYER ─────────────────────────────────────────────────────────────

/**
 * State layer — absolute inset overlay that transitions opacity on interaction.
 *
 * overflow-hidden clips the ripple + state layer to the chip shape without
 * affecting the focus ring (which is a sibling outside, not a child inside).
 *
 * Color follows MD3 per type:
 *   assist    → bg-on-surface
 *   filter    → bg-on-surface-variant; selected → bg-on-secondary-container
 *   input     → bg-on-surface-variant
 *   suggestion → bg-on-surface-variant
 *
 * Opacities: 0 rest → 8% hover → 10% focus → 10% pressed (doubled wins)
 */
export const chipStateLayerVariants = cva(
  [
    "absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none opacity-0",
    "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
    // Hover: 8%
    "group-data-[hovered]/chip:opacity-8",
    // Focus: 10%
    "group-data-[focus-visible]/chip:opacity-10",
    // Pressed: 10%, doubled selector wins over hover
    "group-data-[pressed]/chip:group-data-[pressed]/chip:opacity-10",
    // No state layer when disabled
    "group-data-[disabled]/chip:hidden",
  ],
  {
    variants: {
      chipType: {
        assist: "bg-on-surface",
        filter: [
          "bg-on-surface-variant",
          // Selected: switch to on-secondary-container color
          "group-data-[selected]/chip:bg-on-secondary-container",
        ],
        input: "bg-on-surface-variant",
        suggestion: "bg-on-surface-variant",
      },
    },
    defaultVariants: { chipType: "assist" },
  }
);

// ─── FOCUS RING ────────────────────────────────────────────────────────────────

/**
 * Focus ring overlay.
 *
 * Rendered as an absolute `<span>` with `inset-[-3px]` so it extends 3px
 * outside the chip boundary. This requires that `overflow-hidden` is NOT
 * on the root — overflow clipping is moved to the state layer instead.
 *
 * Always present in the DOM (opacity-0 at rest) for smooth CSS transitions.
 */
export const chipFocusRingVariants = cva([
  "pointer-events-none absolute inset-[-3px] rounded-sm",
  "outline outline-2 outline-offset-0 outline-secondary",
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "opacity-0",
  "group-data-[focus-visible]/chip:opacity-100",
]);

// ─── LEADING ICON ─────────────────────────────────────────────────────────────

/**
 * Leading icon wrapper.
 *
 * MD3 per-type icon color:
 *   assist    → primary (unselected/selected)
 *   filter    → on-surface-variant; selected → on-secondary-container
 *   input     → on-surface-variant
 *   suggestion → on-surface-variant
 *
 * Disabled: on-surface/38 for all types.
 * `invisible` (not `hidden`) to keep layout stable if icon is conditionally rendered.
 */
export const chipLeadingIconVariants = cva(
  [
    "relative z-10 inline-flex shrink-0 items-center justify-center size-[18px]",
    "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
    "group-data-[disabled]/chip:text-on-surface/38",
  ],
  {
    variants: {
      chipType: {
        assist: "text-primary",
        filter: [
          "text-on-surface-variant",
          "group-data-[selected]/chip:text-on-secondary-container",
        ],
        input: "text-on-surface-variant",
        suggestion: "text-on-surface-variant",
      },
    },
    defaultVariants: { chipType: "assist" },
  }
);

// ─── TRAILING ICON ────────────────────────────────────────────────────────────

/**
 * Trailing icon wrapper (Assist and Suggestion chips only).
 * Always on-surface-variant per MD3 spec.
 */
export const chipTrailingIconVariants = cva([
  "relative z-10 inline-flex shrink-0 items-center justify-center size-[18px]",
  "text-on-surface-variant",
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "group-data-[disabled]/chip:text-on-surface/38",
]);

// ─── CHECKMARK (FILTER) ───────────────────────────────────────────────────────

/**
 * Filter chip checkmark container.
 *
 * Animated width (spatial spring) + opacity (effects spring) on selection change.
 * Width transition is intentionally spatial since it moves adjacent content.
 * The inner SVG uses effects transition for opacity so color/opacity don't overshoot.
 */
export const chipCheckmarkVariants = cva([
  "inline-flex overflow-hidden shrink-0",
  // Spatial spring for width (moves adjacent text — this is a spatial animation)
  "transition-[width] duration-spring-standard-fast-spatial ease-spring-standard-fast-spatial",
  // Collapsed state
  "w-0",
  // Expanded state when selected
  "group-data-[selected]/chip:w-[18px]",
]);

/**
 * Inner checkmark icon wrapper — opacity only (effects token, no overshoot).
 */
export const chipCheckmarkIconVariants = cva([
  "inline-flex items-center justify-center size-[18px] shrink-0",
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "opacity-0",
  "group-data-[selected]/chip:opacity-100",
  // Color: on-secondary-container when selected; inherits on-surface-variant at rest (invisible)
  "text-on-secondary-container",
  "group-data-[disabled]/chip:text-on-surface/38",
]);

// ─── LABEL ────────────────────────────────────────────────────────────────────

/**
 * Label text wrapper.
 * Typography and color are inherited from the root chipVariants classes.
 * z-10 keeps it above the state layer and ripple overlays.
 */
export const chipLabelVariants = cva(["relative z-10 inline-flex items-center"]);

// ─── REMOVE BUTTON (INPUT) ───────────────────────────────────────────────────

/**
 * Remove button wrapper for input chips.
 *
 * MD3: 18dp circular interactive area with its own state layer.
 * Uses `group/chip-remove` as a separate group scope so its own state
 * layer doesn't interfere with the main chip's `group/chip` selectors.
 *
 * The remove button is a separate focusable element (Tab stop) inside
 * the chip wrapper — it must NOT inherit the chip's press/hover state.
 */
export const chipRemoveButtonVariants = cva([
  "relative z-10 inline-flex size-[18px] shrink-0 items-center justify-center",
  "rounded-full cursor-pointer",
  "text-on-surface-variant",
  "group/chip-remove",
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "data-[disabled]:text-on-surface/38 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none",
]);

/**
 * State layer for the remove button's circular hit area.
 * Uses `group-data-[x]/chip-remove` to scope to the remove button only.
 */
export const chipRemoveStateLayerVariants = cva([
  // Slightly larger circle (32dp touch target centered on 18dp icon)
  "absolute inset-[-7px] rounded-full pointer-events-none opacity-0",
  "bg-on-surface-variant",
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "group-data-[hovered]/chip-remove:opacity-8",
  "group-data-[focus-visible]/chip-remove:opacity-10",
  "group-data-[pressed]/chip-remove:group-data-[pressed]/chip-remove:opacity-10",
  "group-data-[disabled]/chip-remove:hidden",
]);

// ─── EXPORTED TYPES ───────────────────────────────────────────────────────────

export type ChipVariants = VariantProps<typeof chipVariants>;
export type ChipStateLayerVariants = VariantProps<typeof chipStateLayerVariants>;
export type ChipLeadingIconVariants = VariantProps<typeof chipLeadingIconVariants>;
