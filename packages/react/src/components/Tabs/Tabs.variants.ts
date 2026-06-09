import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 Tabs Variants
 *
 * Architecture: Variants vs States
 * - CVA holds design-time structure only (no selected/disabled state variants).
 * - All interaction/selection states are driven by data-* attributes on the root
 *   via group-data-[x]/tab Tailwind selectors in each slot's base classes.
 * - Content flags (data-with-icon, data-with-label) are set explicitly by Tab.
 *
 * Slot responsibilities:
 *   tabListVariants         — container rail; bg-surface + bottom divider
 *   tabVariants             — root button; group/tab; typography + label color; disabled
 *   tabStateLayerVariants   — absolute inset overlay; hover/focus/pressed opacity ring
 *   tabIndicatorVariants    — sliding underline; spatial spring motion
 *   tabIconVariants         — 24dp icon wrapper + badge anchor
 *   tabBadgeVariants        — numeric / dot badge
 *   tabPanelVariants        — panel container
 *
 * MD3 Spec:
 *   Container: bg-surface, border-b border-outline-variant
 *   Height: 48dp label/icon-only | 64dp icon+label
 *   Typography: Title Small (text-title-small, weight 500, tracking 0.1px)
 *   Icon: 24dp
 *   Inactive label/icon: text-on-surface-variant
 *   Active label/icon: primary → text-primary | secondary → text-on-surface
 *   Active indicator: primary 3dp bg-primary rounded-t-full | secondary 2dp bg-primary
 *   State-layer opacities: hover 8% | focus 10% | pressed 10%
 *   Disabled: content 38% opacity
 *   Indicator motion: spatial spring (default tier)
 */

// ─── TAB LIST ─────────────────────────────────────────────────────────────────

/**
 * TabList container rail.
 * Carries bg-surface and the bottom divider per MD3 spec.
 * layout is the only design-time variant.
 */
export const tabListVariants = cva(
  [
    "relative flex",
    "bg-surface",
    // MD3: 1dp bottom divider in outline-variant color
    "border-b border-outline-variant",
  ],
  {
    variants: {
      layout: {
        fixed: "w-full",
        scrollable: "overflow-x-auto scrollbar-none",
      },
    },
    defaultVariants: {
      layout: "fixed",
    },
  }
);

// ─── TAB (ROOT) ───────────────────────────────────────────────────────────────

/**
 * Root <button> element for each tab item.
 * Carries `group/tab` and emits data-* interaction/content attributes.
 *
 * States are driven via group-data-[x]/tab selectors, NOT CVA variant props.
 *   Inactive:  text-on-surface-variant (base)
 *   Active:    text-primary (primary variant) | text-on-surface (secondary variant)
 *   Disabled:  self-targeting data-[disabled]: selectors (38% opacity)
 *   Icon+label height: data-[with-icon]:data-[with-label]:min-h-16
 *
 * Effects transition: color changes use spring-standard-fast-effects.
 * Focus outline: visible via group-data-[focus-visible]/tab on root (above state layer).
 */
export const tabVariants = cva(
  [
    // Layout
    "relative flex flex-col items-center justify-center",
    "min-h-12 px-4",
    "cursor-pointer select-none",
    // Clip state layer to tab boundary
    "overflow-hidden",
    // MD3 Title Small typography
    "text-title-small font-medium tracking-[0.1px]",
    // Effects transition for color changes (not spatial)
    "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
    // Remove default button focus outline — handled via group-data-[focus-visible]/tab
    "focus-visible:outline-none",
    // Disabled — self-targeting data-[x]: selectors (not group)
    "data-[disabled]:opacity-38 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none",
    // Icon+label stacked: 64dp height
    "data-[with-icon]:data-[with-label]:min-h-16",
  ],
  {
    variants: {
      /**
       * Design-time variant: affects active label/icon color and state-layer color.
       * primary: active → text-primary
       * secondary: active → text-on-surface
       */
      variant: {
        primary: [
          // Inactive: on-surface-variant (base)
          "text-on-surface-variant",
          // Active: text-primary
          "group-data-[selected]/tab:text-primary",
          // Disabled active: on-surface/38 inherits from opacity-38 on root
        ],
        secondary: [
          // Inactive: on-surface-variant (base)
          "text-on-surface-variant",
          // Active: on-surface
          "group-data-[selected]/tab:text-on-surface",
        ],
      },

      /**
       * Design-time variant: affects flex sizing in the tab row.
       */
      layout: {
        fixed: "flex-1",
        scrollable: "min-w-[90px] shrink-0",
      },
    },

    // compoundVariants intentionally empty — state combinations are handled
    // via group-data-[selected]/tab:group-data-[...]/tab: in state slot
    compoundVariants: [],

    defaultVariants: {
      variant: "primary",
      layout: "fixed",
    },
  }
);

// ─── STATE LAYER ─────────────────────────────────────────────────────────────

