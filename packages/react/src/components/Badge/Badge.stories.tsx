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

/**
 * A 24dp icon host — wraps the SVG in a span so the badge wrapper has a
 * fixed-size element to straddle. Using a bare icon (not a full IconButton)
 * matches the MD3 spec diagram where the badge center sits on the top-right
 * corner of the icon shape itself.
 */
const IconHost = ({
  children,
  className = "text-on-surface-variant",
}: {
  children: React.ReactNode;
  className?: string;
}): React.ReactElement => (
  <span className={`inline-flex h-6 w-6 items-center justify-center ${className}`}>{children}</span>
);

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "MD3 Badge — a small status indicator overlaid on icons and navigation items. The badge center straddles the wrapped element's top-right corner (`top-0 right-0 -translate-y-1/2 translate-x-1/2`), matching the MD3 spec. Uses the MD3 error color role (bg-error / text-on-error). Supports dot (small 6dp) and count (large 16dp) forms. https://m3.material.io/components/badges/overview",
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
  },
  render: (args) => (
    <Badge {...args}>
      <IconHost>
        <IconBell />
      </IconHost>
    </Badge>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Default Badge wrapping a 24dp icon host with count=3. The badge center sits on the icon's top-right corner (MD3 spec). All controls in the panel are wired for interactive exploration.",
      },
    },
  },
};

export const DotBadge: Story = {
  render: () => (
    <Badge>
      <IconHost>
        <IconBell />
      </IconHost>
    </Badge>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Dot badge — no count provided, so a 6dp dot indicator is rendered. The dot center sits on the icon's top-right corner. Use to signal new unread activity without a specific count.",
      },
    },
  },
};

export const CountBadge: Story = {
  render: () => (
    <Badge count={5}>
      <IconHost>
        <IconMail />
      </IconHost>
    </Badge>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Large count badge (16dp height) showing 5. The pill center straddles the icon's top-right corner, matching the MD3 spec diagram.",
      },
    },
  },
};

export const SingleDigit: Story = {
  render: () => (
    <Badge count={7}>
      <IconHost>
        <IconBell />
      </IconHost>
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
      <IconHost>
        <IconBell />
      </IconHost>
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
      <IconHost>
        <IconBell />
      </IconHost>
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
      <IconHost>
        <IconMail />
      </IconHost>
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

const InvisibleBadgeDemo = (): React.ReactElement => {
  const [invisible, setInvisible] = React.useState(false);
  return (
    <div className="flex flex-col items-center gap-6">
      <Badge count={3} invisible={invisible}>
        <IconHost>
          <IconBell />
        </IconHost>
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
          "invisible=true hides the badge with a scale-out transition (MD3 Expressive fast-spatial spring). The badge scales to zero from its corner-anchored position. Click the toggle button to animate show and hide, observing the reduced-motion-aware behaviour.",
      },
    },
  },
};

export const ZeroCount: Story = {
  render: () => (
    <Badge count={0}>
      <IconHost>
        <IconBell />
      </IconHost>
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
    <Badge count={3}>
      <IconButton aria-label="Messages" variant="filled">
        <IconMail />
      </IconButton>
    </Badge>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Badge composing a full IconButton (variant='filled'). The badge center straddles the button's top-right corner — the larger host pushes the badge further out from the icon. For spec-precise icon-corner placement, wrap a bare icon host as shown in the Default story.",
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
          "Badge composing a navigation item mockup with count=3. The badge straddles the top-right corner of the nav pill chip. Mirrors MD3 bottom navigation badge usage.",
      },
    },
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-row items-end gap-8">
      <div className="flex flex-col items-center gap-3">
        <Badge>
          <IconHost>
            <IconBell />
          </IconHost>
        </Badge>
        <span className="text-on-surface text-xs">Dot</span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <Badge count={7}>
          <IconHost>
            <IconBell />
          </IconHost>
        </Badge>
        <span className="text-on-surface text-xs">Single digit</span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <Badge count={42}>
          <IconHost>
            <IconBell />
          </IconHost>
        </Badge>
        <span className="text-on-surface text-xs">Multi-digit</span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <Badge count={1000} max={999}>
          <IconHost>
            <IconBell />
          </IconHost>
        </Badge>
        <span className="text-on-surface text-xs">Overflow</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Side-by-side showcase of all Badge forms: dot (6dp), single-digit, multi-digit, and overflow ('999+'). All use the MD3 error color role and corner-overlap placement anchored to a 24dp icon host.",
      },
    },
  },
};

export const Playground: Story = {
  args: {
    count: 3,
    max: 999,
    invisible: false,
  },
  render: (args) => (
    <Badge {...args}>
      <IconHost>
        <IconBell />
      </IconHost>
    </Badge>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Fully interactive playground — use the controls panel to adjust count, max, invisible, and aria-label and see all combinations live.",
      },
    },
  },
};
