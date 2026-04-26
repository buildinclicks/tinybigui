import { within, userEvent, expect } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/react";
import { type JSX } from "react";
import { Button } from "../Button";
import { Snackbar } from "./Snackbar";
import { SnackbarProvider, useSnackbar } from "./SnackbarProvider";
import type { SnackbarPosition } from "./Snackbar.types";

/**
 * Material Design 3 Snackbar Component
 *
 * Snackbars provide brief messages about app processes at the bottom of the
 * screen. They appear temporarily and don't require user input to disappear.
 *
 * ## Usage
 *
 * Wrap your application with `SnackbarProvider`, then trigger snackbars from
 * any descendant component using the `useSnackbar` hook:
 *
 * ```tsx
 * <SnackbarProvider>
 *   <App />
 * </SnackbarProvider>
 *
 * // Inside any descendant:
 * const { showSnackbar } = useSnackbar();
 * showSnackbar({ message: "File deleted", action: { label: "Undo", onAction: handleUndo } });
 * ```
 *
 * ## Content Configurations
 *
 * - **Single-line** — message text only
 * - **Two-line** — message + supporting text
 * - **With action** — single text button (Undo / View / etc.)
 * - **With close icon** — explicit dismiss button for persistent messages
 *
 * ## MD3 Specifications
 *
 * - Surface: `inverse-surface` with `inverse-on-surface` text
 * - Shape: extra-small corner (4dp) → `rounded-xs`
 * - Elevation: level 3 → `shadow-elevation-3`
 * - Width: 288dp min, 568dp max, centered `bottom-4` by default
 * - Auto-dismiss: 4000ms default, pauses on hover and focus
 * - Motion: entry slide 200ms / exit fade 100ms
 */
const meta: Meta<typeof Snackbar> = {
  title: "Components/Snackbar",
  component: Snackbar,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <SnackbarProvider>
        <Story />
      </SnackbarProvider>
    ),
  ],
  argTypes: {
    message: {
      control: "text",
      description: "Primary message text",
    },
    supportingText: {
      control: "text",
      description: "Optional second line of text (two-line configuration)",
    },
    duration: {
      control: { type: "number", min: 0, step: 500 },
      description: "Auto-dismiss duration in ms. Set to 0 to disable.",
    },
    severity: {
      control: "radio",
      options: ["default", "error"],
      description: "Controls ARIA live region — polite (default) or assertive (error)",
    },
    position: {
      control: "select",
      options: [
        "bottom-center",
        "bottom-left",
        "bottom-right",
        "top-center",
        "top-left",
        "top-right",
      ] satisfies SnackbarPosition[],
      description: "Screen position of the Snackbar",
    },
    showClose: {
      control: "boolean",
      description: "Show a close icon button",
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Brief, temporary messages rendered at the bottom of the viewport. Supports auto-dismiss with hover/focus pause, sequential queue, and an imperative API via useSnackbar().",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Snackbar>;

// ─── Default ──────────────────────────────────────────────────────────────────

/**
 * The default Snackbar — a single trigger button launches a snackbar with a
 * message and an Undo action, inspired by the Google Keep demo on m3.material.io.
 *
 * Click "Open Snackbar" to see the component in action.
 */
const DefaultDemo = (): JSX.Element => {
  const { showSnackbar } = useSnackbar();
  return (
    <div className="flex items-center justify-center p-8">
      <Button
        variant="filled"
        onPress={() =>
          showSnackbar({
            message: "Note archived",
            action: { label: "Undo", onAction: () => undefined },
          })
        }
      >
        Open Snackbar
      </Button>
    </div>
  );
};

export const Default: Story = {
  render: () => <DefaultDemo />,
};

// ─── Position ─────────────────────────────────────────────────────────────────

/**
 * Use the `position` prop to control where the Snackbar appears on screen.
 * All six positions are demonstrated — click any button to see the Snackbar
 * appear at that corner or edge.
 *
 * MD3 recommends `bottom-center` as the default position.
 */
const PositionDemo = (): JSX.Element => {
  const { showSnackbar } = useSnackbar();

  const positions: SnackbarPosition[] = [
    "top-left",
    "top-center",
    "top-right",
    "bottom-left",
    "bottom-center",
    "bottom-right",
  ];

  const labels: Record<SnackbarPosition, string> = {
    "top-left": "Top-Left",
    "top-center": "Top-Center",
    "top-right": "Top-Right",
    "bottom-left": "Bottom-Left",
    "bottom-center": "Bottom-Center",
    "bottom-right": "Bottom-Right",
  };

  return (
    <div className="grid grid-cols-3 gap-3 p-8">
      {positions.map((pos) => (
        <Button
          key={pos}
          variant="outlined"
          onPress={() =>
            showSnackbar({
              message: "I love snacks",
              position: pos,
              duration: 3000,
            })
          }
        >
          {labels[pos]}
        </Button>
      ))}
    </div>
  );
};

export const Position: Story = {
  render: () => <PositionDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Click any position button to see the Snackbar appear at that corner. The default is `bottom-center` per MD3 spec.",
      },
    },
  },
};

