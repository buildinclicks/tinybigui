/**
 * Shared structural styles for DatePicker variants.
 *
 * These are purely layout / non-interactive element selectors. They use
 * descendant `[&_[data-x]]:` selectors, which is acceptable for structural
 * (non-interaction-state) wrappers that the headless layer owns and cannot
 * accept className props (e.g. the calendar header row, table, divider text).
 *
 * Interactive elements (cells, nav buttons, year items, action buttons, etc.)
 * are handled by injected styled slot components (StyledCalendarCell, etc.)
 * that use the two-axis CVA + group-data model.
 *
 * Motion tokens follow the MD3 rule:
 *   - Small interactive elements (< 48dp): spring-standard-fast-*
 *   - Screen-level containers (modal/popover enter/exit): legacy standard-decelerate
 */

// ─── Calendar header row layout ──────────────────────────────────────────────

export const CALENDAR_HEADER_STRUCTURAL = [
  "[&_[data-calendar-header]]:flex",
  "[&_[data-calendar-header]]:items-center",
  "[&_[data-calendar-header]]:justify-between",
  "[&_[data-calendar-header]]:px-3",
  "[&_[data-calendar-header]]:py-2",

  // Nav group
  "[&_[data-calendar-nav]]:flex",
  "[&_[data-calendar-nav]]:items-center",
  "[&_[data-calendar-nav]]:gap-1",
];

// ─── Calendar grid / table ────────────────────────────────────────────────────

export const CALENDAR_GRID_STRUCTURAL = [
  // Table resets
  "[&_table]:border-collapse",
  // Center the fixed-width table so 7×48px = 336px is equally inset within 360px
  "[&_table]:mx-auto",
  "[&_th]:p-0",
  "[&_td]:p-0",
];

// ─── Year grid container ──────────────────────────────────────────────────────

export const YEAR_GRID_STRUCTURAL = [
  "[&_[data-year-grid]]:grid",
  "[&_[data-year-grid]]:grid-cols-3",
  "[&_[data-year-grid]]:gap-2",
  "[&_[data-year-grid]]:px-3",
  "[&_[data-year-grid]]:py-2",
  "[&_[data-year-grid]]:max-h-[280px]",
  "[&_[data-year-grid]]:overflow-y-auto",
  "[&_[data-year-grid]]:place-items-center",
];

// ─── Divider ─────────────────────────────────────────────────────────────────

export const DIVIDER_STRUCTURAL = ["[&_hr[data-divider]]:border-outline-variant"];

// ─── Action row container ─────────────────────────────────────────────────────

export const ACTION_ROW_STRUCTURAL = [
  "[&_[data-actions]]:flex",
  "[&_[data-actions]]:items-center",
  "[&_[data-actions]]:justify-end",
  "[&_[data-actions]]:gap-2",
  "[&_[data-actions]]:px-3",
  "[&_[data-actions]]:py-2",
  "[&_[data-actions]]:h-12",
];

// ─── Docked: label above the text field ──────────────────────────────────────

export const DOCKED_LABEL_STRUCTURAL = [
  "[&_[data-label]]:text-body-small",
  "[&_[data-label]]:text-on-surface-variant",
  "[&_[data-label]]:mb-1",
  "[&_[data-label]]:block",
];

// ─── Docked: outlined field group + segments ──────────────────────────────────

export const DOCKED_FIELD_STRUCTURAL = [
  "[&_[data-field-group]]:flex",
  "[&_[data-field-group]]:items-center",
  "[&_[data-field-group]]:border",
  "[&_[data-field-group]]:border-outline",
  "[&_[data-field-group]]:rounded",
  "[&_[data-field-group]]:h-14",
  "[&_[data-field-group]]:px-3",
  "[&_[data-field-group]]:gap-2",
  "[&_[data-field-group]]:bg-transparent",
  "[&_[data-field-group]:focus-within]:border-primary",
  "[&_[data-field-group]:focus-within]:border-2",

  "[&_[data-field]]:flex",
  "[&_[data-field]]:items-center",
  "[&_[data-field]]:flex-1",
  "[&_[data-field]]:text-body-large",
  "[&_[data-field]]:text-on-surface",

  "[&_[data-segment]]:outline-none",
  "[&_[data-segment][data-placeholder]]:text-on-surface-variant",
];

// ─── Docked: calendar icon trigger button ────────────────────────────────────
// Layout + interaction states via data-* attributes emitted by the headless layer.

