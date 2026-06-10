import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Progress } from "./Progress";

/**
 * Material Design 3 Progress Indicator — MD3 Expressive
 *
 * Supports four visual combinations driven by `type` × `indeterminate`:
 * - **Linear Determinate** — two-segment track (active + gap + inactive) on a horizontal rail
 * - **Linear Indeterminate** — animated two-segment bar for unknown duration
 * - **Circular Determinate** — SVG arc pair with 4dp gap between active and inactive
 * - **Circular Indeterminate** — rotating spinner with visible inactive track
 *
 * ## MD3 Expressive spec (May 2025)
 * - Active indicator color: `primary`
 * - Inactive track color: `primary-container` (colorful style)
 * - Indicator-track gap: 4dp between active and inactive segments
 * - Stop indicator: 4dp `primary` dot at trailing edge (linear determinate only)
 * - Track thickness: 4dp default | 8dp thick (via `thickness` prop)
 * - Shape: flat (default) | wavy (SVG sine-wave, `shape="wavy"`)
 * - Reduced-motion: wavy automatically degrades to flat
 *
 * ## New MD3 Expressive props
 * | Prop | Values | Default | Description |
 * |---|---|---|---|
 * | `shape` | `"flat"` \| `"wavy"` | `"flat"` | Wavy uses a sine-wave active indicator |
 * | `thickness` | `"default"` \| `"thick"` | `"default"` | 4dp or 8dp track |
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
    shape: {
      control: "radio",
      options: ["flat", "wavy"],
      description: "Shape of the active indicator (wavy = MD3 Expressive sine-wave)",
    },
    thickness: {
      control: "radio",
      options: ["default", "thick"],
      description: "Track thickness: 4dp (default) or 8dp (thick, MD3 Expressive)",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Progress indicators communicate the status of an ongoing process. Built with React Aria for accessibility and styled with MD3 Expressive design tokens (primary-container track, 4dp gap, optional wavy shape and thick track).",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Progress>;

// ---------------------------------------------------------------------------
// Baseline variants
// ---------------------------------------------------------------------------

/**
 * Linear Determinate — two-segment gap rendering with colorful `primary-container` track.
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
 * Circular Determinate — SVG arc pair showing known progress with 4dp gap.
 */
export const CircularDeterminate: Story = {
  args: {
    type: "circular",
    value: 75,
    label: "Processing",
  },
};

/**
 * Circular Indeterminate — rotating spinner with visible `primary-container` inactive track.
 */
export const CircularIndeterminate: Story = {
  args: {
    type: "circular",
    indeterminate: true,
    "aria-label": "Loading",
  },
};

// ---------------------------------------------------------------------------
// MD3 Expressive — Flat vs Wavy
// ---------------------------------------------------------------------------

/**
 * Flat vs Wavy — side-by-side comparison of the two shapes.
 */
