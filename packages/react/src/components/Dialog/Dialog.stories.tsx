import { useState, type JSX } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Dialog } from "./Dialog";
import { DialogHeadline } from "./DialogHeadline";
import { DialogContent } from "./DialogContent";
import { DialogActions } from "./DialogActions";
import { DialogHeadless } from "./DialogHeadless";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import type { DialogAnimationState } from "./Dialog.types";

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

const BookmarkIcon = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
  </svg>
);

const DeleteIcon = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const InfoIcon = (): JSX.Element => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
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
 *   action buttons. Entry via `animate-md-scale-in` (MD3 Expressive, 350ms).
 *   Closes on scrim click or Escape key. Min 280dp, max 560dp width.
 *
 * - **Full-screen**: Full viewport overlay suited for mobile and complex forms.
 *   Replaces the headline with a top app bar row (close icon button + confirm
 *   action). Entry via `animate-md-slide-in-bottom` (500ms). Does NOT close on
 *   scrim click.
 *
 * ## Hero Icon
 *
 * An optional `icon` prop renders a centered 24dp icon above the headline.
 * When present, headline and supporting text automatically center-align
 * via `group-data-[with-icon]/dialog:text-center`.
 *
 * ## Scroll Dividers
 *
 * `DialogContent` automatically shows `border-outline-variant` dividers at the
 * top and/or bottom when content overflows its container and the user has not
 * scrolled to the respective edge.
 *
 * ## Reduced Motion
 *
 * When `prefers-reduced-motion: reduce` is active, all keyframe animations are
 * suppressed and the dialog appears/disappears instantly.
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
 * @see https://m3.material.io/components/dialogs/specs
 */
