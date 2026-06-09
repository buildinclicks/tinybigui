import { useState } from "react";
import type { ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";
import { CardMedia } from "./CardMedia";
import { CardHeader } from "./CardHeader";
import { CardContent } from "./CardContent";
import { CardActions } from "./CardActions";
import { Button } from "../Button";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Material Design 3 Card component with three variants (elevated, filled, outlined), interactive and non-interactive modes, ripple feedback, and full slot composition support. [MD3 spec](https://m3.material.io/components/cards/overview)",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["elevated", "filled", "outlined"],
      description: "Visual variant of the card",
    },
    isDisabled: {
      control: "boolean",
      description: "Disables the interactive card — ignored for static cards",
    },
    isDraggable: {
      control: "boolean",
      description: "Enables MD3 dragged elevation state via mouse events",
    },
    "aria-label": {
      control: "text",
      description: "Accessible label — required when the card has no visible headline",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    variant: "elevated",
    className: "w-72",
    "aria-label": "Default card",
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader headline="Card title" subheader="Supporting text" />
      <CardContent>
        <p className="text-on-surface-variant text-body-medium">
          Use the controls panel to explore all available props.
        </p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Default elevated card with `CardHeader` and `CardContent`. All props are wired to the controls panel for interactive exploration.",
      },
    },
  },
};

// ─── Variants ─────────────────────────────────────────────────────────────────

export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" className="w-72">
      <CardHeader headline="Elevated card" subheader="Drop shadow at 1dp elevation" />
      <CardContent>
        <p className="text-on-surface-variant text-body-medium">
          Uses `surface-container-low` background with elevation shadow for separation from the page
          surface.
        </p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Elevated variant — `surface-container-low` background with a 1dp drop shadow. The shadow lifts to 2dp on hover when interactive.",
      },
    },
  },
};

export const Filled: Story = {
  render: () => (
    <Card variant="filled" className="w-72">
      <CardHeader headline="Filled card" subheader="Subtle container fill" />
      <CardContent>
        <p className="text-on-surface-variant text-body-medium">
          Uses `surface-container-highest` background with no elevation. Lower visual hierarchy than
          elevated or outlined.
        </p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Filled variant — `surface-container-highest` background, no elevation shadow. Lower emphasis in the MD3 hierarchy.",
      },
    },
  },
};

export const Outlined: Story = {
  render: () => (
    <Card variant="outlined" className="w-72">
      <CardHeader headline="Outlined card" subheader="Border boundary" />
      <CardContent>
        <p className="text-on-surface-variant text-body-medium">
          Uses `surface` background with an `outline-variant` border. Greater emphasis than filled,
          no shadow.
        </p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Outlined variant — `surface` background with a 1px `outline-variant` border. No elevation shadow.",
      },
    },
  },
};

// ─── AllVariants ──────────────────────────────────────────────────────────────

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-row items-start gap-6">
      {(["elevated", "filled", "outlined"] as const).map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <Card variant={variant} className="w-60">
            <CardHeader headline="Card title" subheader="Supporting text" />
            <CardContent>
              <p className="text-on-surface-variant text-body-medium">Card body content.</p>
            </CardContent>
          </Card>
          <span className="text-on-surface-variant text-label-medium capitalize">{variant}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Side-by-side showcase of all three MD3 card variants — elevated, filled, and outlined — with identical content for easy visual comparison.",
      },
    },
  },
};

// ─── Interactive ──────────────────────────────────────────────────────────────

const InteractiveCounter = (): ReactElement => {
  const [count, setCount] = useState(0);
  return (
    <div className="flex flex-col items-center gap-4">
      <Card
        variant="elevated"
        className="w-72"
        onPress={() => setCount((c) => c + 1)}
        aria-label="Clickable card — increment counter"
      >
        <CardHeader headline="Interactive card" subheader="Click anywhere to increment" />
        <CardContent>
          <p className="text-on-surface text-display-small py-4 text-center">{count}</p>
          <p className="text-on-surface-variant text-body-small pb-2 text-center">
            press events fired
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveCounter />,
  parameters: {
    docs: {
      description: {
        story:
          "Interactive elevated card with an `onPress` handler. Hover to see the state layer, click to trigger the ripple and increment the counter. Tab to the card and press Space/Enter to activate via keyboard.",
      },
    },
  },
};

// ─── InteractiveWithRipple ────────────────────────────────────────────────────

export const InteractiveWithRipple: Story = {
  render: () => (
    <Card
      variant="elevated"
      className="w-72"
      onPress={() => console.log("Card pressed — ripple fired")}
      aria-label="Card with ripple"
    >
      <CardHeader headline="Ripple demo" subheader="Click to see ripple effect" />
      <CardContent>
        <p className="text-on-surface-variant text-body-medium">
          Each click spawns an MD3 ripple from the exact touch point. Check the browser console for
          the press callback log.
        </p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Interactive card demonstrating the MD3 ripple effect. Click anywhere on the card to see the ripple emanate from the press point. The `onPress` callback logs to the browser console.",
      },
    },
  },
};

