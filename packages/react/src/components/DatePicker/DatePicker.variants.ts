import { cva, type VariantProps } from "class-variance-authority";

/**
 * Material Design 3 DatePicker Variants
 *
 * Architecture: Variants vs States
 * - CVA holds design-time structure only. No interaction state variants
 *   (hovered/focused/pressed/disabled) live in CVA.
 * - All interaction/selection states are driven by data-* attributes emitted
 *   via `getInteractionDataAttributes` and consumed by `group-data-[x]/<name>`
 *   Tailwind selectors in each slot's base classes.
 * - Content flags (data-selected, data-today, data-range-middle, data-disabled,
 *   data-outside-month, data-range-start, data-range-end, data-focus-visible,
 *   data-hovered, data-pressed) are set by the headless cell/nav/year layers.
 *
 * Slot responsibilities:
 *   datePickerContainerVariants    — root container; shape, surface, width by variant
 *   calendarCellVariants           — 48dp date cell root; carries `group/calendar-cell`
 *   calendarCellStateLayerVariants — hover/focus/pressed state-layer overlay
 *   calendarCellFocusRingVariants  — keyboard focus ring for cells
 *   navButtonVariants              — 40dp icon nav button; carries `group/nav-button`
 *   navButtonStateLayerVariants    — state layer for nav button
 *   calendarTitleVariants          — month/year toggle pill; carries `group/calendar-title`
 *   calendarTitleStateLayerVariants — state layer for title button
 *   calendarHeaderVariants         — header row layout
 *   yearItemVariants               — 88×52 pill year item; carries `group/year-item`
 *   yearItemStateLayerVariants     — state layer for year item
 *   yearGridVariants               — scrollable year grid container
 *   weekdayVariants                — "S M T W T F S" label cells
 *   dividerVariants                — 1dp outline-variant separator
 *   actionButtonVariants           — Cancel/OK/Clear text button; carries `group/action-button`
 *   actionButtonStateLayerVariants — state layer for action buttons
 *   actionRowVariants              — action button row layout
 *   modalDialogVariants            — centered fixed modal dialog panel
 *   modalHeaderVariants            — modal header layout
 *   headlineVariants               — label-large supporting headline text
 *   supportingTextVariants         — headline-large selected-date display
 *   modeToggleVariants             — calendar/keyboard mode toggle button; carries `group/mode-toggle`
 *   modeToggleStateLayerVariants   — state layer for mode toggle
 *   scrimVariants                  — full-viewport dark overlay
 *   dateInputFieldVariants         — outlined date input field wrapper
 *   dateInputFieldGroupVariants    — inner outlined container + focus/invalid borders
 *   dockedFieldGroupVariants       — docked trigger: outlined field + icon
 *   dockedTriggerVariants          — calendar icon button; carries `group/docked-trigger`
 *   dockedTriggerStateLayerVariants — state layer for docked trigger
 *   popoverVariants                — docked calendar popover panel
 *
 * MD3 Spec (https://m3.material.io/components/date-pickers/specs):
 *   Container: surface-container-high, 28dp corner (extra-large)
 *   Date cell: 48dp circle
 *   Nav button: 40dp, rounded-full
 *   Year item: 88×52dp, pill
 *   State-layer opacities: hover 8% | focus 10% | pressed 10% | disabled 38%
 *   Motion tier: Spring standard FAST (< 48dp interactive elements)
 *   Modal enter: animate-md-scale-in | Exit: animate-md-scale-out
 *   Popover enter: standard-decelerate / short3
 */

// ─── CONTAINER ───────────────────────────────────────────────────────────────

/**
 * Container variants — width and surface styling by structural variant.
 *
 * - **docked**: Root wrapper is layout-only (width). Calendar surface styling
 *   (`bg-surface-container-high`, `rounded-3xl`) is applied to `[data-popover]`
 *   via `DOCKED_POPOVER_STRUCTURAL` in `datePickerStructuralStyles.ts`.
 * - **modal** / **modal-input**: Full container styling on `[data-modal-dialog]`.
 *
 * MD3 spec: surface-container-high, 28dp corner radius (extra-large = rounded-3xl).
 */
