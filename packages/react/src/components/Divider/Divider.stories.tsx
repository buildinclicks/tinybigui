import type React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Divider } from "./Divider";

const meta: Meta<typeof Divider> = {
  title: "Components/Divider",
  component: Divider,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Material Design 3 Divider — a thin line that groups content in lists and containers. " +
          "Supports horizontal and vertical orientations, four inset variants (none, start, end, both), " +
          "and an optional subheader label that renders centered text between two rule lines. " +
          'Built on React Aria `useSeparator` for WCAG-compliant `role="separator"` semantics. ' +
          "[MD3 spec](https://m3.material.io/components/divider/overview)",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "Axis of the visual rule. Use `vertical` inside flex rows.",
      table: { defaultValue: { summary: "horizontal" } },
    },
    inset: {
      control: "select",
      options: ["none", "start", "end", "both"],
      description: "Shifts the start and/or end of the rule by 16dp to align with list content.",
      table: { defaultValue: { summary: "none" } },
    },
    label: {
      control: "text",
      description:
        "Subheader label text. When provided, renders centered text between two rule lines.",
    },
    className: {
      control: "text",
      description: "Additional Tailwind CSS classes.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

// ---------------------------------------------------------------------------
// Default
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    orientation: "horizontal",
    inset: "none",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Full-bleed horizontal divider with no inset or label. Use the controls panel " +
          "to explore all prop combinations.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Orientation
// ---------------------------------------------------------------------------

export const Horizontal: Story = {
  render: () => (
    <div className="bg-surface w-80 rounded-lg p-4">
      <p className="text-on-surface text-body-medium mb-3">Section A</p>
      <Divider orientation="horizontal" />
      <p className="text-on-surface text-body-medium mt-3">Section B</p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Explicit `orientation="horizontal"` separating two text blocks inside a surface container.',
      },
    },
  },
};

export const Vertical: Story = {
  render: () => (
    <div className="bg-surface flex h-16 items-center gap-4 rounded-lg px-4">
      <p className="text-on-surface text-body-medium">Left content</p>
      <Divider orientation="vertical" className="h-8" />
      <p className="text-on-surface text-body-medium">Right content</p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Vertical divider inside a `flex` row separating two text blocks. " +
          "Give the divider an explicit height (e.g. `h-8`) so it fills the desired span " +
          "within the flex container.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Inset variants
// ---------------------------------------------------------------------------

export const InsetStart: Story = {
  render: () => (
    <div className="bg-surface w-80 rounded-lg p-4">
      <p className="text-on-surface text-body-medium mb-3">List item above</p>
      <Divider inset="start" />
      <p className="text-on-surface text-body-medium mt-3">List item below</p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`inset="start"` adds a 16dp leading margin. Typical use: list rows where an avatar ' +
          "or icon occupies the leading edge and the divider should align with the text.",
      },
    },
  },
};

export const InsetEnd: Story = {
  render: () => (
    <div className="bg-surface w-80 rounded-lg p-4">
      <p className="text-on-surface text-body-medium mb-3">List item above</p>
      <Divider inset="end" />
      <p className="text-on-surface text-body-medium mt-3">List item below</p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`inset="end"` adds a 16dp trailing margin, visually associating the rule with content ' +
          "that stops before the trailing edge.",
      },
    },
  },
};

export const InsetBoth: Story = {
  render: () => (
    <div className="bg-surface w-80 rounded-lg p-4">
      <p className="text-on-surface text-body-medium mb-3">List item above</p>
      <Divider inset="both" />
      <p className="text-on-surface text-body-medium mt-3">List item below</p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          '`inset="both"` adds 16dp margins on both ends, centering the rule between the ' +
          "container edges.",
      },
    },
  },
};

export const AllInsetVariants: Story = {
  render: () => (
    <div className="bg-surface w-80 rounded-lg p-4">
      {(["none", "start", "end", "both"] as const).map((inset, idx) => (
        <div key={inset}>
          {idx > 0 && <div className="mt-4" />}
          <p className="text-on-surface-variant text-label-small mb-1 tracking-wider uppercase">
            inset=&quot;{inset}&quot;
          </p>
          <Divider inset={inset} />
          <p className="text-on-surface text-body-small mt-1">Content below</p>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All four inset variants stacked vertically with labels, so you can compare the " +
          "visual offset side-by-side.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Subheader (labeled) variant
// ---------------------------------------------------------------------------

export const WithSubheaderLabel: Story = {
  render: () => (
    <div className="bg-surface w-80 rounded-lg p-4">
      <Divider label="Section Title" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "When `label` is provided the component renders a subheader divider: the text is " +
          "centered between two horizontal rule lines, styled with `text-on-surface-variant` " +
          'and `text-label-large`. The wrapper uses `role="group"` with `aria-label` for ' +
          "accessible semantics.",
      },
    },
  },
};

export const SubheaderVariants: Story = {
  render: () => (
    <div className="bg-surface w-80 rounded-lg p-6">
      <p className="text-on-surface text-body-medium mb-4">Starred messages</p>
      <Divider label="Today" />
      <p className="text-on-surface text-body-medium my-4">Recent messages</p>
      <Divider label="Yesterday" />
      <p className="text-on-surface text-body-medium my-4">Older messages</p>
      <Divider label="Last week" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Three subheader dividers used as date-group separators in a message list, " +
          "demonstrating a real-world subheader pattern.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Composition contexts
// ---------------------------------------------------------------------------

export const InLayoutContext: Story = {
  render: () => (
    <div className="bg-surface-container-low shadow-elevation-1 w-96 rounded-xl p-6">
      <div className="mb-4">
        <p className="text-on-surface text-title-medium mb-1">Billing address</p>
        <p className="text-on-surface-variant text-body-medium">
          123 Main Street, Suite 400
          <br />
          San Francisco, CA 94105
        </p>
      </div>
      <Divider />
      <div className="mt-4">
        <p className="text-on-surface text-title-medium mb-1">Shipping address</p>
        <p className="text-on-surface-variant text-body-medium">Same as billing address</p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Horizontal divider used as a card section separator between two address blocks, " +
          "a typical use case in checkout or profile screens.",
      },
    },
  },
};

// Icon primitives for the toolbar story
const IconBold = (): React.ReactElement => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
  </svg>
);

const IconItalic = (): React.ReactElement => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
  </svg>
);

const IconUnderline = (): React.ReactElement => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z" />
  </svg>
);

