import { cva, type VariantProps } from "class-variance-authority";

// ─── Container ──────────────────────────────────────────────────────────────────

/**
 * CVA for the Time Picker container.
 * MD3 spec: surface-container-high, extra-large corner radius (28dp), 24dp padding.
 */
export const timePickerContainerVariants = cva(
  [
    "bg-surface-container-high",
    "rounded-3xl", // NOTE: shape.extra-large = 28dp; mapped via @theme token
    "p-6", // NOTE: measurement-derived (24dp padding); permitted exception
  ],
  {
    variants: {
      variant: {
        dial: "",
        input: "",
      },
      orientation: {
        vertical: "flex flex-col gap-6",
        horizontal: "flex flex-row gap-6",
      },
    },
    defaultVariants: {
      variant: "dial",
      orientation: "vertical",
    },
  }
);

export type TimePickerContainerVariants = VariantProps<typeof timePickerContainerVariants>;

// ─── Clock Dial Container ────────────────────────────────────────────────────────

/**
 * CVA for the clock dial circular container.
 * MD3 spec: 256dp × 256dp, full circle, surface-container-highest background.
 */
export const clockDialContainerVariants = cva([
  "w-[256px]", // NOTE: measurement-derived (256dp clock dial); permitted exception
  "h-[256px]", // NOTE: measurement-derived (256dp); permitted exception
  "rounded-full", // shape.full = circle
  "bg-surface-container-highest",
  "relative",
  "select-none",
  "touch-action-none",
]);

export type ClockDialContainerVariants = VariantProps<typeof clockDialContainerVariants>;

// ─── Clock Dial Number ───────────────────────────────────────────────────────────

/**
 * CVA for individual clock dial number labels.
 * MD3 spec: 48dp touch target, on-surface text, on-primary when selected.
 */
export const clockDialNumberVariants = cva(
  [
    "absolute",
    "w-[48px]", // NOTE: measurement-derived (48dp touch target); permitted exception
    "h-[48px]", // NOTE: measurement-derived (48dp); permitted exception
    "rounded-full",
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
        true: "bg-primary text-on-primary z-10",
        false: "text-on-surface",
      },
      ring: {
        outer: "",
        inner: "text-sm",
      },
      state: {
        enabled: "",
        hovered: "",
        focused: "",
      },
    },
    compoundVariants: [
      { selected: false, state: "hovered", className: "bg-on-surface/8" },
      { selected: false, state: "focused", className: "bg-on-surface/10" },
      { selected: true, state: "hovered", className: "bg-primary/90" },
      { selected: true, state: "focused", className: "bg-primary/90" },
    ],
    defaultVariants: {
      selected: false,
      ring: "outer",
      state: "enabled",
    },
  }
);

export type ClockDialNumberVariants = VariantProps<typeof clockDialNumberVariants>;

// ─── Clock Hand Parts ────────────────────────────────────────────────────────────

/**
 * CVA for the clock hand center dot.
 * MD3 spec: 8dp circle, primary color.
 */
export const clockHandCenterVariants = cva([
  "absolute",
  "top-1/2",
  "left-1/2",
  "-translate-x-1/2",
  "-translate-y-1/2",
  "w-[8px]", // NOTE: measurement-derived (8dp center dot); permitted exception
  "h-[8px]", // NOTE: measurement-derived (8dp); permitted exception
  "rounded-full",
  "bg-primary",
  "z-20",
]);

export type ClockHandCenterVariants = VariantProps<typeof clockHandCenterVariants>;

/**
 * CVA for the clock hand track (selector line from center to handle).
 * MD3 spec: 2dp width, primary color.
 */
export const clockHandTrackVariants = cva([
  "absolute",
  "top-1/2",
  "left-1/2",
  "w-[2px]", // NOTE: measurement-derived (2dp track width); permitted exception
  "bg-primary",
  "origin-bottom",
  "z-10",
]);

export type ClockHandTrackVariants = VariantProps<typeof clockHandTrackVariants>;

/**
 * CVA for the clock hand handle (endpoint circle).
 * MD3 spec: 48dp circle, primary color.
 */
export const clockHandHandleVariants = cva([
  "w-[48px]", // NOTE: measurement-derived (48dp handle); permitted exception
  "h-[48px]", // NOTE: measurement-derived (48dp); permitted exception
  "rounded-full",
  "bg-primary",
  "flex",
  "items-center",
  "justify-center",
  "text-on-primary",
  "text-body-large",
]);

export type ClockHandHandleVariants = VariantProps<typeof clockHandHandleVariants>;

// ─── Time Selector ───────────────────────────────────────────────────────────────

/**
 * CVA for the time selector containers (hour/minute display).
 * MD3 spec: 96dp × 80dp, small corner radius (8dp), display-large text.
 */
export const timeSelectorContainerVariants = cva(
  [
    "w-[96px]", // NOTE: measurement-derived (96dp); permitted exception
    "h-[80px]", // NOTE: measurement-derived (80dp); permitted exception
    "rounded-lg", // shape.small = 8dp
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "cursor-pointer",
    "text-display-large",
    "transition-colors",
    "duration-spring-standard-fast-effects",
    "ease-spring-standard-fast-effects",
  ],
  {
    variants: {
      selected: {
        true: "bg-primary-container text-on-primary-container",
        false: "bg-surface-container-highest text-on-surface",
      },
      state: {
        enabled: "",
        hovered: "",
        focused: "",
      },
    },
    compoundVariants: [
      {
        selected: false,
        state: "hovered",
        className: "bg-surface-container-highest/80",
      },
      {
        selected: false,
        state: "focused",
        className: "border-2 border-primary",
      },
      {
        selected: true,
        state: "hovered",
        className: "bg-primary-container/80",
      },
      {
        selected: true,
        state: "focused",
        className: "border-2 border-primary",
      },
    ],
    defaultVariants: {
      selected: false,
      state: "enabled",
    },
  }
);

