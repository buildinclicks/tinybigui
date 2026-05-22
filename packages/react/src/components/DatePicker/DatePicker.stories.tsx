"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CalendarDate } from "@internationalized/date";
import { DatePicker } from "./DatePicker";
import type { DateValue } from "@internationalized/date";

// ─── Helper: weekend checker ──────────────────────────────────────────────────

function isWeekend(date: DateValue): boolean {
  const jsDate = new Date(date.year, date.month - 1, date.day);
  const day = jsDate.getDay();
  return day === 0 || day === 6;
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "MD3 Date Picker — allows users to select a date or date range. Supports Docked (inline), Modal (overlay), and Modal Input (keyboard entry) variants with full calendar navigation and accessible date selection.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["docked", "modal", "modal-input"],
      description: "Structural variant of the date picker.",
    },
    selectionMode: {
      control: "radio",
      options: ["single", "range"],
      description: "Date selection mode — single date or date range.",
    },
    isDisabled: {
      control: "boolean",
      description: "Whether the picker is disabled.",
    },
    label: {
      control: "text",
      description: "Visible label text for the date picker.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

// ─── 1. Default ───────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    label: "Departure date",
    "aria-label": "Departure date",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default docked date picker with a text field trigger. Click the calendar icon or focus the field segments to open the popover calendar.",
      },
    },
  },
};

// ─── 2. Docked Open ──────────────────────────────────────────────────────────

export const DockedOpen: Story = {
  args: {
    label: "Check-in date",
    "aria-label": "Check-in date",
    defaultOpen: true,
    defaultValue: new CalendarDate(2025, 8, 17),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Docked variant with the popover calendar open by default. Shows the August 2025 calendar grid with the 17th pre-selected.",
      },
    },
  },
};

// ─── 3. Docked With Selected Date ─────────────────────────────────────────────

export const DockedWithSelectedDate: Story = {
  args: {
    label: "Birthday",
    "aria-label": "Birthday",
    defaultValue: new CalendarDate(1990, 6, 15),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Docked date picker with a pre-selected date (June 15, 1990). The date field segments display the formatted date value.",
      },
    },
  },
};

// ─── 4. Modal Single Date ─────────────────────────────────────────────────────

const ModalSingleDateDemo = (): JSX.Element => {
  const [open, setOpen] = useState(true);
  const [date, setDate] = useState<DateValue | null>(null);

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-primary text-on-primary text-label-large rounded-full px-6 py-3"
      >
        Select appointment date
      </button>
      {date && (
        <p className="text-body-medium text-on-surface">
          Selected: {date.month}/{date.day}/{date.year}
        </p>
      )}
      <DatePicker
        variant="modal"
        isOpen={open}
        onOpenChange={setOpen}
        onChange={setDate}
        aria-label="Appointment date"
      />
    </div>
  );
};

export const ModalSingleDate: Story = {
  render: () => <ModalSingleDateDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Modal variant for single date selection. Opens as a full overlay dialog with calendar grid, navigation, and Cancel/OK action buttons.",
      },
    },
  },
};

// ─── 5. Modal Date Range ──────────────────────────────────────────────────────

const ModalDateRangeDemo = (): JSX.Element => {
  const [open, setOpen] = useState(true);
  const [range, setRange] = useState<{
    start: DateValue;
    end: DateValue;
  } | null>(null);

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-primary text-on-primary text-label-large rounded-full px-6 py-3"
      >
        Select trip dates
      </button>
      {range && (
        <p className="text-body-medium text-on-surface">
          {range.start.month}/{range.start.day}/{range.start.year} – {range.end.month}/
          {range.end.day}/{range.end.year}
        </p>
      )}
      <DatePicker
        variant="modal"
        selectionMode="range"
        isOpen={open}
        onOpenChange={setOpen}
        onRangeChange={setRange}
        defaultRangeValue={{
          start: new CalendarDate(2025, 9, 10),
          end: new CalendarDate(2025, 9, 17),
        }}
        aria-label="Trip dates"
      />
    </div>
  );
};

export const ModalDateRange: Story = {
  render: () => <ModalDateRangeDemo />,
  args: {
    selectionMode: "range",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Modal date picker in range selection mode. Select a start and end date — the in-between dates are highlighted with bg-secondary-container. Default range: Sep 10–17, 2025.",
      },
    },
  },
};

// ─── 6. Modal Input Single ────────────────────────────────────────────────────

const ModalInputSingleDemo = (): JSX.Element => {
  const [open, setOpen] = useState(true);
  const [date, setDate] = useState<DateValue | null>(null);

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-primary text-on-primary text-label-large rounded-full px-6 py-3"
      >
        Enter date of birth
      </button>
      {date && (
        <p className="text-body-medium text-on-surface">
          Entered: {date.month}/{date.day}/{date.year}
        </p>
      )}
      <DatePicker
        variant="modal-input"
        isOpen={open}
        onOpenChange={setOpen}
        onChange={setDate}
        aria-label="Date of birth"
      />
    </div>
  );
};