export const datePickerContainerVariants = cva("", {
  variants: {
    variant: {
      docked: "w-[360px]", // NOTE: measurement-derived (360dp fixed width); permitted exception
      modal: [
        "bg-surface-container-high",
        "rounded-3xl",
        "overflow-hidden",
        "w-[360px]", // NOTE: measurement-derived (360dp fixed width); permitted exception
      ],
      "modal-input": [
        "bg-surface-container-high",
        "rounded-3xl",
        "overflow-hidden",
        "w-[328px]", // NOTE: measurement-derived (328dp); permitted exception
      ],
    },
  },
  defaultVariants: {
    variant: "docked",
  },
});

export type DatePickerContainerVariants = VariantProps<typeof datePickerContainerVariants>;

// ─── CALENDAR CELL ───────────────────────────────────────────────────────────

/**
 * Date cell root — carries `group/calendar-cell`.
 *
 * Structure + visual states are driven by presence-based data-* attributes on
 * the root via self-targeting `data-[x]:` and `group-data-[x]/calendar-cell:`
 * selectors — NOT via CVA variants.
 *
 * Cell state progression:
 *   default:             text-on-surface
 *   today (unselected):  text-primary + border border-primary
 *   selected:            bg-primary + text-on-primary (full circle)
 *   range-start/end:     bg-primary + text-on-primary + half-pill rounding
 *   range-middle:        bg-secondary-container + text-on-secondary-container + no rounding
 *   outside-month:       text-on-surface-variant
 *   disabled:            text-on-surface/38, cursor-not-allowed
 *   unavailable:         text-on-surface/38, line-through
 *
 * Interaction states via state layer (see calendarCellStateLayerVariants):
 *   hover 8% | focus-visible 10% | pressed 10%
 */
export const calendarCellVariants = cva([
  // Layout — 48dp circle touch target
  "relative flex items-center justify-center",
  "w-[48px] h-[48px]", // NOTE: measurement-derived (48dp touch target); permitted exception
  "rounded-full",
  "select-none cursor-pointer",
  "overflow-hidden", // clips state layer to circle
  // Typography
  "text-body-large",
  // Base text color
  "text-on-surface",
  // Effects transition for color changes (not spatial — no overshoot)
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Remove default focus outline — handled via calendarCellFocusRingVariants
  "focus-visible:outline-none",
  // Carries group scope for child slots
  "group/calendar-cell",
  // ── Today (unselected) ────────────────────────────────────────────────────
  "data-[today]:not([data-selected]):text-primary",
  "data-[today]:not([data-selected]):border data-[today]:not([data-selected]):border-primary",
  // ── Selected ──────────────────────────────────────────────────────────────
  "data-[selected]:bg-primary data-[selected]:text-on-primary",
  // ── Range start/end: half-pill shape (right-flat for start, left-flat for end) ──
  "data-[range-start]:rounded-r-none",
  "data-[range-end]:rounded-l-none",
  // ── Range middle ──────────────────────────────────────────────────────────
  "data-[range-middle]:bg-secondary-container",
  "data-[range-middle]:text-on-secondary-container",
  "data-[range-middle]:rounded-none",
  // ── Outside month ─────────────────────────────────────────────────────────
  "data-[outside-month]:not([data-selected]):text-on-surface-variant",
  // ── Disabled ──────────────────────────────────────────────────────────────
  "data-[disabled]:text-on-surface/38 data-[disabled]:cursor-not-allowed",
  // ── Unavailable ───────────────────────────────────────────────────────────
  "data-[unavailable]:text-on-surface/38 data-[unavailable]:line-through",
]);

export type CalendarCellVariants = VariantProps<typeof calendarCellVariants>;

/**
 * Calendar cell state layer — absolute overlay inside the cell.
 *
 * Color: on-surface (unselected) → on-primary (selected) → on-secondary-container (range-middle).
 * Opacity: 0 rest → 8% hover → 10% focus-visible → 10% pressed → hidden disabled.
 * Effects spring (fast tier — small < 48dp control).
 */
