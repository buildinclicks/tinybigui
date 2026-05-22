"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { TimePicker } from "./TimePicker";
import type { TimeValue } from "./TimePicker.types";

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof TimePicker> = {
  title: "Components/TimePicker",
  component: TimePicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "MD3 Time Picker — allows users to select a time using a clock dial or keyboard input. Supports 12-hour and 24-hour formats with AM/PM period selection, vertical and horizontal orientations.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["dial", "input"],
      description: "Structural variant — Dial (clock face) or Input (keyboard entry).",
    },
    hourCycle: {
      control: "radio",
      options: [12, 24],
      description: "Hour cycle — 12-hour with AM/PM or 24-hour format.",
    },
    orientation: {
      control: "radio",
      options: ["vertical", "horizontal"],
      description: "Layout orientation for the dial variant.",
    },
    isDisabled: {
      control: "boolean",
      description: "Whether the picker is disabled.",
    },
    label: {
      control: "text",
      description: "Visible label text for the time picker.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

// ─── 1. Default ───────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    hourCycle: 12,
    defaultValue: { hour: 7, minute: 30 },
    "aria-label": "Alarm time",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default dial time picker in 12-hour format. The clock face starts in hour selection mode — tap a number to select the hour, then auto-advances to minute selection.",
      },
    },
  },
};

// ─── 2. Dial 24 Hour ──────────────────────────────────────────────────────────

export const Dial24Hour: Story = {
  args: {
    hourCycle: 24,
    defaultValue: { hour: 14, minute: 45 },
    "aria-label": "Meeting time 24h",
  },
  parameters: {
    docs: {
      description: {
        story:
          "24-hour clock dial with outer ring (1–12) and inner ring (13–24/0). No AM/PM period selector is shown. Tap the inner ring area to select hours 13–23 or 0.",
      },
    },
  },
};

// ─── 3. Dial Horizontal ───────────────────────────────────────────────────────

export const DialHorizontal: Story = {
  args: {
    hourCycle: 12,
    orientation: "horizontal",
    defaultValue: { hour: 9, minute: 15 },
    "aria-label": "Departure time horizontal",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Horizontal orientation places the time selector and period selector beside the clock dial instead of above it. Best for wider viewports and landscape layouts.",
      },
    },
  },
};

// ─── 4. Input 12 Hour ─────────────────────────────────────────────────────────

export const Input12Hour: Story = {
  args: {
    variant: "input",
    hourCycle: 12,
    defaultValue: { hour: 10, minute: 30 },
    "aria-label": "Meeting time input 12h",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Input variant with 12-hour format. Two large numeric fields (hour, minute) with AM/PM period selector. Type digits directly or use Arrow Up/Down to increment values.",
      },
    },
  },
};

// ─── 5. Input 24 Hour ─────────────────────────────────────────────────────────

export const Input24Hour: Story = {
  args: {
    variant: "input",
    hourCycle: 24,
    defaultValue: { hour: 16, minute: 45 },
    "aria-label": "Meeting time input 24h",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Input variant with 24-hour format. No period selector is rendered. Hour range is 0–23 with wrapping (23 → 0 on ArrowUp).",
      },
    },
  },
};

// ─── 6. With Default Time ─────────────────────────────────────────────────────

export const WithDefaultTime: Story = {
  args: {
    hourCycle: 12,
    defaultValue: { hour: 8, minute: 0 },
    "aria-label": "Morning alarm",
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dial time picker pre-set to 8:00 AM — a typical morning alarm setting. The clock hand points to 8 and the time selector displays "08" : "00".',
      },
    },
  },
};

// ─── 7. With Min/Max Time ─────────────────────────────────────────────────────

export const WithMinMaxTime: Story = {
  args: {
    hourCycle: 12,
    defaultValue: { hour: 9, minute: 0 },
    minValue: { hour: 8, minute: 0 },
    maxValue: { hour: 17, minute: 0 },
    "aria-label": "Business hours",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Time picker constrained to business hours (8:00 AM – 5:00 PM). Values outside this range are clamped on blur validation.",
      },
    },
  },
};

// ─── 8. Minute Step ───────────────────────────────────────────────────────────

