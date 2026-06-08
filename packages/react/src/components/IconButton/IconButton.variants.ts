import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Expressive — IconButton Variants (slot-based CVA)
 *
 * Architecture: Variants vs States
 * ─────────────────────────────────
 * - CVA holds design-time choices only (variant, color, size, width, shape).
 * - All interaction/selection states are driven by data-* attributes on the
 *   root via group-data-[x]/icon-button Tailwind selectors in each slot's base
 *   classes — no state variants in CVA.
 * - compoundVariants = variant × color (and size × shape) only.
 *
 * CSS role-variable technique
 * ────────────────────────────
 * Per-variant colors are set as CSS custom properties via compoundVariants so
 * the state selectors in base classes only need to read the variable — they
 * never need to know the current variant/color.
 *
 *   --ib-bg            container background (at rest, non-toggleable)
 *   --ib-bg-off        container background when toggleable + unselected
 *   --ib-bg-on         container background when selected
 *   --ib-fg            icon/text color (at rest)
 *   --ib-fg-off        icon/text color when toggleable + unselected
 *   --ib-fg-on         icon/text color when selected
 *   --ib-sl            state layer color
 *   --ib-border        border color (outlined unselected)
 *   --ib-radius        corner radius at rest
 *   --ib-radius-press  corner radius when pressed (shape-morph)
 *
 * Slot responsibilities
 * ──────────────────────
 *   iconButtonRootVariants      — root button; carries group/icon-button, cursor,
 *                                 overflow, corner radius + transitions, min touch target
 *   iconButtonStateLayerVariants — hover/focus/pressed opacity ring (absolute overlay)
 *   iconButtonIconVariants       — icon wrapper; color + size only
 *
 * M3 Expressive Sizes (container height × icon size)
 * ───────────────────────────────────────────────────
 *   xsmall:  32dp / 20dp icon   → h-8  / icon size-5
 *   small:   40dp / 24dp icon   → h-10 / icon size-6
 *   medium:  56dp / 24dp icon   → h-14 / icon size-6  (default)
 *   large:   96dp / 32dp icon   → h-24 / icon size-8
 *   xlarge: 136dp / 40dp icon   → h-34 / icon size-10
 *
 * Width variants (narrow / default / wide) adjust container width per size:
 *   xsmall:  narrow 24dp / default 32dp / wide 40dp
 *   small:   narrow 32dp / default 40dp / wide 52dp
 *   medium:  narrow 48dp / default 56dp / wide 72dp
 *   large:   narrow 72dp / default 96dp / wide 128dp
 *   xlarge: narrow 96dp / default 136dp / wide 168dp
 *
 * Shape:
 *   round  → rounded-full  (press morphs to size-tiered corner)
 *   square → size-tiered corner at rest (no morph)
 *
 * Press shape morph (round only): on data-[pressed] the radius shrinks to the
 * same scale as the square shape for that size, giving the Expressive spring feel.
 * Driven by [--ib-radius-press] CSS variable consumed by the root.
 *
 * MD3 state-layer opacities:
 *   hover        opacity-8  (8%)
 *   focus-visible opacity-10 (10%)
 *   pressed      opacity-10 (10%)
 *   disabled container  bg-on-surface/12
 *   disabled content    text-on-surface/38
 */

// ─── SHAPE CORNER RADIUS LOOKUP ───────────────────────────────────────────────
// MD3 square shape corner radii per size tier:
//   xsmall / small: 12dp → rounded-xl (not in theme — use rounded-md = 12px)
//   medium:         16dp → rounded-lg
//   large / xlarge: 28dp → rounded-xl
// Press morph target for round shape matches the square radius for that size.

// ─── ROOT ─────────────────────────────────────────────────────────────────────

/**
 * Root button element.
 *
 * Carries:
 * - `group/icon-button` for child slot selectors
 * - Container dimensions (height × width per size × width-variant)
 * - Corner radius via --ib-radius CSS variable + shape-morph on press
 * - Background, border, text color consumed from --ib-* role variables
 * - Focus ring via group-data-[focus-visible]
 * - MD3-correct disabled (content opacity, not blanket opacity)
 */
