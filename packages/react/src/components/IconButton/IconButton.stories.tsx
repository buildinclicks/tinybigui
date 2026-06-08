import type { Meta, StoryObj } from "@storybook/react";
import { IconButton } from "./IconButton";
import React from "react";

// ─── Icon helpers ─────────────────────────────────────────────────────────────

const IconDelete = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const IconEdit = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

const IconFavoriteOutline = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
  </svg>
);

const IconFavoriteFilled = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const IconClose = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const IconSettings = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
  </svg>
);

const IconAdd = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
  </svg>
);

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof IconButton> = {
  title: "Components/IconButton",
  component: IconButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
Material Design 3 Expressive IconButton.

**Key features:**
- 5 sizes (xsmall → xlarge), 3 widths (narrow/default/wide), 2 shapes (round/square)
- Press shape-morph: round shape springs into square corners on press
- Toggle support with optional \`selectedIcon\`
- 4 variants × 4 color roles
- MD3-correct state layers (per-variant overlay color, 8%/10%/10% opacities)
- MD3-correct disabled (content opacity-38, container on-surface/12)
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["standard", "filled", "tonal", "outlined"],
      description: "MD3 button style variant",
    },
    color: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "error"],
      description: "MD3 color role",
    },
    size: {
      control: "select",
      options: ["xsmall", "small", "medium", "large", "xlarge"],
      description: "M3 Expressive 5-tier size (container height)",
    },
    width: {
      control: "select",
      options: ["narrow", "default", "wide"],
      description: "Container width relative to height",
    },
    shape: {
      control: "select",
      options: ["round", "square"],
      description: "Corner shape (round = circular; square = tiered MD3 radius)",
    },
    isDisabled: {
      control: "boolean",
      description: "Disable the button",
    },
    selected: {
      control: "boolean",
      description: "Toggle selected state (enables toggle behaviour when defined)",
    },
    disableRipple: {
      control: "boolean",
      description: "Disable ripple effect",
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    "aria-label": "Delete",
    variant: "standard",
    color: "primary",
    size: "medium",
    width: "default",
    shape: "round",
    children: <IconDelete />,
  },
};

// ─── Variants ─────────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <IconButton aria-label="Standard" variant="standard">
        <IconDelete />
      </IconButton>
      <IconButton aria-label="Filled" variant="filled">
        <IconFavoriteFilled />
      </IconButton>
      <IconButton aria-label="Tonal" variant="tonal">
        <IconEdit />
      </IconButton>
      <IconButton aria-label="Outlined" variant="outlined">
        <IconClose />
      </IconButton>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All four MD3 icon button variants: standard, filled, tonal, outlined.",
      },
    },
  },
};

// ─── Colors ───────────────────────────────────────────────────────────────────

export const Colors: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["standard", "filled", "tonal", "outlined"] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-2">
          {(["primary", "secondary", "tertiary", "error"] as const).map((color) => (
            <IconButton
              key={color}
              aria-label={`${variant} ${color}`}
              variant={variant}
              color={color}
            >
              <IconFavoriteFilled />
            </IconButton>
          ))}
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: { story: "All variant × color combinations (4 × 4 = 16 buttons)." },
    },
  },
};

// ─── Sizes ────────────────────────────────────────────────────────────────────

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      {(["xsmall", "small", "medium", "large", "xlarge"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <IconButton aria-label={size} variant="filled" size={size}>
            <IconSettings />
          </IconButton>
          <span className="text-label-small text-on-surface-variant">{size}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "M3 Expressive 5-tier sizes: xsmall (32dp), small (40dp), medium (56dp), large (96dp), xlarge (136dp).",
      },
    },
  },
};

// ─── Widths ───────────────────────────────────────────────────────────────────

export const Widths: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["xsmall", "small", "medium", "large"] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="text-label-small text-on-surface-variant w-14">{size}</span>
          {(["narrow", "default", "wide"] as const).map((width) => (
            <div key={width} className="flex flex-col items-center gap-1">
              <IconButton aria-label={`${size} ${width}`} variant="tonal" size={size} width={width}>
                <IconAdd />
              </IconButton>
              <span className="text-label-small text-on-surface-variant">{width}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Width variants adjust container width: narrow (slimmer), default (square), wide (wider than height).",
      },
    },
  },
};

// ─── Shapes ───────────────────────────────────────────────────────────────────

export const Shapes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["filled", "tonal", "outlined"] as const).map((variant) => (
        <div key={variant} className="flex items-center gap-4">
          <span className="text-label-small text-on-surface-variant w-16">{variant}</span>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <IconButton aria-label={`${variant} round`} variant={variant} shape="round">
                <IconSettings />
              </IconButton>
              <span className="text-label-small text-on-surface-variant">round</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <IconButton aria-label={`${variant} square`} variant={variant} shape="square">
                <IconSettings />
              </IconButton>
              <span className="text-label-small text-on-surface-variant">square</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Shape variants: `round` = circular; `square` = size-tiered corner radius (12/16/28dp per size).",
      },
    },
  },
};

// ─── Press Shape Morph ────────────────────────────────────────────────────────

export const ShapeMorphDemo: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-4">
      <p className="text-body-medium text-on-surface-variant">
        Press and hold each button to see the shape morph.
      </p>
      <div className="flex items-end gap-4">
        {(["xsmall", "small", "medium", "large"] as const).map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <IconButton aria-label={`${size} morph`} variant="filled" size={size} shape="round">
              <IconAdd />
            </IconButton>
            <span className="text-label-small text-on-surface-variant">{size}</span>
          </div>
        ))}
      </div>
      <p className="text-body-small text-on-surface-variant max-w-xs text-center">
        Round shape springs into square corners (MD3 Expressive press morph). Square shape has no
        morph.
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "M3 Expressive press shape-morph: the circular container morphs to the size-tiered square corner radius on press, then springs back. Driven by CSS `data-[pressed]:rounded-[var(--ib-radius-press)]` and expressive-fast-spatial easing.",
      },
    },
  },
};

// ─── Toggle ───────────────────────────────────────────────────────────────────

const ToggleVariant = ({
  variant,
}: {
  variant: "standard" | "filled" | "tonal" | "outlined";
}): React.ReactElement => {
  const [sel, setSel] = React.useState(false);
  return (
    <div className="flex flex-col items-center gap-2">
      <IconButton
        aria-label={sel ? "Remove favorite" : "Add favorite"}
        variant={variant}
        selected={sel}
        onPress={() => setSel(!sel)}
        selectedIcon={<IconFavoriteFilled />}
      >
        <IconFavoriteOutline />
      </IconButton>
      <span className="text-label-small text-on-surface-variant">{variant}</span>
    </div>
  );
};

const ToggleExample = (): React.ReactElement => {
  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-end gap-4">
        <ToggleVariant variant="standard" />
        <ToggleVariant variant="filled" />
        <ToggleVariant variant="tonal" />
        <ToggleVariant variant="outlined" />
      </div>
      <div className="flex flex-col items-center gap-2">
        <IconButton
          aria-label={isFavorite ? "Remove favorite" : "Add favorite"}
          variant="filled"
          size="large"
          selected={isFavorite}
          onPress={() => setIsFavorite(!isFavorite)}
          selectedIcon={<IconFavoriteFilled />}
        >
          <IconFavoriteOutline />
        </IconButton>
        <span className="text-body-medium text-on-surface-variant">
          {isFavorite ? "Favorited" : "Not favorited"}
        </span>
      </div>
    </div>
  );
};

export const Toggle: Story = {
  render: () => <ToggleExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Toggle behaviour is activated by passing the `selected` prop (even as `false`). Provide `selectedIcon` to swap the icon on selection. `aria-pressed` is set automatically.",
      },
    },
  },
};

// ─── States ───────────────────────────────────────────────────────────────────

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {/* Enabled */}
      <div>
        <p className="text-label-medium text-on-surface-variant mb-3">Enabled</p>
        <div className="flex items-center gap-3">
          {(["standard", "filled", "tonal", "outlined"] as const).map((v) => (
            <IconButton key={v} aria-label={v} variant={v}>
              <IconDelete />
            </IconButton>
          ))}
        </div>
      </div>

      {/* Disabled */}
      <div>
        <p className="text-label-medium text-on-surface-variant mb-3">Disabled</p>
        <div className="flex items-center gap-3">
          {(["standard", "filled", "tonal", "outlined"] as const).map((v) => (
            <IconButton key={v} aria-label={v} variant={v} isDisabled>
              <IconDelete />
            </IconButton>
          ))}
        </div>
      </div>

      {/* Selected */}
      <div>
        <p className="text-label-medium text-on-surface-variant mb-3">Selected (toggle ON)</p>
        <div className="flex items-center gap-3">
          {(["standard", "filled", "tonal", "outlined"] as const).map((v) => (
            <IconButton
              key={v}
              aria-label={v}
              variant={v}
              selected
              selectedIcon={<IconFavoriteFilled />}
            >
              <IconFavoriteOutline />
            </IconButton>
          ))}
        </div>
      </div>

      {/* Toggle unselected */}
      <div>
        <p className="text-label-medium text-on-surface-variant mb-3">
          Toggle unselected (filled/tonal toggle-off uses surface-container-highest)
        </p>
        <div className="flex items-center gap-3">
          {(["standard", "filled", "tonal", "outlined"] as const).map((v) => (
            <IconButton
              key={v}
              aria-label={v}
              variant={v}
              selected={false}
              selectedIcon={<IconFavoriteFilled />}
            >
              <IconFavoriteOutline />
            </IconButton>
          ))}
        </div>
      </div>

      {/* Disabled + selected */}
      <div>
        <p className="text-label-medium text-on-surface-variant mb-3">Disabled + selected</p>
        <div className="flex items-center gap-3">
          {(["standard", "filled", "tonal", "outlined"] as const).map((v) => (
            <IconButton
              key={v}
              aria-label={v}
              variant={v}
              selected
              isDisabled
              selectedIcon={<IconFavoriteFilled />}
            >
              <IconFavoriteOutline />
            </IconButton>
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All interaction states: enabled, disabled, selected (toggle ON), toggle unselected, disabled+selected.",
      },
    },
  },
};

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    "aria-label": "Icon button",
    children: <IconFavoriteFilled />,
    variant: "filled",
    color: "primary",
    size: "medium",
    width: "default",
    shape: "round",
    isDisabled: false,
    disableRipple: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Explore all props interactively via the Controls panel.",
      },
    },
  },
};

// ─── Interactive ──────────────────────────────────────────────────────────────

const CounterExample = (): React.ReactElement => {
  const [count, setCount] = React.useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-headline-small text-on-surface">Clicks: {count}</p>
      <div className="flex gap-2">
        <IconButton
          aria-label="Add one"
          variant="filled"
          color="primary"
          onPress={() => setCount((c) => c + 1)}
        >
          <IconAdd />
        </IconButton>
        <IconButton
          aria-label="Reset"
          variant="outlined"
          color="error"
          onPress={() => setCount(0)}
          isDisabled={count === 0}
        >
          <IconClose />
        </IconButton>
      </div>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <CounterExample />,
};
