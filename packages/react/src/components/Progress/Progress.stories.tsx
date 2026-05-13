import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Progress } from "./Progress";

/**
 * Material Design 3 Progress Indicator Component
 *
 * Supports four variants driven by `type` and `indeterminate` props:
 * - **Linear Determinate** — shows a known progress value on a horizontal track
 * - **Linear Indeterminate** — animated two-segment bar for unknown duration
 * - **Circular Determinate** — SVG arc showing a known progress value
 * - **Circular Indeterminate** — rotating spinner for unknown duration
 *
 * ## MD3 Specifications
 * - Linear track height: 4dp
 * - Circular default size: 48dp (medium)
 * - Active track color: `primary`
 * - Inactive track color: `surface-container-highest`
 * - Determinate transitions: 400ms ease-standard
 * - Indeterminate cycle: 500ms (linear) / 600ms (circular)
 */
const meta: Meta<typeof Progress> = {
  title: "Components/Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "radio",
      options: ["linear", "circular"],
      description: "Visual type of the progress indicator",
    },
    indeterminate: {
      control: "boolean",
      description: "Show indeterminate animation (unknown progress duration)",
    },
    value: {
      control: { type: "range", min: 0, max: 100, step: 1 },
      description: "Current progress value (0–100 by default)",
    },
    minValue: {
      control: "number",
      description: "Minimum value (default: 0)",
    },
    maxValue: {
      control: "number",
      description: "Maximum value (default: 100)",
    },
    label: {
      control: "text",
      description: "Visible label rendered above the indicator",
    },
    size: {
      control: "radio",
      options: ["small", "medium", "large"],
      description: "Circular indicator size (ignored for linear)",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Progress indicators communicate the status of an ongoing process. Built with React Aria for accessibility and styled with MD3 design tokens.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

// ---------------------------------------------------------------------------
// Individual variant stories
// ---------------------------------------------------------------------------

/**
 * Linear Determinate — shows exact progress on a horizontal track.
 */
export const LinearDeterminate: Story = {
  args: {
    type: "linear",
    value: 60,
    label: "Uploading files",
  },
};

/**
 * Linear Indeterminate — animated for operations with unknown duration.
 */
export const LinearIndeterminate: Story = {
  args: {
    type: "linear",
    indeterminate: true,
    "aria-label": "Loading content",
  },
};

/**
 * Circular Determinate — SVG arc showing known progress.
 */
export const CircularDeterminate: Story = {
  args: {
    type: "circular",
    value: 75,
    label: "Processing",
  },
};

/**
 * Circular Indeterminate — rotating spinner for unknown duration.
 */
export const CircularIndeterminate: Story = {
  args: {
    type: "circular",
    indeterminate: true,
    "aria-label": "Loading",
  },
};

// ---------------------------------------------------------------------------
// Label stories
// ---------------------------------------------------------------------------

/**
 * With visible label — label is rendered above the indicator and linked via
 * aria-labelledby for screen reader accessibility.
 */
export const WithLabel: Story = {
  render: function WithLabelRender() {
    return (
      <div className="flex flex-col gap-6">
        <Progress type="linear" value={45} label="Downloading updates" />
        <Progress type="circular" value={70} label="Syncing data" />
      </div>
    );
  },
};

/**
 * With aria-label only — no visible label; aria-label satisfies WCAG.
 */
export const WithAriaLabel: Story = {
  args: {
    type: "linear",
    indeterminate: true,
    "aria-label": "Loading page content",
  },
};

// ---------------------------------------------------------------------------
// Custom range
// ---------------------------------------------------------------------------

/**
 * Custom min/max values — value=150 on range 0–200 renders as 75%.
 */
export const CustomMinMax: Story = {
  args: {
    type: "linear",
    minValue: 0,
    maxValue: 200,
    value: 150,
    label: "Transfer progress",
  },
};

// ---------------------------------------------------------------------------
// Circular sizes
// ---------------------------------------------------------------------------

/**
 * Circular sizes — small (24dp), medium (48dp, default), large (64dp).
 */
export const CircularSizes: Story = {
  render: function CircularSizesRender() {
    return (
      <div className="flex items-end gap-8">
        <div className="flex flex-col items-center gap-2">
          <Progress type="circular" indeterminate size="small" aria-label="Loading small" />
          <span className="text-body-small text-on-surface-variant">Small (24dp)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Progress type="circular" indeterminate size="medium" aria-label="Loading medium" />
          <span className="text-body-small text-on-surface-variant">Medium (48dp)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Progress type="circular" indeterminate size="large" aria-label="Loading large" />
          <span className="text-body-small text-on-surface-variant">Large (64dp)</span>
        </div>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// All variants showcase
// ---------------------------------------------------------------------------

/**
 * All variants — showcase of all four variant combinations.
 */
export const AllVariants: Story = {
  render: function AllVariantsRender() {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h3 className="text-title-medium text-on-surface">Linear</h3>
          <div className="flex flex-col gap-4">
            <Progress type="linear" value={40} label="Determinate (40%)" />
            <Progress type="linear" indeterminate aria-label="Linear indeterminate" />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-title-medium text-on-surface">Circular</h3>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <Progress type="circular" value={65} aria-label="Circular determinate 65%" />
              <span className="text-body-small text-on-surface-variant">Determinate (65%)</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Progress type="circular" indeterminate aria-label="Circular indeterminate" />
              <span className="text-body-small text-on-surface-variant">Indeterminate</span>
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Interactive playground
// ---------------------------------------------------------------------------

/**
 * Playground — interactive slider to explore determinate progress values.
 */
export const Playground: Story = {
  render: function PlaygroundRender() {
    const [value, setValue] = useState(30);
    const [isIndeterminate, setIsIndeterminate] = useState(false);

    return (
      <div className="flex flex-col gap-8">
        {/* Controls */}
        <div className="bg-surface-container-high flex flex-col gap-4 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <label className="text-body-medium text-on-surface w-28" htmlFor="value-slider">
              Value: {value}%
            </label>
            <input
              id="value-slider"
              type="range"
              min={0}
              max={100}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              disabled={isIndeterminate}
              className="flex-1"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-body-medium text-on-surface flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={isIndeterminate}
                onChange={(e) => setIsIndeterminate(e.target.checked)}
              />
              Indeterminate
            </label>
          </div>
        </div>

        {/* Linear */}
        <div className="flex flex-col gap-2">
          <p className="text-label-large text-on-surface-variant">Linear</p>
          <Progress
            type="linear"
            value={value}
            indeterminate={isIndeterminate}
            label={isIndeterminate ? undefined : `Uploading (${value}%)`}
            aria-label={isIndeterminate ? "Loading" : undefined}
          />
        </div>

        {/* Circular */}
        <div className="flex flex-col items-start gap-2">
          <p className="text-label-large text-on-surface-variant">Circular</p>
          <Progress
            type="circular"
            value={value}
            indeterminate={isIndeterminate}
            label={isIndeterminate ? undefined : `${value}%`}
            aria-label={isIndeterminate ? "Loading" : undefined}
          />
        </div>
      </div>
    );
  },
};

/**
 * Simulated upload — demonstrates value updates over time.
 */
export const SimulatedUpload: Story = {
  render: function SimulatedUploadRender() {
    const [progress, setProgress] = useState(0);
    const [running, setRunning] = useState(false);

    const start = (): void => {
      setProgress(0);
      setRunning(true);
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setRunning(false);
            return 100;
          }
          return prev + 5;
        });
      }, 150);
    };

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Progress type="linear" value={progress} label={`Uploading… ${progress}%`} />
          <Progress
            type="circular"
            value={progress}
            size="large"
            aria-label={`Upload progress ${progress}%`}
          />
        </div>
        <button
          type="button"
          onClick={start}
          disabled={running}
          className="bg-primary text-on-primary w-fit rounded-full px-6 py-2 disabled:opacity-38"
        >
          {running ? "Uploading…" : progress === 100 ? "Upload again" : "Start upload"}
        </button>
      </div>
    );
  },
};
