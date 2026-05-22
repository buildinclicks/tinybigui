import { cva, type VariantProps } from "class-variance-authority";

// ─── Container ──────────────────────────────────────────────────────────────────

/**
 * CVA variants for the Date Picker container.
 * MD3 spec: surface-container-high background, extra-large corner radius (28dp).
 */
export const datePickerContainerVariants = cva(
  [
    "bg-surface-container-high",
    "rounded-3xl", // NOTE: shape.extra-large = 28dp; mapped via @theme token
    "overflow-hidden",
  ],
  {
    variants: {
      variant: {
        docked: "w-[360px]", // NOTE: measurement-derived value from MD3 spec (360dp fixed width); permitted exception
        modal: "w-[360px]", // NOTE: measurement-derived value from MD3 spec (360dp fixed width); permitted exception
        "modal-input": "w-[328px]", // NOTE: measurement-derived value from MD3 spec (328dp); permitted exception
      },
    },
    defaultVariants: {
      variant: "docked",
    },
  }
);

export type DatePickerContainerVariants = VariantProps<typeof datePickerContainerVariants>;

// ─── Calendar Cell ──────────────────────────────────────────────────────────────

/**
 * CVA for individual calendar date cells.
 * MD3 spec: 48x48dp circle, various states and types.
 */
export const calendarCellVariants = cva(
  [
    "w-[48px]", // NOTE: measurement-derived (48dp touch target); permitted exception
    "h-[48px]", // NOTE: measurement-derived (48dp); permitted exception
    "rounded-full", // shape.full = circle
    "flex",
    "items-center",
    "justify-center",
    "text-body-large",
    "relative",
    "cursor-pointer",
    "select-none",
    "transition-colors",
    "duration-spring-standard-fast-effects",
    "ease-spring-standard-fast-effects",
  ],
  {
    variants: {
      cellType: {
        default: "text-on-surface",
        today: "text-primary border border-primary",
        selected: "bg-primary text-on-primary",
        "selected-range-middle": "bg-secondary-container text-on-secondary-container rounded-none",
        "outside-month": "text-on-surface-variant",
        disabled: "text-on-surface/38 cursor-not-allowed",
      },
      state: {
        enabled: "",
        hovered: "",
        focused: "",
        pressed: "",
      },
    },
    compoundVariants: [
      // Default cell states
      {
        cellType: "default",
        state: "hovered",
        className: "bg-on-surface/8",
      },
      {
        cellType: "default",
        state: "focused",
        className: "bg-on-surface/10 ring-2 ring-on-surface",
      },
      {
        cellType: "default",
        state: "pressed",
        className: "bg-on-surface/10",
      },
      // Today cell states
      {
        cellType: "today",
        state: "hovered",
        className: "bg-primary/8",
      },
      {
        cellType: "today",
        state: "focused",
        className: "bg-primary/10",
      },
      {
        cellType: "today",
        state: "pressed",
        className: "bg-primary/10",
      },
      // Selected cell states
      {
        cellType: "selected",
        state: "hovered",
        className: "bg-primary shadow-sm",
      },
      {
        cellType: "selected",
        state: "focused",
        className: "bg-primary shadow-sm",
      },
      {
        cellType: "selected",
        state: "pressed",
        className: "bg-primary shadow-sm",
      },
      // Range middle states
      {
        cellType: "selected-range-middle",
        state: "hovered",
        className: "bg-secondary-container/80",
      },
      {
        cellType: "selected-range-middle",
        state: "focused",
        className: "bg-secondary-container/80",
      },
    ],
    defaultVariants: {
      cellType: "default",
      state: "enabled",
    },
  }
);

export type CalendarCellVariants = VariantProps<typeof calendarCellVariants>;

// ─── Header ─────────────────────────────────────────────────────────────────────

/**
 * CVA for the date picker header (headline + supporting text + toggle icon).
 */
export const datePickerHeaderVariants = cva(
  ["px-6", "pt-4", "pb-3"], // NOTE: measurement-derived padding; permitted exception
  {
    variants: {
      variant: {
        docked: "h-[56px] px-3 flex items-center", // NOTE: measurement-derived (56dp header); permitted exception
        modal: "h-auto",
        "modal-input": "h-auto",
      },
    },
    defaultVariants: {
      variant: "docked",
    },
  }
);

export type DatePickerHeaderVariants = VariantProps<typeof datePickerHeaderVariants>;

// ─── Navigation ─────────────────────────────────────────────────────────────────

/**
 * CVA for month/year navigation buttons.
 */
export const datePickerNavVariants = cva(
  ["text-on-surface-variant", "flex", "items-center", "gap-1"],
  {
    variants: {
      state: {
        enabled: "",
        hovered: "bg-on-surface-variant/8",
        focused: "bg-on-surface-variant/10",
        pressed: "bg-on-surface-variant/10",
        disabled: "text-on-surface/38 cursor-not-allowed",
      },
    },
    defaultVariants: {
      state: "enabled",
    },
  }
);

export type DatePickerNavVariants = VariantProps<typeof datePickerNavVariants>;

// ─── Year Item ──────────────────────────────────────────────────────────────────

/**
 * CVA for year grid items.
 * MD3 spec: 88dp × 52dp, pill shape when selected.
 */