// ─── Content Variations (Variants) ───────────────────────────────────────────

/**
 * All four MD3 content configurations, each triggered by a dedicated button.
 *
 * - **Single-line** — message text only (simplest form)
 * - **Two-line** — message + supporting text for longer context
 * - **With Action** — single text action button (e.g. Undo)
 * - **With Close** — explicit close icon button for persistent messages
 * - **Action + Close** — all interactive elements combined
 */
const ContentVariationsDemo = (): JSX.Element => {
  const { showSnackbar } = useSnackbar();
  return (
    <div className="flex flex-wrap justify-center gap-3 p-8">
      <Button
        variant="filled"
        onPress={() =>
          showSnackbar({
            message: "File deleted",
            duration: 4000,
          })
        }
      >
        Single-line
      </Button>
      <Button
        variant="tonal"
        onPress={() =>
          showSnackbar({
            message: "Connection lost",
            supportingText: "Please check your network and try again",
            duration: 4000,
          })
        }
      >
        Two-line
      </Button>
      <Button
        variant="outlined"
        onPress={() =>
          showSnackbar({
            message: "Photo archived",
            action: { label: "Undo", onAction: () => undefined },
            duration: 4000,
          })
        }
      >
        With Action
      </Button>
      <Button
        variant="elevated"
        onPress={() =>
          showSnackbar({
            message: "Message sent",
            showClose: true,
            duration: 0,
          })
        }
      >
        With Close
      </Button>
      <Button
        variant="text"
        onPress={() =>
          showSnackbar({
            message: "Changes saved",
            action: { label: "View", onAction: () => undefined },
            showClose: true,
            duration: 0,
          })
        }
      >
        Action + Close
      </Button>
    </div>
  );
};

export const ContentVariations: Story = {
  render: () => <ContentVariationsDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates all four MD3 content configurations. Each button triggers the corresponding layout. Close-icon variants use `duration: 0` (persistent) since they have an explicit dismiss control.",
      },
    },
  },
};

// ─── Auto Dismiss ─────────────────────────────────────────────────────────────

/**
 * The `duration` prop controls how long the Snackbar stays visible before
 * automatically dismissing. The timer pauses when you hover over or focus
 * inside the Snackbar, and resumes when you move away.
 *
 * MD3 recommends providing at least 4 seconds for users to read the message.
 */
const AutoDismissDemo = (): JSX.Element => {
  const { showSnackbar } = useSnackbar();
  return (
    <div className="flex items-center justify-center p-8">
      <Button
        variant="filled"
        onPress={() =>
          showSnackbar({
            message: "This Snackbar will be dismissed in 5 seconds.",
            duration: 5000,
          })
        }
      >
        Open Snackbar
      </Button>
    </div>
  );
};

export const AutoDismiss: Story = {
  render: () => <AutoDismissDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Triggers a Snackbar that auto-dismisses after 5 seconds. Hover or focus the Snackbar to pause the timer. Set `duration: 0` to disable auto-dismiss entirely.",
      },
    },
  },
};

// ─── Accessibility ────────────────────────────────────────────────────────────

/**
 * The `severity` prop controls the ARIA live region role:
 *
 * - `severity="default"` → `role="status" aria-live="polite"` — announced
 *   at the next available opportunity (non-urgent, informational)
 * - `severity="error"` → `role="alert" aria-live="assertive"` — announced
 *   immediately, interrupting any in-progress speech (urgent errors)
 *
 * Screen readers will announce the error Snackbar as soon as it appears.
 */
const AccessibilityDemo = (): JSX.Element => {
  const { showSnackbar } = useSnackbar();
  return (
    <div className="flex flex-wrap justify-center gap-4 p-8">
      <Button
        variant="filled"
        onPress={() =>
          showSnackbar({
            message: "File saved successfully.",
            severity: "default",
            duration: 4000,
          })
        }
      >
        Polite (default)
      </Button>
      <Button
        variant="filled"
        color="error"
        onPress={() =>
          showSnackbar({
            message: "Upload failed. Please try again.",
            severity: "error",
            showClose: true,
            duration: 0,
          })
        }
      >
        Assertive (error)
      </Button>
    </div>
  );
};