export const FlatVsWavy: Story = {
  render: function FlatVsWavyRender() {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-label-large text-on-surface-variant mb-3">Flat (default)</p>
          <div className="flex flex-col gap-4">
            <Progress type="linear" value={60} label="Determinate" shape="flat" />
            <Progress type="linear" indeterminate shape="flat" aria-label="Indeterminate flat" />
          </div>
        </div>
        <div>
          <p className="text-label-large text-on-surface-variant mb-3">Wavy (MD3 Expressive)</p>
          <div className="flex flex-col gap-4">
            <Progress type="linear" value={60} label="Determinate wavy" shape="wavy" />
            <Progress type="linear" indeterminate shape="wavy" aria-label="Indeterminate wavy" />
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Circular Flat vs Wavy — side-by-side circular shapes.
 */
export const CircularFlatVsWavy: Story = {
  render: function CircularFlatVsWavyRender() {
    return (
      <div className="flex items-end gap-12">
        <div className="flex flex-col items-center gap-3">
          <Progress type="circular" indeterminate shape="flat" aria-label="Flat spinner" />
          <span className="text-body-small text-on-surface-variant">Flat</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Progress type="circular" indeterminate shape="wavy" aria-label="Wavy spinner" />
          <span className="text-body-small text-on-surface-variant">Wavy</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Progress type="circular" value={65} shape="flat" aria-label="Flat 65%" />
          <span className="text-body-small text-on-surface-variant">Flat det.</span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <Progress type="circular" value={65} shape="wavy" aria-label="Wavy 65%" />
          <span className="text-body-small text-on-surface-variant">Wavy det.</span>
        </div>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// MD3 Expressive — Thick track
// ---------------------------------------------------------------------------

/**
 * Thick track (8dp) — MD3 Expressive variant with increased visual weight.
 */
export const ThickTrack: Story = {
  render: function ThickTrackRender() {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <p className="text-label-large text-on-surface-variant mb-3">Default (4dp)</p>
          <div className="flex flex-col gap-4">
            <Progress type="linear" value={55} label="Downloading" thickness="default" />
            <Progress
              type="linear"
              indeterminate
              thickness="default"
              aria-label="Loading default"
            />
          </div>
        </div>
        <div>
          <p className="text-label-large text-on-surface-variant mb-3">Thick (8dp)</p>
          <div className="flex flex-col gap-4">
            <Progress type="linear" value={55} label="Downloading thick" thickness="thick" />
            <Progress type="linear" indeterminate thickness="thick" aria-label="Loading thick" />
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Thick + Wavy — the full MD3 Expressive visual combination.
 */
export const ThickWavy: Story = {
  render: function ThickWavyRender() {
    return (
      <div className="flex flex-col gap-4">
        <Progress
          type="linear"
          value={70}
          label="Processing (thick wavy)"
          shape="wavy"
          thickness="thick"
        />
        <Progress
          type="linear"
          indeterminate
          shape="wavy"
          thickness="thick"
          aria-label="Loading thick wavy"
        />
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Gap demo
// ---------------------------------------------------------------------------

/**
 * Gap demo — illustrates the 4dp indicator-track gap at various progress values.
 */
export const GapDemo: Story = {
  render: function GapDemoRender() {
    const values = [10, 25, 50, 75, 90];
    return (
      <div className="flex flex-col gap-4">
        {values.map((v) => (
          <div key={v} className="flex items-center gap-4">
            <span className="text-label-medium text-on-surface-variant w-12 text-right">{v}%</span>
            <div className="flex-1">
              <Progress type="linear" value={v} aria-label={`Progress ${v}%`} />
            </div>
          </div>
        ))}
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// All shapes showcase
// ---------------------------------------------------------------------------

/**
 * All shapes — comprehensive view of every shape × thickness × state combination.
 */
export const AllShapes: Story = {
  render: function AllShapesRender() {
    return (
      <div className="flex flex-col gap-10">
        {/* Linear */}
        <section>
          <h3 className="text-title-medium text-on-surface mb-4">Linear</h3>
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-label-small text-on-surface-variant mb-2">Flat · Default (4dp)</p>
              <div className="flex flex-col gap-3">
                <Progress type="linear" value={50} label="Determinate 50%" />
                <Progress type="linear" indeterminate aria-label="Linear flat indeterminate" />
              </div>
            </div>
            <div>
              <p className="text-label-small text-on-surface-variant mb-2">Flat · Thick (8dp)</p>
              <div className="flex flex-col gap-3">
                <Progress type="linear" value={50} thickness="thick" label="Thick det. 50%" />
                <Progress
                  type="linear"
                  indeterminate
                  thickness="thick"
                  aria-label="Thick flat indet."
                />
              </div>
            </div>
            <div>
              <p className="text-label-small text-on-surface-variant mb-2">Wavy · Default (4dp)</p>
              <div className="flex flex-col gap-3">
                <Progress type="linear" value={50} shape="wavy" label="Wavy det. 50%" />
                <Progress type="linear" indeterminate shape="wavy" aria-label="Wavy indet." />
              </div>
            </div>
            <div>
              <p className="text-label-small text-on-surface-variant mb-2">Wavy · Thick (8dp)</p>
              <div className="flex flex-col gap-3">
                <Progress
                  type="linear"
                  value={50}
                  shape="wavy"
                  thickness="thick"
                  label="Wavy thick det. 50%"
                />
                <Progress
                  type="linear"
                  indeterminate
                  shape="wavy"
                  thickness="thick"
                  aria-label="Wavy thick indet."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Circular */}
        <section>
          <h3 className="text-title-medium text-on-surface mb-4">Circular</h3>
          <div className="flex flex-wrap items-end gap-8">
            {(["flat", "wavy"] as const).map((shape) =>
              (["default", "thick"] as const).map((thickness) =>
                (["small", "medium", "large"] as const).map((size) => (
                  <div
                    key={`${shape}-${thickness}-${size}`}
                    className="flex flex-col items-center gap-2"
                  >
                    <Progress
                      type="circular"
                      indeterminate
                      size={size}
                      shape={shape}
                      thickness={thickness}
                      aria-label={`${shape} ${thickness} ${size}`}
                    />
                    <span className="text-label-small text-on-surface-variant capitalize">
                      {shape} · {thickness} · {size}
                    </span>
                  </div>
                ))
              )
            )}
          </div>
        </section>
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Label stories
// ---------------------------------------------------------------------------

/**
 * With visible label — rendered above the indicator and linked via aria-labelledby.
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
        {(["small", "medium", "large"] as const).map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <Progress type="circular" indeterminate size={size} aria-label={`Loading ${size}`} />
            <span className="text-body-small text-on-surface-variant capitalize">{size}</span>
          </div>
        ))}
      </div>
    );
  },
};

// ---------------------------------------------------------------------------
// Interactive playground
// ---------------------------------------------------------------------------

/**
 * Playground — interactive slider to explore progress values, shape and thickness.
 */
export const Playground: Story = {
  render: function PlaygroundRender() {
    const [value, setValue] = useState(30);
    const [isIndeterminate, setIsIndeterminate] = useState(false);
    const [shape, setShape] = useState<"flat" | "wavy">("flat");
    const [thickness, setThickness] = useState<"default" | "thick">("default");

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
          <div className="flex flex-wrap gap-4">
            <label className="text-body-medium text-on-surface flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={isIndeterminate}
                onChange={(e) => setIsIndeterminate(e.target.checked)}
              />
              Indeterminate
            </label>
            <label className="text-body-medium text-on-surface flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={shape === "wavy"}
                onChange={(e) => setShape(e.target.checked ? "wavy" : "flat")}
              />
              Wavy shape
            </label>
            <label className="text-body-medium text-on-surface flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={thickness === "thick"}
                onChange={(e) => setThickness(e.target.checked ? "thick" : "default")}
              />
              Thick (8dp)
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
            shape={shape}
            thickness={thickness}
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
            shape={shape}
            thickness={thickness}
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
        <div className="flex flex-col gap-4">
          <Progress type="linear" value={progress} label={`Uploading… ${progress}%`} />
          <Progress
            type="linear"
            value={progress}
            shape="wavy"
            thickness="thick"
            label={`Wavy thick… ${progress}%`}
          />
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
