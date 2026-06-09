import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Bottom Sheet Variants
 *
 * Architecture: Variants vs States
 * - CVA holds design-time structure only (no state variants, no state compoundVariants).
 * - The drag handle's interaction states are driven by data-* attributes on its wrapper
 *   via group-data-[x]/handle Tailwind selectors in each slot's base classes.
 * - Content flags (data-dragging) are set explicitly by the component, not via helper.
 *
 * Slot responsibilities:
 *   bottomSheetVariants               — fixed container; surface, shape, elevation, snap spring
 *   bottomSheetScrimVariants          — modal scrim overlay; opacity fade (screen-level token)
 *   bottomSheetAnimationVariants      — enter/exit animation state machine classes
 *   bottomSheetHandleWrapperVariants  — 48dp touch target; carries `group/handle`; data-* host
 *   bottomSheetHandleStateLayerVariants — hover/focus/pressed/dragged opacity ring around pill
 *   bottomSheetHandleFocusRingVariants  — keyboard focus outline overlay (opacity-driven)
 *   bottomSheetHandlePillVariants     — 32×4dp pill decoration; pointer-events-none
 *
 * MD3 Spec:
 *   Container surface: surface-container-low, elevation level-1
 *   Shape: extra-large top corners (28dp), square bottom (attached to screen edge)
 *   Width: full width up to 640dp; centered at max-width 640dp on wider viewports
 *   Top margin: 72dp default, 56dp when viewport > 640dp
 *   Drag handle: 32dp × 4dp, on-surface-variant, centered, 22dp top/bottom padding → 48dp target
 *   Scrim: bg-scrim, 32% opacity
 *   State-layer opacities: hover 8% | focus 10% | pressed 10% | dragged 16%
 */

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────

/**
 * CVA animation state variants for the Bottom Sheet panel.
 *
 * Motion decision rationale:
 * - Bottom sheet is a standard-size component → `default` speed tier
 * - Slides in/out of screen → composite `animate-md-*` utilities (not manual spring tokens)
 * - Scrim opacity is an effects property → `duration-short4 ease-standard` (legacy screen-level)
 * - Snap spring is a spatial on-screen transition → `ease-spring-standard-default-spatial` +
 *   `duration-spring-standard-default-spatial` (applied in bottomSheetVariants base)
 * - Standard personality (not expressive) — sheets are utility UI, not moments of delight
 */
export const bottomSheetAnimationVariants = cva("", {
  variants: {
    animationState: {
      // entering: initial mount frame — sheet starts below viewport (translateY(100%))
      entering: ["opacity-0"],
      // visible: entry animation active — animate-md-slide-in-bottom runs once
      visible: ["animate-md-slide-in-bottom"],
      // exiting: exit animation active — animate-md-slide-out-bottom runs once
      exiting: ["animate-md-slide-out-bottom"],
      // exited: portal gate removes element — no classes needed
      exited: ["opacity-0", "pointer-events-none"],
    },
  },
  defaultVariants: {
    animationState: "entering",
  },
});

export type BottomSheetAnimationVariants = VariantProps<typeof bottomSheetAnimationVariants>;

// ─── CONTAINER ────────────────────────────────────────────────────────────────

/**
 * Root container — the bottom sheet panel.
 *
 * MD3 tokens applied:
 * - Surface: bg-surface-container-low
 * - Elevation: shadow-elevation-1
 * - Shape: extra-large top corners (28dp via rounded-t-xl), square bottom (attached to edge)
 * - Width: full width up to 640dp (mx-auto + w-[640px] max-w-full)
 * - Height: snap-point driven via inline style; constrained by max-height to enforce top margin
 *   Default: 72dp top margin → max-h-[calc(100vh-72px)]
 *   Wide (> 640dp): 56dp top margin → sm:max-h-[calc(100vh-56px)]
 * - Snap spring: spatial on-screen transition → spring-standard default spatial pair
 *   data-[dragging]:transition-none suppresses spring during active drag (1:1 pointer tracking)
 *
 * NOTE: overflow-hidden clips content during height transitions. The handle's state layer and
 * focus-ring overlay are sized/positioned to fit within the wrapper, so they are not clipped.
 */
