"use client";

import { useState, type JSX } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { BottomSheet } from "./BottomSheet";
import { useBottomSheetContext } from "./BottomSheetHeadless";
import { Button } from "../Button/Button";
import { List } from "../List/List";
import { ListItem } from "../List/ListItem";

// ─── Inline snap indicator (reads from BottomSheetContext) ────────────────────

const SnapIndexIndicator = (): JSX.Element => {
  const { currentSnapIndex, snapPoints } = useBottomSheetContext();
  return (
    <p className="text-label-medium text-on-surface-variant px-4 pb-2">
      Snap:{" "}
      <span className="text-on-surface font-medium">
        {currentSnapIndex + 1} of {snapPoints.length}
      </span>
    </p>
  );
};

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof BottomSheet> = {
  title: "Components/BottomSheet",
  component: BottomSheet,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "MD3 Bottom Sheet — a surface that slides up from the bottom edge of the screen. Supports standard (co-exists with content) and modal (overlay with scrim) variants, draggable handle with snap points, and full keyboard accessibility.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["modal", "standard"],
      description:
        "Structural variant — modal overlays content with a scrim; standard co-exists with page content.",
    },
    open: {
      control: "boolean",
      description: "Controlled open state.",
    },
    "aria-label": {
      control: "text",
      description:
        "Accessible label for the sheet. Required for modal variant (used as dialog aria-label).",
    },
    snapPoints: {
      control: "object",
      description: "Snap points as CSS percentage strings (e.g. ['25%', '50%', '100%']).",
    },
  },
};

export default meta;
type Story = StoryObj<typeof BottomSheet>;

// ─── 1. ModalBottomSheet ──────────────────────────────────────────────────────

const ModalDemo = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-svh items-center justify-center p-8">
      <Button variant="filled" onPress={() => setOpen(true)}>
        Open sheet
      </Button>
      <BottomSheet
        variant="modal"
        open={open}
        onOpenChange={setOpen}
        snapPoints={["50%"]}
        aria-label="Share options"
      >
        <div className="px-4 pb-4">
          <h2 className="text-title-medium text-on-surface mb-2">Share</h2>
          <List>
            <ListItem headline="Copy link" />
            <ListItem headline="Share via Email" />
            <ListItem headline="Send in Messages" />
            <ListItem headline="Save to Drive" />
          </List>
        </div>
      </BottomSheet>
    </div>
  );
};

/**
 * Modal bottom sheet — overlays app content with a scrim backdrop.
 * Dismiss via the scrim, Escape key, or drag down.
 */
export const ModalBottomSheet: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Modal bottom sheet — overlays app content with a scrim backdrop. All other app functionality is disabled until the sheet is confirmed, dismissed, or a required action is taken. Click 'Open sheet' to activate, then dismiss via the scrim, Escape key, or drag down.",
      },
    },
  },
  render: () => <ModalDemo />,
};

// ─── 2. StandardBottomSheet ───────────────────────────────────────────────────

/**
 * Standard bottom sheet — co-exists with page content without blocking
 * the main screen. Open by default, collapse or expand via the drag handle.
 */
export const StandardBottomSheet: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Standard bottom sheet — co-exists with page content below without blocking the main screen. Shows as a persistent panel that the user can expand or collapse via the drag handle. No scrim overlay.",
      },
    },
  },
  render: () => (
    <div className="bg-surface relative min-h-svh p-8">
      <p className="text-body-medium text-on-surface-variant">
        Page content sits above the standard sheet. The sheet does not block interaction.
      </p>
      <BottomSheet
        variant="standard"
        defaultOpen
        snapPoints={["30%", "60%"]}
        aria-label="Now playing"
      >
        <div className="flex flex-col gap-3 px-4 pb-6">
          <div>
            <p className="text-title-medium text-on-surface">Midnight Drive</p>
            <p className="text-body-medium text-on-surface-variant">The Coastal Waves</p>
          </div>
          <div className="bg-on-surface-variant h-1 w-full rounded-full opacity-40" />
          <div className="flex items-center justify-center gap-4">
            <Button variant="text" aria-label="Previous track">
              ⏮
            </Button>
            <Button variant="filled" aria-label="Play or pause">
              ▶
            </Button>
            <Button variant="text" aria-label="Next track">
              ⏭
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  ),
};

// ─── 3. WithSnapPoints ────────────────────────────────────────────────────────

const FILTER_SNAP_POINTS = ["25%", "50%", "100%"];

