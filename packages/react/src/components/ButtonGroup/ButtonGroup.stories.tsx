"use client";

import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { within, userEvent, expect } from "storybook/test";
import { ButtonGroup } from "./ButtonGroup";
import { useButtonGroup } from "./ButtonGroupContext";

// ---------------------------------------------------------------------------
// Shared SVG icon helpers
// ---------------------------------------------------------------------------

const IconBluetooth = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z" />
  </svg>
);

const IconAlarm = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M22 5.72l-4.6-3.86-1.29 1.53 4.6 3.86L22 5.72zM7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM12.5 8H11v6l4.75 2.85.75-1.23-4-2.37V8zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
  </svg>
);

const IconWifi = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
  </svg>
);

const IconFormatBold = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
  </svg>
);

const IconFormatItalic = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
  </svg>
);

const IconFormatUnderlined = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" />
  </svg>
);

// ---------------------------------------------------------------------------
// Helper: GroupButton — minimal toggle button that reads ButtonGroupContext
// ---------------------------------------------------------------------------

/**
 * Minimal styled button that integrates with ButtonGroupContext.
 * Reads `selectedValues` and calls `onSelectionChange` from the parent group.
 * Use this inside `<ButtonGroup>` stories to demonstrate selection behavior.
 */
const GroupButton = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}): React.ReactElement => {
  const { selectedValues, onSelectionChange } = useButtonGroup();
  const isSelected = selectedValues.has(value);

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelectionChange(value)}
      className={[
        "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium",
        "focus-visible:ring-primary transition-colors outline-none focus-visible:ring-2",
        isSelected
          ? "bg-secondary-container text-on-secondary-container"
          : "bg-surface-container text-on-surface",
      ].join(" ")}
    >
      {children}
    </button>
  );
};

/**
 * Minimal icon-only toggle button that integrates with ButtonGroupContext.
 * Use for icon-group stories inside `<ButtonGroup>`.
 */