export const MinuteStep: Story = {
  args: {
    hourCycle: 12,
    defaultValue: { hour: 10, minute: 0 },
    minuteStep: 15,
    "aria-label": "Appointment slot",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dial with 15-minute step snapping. Minutes snap to 0, 15, 30, 45 on the clock face. Useful for appointment scheduling with fixed slot durations.",
      },
    },
  },
};

// ─── 9. Controlled ────────────────────────────────────────────────────────────

const ControlledDemo = (): JSX.Element => {
  const [time, setTime] = useState<TimeValue>({ hour: 14, minute: 30 });

  const formatTime = (t: TimeValue): string => {
    const h = t.hour % 12 || 12;
    const period = t.hour >= 12 ? "PM" : "AM";
    return `${h}:${String(t.minute).padStart(2, "0")} ${period}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <TimePicker hourCycle={12} value={time} onChange={setTime} aria-label="Controlled time" />
      <p className="text-body-medium text-on-surface">
        Current time: <strong>{formatTime(time)}</strong>
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTime({ hour: 9, minute: 0 })}
          className="bg-secondary-container text-on-secondary-container text-label-medium rounded-full px-3 py-1"
        >
          9:00 AM
        </button>
        <button
          type="button"
          onClick={() => setTime({ hour: 12, minute: 0 })}
          className="bg-secondary-container text-on-secondary-container text-label-medium rounded-full px-3 py-1"
        >
          12:00 PM
        </button>
        <button
          type="button"
          onClick={() => setTime({ hour: 18, minute: 30 })}
          className="bg-secondary-container text-on-secondary-container text-label-medium rounded-full px-3 py-1"
        >
          6:30 PM
        </button>
      </div>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Controlled time picker with external state. Quick-set buttons demonstrate programmatic value changes — the clock hand and selectors update instantly.",
      },
    },
  },
};

// ─── 10. Disabled State ───────────────────────────────────────────────────────

const DisabledStateDemo = (): JSX.Element => (
  <div className="flex w-full max-w-2xl flex-col gap-8">
    <div className="flex flex-col gap-2">
      <span className="text-label-small text-on-surface-variant">Dial — disabled</span>
      <TimePicker
        hourCycle={12}
        defaultValue={{ hour: 7, minute: 30 }}
        isDisabled
        aria-label="Dial disabled"
      />
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-label-small text-on-surface-variant">Input — disabled</span>
      <TimePicker
        variant="input"
        hourCycle={12}
        defaultValue={{ hour: 7, minute: 30 }}
        isDisabled
        aria-label="Input disabled"
      />
    </div>
  </div>
);

export const DisabledState: Story = {
  render: () => <DisabledStateDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Both dial and input variants in disabled state. All interactive elements (clock dial, spinbuttons, period selector, action buttons) are inert.",
      },
    },
  },
};

// ─── 11. All Variants Comparison ──────────────────────────────────────────────

const AllVariantsDemo = (): JSX.Element => (
  <div className="flex w-full max-w-3xl flex-col gap-10">
    <div className="flex flex-col gap-2">
      <span className="text-label-small text-on-surface-variant">Dial (12h)</span>
      <TimePicker
        hourCycle={12}
        defaultValue={{ hour: 10, minute: 30 }}
        aria-label="Dial 12h comparison"
      />
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-label-small text-on-surface-variant">Input (12h)</span>
      <TimePicker
        variant="input"
        hourCycle={12}
        defaultValue={{ hour: 10, minute: 30 }}
        aria-label="Input 12h comparison"
      />
    </div>
  </div>
);

export const AllVariantsComparison: Story = {
  render: () => <AllVariantsDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Side-by-side comparison of Dial and Input variants at the same time value (10:30 AM). Dial is touch-optimized; Input is keyboard-optimized.",
      },
    },
  },
};

// ─── 12. Mode Toggle Demo ─────────────────────────────────────────────────────

const ModeToggleRender = (): JSX.Element => {
  const [variant, setVariant] = useState<"dial" | "input">("dial");
  const [time, setTime] = useState<TimeValue>({ hour: 14, minute: 0 });

  return (
    <div className="flex flex-col items-center gap-4">
      <TimePicker
        variant={variant}
        hourCycle={12}
        value={time}
        onChange={setTime}
        aria-label="Mode toggle demo"
      />
      <p className="text-body-medium text-on-surface">
        Current mode: <strong>{variant}</strong>
      </p>
      <button
        type="button"
        onClick={() => setVariant(variant === "dial" ? "input" : "dial")}
        className="bg-secondary-container text-on-secondary-container text-label-large rounded-full px-6 py-3"
      >
        Switch to {variant === "dial" ? "input" : "dial"}
      </button>
    </div>
  );
};

export const ModeToggleDemo: Story = {
  render: () => <ModeToggleRender />,
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates programmatic switching between dial and input variants while preserving the selected time value. The mode toggle icon in each variant triggers this same switch.",
      },
    },
  },
};

// ─── 13. Vertical vs Horizontal ───────────────────────────────────────────────

const VerticalVsHorizontalDemo = (): JSX.Element => (
  <div className="flex w-full max-w-4xl flex-col gap-10">
    <div className="flex flex-col gap-2">
      <span className="text-label-small text-on-surface-variant">Vertical (default)</span>
      <TimePicker
        hourCycle={12}
        orientation="vertical"
        defaultValue={{ hour: 9, minute: 45 }}
        aria-label="Vertical orientation"
      />
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-label-small text-on-surface-variant">Horizontal</span>
      <TimePicker
        hourCycle={12}
        orientation="horizontal"
        defaultValue={{ hour: 9, minute: 45 }}
        aria-label="Horizontal orientation"
      />
    </div>
  </div>
);

export const VerticalVsHorizontal: Story = {
  render: () => <VerticalVsHorizontalDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Comparison of vertical and horizontal orientations. Vertical stacks the clock dial below the time selector; horizontal places them side-by-side for wider layouts.",
      },
    },
  },
};

// ─── 14. AM/PM Toggle ─────────────────────────────────────────────────────────

const AMPMToggleDemo = (): JSX.Element => {
  const [time, setTime] = useState<TimeValue>({ hour: 7, minute: 30 });

  const formatTime = (t: TimeValue): string => {
    const h = t.hour % 12 || 12;
    const period = t.hour >= 12 ? "PM" : "AM";
    return `${h}:${String(t.minute).padStart(2, "0")} ${period}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <TimePicker hourCycle={12} value={time} onChange={setTime} aria-label="AM PM toggle demo" />
      <p className="text-body-medium text-on-surface">
        Time: <strong>{formatTime(time)}</strong>
      </p>
      <p className="text-body-small text-on-surface-variant">
        Use the AM/PM selector or press Arrow Left/Right when focused on the period radio group to
        toggle between morning and afternoon.
      </p>
    </div>
  );
};

