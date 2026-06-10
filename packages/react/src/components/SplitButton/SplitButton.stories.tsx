import type React from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SplitButton } from "./SplitButton";
import type { SplitButtonMenuItem } from "./SplitButton.types";

// ─── Shared fixture data ─────────────────────────────────────────────────────

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

// ─── Meta ────────────────────────────────────────────────────────────────────

const meta: Meta<typeof SplitButton> = {
  title: "Components/SplitButton",
  component: SplitButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "MD3 Expressive Split Button — combines a leading action button with a trailing dropdown trigger. Implements the Variants-vs-States architecture with per-segment React Aria interaction tracking, MD3 spring motion, and inner-corner shape morphing. https://m3.material.io/components/split-button/specs",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["elevated", "filled", "tonal", "outlined"],
      description:
        "Visual variant — controls container color and elevation. Mirrors the standard Button color schemes.",
    },
    size: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl"],
      description:
        "Size per the MD3 Expressive scale: xs (32dp), sm (40dp), md (56dp), lg (96dp), xl (136dp).",
    },
    isDisabled: {
      control: "boolean",
      description: "Disables both the leading action and trailing dropdown segments.",
    },
    primaryLabel: {
      control: "text",
      description: "Label displayed in the leading action segment.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SplitButton>;

// ─── Default ─────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: "filled",
    size: "sm",
    primaryLabel: "Save",
    onPrimaryAction: noop,
    items: saveItems,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The default filled split button (size sm). Click the 'Save' label to trigger the primary action; click the chevron to expand the dropdown menu.",
      },
    },
  },
};

// ─── Variants ────────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6">
      {(["elevated", "filled", "tonal", "outlined"] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-1">
          <span className="text-label-medium text-on-surface-variant capitalize">{variant}</span>
          <SplitButton
            variant={variant}
            size="sm"
            primaryLabel="Save"
            onPrimaryAction={noop}
            items={saveItems}
          />
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All four MD3 Expressive variants at size sm: elevated (surface-container-low + level-1 shadow), filled (primary), tonal (secondary-container), outlined (transparent + outline border). Each carries the same 'Save' primary action for direct comparison.",
      },
    },
  },
};

// ─── Sizes ───────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-8">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-1">
          <span className="text-label-medium text-on-surface-variant uppercase">{size}</span>
          <SplitButton
            variant="filled"
            size={size}
            primaryLabel="Save"
            onPrimaryAction={noop}
            items={saveItems}
          />
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All five MD3 Expressive sizes: xs (32dp), sm (40dp), md (56dp), lg (96dp), xl (136dp). Inner-corner radius steps up with size: xs/sm/md use 4dp, lg 8dp, xl 12dp.",
      },
    },
  },
};

// ─── States ──────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-label-medium text-on-surface-variant">Enabled</span>
        <SplitButton
          variant="filled"
          size="sm"
          primaryLabel="Save"
          onPrimaryAction={noop}
          items={saveItems}
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-label-medium text-on-surface-variant">Disabled</span>
        <SplitButton
          variant="filled"
          size="sm"
          primaryLabel="Save"
          onPrimaryAction={noop}
          items={saveItems}
          isDisabled
        />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-label-medium text-on-surface-variant">
          Outlined — Enabled / Disabled
        </span>
        <div className="flex gap-4">
          <SplitButton
            variant="outlined"
            size="sm"
            primaryLabel="Save"
            onPrimaryAction={noop}
            items={saveItems}
          />
          <SplitButton
            variant="outlined"
            size="sm"
            primaryLabel="Save"
            onPrimaryAction={noop}
            items={saveItems}
            isDisabled
          />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-label-medium text-on-surface-variant">
          Elevated — Enabled / Disabled
        </span>
        <div className="flex gap-4">
          <SplitButton
            variant="elevated"
            size="sm"
            primaryLabel="Save"
            onPrimaryAction={noop}
            items={saveItems}
          />
          <SplitButton
            variant="elevated"
            size="sm"
            primaryLabel="Save"
            onPrimaryAction={noop}
            items={saveItems}
            isDisabled
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Hover over each segment to see the 8% state layer; focus via keyboard to see the 10% state layer + focus ring; hold press for 10% pressed overlay. Disabled state applies on-surface/12 container and on-surface/38 content per MD3.",
      },
    },
  },
};