// ─── NonInteractive ───────────────────────────────────────────────────────────

export const NonInteractive: Story = {
  render: () => (
    <Card variant="outlined" className="w-72">
      <CardHeader headline="Non-interactive card" subheader='role="article"' />
      <CardContent>
        <p className="text-on-surface-variant text-body-medium">
          No `onPress` or `href` provided — this card renders as a semantic{" "}
          <code className="text-label-small bg-surface-container rounded px-1">article</code>{" "}
          element. No hover state layer, no focus ring, no ripple.
        </p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Static card that renders with `role="article"`. Without `onPress` or `href`, no interactive behaviour (state layer, ripple, focus ring) is applied.',
      },
    },
  },
};

// ─── WithMedia ────────────────────────────────────────────────────────────────

export const WithMedia: Story = {
  render: () => (
    <Card variant="elevated" className="w-72">
      <CardMedia
        src="https://picsum.photos/seed/card/400/200"
        alt="Scenic landscape placeholder image"
        aspectRatio="16/9"
      />
      <CardHeader headline="Media card" subheader="16 / 9 image slot" />
      <CardContent>
        <p className="text-on-surface-variant text-body-medium">
          Full card composition: CardMedia → CardHeader → CardContent → CardActions.
        </p>
      </CardContent>
      <CardActions>
        <Button variant="text" onPress={() => undefined}>
          Share
        </Button>
        <Button variant="text" onPress={() => undefined}>
          Explore
        </Button>
      </CardActions>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Full composition — `CardMedia` + `CardHeader` + `CardContent` + `CardActions`. The image uses a real placeholder URL from picsum.photos. `pt-0` on `CardHeader` removes the duplicate top padding after the media slot per MD3 adjacent-slot spacing.",
      },
    },
  },
};

// ─── WithHeaderOnly ───────────────────────────────────────────────────────────

export const WithHeaderOnly: Story = {
  render: () => (
    <Card variant="filled" className="w-72">
      <CardHeader headline="Header only card" subheader="Minimal content slot" />
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Card with only a `CardHeader` — demonstrates the minimal valid composition when no body content or actions are needed.",
      },
    },
  },
};

// ─── WithActionsOnly ──────────────────────────────────────────────────────────

export const WithActionsOnly: Story = {
  render: () => (
    <Card variant="outlined" className="w-72">
      <CardContent>
        <p className="text-on-surface-variant text-body-medium">
          This card leads with body text and provides actions without a headline.
        </p>
      </CardContent>
      <CardActions>
        <Button variant="outlined" onPress={() => undefined}>
          Decline
        </Button>
        <Button variant="filled" onPress={() => undefined}>
          Accept
        </Button>
      </CardActions>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Card using `CardContent` + `CardActions` without a `CardHeader`. Demonstrates that the headline slot is optional.",
      },
    },
  },
};

// ─── SlotCompositions ─────────────────────────────────────────────────────────

export const SlotCompositions: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-6">
      {/* Media only */}
      <div className="flex flex-col gap-1">
        <Card variant="elevated" className="w-60">
          <CardMedia
            src="https://picsum.photos/seed/media-only/400/200"
            alt="Media-only card placeholder"
            aspectRatio="16/9"
          />
        </Card>
        <span className="text-on-surface-variant text-label-small">Media only</span>
      </div>

      {/* Header + Content */}
      <div className="flex flex-col gap-1">
        <Card variant="filled" className="w-60">
          <CardHeader headline="Header" subheader="Subheader" />
          <CardContent>
            <p className="text-on-surface-variant text-body-small">Body content.</p>
          </CardContent>
        </Card>
        <span className="text-on-surface-variant text-label-small">Header + Content</span>
      </div>

      {/* Header + Actions */}
      <div className="flex flex-col gap-1">
        <Card variant="outlined" className="w-60">
          <CardHeader headline="Action card" />
          <CardActions>
            <Button variant="text" onPress={() => undefined}>
              Cancel
            </Button>
            <Button variant="text" onPress={() => undefined}>
              OK
            </Button>
          </CardActions>
        </Card>
        <span className="text-on-surface-variant text-label-small">Header + Actions</span>
      </div>

      {/* Full composition */}
      <div className="flex flex-col gap-1">
        <Card variant="elevated" className="w-60">
          <CardMedia
            src="https://picsum.photos/seed/full/400/200"
            alt="Full composition placeholder"
            aspectRatio="16/9"
          />
          <CardHeader headline="Full card" subheader="All slots" />
          <CardContent>
            <p className="text-on-surface-variant text-body-small">Body text.</p>
          </CardContent>
          <CardActions>
            <Button variant="text" onPress={() => undefined}>
              Action
            </Button>
          </CardActions>
        </Card>
        <span className="text-on-surface-variant text-label-small">Full composition</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Four-panel grid showing different valid slot combinations: media-only, header+content, header+actions, and the full media+header+content+actions composition.",
      },
    },
  },
};

