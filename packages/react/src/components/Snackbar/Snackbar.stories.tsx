import type { Meta, StoryObj } from "@storybook/react";
import { useState, type JSX } from "react";
import { Snackbar } from "./Snackbar";
import { SnackbarProvider, useSnackbar } from "./SnackbarProvider";

/**
 * Material Design 3 Snackbar Component
 *
 * Snackbars provide brief messages about app processes at the bottom of the
 * screen. They appear temporarily and don't require user input to disappear.
 *
 * ## Content Configurations
 * - **Single-line** — message text only
 * - **Two-line** — message + supporting text (when content exceeds one line)
 * - **With action** — single text button for an undo or related action
 * - **With close icon** — explicit dismiss button for persistent messages
 *
 * ## MD3 Specifications
 * - Surface: `inverse-surface` with `inverse-on-surface` text
 * - Shape: extra-small corner (4dp) → `rounded-xs`
 * - Elevation: level 3 → `shadow-elevation-3`
 * - Width: 288dp min, 568dp max, centered `bottom-4`
 * - Auto-dismiss: 4000ms default, pauses on hover and focus
 * - Motion: entry slide-up 200ms / exit fade-out 100ms
 *
 * ## Usage
 * ```tsx
 * // Wrap your app with SnackbarProvider
 * <SnackbarProvider>
 *   <App />
 * </SnackbarProvider>
 *
 * // Trigger from any descendant component
 * const { showSnackbar } = useSnackbar();
 * showSnackbar({ message: "File deleted", action: { label: "Undo", onAction: handleUndo } });
 * ```
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
      defaultValue: 4000,
    },
    severity: {
      control: "radio",
      options: ["default", "error"],
      description: "Controls ARIA live region — polite (default) or assertive (error)",
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

// ---------------------------------------------------------------------------
// Individual content configuration stories
// ---------------------------------------------------------------------------

/**
 * Single-line message — the simplest Snackbar configuration.
 * Auto-dismisses after 4 seconds.
 */
export const SingleLine: Story = {
  args: {
    message: "File deleted",
    duration: 0,
  },
};

/**
 * Two-line configuration — message + supporting text.
 * Used when the message exceeds one line.
 */
export const TwoLine: Story = {
  args: {
    message: "Connection lost",
    supportingText: "Please check your network and try again",
    duration: 0,
  },
};

/**
 * With action button — single text action for an undo or related task.
 * Action button uses `inverse-primary` color per MD3 spec.
 */
export const WithAction: Story = {
  args: {
    message: "File deleted",
    action: { label: "Undo", onAction: () => alert("Undo triggered") },
    duration: 0,
  },
};

/**
 * With close icon — explicit dismiss button.
 * Useful when auto-dismiss is disabled or the message is important.
 */
export const WithCloseIcon: Story = {
  args: {
    message: "File deleted",
    showClose: true,
    duration: 0,
  },
};

/**
 * With action and close icon — all interactive elements combined.
 */
export const WithActionAndClose: Story = {
  args: {
    message: "File deleted",
    action: { label: "Undo", onAction: () => alert("Undo") },
    showClose: true,
    duration: 0,
  },
};

/**
 * Error severity — uses `role="alert" aria-live="assertive"` for urgent
 * screen reader announcements.
 */
export const ErrorSeverity: Story = {
  args: {
    message: "Upload failed. Please try again.",
    severity: "error",
    showClose: true,
    duration: 0,
  },
};

// ---------------------------------------------------------------------------
// Auto-dismiss demos
// ---------------------------------------------------------------------------

/**
 * Short duration — dismisses after 2 seconds.
 */
export const ShortDuration: Story = {
  args: {
    message: "Copied to clipboard",
    duration: 2000,
  },
};

/**
 * Persistent — no auto-dismiss (duration=0). Requires explicit close.
 */
export const Persistent: Story = {
  args: {
    message: "This message will not auto-dismiss",
    duration: 0,
    showClose: true,
  },
};

// ---------------------------------------------------------------------------
// Interactive queue demo
// ---------------------------------------------------------------------------

/**
 * Queue demo — multiple Snackbars displayed sequentially, never stacked.
 * Click the buttons quickly to queue several messages.
 */