const GroupIconButton = ({
  value,
  "aria-label": ariaLabel,
  children,
}: {
  value: string;
  "aria-label": string;
  children: React.ReactNode;
}): React.ReactElement => {
  const { selectedValues, onSelectionChange } = useButtonGroup();
  const isSelected = selectedValues.has(value);

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={isSelected}
      onClick={() => onSelectionChange(value)}
      className={[
        "inline-flex h-10 w-10 items-center justify-center rounded-full",
        "focus-visible:ring-primary transition-colors outline-none focus-visible:ring-2",
        isSelected
          ? "bg-secondary-container text-on-secondary-container"
          : "bg-surface-container text-on-surface-variant",
      ].join(" ")}
    >
      {children}
    </button>
  );
};

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof ButtonGroup> = {
  title: "Components/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Material Design 3 ButtonGroup — an invisible container that controls the gap between child buttons and optionally manages toggle-selection state. Supports two layout variants (`standard` and `connected`), five sizes, two corner shapes, and three selection modes (`single`, `required`, `multi`).",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["standard", "connected"],
      description:
        "Layout variant. `standard` uses `inline-flex`; `connected` uses `flex w-full` with 2dp gap.",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description:
        "Size tier shared across all child buttons. Controls the inner gap per MD3 spec.",
    },
    shape: {
      control: "select",
      options: ["round", "square"],
      description:
        "Corner shape passed to children via context. `round` gives pill outer corners; `square` gives uniform radius.",
    },
    selectionMode: {
      control: "select",
      options: [undefined, "single", "required", "multi"],
      description:
        "Selection mode. Omit for action-only groups. `single` allows deselect; `required` always keeps one; `multi` allows any count.",
    },
    selectedValues: {
      control: false,
      description: "Controlled set of selected values. Pair with `onSelectionChange`.",
    },
    onSelectionChange: {
      control: false,
      description: "Callback fired with the new full `Set<string>` after each selection change.",
    },
    defaultValue: {
      control: false,
      description: "Default selected value(s) for uncontrolled usage.",
    },
    children: {
      control: false,
      description: "Child buttons (Button, IconButton, or any element with a `value` prop).",
    },
    className: {
      control: "text",
      description: "Additional Tailwind CSS classes applied to the container.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

// ---------------------------------------------------------------------------
// 1. Default — baseline story with controls wired to args
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    variant: "standard",
    size: "md",
    shape: "round",
    "aria-label": "Quick actions",
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <button
        type="button"
        className="bg-surface-container text-on-surface rounded-full px-4 py-2 text-sm font-medium"
      >
        One
      </button>
      <button
        type="button"
        className="bg-surface-container text-on-surface rounded-full px-4 py-2 text-sm font-medium"
      >
        Two
      </button>
      <button
        type="button"
        className="bg-surface-container text-on-surface rounded-full px-4 py-2 text-sm font-medium"
      >
        Three
      </button>
    </ButtonGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The default ButtonGroup uses the `standard` variant with `md` size and `round` shape. No selection mode is set — these are action-only buttons. Use the controls panel to explore prop combinations.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 2. Variants — standard vs connected side-by-side
// ---------------------------------------------------------------------------

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-on-surface-variant text-sm font-medium">Standard</p>
        <ButtonGroup variant="standard" aria-label="Standard variant example">
          <button
            type="button"
            className="bg-surface-container text-on-surface rounded-full px-4 py-2 text-sm font-medium"
          >
            Cut
          </button>
          <button
            type="button"
            className="bg-surface-container text-on-surface rounded-full px-4 py-2 text-sm font-medium"
          >
            Copy
          </button>
          <button
            type="button"
            className="bg-surface-container text-on-surface rounded-full px-4 py-2 text-sm font-medium"
          >
            Paste
          </button>
        </ButtonGroup>
      </div>
      <div className="flex w-64 flex-col gap-2">
        <p className="text-on-surface-variant text-sm font-medium">Connected</p>
        <ButtonGroup variant="connected" aria-label="Connected variant example">
          <button
            type="button"
            className="bg-surface-container text-on-surface flex-1 rounded-full px-4 py-2 text-sm font-medium"
          >
            Small
          </button>
          <button
            type="button"
            className="bg-surface-container text-on-surface flex-1 rounded-full px-4 py-2 text-sm font-medium"
          >
            Medium
          </button>
          <button
            type="button"
            className="bg-surface-container text-on-surface flex-1 rounded-full px-4 py-2 text-sm font-medium"
          >
            Large
          </button>
        </ButtonGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`standard` buttons float independently with larger gaps (8–18dp per MD3 spec). `connected` buttons are joined with a 2dp gap and stretch to fill the container width.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 3. Sizes — all 5 size tiers showing gap differences
// ---------------------------------------------------------------------------

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-1">
          <p className="text-on-surface-variant text-xs font-medium tracking-wide uppercase">
            {size}
          </p>
          <ButtonGroup variant="standard" size={size} aria-label={`Size ${size} example`}>
            <button
              type="button"
              className="bg-surface-container text-on-surface rounded-full px-4 py-2 text-sm font-medium"
            >
              Alpha
            </button>
            <button
              type="button"
              className="bg-surface-container text-on-surface rounded-full px-4 py-2 text-sm font-medium"
            >
              Beta
            </button>
            <button
              type="button"
              className="bg-surface-container text-on-surface rounded-full px-4 py-2 text-sm font-medium"
            >
              Gamma
            </button>
          </ButtonGroup>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "MD3 specifies different inner gaps per size tier for `standard` groups: `xs` = 18dp, `sm` = 12dp, `md`/`lg`/`xl` = 8dp. `connected` groups always use 2dp regardless of size.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 4. Shapes — round vs square passed through context
// ---------------------------------------------------------------------------

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-on-surface-variant text-sm font-medium">Round (default)</p>
        <ButtonGroup
          variant="standard"
          shape="round"
          selectionMode="single"
          aria-label="Round shape example"
        >
          <GroupButton value="a">Option A</GroupButton>
          <GroupButton value="b">Option B</GroupButton>
          <GroupButton value="c">Option C</GroupButton>
        </ButtonGroup>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-on-surface-variant text-sm font-medium">Square</p>
        <ButtonGroup
          variant="standard"
          shape="square"
          selectionMode="single"
          aria-label="Square shape example"
        >
          <GroupButton value="a">Option A</GroupButton>
          <GroupButton value="b">Option B</GroupButton>
          <GroupButton value="c">Option C</GroupButton>
        </ButtonGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The `shape` prop is passed to children via `ButtonGroupContext`. Child buttons read it with `useButtonGroup()` and apply their own corner-radius logic. `round` = pill outer corners, smaller inner corners (connected); `square` = uniform radius.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 5. SelectionSingle — at most one selected, deselectable
// ---------------------------------------------------------------------------

const SingleSelectionExample = (): React.ReactElement => {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  return (
    <div className="flex flex-col items-center gap-4">
      <ButtonGroup
        variant="standard"
        selectionMode="single"
        selectedValues={selected}
        onSelectionChange={setSelected}
        aria-label="Single selection group"
      >
        <GroupButton value="day">Day</GroupButton>
        <GroupButton value="week">Week</GroupButton>
        <GroupButton value="month">Month</GroupButton>
      </ButtonGroup>
      <p className="text-on-surface-variant text-sm">
        Selected:{" "}
        <span className="text-on-surface font-medium">
          {selected.size > 0 ? [...selected].join(", ") : "none"}
        </span>
      </p>
    </div>
  );
};

export const SelectionSingle: Story = {
  render: () => <SingleSelectionExample />,
  parameters: {
    docs: {
      description: {
        story:
          '`selectionMode="single"` — at most one button selected at a time. Clicking the already-selected button deselects it (clears the set). The selection display below the group shows the current state.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 6. SelectionRequired — always exactly one selected
// ---------------------------------------------------------------------------

const RequiredSelectionExample = (): React.ReactElement => {
  const [selected, setSelected] = React.useState<Set<string>>(new Set(["8oz"]));

  return (
    <div className="flex flex-col items-center gap-4">
      <ButtonGroup
        variant="connected"
        selectionMode="required"
        selectedValues={selected}
        onSelectionChange={setSelected}
        aria-label="Drink size picker"
        className="w-64"
      >
        <GroupButton value="8oz">8 oz</GroupButton>
        <GroupButton value="12oz">12 oz</GroupButton>
        <GroupButton value="16oz">16 oz</GroupButton>
        <GroupButton value="20oz">20 oz</GroupButton>
      </ButtonGroup>
      <p className="text-on-surface-variant text-sm">
        Size: <span className="text-on-surface font-medium">{[...selected][0]}</span>
      </p>
    </div>
  );
};

export const SelectionRequired: Story = {
  render: () => <RequiredSelectionExample />,
  parameters: {
    docs: {
      description: {
        story:
          '`selectionMode="required"` — exactly one button must always be selected. Clicking the already-selected button is a no-op. Ideal for size pickers or view toggles where a choice is mandatory.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 7. SelectionMulti — any number selected simultaneously
// ---------------------------------------------------------------------------

const MultiSelectionExample = (): React.ReactElement => {
  const [selected, setSelected] = React.useState<Set<string>>(new Set(["bold"]));

  return (
    <div className="flex flex-col items-center gap-4">
      <ButtonGroup
        variant="connected"
        selectionMode="multi"
        selectedValues={selected}
        onSelectionChange={setSelected}
        aria-label="Text formatting"
        className="w-56"
      >
        <GroupButton value="bold">Bold</GroupButton>
        <GroupButton value="italic">Italic</GroupButton>
        <GroupButton value="underline">Underline</GroupButton>
      </ButtonGroup>
      <p className="text-on-surface-variant text-sm">
        Active:{" "}
        <span className="text-on-surface font-medium">
          {selected.size > 0 ? [...selected].join(", ") : "none"}
        </span>
      </p>
    </div>
  );
};

export const SelectionMulti: Story = {
  render: () => <MultiSelectionExample />,
  parameters: {
    docs: {
      description: {
        story:
          '`selectionMode="multi"` — any number of buttons may be selected simultaneously. Clicking a selected button toggles it off. Ideal for text-formatting toolbars or filter chips.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 8. ConnectedSizePicker — real-world connected group example
// ---------------------------------------------------------------------------

const ConnectedSizePickerExample = (): React.ReactElement => {
  const [size, setSize] = React.useState<Set<string>>(new Set(["M"]));

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-72 flex-col gap-1">
        <p className="text-on-surface text-sm font-medium">T-Shirt Size</p>
        <ButtonGroup
          variant="connected"
          selectionMode="required"
          selectedValues={size}
          onSelectionChange={setSize}
          aria-label="T-shirt size picker"
        >
          {(["XS", "S", "M", "L", "XL"] as const).map((s) => (
            <GroupButton key={s} value={s}>
              {s}
            </GroupButton>
          ))}
        </ButtonGroup>
      </div>
      <p className="text-on-surface-variant text-sm">
        Selected size: <span className="text-on-surface font-medium">{[...size][0]}</span>
      </p>
    </div>
  );
};

export const ConnectedSizePicker: Story = {
  render: () => <ConnectedSizePickerExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A real-world `connected` group with `required` selection — a t-shirt size picker. The `connected` variant stretches buttons to fill the container; `required` ensures a size is always selected.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 9. IconGroup — standard variant with icon-only buttons
// ---------------------------------------------------------------------------

const IconGroupExample = (): React.ReactElement => {
  const [active, setActive] = React.useState<Set<string>>(new Set());

  return (
    <div className="flex flex-col items-center gap-4">
      <ButtonGroup
        variant="standard"
        selectionMode="multi"
        selectedValues={active}
        onSelectionChange={setActive}
        aria-label="Quick settings"
      >
        <GroupIconButton value="bluetooth" aria-label="Toggle Bluetooth">
          <IconBluetooth />
        </GroupIconButton>
        <GroupIconButton value="wifi" aria-label="Toggle Wi-Fi">
          <IconWifi />
        </GroupIconButton>
        <GroupIconButton value="alarm" aria-label="Toggle Alarm">
          <IconAlarm />
        </GroupIconButton>
      </ButtonGroup>
      <p className="text-on-surface-variant text-sm">
        Active:{" "}
        <span className="text-on-surface font-medium">
          {active.size > 0 ? [...active].join(", ") : "none"}
        </span>
      </p>
    </div>
  );
};

export const IconGroup: Story = {
  render: () => <IconGroupExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A `standard` variant ButtonGroup with icon-only toggle buttons. Uses `multi` selection so several quick settings can be active simultaneously. Each icon button has an `aria-label` for accessibility.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 10. Controlled — externally managed selectedValues
// ---------------------------------------------------------------------------

const ControlledExample = (): React.ReactElement => {
  const [selected, setSelected] = React.useState<Set<string>>(new Set(["italic"]));

  const handleSelectionChange = (values: Set<string>): void => {
    setSelected(values);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <ButtonGroup
        variant="connected"
        selectionMode="multi"
        selectedValues={selected}
        onSelectionChange={handleSelectionChange}
        aria-label="Text formatting (controlled)"
        className="w-64"
      >
        <GroupButton value="bold">Bold</GroupButton>
        <GroupButton value="italic">Italic</GroupButton>
        <GroupButton value="underline">Underline</GroupButton>
      </ButtonGroup>

      <div className="flex gap-2">
        <button
          type="button"
          className="bg-primary text-on-primary rounded-full px-3 py-1 text-xs font-medium"
          onClick={() => setSelected(new Set(["bold", "italic"]))}
        >
          Set Bold + Italic
        </button>
        <button
          type="button"
          className="bg-surface-container text-on-surface rounded-full px-3 py-1 text-xs font-medium"
          onClick={() => setSelected(new Set())}
        >
          Clear All
        </button>
      </div>

      <p className="text-on-surface-variant text-sm">
        State:{" "}
        <code className="bg-surface-container text-on-surface rounded px-1 py-0.5 text-xs">
          {`new Set([${[...selected].map((v) => `"${v}"`).join(", ")}])`}
        </code>
      </p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Fully controlled usage: pass `selectedValues` + `onSelectionChange` from the parent. External buttons demonstrate that the group state can be driven from outside. The `Set<string>` representation is displayed live.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 11. Uncontrolled — defaultValue seeds initial selection
// ---------------------------------------------------------------------------

export const Uncontrolled: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <ButtonGroup
        variant="connected"
        selectionMode="required"
        defaultValue="week"
        aria-label="Time range (uncontrolled)"
        className="w-64"
      >
        <GroupButton value="day">Day</GroupButton>
        <GroupButton value="week">Week</GroupButton>
        <GroupButton value="month">Month</GroupButton>
      </ButtonGroup>
      <p className="text-on-surface-variant text-sm">
        Initial selection is seeded by <code>defaultValue="week"</code> — no external state needed.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Uncontrolled usage: `defaultValue` seeds the initial selection and the group manages its own state internally. Use this when you don't need to observe or control selection from outside the group.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 12. Accessibility — role="group", aria-label, keyboard nav
// ---------------------------------------------------------------------------

export const Accessibility: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-on-surface-variant text-sm font-medium">
          Action group — <code>role="group"</code> with <code>aria-label</code>
        </p>
        <ButtonGroup variant="standard" aria-label="Text formatting actions">
          <button
            type="button"
            className="bg-surface-container text-on-surface focus-visible:ring-primary rounded-full px-4 py-2 text-sm font-medium outline-none focus-visible:ring-2"
            aria-label="Bold"
          >
            <IconFormatBold />
          </button>
          <button
            type="button"
            className="bg-surface-container text-on-surface focus-visible:ring-primary rounded-full px-4 py-2 text-sm font-medium outline-none focus-visible:ring-2"
            aria-label="Italic"
          >
            <IconFormatItalic />
          </button>
          <button
            type="button"
            className="bg-surface-container text-on-surface focus-visible:ring-primary rounded-full px-4 py-2 text-sm font-medium outline-none focus-visible:ring-2"
            aria-label="Underline"
          >
            <IconFormatUnderlined />
          </button>
        </ButtonGroup>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-on-surface-variant text-sm font-medium">
          Toggle group — <code>aria-pressed</code> on each child
        </p>
        <ButtonGroup
          variant="connected"
          selectionMode="single"
          defaultValue="list"
          aria-label="View mode"
          className="w-48"
        >
          <GroupButton value="grid">Grid</GroupButton>
          <GroupButton value="list">List</GroupButton>
        </ButtonGroup>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'ButtonGroup renders a `<div role="group">` with a stable `id`. Always provide an `aria-label` on the group for screen readers. Toggle buttons should expose `aria-pressed`; the `GroupButton` helper here sets this automatically via `useButtonGroup()`. The container itself is not focusable — Tab moves focus directly to child buttons.',
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 13. Interactive — play function verifies selection behavior
// ---------------------------------------------------------------------------

export const Interactive: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <ButtonGroup
        variant="connected"
        selectionMode="single"
        aria-label="Interactive test group"
        className="w-64"
      >
        <GroupButton value="one">One</GroupButton>
        <GroupButton value="two">Two</GroupButton>
        <GroupButton value="three">Three</GroupButton>
      </ButtonGroup>
      <p className="text-on-surface-variant text-xs">
        Run the interaction test to verify selection behavior.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // All buttons start deselected
    const btnOne = canvas.getByRole("button", { name: "One" });
    const btnTwo = canvas.getByRole("button", { name: "Two" });
    const btnThree = canvas.getByRole("button", { name: "Three" });

    await expect(btnOne).toHaveAttribute("aria-pressed", "false");
    await expect(btnTwo).toHaveAttribute("aria-pressed", "false");
    await expect(btnThree).toHaveAttribute("aria-pressed", "false");

    // Click "One" — it becomes selected
    await userEvent.click(btnOne);
    await expect(btnOne).toHaveAttribute("aria-pressed", "true");
    await expect(btnTwo).toHaveAttribute("aria-pressed", "false");
    await expect(btnThree).toHaveAttribute("aria-pressed", "false");

    // Click "Two" — selection moves to "Two"
    await userEvent.click(btnTwo);
    await expect(btnOne).toHaveAttribute("aria-pressed", "false");
    await expect(btnTwo).toHaveAttribute("aria-pressed", "true");
    await expect(btnThree).toHaveAttribute("aria-pressed", "false");

    // Click "Two" again — deselects (single mode)
    await userEvent.click(btnTwo);
    await expect(btnTwo).toHaveAttribute("aria-pressed", "false");

    // Click "Three" — becomes selected
    await userEvent.click(btnThree);
    await expect(btnThree).toHaveAttribute("aria-pressed", "true");
  },
  parameters: {
    docs: {
      description: {
        story:
          "Storybook interaction test: verifies that `single` selection mode toggles `aria-pressed` correctly — selecting a button, moving selection to another, deselecting by re-clicking, and confirming only one button is selected at a time.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// 14. Playground — all controls exposed for manual exploration
// ---------------------------------------------------------------------------

export const Playground: Story = {
  args: {
    variant: "standard",
    size: "md",
    shape: "round",
    selectionMode: "single",
    "aria-label": "Playground group",
  },
  render: (args) => (
    <div className="w-64">
      <ButtonGroup {...args}>
        <GroupButton value="alpha">Alpha</GroupButton>
        <GroupButton value="beta">Beta</GroupButton>
        <GroupButton value="gamma">Gamma</GroupButton>
      </ButtonGroup>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use the controls panel to explore all `ButtonGroup` prop combinations interactively. Switch between `standard`/`connected` variants, all 5 sizes, 2 shapes, and all 3 selection modes.",
      },
    },
  },
};