export const calendarCellStateLayerVariants = cva([
  "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0",
  // Base state-layer color (unselected)
  "bg-on-surface",
  // Effects transition — spring standard fast (no spatial overshoot)
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Selected → state layer color switches to on-primary
  "group-data-[selected]/calendar-cell:bg-on-primary",
  // Range middle → state layer color switches to on-secondary-container
  "group-data-[range-middle]/calendar-cell:bg-on-secondary-container",
  // Interaction opacities (MD3: hover 8%, focus/pressed 10%)
  "group-data-[hovered]/calendar-cell:opacity-8",
  "group-data-[focus-visible]/calendar-cell:opacity-10",
  "group-data-[pressed]/calendar-cell:opacity-10",
  // No state layer for disabled/unavailable
  "group-data-[disabled]/calendar-cell:hidden",
  "group-data-[unavailable]/calendar-cell:hidden",
]);

export type CalendarCellStateLayerVariants = VariantProps<typeof calendarCellStateLayerVariants>;

/**
 * Calendar cell focus ring — keyboard-only visible ring.
 * Rendered as an absolute inset so overflow-hidden never clips it.
 */
export const calendarCellFocusRingVariants = cva([
  "pointer-events-none absolute inset-0 rounded-full",
  "outline outline-2 outline-offset-0 outline-secondary",
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "opacity-0",
  "group-data-[focus-visible]/calendar-cell:opacity-100",
]);

export type CalendarCellFocusRingVariants = VariantProps<typeof calendarCellFocusRingVariants>;

// ─── CALENDAR HEADER ─────────────────────────────────────────────────────────

/**
 * Calendar header row — flex layout, padding per MD3 spec.
 */
export const calendarHeaderVariants = cva([
  "flex items-center justify-between",
  "px-3 py-2", // NOTE: measurement-derived padding; permitted exception
]);

export type CalendarHeaderVariants = VariantProps<typeof calendarHeaderVariants>;

// ─── NAV BUTTON ──────────────────────────────────────────────────────────────

/**
 * Navigation button (previous/next month) — 40dp circle, carries `group/nav-button`.
 *
 * MD3 spec: 40dp icon button, on-surface-variant color, transparent bg.
 * State layer: hover 8%, focus 10%, pressed 10%.
 */
export const navButtonVariants = cva([
  // Layout
  "relative flex items-center justify-center",
  "w-10 h-10 rounded-full", // NOTE: 40dp; permitted exception
  // Typography
  "text-on-surface-variant",
  // Reset
  "bg-transparent border-none cursor-pointer",
  "overflow-hidden",
  // Focus outline removed — ring handled by navButtonFocusRingVariants
  "focus-visible:outline-none",
  // Effects transition
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Disabled — self-targeting
  "data-[disabled]:text-on-surface/38 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none",
  // Carries group scope
  "group/nav-button",
]);

export type NavButtonVariants = VariantProps<typeof navButtonVariants>;

/**
 * Nav button state layer.
 */
export const navButtonStateLayerVariants = cva([
  "pointer-events-none absolute inset-0 rounded-full opacity-0",
  "bg-on-surface-variant",
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "group-data-[hovered]/nav-button:opacity-8",
  "group-data-[focus-visible]/nav-button:opacity-10",
  "group-data-[pressed]/nav-button:opacity-10",
  "group-data-[disabled]/nav-button:hidden",
]);

export type NavButtonStateLayerVariants = VariantProps<typeof navButtonStateLayerVariants>;

/**
 * Nav button focus ring.
 */
export const navButtonFocusRingVariants = cva([
  "pointer-events-none absolute inset-0 rounded-full",
  "outline outline-2 outline-offset-0 outline-secondary",
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "opacity-0",
  "group-data-[focus-visible]/nav-button:opacity-100",
]);

export type NavButtonFocusRingVariants = VariantProps<typeof navButtonFocusRingVariants>;