export const iconButtonRootVariants = cva(
  [
    // Layout
    "relative inline-flex items-center justify-center",
    "cursor-pointer select-none",
    "overflow-hidden",

    // Corner radius driven by CSS variable — lets compoundVariants set the
    // correct value per shape×size without repeating transitions.
    "rounded-[var(--ib-radius,9999px)]",

    // Spatial transition: border-radius (shape morph on press/toggle)
    "transition-[border-radius,background-color,border-color,color,opacity]",
    "duration-expressive-fast-spatial ease-expressive-fast-spatial",

    // Background + border + text driven from CSS role variables
    "bg-[var(--ib-bg,transparent)]",
    "border border-[var(--ib-border,transparent)]",
    "text-[var(--ib-fg,currentColor)]",

    // Toggle: off state (data-toggle present but data-selected absent)
    // Uses doubly-chained selector to beat single-chain specificity of defaults
    "data-[toggle]:bg-[var(--ib-bg-off,var(--ib-bg,transparent))]",
    "data-[toggle]:text-[var(--ib-fg-off,var(--ib-fg,currentColor))]",

    // Selected state
    "data-[selected]:bg-[var(--ib-bg-on,var(--ib-bg,transparent))]",
    "data-[selected]:text-[var(--ib-fg-on,var(--ib-fg,currentColor))]",
    "data-[selected]:border-transparent",

    // Press shape-morph: radius collapses to --ib-radius-press on press
    // (only has visual effect when --ib-radius-press differs from --ib-radius)
    "data-[pressed]:rounded-[var(--ib-radius-press,var(--ib-radius,9999px))]",

    // Focus ring (outline, not a state layer — stays outside overflow-hidden
    // because it's drawn as outline on the root element itself)
    "outline-none",
    "group-data-[focus-visible]/icon-button:outline-2",
    "group-data-[focus-visible]/icon-button:outline-offset-2",
    "group-data-[focus-visible]/icon-button:outline-secondary",

    // Disabled — content opacity 38%, container handled per variant via CSS vars
    "data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none",
    "data-[disabled]:text-on-surface/38",
    // Filled/tonal/outlined-selected backgrounds collapse to on-surface/12 — set
    // via compoundVariants on the root for variants that have a container.
    // For variants with transparent bg (standard, outlined-unselected) we do nothing.
  ],
  {
    variants: {
      /**
       * Visual style variant (MD3 icon button types)
       */
      variant: {
        standard: "",
        filled: "data-[disabled]:bg-on-surface/12",
        tonal: "data-[disabled]:bg-on-surface/12",
        outlined: "",
      },

      /**
       * Color scheme — sets CSS role variables via compoundVariants.
       */
      color: {
        primary: "",
        secondary: "",
        tertiary: "",
        error: "",
      },

      /**
       * Size tier (M3 Expressive 5-tier)
       */
      size: {
        xsmall: "h-8",
        small: "h-10",
        medium: "h-14",
        large: "h-24",
        xlarge: "h-[8.5rem]",
      },

      /**
       * Width variant — adjusts container width
       */
      width: {
        narrow: "",
        default: "",
        wide: "",
      },

      /**
       * Shape — sets --ib-radius and --ib-radius-press
       */
      shape: {
        round: [
          "[--ib-radius:9999px]",
          // Press morph: round → md3 square radius for that size
          // (overridden per size in compoundVariants below)
          "[--ib-radius-press:9999px]",
        ],
        square: [
          // Base square radius set per size in compoundVariants
        ],
      },
    },

    compoundVariants: [
      // ══════════════════════════════════════════════════════════════════════
      // SIZE × WIDTH — container width
      // ══════════════════════════════════════════════════════════════════════
      { size: "xsmall", width: "narrow", className: "w-6" },
      { size: "xsmall", width: "default", className: "w-8" },
      { size: "xsmall", width: "wide", className: "w-10" },

      { size: "small", width: "narrow", className: "w-8" },
      { size: "small", width: "default", className: "w-10" },
      { size: "small", width: "wide", className: "w-13" },

      { size: "medium", width: "narrow", className: "w-12" },
      { size: "medium", width: "default", className: "w-14" },
      { size: "medium", width: "wide", className: "w-18" },

      { size: "large", width: "narrow", className: "w-18" },
      { size: "large", width: "default", className: "w-24" },
      { size: "large", width: "wide", className: "w-32" },

      { size: "xlarge", width: "narrow", className: "w-24" },
      { size: "xlarge", width: "default", className: "w-[8.5rem]" },
      { size: "xlarge", width: "wide", className: "w-42" },

      // ══════════════════════════════════════════════════════════════════════
      // SHAPE × SIZE — square corner radii + round press-morph targets
      // ══════════════════════════════════════════════════════════════════════

      // square: xsmall / small → 12dp corner (rounded-md = 12px)
      { shape: "square", size: "xsmall", className: "[--ib-radius:0.75rem]" },
      { shape: "square", size: "small", className: "[--ib-radius:0.75rem]" },
      // square: medium → 16dp corner (rounded-lg token = 16px)
      { shape: "square", size: "medium", className: "[--ib-radius:1rem]" },
      // square: large / xlarge → 28dp corner (rounded-xl token = 28px)
      { shape: "square", size: "large", className: "[--ib-radius:1.75rem]" },
      { shape: "square", size: "xlarge", className: "[--ib-radius:1.75rem]" },

      // round press-morph: shrink to the square value for that size on press
      { shape: "round", size: "xsmall", className: "[--ib-radius-press:0.75rem]" },
      { shape: "round", size: "small", className: "[--ib-radius-press:0.75rem]" },
      { shape: "round", size: "medium", className: "[--ib-radius-press:1rem]" },
      { shape: "round", size: "large", className: "[--ib-radius-press:1.75rem]" },
      { shape: "round", size: "xlarge", className: "[--ib-radius-press:1.75rem]" },

      // ══════════════════════════════════════════════════════════════════════
      // VARIANT × COLOR — CSS role variable assignments
      // Only variant × color (design-time decisions); no state variants here.
      // ══════════════════════════════════════════════════════════════════════

      // ── STANDARD ──────────────────────────────────────────────────────────
      // Non-toggle standard: transparent bg, on-surface-variant fg
      // Selected: primary fg
      // State layer: on-surface-variant (unselected) / primary (selected)
      {
        variant: "standard",
        color: "primary",
        className: [
          "[--ib-bg:transparent]",
          "[--ib-fg:var(--color-on-surface-variant)]",
          "[--ib-fg-on:var(--color-primary)]",
          "[--ib-sl:var(--color-on-surface-variant)]",
          // toggle-off same as non-toggle
          "[--ib-bg-off:transparent]",
          "[--ib-fg-off:var(--color-on-surface-variant)]",
          // toggle-on: selected
          "[--ib-bg-on:transparent]",
        ],
      },
      {
        variant: "standard",
        color: "secondary",
        className: [
          "[--ib-bg:transparent]",
          "[--ib-fg:var(--color-on-surface-variant)]",
          "[--ib-fg-on:var(--color-secondary)]",
          "[--ib-sl:var(--color-on-surface-variant)]",
          "[--ib-bg-off:transparent]",
          "[--ib-fg-off:var(--color-on-surface-variant)]",
          "[--ib-bg-on:transparent]",
        ],
      },
      {
        variant: "standard",
        color: "tertiary",
        className: [
          "[--ib-bg:transparent]",
          "[--ib-fg:var(--color-on-surface-variant)]",
          "[--ib-fg-on:var(--color-tertiary)]",
          "[--ib-sl:var(--color-on-surface-variant)]",
          "[--ib-bg-off:transparent]",
          "[--ib-fg-off:var(--color-on-surface-variant)]",
          "[--ib-bg-on:transparent]",
        ],
      },
      {
        variant: "standard",
        color: "error",
        className: [
          "[--ib-bg:transparent]",
          "[--ib-fg:var(--color-on-surface-variant)]",
          "[--ib-fg-on:var(--color-error)]",
          "[--ib-sl:var(--color-on-surface-variant)]",
          "[--ib-bg-off:transparent]",
          "[--ib-fg-off:var(--color-on-surface-variant)]",
          "[--ib-bg-on:transparent]",
        ],
      },

      // ── FILLED ────────────────────────────────────────────────────────────
      // Non-toggle: bg primary / fg on-primary
      // Toggle off: bg surface-container-highest / fg primary
      // Toggle on (selected): bg primary / fg on-primary
      // State layer: on-primary (non-toggle / selected), primary (toggle-off)
      {
        variant: "filled",
        color: "primary",
        className: [
          "[--ib-bg:var(--color-primary)]",
          "[--ib-fg:var(--color-on-primary)]",
          "[--ib-sl:var(--color-on-primary)]",
          "[--ib-bg-off:var(--color-surface-container-highest)]",
          "[--ib-fg-off:var(--color-primary)]",
          "[--ib-bg-on:var(--color-primary)]",
          "[--ib-fg-on:var(--color-on-primary)]",
        ],
      },
      {
        variant: "filled",
        color: "secondary",
        className: [
          "[--ib-bg:var(--color-secondary)]",
          "[--ib-fg:var(--color-on-secondary)]",
          "[--ib-sl:var(--color-on-secondary)]",
          "[--ib-bg-off:var(--color-surface-container-highest)]",
          "[--ib-fg-off:var(--color-secondary)]",
          "[--ib-bg-on:var(--color-secondary)]",
          "[--ib-fg-on:var(--color-on-secondary)]",
        ],
      },
      {
        variant: "filled",
        color: "tertiary",
        className: [
          "[--ib-bg:var(--color-tertiary)]",
          "[--ib-fg:var(--color-on-tertiary)]",
          "[--ib-sl:var(--color-on-tertiary)]",
          "[--ib-bg-off:var(--color-surface-container-highest)]",
          "[--ib-fg-off:var(--color-tertiary)]",
          "[--ib-bg-on:var(--color-tertiary)]",
          "[--ib-fg-on:var(--color-on-tertiary)]",
        ],
      },
      {
        variant: "filled",
        color: "error",
        className: [
          "[--ib-bg:var(--color-error)]",
          "[--ib-fg:var(--color-on-error)]",
          "[--ib-sl:var(--color-on-error)]",
          "[--ib-bg-off:var(--color-surface-container-highest)]",
          "[--ib-fg-off:var(--color-error)]",
          "[--ib-bg-on:var(--color-error)]",
          "[--ib-fg-on:var(--color-on-error)]",
        ],
      },

      // ── TONAL ─────────────────────────────────────────────────────────────
      // Non-toggle: bg secondary-container / fg on-secondary-container
      // Toggle off: bg surface-container-highest / fg on-surface-variant
      // Toggle on (selected): bg secondary-container / fg on-secondary-container
      {
        variant: "tonal",
        color: "primary",
        className: [
          "[--ib-bg:var(--color-secondary-container)]",
          "[--ib-fg:var(--color-on-secondary-container)]",
          "[--ib-sl:var(--color-on-secondary-container)]",
          "[--ib-bg-off:var(--color-surface-container-highest)]",
          "[--ib-fg-off:var(--color-on-surface-variant)]",
          "[--ib-bg-on:var(--color-secondary-container)]",
          "[--ib-fg-on:var(--color-on-secondary-container)]",
        ],
      },
      {
        variant: "tonal",
        color: "secondary",
        className: [
          "[--ib-bg:var(--color-secondary-container)]",
          "[--ib-fg:var(--color-on-secondary-container)]",
          "[--ib-sl:var(--color-on-secondary-container)]",
          "[--ib-bg-off:var(--color-surface-container-highest)]",
          "[--ib-fg-off:var(--color-on-surface-variant)]",
          "[--ib-bg-on:var(--color-secondary-container)]",
          "[--ib-fg-on:var(--color-on-secondary-container)]",
        ],
      },
      {
        variant: "tonal",
        color: "tertiary",
        className: [
          "[--ib-bg:var(--color-tertiary-container)]",
          "[--ib-fg:var(--color-on-tertiary-container)]",
          "[--ib-sl:var(--color-on-tertiary-container)]",
          "[--ib-bg-off:var(--color-surface-container-highest)]",
          "[--ib-fg-off:var(--color-on-surface-variant)]",
          "[--ib-bg-on:var(--color-tertiary-container)]",
          "[--ib-fg-on:var(--color-on-tertiary-container)]",
        ],
      },
      {
        variant: "tonal",
        color: "error",
        className: [
          "[--ib-bg:var(--color-error-container)]",
          "[--ib-fg:var(--color-on-error-container)]",
          "[--ib-sl:var(--color-on-error-container)]",
          "[--ib-bg-off:var(--color-surface-container-highest)]",
          "[--ib-fg-off:var(--color-on-surface-variant)]",
          "[--ib-bg-on:var(--color-error-container)]",
          "[--ib-fg-on:var(--color-on-error-container)]",
        ],
      },

      // ── OUTLINED ──────────────────────────────────────────────────────────
      // Non-toggle: transparent bg, border-outline, on-surface-variant fg
      // Toggle off: same as non-toggle
      // Toggle on (selected): inverse-surface bg, inverse-on-surface fg, no border
      // Disabled: border becomes on-surface/12 (set via Tailwind utility on root)
      {
        variant: "outlined",
        color: "primary",
        className: [
          "[--ib-bg:transparent]",
          "[--ib-fg:var(--color-on-surface-variant)]",
          "[--ib-sl:var(--color-on-surface-variant)]",
          "[--ib-border:var(--color-outline)]",
          "[--ib-bg-off:transparent]",
          "[--ib-fg-off:var(--color-on-surface-variant)]",
          "[--ib-bg-on:var(--color-inverse-surface)]",
          "[--ib-fg-on:var(--color-inverse-on-surface)]",
          // Disabled outlined border
          "data-[disabled]:border-on-surface/12",
        ],
      },
      {
        variant: "outlined",
        color: "secondary",
        className: [
          "[--ib-bg:transparent]",
          "[--ib-fg:var(--color-on-surface-variant)]",
          "[--ib-sl:var(--color-on-surface-variant)]",
          "[--ib-border:var(--color-outline)]",
          "[--ib-bg-off:transparent]",
          "[--ib-fg-off:var(--color-on-surface-variant)]",
          "[--ib-bg-on:var(--color-inverse-surface)]",
          "[--ib-fg-on:var(--color-inverse-on-surface)]",
          "data-[disabled]:border-on-surface/12",
        ],
      },
      {
        variant: "outlined",
        color: "tertiary",
        className: [
          "[--ib-bg:transparent]",
          "[--ib-fg:var(--color-on-surface-variant)]",
          "[--ib-sl:var(--color-on-surface-variant)]",
          "[--ib-border:var(--color-outline)]",
          "[--ib-bg-off:transparent]",
          "[--ib-fg-off:var(--color-on-surface-variant)]",
          "[--ib-bg-on:var(--color-inverse-surface)]",
          "[--ib-fg-on:var(--color-inverse-on-surface)]",
          "data-[disabled]:border-on-surface/12",
        ],
      },
      {
        variant: "outlined",
        color: "error",
        className: [
          "[--ib-bg:transparent]",
          "[--ib-fg:var(--color-on-surface-variant)]",
          "[--ib-sl:var(--color-on-surface-variant)]",
          "[--ib-border:var(--color-outline)]",
          "[--ib-bg-off:transparent]",
          "[--ib-fg-off:var(--color-on-surface-variant)]",
          "[--ib-bg-on:var(--color-inverse-surface)]",
          "[--ib-fg-on:var(--color-inverse-on-surface)]",
          "data-[disabled]:border-on-surface/12",
        ],
      },
    ],

    defaultVariants: {
      variant: "standard",
      color: "primary",
      size: "medium",
      width: "default",
      shape: "round",
    },
  }
);

