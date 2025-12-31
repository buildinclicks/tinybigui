import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

// Sample icons for stories
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

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Material Design 3 Button component with 5 variants, multiple colors, sizes, and full accessibility support.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["filled", "outlined", "tonal", "elevated", "text"],
      description: "Button visual style variant",
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "error"],
      description: "Color scheme for the button",
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
      description: "Button size",
    },
    disabled: {
      control: "boolean",
      description: "Disable the button",
    },
    loading: {
      control: "boolean",
      description: "Show loading spinner",
    },
    fullWidth: {
      control: "boolean",
      description: "Make button full width",
    },
    disableRipple: {
      control: "boolean",
      description: "Disable ripple effect",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Default Story
export const Default: Story = {
  args: {
    children: "Button",
    variant: "filled",
    color: "primary",
    size: "medium",
  },
};

// Variants
export const Filled: Story = {
  args: {
    variant: "filled",
    children: "Filled Button",
  },
};

export const Outlined: Story = {
  args: {
    variant: "outlined",
    children: "Outlined Button",
  },
};

export const Tonal: Story = {
  args: {
    variant: "tonal",
    children: "Tonal Button",
  },
};

export const Elevated: Story = {
  args: {
    variant: "elevated",
    children: "Elevated Button",
  },
};

export const Text: Story = {
  args: {
    variant: "text",
    children: "Text Button",
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Button variant="filled">Filled</Button>
      <Button variant="outlined">Outlined</Button>
      <Button variant="tonal">Tonal</Button>
      <Button variant="elevated">Elevated</Button>
      <Button variant="text">Text</Button>
    </div>
  ),
};

// Colors
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button color="primary">Primary</Button>
        <Button color="secondary">Secondary</Button>
        <Button color="tertiary">Tertiary</Button>
        <Button color="error">Error</Button>
      </div>
      <div className="flex gap-2">
        <Button variant="outlined" color="primary">
          Primary
        </Button>
        <Button variant="outlined" color="secondary">
          Secondary
        </Button>
        <Button variant="outlined" color="tertiary">
          Tertiary
        </Button>
        <Button variant="outlined" color="error">
          Error
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant="tonal" color="primary">
          Primary
        </Button>
        <Button variant="tonal" color="secondary">
          Secondary
        </Button>
        <Button variant="tonal" color="tertiary">
          Tertiary
        </Button>
        <Button variant="tonal" color="error">
          Error
        </Button>
      </div>
    </div>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};

// With Icons
export const WithLeadingIcon: Story = {
  args: {
    icon: <IconAdd />,
    children: "Add Item",
  },
};

export const WithTrailingIcon: Story = {
  args: {
    trailingIcon: <IconArrowForward />,
    children: "Continue",
  },
};

export const IconExamples: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button icon={<IconAdd />}>Add</Button>
        <Button icon={<IconFavorite />} variant="outlined">
          Like
        </Button>
        <Button icon={<IconAdd />} variant="tonal">
          Create
        </Button>
      </div>
      <div className="flex gap-2">
        <Button trailingIcon={<IconArrowForward />}>Next</Button>
        <Button trailingIcon={<IconArrowForward />} variant="outlined">
          Continue
        </Button>
        <Button trailingIcon={<IconArrowForward />} variant="text">
          Learn More
        </Button>
      </div>
    </div>
  ),
};

// States
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button disabled>Filled</Button>
        <Button variant="outlined" disabled>
          Outlined
        </Button>
        <Button variant="tonal" disabled>
          Tonal
        </Button>
        <Button variant="elevated" disabled>
          Elevated
        </Button>
        <Button variant="text" disabled>
          Text
        </Button>
      </div>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button loading>Loading</Button>
        <Button variant="outlined" loading>
          Loading
        </Button>
        <Button variant="tonal" loading>
          Loading
        </Button>
      </div>
      <div className="flex gap-2">
        <Button loading icon={<IconAdd />}>
          Creating
        </Button>
        <Button variant="outlined" loading icon={<IconFavorite />}>
          Saving
        </Button>
      </div>
    </div>
  ),
};

// Full Width
export const FullWidth: Story = {
  render: () => (
    <div className="flex w-80 flex-col gap-4">
      <Button fullWidth>Full Width Button</Button>
      <Button variant="outlined" fullWidth>
        Full Width Outlined
      </Button>
      <Button variant="tonal" fullWidth icon={<IconAdd />}>
        Full Width With Icon
      </Button>
    </div>
  ),
};

// Interactive Example
const InteractiveExample = (): React.ReactElement => {
  const [count, setCount] = React.useState(0);
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-lg">Count: {count}</p>
      <div className="flex gap-2">
        <Button onClick={() => setCount(count + 1)} icon={<IconAdd />}>
          Increment
        </Button>
        <Button variant="outlined" onClick={() => setCount(0)} disabled={count === 0}>
          Reset
        </Button>
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveExample />,
};

// Accessibility Example
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
        story:
          "Buttons support ARIA attributes for enhanced accessibility. Use aria-label, aria-pressed, aria-haspopup, etc.",
      },
    },
  },
};

// Button Types
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
  parameters: {
    docs: {
      description: {
        story: "Buttons support different HTML button types: submit, reset, and button.",
      },
    },
  },
};

// Complex Example
export const ComplexExample: Story = {
  render: () => (
    <div className="bg-surface w-96 rounded-lg p-6">
      <h2 className="mb-4 text-2xl font-bold">Confirm Action</h2>
      <p className="text-on-surface-variant mb-6">
        Are you sure you want to proceed with this action? This cannot be undone.
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="text">Cancel</Button>
        <Button variant="tonal" color="error">
          Delete
        </Button>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Example of buttons in a dialog/modal context.",
      },
    },
  },
};

// Playground
export const Playground: Story = {
  args: {
    children: "Customize Me",
    variant: "filled",
    color: "primary",
    size: "medium",
    disabled: false,
    loading: false,
    fullWidth: false,
    disableRipple: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Play around with all the button props to see how they work together.",
      },
    },
  },
};

// Import React for Interactive story
import React from "react";
