import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { FABMenu } from "./FABMenu";
import { FABMenuItem } from "./FABMenuItem";

// ---------------------------------------------------------------------------
// Inline SVG icons — no external dependencies, no hardcoded hex values
// ---------------------------------------------------------------------------

const IconEdit = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

const IconShare = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
  </svg>
);

const IconDelete = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const IconCamera = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 15.2c-2.07 0-3.75-1.68-3.75-3.75S9.93 7.7 12 7.7s3.75 1.68 3.75 3.75-1.68 3.75-3.75 3.75zm7.13-8.45H17.5l-1.69-2.25h-5.62l-1.69 2.25H5.87c-.61 0-1.1.49-1.1 1.1v11.5c0 .61.49 1.1 1.1 1.1h13.25c.61 0 1.1-.49 1.1-1.1V7.85c.01-.61-.48-1.1-1.09-1.1z" />
  </svg>
);

const IconBookmark = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
  </svg>
);

const IconPrint = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
  </svg>
);

// ---------------------------------------------------------------------------
// Screen frame helper
//
// A bounded "app screen" frame that gives the FABMenu a realistic anchoring
// context. The FABMenu is placed in the appropriate corner via absolute
// positioning — matching MD3 Scaffold semantics where the FAB Menu is sticky
// to the bottom-end (LTR) or bottom-start (RTL) corner.
//
// No overflow-hidden: item elevation shadows and focus rings must not be clipped.
// ---------------------------------------------------------------------------

interface ScreenFrameProps {
  children: React.ReactNode;
  dir?: "ltr" | "rtl";
  className?: string;
}

const ScreenFrame = ({ children, dir, className }: ScreenFrameProps): React.ReactElement => (
  <div
    dir={dir}
    className={`bg-surface-container-low ring-outline-variant relative h-96 w-80 overflow-visible rounded-[28px] ring-1 ${className ?? ""}`}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof FABMenu> = {
  title: "Components/FABMenu",
  component: FABMenu,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "MD3 Expressive FAB Menu — a speed-dial pattern extending the FAB with expandable pill-shaped action items. Each item is a full-rounded 56dp button with a leading icon and inline label. The FAB stays anchored in place; menu items render as an absolutely-positioned overlay and never reflow the trigger. Place the FABMenu in the bottom-end corner of your app scaffold (bottom-right in LTR, bottom-left in RTL). https://m3.material.io/components/fab-menu/specs",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: "select",
      options: ["up", "down", "left", "right"],
      description: "Direction in which action items expand from the trigger FAB.",
    },
    open: {
      control: "boolean",
      description: "Controlled open state. When provided, onOpenChange must be used to update it.",
    },
    defaultOpen: {
      control: "boolean",
      description: "Default open state for uncontrolled usage.",
    },
    "aria-label": {
      control: "text",
      description: "Accessible label for the trigger FAB — required for screen readers.",
    },
    onOpenChange: {
      action: "onOpenChange",
      description: "Callback fired when the open state changes.",
    },
    children: {
      control: false,
      description: "FABMenuItem children rendered as action items when the menu is open.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FABMenu>;

// ---------------------------------------------------------------------------
// Default — bottom-end corner (up, LTR)
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    "aria-label": "Quick actions",
    direction: "up",
  },
  render: (args) => (
    <ScreenFrame>
      <FABMenu {...args} className="absolute end-4 bottom-4">
        <FABMenuItem icon={<IconEdit />} label="Edit" />
        <FABMenuItem icon={<IconShare />} label="Share" />
        <FABMenuItem icon={<IconDelete />} label="Delete" />
      </FABMenu>
    </ScreenFrame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Default FABMenu anchored to the bottom-end corner, expanding upward. The trigger FAB stays fixed in place — action items appear as an absolutely-positioned overlay so the FAB never shifts. Click the + FAB to toggle open or closed.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Direction stories
// ---------------------------------------------------------------------------

export const DirectionUp: Story = {
  render: () => (
    <ScreenFrame>
      <FABMenu aria-label="Actions expanding up" direction="up" className="absolute end-4 bottom-4">
        <FABMenuItem icon={<IconEdit />} label="Edit" />
        <FABMenuItem icon={<IconShare />} label="Share" />
        <FABMenuItem icon={<IconDelete />} label="Delete" />
      </FABMenu>
    </ScreenFrame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Action items expand upward — the default and most common layout for bottom-end placement. Items overlay the screen above the trigger; the FAB stays pinned to the corner.",
      },
    },
  },
};