// ─── CALENDAR TITLE ──────────────────────────────────────────────────────────

/**
 * Month/year title toggle pill — carries `group/calendar-title`.
 *
 * MD3 spec: label-large text, on-surface-variant, pill shape, transparent bg.
 */
export const calendarTitleVariants = cva([
  "relative flex items-center gap-0.5",
  "bg-transparent border-none cursor-pointer",
  "rounded-full px-2 py-1",
  "overflow-hidden",
  "focus-visible:outline-none",
  // Effects transition
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Group scope
  "group/calendar-title",
]);

export type CalendarTitleVariants = VariantProps<typeof calendarTitleVariants>;

/**
 * Calendar title text inside the title button.
 * label-large, on-surface-variant per MD3.
 */
export const calendarTitleTextVariants = cva([
  "text-label-large text-on-surface-variant m-0 pointer-events-none",
]);

export type CalendarTitleTextVariants = VariantProps<typeof calendarTitleTextVariants>;

/**
 * Calendar title dropdown icon color.
 */
export const calendarTitleIconVariants = cva(["text-on-surface-variant pointer-events-none"]);

export type CalendarTitleIconVariants = VariantProps<typeof calendarTitleIconVariants>;

/**
 * Calendar title state layer.
 */
export const calendarTitleStateLayerVariants = cva([
  "pointer-events-none absolute inset-0 rounded-full opacity-0",
  "bg-on-surface-variant",
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "group-data-[hovered]/calendar-title:opacity-8",
  "group-data-[focus-visible]/calendar-title:opacity-10",
  "group-data-[pressed]/calendar-title:opacity-10",
]);

export type CalendarTitleStateLayerVariants = VariantProps<typeof calendarTitleStateLayerVariants>;

// ─── YEAR GRID ───────────────────────────────────────────────────────────────

/**
 * Scrollable year grid container.
 * MD3 spec: 3-column grid, scrollable, max height.
 */
export const yearGridVariants = cva([
  "grid grid-cols-3 gap-2",
  "px-3 py-2",
  "max-h-[280px] overflow-y-auto", // NOTE: measurement-derived max height; permitted exception
  "place-items-center",
]);

export type YearGridVariants = VariantProps<typeof yearGridVariants>;

/**
 * Year item pill — carries `group/year-item`.
 *
 * MD3 spec: 88×52dp, pill, body-large text.
 * Selected: bg-primary text-on-primary.
 * Unselected: text-on-surface-variant.
 * All interaction states via state layer.
 */
export const yearItemVariants = cva([
  // Layout
  "relative flex items-center justify-center",
  "w-[88px] h-[52px]", // NOTE: measurement-derived (88dp×52dp); permitted exception
  "rounded-full",
  "cursor-pointer select-none",
  "overflow-hidden",
  // Typography
  "text-body-large",
  // Reset
  "bg-transparent border-none",
  // Focus outline removed — ring handled by yearItemFocusRingVariants
  "focus-visible:outline-none",
  // Effects transition
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Group scope
  "group/year-item",
  // ── Unselected (base) ─────────────────────────────────────────────────────
  "text-on-surface-variant",
  // ── Selected ──────────────────────────────────────────────────────────────
  "data-[selected]:bg-primary data-[selected]:text-on-primary",
  // ── Disabled ──────────────────────────────────────────────────────────────
  "data-[disabled]:text-on-surface/38 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none",
]);

export type YearItemVariants = VariantProps<typeof yearItemVariants>;

/**
 * Year item state layer.
 *
 * Color: on-surface-variant (unselected) → on-primary (selected).
 */
export const yearItemStateLayerVariants = cva([
  "pointer-events-none absolute inset-0 rounded-full opacity-0",
  "bg-on-surface-variant",
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Selected → state layer switches color
  "group-data-[selected]/year-item:bg-on-primary",
  // Interaction opacities
  "group-data-[hovered]/year-item:opacity-8",
  "group-data-[focus-visible]/year-item:opacity-10",
  "group-data-[pressed]/year-item:opacity-10",
  "group-data-[disabled]/year-item:hidden",
]);

