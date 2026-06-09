import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { FAB } from "./FAB";

// ── Sample icons ──────────────────────────────────────────────────────────────

const IconAdd = ({ size = 24 }: { size?: number }): React.ReactElement => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const IconEdit = ({ size = 24 }: { size?: number }): React.ReactElement => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

const IconCamera = ({ size = 24 }: { size?: number }): React.ReactElement => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 15.2c-2.07 0-3.75-1.68-3.75-3.75S9.93 7.7 12 7.7s3.75 1.68 3.75 3.75-1.68 3.75-3.75 3.75zm7.13-8.45H17.5l-1.69-2.25h-5.62l-1.69 2.25H5.87c-.61 0-1.1.49-1.1 1.1v11.5c0 .61.49 1.1 1.1 1.1h13.25c.61 0 1.1-.49 1.1-1.1V7.85c.01-.61-.48-1.1-1.09-1.1z" />
  </svg>
);

const IconShare = ({ size = 24 }: { size?: number }): React.ReactElement => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
  </svg>
);

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta<typeof FAB> = {
  title: "Components/FAB",
  component: FAB,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
**Material Design 3 Floating Action Button — M3 Expressive**

High-emphasis button for the primary screen action. The FAB is always the most prominent interactive element on the screen.

**M3 Expressive size scale:**
- \`fab\` (56dp) — Default. Standard FAB.
- \`medium\` (80dp) — Medium FAB. New in M3 Expressive.
- \`large\` (96dp) — Large FAB.
- \`extended\` (56dp height) — Extended FAB with icon + text.
- \`small\` (40dp) — @deprecated. Use \`fab\` instead.

**Color styles:**
- Container: \`primary-container\` (default), \`secondary-container\`, \`tertiary-container\`
- Solid (M3 Expressive): \`primary\`, \`secondary\`, \`tertiary\`
- \`surface\` — @deprecated. Use \`primary-container\`.
        `.trim(),
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["fab", "medium", "large", "extended", "small"],
      description: "FAB size variant",
    },
    color: {
      control: "select",
      options: [
        "primary-container",
        "secondary-container",
        "tertiary-container",
        "primary",
        "secondary",
        "tertiary",
        "surface",
      ],
      description: "Color style for the FAB",
    },
    icon: {
      control: false,
      description:
        "Icon content (required). Sizes: 24dp (fab/extended/small), 28dp (medium), 36dp (large)",
    },
    "aria-label": {
      control: "text",
      description: "Mandatory accessible label (required for all FAB sizes)",
    },
    isDisabled: {
      control: "boolean",
      description: "Disable the FAB",
    },
    loading: {
      control: "boolean",
      description: "Show loading spinner and disable interaction",
    },
    disableRipple: {
      control: "boolean",
      description: "Disable the MD3 ripple effect",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FAB>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    "aria-label": "Create new item",
    icon: <IconAdd />,
    size: "fab",
    color: "primary-container",
  },
};

// ── Sizes ─────────────────────────────────────────────────────────────────────

export const Fab: Story = {
  name: "FAB (56dp) — Default",
  args: {
    "aria-label": "Create new item",
    icon: <IconAdd />,
    size: "fab",
  },
  parameters: {
    docs: {
      description: { story: "Standard FAB — 56dp, 16dp corner radius. Default size." },
    },
  },
};

export const Medium: Story = {
  name: "Medium FAB (80dp) — M3 Expressive",
  args: {
    "aria-label": "Create new item",
    icon: <IconAdd size={28} />,
    size: "medium",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Medium FAB — 80dp, 20dp corner radius, 28dp icon. New in M3 Expressive. Recommended for most primary-action use cases on compact/medium screens.",
      },
    },
  },
};

export const Large: Story = {
  name: "Large FAB (96dp)",
  args: {
    "aria-label": "Compose",
    icon: <IconAdd size={36} />,
    size: "large",
  },
  parameters: {
    docs: {
      description: { story: "Large FAB — 96dp, 28dp corner radius, 36dp icon." },
    },
  },
};

export const Extended: Story = {
  name: "Extended FAB",
  args: {
    "aria-label": "Create new document",
    icon: <IconAdd />,
    size: "extended",
    children: "Create",
  },
  parameters: {
    docs: {
      description: {
        story: "Extended FAB — 56dp height, variable width. Icon + text label side by side.",
      },
    },
  },
};