export const DirectionDown: Story = {
  render: () => (
    <ScreenFrame>
      <FABMenu
        aria-label="Actions expanding down"
        direction="down"
        className="absolute end-4 top-4"
      >
        <FABMenuItem icon={<IconEdit />} label="Edit" />
        <FABMenuItem icon={<IconShare />} label="Share" />
        <FABMenuItem icon={<IconDelete />} label="Delete" />
      </FABMenu>
    </ScreenFrame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Action items expand downward — suited for top-end placement such as a top app bar FAB. The trigger stays at the top-end corner.",
      },
    },
  },
};

export const DirectionLeft: Story = {
  render: () => (
    <ScreenFrame>
      <FABMenu
        aria-label="Actions expanding left"
        direction="left"
        className="absolute end-4 bottom-4"
      >
        <FABMenuItem icon={<IconEdit />} label="Edit" />
        <FABMenuItem icon={<IconShare />} label="Share" />
        <FABMenuItem icon={<IconDelete />} label="Delete" />
      </FABMenu>
    </ScreenFrame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Action items expand to the left in a horizontal row — suited for right-edge placement where vertical space is limited. Trigger stays anchored.",
      },
    },
  },
};

export const DirectionRight: Story = {
  render: () => (
    <ScreenFrame>
      <FABMenu
        aria-label="Actions expanding right"
        direction="right"
        className="absolute start-4 bottom-4"
      >
        <FABMenuItem icon={<IconEdit />} label="Edit" />
        <FABMenuItem icon={<IconShare />} label="Share" />
        <FABMenuItem icon={<IconDelete />} label="Delete" />
      </FABMenu>
    </ScreenFrame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Action items expand to the right — suitable for bottom-start placement such as a bottom-left FAB in LTR layouts.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// RTL
// ---------------------------------------------------------------------------

export const RTL: Story = {
  render: () => (
    <ScreenFrame dir="rtl">
      <FABMenu aria-label="إجراءات سريعة" direction="up" className="absolute end-4 bottom-4">
        <FABMenuItem icon={<IconEdit />} label="تحرير" />
        <FABMenuItem icon={<IconShare />} label="مشاركة" />
        <FABMenuItem icon={<IconDelete />} label="حذف" />
      </FABMenu>
    </ScreenFrame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Right-to-left layout: `end-4` anchors the FAB to the physical bottom-left corner automatically. Logical insets (`end-0`, `me-3`, etc.) in the overlay ensure items expand in the correct direction without any RTL-specific code.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

export const Colors: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8 p-8">
      {(
        [
          { color: "primary-container", label: "primary-container (default)" },
          { color: "secondary-container", label: "secondary-container" },
          { color: "tertiary-container", label: "tertiary-container" },
          { color: "primary", label: "primary (solid)" },
          { color: "secondary", label: "secondary (solid)" },
          { color: "tertiary", label: "tertiary (solid)" },
        ] as const
      ).map(({ color, label }) => (
        <div key={color} className="flex flex-col items-center gap-3">
          <p className="text-label-small text-on-surface-variant text-center">{label}</p>
          <ScreenFrame className="h-48 w-48">
            <FABMenu
              aria-label={`${label} actions`}
              direction="up"
              defaultOpen
              className="absolute end-4 bottom-4"
            >
              <FABMenuItem icon={<IconEdit />} label="Edit" color={color} />
              <FABMenuItem icon={<IconShare />} label="Share" color={color} />
            </FABMenu>
          </ScreenFrame>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All 6 MD3 Expressive color roles: 3 container variants and 3 solid variants. State-layer color equals the on-color for each role per MD3 spec.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// States
// ---------------------------------------------------------------------------

export const States: Story = {
  render: () => (
    <div className="flex gap-12 p-8">
      <div className="flex flex-col items-center gap-3">
        <p className="text-label-small text-on-surface-variant">Normal</p>
        <ScreenFrame className="h-52 w-48">
          <FABMenu
            aria-label="Normal actions"
            direction="up"
            defaultOpen
            className="absolute end-4 bottom-4"
          >
            <FABMenuItem icon={<IconEdit />} label="Edit" />
          </FABMenu>
        </ScreenFrame>
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="text-label-small text-on-surface-variant">Disabled</p>
        <ScreenFrame className="h-52 w-48">
          <FABMenu
            aria-label="Disabled actions"
            direction="up"
            defaultOpen
            className="absolute end-4 bottom-4"
          >
            <FABMenuItem icon={<IconEdit />} label="Edit" isDisabled />
          </FABMenu>
        </ScreenFrame>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Normal and disabled states. Hover, focus, and pressed states are driven by data-* attributes via React Aria — interact with the Normal item to see the state layer and elevation responses.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Item count stories
// ---------------------------------------------------------------------------

export const ThreeActions: Story = {
  render: () => (
    <ScreenFrame>
      <FABMenu aria-label="Three actions" direction="up" className="absolute end-4 bottom-4">
        <FABMenuItem icon={<IconEdit />} label="Edit" />
        <FABMenuItem icon={<IconShare />} label="Share" />
        <FABMenuItem icon={<IconDelete />} label="Delete" />
      </FABMenu>
    </ScreenFrame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Three action items with stagger animation: each pill scales in with a 30ms delay offset for a fluid cascade effect from the trigger FAB.",
      },
    },
  },
};

export const TwoActions: Story = {
  render: () => (
    <ScreenFrame>
      <FABMenu aria-label="Two actions" direction="up" className="absolute end-4 bottom-4">
        <FABMenuItem icon={<IconEdit />} label="Edit" />
        <FABMenuItem icon={<IconShare />} label="Share" />
      </FABMenu>
    </ScreenFrame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Minimal two-item speed-dial — the recommended minimum when a regular FAB is not enough but three actions would be excessive.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// ControlledOpen
// ---------------------------------------------------------------------------

const ControlledOpenExample = (): React.ReactElement => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col items-center gap-6">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="bg-primary text-on-primary rounded-full px-6 py-2 text-sm font-medium"
      >
        {open ? "Close FAB Menu" : "Open FAB Menu"}
      </button>

      <ScreenFrame>
        <FABMenu
          aria-label="Controlled quick actions"
          direction="up"
          open={open}
          onOpenChange={setOpen}
          className="absolute end-4 bottom-4"
        >
          <FABMenuItem icon={<IconEdit />} label="Edit" />
          <FABMenuItem icon={<IconShare />} label="Share" />
          <FABMenuItem icon={<IconDelete />} label="Delete" />
        </FABMenu>
      </ScreenFrame>
    </div>
  );
};

export const ControlledOpen: Story = {
  render: () => <ControlledOpenExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Controlled mode: the external button drives `open` state via `onOpenChange`. Both the trigger FAB and the button stay in sync.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// KeyboardNavigation
// ---------------------------------------------------------------------------

export const KeyboardNavigation: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-6">
      <div className="bg-surface-container text-on-surface w-72 rounded-xl px-4 py-3 text-sm">
        <p className="font-medium">Keyboard instructions</p>
        <ul className="text-on-surface-variant mt-1 list-inside list-disc space-y-1">
          <li>
            <kbd className="rounded border px-1">Space</kbd> /{" "}
            <kbd className="rounded border px-1">Enter</kbd> — toggle the speed-dial
          </li>
          <li>
            <kbd className="rounded border px-1">Escape</kbd> — close and return focus to trigger
          </li>
          <li>
            <kbd className="rounded border px-1">Tab</kbd> — move focus between action items
          </li>
        </ul>
      </div>

      <ScreenFrame>
        <FABMenu
          aria-label="Keyboard-navigable quick actions"
          direction="up"
          className="absolute end-4 bottom-4"
        >
          <FABMenuItem icon={<IconEdit />} label="Edit" />
          <FABMenuItem icon={<IconShare />} label="Share" />
          <FABMenuItem icon={<IconDelete />} label="Delete" />
        </FABMenu>
      </ScreenFrame>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Focus the trigger FAB and use Space/Enter to expand the menu. Tab through action items and press Escape to collapse and return focus to the trigger.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// WithIcons (variety)
// ---------------------------------------------------------------------------

export const WithIcons: Story = {
  render: () => (
    <ScreenFrame>
      <FABMenu aria-label="Media actions" direction="up" className="absolute end-4 bottom-4">
        <FABMenuItem icon={<IconCamera />} label="Camera" />
        <FABMenuItem icon={<IconBookmark />} label="Save" />
        <FABMenuItem icon={<IconPrint />} label="Print" />
      </FABMenu>
    </ScreenFrame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Action items with a variety of Material Design icon shapes — demonstrates that the pill container handles different icon geometries consistently.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

export const Playground: Story = {
  args: {
    "aria-label": "Quick actions",
    direction: "up",
    defaultOpen: false,
  },
  render: (args) => (
    <ScreenFrame>
      <FABMenu {...args} className="absolute end-4 bottom-4">
        <FABMenuItem icon={<IconEdit />} label="Edit" />
        <FABMenuItem icon={<IconShare />} label="Share" />
        <FABMenuItem icon={<IconDelete />} label="Delete" />
      </FABMenu>
    </ScreenFrame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground — use the controls panel to change `direction`, toggle `open`, and update `aria-label` to explore all FABMenu variations.",
      },
    },
  },
};