const WithSnapPointsDemo = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-svh items-center justify-center p-8">
      <Button variant="filled" onPress={() => setOpen(true)}>
        Open filters
      </Button>
      <BottomSheet
        variant="modal"
        open={open}
        onOpenChange={setOpen}
        snapPoints={FILTER_SNAP_POINTS}
        aria-label="Filter options"
      >
        <SnapIndexIndicator />
        <div className="px-4 pb-4">
          <h2 className="text-title-medium text-on-surface mb-3">Filters</h2>
          <div className="flex flex-col gap-3">
            {["Price", "Rating", "Distance", "Category", "Availability"].map((label) => (
              <label key={label} className="flex cursor-pointer items-center gap-3">
                <input type="checkbox" className="accent-primary h-4 w-4" />
                <span className="text-body-large text-on-surface">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};

/**
 * Three snap points — drag the handle to any height or use the keyboard.
 * A live indicator shows the current snap position.
 */
export const WithSnapPoints: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Three snap points — drag the handle to any height or use the keyboard (Tab to focus handle, Space/Enter to cycle, Arrow keys to navigate). The sheet snaps to 25%, 50%, or 100% of the viewport height on release.",
      },
    },
  },
  render: () => <WithSnapPointsDemo />,
};

// ─── 4. SingleSnapPoint ───────────────────────────────────────────────────────

const SingleSnapPointDemo = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-svh items-center justify-center p-8">
      <Button variant="filled" onPress={() => setOpen(true)}>
        View details
      </Button>
      <BottomSheet
        variant="modal"
        open={open}
        onOpenChange={setOpen}
        snapPoints={["60%"]}
        aria-label="Details"
      >
        <div className="px-4 pb-6">
          <h2 className="text-title-large text-on-surface">Bluetooth Speaker Pro</h2>
          <p className="text-label-large text-primary mt-1">$129.99</p>
          <p className="text-body-medium text-on-surface-variant mt-3">
            The Bluetooth Speaker Pro delivers room-filling 360° sound with a 12-hour battery life.
            Water-resistant (IPX5), with multipoint Bluetooth pairing for seamless switching between
            two devices. Compact enough to fit in a backpack, powerful enough for outdoor
            gatherings.
          </p>
          <div className="mt-6 flex gap-3">
            <Button variant="filled" onPress={() => setOpen(false)}>
              Add to cart
            </Button>
            <Button variant="outlined" onPress={() => setOpen(false)}>
              Save
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};

/**
 * Fixed-height sheet with a single snap point at 60% viewport height.
 * Dragging down closes the sheet.
 */
export const SingleSnapPoint: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Fixed-height sheet with a single snap point at 60% viewport height. The drag handle is present for keyboard accessibility but the sheet will not resize — dragging down closes it.",
      },
    },
  },
  render: () => <SingleSnapPointDemo />,
};

// ─── 5. WithContent ───────────────────────────────────────────────────────────

const FILE_ITEMS = [
  { headline: "Q4 Report.pdf", supporting: "Modified 2 hours ago · 1.2 MB" },
  { headline: "Design Mockups.fig", supporting: "Modified yesterday · 8.4 MB" },
  { headline: "Meeting Notes.docx", supporting: "Modified 3 days ago · 24 KB" },
  { headline: "Budget Forecast.xlsx", supporting: "Modified last week · 512 KB" },
  { headline: "Brand Guidelines.pdf", supporting: "Modified 2 weeks ago · 5.1 MB" },
  { headline: "Sprint Retrospective.md", supporting: "Modified 2 weeks ago · 8 KB" },
  { headline: "Onboarding Flow.sketch", supporting: "Modified 3 weeks ago · 12 MB" },
  { headline: "API Reference.pdf", supporting: "Modified last month · 2.6 MB" },
  { headline: "User Research.pptx", supporting: "Modified last month · 18 MB" },
  { headline: "Architecture Diagram.svg", supporting: "Modified 2 months ago · 340 KB" },
];

const WithContentDemo = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-svh items-center justify-center p-8">
      <Button variant="filled" onPress={() => setOpen(true)}>
        Recent files
      </Button>
      <BottomSheet
        variant="modal"
        open={open}
        onOpenChange={setOpen}
        snapPoints={["40%", "75%"]}
        aria-label="Recent files"
      >
        <div className="px-4 pb-4">
          <h2 className="text-title-medium text-on-surface mb-2">Recent files</h2>
        </div>
        <div className="overflow-y-auto">
          <List>
            {FILE_ITEMS.map((item) => (
              <ListItem
                key={item.headline}
                headline={item.headline}
                supportingText={item.supporting}
              />
            ))}
          </List>
        </div>
      </BottomSheet>
    </div>
  );
};