export const bottomSheetVariants = cva(
  [
    // Position: fixed to bottom edge, full width
    "fixed bottom-0 left-0 right-0",

    // Surface token
    "bg-surface-container-low",

    // Elevation level 1 per MD3 spec
    "shadow-elevation-1",

    // Shape: extra-large top corners (28dp), square bottom (screen-attached)
    // NOTE: measurement-derived value from MD3 spec; permitted exception per component-variants rule
    "rounded-t-xl",

    // Layout
    "flex flex-col",

    // Width constraint (full width up to 640dp)
    "mx-auto",
    // NOTE: measurement-derived value from MD3 spec; permitted exception
    "w-[640px] max-w-full",

    // Clip content during height transitions
    "overflow-hidden",

    // Snap spring: spatial property (height), standard personality, default tier
    "transition-[height]",
    "duration-spring-standard-default-spatial",
    "ease-spring-standard-default-spatial",
    // Suppress spring while dragging so the sheet follows the pointer 1:1
    "data-[dragging]:transition-none",
    "will-change-[height]",

    // Responsive layout: top margin expressed as max-height
    // NOTE: measurement-derived values from MD3 spec; permitted exception
    "max-h-[calc(100vh-72px)]",
    "sm:max-h-[calc(100vh-56px)]",
  ],
  {
    variants: {
      variant: {
        // Modal: rendered above the scrim (z-50)
        modal: "z-50",
        // Standard: sits above normal content but below overlays
        standard: "z-10",
      },
    },
    defaultVariants: {
      variant: "modal",
    },
  }
);

export type BottomSheetVariants = VariantProps<typeof bottomSheetVariants>;

// ─── SCRIM ────────────────────────────────────────────────────────────────────

/**
 * Scrim overlay (modal variant only).
 *
 * MD3 tokens applied:
 * - bg-scrim: scrim surface role
 * - opacity-32: 32% opacity per MD3 spec
 * - Transition: opacity fade (scrim is a screen-level effects property → legacy duration tokens)
 */
export const bottomSheetScrimVariants = cva([
  "fixed inset-0 z-40",
  "bg-scrim opacity-32",
  // Screen-level effects transition (scrim enters/exits the screen, not an on-screen state change)
  "transition-opacity duration-short4 ease-standard",
]);

export type BottomSheetScrimVariants = VariantProps<typeof bottomSheetScrimVariants>;

// ─── HANDLE WRAPPER ───────────────────────────────────────────────────────────

/**
 * Drag handle wrapper — 48dp touch target area + group scope host.
 *
 * Carries `group/handle` so all handle child slots can consume data-* interaction
 * states via `group-data-[x]/handle:` Tailwind selectors without any CVA variant props.
 *
 * MD3 spec: 22dp top + 4dp handle + 22dp bottom = 48dp interaction zone.
 * NOTE: py-[22px] is a measurement-derived value from MD3 spec; permitted exception.
 *
 * `relative` provides positioning context for the state layer and focus ring overlays.
 * `focus-visible:outline-none` suppresses the browser default — the focus ring overlay
 * in `bottomSheetHandleFocusRingVariants` provides the MD3-spec visible indicator instead.
 */
export const bottomSheetHandleWrapperVariants = cva([
  // Center the pill horizontally; provide positioning context for overlays
  "relative flex items-center justify-center w-full",

  // 48dp touch target (22dp top + 4dp pill + 22dp bottom)
  // NOTE: measurement-derived value from MD3 spec; permitted exception
  "py-[22px]",

  // Suppress browser default focus outline — the focus-ring overlay slot handles it
  "focus-visible:outline-none",

  // Cursor affordance for drag interaction
  "cursor-ns-resize",
]);

export type BottomSheetHandleWrapperVariants = VariantProps<
  typeof bottomSheetHandleWrapperVariants
>;

// ─── HANDLE STATE LAYER ───────────────────────────────────────────────────────

/**
 * Drag handle state layer — the semi-transparent interaction feedback ring.
 *
 * Positioned to wrap the pill snugly (not the full 48dp target) to keep the
 * visual feedback proportional to the pill. Sized as a wide pill shape that
 * encapsulates the 32dp × 4dp handle with generous rounded ends.
 *
 * Color: on-surface-variant (matches the pill's own color role per MD3).
 * Opacity progression:
 *   0 at rest
 *   8%  hover
 *   10% focus-visible / pressed
 *   16% dragged (MD3 "dragged" state = 16%)
 *
 * Disabled on the handle is not applicable (handle is always interactive when sheet is open).
 */