export const ModalInputSingle: Story = {
  render: () => <ModalInputSingleDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Modal input variant for single date entry via keyboard. Shows outlined text field with mm/dd/yyyy segments and inline validation.",
      },
    },
  },
};

// ─── 7. Modal Input Range ─────────────────────────────────────────────────────

const ModalInputRangeDemo = (): JSX.Element => {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-primary text-on-primary text-label-large rounded-full px-6 py-3"
      >
        Enter booking dates
      </button>
      <DatePicker
        variant="modal-input"
        selectionMode="range"
        isOpen={open}
        onOpenChange={setOpen}
        defaultRangeValue={{
          start: new CalendarDate(2025, 12, 20),
          end: new CalendarDate(2025, 12, 31),
        }}
        aria-label="Booking dates"
      />
    </div>
  );
};

export const ModalInputRange: Story = {
  render: () => <ModalInputRangeDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Modal input variant for date range entry. Renders two outlined text fields — "Start date" and "End date" — with cross-field validation ensuring end date is after start date.',
      },
    },
  },
};

// ─── 8. With Min/Max Constraints ──────────────────────────────────────────────

export const WithMinMaxConstraints: Story = {
  args: {
    label: "Event registration",
    "aria-label": "Event registration",
    defaultOpen: true,
    defaultValue: new CalendarDate(2025, 10, 15),
    minValue: new CalendarDate(2025, 10, 1),
    maxValue: new CalendarDate(2025, 10, 31),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Docked date picker constrained to October 2025 only. Dates outside the 1st–31st range are disabled with aria-disabled="true" and reduced opacity (38%).',
      },
    },
  },
};

// ─── 9. With Unavailable Dates ────────────────────────────────────────────────

export const WithUnavailableDates: Story = {
  args: {
    label: "Appointment",
    "aria-label": "Appointment",
    defaultOpen: true,
    defaultValue: new CalendarDate(2025, 8, 18),
    isDateUnavailable: isWeekend,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Docked date picker with weekends disabled via the isDateUnavailable callback. Saturday and Sunday cells are aria-disabled and cannot be selected.",
      },
    },
  },
};

// ─── 10. Controlled ───────────────────────────────────────────────────────────

const ControlledDemo = (): JSX.Element => {
  const [date, setDate] = useState<DateValue | null>(new CalendarDate(2025, 8, 17));

  return (
    <div className="flex flex-col items-center gap-4">
      <DatePicker
        label="Controlled date"
        aria-label="Controlled date"
        value={date}
        onChange={setDate}
      />
      <p className="text-body-medium text-on-surface">
        Selected: {date ? `${date.month}/${date.day}/${date.year}` : "None"}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setDate(new CalendarDate(2025, 1, 1))}
          className="bg-secondary-container text-on-secondary-container text-label-medium rounded-full px-3 py-1"
        >
          New Year
        </button>
        <button
          type="button"
          onClick={() => setDate(new CalendarDate(2025, 12, 25))}
          className="bg-secondary-container text-on-secondary-container text-label-medium rounded-full px-3 py-1"
        >
          Christmas
        </button>
        <button
          type="button"
          onClick={() => setDate(null)}
          className="bg-secondary-container text-on-secondary-container text-label-medium rounded-full px-3 py-1"
        >
          Clear
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
          "Controlled date picker with external state management. Quick-set buttons demonstrate programmatic value changes — the date field updates immediately.",
      },
    },
  },
};

// ─── 11. Year Selection View ──────────────────────────────────────────────────

export const YearSelectionView: Story = {
  args: {
    variant: "modal",
    isOpen: true,
    "aria-label": "Select year",
    defaultValue: new CalendarDate(2025, 8, 17),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Modal date picker — click the month/year label in the header to switch to the year selection grid. Each year item is 88×52dp with bg-primary when selected.",
      },
    },
  },
};

// ─── 12. Month Selection View ─────────────────────────────────────────────────

export const MonthSelectionView: Story = {
  args: {
    variant: "modal",
    isOpen: true,
    "aria-label": "Select month",
    defaultValue: new CalendarDate(2025, 8, 17),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Modal date picker — click the dropdown arrow next to the month/year label to access month navigation. Use Previous/Next month buttons for sequential navigation.",
      },
    },
  },
};

// ─── 13. Disabled State ───────────────────────────────────────────────────────