// ─── With many items ──────────────────────────────────────────────────────────

export const WithManyItems: Story = {
  args: {
    variant: "filled",
    size: "sm",
    primaryLabel: "Export",
    onPrimaryAction: noop,
    items: exportItems,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dropdown with five items, demonstrating menu positioning when there are many secondary actions.",
      },
    },
  },
};

// ─── Interactive — primary action fires independently ────────────────────────

const PrimaryActionFiresExample = (): React.ReactElement => {
  const [count, setCount] = useState(0);
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-body-large text-on-surface">
        Primary action fired: <strong>{count}</strong> time{count !== 1 ? "s" : ""}
      </p>
      <SplitButton
        variant="filled"
        size="sm"
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
          "Verifies the leading and trailing segments fire independently. The counter only increments when the label segment is pressed.",
      },
    },
  },
};

// ─── Interactive — dropdown only ─────────────────────────────────────────────

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
        size="sm"
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
          "Verifies selecting a menu item does NOT fire the primary action. 'Primary fired' should remain 'no' throughout dropdown interactions.",
      },
    },
  },
};

// ─── Disabled ────────────────────────────────────────────────────────────────

export const DisabledState: Story = {
  args: {
    variant: "filled",
    size: "sm",
    primaryLabel: "Save",
    onPrimaryAction: noop,
    items: saveItems,
    isDisabled: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Both segments are disabled via `isDisabled`. The component applies on-surface/12 container and on-surface/38 content opacity, preventing interaction with either segment.",
      },
    },
  },
};

// ─── Accessibility ────────────────────────────────────────────────────────────

export const Accessibility: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-body-medium text-on-surface max-w-sm">
        Tab to focus the leading segment, then Tab again to reach the trailing trigger. Press Enter
        or Space to open the menu; use Arrow keys to navigate items; Escape to close and return
        focus to the trigger.
      </p>
      <SplitButton
        variant="filled"
        size="sm"
        primaryLabel="Save document"
        aria-label="Save document split button"
        onPrimaryAction={noop}
        items={saveItems}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Keyboard navigation walkthrough: Tab focuses leading → Tab focuses trailing → Enter/Space opens menu → ArrowDown/Up navigates items → Escape closes and returns focus. Both segments have visible focus rings per WCAG 2.1 AA.",
      },
    },
  },
};

// ─── Selected state (trailing = full circle) ─────────────────────────────────

const SelectedStateExample = (): React.ReactElement => {
  return (
    <div className="flex flex-col items-start gap-8">
      <p className="text-body-medium text-on-surface-variant max-w-sm">
        When the dropdown is open the trailing segment morphs into a full circle. Click the chevron
        to toggle the selected state.
      </p>
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="flex flex-col gap-1">
          <span className="text-label-medium text-on-surface-variant uppercase">{size}</span>
          <SplitButton
            variant="filled"
            size={size}
            primaryLabel="Save"
            onPrimaryAction={noop}
            items={saveItems}
          />
        </div>
      ))}
    </div>
  );
};

export const SelectedState: Story = {
  render: () => <SelectedStateExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Click the chevron on each size to open the menu and observe the trailing segment animate into a full circle with the chevron centered. The inner-corner radius morphs through the specificity ladder: rest → hover/focus (moderate) → pressed (stronger) → selected (full circle).",
      },
    },
  },
};

// ─── Playground ──────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: "filled",
    size: "sm",
    primaryLabel: "Save",
    onPrimaryAction: noop,
    items: saveItems,
    isDisabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground — use the Controls panel to experiment with variant, size, primaryLabel, and isDisabled.",
      },
    },
  },
};