// ─── STATE LAYER ─────────────────────────────────────────────────────────────

/**
 * State layer — absolute overlay inside the button container.
 *
 * Color driven from --ib-sl CSS variable set by the root.
 * Opacity: 0 at rest, 8% hover, 10% focus-visible, 10% pressed.
 * Hidden when disabled (no state layer on disabled MD3 components).
 *
 * Uses `group-data-[x]/icon-button` to react to the root's data attributes.
 * Note: the root itself is the group — it carries `group/icon-button`.
 * However, since this is a child element, we read `group-data-[x]/icon-button`
 * from the parent's group. But the root is the button, not a wrapper div.
 * Therefore we use `data-[x]:` selectors directly (self-referential) for the
 * root and emit `group/icon-button` on the root so the state layer can read
 * via `group-data-[x]/icon-button`.
 */
export const iconButtonStateLayerVariants = cva([
  "absolute inset-0 rounded-[inherit] pointer-events-none opacity-0",
  "bg-[var(--ib-sl,currentColor)]",
  // Effects transition (opacity — no spatial overshoot)
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Interaction opacities (MD3: hover 8%, focus/pressed 10%)
  "group-data-[hovered]/icon-button:opacity-8",
  "group-data-[focus-visible]/icon-button:opacity-10",
  "group-data-[pressed]/icon-button:opacity-10",
  // No state layer when disabled
  "group-data-[disabled]/icon-button:hidden",
]);