export type TimeSelectorContainerVariants = VariantProps<typeof timeSelectorContainerVariants>;

// ─── Period Selector ─────────────────────────────────────────────────────────────

/**
 * CVA for the AM/PM period selector container.
 * MD3 spec: 52dp × 80dp (vertical) or 216dp × 38dp (horizontal), outline border.
 */
export const periodSelectorContainerVariants = cva(
  [
    "rounded-lg", // shape.small = 8dp
    "border",
    "border-outline",
    "overflow-hidden",
    "flex",
  ],
  {
    variants: {
      orientation: {
        vertical: "w-[52px] h-[80px] flex-col", // NOTE: measurement-derived; permitted exception
        horizontal: "w-[216px] h-[38px] flex-row", // NOTE: measurement-derived; permitted exception
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  }
);

export type PeriodSelectorContainerVariants = VariantProps<typeof periodSelectorContainerVariants>;

/**
 * CVA for individual period (AM/PM) buttons.
 * MD3 spec: tertiary-container when selected, on-surface-variant when not.
 */
export const periodSelectorItemVariants = cva(
  [
    "flex-1",
    "flex",
    "items-center",
    "justify-center",
    "text-title-medium",
    "cursor-pointer",
    "border-outline",
    "transition-colors",
    "duration-spring-standard-fast-effects",
    "ease-spring-standard-fast-effects",
  ],
  {
    variants: {
      selected: {
        true: "bg-tertiary-container text-on-tertiary-container border-transparent",
        false: "bg-transparent text-on-surface-variant",
      },
      state: {
        enabled: "",
        hovered: "",
        focused: "",
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
        className: "bg-tertiary-container/80",
      },
      {
        selected: true,
        state: "focused",
        className: "bg-tertiary-container/80",
      },
    ],
    defaultVariants: {
      selected: false,
      state: "enabled",
    },
  }
);

export type PeriodSelectorItemVariants = VariantProps<typeof periodSelectorItemVariants>;

// ─── Time Input Field ────────────────────────────────────────────────────────────

/**
 * CVA for time input field containers (keyboard entry mode).
 * MD3 spec: 96dp × 72dp, small corner radius (8dp).
 */
export const timeInputFieldVariants = cva(
  [
    "w-[96px]", // NOTE: measurement-derived (96dp); permitted exception
    "h-[72px]", // NOTE: measurement-derived (72dp); permitted exception
    "rounded-lg", // shape.small = 8dp
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "cursor-text",
    "text-display-large",
    "transition-colors",
    "duration-spring-standard-fast-effects",
    "ease-spring-standard-fast-effects",
  ],
  {
    variants: {
      selected: {
        true: "bg-primary-container text-on-primary-container border-2 border-primary",
        false: "bg-surface-container-highest text-on-surface",
      },
      state: {
        enabled: "",
        hovered: "",
        focused: "",
      },
    },
    defaultVariants: {
      selected: false,
      state: "enabled",
    },
  }
);

export type TimeInputFieldVariants = VariantProps<typeof timeInputFieldVariants>;

// ─── Separator ───────────────────────────────────────────────────────────────────

/**
 * CVA for the time separator colon (:) between hour and minute.
 * MD3 spec: display-large, on-surface color.
 */
export const timeSeparatorVariants = cva([
  "text-display-large",
  "text-on-surface",
  "select-none",
  "px-1",
]);

export type TimeSeparatorVariants = VariantProps<typeof timeSeparatorVariants>;

// ─── Headline ────────────────────────────────────────────────────────────────────

/**
 * CVA for the time picker headline text.
 * MD3 spec: label-medium typography, on-surface-variant color.
 */
export const timePickerHeadlineVariants = cva(["text-label-medium", "text-on-surface-variant"]);

export type TimePickerHeadlineVariants = VariantProps<typeof timePickerHeadlineVariants>;

// ─── Action Buttons ──────────────────────────────────────────────────────────────

/**
 * CVA for the action button row.
 * MD3 spec: right-aligned, gap spacing.
 */
export const timePickerActionRowVariants = cva(["flex", "items-center", "justify-end", "gap-2"]);

export type TimePickerActionRowVariants = VariantProps<typeof timePickerActionRowVariants>;

/**
 * CVA for individual action button text styling.
 * MD3 spec: primary color text buttons.
 */
export const timePickerActionButtonVariants = cva([
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

export type TimePickerActionButtonVariants = VariantProps<typeof timePickerActionButtonVariants>;

// ─── Mode Toggle ─────────────────────────────────────────────────────────────────

/**
 * CVA for the mode toggle icon button (switch between dial and input).
 * MD3 spec: on-surface-variant icon, standard icon button.
 */
export const timePickerModeToggleVariants = cva([
  "text-on-surface-variant",
  "w-12",
  "h-12",
  "rounded-full",
  "flex",
  "items-center",
  "justify-center",
  "transition-colors",
  "duration-spring-standard-fast-effects",
  "ease-spring-standard-fast-effects",
  "hover:bg-on-surface-variant/8",
  "focus-visible:bg-on-surface-variant/10",
]);

export type TimePickerModeToggleVariants = VariantProps<typeof timePickerModeToggleVariants>;