export const yearItemVariants = cva(
  [
    "w-[88px]", // NOTE: measurement-derived (88dp); permitted exception
    "h-[52px]", // NOTE: measurement-derived (52dp); permitted exception
    "rounded-full", // pill shape
    "flex",
    "items-center",
    "justify-center",
    "text-body-large",
    "cursor-pointer",
    "transition-colors",
    "duration-spring-standard-fast-effects",
    "ease-spring-standard-fast-effects",
  ],
  {
    variants: {
      selected: {
        true: "bg-primary text-on-primary",
        false: "text-on-surface-variant",
      },
      state: {
        enabled: "",
        hovered: "",
        focused: "",
        pressed: "",
        disabled: "text-on-surface/38 cursor-not-allowed",
      },
    },
    compoundVariants: [
      {
        selected: false,
        state: "hovered",
        className: "bg-on-surface-variant/8",
      },
      {
        selected: false,
        state: "focused",
        className: "bg-on-surface-variant/10",
      },
      {
        selected: true,
        state: "hovered",
        className: "bg-primary/90",
      },
      {
        selected: true,
        state: "focused",
        className: "bg-primary/90",
      },
    ],
    defaultVariants: {
      selected: false,
      state: "enabled",
    },
  }
);

export type YearItemVariants = VariantProps<typeof yearItemVariants>;

// ─── Divider ────────────────────────────────────────────────────────────────────

/**
 * CVA for divider line between header and calendar.
 * MD3 spec: outline-variant, 1dp thickness.
 */
export const datePickerDividerVariants = cva(["border-outline-variant", "border-t", "w-full"]);

export type DatePickerDividerVariants = VariantProps<typeof datePickerDividerVariants>;

// ─── Action Buttons Row ─────────────────────────────────────────────────────────

/**
 * CVA for the action button row (Cancel, OK, Clear).
 * MD3 spec: right-aligned, 48dp height, 12dp horizontal padding.
 */
export const datePickerActionVariants = cva([
  "flex",
  "items-center",
  "justify-end",
  "gap-2",
  "px-3",
  "py-2",
  "h-12", // NOTE: measurement-derived (48dp action row height); permitted exception
]);

export type DatePickerActionVariants = VariantProps<typeof datePickerActionVariants>;

// ─── Action Button Text ─────────────────────────────────────────────────────────

/**
 * CVA for individual action button text styling.
 * MD3 spec: primary color text buttons.
 */
export const datePickerActionButtonVariants = cva([
  "text-primary",
  "text-label-large",
  "rounded-full",
  "px-3",
  "py-2",
  "transition-colors",
  "duration-spring-standard-fast-effects",
  "ease-spring-standard-fast-effects",
  "hover:bg-primary/8",
  "focus-visible:bg-primary/10",
  "active:bg-primary/10",
]);

export type DatePickerActionButtonVariants = VariantProps<typeof datePickerActionButtonVariants>;

// ─── Weekday Labels ─────────────────────────────────────────────────────────────

/**
 * CVA for weekday label text (S, M, T, W, T, F, S).
 * MD3 spec: body-small, on-surface color.
 */
export const datePickerWeekdayVariants = cva([
  "text-body-small",
  "text-on-surface",
  "font-normal",
  "w-[48px]", // NOTE: measurement-derived (48dp column width); permitted exception
  "h-[48px]", // NOTE: measurement-derived (48dp row height); permitted exception
  "text-center",
]);

export type DatePickerWeekdayVariants = VariantProps<typeof datePickerWeekdayVariants>;

// ─── Range Indicator ────────────────────────────────────────────────────────────

/**
 * CVA for range indicator strip between start and end dates.
 * MD3 spec: secondary-container background, 48dp height.
 */
export const datePickerRangeIndicatorVariants = cva([
  "bg-secondary-container",
  "h-[48px]", // NOTE: measurement-derived (48dp range indicator height); permitted exception
  "rounded-none",
]);

export type DatePickerRangeIndicatorVariants = VariantProps<
  typeof datePickerRangeIndicatorVariants
>;

// ─── Headline ───────────────────────────────────────────────────────────────────

/**
 * CVA for headline text in modal variants.
 * MD3 spec: headline-small typography, on-surface color.
 */
export const datePickerHeadlineVariants = cva([], {
  variants: {
    variant: {
      docked: "",
      modal: ["text-headline-small", "text-on-surface"],
      "modal-input": ["text-headline-small", "text-on-surface"],
    },
  },
  defaultVariants: {
    variant: "modal",
  },
});

export type DatePickerHeadlineVariants = VariantProps<typeof datePickerHeadlineVariants>;

// ─── Supporting Text ────────────────────────────────────────────────────────────

/**
 * CVA for supporting text below headline.
 * MD3 spec: label-large typography, on-surface-variant color.
 */
export const datePickerSupportingTextVariants = cva([
  "text-label-large",
  "text-on-surface-variant",
]);

export type DatePickerSupportingTextVariants = VariantProps<
  typeof datePickerSupportingTextVariants
>;

// ─── Scrim ──────────────────────────────────────────────────────────────────────

/**
 * CVA for modal scrim overlay.
 * Matches Dialog scrim pattern.
 */
export const datePickerScrimVariants = cva([
  "fixed",
  "inset-0",
  "z-40",
  "bg-scrim",
  "opacity-32",
  "transition-opacity",
  "duration-medium2",
  "ease-standard",
]);

export type DatePickerScrimVariants = VariantProps<typeof datePickerScrimVariants>;
