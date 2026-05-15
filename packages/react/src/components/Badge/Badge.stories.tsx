import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";
import { IconButton } from "../IconButton";

const IconBell = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);

const IconMail = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "MD3 Badge — a small status indicator overlaid on icons and navigation items. Supports dot (small) and count (large) variants. https://m3.material.io/components/badges/overview",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    count: {
      control: "number",
      description: "Numeric count displayed in the badge. Omit for a dot indicator.",
    },
    max: {
      control: "number",
      description: "Maximum count before overflow truncation (e.g. '999+').",
    },
    color: {
      control: "select",
      options: ["error", "primary"],
      description: "Badge color role mapped to MD3 design tokens.",
    },
    invisible: {
      control: "boolean",
      description: "When true, hides the badge with an animated scale-out transition.",
    },
    "aria-label": {
      control: "text",
      description: "Accessible label override for the badge indicator.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    count: 3,
    color: "error",
  },
  render: (args) => (
    <Badge {...args}>
      <IconButton aria-label="Notifications">
        <IconBell />
      </IconButton>
    </Badge>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Default Badge wrapping an IconButton with error color and count=3. All controls in the panel are wired for interactive exploration.",
      },
    },
  },
};

export const DotBadge: Story = {
  render: () => (
    <Badge>
      <IconButton aria-label="Notifications">
        <IconBell />
      </IconButton>
    </Badge>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Dot badge — no count provided, so a small dot indicator is rendered. Use to signal new unread activity without a specific count.",
      },
    },
  },
};

export const CountBadge: Story = {
  render: () => (
    <Badge count={5}>
      <IconButton aria-label="Messages">
        <IconMail />
      </IconButton>
    </Badge>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Large count badge showing 5. The badge adopts the pill shape whenever a count is provided.",
      },
    },
  },
};

export const SingleDigit: Story = {
  render: () => (
    <Badge count={7}>
      <IconButton aria-label="Alerts">
        <IconBell />
      </IconButton>
    </Badge>
  ),
  parameters: {
    docs: {
      description: {
        story: "Single-digit count (7) demonstrating the compact pill form of the badge indicator.",
      },
    },
  },
};

export const MultiDigit: Story = {
  render: () => (
    <Badge count={42}>
      <IconButton aria-label="Notifications">
        <IconBell />
      </IconButton>
    </Badge>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Multi-digit count (42) demonstrating the wider pill that accommodates two-digit values.",
      },
    },
  },
};

export const Overflow: Story = {
  render: () => (
    <Badge count={1000} max={999}>
      <IconButton aria-label="Notifications">
        <IconBell />
      </IconButton>
    </Badge>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "count=1000 with max=999 — the badge truncates to '999+' to cap the displayed value at the configured maximum.",
      },
    },
  },
};

export const CustomMax: Story = {
  render: () => (
    <Badge count={50} max={9}>
      <IconButton aria-label="Messages">
        <IconMail />
      </IconButton>
    </Badge>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "count=50 with a custom max=9 — demonstrates that any max value can be set, producing '9+' truncation for compact UIs.",
      },
    },
  },
};

export const PrimaryColor: Story = {
  render: () => (
    <Badge count={4} color="primary">
      <IconButton aria-label="Notifications">
        <IconBell />
      </IconButton>
    </Badge>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Badge with color='primary', using the MD3 primary color role instead of the default error role.",
      },
    },
  },
};

export const ErrorColor: Story = {
  render: () => (
    <Badge count={4} color="error">
      <IconButton aria-label="Notifications">
        <IconBell />
      </IconButton>
    </Badge>
  ),
  parameters: {
    docs: {
      description: {
        story: "Badge with color='error' (the default). Maps to the MD3 error design token.",
      },
    },
  },
};

const InvisibleBadgeDemo = (): React.ReactElement => {
  const [invisible, setInvisible] = React.useState(false);
  return (
    <div className="flex flex-col items-center gap-6">
      <Badge count={3} invisible={invisible}>
        <IconButton aria-label="Notifications">
          <IconBell />
        </IconButton>
      </Badge>
      <button
        type="button"
        onClick={() => setInvisible((v) => !v)}
        className="bg-surface-variant text-on-surface-variant rounded px-4 py-2 text-sm"
      >
        {invisible ? "Show badge" : "Hide badge"}
      </button>
    </div>
  );
};

export const InvisibleBadge: Story = {
  render: () => <InvisibleBadgeDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "invisible=true hides the badge with a scale-out / opacity transition. Click the toggle button to animate the hide and show and observe the reduced-motion-aware transition.",
      },
    },
  },
};

export const ZeroCount: Story = {
  render: () => (
    <Badge count={0}>
      <IconButton aria-label="Notifications">
        <IconBell />
      </IconButton>
    </Badge>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "count=0 causes the badge to hide itself automatically — no explicit invisible prop required.",
      },
    },
  },
};

export const WrappingIconButton: Story = {
  render: () => (
    <Badge count={3} color="error">
      <IconButton aria-label="Messages" variant="filled">
        <IconMail />
      </IconButton>
    </Badge>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Badge composing an existing IconButton with variant='filled' — demonstrates transparent wrapping of any component variant.",
      },
    },
  },
};

const NavItemDemo = (): React.ReactElement => (
  <div className="flex flex-col items-center gap-1">
    <Badge count={3}>
      <div className="bg-secondary-container text-on-secondary-container flex h-8 w-16 items-center justify-center rounded-full">
        <IconBell />
      </div>
    </Badge>
    <span className="text-on-surface text-xs">Inbox</span>
  </div>
);

export const WrappingNavigationItem: Story = {
  render: () => <NavItemDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Badge composing a navigation item mockup with count=3. Mirrors MD3 bottom navigation badge usage where the badge overlays a nav pill chip.",
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-row items-end gap-8">
      <div className="flex flex-col items-center gap-3">
        <Badge>
          <IconButton aria-label="Dot badge demo">
            <IconBell />
          </IconButton>
        </Badge>
        <span className="text-on-surface text-xs">Dot</span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <Badge count={7}>
          <IconButton aria-label="Single-digit badge demo">
            <IconBell />
          </IconButton>
        </Badge>
        <span className="text-on-surface text-xs">Single digit</span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <Badge count={42}>
          <IconButton aria-label="Multi-digit badge demo">
            <IconBell />
          </IconButton>
        </Badge>
        <span className="text-on-surface text-xs">Multi-digit</span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <Badge count={1000} max={999}>
          <IconButton aria-label="Overflow badge demo">
            <IconBell />
          </IconButton>
        </Badge>
        <span className="text-on-surface text-xs">Overflow</span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <Badge count={4} color="primary">
          <IconButton aria-label="Primary color badge demo">
            <IconBell />
          </IconButton>
        </Badge>
        <span className="text-on-surface text-xs">Primary</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Side-by-side showcase of all Badge variants: dot, single-digit, multi-digit, overflow ('999+'), and primary color.",
      },
    },
  },
};

export const Playground: Story = {
  args: {
    count: 3,
    max: 999,
    color: "error",
    invisible: false,
  },
  render: (args) => (
    <Badge {...args}>
      <IconButton aria-label="Playground notifications">
        <IconBell />
      </IconButton>
    </Badge>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Fully interactive playground — use the controls panel to adjust count, max, color, invisible, and aria-label and see all combinations live.",
      },
    },
  },
};