export type YearItemStateLayerVariants = VariantProps<typeof yearItemStateLayerVariants>;

/**
 * Year item focus ring.
 */
export const yearItemFocusRingVariants = cva([
  "pointer-events-none absolute inset-0 rounded-full",
  "outline outline-2 outline-offset-0 outline-secondary",
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "opacity-0",
  "group-data-[focus-visible]/year-item:opacity-100",
]);

export type YearItemFocusRingVariants = VariantProps<typeof yearItemFocusRingVariants>;

// ─── WEEKDAY LABELS ──────────────────────────────────────────────────────────

/**
 * Weekday column headers (S M T W T F S).
 * MD3 spec: body-small, on-surface-variant, 48dp width, 48dp height, centered.
 */
export const weekdayVariants = cva([
  "text-body-small text-on-surface-variant font-normal",
  "w-[48px] h-[48px]", // NOTE: measurement-derived; permitted exception
  "flex items-center justify-center",
  "select-none",
]);

export type WeekdayVariants = VariantProps<typeof weekdayVariants>;

// ─── DIVIDER ─────────────────────────────────────────────────────────────────

/**
 * 1dp separator between header and calendar body.
 * MD3 spec: outline-variant color.
 */
export const calendarDividerVariants = cva(["border-t border-outline-variant w-full"]);

export type CalendarDividerVariants = VariantProps<typeof calendarDividerVariants>;

// ─── ACTION BUTTONS ──────────────────────────────────────────────────────────

/**
 * Action button row — right-aligned flex, 48dp height.
 * MD3 spec: 12dp horizontal padding, 48dp row height.
 */
export const actionRowVariants = cva([
  "flex items-center justify-end gap-2",
  "px-3 py-2",
  "h-12", // NOTE: measurement-derived (48dp action row height); permitted exception
]);

export type ActionRowVariants = VariantProps<typeof actionRowVariants>;

/**
 * Individual action button (Cancel / OK / Clear) — carries `group/action-button`.
 *
 * MD3 spec: label-large, primary color, pill shape, transparent bg.
 */
export const actionButtonVariants = cva([
  // Layout
  "relative flex items-center justify-center",
  "rounded-full px-3 py-2 min-h-[48px]", // NOTE: 48dp min touch; permitted exception
  // Typography + color
  "text-label-large text-primary",
  // Reset
  "bg-transparent border-none cursor-pointer",
  "overflow-hidden",
  "focus-visible:outline-none",
  // Effects transition
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  // Group scope
  "group/action-button",
  // Disabled
  "data-[disabled]:text-on-surface/38 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none",
]);

export type ActionButtonVariants = VariantProps<typeof actionButtonVariants>;

/**
 * Action button state layer.
 */
export const actionButtonStateLayerVariants = cva([
  "pointer-events-none absolute inset-0 rounded-full opacity-0",
  "bg-primary",
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "group-data-[hovered]/action-button:opacity-8",
  "group-data-[focus-visible]/action-button:opacity-10",
  "group-data-[pressed]/action-button:opacity-10",
  "group-data-[disabled]/action-button:hidden",
]);

export type ActionButtonStateLayerVariants = VariantProps<typeof actionButtonStateLayerVariants>;

/**
 * Action button focus ring.
 */
export const actionButtonFocusRingVariants = cva([
  "pointer-events-none absolute inset-0 rounded-full",
  "outline outline-2 outline-offset-0 outline-primary",
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "opacity-0",
  "group-data-[focus-visible]/action-button:opacity-100",
]);

export type ActionButtonFocusRingVariants = VariantProps<typeof actionButtonFocusRingVariants>;

// ─── MODAL DIALOG ────────────────────────────────────────────────────────────

/**
 * Centered modal dialog panel.
 * MD3 spec: surface-container-high, 28dp corner, elevation-3.
 * Sizes: 360dp (modal) | 328dp (modal-input).
 */
