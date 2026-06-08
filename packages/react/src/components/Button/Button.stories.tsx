import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const IconAdd = (): React.ReactElement => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

const IconArrowForward = (): React.ReactElement => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
  </svg>
);

const IconFavorite = (): React.ReactElement => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const IconDelete = (): React.ReactElement => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Material Design 3 Button component with 5 strict MD3 variants, 3 sizes, and full accessibility support. Each variant uses its spec-defined color roles — no color override is needed.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "outlined", "tonal", "elevated", "text"],
      description: "MD3 button variant — determines visual emphasis and color roles",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "Button size (small=32dp, medium=40dp, large=56dp)",
    },
    isDisabled: {
      control: "boolean",
      description: "Disable the button",
    },
    loading: {
      control: "boolean",
      description: "Show loading spinner (also disables the button)",
    },
    fullWidth: {
      control: "boolean",
      description: "Span the full width of the container",
    },
    disableRipple: {
      control: "boolean",
      description: "Disable the ripple press effect",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ─── DEFAULT ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    children: "Button",
    variant: "filled",
    size: "medium",
  },
};

// ─── VARIANTS ─────────────────────────────────────────────────────────────────

export const Filled: Story = {
  args: { variant: "filled", children: "Filled" },
};

export const Outlined: Story = {
  args: { variant: "outlined", children: "Outlined" },
};

export const Tonal: Story = {
  args: { variant: "tonal", children: "Tonal" },
};

export const Elevated: Story = {
  args: { variant: "elevated", children: "Elevated" },
};

export const Text: Story = {
  args: { variant: "text", children: "Text" },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="filled">Filled</Button>
      <Button variant="tonal">Tonal</Button>
      <Button variant="elevated">Elevated</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="text">Text</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All 5 MD3 button variants ordered by visual emphasis (highest to lowest). Use at most one filled/elevated per surface.",
      },
    },
  },
};

// ─── SIZES ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-3">
      <Button size="small">Small (32dp)</Button>
      <Button size="medium">Medium (40dp)</Button>
      <Button size="large">Large (56dp)</Button>
    </div>
  ),
};

// ─── ICONS ────────────────────────────────────────────────────────────────────

export const WithLeadingIcon: Story = {
  args: { icon: <IconAdd />, children: "Add Item" },
};

export const WithTrailingIcon: Story = {
  args: { trailingIcon: <IconArrowForward />, children: "Continue" },
};

export const IconExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Button icon={<IconAdd />}>Add</Button>
        <Button icon={<IconFavorite />} variant="outlined">
          Like
        </Button>
        <Button icon={<IconAdd />} variant="tonal">
          Create
        </Button>
        <Button icon={<IconAdd />} variant="elevated">
          Elevated
        </Button>
        <Button icon={<IconFavorite />} variant="text">
          Favorite
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button trailingIcon={<IconArrowForward />}>Next</Button>
        <Button trailingIcon={<IconArrowForward />} variant="outlined">
          Continue
        </Button>
        <Button trailingIcon={<IconArrowForward />} variant="text">
          Learn More
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button size="small" icon={<IconAdd />}>
          Small
        </Button>
        <Button size="medium" icon={<IconAdd />}>
          Medium
        </Button>
        <Button size="large" icon={<IconAdd />}>
          Large
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "MD3 spec: icons must be 18×18px. Use the leading slot for action icons, trailing for directional/navigation icons.",
      },
    },
  },
};

// ─── STATES ───────────────────────────────────────────────────────────────────

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button isDisabled>Filled</Button>
      <Button variant="outlined" isDisabled>
        Outlined
      </Button>
      <Button variant="tonal" isDisabled>
        Tonal
      </Button>
      <Button variant="elevated" isDisabled>
        Elevated
      </Button>
      <Button variant="text" isDisabled>
        Text
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Disabled state per MD3: container uses on-surface at 12% opacity, label uses on-surface at 38% opacity. Elevation is removed.",
      },
    },
  },
};

export const Loading: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <Button loading>Saving</Button>
        <Button variant="outlined" loading>
          Saving
        </Button>
        <Button variant="tonal" loading>
          Saving
        </Button>
        <Button variant="elevated" loading>
          Saving
        </Button>
        <Button variant="text" loading>
          Saving
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button loading icon={<IconAdd />}>
          Creating
        </Button>
        <Button variant="outlined" loading icon={<IconFavorite />}>
          Liking
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Loading state: spinner replaces icon (layout stable — icon is invisible not hidden), button is disabled. data-loading attribute is set on root.",
      },
    },
  },
};

// ─── FULL WIDTH ───────────────────────────────────────────────────────────────

export const FullWidth: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-3">
      <Button fullWidth>Full Width Filled</Button>
      <Button variant="outlined" fullWidth>
        Full Width Outlined
      </Button>
      <Button variant="tonal" fullWidth icon={<IconAdd />}>
        With Icon
      </Button>
    </div>
  ),
};

// ─── INTERACTIVE ─────────────────────────────────────────────────────────────

const InteractiveExample = (): React.ReactElement => {
  const [count, setCount] = React.useState(0);
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-body-large text-on-surface">Count: {count}</p>
      <div className="flex gap-2">
        <Button onPress={() => setCount((c) => c + 1)} icon={<IconAdd />}>
          Increment
        </Button>
        <Button variant="outlined" onPress={() => setCount(0)} isDisabled={count === 0}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveExample />,
};

// ─── ACCESSIBILITY ────────────────────────────────────────────────────────────

export const Accessibility: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button aria-label="Add new item" icon={<IconAdd />}>
        Add
      </Button>
      <Button aria-pressed="true" icon={<IconFavorite />}>
        Liked
      </Button>
      <Button aria-haspopup="menu" trailingIcon={<IconArrowForward />}>
        Open Menu
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Buttons support ARIA attributes for enhanced accessibility.",
      },
    },
  },
};

// ─── BUTTON TYPES ─────────────────────────────────────────────────────────────

export const ButtonTypes: Story = {
  render: () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert("Form submitted!");
      }}
      onReset={() => alert("Form reset!")}
      className="flex flex-col gap-4"
    >
      <input
        type="text"
        placeholder="Enter text"
        className="border-outline rounded border px-4 py-2"
      />
      <div className="flex gap-2">
        <Button type="submit" icon={<IconAdd />}>
          Submit
        </Button>
        <Button type="reset" variant="outlined">
          Reset
        </Button>
        <Button type="button" variant="text">
          Cancel
        </Button>
      </div>
    </form>
  ),
};

// ─── COMPLEX EXAMPLE ─────────────────────────────────────────────────────────

export const ComplexExample: Story = {
  render: () => (
    <div className="bg-surface shadow-elevation-2 w-96 rounded-lg p-6">
      <h2 className="text-headline-small text-on-surface mb-2">Delete item?</h2>
      <p className="text-body-medium text-on-surface-variant mb-6">
        This will permanently remove the item. This action cannot be undone.
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="text">Cancel</Button>
        <Button variant="filled" icon={<IconDelete />}>
          Delete
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Dialog footer pattern: text button for dismissive actions, filled for destructive/confirming actions.",
      },
    },
  },
};

// ─── PLAYGROUND ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    children: "Customize Me",
    variant: "filled",
    size: "medium",
    isDisabled: false,
    loading: false,
    fullWidth: false,
    disableRipple: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Use the controls panel to explore all button props.",
      },
    },
  },
};