export const DOCKED_TRIGGER_STRUCTURAL = [
  "[&_[data-trigger]]:relative",
  "[&_[data-trigger]]:flex",
  "[&_[data-trigger]]:items-center",
  "[&_[data-trigger]]:justify-center",
  "[&_[data-trigger]]:w-10",
  "[&_[data-trigger]]:h-10",
  "[&_[data-trigger]]:rounded-full",
  "[&_[data-trigger]]:text-on-surface-variant",
  "[&_[data-trigger]]:bg-transparent",
  "[&_[data-trigger]]:border-none",
  "[&_[data-trigger]]:cursor-pointer",
  "[&_[data-trigger]]:transition-colors",
  "[&_[data-trigger]]:duration-spring-standard-fast-effects",
  "[&_[data-trigger]]:ease-spring-standard-fast-effects",
  // Hover: 8% overlay via bg tint (acceptable for structural trigger)
  "[&_[data-trigger][data-hovered]]:bg-on-surface-variant/8",
  "[&_[data-trigger][data-focus-visible]]:bg-on-surface-variant/10",
  "[&_[data-trigger][data-focus-visible]]:outline",
  "[&_[data-trigger][data-focus-visible]]:outline-2",
  "[&_[data-trigger][data-focus-visible]]:outline-secondary",
  "[&_[data-trigger][data-disabled]]:text-on-surface/38",
  "[&_[data-trigger][data-disabled]]:cursor-not-allowed",
];

// ─── Docked: popover panel ────────────────────────────────────────────────────

export const DOCKED_POPOVER_STRUCTURAL = [
  "[&_[data-popover]]:bg-surface-container-high",
  "[&_[data-popover]]:rounded-3xl",
  "[&_[data-popover]]:mt-1",
  "[&_[data-popover]]:shadow-elevation-2",
  "[&_[data-popover]]:overflow-hidden",
  "[&_[data-popover]]:z-50",
];

// ─── Modal: dialog panel ──────────────────────────────────────────────────────

export const MODAL_DIALOG_STRUCTURAL = [
  "[&_[data-modal-dialog]]:bg-surface-container-high",
  "[&_[data-modal-dialog]]:rounded-3xl",
  "[&_[data-modal-dialog]]:overflow-hidden",
  "[&_[data-modal-dialog]]:fixed",
  "[&_[data-modal-dialog]]:top-1/2",
  "[&_[data-modal-dialog]]:left-1/2",
  "[&_[data-modal-dialog]]:-translate-x-1/2",
  "[&_[data-modal-dialog]]:-translate-y-1/2",
  "[&_[data-modal-dialog]]:z-50",
  "[&_[data-modal-dialog]]:max-h-[90vh]",
  "[&_[data-modal-dialog]]:overflow-y-auto",
];

// ─── Modal: header layout + text ──────────────────────────────────────────────

export const MODAL_HEADER_STRUCTURAL = [
  "[&_[data-modal-header]]:px-6",
  "[&_[data-modal-header]]:pt-4",
  "[&_[data-modal-header]]:pb-3",
  "[&_[data-modal-header]]:flex",
  "[&_[data-modal-header]]:items-start",
  "[&_[data-modal-header]]:justify-between",

  "[&_[data-headline]]:text-label-large",
  "[&_[data-headline]]:text-on-surface-variant",
  "[&_[data-headline]]:m-0",

  "[&_[data-supporting-text]]:text-headline-large",
  "[&_[data-supporting-text]]:text-on-surface",
  "[&_[data-supporting-text]]:mt-9",
  "[&_[data-supporting-text]]:m-0",
];

// ─── Modal-input: supporting text override (no top margin) ───────────────────

export const MODAL_INPUT_SUPPORTING_TEXT_STRUCTURAL = [
  "[&_[data-supporting-text]]:text-headline-large",
  "[&_[data-supporting-text]]:text-on-surface",
  "[&_[data-supporting-text]]:mt-4",
  "[&_[data-supporting-text]]:m-0",
];

// ─── Modal: scrim ─────────────────────────────────────────────────────────────

export const SCRIM_STRUCTURAL = [
  "[&_[data-scrim]]:fixed",
  "[&_[data-scrim]]:inset-0",
  "[&_[data-scrim]]:z-40",
  "[&_[data-scrim]]:bg-scrim",
  "[&_[data-scrim]]:opacity-32",
  "[&_[data-scrim]]:transition-opacity",
  "[&_[data-scrim]]:duration-medium2",
  "[&_[data-scrim]]:ease-standard",
];

// ─── Modal-input: date input fields ──────────────────────────────────────────