export const QueueDemo: Story = {
  render: function QueueDemoRender() {
    const { showSnackbar } = useSnackbar();

    return (
      <div className="flex flex-col gap-3">
        <p className="text-body-medium text-on-surface-variant">
          Click buttons to queue multiple Snackbars. They appear one at a time.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => showSnackbar({ message: "File deleted", duration: 3000 })}
            className="bg-primary text-on-primary text-label-large rounded-full px-4 py-2"
          >
            File deleted
          </button>
          <button
            type="button"
            onClick={() =>
              showSnackbar({
                message: "Photo saved",
                action: { label: "View", onAction: () => alert("Viewing photo") },
                duration: 3000,
              })
            }
            className="bg-secondary text-on-secondary text-label-large rounded-full px-4 py-2"
          >
            Photo saved (with action)
          </button>
          <button
            type="button"
            onClick={() =>
              showSnackbar({
                message: "Upload failed",
                severity: "error",
                showClose: true,
                duration: 4000,
              })
            }
            className="bg-error text-on-error text-label-large rounded-full px-4 py-2"
          >
            Upload failed (error)
          </button>
          <button
            type="button"
            onClick={() =>
              showSnackbar({
                message: "Connection lost",
                supportingText: "Check your network settings",
                showClose: true,
                duration: 3000,
              })
            }
            className="bg-surface-container-high text-on-surface text-label-large rounded-full px-4 py-2"
          >
            Two-line
          </button>
        </div>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Playground
// ---------------------------------------------------------------------------

/**
 * Playground — trigger Snackbars with configurable options.
 */
export const Playground: Story = {
  render: function PlaygroundRender(): JSX.Element {
    const { showSnackbar } = useSnackbar();
    const [message, setMessage] = useState("Changes saved");
    const [supportingText, setSupportingText] = useState("");
    const [actionLabel, setActionLabel] = useState("");
    const [showCloseIcon, setShowCloseIcon] = useState(false);
    const [duration, setDuration] = useState(4000);
    const [severity, setSeverity] = useState<"default" | "error">("default");

    const trigger = (): void => {
      showSnackbar({
        message,
        supportingText: supportingText || undefined,
        action: actionLabel
          ? { label: actionLabel, onAction: () => alert(`Action: ${actionLabel}`) }
          : undefined,
        showClose: showCloseIcon,
        duration,
        severity,
      });
    };

    return (
      <div className="flex w-full max-w-lg flex-col gap-6">
        <div className="bg-surface-container-high flex flex-col gap-4 rounded-xl p-5">
          <h3 className="text-title-medium text-on-surface">Configure Snackbar</h3>

          <div className="flex flex-col gap-1">
            <label htmlFor="sb-message" className="text-label-large text-on-surface-variant">
              Message
            </label>
            <input
              id="sb-message"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-surface border-outline text-body-medium text-on-surface rounded-sm border px-3 py-2"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="sb-supporting" className="text-label-large text-on-surface-variant">
              Supporting text (optional, makes two-line)
            </label>
            <input
              id="sb-supporting"
              type="text"
              value={supportingText}
              onChange={(e) => setSupportingText(e.target.value)}
              placeholder="Leave empty for single-line"
              className="bg-surface border-outline text-body-medium text-on-surface rounded-sm border px-3 py-2"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="sb-action" className="text-label-large text-on-surface-variant">
              Action button label (optional)
            </label>
            <input
              id="sb-action"
              type="text"
              value={actionLabel}
              onChange={(e) => setActionLabel(e.target.value)}
              placeholder="e.g. Undo"
              className="bg-surface border-outline text-body-medium text-on-surface rounded-sm border px-3 py-2"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="text-body-medium text-on-surface flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={showCloseIcon}
                onChange={(e) => setShowCloseIcon(e.target.checked)}
              />
              Show close icon
            </label>

            <div className="flex items-center gap-2">
              <label htmlFor="sb-duration" className="text-label-large text-on-surface-variant">
                Duration (ms):
              </label>
              <input
                id="sb-duration"
                type="number"
                value={duration}
                step={500}
                min={0}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="bg-surface border-outline text-body-medium text-on-surface w-24 rounded-sm border px-2 py-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sb-severity" className="text-label-large text-on-surface-variant">
                Severity:
              </label>
              <select
                id="sb-severity"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as "default" | "error")}
                className="bg-surface border-outline text-body-medium text-on-surface rounded-sm border px-2 py-1"
              >
                <option value="default">default</option>
                <option value="error">error</option>
              </select>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={trigger}
          className="bg-primary text-on-primary text-label-large w-fit rounded-full px-6 py-3"
        >
          Show Snackbar
        </button>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// All configurations showcase
// ---------------------------------------------------------------------------

/**
 * All configurations — visual reference for all four MD3 content layouts.
 * Each Snackbar is rendered declaratively with `duration=0` (no auto-dismiss)
 * so they remain visible in the docs.
 */
export const AllConfigurations: Story = {
  render: function AllConfigurationsRender() {
    return (
      <div className="flex w-full flex-col gap-4">
        <p className="text-title-medium text-on-surface">
          All MD3 Snackbar content configurations:
        </p>
        <p className="text-body-small text-on-surface-variant">
          Rendered declaratively — Snackbars are normally positioned fixed at bottom of viewport.
          Here they are shown inline for documentation purposes.
        </p>

        <div className="mt-4 flex flex-col gap-3">
          {/* Single-line */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="bg-inverse-surface text-inverse-on-surface shadow-elevation-3 max-w-snackbar-max flex w-max min-w-72 items-center gap-x-2 rounded-xs px-4 py-3"
          >
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-body-medium text-inverse-on-surface">File deleted</span>
            </div>
          </div>

          {/* Two-line */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="bg-inverse-surface text-inverse-on-surface shadow-elevation-3 max-w-snackbar-max flex w-max min-w-72 items-center gap-x-2 rounded-xs px-4 py-4"
          >
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-body-medium text-inverse-on-surface">Connection lost</span>
              <span className="text-body-medium text-inverse-on-surface opacity-80">
                Please check your network settings
              </span>
            </div>
          </div>

          {/* With action */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="bg-inverse-surface text-inverse-on-surface shadow-elevation-3 max-w-snackbar-max flex w-max min-w-72 items-center gap-x-2 rounded-xs px-4 py-3"
          >
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-body-medium text-inverse-on-surface">Photo archived</span>
            </div>
            <button type="button" className="text-inverse-primary text-label-large shrink-0 px-2">
              Undo
            </button>
          </div>

          {/* With close */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="bg-inverse-surface text-inverse-on-surface shadow-elevation-3 max-w-snackbar-max flex w-max min-w-72 items-center gap-x-2 rounded-xs px-4 py-3"
          >
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-body-medium text-inverse-on-surface">
                Message sent successfully
              </span>
            </div>
            <button
              type="button"
              aria-label="Close"
              className="text-inverse-on-surface shrink-0 p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  },
};