/**
 * Sheet with a scrollable list of files — content area scrolls independently
 * when the sheet height is constrained.
 */
export const WithContent: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Bottom sheet with a scrollable list of items inside — demonstrates how the content area scrolls independently when the sheet height is constrained. Uses the List component for accessible list semantics.",
      },
    },
  },
  render: () => <WithContentDemo />,
};

// ─── 6. WithForm ──────────────────────────────────────────────────────────────

const WithFormDemo = (): JSX.Element => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setOpen(false);
  };

  return (
    <div className="flex min-h-svh items-center justify-center p-8">
      <Button variant="filled" onPress={() => setOpen(true)}>
        Add address
      </Button>
      <BottomSheet
        variant="modal"
        open={open}
        onOpenChange={setOpen}
        snapPoints={["70%"]}
        aria-label="Add new address"
      >
        <div className="px-4 pb-6">
          <h2 className="text-title-medium text-on-surface mb-4">Add new address</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-label-medium text-on-surface">Street address</span>
              <input
                type="text"
                placeholder="123 Main Street"
                className="border-outline text-body-medium text-on-surface bg-surface-container focus:border-primary rounded-md border px-3 py-2 outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-label-medium text-on-surface">City</span>
              <input
                type="text"
                placeholder="San Francisco"
                className="border-outline text-body-medium text-on-surface bg-surface-container focus:border-primary rounded-md border px-3 py-2 outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-label-medium text-on-surface">Postal code</span>
              <input
                type="text"
                placeholder="94105"
                className="border-outline text-body-medium text-on-surface bg-surface-container focus:border-primary rounded-md border px-3 py-2 outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-label-medium text-on-surface">Country</span>
              <input
                type="text"
                placeholder="United States"
                className="border-outline text-body-medium text-on-surface bg-surface-container focus:border-primary rounded-md border px-3 py-2 outline-none"
              />
            </label>
            <div className="mt-2 flex gap-3">
              <Button variant="filled" type="submit">
                Save address
              </Button>
              <Button variant="text" onPress={() => setOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </BottomSheet>
    </div>
  );
};

/**
 * Modal bottom sheet with a form — demonstrates FocusScope focus management.
 * Tab navigates through form fields; Escape closes the sheet.
 */
export const WithForm: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Modal bottom sheet containing a form — demonstrates focus management in the modal variant. Tab navigates through all form fields. Escape closes the sheet. FocusScope prevents focus from reaching content behind the scrim.",
      },
    },
  },
  render: () => <WithFormDemo />,
};

// ─── 7. ControlledOpen ────────────────────────────────────────────────────────

const ControlledOpenDemo = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-svh items-center justify-center gap-4 p-8">
      <Button variant="filled" onPress={() => setOpen(true)}>
        Open
      </Button>
      <Button variant="outlined" onPress={() => setOpen(false)}>
        Close
      </Button>
      <BottomSheet variant="modal" open={open} onOpenChange={setOpen} aria-label="Notifications">
        <div className="px-4 pb-4">
          <h2 className="text-title-medium text-on-surface mb-3">Notifications</h2>
          <List>
            <ListItem
              headline="Your order has shipped"
              supportingText="Order #94821 is on its way — estimated delivery Friday."
            />
            <ListItem
              headline="New comment on your post"
              supportingText="Alice replied: 'Great write-up, thanks for sharing!'"
            />
            <ListItem
              headline="Password changed successfully"
              supportingText="If this wasn't you, contact support immediately."
            />
          </List>
        </div>
      </BottomSheet>
    </div>
  );
};

/**
 * Fully controlled open pattern — parent state manages sheet visibility.
 * Both the "Close" button and the sheet's own dismiss gesture share the same state.
 */
export const ControlledOpen: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the controlled open pattern — external state fully controls whether the sheet is visible. The sheet does not manage its own open state; the parent component is responsible for responding to close events.",
      },
    },
  },
  render: () => <ControlledOpenDemo />,
};

// ─── 8. ScrimDismiss ─────────────────────────────────────────────────────────