// ─── ICON SLOT ────────────────────────────────────────────────────────────────

/**
 * Icon wrapper — size and color only, no positioning.
 *
 * Sizes match M3 Expressive icon sizes per container tier.
 * Color transitions via effects token (no spatial overshoot on color).
 *
 * Since this is inside the root (the group), we use group-data selectors.
 * Icon color inherits from the root's `text-[var(--ib-fg)]` — no need to
 * duplicate the full variable chain here; CSS `currentColor` flows through.
 */
export const iconButtonIconVariants = cva(
  [
    "relative z-10 inline-flex shrink-0 items-center justify-center",
    "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  ],
  {
    variants: {
      size: {
        xsmall: "size-5", // 20dp
        small: "size-6", // 24dp
        medium: "size-6", // 24dp
        large: "size-8", // 32dp
        xlarge: "size-10", // 40dp
      },
    },
    defaultVariants: {
      size: "medium",
    },
  }
);

// ─── EXPORTED TYPES ───────────────────────────────────────────────────────────

export type IconButtonRootVariants = VariantProps<typeof iconButtonRootVariants>;
export type IconButtonStateLayerVariants = VariantProps<typeof iconButtonStateLayerVariants>;
export type IconButtonIconVariants = VariantProps<typeof iconButtonIconVariants>;

/**
 * Combined variants type for the IconButton component surface.
 * Excludes `isDisabled` and `selected` — those are driven by data attributes.
 */
export type IconButtonVariants = IconButtonRootVariants;