// ─── DisabledInteractive ──────────────────────────────────────────────────────

export const DisabledInteractive: Story = {
  render: () => (
    <Card
      variant="elevated"
      className="w-72"
      isDisabled
      onPress={() => console.log("This should not fire")}
      aria-label="Disabled interactive card"
    >
      <CardHeader headline="Disabled card" subheader="isDisabled=true" />
      <CardContent>
        <p className="text-on-surface-variant text-body-medium">
          `isDisabled` reduces the card opacity and suppresses all interaction: press, hover state
          layer, and ripple are inactive.
        </p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Interactive card with `isDisabled={true}`. Opacity is reduced per MD3 disabled-state spec and all press/hover/ripple interactions are suppressed.",
      },
    },
  },
};

// ─── FocusRingDemo ────────────────────────────────────────────────────────────

export const FocusRingDemo: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-6">
      <p className="text-on-surface-variant text-body-medium max-w-xs text-center">
        Tab to the card below and press{" "}
        <kbd className="bg-surface-container text-label-small rounded px-1.5 py-0.5 font-mono">
          Space
        </kbd>{" "}
        or{" "}
        <kbd className="bg-surface-container text-label-small rounded px-1.5 py-0.5 font-mono">
          Enter
        </kbd>{" "}
        to activate.
      </p>
      <Card
        variant="elevated"
        className="w-72"
        onPress={() => console.log("Activated via keyboard")}
        aria-label="Focus ring demo card"
      >
        <CardHeader headline="Focus ring demo" subheader="Keyboard-accessible card" />
        <CardContent>
          <p className="text-on-surface-variant text-body-medium">
            A visible focus ring appears around this card when focused via keyboard navigation per
            WCAG 2.1 AA.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the MD3 focus ring on keyboard navigation. Tab to the card and use Space or Enter to activate — the focus indicator is visible only during keyboard focus, not on mouse click (`:focus-visible` behaviour).",
      },
    },
  },
};

// ─── DraggedState ─────────────────────────────────────────────────────────────

export const DraggedState: Story = {
  render: () => (
    <Card
      variant="elevated"
      className="w-72"
      isDraggable
      onPress={() => undefined}
      aria-label="Draggable card"
    >
      <CardHeader headline="Draggable card" subheader="isDraggable=true" />
      <CardContent>
        <p className="text-on-surface-variant text-body-medium">
          Click and hold to trigger the MD3 dragged state. While held, the elevated variant jumps to
          4dp elevation via a decelerate transition curve per MD3 motion spec.
        </p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Card with `isDraggable={true}`. Click and hold to see the elevated variant increase to 4dp elevation (MD3 dragged state). The elevation returns to resting state on mouse-up or mouse-leave.",
      },
    },
  },
};

// ─── States ───────────────────────────────────────────────────────────────────

/**
 * Showcases all MD3 card interaction states side-by-side.
 * Hover/focus/dragged states are demonstrated inline via Storybook controls
 * since CSS-driven states require user interaction in a live browser.
 */
