import type React from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SplitButton } from "./SplitButton";
import type { SplitButtonMenuItem } from "./SplitButton.types";

// ─── Shared fixture data ────────────────────────────────────────────────────

const noop = (): void => undefined;

const saveItems: SplitButtonMenuItem[] = [
  { label: "Save as draft", onAction: noop },
  { label: "Save and close", onAction: noop },
  { label: "Save and publish", onAction: noop },
];

const exportItems: SplitButtonMenuItem[] = [
  { label: "Export as PDF", onAction: noop },
  { label: "Export as PNG", onAction: noop },
  { label: "Export as SVG", onAction: noop },
  { label: "Export as CSV", onAction: noop },
  { label: "Export as XLSX", onAction: noop },
];

// ─── Meta ───────────────────────────────────────────────────────────────────

const meta: Meta<typeof SplitButton> = {
  title: "Components/SplitButton",
  component: SplitButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "MD3 Split Button — a compound control combining a primary action with a dropdown menu. https://m3.material.io/components/buttons/specs#split-button",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "tonal", "outlined"],
      description: "Visual variant of the split button",
    },
    isDisabled: {
      control: "boolean",
      description: "Disable both the primary action and dropdown segments",
    },
    primaryLabel: {
      control: "text",
      description: "Label displayed in the primary action segment",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SplitButton>;

// ─── Stories ────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: "filled",
    primaryLabel: "Save",
    onPrimaryAction: noop,
    items: saveItems,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The default filled Split Button with a 'Save' primary action and three dropdown options. Click the primary label to trigger the action; click the chevron to expand the menu.",
      },
    },
  },
};

export const FilledVariant: Story = {
  args: {
    variant: "filled",
    primaryLabel: "Save",
    onPrimaryAction: noop,
    items: saveItems,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Filled variant — uses `bg-primary` / `text-on-primary` tokens. Highest visual emphasis, suitable for the most important action on a surface.",
      },
    },
  },
};

export const TonalVariant: Story = {
  args: {
    variant: "tonal",
    primaryLabel: "Save",
    onPrimaryAction: noop,
    items: saveItems,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Tonal variant — uses `bg-secondary-container` / `text-on-secondary-container` tokens. Medium emphasis; good for supporting actions alongside a filled button.",
      },
    },
  },
};

export const OutlinedVariant: Story = {
  args: {
    variant: "outlined",
    primaryLabel: "Save",
    onPrimaryAction: noop,
    items: saveItems,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Outlined variant — transparent background with `border-outline` stroke. Low emphasis; ideal when a split button must sit alongside other filled controls.",
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-label-medium text-on-surface-variant">Filled</span>
        <SplitButton
          variant="filled"
          primaryLabel="Save"
          onPrimaryAction={noop}
          items={saveItems}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-label-medium text-on-surface-variant">Tonal</span>
        <SplitButton variant="tonal" primaryLabel="Save" onPrimaryAction={noop} items={saveItems} />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-label-medium text-on-surface-variant">Outlined</span>
        <SplitButton
          variant="outlined"
          primaryLabel="Save"
          onPrimaryAction={noop}
          items={saveItems}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Side-by-side showcase of all three MD3-compliant variants: filled, tonal, and outlined. Each carries the same 'Save' primary action for direct comparison.",
      },
    },
  },
};

export const WithManyItems: Story = {
  args: {
    variant: "filled",
    primaryLabel: "Export",
    onPrimaryAction: noop,
    items: exportItems,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dropdown with five items, demonstrating how the menu scrolls and positions itself when there are many secondary actions to choose from.",
      },
    },
  },
};

// ─── Interactive stories that need local state ───────────────────────────────

const PrimaryActionFiresExample = (): React.ReactElement => {
  const [count, setCount] = useState(0);
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-body-large text-on-surface">
        Primary action fired: <strong>{count}</strong> time{count !== 1 ? "s" : ""}
      </p>
      <SplitButton
        variant="filled"
        primaryLabel="Save"
        onPrimaryAction={() => setCount((c) => c + 1)}
        items={saveItems}
      />
      <p className="text-body-small text-on-surface-variant">
        Click the "Save" label — not the chevron — to increment the counter.
      </p>
    </div>
  );
};

export const PrimaryActionFires: Story = {
  render: () => <PrimaryActionFiresExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates that the primary segment fires independently from the dropdown. The counter increments only when the label segment is pressed, never when the chevron is toggled.",
      },
    },
  },
};

const DropdownOnlyExample = (): React.ReactElement => {
  const [primaryFired, setPrimaryFired] = useState(false);
  const [lastMenuAction, setLastMenuAction] = useState<string | null>(null);

  const menuItems: SplitButtonMenuItem[] = [
    { label: "Save as draft", onAction: () => setLastMenuAction("Save as draft") },
    { label: "Save and close", onAction: () => setLastMenuAction("Save and close") },
    { label: "Save and publish", onAction: () => setLastMenuAction("Save and publish") },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-body-medium text-on-surface flex gap-6">
        <span>
          Primary fired:{" "}
          <strong className={primaryFired ? "text-error" : "text-on-surface"}>
            {primaryFired ? "YES" : "no"}
          </strong>
        </span>
        <span>
          Last menu action: <strong>{lastMenuAction ?? "—"}</strong>
        </span>
      </div>
      <SplitButton
        variant="tonal"
        primaryLabel="Save"
        onPrimaryAction={() => setPrimaryFired(true)}
        items={menuItems}
      />
      <p className="text-body-small text-on-surface-variant">
        Open the dropdown and select a menu item — the primary action should not fire.
      </p>
    </div>
  );
};

export const DropdownOnly: Story = {
  render: () => <DropdownOnlyExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Verifies that opening the dropdown and selecting a menu item does NOT fire the primary action handler. The 'Primary fired' indicator should remain 'no' throughout dropdown interactions.",
      },
    },
  },
};

export const DisabledState: Story = {
  args: {
    variant: "filled",
    primaryLabel: "Save",
    onPrimaryAction: noop,
    items: saveItems,
    isDisabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Both segments are disabled via `isDisabled={true}`. The component applies `opacity-38` and `pointer-events-none`, preventing interaction with either the primary action or the dropdown chevron.",
      },
    },
  },
};

export const Playground: Story = {
  args: {
    variant: "filled",
    primaryLabel: "Save",
    onPrimaryAction: noop,
    items: saveItems,
    isDisabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground — use the Controls panel to experiment with every exposed prop: variant, primaryLabel, and isDisabled.",
      },
    },
  },
};