const meta: Meta<typeof Dialog> = {
  title: "Feedback/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Material Design 3 Dialog — provides important prompts requiring user action. Supports Basic and Full-screen variants with composable slot-based API, hero icon, scroll dividers, and MD3 Expressive motion.",
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
 * two action buttons. Entry uses `animate-md-scale-in` (MD3 Expressive 350ms);
 * exit uses `animate-md-scale-out` (200ms). The scrim fades in/out independently.
 */
export const Basic: Story = {
  render: () => <BasicDemo />,
};

// ─── With hero icon ──────────────────────────────────────────────────────────

const WithIconDemo = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-center gap-4 p-8">
      <Button variant="filled" onPress={() => setOpen(true)}>
        Open dialog with icon
      </Button>
      <Dialog open={open} onOpenChange={setOpen} icon={<BookmarkIcon />}>
        <DialogHeadline>Save bookmark?</DialogHeadline>
        <DialogContent>
          The page will be saved to your bookmarks and synced across all your devices.
        </DialogContent>
        <DialogActions>
          <Button variant="text" onPress={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="filled" onPress={() => setOpen(false)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

/**
 * The optional `icon` prop renders a centered 24dp hero icon above the headline.
 * When present, both the headline and supporting text center-align automatically
 * via `group-data-[with-icon]/dialog:text-center` — no extra props needed.
 *
 * MD3 icon color: `text-secondary`.
 */
export const WithIcon: Story = {
  render: () => <WithIconDemo />,
};

// ─── Scroll dividers ──────────────────────────────────────────────────────────

const ScrollDividersDemo = (): JSX.Element => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-center p-8">
      <Button variant="filled" onPress={() => setOpen(true)}>
        Open scrollable dialog
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogHeadline>Terms of service</DialogHeadline>
        {/*
         * The DialogContent scroll handler automatically sets data-scroll-divider-top
         * and data-scroll-divider-bottom as the user scrolls. The CVA base classes
         * apply border-outline-variant dividers when those attributes are present.
         */}
        <DialogContent className="max-h-48">
          <p>
            By using this service, you agree to these terms. Read them carefully before accepting.
          </p>
          <p className="mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </p>
          <p className="mt-4">
            Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
            aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </p>
          <p className="mt-4">
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit
            voluptatem accusantium doloremque laudantium.
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
 * Demonstrates `DialogContent` scroll dividers. When the content overflows and
 * the user has not scrolled to an edge, `border-outline-variant` dividers appear
 * above and/or below the scrollable area per MD3 spec.
 *
 * Scroll the content to see the top divider appear and the bottom divider disappear.
 */
export const ScrollDividers: Story = {
  render: () => <ScrollDividersDemo />,
};

// ─── Scrollable content (legacy) ─────────────────────────────────────────────

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
      <Dialog open={open} onOpenChange={setOpen} icon={<DeleteIcon />}>
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
 * A destructive action confirmation dialog with a hero icon. The primary action
 * uses a standard filled button (MD3 does not use an error-colored button in dialogs).
 */
export const Confirmation: Story = {
  render: () => <ConfirmationDemo />,
};

// ─── States (motion showcase) ─────────────────────────────────────────────────

const StatesDemo = (): JSX.Element => {
  const [basicOpen, setBasicOpen] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [iconOpen, setIconOpen] = useState(false);

  return (
    <div className="flex flex-wrap items-start gap-4 p-8">
      <div className="flex flex-col gap-2">
        <p className="text-label-medium text-on-surface-variant">Basic (scale in/out)</p>
        <Button variant="filled" onPress={() => setBasicOpen(true)}>
          Basic dialog
        </Button>
        <Dialog open={basicOpen} onOpenChange={setBasicOpen}>
          <DialogHeadline>Scale animation</DialogHeadline>
          <DialogContent>
            Enters with `animate-md-scale-in` (expressive-fast-spatial, 350ms). Exits with
            `animate-md-scale-out` (200ms). The scrim fades in/out independently.
          </DialogContent>
          <DialogActions>
            <Button variant="filled" onPress={() => setBasicOpen(false)}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-label-medium text-on-surface-variant">With icon (centered)</p>
        <Button variant="tonal" onPress={() => setIconOpen(true)}>
          Icon dialog
        </Button>
        <Dialog open={iconOpen} onOpenChange={setIconOpen} icon={<InfoIcon />}>
          <DialogHeadline>Hero icon</DialogHeadline>
          <DialogContent>
            When `icon` is provided, `data-with-icon` is set on the panel root. Headline and content
            center-align via `group-data-[with-icon]/dialog:text-center`.
          </DialogContent>
          <DialogActions>
            <Button variant="filled" onPress={() => setIconOpen(false)}>
              Got it
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-label-medium text-on-surface-variant">Fullscreen (slide in/out)</p>
        <Button variant="outlined" onPress={() => setFullscreenOpen(true)}>
          Full-screen dialog
        </Button>
        <Dialog variant="fullscreen" open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
          <DialogHeadline
            closeButton={
              <IconButton
                variant="standard"
                aria-label="Close"
                onPress={() => setFullscreenOpen(false)}
              >
                <CloseIcon />
              </IconButton>
            }
            confirmButton={
              <Button variant="text" onPress={() => setFullscreenOpen(false)}>
                Save
              </Button>
            }
          >
            Slide animation
          </DialogHeadline>
          <DialogContent>
            <p className="text-body-medium text-on-surface-variant">
              Enters with `animate-md-slide-in-bottom` (standard-default-spatial, 500ms). Exits with
              `animate-md-slide-out-bottom` (200ms).
            </p>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

/**
 * Showcases all three primary dialog states in one view:
 * - Basic: scale-in / scale-out (MD3 Expressive)
 * - With icon: centered hero icon + centered text
 * - Full-screen: slide-in-bottom / slide-out-bottom
 *
 * All animations are suppressed when `prefers-reduced-motion: reduce` is active.
 */
export const States: Story = {
  render: () => <StatesDemo />,
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
        // Static scrim (no animation) — the headless layer accepts getScrimClassName for
        // animation; omitting it falls back to a static bg-scrim/32 overlay.
        getScrimClassName={(_state: DialogAnimationState): string =>
          "fixed inset-0 z-40 bg-scrim/32"
        }
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