export const modalDialogVariants = cva(
  [
    "bg-surface-container-high rounded-3xl overflow-hidden",
    "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "z-50",
    "max-h-[90vh] overflow-y-auto",
  ],
  {
    variants: {
      variant: {
        modal: "w-[360px]", // NOTE: measurement-derived; permitted exception
        "modal-input": "w-[328px]", // NOTE: measurement-derived; permitted exception
      },
    },
    defaultVariants: {
      variant: "modal",
    },
  }
);

export type ModalDialogVariants = VariantProps<typeof modalDialogVariants>;

// ─── MODAL HEADER ────────────────────────────────────────────────────────────

/**
 * Modal header layout wrapper.
 * MD3 spec: 24dp horizontal padding, 16dp top, 12dp bottom, items-start.
 */
export const modalHeaderVariants = cva([
  "flex items-start justify-between",
  "px-6 pt-4 pb-3", // NOTE: measurement-derived padding; permitted exception
]);

export type ModalHeaderVariants = VariantProps<typeof modalHeaderVariants>;

/**
 * Headline text — label-large, on-surface-variant.
 * Shows "Select date" / "Select dates" above the large date display.
 */
export const headlineVariants = cva(["text-label-large text-on-surface-variant m-0"]);

export type HeadlineVariants = VariantProps<typeof headlineVariants>;

/**
 * Supporting text — the large formatted selected date display.
 * MD3 spec: headline-large, on-surface.
 */
export const supportingTextVariants = cva([
  "text-headline-large text-on-surface mt-9 m-0", // NOTE: measurement-derived mt; permitted exception
]);

export type SupportingTextVariants = VariantProps<typeof supportingTextVariants>;

/**
 * Mode toggle button (calendar ↔ keyboard) — carries `group/mode-toggle`.
 * MD3 spec: 48dp circle, on-surface-variant.
 */
export const modeToggleVariants = cva([
  "relative flex items-center justify-center",
  "w-12 h-12 rounded-full", // NOTE: 48dp; permitted exception
  "text-on-surface-variant",
  "bg-transparent border-none cursor-pointer self-end",
  "overflow-hidden",
  "focus-visible:outline-none",
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "group/mode-toggle",
]);

export type ModeToggleVariants = VariantProps<typeof modeToggleVariants>;

/**
 * Mode toggle state layer.
 */
export const modeToggleStateLayerVariants = cva([
  "pointer-events-none absolute inset-0 rounded-full opacity-0",
  "bg-on-surface-variant",
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "group-data-[hovered]/mode-toggle:opacity-8",
  "group-data-[focus-visible]/mode-toggle:opacity-10",
  "group-data-[pressed]/mode-toggle:opacity-10",
]);

export type ModeToggleStateLayerVariants = VariantProps<typeof modeToggleStateLayerVariants>;

// ─── SCRIM ───────────────────────────────────────────────────────────────────

/**
 * Full-viewport dark overlay behind modal dialogs.
 * MD3 spec: bg-scrim at 32% opacity.
 */
export const scrimVariants = cva([
  "fixed inset-0 z-40",
  "bg-scrim opacity-32",
  "transition-opacity duration-medium2 ease-standard",
]);

export type ScrimVariants = VariantProps<typeof scrimVariants>;

// ─── DATE INPUT FIELD (modal-input) ──────────────────────────────────────────

/**
 * Outer wrapper for a labeled date input field (modal-input variant).
 * MD3 spec: 24dp horizontal padding, 8dp vertical.
 */
export const dateInputFieldVariants = cva(["px-6 py-2"]); // NOTE: measurement-derived; permitted exception

export type DateInputFieldVariants = VariantProps<typeof dateInputFieldVariants>;

/**
 * Inner outlined container of the date input field.
 * Focus state adds 2dp primary border; invalid adds error border.
 * MD3 spec: outlined text field, body-large text, rounded-sm shape.
 */
export const dateInputFieldGroupVariants = cva([
  "flex items-center",
  "border border-outline rounded-sm",
  "px-4 py-3", // NOTE: measurement-derived; permitted exception
  "text-body-large text-on-surface",
  // Focus state (data-focused on parent wrapper)
  "peer-data-[focused]:border-2 peer-data-[focused]:border-primary",
  // Invalid state
  "peer-data-[invalid]:border-error peer-data-[invalid]:border-2",
]);