export const AllSizes: Story = {
  name: "All Sizes",
  render: () => (
    <div className="flex items-end gap-6">
      <div className="flex flex-col items-center gap-2">
        <FAB aria-label="FAB" icon={<IconAdd />} size="fab" />
        <span className="text-label-small text-on-surface-variant">fab (56dp)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <FAB aria-label="Medium FAB" icon={<IconAdd size={28} />} size="medium" />
        <span className="text-label-small text-on-surface-variant">medium (80dp)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <FAB aria-label="Large FAB" icon={<IconAdd size={36} />} size="large" />
        <span className="text-label-small text-on-surface-variant">large (96dp)</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <FAB aria-label="Extended FAB" icon={<IconAdd />} size="extended">
          Create
        </FAB>
        <span className="text-label-small text-on-surface-variant">extended</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: { story: "All recommended M3 Expressive FAB sizes." },
    },
  },
};

// ── Colors ────────────────────────────────────────────────────────────────────

export const ContainerColors: Story = {
  name: "Container Colors (default set)",
  render: () => (
    <div className="flex flex-col gap-6">
      <p className="text-body-small text-on-surface-variant">Container color styles (default)</p>
      <div className="flex items-center gap-4">
        <FAB aria-label="Primary container" icon={<IconAdd />} color="primary-container" />
        <FAB aria-label="Secondary container" icon={<IconEdit />} color="secondary-container" />
        <FAB aria-label="Tertiary container" icon={<IconCamera />} color="tertiary-container" />
      </div>
      <div className="flex items-center gap-4">
        <FAB
          aria-label="Primary container extended"
          icon={<IconAdd />}
          size="extended"
          color="primary-container"
        >
          Primary
        </FAB>
        <FAB
          aria-label="Secondary container extended"
          icon={<IconEdit />}
          size="extended"
          color="secondary-container"
        >
          Secondary
        </FAB>
        <FAB
          aria-label="Tertiary container extended"
          icon={<IconCamera />}
          size="extended"
          color="tertiary-container"
        >
          Tertiary
        </FAB>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Container color styles. `primary-container` is the default and recommended color for most FABs.",
      },
    },
  },
};

export const SolidColors: Story = {
  name: "Solid Colors (M3 Expressive)",
  render: () => (
    <div className="flex flex-col gap-6">
      <p className="text-body-small text-on-surface-variant">
        Solid color styles — new in M3 Expressive
      </p>
      <div className="flex items-center gap-4">
        <FAB aria-label="Primary" icon={<IconAdd />} color="primary" />
        <FAB aria-label="Secondary" icon={<IconEdit />} color="secondary" />
        <FAB aria-label="Tertiary" icon={<IconCamera />} color="tertiary" />
      </div>
      <div className="flex items-center gap-4">
        <FAB aria-label="Primary extended" icon={<IconAdd />} size="extended" color="primary">
          Primary
        </FAB>
        <FAB aria-label="Secondary extended" icon={<IconEdit />} size="extended" color="secondary">
          Secondary
        </FAB>
        <FAB aria-label="Tertiary extended" icon={<IconCamera />} size="extended" color="tertiary">
          Tertiary
        </FAB>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Solid color styles introduced in M3 Expressive. Use when the container style doesn't provide enough contrast or emphasis.",
      },
    },
  },
};

// ── States ────────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-label-medium text-on-surface-variant mb-3">Enabled (default)</p>
        <FAB aria-label="Add" icon={<IconAdd />} />
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant mb-3">
          Hovered (8% state layer, elevation 4)
        </p>
        <p className="text-body-small text-on-surface-variant mb-3">
          Hover over the FAB to see the state layer and elevated shadow.
        </p>
        <FAB aria-label="Add" icon={<IconAdd />} />
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant mb-3">
          Focused (10% state layer, keyboard-only focus ring)
        </p>
        <p className="text-body-small text-on-surface-variant mb-3">
          Tab to the FAB to see the focus ring.
        </p>
        <FAB aria-label="Add" icon={<IconAdd />} />
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant mb-3">Disabled</p>
        <div className="flex gap-4">
          <FAB aria-label="Add" icon={<IconAdd />} isDisabled />
          <FAB aria-label="Edit" icon={<IconEdit />} color="secondary-container" isDisabled />
          <FAB aria-label="Create" icon={<IconAdd />} size="extended" isDisabled>
            Create
          </FAB>
        </div>
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant mb-3">Loading</p>
        <div className="flex gap-4">
          <FAB aria-label="Creating" icon={<IconAdd />} loading />
          <FAB aria-label="Editing" icon={<IconEdit />} color="secondary-container" loading />
          <FAB aria-label="Creating" icon={<IconAdd />} size="extended" loading>
            Creating...
          </FAB>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "FAB interaction states per MD3 spec. Hover adds elevation-4 and 8% state layer. Focus (keyboard) shows a secondary outline ring at 10% state layer. Disabled uses 12%/38% opacity. Loading disables and shows a spinner.",
      },
    },
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <FAB aria-label="Add" icon={<IconAdd />} isDisabled />
      <FAB aria-label="Edit" icon={<IconEdit />} color="secondary-container" isDisabled />
      <FAB aria-label="Camera" icon={<IconCamera />} color="primary" isDisabled />
      <FAB aria-label="Create" icon={<IconAdd />} size="extended" isDisabled>
        Create
      </FAB>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <FAB aria-label="Creating" icon={<IconAdd />} loading />
      <FAB aria-label="Editing" icon={<IconEdit />} color="secondary-container" loading />
      <FAB aria-label="Creating" icon={<IconAdd />} size="extended" loading>
        Creating...
      </FAB>
    </div>
  ),
};