const IconAlignLeft = (): React.ReactElement => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z" />
  </svg>
);

const IconLink = (): React.ReactElement => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
  </svg>
);

const ToolbarButton = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}): React.ReactElement => (
  <button
    type="button"
    aria-label={label}
    className="text-on-surface-variant hover:bg-on-surface/8 focus-visible:ring-primary flex h-8 w-8 items-center justify-center rounded focus-visible:ring-2 focus-visible:outline-none"
  >
    {children}
  </button>
);

export const VerticalInToolbar: Story = {
  render: () => (
    <div
      className="bg-surface-container border-outline-variant inline-flex items-center gap-1 rounded-lg border px-2 py-1"
      role="toolbar"
      aria-label="Text formatting"
    >
      <ToolbarButton label="Bold">
        <IconBold />
      </ToolbarButton>
      <ToolbarButton label="Italic">
        <IconItalic />
      </ToolbarButton>
      <ToolbarButton label="Underline">
        <IconUnderline />
      </ToolbarButton>
      <Divider orientation="vertical" className="mx-1 h-5" />
      <ToolbarButton label="Align left">
        <IconAlignLeft />
      </ToolbarButton>
      <Divider orientation="vertical" className="mx-1 h-5" />
      <ToolbarButton label="Insert link">
        <IconLink />
      </ToolbarButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Vertical dividers separating logical action groups inside a text-formatting toolbar. " +
          "The divider height is constrained with `h-5` so it stays proportional to the icon buttons.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Light and Dark theme
// ---------------------------------------------------------------------------

export const LightAndDarkTheme: Story = {
  render: () => (
    <div className="flex gap-8">
      <div className="light bg-surface shadow-elevation-1 w-64 rounded-xl p-6">
        <p className="text-on-surface text-label-medium mb-3 font-medium">Light theme</p>
        <Divider />
        <div className="mt-3 flex h-12 items-center gap-2">
          <p className="text-on-surface-variant text-body-small flex-1">Left</p>
          <Divider orientation="vertical" className="h-6" />
          <p className="text-on-surface-variant text-body-small flex-1">Right</p>
        </div>
        <Divider label="Section" />
      </div>
      <div className="dark bg-surface shadow-elevation-1 w-64 rounded-xl p-6">
        <p className="text-on-surface text-label-medium mb-3 font-medium">Dark theme</p>
        <Divider />
        <div className="mt-3 flex h-12 items-center gap-2">
          <p className="text-on-surface-variant text-body-small flex-1">Left</p>
          <Divider orientation="vertical" className="h-6" />
          <p className="text-on-surface-variant text-body-small flex-1">Right</p>
        </div>
        <Divider label="Section" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Side-by-side light and dark surface containers, each showing a horizontal divider, " +
          "a vertical divider inside a flex row, and a labeled subheader divider. " +
          "Demonstrates that all divider variants adapt correctly to the active theme.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export const Playground: Story = {
  args: {
    orientation: "horizontal",
    inset: "none",
    label: "",
    className: "",
  },
  render: (args: {
    orientation?: "horizontal" | "vertical";
    inset?: "none" | "start" | "end" | "both";
    label?: string;
    className?: string;
  }) => (
    <div
      className={`bg-surface rounded-lg p-6 ${args.orientation === "vertical" ? "flex h-24 items-center" : "w-80"}`}
    >
      <Divider
        orientation={args.orientation}
        inset={args.inset}
        label={args.label ?? undefined}
        className={
          args.orientation === "vertical" ? `h-12 ${args.className ?? ""}` : args.className
        }
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Fully controllable story — use the controls panel to combine all props and explore " +
          "every Divider state. The container switches between a flex row (vertical) and a " +
          "block layout (horizontal) automatically.",
      },
    },
  },
};