export type DateInputFieldGroupVariants = VariantProps<typeof dateInputFieldGroupVariants>;

/**
 * Date input field label — body-small, on-surface-variant.
 */
export const dateInputLabelVariants = cva(["text-body-small text-on-surface-variant block mb-1"]);

export type DateInputLabelVariants = VariantProps<typeof dateInputLabelVariants>;

/**
 * Date input field error message — body-small, error color.
 */
export const dateInputErrorVariants = cva(["text-body-small text-error mt-1"]);

export type DateInputErrorVariants = VariantProps<typeof dateInputErrorVariants>;

// ─── DOCKED VARIANT PRIMITIVES ───────────────────────────────────────────────

/**
 * Docked trigger field group — outlined container for the date segments + icon.
 * MD3 spec: outlined text field, h-14, border-outline, flex, gap-2.
 */
export const dockedFieldGroupVariants = cva([
  "flex items-center",
  "border border-outline rounded",
  "h-14", // NOTE: measurement-derived (56dp); permitted exception
  "px-3 gap-2",
  "bg-transparent",
  // Focus-within: promote to primary 2dp border
  "focus-within:border-primary focus-within:border-2",
]);

export type DockedFieldGroupVariants = VariantProps<typeof dockedFieldGroupVariants>;

/**
 * Docked calendar icon trigger button — carries `group/docked-trigger`.
 * MD3 spec: 40dp circle icon button.
 */
export const dockedTriggerVariants = cva([
  "relative flex items-center justify-center",
  "w-10 h-10 rounded-full", // NOTE: 40dp; permitted exception
  "text-on-surface-variant",
  "bg-transparent border-none cursor-pointer",
  "overflow-hidden",
  "focus-visible:outline-none",
  "transition-colors duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "group/docked-trigger",
]);

export type DockedTriggerVariants = VariantProps<typeof dockedTriggerVariants>;

/**
 * Docked trigger state layer.
 */
export const dockedTriggerStateLayerVariants = cva([
  "pointer-events-none absolute inset-0 rounded-full opacity-0",
  "bg-on-surface-variant",
  "transition-opacity duration-spring-standard-fast-effects ease-spring-standard-fast-effects",
  "group-data-[hovered]/docked-trigger:opacity-8",
  "group-data-[focus-visible]/docked-trigger:opacity-10",
  "group-data-[pressed]/docked-trigger:opacity-10",
]);

export type DockedTriggerStateLayerVariants = VariantProps<typeof dockedTriggerStateLayerVariants>;

/**
 * Popover panel for the docked calendar.
 * MD3 spec: surface-container-high, 28dp corner, elevation-2, z-50.
 */
export const popoverVariants = cva([
  "bg-surface-container-high rounded-3xl",
  "shadow-elevation-2 overflow-hidden",
  "z-50 w-[360px]",
]);

export type PopoverVariants = VariantProps<typeof popoverVariants>;

// ─── DOCKED LABEL ────────────────────────────────────────────────────────────

/**
 * Label text above the docked text field.
 * MD3 spec: body-small, on-surface-variant.
 */
export const dockedLabelVariants = cva(["text-body-small text-on-surface-variant block mb-1"]);

export type DockedLabelVariants = VariantProps<typeof dockedLabelVariants>;

/**
 * Date field segments container (inline segmented date input).
 * flex, items-center, flex-1, body-large text.
 */
export const dateFieldVariants = cva([
  "flex items-center flex-1",
  "text-body-large text-on-surface",
]);

export type DateFieldVariants = VariantProps<typeof dateFieldVariants>;

/**
 * Date field placeholder segment text color.
 */
export const dateSegmentPlaceholderVariants = cva(["text-on-surface-variant"]);

export type DateSegmentPlaceholderVariants = VariantProps<typeof dateSegmentPlaceholderVariants>;