export const MODAL_INPUT_FIELD_STRUCTURAL = [
  "[&_[data-date-input-field]]:px-6",
  "[&_[data-date-input-field]]:py-2",

  "[&_[data-date-input-field]_[data-field]]:flex",
  "[&_[data-date-input-field]_[data-field]]:items-center",
  "[&_[data-date-input-field]_[data-field]]:border",
  "[&_[data-date-input-field]_[data-field]]:border-outline",
  "[&_[data-date-input-field]_[data-field]]:rounded-sm",
  "[&_[data-date-input-field]_[data-field]]:px-4",
  "[&_[data-date-input-field]_[data-field]]:py-3",
  "[&_[data-date-input-field]_[data-field]]:text-body-large",
  "[&_[data-date-input-field]_[data-field]]:text-on-surface",

  "[&_[data-date-input-field]_[data-segment]]:outline-none",
  "[&_[data-date-input-field]_[data-segment][data-placeholder]]:text-on-surface-variant",

  "[&_[data-date-input-field][data-focused]_[data-field]]:border-primary",
  "[&_[data-date-input-field][data-focused]_[data-field]]:border-2",

  "[&_[data-date-input-field][data-invalid]_[data-field]]:border-error",
  "[&_[data-date-input-field][data-invalid]_[data-field]]:border-2",

  "[&_[data-date-input-field]_[data-label]]:text-body-small",
  "[&_[data-date-input-field]_[data-label]]:text-on-surface-variant",
  "[&_[data-date-input-field]_[data-label]]:block",
  "[&_[data-date-input-field]_[data-label]]:mb-1",

  "[&_[data-date-input-field]_[data-error-message]]:text-body-small",
  "[&_[data-date-input-field]_[data-error-message]]:text-error",
  "[&_[data-date-input-field]_[data-error-message]]:mt-1",
];

// ─── Composed shared sets ─────────────────────────────────────────────────────

/**
 * All structural styles shared by docked and modal calendar variants.
 * Does NOT include popover/dialog/scrim (those differ per variant).
 */
export const SHARED_CALENDAR_STRUCTURAL = [
  ...CALENDAR_HEADER_STRUCTURAL,
  ...CALENDAR_GRID_STRUCTURAL,
  ...YEAR_GRID_STRUCTURAL,
  ...DIVIDER_STRUCTURAL,
  ...ACTION_ROW_STRUCTURAL,
].join(" ");

/**
 * Structural styles applied directly on the `[data-modal-dialog]` element for
 * the modal (calendar) variant. Does NOT include the dialog surface/sizing
 * (those come from `modalDialogVariants` applied inline) or the scrim
 * (applied via `scrimClassName` on `[data-scrim]`).
 *
 * Use this on the modal dialog's `className` alongside `modalDialogVariants`.
 */
export const MODAL_CONTENT_STRUCTURAL = [
  ...MODAL_HEADER_STRUCTURAL,
  ...CALENDAR_HEADER_STRUCTURAL,
  ...CALENDAR_GRID_STRUCTURAL,
  ...YEAR_GRID_STRUCTURAL,
  ...DIVIDER_STRUCTURAL,
  ...ACTION_ROW_STRUCTURAL,
].join(" ");

/**
 * Structural styles applied directly on the `[data-modal-dialog]` element for
 * the modal-input variant.
 *
 * Use this on the modal-input dialog's `className` alongside `modalDialogVariants`.
 */
export const MODAL_INPUT_CONTENT_STRUCTURAL = [
  ...MODAL_HEADER_STRUCTURAL,
  ...MODAL_INPUT_SUPPORTING_TEXT_STRUCTURAL,
  ...MODAL_INPUT_FIELD_STRUCTURAL,
  ...DIVIDER_STRUCTURAL,
  ...ACTION_ROW_STRUCTURAL,
].join(" ");

/**
 * Structural styles for the docked variant root (label, field, trigger only).
 * Calendar/popover styles live on the portaled popover panel — see
 * `DOCKED_POPOVER_PANEL_STRUCTURAL`.
 */
export const DOCKED_ROOT_STRUCTURAL = [
  ...DOCKED_LABEL_STRUCTURAL,
  ...DOCKED_FIELD_STRUCTURAL,
  ...DOCKED_TRIGGER_STRUCTURAL,
].join(" ");

/**
 * Structural styles applied directly on the portaled `[data-popover]` panel.
 * Includes shared calendar layout (header, grid, year grid, divider, actions).
 */
export const DOCKED_POPOVER_PANEL_STRUCTURAL = SHARED_CALENDAR_STRUCTURAL;

