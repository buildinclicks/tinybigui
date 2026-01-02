import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "./IconButton";
import React from "react";

// Sample icons for stories (using SVG)
const IconDelete = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const IconEdit = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

const IconFavorite = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const IconFavoriteOutline = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
  </svg>
);

const IconClose = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const meta: Meta<typeof IconButton> = {
  title: "Components/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Material Design 3 IconButton component with 4 variants and mandatory accessibility support. Icon-only circular buttons for compact actions.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["standard", "filled", "tonal", "outlined"],
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
    isDisabled: {
      control: "boolean",
      description: "Disable the button",
    },
    selected: {
      control: "boolean",
      description: "Toggle selected state",
    },
    disableRipple: {
      control: "boolean",
      description: "Disable ripple effect",
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

// Default Story
export const Default: Story = {
  args: {
    "aria-label": "Delete",
    variant: "standard",
    color: "primary",
    size: "medium",
    children: <IconDelete />,
  },
};

// Variants
export const Standard: Story = {
  args: {
    "aria-label": "Delete",
    variant: "standard",
    children: <IconDelete />,
  },
};

export const Filled: Story = {
  args: {
    "aria-label": "Favorite",
    variant: "filled",
    children: <IconFavorite />,
  },
};

export const Tonal: Story = {
  args: {
    "aria-label": "Edit",
    variant: "tonal",
    children: <IconEdit />,
  },
};

export const Outlined: Story = {
  args: {
    "aria-label": "Close",
    variant: "outlined",
    children: <IconClose />,
  },
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <IconButton aria-label="Delete" variant="standard">
        <IconDelete />
      </IconButton>
      <IconButton aria-label="Favorite" variant="filled">
        <IconFavorite />
      </IconButton>
      <IconButton aria-label="Edit" variant="tonal">
        <IconEdit />
      </IconButton>
      <IconButton aria-label="Close" variant="outlined">
        <IconClose />
      </IconButton>
    </div>
  ),
};

// Colors
export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <IconButton aria-label="Primary" color="primary">
          <IconFavorite />
        </IconButton>
        <IconButton aria-label="Secondary" color="secondary">
          <IconFavorite />
        </IconButton>
        <IconButton aria-label="Tertiary" color="tertiary">
          <IconFavorite />
        </IconButton>
        <IconButton aria-label="Error" color="error">
          <IconFavorite />
        </IconButton>
      </div>
      <div className="flex gap-2">
        <IconButton aria-label="Primary" variant="filled" color="primary">
          <IconFavorite />
        </IconButton>
        <IconButton aria-label="Secondary" variant="filled" color="secondary">
          <IconFavorite />
        </IconButton>
        <IconButton aria-label="Tertiary" variant="filled" color="tertiary">
          <IconFavorite />
        </IconButton>
        <IconButton aria-label="Error" variant="filled" color="error">
          <IconFavorite />
        </IconButton>
      </div>
    </div>
  ),
};

// Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <IconButton aria-label="Small" size="small">
        <IconFavorite />
      </IconButton>
      <IconButton aria-label="Medium" size="medium">
        <IconFavorite />
      </IconButton>
      <IconButton aria-label="Large" size="large">
        <IconFavorite />
      </IconButton>
    </div>
  ),
};

// States
export const Disabled: Story = {
  render: () => (
    <div className="flex gap-4">
      <IconButton aria-label="Delete" isDisabled>
        <IconDelete />
      </IconButton>
      <IconButton aria-label="Favorite" variant="filled" isDisabled>
        <IconFavorite />
      </IconButton>
      <IconButton aria-label="Edit" variant="tonal" isDisabled>
        <IconEdit />
      </IconButton>
      <IconButton aria-label="Close" variant="outlined" isDisabled>
        <IconClose />
      </IconButton>
    </div>
  ),
};

// Toggle Button
const ToggleExample = (): React.ReactElement => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <IconButton
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        variant="standard"
        selected={isFavorite}
        onPress={() => setIsFavorite(!isFavorite)}
      >
        {isFavorite ? <IconFavorite /> : <IconFavoriteOutline />}
      </IconButton>
      <p className="text-sm">{isFavorite ? "Favorited" : "Not favorited"}</p>
    </div>
  );
};

export const Toggle: Story = {
  render: () => <ToggleExample />,
  parameters: {
    docs: {
      description: {
        story:
          "IconButton supports toggle mode with the `selected` prop. Use aria-pressed for accessibility. Change the icon based on state for better UX.",
      },
    },
  },
};

// Interactive Example
const InteractiveExample = (): React.ReactElement => {
  const [count, setCount] = React.useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-lg">Clicks: {count}</p>
      <div className="flex gap-2">
        <IconButton
          aria-label="Add one"
          variant="filled"
          color="primary"
          onPress={() => setCount(count + 1)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </IconButton>
        <IconButton
          aria-label="Reset"
          variant="outlined"
          color="error"
          onPress={() => setCount(0)}
          isDisabled={count === 0}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
          </svg>
        </IconButton>
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveExample />,
};

// Playground
export const Playground: Story = {
  args: {
    "aria-label": "Icon button",
    children: <IconFavorite />,
    variant: "standard",
    color: "primary",
    size: "medium",
    selected: false,
    isDisabled: false,
    disableRipple: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Play around with all the icon button props to see how they work together.",
      },
    },
  },
};
