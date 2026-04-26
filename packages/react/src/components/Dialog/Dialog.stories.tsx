import { useState, type JSX } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Dialog } from "./Dialog";
import { DialogHeadline } from "./DialogHeadline";
import { DialogContent } from "./DialogContent";
import { DialogActions } from "./DialogActions";
import { DialogHeadless } from "./DialogHeadless";
import { Button } from "../Button";
import { IconButton } from "../IconButton";

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

const CloseIcon = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

// ─── Meta ─────────────────────────────────────────────────────────────────────

/**
 * Material Design 3 Dialog component.
 *
 * Dialogs provide important prompts in a user flow. They can require an action,
 * communicate information, or help users accomplish a task.
 *
 * ## Variants
 *
 * - **Basic** (default): A floating card dialog with headline, body text, and
 *   action buttons. Supports scale + fade entry animation. Closes on scrim
 *   click or Escape key. Min 280dp, max 560dp width.
 *
 * - **Full-screen**: Full viewport overlay suited for mobile and complex forms.
 *   Replaces the headline with a top app bar row (close icon button + confirm
 *   action). Slide-up entry animation. Does NOT close on scrim click.
 *
 * ## Accessibility
 *
 * - `role="dialog"` + `aria-modal="true"` (React Aria `useDialog`)
 * - `aria-labelledby` → `DialogHeadline` id
 * - `aria-describedby` → `DialogContent` id
 * - Focus trap while open (`FocusScope`)
 * - Focus restores to trigger on close
 * - Body scroll locked while open (`usePreventScroll`)
 * - Escape key always closes
 *
 * @see https://m3.material.io/components/dialogs/overview
 */