export const States: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-6">
      {/* Default (resting) */}
      <div className="flex flex-col gap-1">
        <span className="text-on-surface-variant text-label-small">Resting (elevated)</span>
        <Card variant="elevated" className="w-72">
          <CardHeader headline="Resting state" subheader="No interaction" />
          <CardContent>
            <p className="text-on-surface-variant text-body-medium">
              1dp elevation, no state layer.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Interactive (hover to see state layer + elevation 2dp) */}
      <div className="flex flex-col gap-1">
        <span className="text-on-surface-variant text-label-small">
          Interactive — hover / focus / press
        </span>
        <Card
          variant="elevated"
          className="w-72"
          onPress={() => undefined}
          aria-label="Interactive card — hover to see state layer"
        >
          <CardHeader headline="Interactive card" subheader="Hover · Focus · Press" />
          <CardContent>
            <p className="text-on-surface-variant text-body-medium">
              Hover → 8% on-surface overlay + 2dp elevation. Focus (keyboard) → 10% + focus ring.
              Press → 10% + 1dp.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Draggable */}
      <div className="flex flex-col gap-1">
        <span className="text-on-surface-variant text-label-small">Dragged — click and hold</span>
        <Card
          variant="elevated"
          className="w-72"
          isDraggable
          onPress={() => undefined}
          aria-label="Draggable card"
        >
          <CardHeader headline="Dragged state" subheader="isDraggable — click &amp; hold" />
          <CardContent>
            <p className="text-on-surface-variant text-body-medium">
              Hold mousedown → 16% state-layer opacity + 4dp elevation.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Disabled */}
      <div className="flex flex-col gap-1">
        <span className="text-on-surface-variant text-label-small">Disabled</span>
        <Card
          variant="elevated"
          className="w-72"
          isDisabled
          onPress={() => undefined}
          aria-label="Disabled card"
        >
          <CardHeader headline="Disabled state" subheader="isDisabled=true" />
          <CardContent>
            <p className="text-on-surface-variant text-body-medium">
              38% opacity on the container — no shadow, no hover, no ripple.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* All three variants interactive */}
      <div className="flex flex-col gap-1">
        <span className="text-on-surface-variant text-label-small">All variants — interactive</span>
        <div className="flex flex-row gap-4">
          {(["elevated", "filled", "outlined"] as const).map((variant) => (
            <Card
              key={variant}
              variant={variant}
              className="w-48"
              onPress={() => undefined}
              aria-label={`${variant} interactive card`}
            >
              <CardHeader headline={variant} subheader="hover me" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "MD3 card interaction states: resting, interactive (hover/focus/press), dragged, and disabled across all three variants. Motion uses the Standard **default** tier (200ms effects spring) per the MD3 size-tier rule for standard-size components.",
      },
    },
  },
};

// ─── WithMedia43 ──────────────────────────────────────────────────────────────

export const WithMedia43: Story = {
  render: () => (
    <div className="flex flex-row items-start gap-6">
      <div className="flex flex-col gap-1">
        <Card variant="elevated" className="w-72">
          <CardMedia
            src="https://picsum.photos/seed/ratio43/400/300"
            alt="4:3 landscape placeholder"
            aspectRatio="4/3"
          />
          <CardHeader headline="4 : 3 media" subheader='aspectRatio="4/3"' />
          <CardContent>
            <p className="text-on-surface-variant text-body-medium">
              Correct 4:3 ratio — previously rendered at 16:9 (bug fix).
            </p>
          </CardContent>
        </Card>
        <span className="text-on-surface-variant text-label-small">4 / 3</span>
      </div>

      <div className="flex flex-col gap-1">
        <Card variant="elevated" className="w-72">
          <CardMedia
            src="https://picsum.photos/seed/ratio169/400/225"
            alt="16:9 landscape placeholder"
            aspectRatio="16/9"
          />
          <CardHeader headline="16 : 9 media" subheader='aspectRatio="16/9"' />
          <CardContent>
            <p className="text-on-surface-variant text-body-medium">
              Standard 16:9 widescreen ratio — unchanged reference.
            </p>
          </CardContent>
        </Card>
        <span className="text-on-surface-variant text-label-small">16 / 9</span>
      </div>

      <div className="flex flex-col gap-1">
        <Card variant="elevated" className="w-72">
          <CardMedia
            src="https://picsum.photos/seed/ratio11/300/300"
            alt="1:1 square placeholder"
            aspectRatio="1/1"
          />
          <CardHeader headline="1 : 1 media" subheader='aspectRatio="1/1"' />
          <CardContent>
            <p className="text-on-surface-variant text-body-medium">Square aspect ratio.</p>
          </CardContent>
        </Card>
        <span className="text-on-surface-variant text-label-small">1 / 1</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Side-by-side comparison of all supported `CardMedia` aspect ratios: **4/3** (bug-fixed — was previously rendering as 16:9), **16/9**, and **1/1**.",
      },
    },
  },
};

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    variant: "elevated",
    isDisabled: false,
    isDraggable: false,
    className: "w-72",
    "aria-label": "Playground card",
  },
  render: (args) => (
    <Card {...args} onPress={() => console.log("Playground card pressed")}>
      <CardMedia
        src="https://picsum.photos/seed/playground/400/200"
        alt="Playground card placeholder image"
        aspectRatio="16/9"
      />
      <CardHeader headline="Playground card" subheader="Try all props" />
      <CardContent>
        <p className="text-on-surface-variant text-body-medium">
          Use the controls panel to experiment with every available prop.
        </p>
      </CardContent>
      <CardActions>
        <Button variant="text" onPress={() => undefined}>
          Cancel
        </Button>
        <Button variant="filled" onPress={() => undefined}>
          Confirm
        </Button>
      </CardActions>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Full-featured playground story with all props wired to controls. The card is interactive (`onPress` is always set) so you can test disabled and draggable states alongside variant switching.",
      },
    },
  },
};