export const AMPMToggle: Story = {
  render: () => <AMPMToggleDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates the AM/PM period selector interaction. The period selector uses role="radiogroup" with role="radio" children — Arrow Left/Right toggles between AM and PM.',
      },
    },
  },
};

// ─── 15. Custom Labels ────────────────────────────────────────────────────────

export const CustomLabels: Story = {
  args: {
    hourCycle: 12,
    defaultValue: { hour: 6, minute: 0 },
    headline: "Set wake-up alarm",
    cancelLabel: "Dismiss",
    confirmLabel: "Set alarm",
    "aria-label": "Wake-up alarm",
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dial time picker with custom headline and action button labels. Headline reads "Set wake-up alarm" instead of the default "Select time". Action buttons read "Dismiss" and "Set alarm".',
      },
    },
  },
};

// ─── 16. Dial 12h vs 24h ─────────────────────────────────────────────────────

const Dial12hVs24hDemo = (): JSX.Element => (
  <div className="flex w-full max-w-3xl flex-col gap-10">
    <div className="flex flex-col gap-2">
      <span className="text-label-small text-on-surface-variant">12-hour format</span>
      <TimePicker
        hourCycle={12}
        defaultValue={{ hour: 15, minute: 30 }}
        aria-label="12 hour format"
      />
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-label-small text-on-surface-variant">24-hour format</span>
      <TimePicker
        hourCycle={24}
        defaultValue={{ hour: 15, minute: 30 }}
        aria-label="24 hour format"
      />
    </div>
  </div>
);

export const Dial12hVs24h: Story = {
  render: () => <Dial12hVs24hDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Comparison of 12-hour and 24-hour dial formats at the same time (3:30 PM / 15:30). The 12-hour dial shows 12 numbers with AM/PM toggle; the 24-hour dial shows 24 numbers in two concentric rings.",
      },
    },
  },
};
