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
          "Supports horizontal and vertical orientations, and four inset variants " +
          "(none, start, end, both) using RTL-aware logical inline properties. " +
          "Thickness is controlled via the `--md-divider-thickness` CSS custom property (default 1px). " +
          'Built on React Aria `useSeparator` for WCAG-compliant `role="separator"` semantics. ' +
          "[MD3 spec](https://m3.material.io/components/divider/specs)",
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
      description:
        "Shifts the start and/or end of the rule by 16dp (logical inline offset — RTL-aware).",
      table: { defaultValue: { summary: "none" } },
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
          "Full-bleed horizontal divider with no inset. Use the controls panel " +
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
      <Divider orientation="vertical" />
      <p className="text-on-surface text-body-medium">Right content</p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Vertical divider inside a `flex` row separating two text blocks. " +
          "`self-stretch` automatically fills the flex container's block axis.",
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
          '`inset="start"` adds a 16dp logical inline-start margin (RTL-aware). ' +
          "Typical use: list rows where an avatar or icon occupies the leading edge.",
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
          '`inset="end"` adds a 16dp logical inline-end margin (RTL-aware), ' +
          "visually associating the rule with content that stops before the trailing edge.",
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
          '`inset="both"` adds 16dp margins on both inline edges, centering the rule ' +
          "between the container edges.",
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
        story: "All four inset variants stacked vertically with labels for easy visual comparison.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Thickness (CSS custom property override)
// ---------------------------------------------------------------------------

export const Thickness: Story = {
  render: () => (
    <div className="bg-surface w-80 space-y-4 rounded-lg p-4">
      <div>
        <p className="text-on-surface-variant text-label-small mb-1 tracking-wider uppercase">
          1px (default)
        </p>
        <Divider />
      </div>
      <div>
        <p className="text-on-surface-variant text-label-small mb-1 tracking-wider uppercase">
          2px
        </p>
        <Divider style={{ "--md-divider-thickness": "2px" }} />
      </div>
      <div>
        <p className="text-on-surface-variant text-label-small mb-1 tracking-wider uppercase">
          4px
        </p>
        <Divider style={{ "--md-divider-thickness": "4px" }} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Thickness is driven by the `--md-divider-thickness` CSS custom property " +
          "(MD3 default: 1dp). Override it via the `style` prop — no new React prop needed. " +
          "This matches the `md-web` `MdDivider` API.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// RTL — logical insets adapt to writing direction
// ---------------------------------------------------------------------------

export const RTLInsets: Story = {
  render: () => (
    <div className="flex gap-8">
      <div className="bg-surface w-60 rounded-lg p-4" dir="ltr">
        <p className="text-on-surface-variant text-label-small mb-2 tracking-wider uppercase">
          LTR
        </p>
        <p className="text-on-surface text-body-small mb-2">
          inset=&quot;start&quot; (leading margin left)
        </p>
        <Divider inset="start" />
      </div>
      <div className="bg-surface w-60 rounded-lg p-4" dir="rtl">
        <p className="text-on-surface-variant text-label-small mb-2 tracking-wider uppercase">
          RTL
        </p>
        <p className="text-on-surface text-body-small mb-2">
          inset=&quot;start&quot; (leading margin right)
        </p>
        <Divider inset="start" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Logical `inset="start"` uses `margin-inline-start` under the hood. ' +
          "In LTR the indent appears on the left; in RTL it flips to the right automatically — " +
          "no extra code needed.",
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
        story: "Horizontal divider used as a card section separator between two address blocks.",
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
      <Divider orientation="vertical" className="mx-1" />
      <ToolbarButton label="Align left">
        <IconAlignLeft />
      </ToolbarButton>
      <Divider orientation="vertical" className="mx-1" />
      <ToolbarButton label="Insert link">
        <IconLink />
      </ToolbarButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Vertical dividers separating logical action groups inside a text-formatting toolbar.",
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
          <Divider orientation="vertical" />
          <p className="text-on-surface-variant text-body-small flex-1">Right</p>
        </div>
      </div>
      <div className="dark bg-surface shadow-elevation-1 w-64 rounded-xl p-6">
        <p className="text-on-surface text-label-medium mb-3 font-medium">Dark theme</p>
        <Divider />
        <div className="mt-3 flex h-12 items-center gap-2">
          <p className="text-on-surface-variant text-body-small flex-1">Left</p>
          <Divider orientation="vertical" />
          <p className="text-on-surface-variant text-body-small flex-1">Right</p>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Side-by-side light and dark surface containers, each showing a horizontal and a " +
          "vertical divider. Demonstrates that all variants adapt correctly to the active theme.",
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
    className: "",
  },
  render: (args: {
    orientation?: "horizontal" | "vertical";
    inset?: "none" | "start" | "end" | "both";
    className?: string;
  }) => (
    <div
      className={`bg-surface rounded-lg p-6 ${args.orientation === "vertical" ? "flex h-24 items-center" : "w-80"}`}
    >
      <Divider
        orientation={args.orientation}
        inset={args.inset}
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
          "Fully controllable story — use the controls panel to combine all props. " +
          "The container switches between a flex row (vertical) and a block layout (horizontal) automatically.",
      },
    },
  },
};