// ── Extended FAB variants ─────────────────────────────────────────────────────

export const ExtendedVariants: Story = {
  name: "Extended FAB — Variants",
  render: () => (
    <div className="flex flex-col gap-4">
      <FAB aria-label="Create new document" icon={<IconAdd />} size="extended">
        Create
      </FAB>
      <FAB
        aria-label="Edit document"
        icon={<IconEdit />}
        size="extended"
        color="secondary-container"
      >
        Edit
      </FAB>
      <FAB aria-label="Add photo" icon={<IconCamera />} size="extended" color="tertiary-container">
        Add Photo
      </FAB>
      <FAB aria-label="Share content" icon={<IconShare />} size="extended" color="primary">
        Share
      </FAB>
    </div>
  ),
};

// ── Positioning ───────────────────────────────────────────────────────────────

export const PositioningExamples: Story = {
  render: () => (
    <div className="border-outline bg-surface-container relative h-96 w-full rounded-lg border p-4">
      <div className="h-full overflow-auto">
        <h3 className="text-title-medium mb-4">Scroll Content</h3>
        <p className="text-body-medium mb-4">
          In a real app, use `className="fixed bottom-4 right-4"` to pin the FAB to the viewport.
        </p>
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} className="text-body-small text-on-surface-variant mb-2">
            Content line {i + 1}
          </p>
        ))}
      </div>
      <FAB aria-label="Create new" icon={<IconAdd />} className="absolute right-4 bottom-4" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'FABs are typically fixed to the bottom-right corner of the viewport. Use `className` for positioning (e.g. `className="fixed bottom-4 right-4"`).',
      },
    },
  },
};

// ── Interactive ───────────────────────────────────────────────────────────────

const InteractiveExample = (): React.ReactElement => {
  const [items, setItems] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleAdd = (): void => {
    setLoading(true);
    setTimeout(() => {
      setItems((prev) => [...prev, `Item ${prev.length + 1}`]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex w-72 flex-col gap-4">
      <div className="border-outline bg-surface min-h-32 rounded-lg border p-6">
        <h3 className="text-title-medium mb-4">My Items</h3>
        {items.length === 0 ? (
          <p className="text-body-medium text-on-surface-variant">No items yet. Click the FAB!</p>
        ) : (
          <ul className="list-inside list-disc space-y-1">
            {items.map((item, i) => (
              <li key={i} className="text-body-medium">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
      <FAB
        aria-label="Add item"
        icon={<IconAdd />}
        onPress={handleAdd}
        loading={loading}
        size="extended"
      >
        {loading ? "Adding..." : "Add Item"}
      </FAB>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveExample />,
  parameters: {
    docs: {
      description: {
        story: "Interactive example with loading state when adding items.",
      },
    },
  },
};

// ── Deprecated (baseline) ─────────────────────────────────────────────────────

export const DeprecatedSmall: Story = {
  name: "⚠️ Deprecated — Small FAB (40dp)",
  args: {
    "aria-label": "Add photo",
    icon: <IconCamera />,
    size: "small",
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Deprecated.** `size='small'` (40dp) is no longer recommended in M3 Expressive. Use `size='fab'` (56dp) instead. Kept for backward compatibility.",
      },
    },
  },
};

export const DeprecatedSurface: Story = {
  name: "⚠️ Deprecated — Surface Color",
  args: {
    "aria-label": "Share content",
    icon: <IconShare />,
    color: "surface",
  },
  parameters: {
    docs: {
      description: {
        story:
          "**Deprecated.** `color='surface'` is no longer recommended in M3 Expressive. Use `color='primary-container'` instead. Kept for backward compatibility.",
      },
    },
  },
};

// ── Playground ────────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    "aria-label": "Create new item",
    icon: <IconAdd />,
    size: "fab",
    color: "primary-container",
    isDisabled: false,
    loading: false,
    disableRipple: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Explore all FAB props with the controls below.",
      },
    },
  },
};