const ScrimDismissDemo = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-svh items-center justify-center p-8">
      <Button variant="filled" onPress={() => setOpen(true)}>
        Open settings
      </Button>
      <BottomSheet
        variant="modal"
        open={open}
        onOpenChange={setOpen}
        snapPoints={["50%"]}
        aria-label="Settings"
      >
        <div className="px-4 pb-4">
          <p className="text-label-large text-primary mb-4">
            Click the shaded area above to dismiss
          </p>
          <List>
            <ListItem headline="Notifications" supportingText="Manage notification preferences" />
            <ListItem headline="Privacy" supportingText="Control data and permissions" />
            <ListItem headline="Appearance" supportingText="Theme, font size, and contrast" />
          </List>
        </div>
      </BottomSheet>
    </div>
  );
};

/**
 * Scrim-click dismissal — clicking the darkened backdrop closes the sheet.
 * onOpenChange is called with `false` when the scrim is tapped.
 */
export const ScrimDismiss: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates scrim-click dismissal — clicking the darkened overlay behind the sheet closes it. This is the primary touch gesture for dismissing a modal sheet without interacting with the handle.",
      },
    },
  },
  render: () => <ScrimDismissDemo />,
};

// ─── 9. ResponsiveLayout ─────────────────────────────────────────────────────

const ResponsiveLayoutDemo = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-svh items-center justify-center p-8">
      <Button variant="filled" onPress={() => setOpen(true)}>
        Open options
      </Button>
      <BottomSheet
        variant="modal"
        open={open}
        onOpenChange={setOpen}
        snapPoints={["50%"]}
        aria-label="Options"
      >
        <div className="px-4 pb-4">
          <p className="text-body-medium text-on-surface-variant mb-4">
            On this viewport, the sheet should show side margins and rounded corners. Resize the
            window to below 640px to see full-width behavior with square corners at the sides.
          </p>
          <List>
            <ListItem headline="Edit" supportingText="Modify the selected item" />
            <ListItem headline="Duplicate" supportingText="Create a copy" />
            <ListItem headline="Delete" supportingText="Permanently remove" />
          </List>
        </div>
      </BottomSheet>
    </div>
  );
};

/**
 * Responsive layout — narrow viewports show a full-width sheet; wider
 * viewports (> 640dp) add 56dp side margins and a top margin.
 */
export const ResponsiveLayout: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the responsive layout breakpoint — on narrow viewports (≤ 640dp) the sheet spans the full width; on wider viewports (> 640dp) it centers with 56dp side margins and a top margin.",
      },
    },
  },
  render: () => <ResponsiveLayoutDemo />,
};

// ─── 10. Playground ──────────────────────────────────────────────────────────

const PlaygroundDemo = ({
  variant,
  open: openProp,
  onOpenChange,
  snapPoints,
  "aria-label": ariaLabel,
}: {
  variant?: "modal" | "standard";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  snapPoints?: string[];
  "aria-label"?: string;
}): JSX.Element => {
  const [internalOpen, setInternalOpen] = useState(openProp ?? false);

  const isControlled = openProp !== undefined;
  const isOpen = isControlled ? openProp : internalOpen;

  const handleOpenChange = (next: boolean): void => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <div className="flex min-h-svh items-center justify-center p-8">
      <Button variant="filled" onPress={() => handleOpenChange(true)}>
        Open sheet
      </Button>
      <BottomSheet
        variant={variant ?? "modal"}
        open={isOpen}
        onOpenChange={handleOpenChange}
        snapPoints={snapPoints ?? ["50%"]}
        aria-label={ariaLabel ?? "Playground sheet"}
      >
        <div className="px-4 pb-4">
          <h2 className="text-title-medium text-on-surface mb-3">Playground</h2>
          <List>
            <ListItem headline="Option one" supportingText="Configure via the controls panel" />
            <ListItem
              headline="Option two"
              supportingText="Change variant, snap points, and more"
            />
            <ListItem headline="Option three" supportingText="Try all combinations" />
          </List>
        </div>
      </BottomSheet>
    </div>
  );
};

/**
 * Interactive playground — use the controls panel to configure all Bottom Sheet props.
 */
export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground — use the controls panel to configure all Bottom Sheet props. Open the sheet and experiment with different snap points, variants, and aria labels.",
      },
    },
  },
  args: {
    variant: "modal",
    snapPoints: ["50%"],
    "aria-label": "Playground sheet",
  },
  render: (args) => <PlaygroundDemo {...args} />,
};