/**
 * State layer — absolute inset overlay transitioning opacity on interaction.
 *
 * Color:
 *   primary inactive → bg-on-surface
 *   primary active   → bg-primary (group-data-[selected]/tab:)
 *   secondary        → bg-on-surface (always)
 *
 * Opacity:
 *   0 at rest
 *   8% hover  (group-data-[hovered]/tab:)
 *   10% focus (group-data-[focus-visible]/tab:)
 *   10% pressed — doubled selector wins over hover at same cascade position
 *   hidden when disabled
 *
 * overflow-hidden on root clips this overlay to the tab shape.
 */
export const tabStateLayerVariants = cva(
  [
    "absolute inset-0 pointer-events-none opacity-0",
    // Effects transition for opacity — no spatial overshoot
    "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
    // Hover: 8%
    "group-data-[hovered]/tab:opacity-8",
    // Focus: 10%
    "group-data-[focus-visible]/tab:opacity-10",
    // Pressed: 10%, doubled selector beats hover at equal cascade position
    "group-data-[pressed]/tab:group-data-[pressed]/tab:opacity-10",
    // No state layer when disabled
    "group-data-[disabled]/tab:hidden",
  ],
  {
    variants: {
      variant: {
        primary: [
          // Inactive state-layer color
          "bg-on-surface",
          // Active state-layer color (higher cascade position wins over base bg-on-surface)
          "group-data-[selected]/tab:bg-primary",
        ],
        secondary: [
          // Secondary: always on-surface
          "bg-on-surface",
        ],
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

// ─── ACTIVE INDICATOR ────────────────────────────────────────────────────────

/**
 * Active indicator — the sliding underline absolutely positioned at the bottom
 * of the TabList container.
 *
 * primary:   3dp height, bg-primary, rounded-t-full top corners
 * secondary: 2dp height, bg-primary, no rounding
 *
 * Motion: left/width are spatial properties → spring-standard-default-spatial.
 * Initial position and width are set inline by TabList via DOM measurement.
 * Primary variant is measured to content width (label/icon inner span);
 * secondary spans the full tab button width.
 */
export const tabIndicatorVariants = cva(
  [
    "absolute bottom-0 left-0",
    "pointer-events-none",
    // Spatial spring — indicator position/width are spatial (not effects)
    "transition-[left,width]",
    "duration-spring-standard-default-spatial",
    "ease-spring-standard-default-spatial",
  ],
  {
    variants: {
      variant: {
        primary: ["h-[3px]", "bg-primary", "rounded-tl-sm rounded-tr-sm"],
        secondary: ["h-[2px]", "bg-primary"],
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

// ─── ICON WRAPPER ─────────────────────────────────────────────────────────────

/**
 * Icon wrapper inside the tab content span.
 * MD3 spec: 24dp icon size.
 * hasLabel: adds bottom margin when stacked with a label.
 */
export const tabIconVariants = cva(
  [
    "relative inline-flex items-center justify-center",
    // MD3 tab icon size: 24dp
    "size-6",
    // Effects transition for color (inherited from parent, guard here too)
    "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  ],
  {
    variants: {
      hasLabel: {
        true: "mb-1",
        false: "",
      },
    },
    defaultVariants: {
      hasLabel: false,
    },
  }
);

// ─── BADGE ────────────────────────────────────────────────────────────────────

/**
 * Badge — numeric count or dot indicator anchored to the icon wrapper.
 * MD3 badge spec: bg-error text-on-error.
 */
export const tabBadgeVariants = cva(
  [
    "absolute",
    "inline-flex items-center justify-center",
    "bg-error text-on-error",
    "font-medium leading-none",
    "pointer-events-none",
  ],
  {
    variants: {
      type: {
        dot: ["top-0 right-0", "w-1.5 h-1.5", "rounded-full"],
        count: ["-top-1 -right-1", "min-w-[16px] h-4", "px-1", "rounded-full", "text-[11px]"],
      },
    },
    defaultVariants: {
      type: "count",
    },
  }
);

// ─── TAB PANEL ────────────────────────────────────────────────────────────────

/**
 * TabPanel container.
 * MD3 does not specify panel container styling — focus management only.
 */
export const tabPanelVariants = cva([
  "outline-none",
  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
]);

// ─── EXPORTED TYPES ───────────────────────────────────────────────────────────

export type TabListVariants = VariantProps<typeof tabListVariants>;
export type TabVariants = VariantProps<typeof tabVariants>;
export type TabStateLayerVariants = VariantProps<typeof tabStateLayerVariants>;
export type TabIndicatorVariants = VariantProps<typeof tabIndicatorVariants>;
export type TabIconVariants = VariantProps<typeof tabIconVariants>;
export type TabBadgeVariants = VariantProps<typeof tabBadgeVariants>;
export type TabPanelVariants = VariantProps<typeof tabPanelVariants>;
