import type { Meta, StoryObj } from "@storybook/react";
import { FAB } from "./FAB";
import React from "react";

// Sample icons for stories (24×24px for small/medium/extended, 36×36px for large)
const IconAdd = ({ size = 24 }: { size?: number }): React.ReactElement => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const IconEdit = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

const IconCamera = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 15.2c-2.07 0-3.75-1.68-3.75-3.75S9.93 7.7 12 7.7s3.75 1.68 3.75 3.75-1.68 3.75-3.75 3.75zm7.13-8.45H17.5l-1.69-2.25h-5.62l-1.69 2.25H5.87c-.61 0-1.1.49-1.1 1.1v11.5c0 .61.49 1.1 1.1 1.1h13.25c.61 0 1.1-.49 1.1-1.1V7.85c.01-.61-.48-1.1-1.09-1.1z" />
  </svg>
);

const IconShare = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
  </svg>
);

const meta: Meta<typeof FAB> = {
  title: "Components/FAB",
  component: FAB,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Material Design 3 Floating Action Button - High-emphasis button for primary screen action. Supports 4 sizes: small (40px), medium (56px), large (96px), and extended (with text).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large", "extended"],
      description: "FAB size variant",
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "surface"],
      description: "Color scheme for the FAB",
    },
    icon: {
      control: false,
      description: "Icon content (required). Recommended size: 24x24px (36x36px for large)",
    },
    "aria-label": {
      control: "text",
      description: "Mandatory accessible label for the FAB (required for all sizes)",
    },
    isDisabled: {
      control: "boolean",
      description: "Disable the FAB",
    },
    loading: {
      control: "boolean",
      description: "Show loading spinner",
    },
    disableRipple: {
      control: "boolean",
      description: "Disable ripple effect",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FAB>;

// Default Story
export const Default: Story = {
  args: {
    "aria-label": "Create new item",
    icon: <IconAdd />,
    size: "medium",
    color: "primary",
  },
};

// Sizes
export const Small: Story = {
  args: {
    "aria-label": "Add photo",
    icon: <IconCamera />,
    size: "small",
  },
};

export const Medium: Story = {
  args: {
    "aria-label": "Create new item",
    icon: <IconAdd />,
    size: "medium",
  },
};

export const Large: Story = {
  args: {
    "aria-label": "Compose",
    icon: <IconAdd size={36} />,
    size: "large",
  },
};

export const Extended: Story = {
  args: {
    "aria-label": "Create new item",
    icon: <IconAdd />,
    size: "extended",
    children: "Create",
  },
};

// All Sizes Showcase
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-6">
      <FAB aria-label="Small FAB" icon={<IconAdd />} size="small" />
      <FAB aria-label="Medium FAB" icon={<IconAdd />} size="medium" />
      <FAB aria-label="Large FAB" icon={<IconAdd size={36} />} size="large" />
      <FAB aria-label="Extended FAB" icon={<IconAdd />} size="extended">
        Create
      </FAB>
    </div>
  ),
};

// Colors
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        <FAB aria-label="Primary" icon={<IconAdd />} color="primary" />
        <FAB aria-label="Secondary" icon={<IconEdit />} color="secondary" />
        <FAB aria-label="Tertiary" icon={<IconCamera />} color="tertiary" />
        <FAB aria-label="Surface" icon={<IconShare />} color="surface" />
      </div>
      <div className="flex gap-4">
        <FAB aria-label="Primary" icon={<IconAdd />} color="primary" size="extended">
          Primary
        </FAB>
        <FAB aria-label="Secondary" icon={<IconEdit />} color="secondary" size="extended">
          Secondary
        </FAB>
        <FAB aria-label="Tertiary" icon={<IconCamera />} color="tertiary" size="extended">
          Tertiary
        </FAB>
        <FAB aria-label="Surface" icon={<IconShare />} color="surface" size="extended">
          Surface
        </FAB>
      </div>
    </div>
  ),
};

// Extended FAB Variants
export const ExtendedVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <FAB aria-label="Create new document" icon={<IconAdd />} size="extended">
        Create
      </FAB>
      <FAB aria-label="Edit document" icon={<IconEdit />} size="extended">
        Edit
      </FAB>
      <FAB aria-label="Add photo" icon={<IconCamera />} size="extended">
        Add Photo
      </FAB>
      <FAB aria-label="Share content" icon={<IconShare />} size="extended">
        Share
      </FAB>
    </div>
  ),
};

// States
export const Disabled: Story = {
  render: () => (
    <div className="flex gap-4">
      <FAB aria-label="Add" icon={<IconAdd />} isDisabled />
      <FAB aria-label="Edit" icon={<IconEdit />} color="secondary" isDisabled />
      <FAB aria-label="Create" icon={<IconAdd />} size="extended" isDisabled>
        Create
      </FAB>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="flex gap-4">
      <FAB aria-label="Creating" icon={<IconAdd />} loading />
      <FAB aria-label="Editing" icon={<IconEdit />} color="secondary" loading />
      <FAB aria-label="Creating" icon={<IconAdd />} size="extended" loading>
        Creating...
      </FAB>
    </div>
  ),
};

// Positioning Examples
export const PositioningExamples: Story = {
  render: () => (
    <div className="border-outline bg-surface-container relative h-96 w-full rounded-lg border p-4">
      <div className="h-full overflow-auto">
        <h3 className="mb-4 text-lg font-medium">Scroll Content Here</h3>
        <p className="mb-4">
          This demonstrates how FABs are typically positioned. In a real application, the FAB would
          be fixed to the viewport, not the container.
        </p>
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} className="mb-2">
            Content line {i + 1}
          </p>
        ))}
      </div>

      {/* Bottom-right (most common) */}
      <FAB aria-label="Create new" icon={<IconAdd />} className="absolute right-4 bottom-4" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "FABs are typically positioned fixed in the bottom-right corner. Use className to position the FAB as needed (e.g., `fixed bottom-4 right-4`).",
      },
    },
  },
};

// Real-World Examples
export const EmailCompose: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="border-outline bg-surface rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-bold">Inbox</h3>
        <p className="text-on-surface-variant">Your emails will appear here...</p>
      </div>
      <FAB aria-label="Compose new email" icon={<IconEdit />} size="extended">
        Compose
      </FAB>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Example: Email app with compose action",
      },
    },
  },
};

export const PhotoGallery: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="border-outline bg-surface rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-bold">Photo Gallery</h3>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-surface-variant aspect-square rounded" />
          ))}
        </div>
      </div>
      <FAB aria-label="Add photo" icon={<IconCamera />} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Example: Photo gallery with add photo action",
      },
    },
  },
};

// Interactive Example
const InteractiveExample = (): React.ReactElement => {
  const [items, setItems] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleAdd = (): void => {
    setLoading(true);
    setTimeout(() => {
      setItems([...items, `Item ${items.length + 1}`]);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="border-outline bg-surface rounded-lg border p-6">
        <h3 className="mb-4 text-lg font-bold">My Items</h3>
        {items.length === 0 ? (
          <p className="text-on-surface-variant">No items yet. Click the FAB to add one!</p>
        ) : (
          <ul className="list-inside list-disc">
            {items.map((item, i) => (
              <li key={i}>{item}</li>
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
        story: "Interactive example with loading state when adding items",
      },
    },
  },
};

// Playground
export const Playground: Story = {
  args: {
    "aria-label": "Create new item",
    icon: <IconAdd />,
    size: "medium",
    color: "primary",
    isDisabled: false,
    loading: false,
    disableRipple: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Play around with all the FAB props to see how they work together.",
      },
    },
  },
};