/**
 * Structural styles for the docked variant (root + descendant popover selectors).
 * @deprecated Prefer `DOCKED_ROOT_STRUCTURAL` on root and `DOCKED_POPOVER_PANEL_STRUCTURAL`
 * on the portaled popover panel.
 */
export const DOCKED_STRUCTURAL = [
  ...DOCKED_LABEL_STRUCTURAL,
  ...DOCKED_FIELD_STRUCTURAL,
  ...DOCKED_TRIGGER_STRUCTURAL,
  ...DOCKED_POPOVER_STRUCTURAL,
  ...CALENDAR_HEADER_STRUCTURAL,
  ...CALENDAR_GRID_STRUCTURAL,
  ...YEAR_GRID_STRUCTURAL,
  ...DIVIDER_STRUCTURAL,
  ...ACTION_ROW_STRUCTURAL,
].join(" ");

/**
 * Structural styles for the modal variant.
 * @deprecated Prefer `MODAL_CONTENT_STRUCTURAL` applied on the dialog element directly.
 */
export const MODAL_STRUCTURAL = [
  ...MODAL_DIALOG_STRUCTURAL,
  ...MODAL_HEADER_STRUCTURAL,
  ...SCRIM_STRUCTURAL,
  ...CALENDAR_HEADER_STRUCTURAL,
  ...CALENDAR_GRID_STRUCTURAL,
  ...YEAR_GRID_STRUCTURAL,
  ...DIVIDER_STRUCTURAL,
  ...ACTION_ROW_STRUCTURAL,
].join(" ");

/**
 * Structural styles for the modal-input variant.
 * @deprecated Prefer `MODAL_INPUT_CONTENT_STRUCTURAL` applied on the dialog element directly.
 */
export const MODAL_INPUT_STRUCTURAL = [
  ...MODAL_DIALOG_STRUCTURAL,
  ...MODAL_HEADER_STRUCTURAL,
  // Override the supporting-text margin (modal-input has a different layout)
  ...MODAL_INPUT_SUPPORTING_TEXT_STRUCTURAL,
  ...SCRIM_STRUCTURAL,
  ...MODAL_INPUT_FIELD_STRUCTURAL,
  ...DIVIDER_STRUCTURAL,
  ...ACTION_ROW_STRUCTURAL,
].join(" ");

// ─── Motion styles ────────────────────────────────────────────────────────────

/**
 * Screen-level motion for the docked popover container.
 * Uses legacy standard-decelerate (enter) / standard-accelerate (exit).
 * Applied directly on the portaled `[data-popover]` element when reduced motion
 * is NOT active.
 */
export const DOCKED_POPOVER_MOTION = [
  "transition-[transform,opacity]",
  "duration-short3",
  "ease-standard-decelerate",
  "data-[exiting]:duration-short2",
  "data-[exiting]:ease-standard-accelerate",
].join(" ");

/**
 * Screen-level motion for the docked popover container (root descendant selector).
 * @deprecated Prefer `DOCKED_POPOVER_MOTION` applied directly on the portaled popover.
 */
export const DOCKED_MOTION_STRUCTURAL = [
  "[&_[data-popover]]:transition-[transform,opacity]",
  "[&_[data-popover]]:duration-short3",
  "[&_[data-popover]]:ease-standard-decelerate",
  "[&_[data-popover][data-exiting]]:duration-short2",
  "[&_[data-popover][data-exiting]]:ease-standard-accelerate",
].join(" ");

/**
 * Screen-level motion for the modal dialog container.
 * Uses legacy standard-decelerate (enter) / standard-accelerate (exit).
 * Applied conditionally when reduced motion is NOT active.
 */
export const MODAL_MOTION_STRUCTURAL = [
  "[&_[data-modal-dialog]]:transition-[transform,opacity]",
  "[&_[data-modal-dialog]]:duration-medium2",
  "[&_[data-modal-dialog]]:ease-standard-decelerate",
  "[&_[data-modal-dialog][data-exiting]]:duration-medium1",
  "[&_[data-modal-dialog][data-exiting]]:ease-standard-accelerate",
].join(" ");

/**
 * Screen-level motion applied directly on the `[data-modal-dialog]` element.
 * Uses standard-decelerate (enter) / standard-accelerate (exit).
 * Applied conditionally when reduced motion is NOT active.
 */
export const MODAL_DIALOG_MOTION = [
  "transition-[transform,opacity]",
  "duration-medium2",
  "ease-standard-decelerate",
  "data-[exiting]:duration-medium1",
  "data-[exiting]:ease-standard-accelerate",
].join(" ");