const DisabledStateDemo = (): JSX.Element => (
  <div className="flex w-full max-w-md flex-col gap-8">
    <div className="flex flex-col gap-2">
      <span className="text-label-small text-on-surface-variant">Docked — disabled</span>
      <DatePicker
        label="Departure date"
        aria-label="Departure date disabled"
        defaultValue={new CalendarDate(2025, 8, 17)}
        isDisabled
      />
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-label-small text-on-surface-variant">Modal — disabled</span>
      <DatePicker
        variant="modal"
        aria-label="Modal disabled"
        defaultValue={new CalendarDate(2025, 8, 17)}
        isDisabled
      />
    </div>
    <div className="flex flex-col gap-2">
      <span className="text-label-small text-on-surface-variant">Modal Input — disabled</span>
      <DatePicker
        variant="modal-input"
        aria-label="Modal input disabled"
        defaultValue={new CalendarDate(2025, 8, 17)}
        isDisabled
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
          "All three variants in disabled state. The date picker is visible but non-interactive — trigger button, calendar, and action buttons are all inert.",
      },
    },
  },
};

// ─── 14. All Variants Comparison ──────────────────────────────────────────────

const AllVariantsDemo = (): JSX.Element => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInputOpen, setModalInputOpen] = useState(false);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-label-small text-on-surface-variant">Docked</span>
        <DatePicker
          label="Check-in"
          aria-label="Check-in docked"
          defaultValue={new CalendarDate(2025, 8, 17)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label-small text-on-surface-variant">Modal</span>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="bg-secondary-container text-on-secondary-container text-label-large self-start rounded-full px-6 py-3"
        >
          Open Modal
        </button>
        <DatePicker
          variant="modal"
          isOpen={modalOpen}
          onOpenChange={setModalOpen}
          aria-label="Check-in modal"
          defaultValue={new CalendarDate(2025, 8, 17)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-label-small text-on-surface-variant">Modal Input</span>
        <button
          type="button"
          onClick={() => setModalInputOpen(true)}
          className="bg-secondary-container text-on-secondary-container text-label-large self-start rounded-full px-6 py-3"
        >
          Open Modal Input
        </button>
        <DatePicker
          variant="modal-input"
          isOpen={modalInputOpen}
          onOpenChange={setModalInputOpen}
          aria-label="Check-in modal input"
          defaultValue={new CalendarDate(2025, 8, 17)}
        />
      </div>
    </div>
  );
};

export const AllVariantsComparison: Story = {
  render: () => <AllVariantsDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Side-by-side comparison of all three date picker variants: Docked (inline popover), Modal (overlay dialog with calendar), and Modal Input (keyboard text entry).",
      },
    },
  },
};

// ─── 15. Custom Labels ────────────────────────────────────────────────────────

export const CustomLabels: Story = {
  args: {
    variant: "modal",
    isOpen: true,
    headline: "Pick a departure date",
    supportingText: "Choose a date for your flight",
    cancelLabel: "Go back",
    confirmLabel: "Confirm departure",
    "aria-label": "Departure date",
    defaultValue: new CalendarDate(2025, 11, 28),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Modal date picker with custom headline, supporting text, and action button labels. Demonstrates l10n-ready label customization for airline booking flows.",
      },
    },
  },
};

// ─── 16. Form Integration ─────────────────────────────────────────────────────

const FormIntegrationDemo = (): JSX.Element => {
  const [date, setDate] = useState<DateValue | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-80 flex-col gap-4">
      <DatePicker
        label="Appointment date"
        aria-label="Appointment date"
        value={date}
        onChange={setDate}
        isRequired
        minValue={new CalendarDate(2025, 1, 1)}
        maxValue={new CalendarDate(2025, 12, 31)}
      />
      <button
        type="submit"
        className="bg-primary text-on-primary text-label-large rounded-full px-6 py-3"
      >
        Book appointment
      </button>
      {submitted && (
        <p className="text-body-medium text-on-surface">
          {date ? `Booked for ${date.month}/${date.day}/${date.year}` : "Please select a date"}
        </p>
      )}
    </form>
  );
};

export const FormIntegration: Story = {
  render: () => <FormIntegrationDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Date picker inside a form with isRequired and min/max validation. The date value can be read from controlled state for form submission. Constrained to year 2025.",
      },
    },
  },
};

// ─── 17. With Clear Button ────────────────────────────────────────────────────

const WithClearButtonDemo = (): JSX.Element => {
  const [open, setOpen] = useState(true);
  const [date, setDate] = useState<DateValue | null>(new CalendarDate(2025, 8, 17));

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-primary text-on-primary text-label-large rounded-full px-6 py-3"
      >
        Select date
      </button>
      {date && (
        <p className="text-body-medium text-on-surface">
          Selected: {date.month}/{date.day}/{date.year}
        </p>
      )}
      <DatePicker
        variant="modal"
        isOpen={open}
        onOpenChange={setOpen}
        value={date}
        onChange={setDate}
        showClear
        onClear={() => setDate(null)}
        aria-label="Select date with clear"
      />
    </div>
  );
};

export const WithClearButton: Story = {
  render: () => <WithClearButtonDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Modal date picker with the Clear button enabled via showClear. Pressing Clear resets the selection to null without closing the dialog.",
      },
    },
  },
};