export const Accessibility: Story = {
  render: () => <AccessibilityDemo />,
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates both ARIA live region modes. "Polite" is for informational updates; "Assertive" interrupts the screen reader immediately for critical errors. The error Snackbar uses `duration: 0` and `showClose` since users may need more time to process an error.',
      },
    },
  },
};

// ─── Consecutive Snackbars ────────────────────────────────────────────────────

/**
 * Multiple `showSnackbar` calls are queued and displayed one at a time —
 * they are never stacked. Click the buttons in rapid succession to build up
 * a queue and watch them animate sequentially.
 *
 * This matches the MD3 spec that Snackbars should appear one at a time.
 */
const ConsecutiveSnackbarsDemo = (): JSX.Element => {
  const { showSnackbar } = useSnackbar();
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <p className="text-body-medium text-on-surface-variant">
        Click the buttons quickly to queue multiple Snackbars.
      </p>
      <div className="flex gap-3">
        <Button
          variant="filled"
          onPress={() =>
            showSnackbar({
              message: "Message A",
              action: { label: "Undo", onAction: () => undefined },
              duration: 3000,
            })
          }
        >
          Show message A
        </Button>
        <Button
          variant="tonal"
          onPress={() =>
            showSnackbar({
              message: "Message B",
              duration: 3000,
            })
          }
        >
          Show message B
        </Button>
      </div>
    </div>
  );
};

export const ConsecutiveSnackbars: Story = {
  render: () => <ConsecutiveSnackbarsDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Multiple Snackbars are displayed sequentially, never stacked, per MD3 spec. Build up the queue by clicking both buttons before the first one dismisses.",
      },
    },
  },
};

// ─── Interactive (play function) ──────────────────────────────────────────────

/**
 * Automated interaction test — the play function clicks the trigger button,
 * waits for the Snackbar to appear, verifies it contains the expected message,
 * then clicks the Undo action.
 */
const InteractiveDemo = (): JSX.Element => {
  const { showSnackbar } = useSnackbar();
  return (
    <div className="flex items-center justify-center p-8">
      <Button
        variant="filled"
        onPress={() =>
          showSnackbar({
            message: "File deleted",
            action: { label: "Undo", onAction: () => undefined },
            duration: 0,
          })
        }
      >
        Open Snackbar
      </Button>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const trigger = canvas.getByRole("button", { name: /open snackbar/i });
    await userEvent.click(trigger);

    // The Snackbar renders into document.body via a portal, so we query the
    // full document rather than the canvas element.
    const snackbar = await within(document.body).findByRole("status");
    await expect(snackbar).toBeInTheDocument();
    await expect(snackbar).toHaveTextContent("File deleted");

    const undoButton = within(document.body).getByRole("button", { name: /undo/i });
    await userEvent.click(undoButton);
  },
  parameters: {
    docs: {
      description: {
        story:
          "Automated interaction test. The play function opens the Snackbar, verifies its content via ARIA role, then clicks the Undo action. The Snackbar renders in a portal so assertions target `document.body`.",
      },
    },
  },
};

// ─── Playground ───────────────────────────────────────────────────────────────

/**
 * Configure all Snackbar options using the Controls panel, then click
 * "Show Snackbar" to preview the result. Combine props freely to explore
 * all supported configurations.
 */
const PlaygroundDemo = ({
  message,
  supportingText,
  showClose,
  duration,
  severity,
  position,
}: {
  message?: string;
  supportingText?: string;
  showClose?: boolean;
  duration?: number;
  severity?: "default" | "error";
  position?: SnackbarPosition;
}): JSX.Element => {
  const { showSnackbar } = useSnackbar();
  return (
    <div className="flex items-center justify-center p-8">
      <Button
        variant="filled"
        onPress={() =>
          showSnackbar({
            message: message ?? "Changes saved",
            ...(supportingText ? { supportingText } : {}),
            showClose: showClose ?? false,
            duration: duration ?? 4000,
            severity: severity ?? "default",
            position: position ?? "bottom-center",
          })
        }
      >
        Show Snackbar
      </Button>
    </div>
  );
};

export const Playground: Story = {
  render: (args) => (
    <PlaygroundDemo
      message={args.message}
      supportingText={args.supportingText}
      showClose={args.showClose}
      duration={args.duration}
      severity={args.severity}
      position={args.position}
    />
  ),
  args: {
    message: "Changes saved",
    supportingText: "",
    showClose: false,
    duration: 4000,
    severity: "default",
    position: "bottom-center",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use the Controls panel to configure any combination of props, then click Show Snackbar to preview.",
      },
    },
  },
};