const meta: Meta<typeof Dialog> = {
  title: "Feedback/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Material Design 3 Dialog — provides important prompts requiring user action. Supports Basic and Full-screen variants with composable slot-based API.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["basic", "fullscreen"],
      description: "Structural variant — Basic (floating card) or Full-screen (full viewport).",
    },
    open: {
      control: "boolean",
      description: "Controlled open state.",
    },
    defaultOpen: {
      control: "boolean",
      description: "Default open state for uncontrolled usage.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dialog>;

// ─── Basic ────────────────────────────────────────────────────────────────────

const BasicDemo = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-center p-8">
      <Button variant="filled" onPress={() => setOpen(true)}>
        Open dialog
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeadline>Permanently delete?</DialogHeadline>
        <DialogContent>
          Deleting the selected messages will also remove them from all your devices.
        </DialogContent>
        <DialogActions>
          <Button variant="text" onPress={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="filled" onPress={() => setOpen(false)}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

/**
 * The Basic dialog presents a simple prompt with a headline, body text, and
 * two action buttons. The primary action uses `variant="filled"` and the
 * secondary uses `variant="text"` per MD3 spec.
 */
export const Basic: Story = {
  render: () => <BasicDemo />,
};

// ─── Scrollable content ───────────────────────────────────────────────────────

const ScrollableContentDemo = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-center p-8">
      <Button variant="filled" onPress={() => setOpen(true)}>
        Open scrollable dialog
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeadline>Terms of service</DialogHeadline>
        <DialogContent>
          <p>
            By using this service, you agree to these terms. Read them carefully. Lorem ipsum dolor
            sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </p>
          <p className="mt-4">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
            dolore eu fugiat nulla pariatur.
          </p>
          <p className="mt-4">
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit
            voluptatem accusantium doloremque.
          </p>
          <p className="mt-4">
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
            consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
          </p>
        </DialogContent>
        <DialogActions>
          <Button variant="text" onPress={() => setOpen(false)}>
            Decline
          </Button>
          <Button variant="filled" onPress={() => setOpen(false)}>
            Accept
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

/**
 * Demonstrates the scrollable body content behavior when content exceeds
 * the available height.
 */
export const ScrollableContent: Story = {
  render: () => <ScrollableContentDemo />,
};

// ─── Confirmation ─────────────────────────────────────────────────────────────

const ConfirmationDemo = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = (): void => {
    setConfirmed(true);
    setOpen(false);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <Button variant="filled" onPress={() => setOpen(true)}>
        Delete account
      </Button>
      {confirmed && <p className="text-body-medium text-on-surface-variant">Account deleted.</p>}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeadline>Delete account?</DialogHeadline>
        <DialogContent>
          Your account and all associated data will be permanently deleted. This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button variant="text" onPress={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="filled" onPress={handleConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

/**
 * A destructive action confirmation dialog. The primary action uses a
 * standard filled button (MD3 does not use an error-colored button in dialogs).
 */
export const Confirmation: Story = {
  render: () => <ConfirmationDemo />,
};

// ─── Full-screen ───────────────────────────────────────────────────────────────

const FullscreenDemo = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-center p-8">
      <Button variant="filled" onPress={() => setOpen(true)}>
        Open full-screen dialog
      </Button>
      <Dialog variant="fullscreen" open={open} onOpenChange={setOpen}>
        <DialogHeadline
          closeButton={
            <IconButton variant="standard" aria-label="Close" onPress={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          }
          confirmButton={
            <Button variant="text" onPress={() => setOpen(false)}>
              Save
            </Button>
          }
        >
          New event
        </DialogHeadline>
        <DialogContent>
          <div className="flex flex-col gap-4">
            <p className="text-body-medium text-on-surface-variant">
              Fill in the details for your new event. Use the Save button in the top bar to confirm,
              or the close icon to discard changes.
            </p>
            <label className="flex flex-col gap-1">
              <span className="text-label-medium text-on-surface">Event name</span>
              <input
                type="text"
                placeholder="My event"
                className="border-outline text-body-medium text-on-surface bg-surface-container focus:border-primary rounded-md border px-3 py-2 outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-label-medium text-on-surface">Description</span>
              <textarea
                rows={4}
                placeholder="Add a description..."
                className="border-outline text-body-medium text-on-surface bg-surface-container focus:border-primary resize-none rounded-md border px-3 py-2 outline-none"
              />
            </label>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/**
 * The Full-screen dialog covers the entire viewport and is suited for mobile
 * layouts or complex form flows. The headline is replaced with a top app bar
 * row containing a close icon button and a confirm action.
 *
 * Per MD3 spec, the Full-screen dialog does NOT close on scrim click —
 * only via the close button or Escape key.
 */
export const Fullscreen: Story = {
  render: () => <FullscreenDemo />,
};

// ─── Uncontrolled ─────────────────────────────────────────────────────────────

/**
 * Demonstrates the uncontrolled pattern using `defaultOpen`. Useful in
 * simple scenarios where the dialog state does not need to be lifted up.
 */
export const Uncontrolled: Story = {
  render: () => (
    <div className="flex items-center justify-center p-8">
      <Dialog defaultOpen>
        <DialogHeadline>Uncontrolled dialog</DialogHeadline>
        <DialogContent>
          This dialog opens immediately without controlled state. Dismiss it by pressing Escape or
          clicking the scrim.
        </DialogContent>
        <DialogActions>
          <Button variant="filled">Got it</Button>
        </DialogActions>
      </Dialog>
    </div>
  ),
};

// ─── Headless (advanced customization) ────────────────────────────────────────

const HeadlessDemo = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-center p-8">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-secondary text-on-secondary text-label-large rounded-md px-4 py-2"
      >
        Open headless dialog
      </button>
      <DialogHeadless
        open={open}
        onOpenChange={setOpen}
        aria-label="Custom headless dialog"
        className="bg-surface-container-high shadow-elevation-3 w-full max-w-md rounded-2xl p-8"
        scrimClassName="fixed inset-0 z-40 bg-scrim opacity-32"
      >
        <DialogHeadline>Custom styled dialog</DialogHeadline>
        <DialogContent>
          This dialog uses `DialogHeadless` for fully custom styling while retaining all React Aria
          behavior and WCAG 2.1 AA compliance.
        </DialogContent>
        <DialogActions>
          <Button variant="text" onPress={() => setOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </DialogHeadless>
    </div>
  );
};

/**
 * Demonstrates the headless primitive for fully custom styling while
 * retaining all MD3 behavior and accessibility semantics.
 */
export const Headless: Story = {
  render: () => <HeadlessDemo />,
};
