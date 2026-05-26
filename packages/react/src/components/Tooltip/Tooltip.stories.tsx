import type { Meta, StoryObj } from "@storybook/react";
import type React from "react";
import { TooltipTrigger } from "./TooltipTrigger";
import { Tooltip } from "./Tooltip";
import { RichTooltip } from "./RichTooltip";
import { Button } from "../Button/Button";
import { IconButton } from "../IconButton/IconButton";
import type { TooltipProps } from "./Tooltip.types";

// ─── Icon helpers ─────────────────────────────────────────────────────────────

const IconStar = (): React.ReactElement => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Tooltip> = {
  title: "Components/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Material Design 3 Tooltip components — **Plain** and **Rich** variants.

**Plain Tooltip** (\`Tooltip\`) displays a short single-line text label that identifies or briefly describes an element. It uses the MD3 inverse-surface colour for maximum contrast and appears after a 300 ms hover delay or immediately on keyboard focus.

**Rich Tooltip** (\`RichTooltip\`) supports an optional title, multi-line supporting text, and an optional action button. It uses the surface-container background with elevation and a scale-in/out animation.

Compose via \`TooltipTrigger\`:

\`\`\`tsx
<TooltipTrigger delay={300}>
  <Button>Save</Button>
  <Tooltip placement="top">Save file</Tooltip>
</TooltipTrigger>
\`\`\`

[MD3 Tooltips spec](https://m3.material.io/components/tooltips/overview)
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
      description: "Preferred tooltip placement relative to the trigger",
    },
    className: {
      control: "text",
      description: "Additional Tailwind CSS classes",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "80px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args: TooltipProps) => (
    <TooltipTrigger>
      <Button variant="filled">Hover me</Button>
      <Tooltip placement={args.placement ?? "top"}>Save file</Tooltip>
    </TooltipTrigger>
  ),
  args: {
    placement: "top",
  },
};

// ─── PlainTooltip ─────────────────────────────────────────────────────────────

export const PlainTooltip: Story = {
  render: (args: TooltipProps) => (
    <TooltipTrigger>
      <Button variant="outlined">Hover me</Button>
      <Tooltip placement={args.placement} className={args.className}>
        Plain tooltip label
      </Tooltip>
    </TooltipTrigger>
  ),
  args: {
    placement: "top",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Plain tooltip with all props controllable via the controls panel. Adjust placement to see how React Aria's automatic viewport-flip works.",
      },
    },
  },
};

// ─── RichTooltipStory ─────────────────────────────────────────────────────────

export const RichTooltipStory: Story = {
  name: "RichTooltip",
  render: () => (
    <TooltipTrigger>
      <Button variant="tonal">Hover me</Button>
      <RichTooltip
        title="Add to list"
        placement="top"
        action={<Button variant="text">Learn more</Button>}
      >
        Saved items appear in your personal library and sync across devices.
      </RichTooltip>
    </TooltipTrigger>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Rich tooltip with a title, supporting text, and an action button per MD3 specification.",
      },
    },
  },
};

// ─── Placement stories ────────────────────────────────────────────────────────

export const PlacementTop: Story = {
  render: () => (
    <TooltipTrigger>
      <Button>Top</Button>
      <Tooltip placement="top">Positioned top</Tooltip>
    </TooltipTrigger>
  ),
};

export const PlacementBottom: Story = {
  render: () => (
    <TooltipTrigger>
      <Button>Bottom</Button>
      <Tooltip placement="bottom">Positioned bottom</Tooltip>
    </TooltipTrigger>
  ),
};

export const PlacementLeft: Story = {
  render: () => (
    <TooltipTrigger>
      <Button>Left</Button>
      <Tooltip placement="left">Positioned left</Tooltip>
    </TooltipTrigger>
  ),
};

export const PlacementRight: Story = {
  render: () => (
    <TooltipTrigger>
      <Button>Right</Button>
      <Tooltip placement="right">Positioned right</Tooltip>
    </TooltipTrigger>
  ),
};

// ─── AllPlacements ────────────────────────────────────────────────────────────

export const AllPlacements: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "96px",
        placeItems: "center",
      }}
    >
      <TooltipTrigger>
        <Button variant="outlined">Top</Button>
        <Tooltip placement="top">Positioned top</Tooltip>
      </TooltipTrigger>

      <TooltipTrigger>
        <Button variant="outlined">Right</Button>
        <Tooltip placement="right">Positioned right</Tooltip>
      </TooltipTrigger>

      <TooltipTrigger>
        <Button variant="outlined">Left</Button>
        <Tooltip placement="left">Positioned left</Tooltip>
      </TooltipTrigger>

      <TooltipTrigger>
        <Button variant="outlined">Bottom</Button>
        <Tooltip placement="bottom">Positioned bottom</Tooltip>
      </TooltipTrigger>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All four placement directions shown simultaneously. The four triggers are spaced far enough apart to prevent overlapping tooltips.",
      },
    },
  },
};

// ─── Interaction behaviour stories ───────────────────────────────────────────

export const HoverDelay: Story = {
  render: () => (
    <TooltipTrigger delay={300}>
      <Button>Hover me</Button>
      <Tooltip placement="top">Appears after 300 ms</Tooltip>
    </TooltipTrigger>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "**Interaction:** Hover the button — the tooltip appears after a 300 ms delay (MD3 default). Move the cursor away to dismiss.",
      },
    },
  },
};

export const InstantOnFocus: Story = {
  render: () => (
    <TooltipTrigger delay={300}>
      <Button>Tab to me</Button>
      <Tooltip placement="top">Instant on keyboard focus</Tooltip>
    </TooltipTrigger>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "**Interaction:** Tab to the button — the tooltip appears immediately on keyboard focus (no delay). This follows the MD3 accessibility requirement for instant feedback on focus.",
      },
    },
  },
};

export const EscapeDismiss: Story = {
  render: () => (
    <TooltipTrigger delay={300}>
      <Button>Hover, then press Escape</Button>
      <Tooltip placement="top">Press Escape to dismiss</Tooltip>
    </TooltipTrigger>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "**Interaction:** Hover the button to open the tooltip, then press **Escape** to dismiss it immediately — a standard keyboard escape-hatch per WAI-ARIA.",
      },
    },
  },
};

// ─── Rich Tooltip variations ─────────────────────────────────────────────────

export const RichWithAction: Story = {
  render: () => (
    <TooltipTrigger>
      <Button variant="filled">Add to list</Button>
      <RichTooltip
        title="Personal library"
        placement="top"
        action={<Button variant="text">Learn more</Button>}
      >
        Items you save appear in your personal list and sync automatically.
      </RichTooltip>
    </TooltipTrigger>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Rich tooltip with a "Learn more" text Button in the action slot. The `Button` component is used (not a plain `<button>`) to match MD3 styling.',
      },
    },
  },
};

export const RichWithoutTitle: Story = {
  render: () => (
    <TooltipTrigger>
      <Button variant="tonal">Hover me</Button>
      <RichTooltip placement="top">
        Supporting text only — no title is shown when the title prop is omitted.
      </RichTooltip>
    </TooltipTrigger>
  ),
  parameters: {
    docs: {
      description: {
        story: "Rich tooltip with only supporting text — the title prop is omitted.",
      },
    },
  },
};

// ─── TriggerVariety ───────────────────────────────────────────────────────────

export const TriggerVariety: Story = {
  render: () => (
    <div className="flex items-center gap-12">
      {/* Button trigger */}
      <TooltipTrigger>
        <Button variant="filled">Button</Button>
        <Tooltip placement="top">Works on Button</Tooltip>
      </TooltipTrigger>

      {/* IconButton trigger */}
      <TooltipTrigger>
        <IconButton aria-label="Favourite">
          <IconStar />
        </IconButton>
        <Tooltip placement="top">Works on IconButton</Tooltip>
      </TooltipTrigger>

      {/* Plain focusable span trigger */}
      <TooltipTrigger>
        {/* tabIndex makes the span keyboard-focusable so React Aria can wire ARIA attributes */}
        <span
          tabIndex={0}
          className="text-primary cursor-pointer underline decoration-dotted outline-none focus-visible:ring-2"
        >
          Plain span
        </span>
        <Tooltip placement="top">Works on any focusable element</Tooltip>
      </TooltipTrigger>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates that `TooltipTrigger` works with any focusable element — a `Button`, an `IconButton`, and a plain `<span tabIndex={0}>`.",
      },
    },
  },
};

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args: TooltipProps) => (
    <TooltipTrigger delay={300}>
      <Button variant="filled">Hover or focus me</Button>
      <Tooltip placement={args.placement} className={args.className}>
        Customise this tooltip via the controls panel
      </Tooltip>
    </TooltipTrigger>
  ),
  args: {
    placement: "top",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Fully interactive playground — use the controls panel to adjust `placement` and any other `Tooltip` props.",
      },
    },
  },
};