export const bottomSheetHandleStateLayerVariants = cva([
  // Overlay positioned centrally — sits behind the pill
  "absolute pointer-events-none",
  // Pill-shaped to complement the handle's form
  "rounded-full",
  // Sized wider than the pill to provide a visible state layer halo
  // 48dp wide × 16dp tall — centred by the flex wrapper
  "w-12 h-4",

  // State-layer color (same role as the pill)
  "bg-on-surface-variant",

  // Effects transition — opacity must NOT overshoot
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",

  // Opacity at rest
  "opacity-0",

  // Hover: 8%
  "group-data-[hovered]/handle:opacity-8",
  // Focus-visible: 10%
  "group-data-[focus-visible]/handle:opacity-10",
  // Pressed: 10% (doubled selector wins over hover at same cascade position)
  "group-data-[pressed]/handle:group-data-[pressed]/handle:opacity-10",
  // Dragging: 16% (MD3 dragged state — highest on-screen opacity)
  // Doubled selector wins over hover + pressed
  "group-data-[dragging]/handle:group-data-[dragging]/handle:opacity-16",
]);

export type BottomSheetHandleStateLayerVariants = VariantProps<
  typeof bottomSheetHandleStateLayerVariants
>;

// ─── HANDLE FOCUS RING ────────────────────────────────────────────────────────

/**
 * Drag handle focus ring overlay.
 *
 * Rendered as an absolutely-positioned element that is always in the DOM
 * (opacity-0 at rest, opacity-100 on keyboard/programmatic focus). The
 * opacity-driven approach avoids layout shifts and enables a smooth transition.
 *
 * Positioned to wrap the pill tightly — slightly larger than the state layer
 * to remain legible. Uses `outline` rather than `border` to avoid layout impact.
 *
 * MD3 spec: focus indicator color = secondary, weight ≈ 2–3dp.
 * We use `outline-2 outline-secondary` to meet the intent with token classes.
 *
 * This element MUST be outside the pill's z-stack but inside the wrapper so
 * it is not clipped by the container's `overflow-hidden`.
 */
export const bottomSheetHandleFocusRingVariants = cva([
  "absolute pointer-events-none",
  "rounded-full",
  // Sized to sit around the state layer halo
  "w-14 h-5",

  // MD3 focus indicator: secondary color, 2dp weight
  "outline outline-2 outline-offset-0 outline-secondary",

  // Effects transition — opacity change must NOT overshoot
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",

  // Hidden at rest; shown on keyboard/programmatic focus
  "opacity-0",
  "group-data-[focus-visible]/handle:opacity-100",
]);

export type BottomSheetHandleFocusRingVariants = VariantProps<
  typeof bottomSheetHandleFocusRingVariants
>;

// ─── HANDLE PILL ──────────────────────────────────────────────────────────────

/**
 * Drag handle pill — the visible 32×4dp decoration.
 *
 * MD3 tokens applied:
 * - bg-on-surface-variant: handle color (muted, low-emphasis by role — no opacity override needed)
 * - w-8 / h-1: 32dp × 4dp per MD3 spec (measurement-derived; permitted exception)
 * - rounded-full: fully-rounded pill shape
 *
 * `pointer-events-none` — all interaction is handled by the wrapper.
 * `relative z-10` — renders above the state layer overlay.
 */
export const bottomSheetHandlePillVariants = cva([
  "relative z-10 pointer-events-none",
  "bg-on-surface-variant",
  "rounded-full",
  // Dimensions: 32dp × 4dp per MD3 spec (measurement-derived; permitted exception)
  "w-8", // 32dp = 2rem
  "h-1", // 4dp  = 0.25rem
]);

export type BottomSheetHandlePillVariants = VariantProps<typeof bottomSheetHandlePillVariants>;

// ─── LEGACY TYPE ALIAS ────────────────────────────────────────────────────────

// Kept for backward-compat with existing exports; prefer the specific slot types above.
export type BottomSheetHandleVariants = BottomSheetHandleWrapperVariants;
