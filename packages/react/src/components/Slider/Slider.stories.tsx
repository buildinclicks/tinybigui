"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Slider } from "./Slider";
import type { SliderSize } from "./Slider.types";

// ─── Icon helpers ─────────────────────────────────────────────────────────────

function VolumeIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
    </svg>
  );
}

function BrightnessIcon(): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
      <path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zm-2 5.79V18h-3.52L12 20.48 9.52 18H6v-3.52L3.52 12 6 9.52V6h3.52L12 3.52 14.48 6H18v3.52L20.48 12 18 14.48zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
    </svg>
  );
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

/**
 * Material Design 3 Slider Component
 *
 * Allows users to make selections from a range of values. Supports Standard,
 * Centered, and Range variants with five MD3 Expressive size presets, both
 * horizontal and vertical orientations, discrete stops, value indicators, and
 * inset icons.
 *
 * ## Features
 * - ✅ Standard, Centered, and Range variants
 * - ✅ Five sizes: XSmall, Small, Medium, Large, XLarge
 * - ✅ Horizontal and vertical orientations
 * - ✅ Discrete mode with stop indicators
 * - ✅ Floating value indicator label on press
 * - ✅ Inset icon inside active track (Medium–XLarge)
 * - ✅ Full keyboard: Arrow keys, Page Up/Down, Home, End
 * - ✅ Screen reader support via React Aria
 * - ✅ MD3 spring-based motion tokens
 * - ✅ Respects prefers-reduced-motion
 *
 * ## MD3 Size Specifications
 * | Size   | Handle H | Track H | Icon |
 * |--------|----------|---------|------|
 * | xsmall | 44dp     | 16dp    | No   |
 * | small  | 44dp     | 16dp    | No   |
 * | medium | 52dp     | 40dp    | Yes  |
 * | large  | 68dp     | 56dp    | Yes  |
 * | xlarge | 108dp    | 96dp    | Yes  |
 */
const meta: Meta<typeof Slider> = {
  title: "Components/Slider",
  component: Slider,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "MD3 Slider — allows users to make selections from a range of values. Supports Standard, Centered, and Range variants with five size presets, both horizontal and vertical orientations, discrete stops, value indicators, and inset icons.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["standard", "centered", "range"],
      description: "Structural variant of the slider.",
    },
    size: {
      control: "radio",
      options: ["xsmall", "small", "medium", "large", "xlarge"],
      description: "MD3 Expressive size preset.",
    },
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
      description: "Track orientation.",
    },
    minValue: { control: "number", description: "Minimum value." },
    maxValue: { control: "number", description: "Maximum value." },
    step: { control: "number", description: "Step increment (discrete mode)." },
    showStops: { control: "boolean", description: "Show stop indicators." },
    showValueIndicator: {
      control: "boolean",
      description: "Show floating value label on press.",
    },
    isDisabled: { control: "boolean", description: "Disabled state." },
    label: { control: "text", description: "Visible label text." },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

// ─── 1. Default (Playground) ──────────────────────────────────────────────────

/**
 * Default MD3 slider in XSmall size. Drag the handle or use keyboard arrows
 * to change the value.
 */
export const Default: Story = {
  args: {
    label: "Volume",
    defaultValue: [50],
    size: "xsmall",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default MD3 slider in XSmall size. Drag the handle or use keyboard arrows to change the value.",
      },
    },
  },
};

// ─── 2. All Sizes ─────────────────────────────────────────────────────────────

/**
 * All five MD3 Expressive size presets side-by-side at 50% value.
 * XSmall and Small share the same 16dp track height; Medium introduces the
 * taller track and icon support; Large and XLarge progressively increase for
 * touch-optimised interfaces.
 */
export const AllSizes: Story = {
  render: function AllSizesRender() {
    const sizes: Array<{ size: SliderSize; label: string }> = [
      { size: "xsmall", label: "XSmall (default)" },
      { size: "small", label: "Small" },
      { size: "medium", label: "Medium" },
      { size: "large", label: "Large" },
      { size: "xlarge", label: "XLarge" },
    ];
    return (
      <div className="flex w-full max-w-md flex-col gap-8">
        {sizes.map(({ size, label }) => (
          <div key={size} className="flex flex-col gap-1">
            <span className="text-label-small text-on-surface-variant">{label}</span>
            <Slider label={label} defaultValue={[50]} size={size} />
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "All five MD3 Expressive size presets at 50% value. Use the appropriate size for your UI density — XSmall for compact toolbars, XLarge for touch-primary surfaces.",
      },
    },
  },
};

// ─── 3. Standard Continuous ───────────────────────────────────────────────────

/**
 * Standard slider without steps — smooth continuous value selection.
 * Demonstrates a typical volume control use case.
 */
export const StandardContinuous: Story = {
  args: {
    label: "Volume",
    defaultValue: [65],
    size: "xsmall",
    minValue: 0,
    maxValue: 100,
    showValueIndicator: true,
    formatValue: (v: number) => `${Math.round(v)}%`,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Standard continuous slider. No step constraint — the value is a smooth float clamped to [min, max]. Press and hold the handle to reveal the value indicator.",
      },
    },
  },
};

// ─── 4. Standard Discrete (With Stops) ────────────────────────────────────────

/**
 * Standard slider with `step={10}` and `showStops`. Shows 11 stop indicators
 * at 0, 10, 20, … 100. Use this for rating or level selection where only
 * specific values are meaningful.
 */
export const StandardDiscrete: Story = {
  args: {
    label: "Quality level",
    defaultValue: [50],
    size: "small",
    step: 10,
    showStops: true,
    showValueIndicator: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Discrete slider with `step={10}` and stop indicators. Snaps to 0, 10, 20 … 100. Each dot marks a valid stop position — active-track dots are bg-on-primary, inactive-track dots are bg-on-secondary-container.",
      },
    },
  },
};

// ─── 5. Centered Slider ───────────────────────────────────────────────────────

/**
 * Centered variant with `minValue={-100}` and `maxValue={100}`. The fill
 * direction changes depending on whether the value is positive or negative,
 * making it ideal for balance or pan controls.
 */
export const CenteredSlider: Story = {
  args: {
    variant: "centered",
    label: "Balance",
    defaultValue: [0],
    minValue: -100,
    maxValue: 100,
    size: "small",
    showValueIndicator: true,
    formatValue: (v: number) => (v > 0 ? `R${v}` : v < 0 ? `L${Math.abs(v)}` : "C"),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Centered variant — fill extends from the centre point toward the handle. Positive values fill right, negative values fill left. Perfect for audio balance, pan, or EQ controls.",
      },
    },
  },
};

// ─── 6. Range Slider ──────────────────────────────────────────────────────────

/**
 * Range variant with two handles defining a min/max price window.
 * Demonstrates the price filter use case with `formatValue`.
 */
export const RangeSlider: Story = {
  args: {
    variant: "range",
    label: "Price range",
    defaultValue: [200, 800],
    minValue: 0,
    maxValue: 1000,
    size: "xsmall",
    showValueIndicator: true,
    formatValue: (v: number) => `$${v}`,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Range variant with two independent handles. The active track fills the area between the two thumbs. Use `formatValue` to display currency or unit labels on the value indicator.",
      },
    },
  },
};

// ─── 7. With Value Indicator ──────────────────────────────────────────────────

/**
 * Slider with `showValueIndicator`. A floating pill label appears above the
 * thumb while it is pressed, then smoothly fades and scales out on release.
 */
export const WithValueIndicator: Story = {
  args: {
    label: "Brightness",
    defaultValue: [75],
    size: "xsmall",
    showValueIndicator: true,
    formatValue: (v: number) => `${Math.round(v)}%`,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Shows the floating value indicator that appears while the thumb is pressed. Entry animation: duration-short3 + ease-standard-decelerate. Exit: duration-short2 + ease-standard-accelerate.",
      },
    },
  },
};

// ─── 8. With Inset Icon ───────────────────────────────────────────────────────

/**
 * Medium-sized slider with a volume icon rendered inside the active track.
 * Available for Medium, Large, and XLarge sizes on the Standard variant only.
 */
export const WithInsetIcon: Story = {
  args: {
    label: "Volume",
    defaultValue: [60],
    size: "medium",
    icon: <VolumeIcon />,
    showValueIndicator: true,
    formatValue: (v: number) => `${Math.round(v)}%`,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Inset icon appears inside the active track for Medium, Large, and XLarge sizes on the Standard variant. The icon uses text-on-primary coloring and is hidden at XSmall and Small sizes per MD3 spec.",
      },
    },
  },
};

// ─── 9. Vertical Orientation ──────────────────────────────────────────────────

/**
 * Vertical slider demonstrating an audio channel level control.
 * The container must have a fixed height when orientation is "vertical".
 */
export const VerticalOrientation: Story = {
  render: function VerticalOrientationRender() {
    return (
      <div className="flex h-[300px] items-end gap-8">
        <div className="flex h-full flex-col items-center gap-2">
          <span className="text-label-small text-on-surface-variant">L</span>
          <Slider
            label="Left channel"
            defaultValue={[70]}
            orientation="vertical"
            size="small"
            showValueIndicator
          />
        </div>
        <div className="flex h-full flex-col items-center gap-2">
          <span className="text-label-small text-on-surface-variant">C</span>
          <Slider
            label="Centre channel"
            defaultValue={[85]}
            orientation="vertical"
            size="small"
            showValueIndicator
          />
        </div>
        <div className="flex h-full flex-col items-center gap-2">
          <span className="text-label-small text-on-surface-variant">R</span>
          <Slider
            label="Right channel"
            defaultValue={[60]}
            orientation="vertical"
            size="small"
            showValueIndicator
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Vertical orientation — track runs bottom-to-top. ArrowUp increases, ArrowDown decreases. Wrap the slider in a container with a fixed height (e.g. `h-[300px]`) to define the track length.",
      },
    },
  },
};

// ─── 10. Disabled State ───────────────────────────────────────────────────────

/**
 * All three variants in disabled state. Disabled color treatment: active track
 * becomes bg-on-surface/38, inactive track bg-on-surface/10, handle bg-on-surface/38.
 */
export const DisabledState: Story = {
  render: function DisabledStateRender() {
    return (
      <div className="flex w-full max-w-md flex-col gap-6">
        <div className="flex flex-col gap-1">
          <span className="text-label-small text-on-surface-variant">Standard — disabled</span>
          <Slider label="Volume" defaultValue={[50]} isDisabled />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-label-small text-on-surface-variant">Centered — disabled</span>
          <Slider
            variant="centered"
            label="Balance"
            defaultValue={[30]}
            minValue={-100}
            maxValue={100}
            isDisabled
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-label-small text-on-surface-variant">Range — disabled</span>
          <Slider variant="range" label="Price range" defaultValue={[25, 75]} isDisabled />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "All three variants in disabled state. The slider is focusable but not interactive. MD3 disabled tokens: active track bg-on-surface opacity-38, inactive track bg-on-surface/10.",
      },
    },
  },
};

// ─── 11. Controlled ───────────────────────────────────────────────────────────

/**
 * Controlled slider with external state management. The current value is
 * displayed outside the component and quick-set buttons demonstrate
 * programmatic value changes.
 */
export const Controlled: Story = {
  render: function ControlledRender() {
    const [value, setValue] = useState([40]);

    return (
      <div className="flex w-full max-w-md flex-col gap-4">
        <Slider
          label="Temperature"
          value={value}
          onChange={setValue}
          minValue={0}
          maxValue={100}
          size="xsmall"
          showValueIndicator
          formatValue={(v) => `${Math.round(v)}°C`}
        />
        <p className="text-body-medium text-on-surface">
          Current value: <strong>{value[0]}°C</strong>
        </p>
        <div className="flex flex-wrap gap-2">
          {([0, 20, 40, 60, 80, 100] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setValue([v])}
              className="bg-secondary-container text-on-secondary-container text-label-medium rounded-full px-3 py-1"
            >
              {v}°C
            </button>
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Controlled slider — value is managed by external state. Use `value` + `onChange` props for controlled mode. The quick-set buttons demonstrate programmatic value changes.",
      },
    },
  },
};

// ─── 12. Range With Custom Labels ─────────────────────────────────────────────

/**
 * Range slider with custom `thumbLabels` for accessible screen-reader
 * differentiation between the two handles. The `formatValue` prop formats
 * the displayed values as a price range.
 */
export const RangeWithCustomLabels: Story = {
  args: {
    variant: "range",
    label: "Budget range",
    defaultValue: [150, 650],
    minValue: 0,
    maxValue: 1000,
    thumbLabels: ["Minimum budget", "Maximum budget"],
    showValueIndicator: true,
    formatValue: (v: number) => `$${v}`,
    size: "xsmall",
  },
  parameters: {
    docs: {
      description: {
        story:
          'Range slider with custom `thumbLabels` — screen readers announce "Minimum budget slider" and "Maximum budget slider" instead of the defaults "Minimum" and "Maximum".',
      },
    },
  },
};

// ─── 13. All Variants Comparison ──────────────────────────────────────────────

/**
 * Side-by-side comparison of all three variants at the same Small size,
 * showing how the fill direction differs between Standard, Centered, and Range.
 */
export const AllVariantsComparison: Story = {
  render: function AllVariantsComparisonRender() {
    return (
      <div className="flex w-full max-w-md flex-col gap-8">
        <div className="flex flex-col gap-1">
          <span className="text-label-small text-on-surface-variant">Standard</span>
          <Slider label="Volume" defaultValue={[60]} size="small" showValueIndicator />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-label-small text-on-surface-variant">Centered</span>
          <Slider
            variant="centered"
            label="Pan"
            defaultValue={[25]}
            minValue={-100}
            maxValue={100}
            size="small"
            showValueIndicator
            formatValue={(v) => (v > 0 ? `R${v}` : v < 0 ? `L${Math.abs(v)}` : "C")}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-label-small text-on-surface-variant">Range</span>
          <Slider
            variant="range"
            label="Rating range"
            defaultValue={[3, 8]}
            minValue={1}
            maxValue={10}
            step={1}
            showStops
            size="small"
            showValueIndicator
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Side-by-side comparison of Standard, Centered, and Range variants at Small size. Standard fills from the start; Centered fills from the midpoint; Range fills the area between two thumbs.",
      },
    },
  },
};

// ─── 14. Sizes With Icon ──────────────────────────────────────────────────────

/**
 * Medium, Large, and XLarge sizes with an inset brightness icon. The icon
 * size scales with the track: 24×24dp for Medium/Large, 32×32dp for XLarge.
 */
export const SizesWithIcon: Story = {
  render: function SizesWithIconRender() {
    const sizes: Array<{ size: SliderSize; label: string }> = [
      { size: "medium", label: "Medium" },
      { size: "large", label: "Large" },
      { size: "xlarge", label: "XLarge" },
    ];
    return (
      <div className="flex w-full max-w-md flex-col gap-8">
        {sizes.map(({ size, label }) => (
          <div key={size} className="flex flex-col gap-1">
            <span className="text-label-small text-on-surface-variant">{label} + icon</span>
            <Slider
              label={label}
              defaultValue={[65]}
              size={size}
              icon={<BrightnessIcon />}
              showValueIndicator
              formatValue={(v) => `${Math.round(v)}%`}
            />
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Inset icon feature shown at Medium, Large, and XLarge sizes. The icon is unavailable at XSmall and Small per MD3 spec §5.1. Only applies to the Standard variant.",
      },
    },
  },
};

// ─── 15. Vertical Sizes ───────────────────────────────────────────────────────

/**
 * All five sizes in vertical orientation for visual comparison.
 * Demonstrates how the track thickness scales in the vertical axis.
 */
export const VerticalSizes: Story = {
  render: function VerticalSizesRender() {
    const sizes: Array<{ size: SliderSize; label: string }> = [
      { size: "xsmall", label: "XS" },
      { size: "small", label: "S" },
      { size: "medium", label: "M" },
      { size: "large", label: "L" },
      { size: "xlarge", label: "XL" },
    ];
    return (
      <div className="flex items-end gap-8" style={{ height: "280px" }}>
        {sizes.map(({ size, label }) => (
          <div key={size} className="flex h-full flex-col items-center gap-2">
            <Slider
              label={label}
              defaultValue={[50]}
              orientation="vertical"
              size={size}
              showValueIndicator
            />
            <span className="text-label-small text-on-surface-variant">{label}</span>
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "All five sizes in vertical orientation. The track width scales with the size preset — XSmall is 16dp wide, XLarge is 96dp wide.",
      },
    },
  },
};

// ─── Bonus: Discrete Temperature ─────────────────────────────────────────────

/**
 * Discrete centered slider with step and stops — a thermostat-style control.
 * Demonstrates combining centered variant with stop indicators.
 */
export const DiscreteTemperature: Story = {
  args: {
    variant: "centered",
    label: "Temperature offset",
    defaultValue: [0],
    minValue: -5,
    maxValue: 5,
    step: 1,
    showStops: true,
    showValueIndicator: true,
    size: "small",
    formatValue: (v: number) => (v > 0 ? `+${v}°` : `${v}°`),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Centered discrete slider — combines `variant="centered"` with `step={1}` and `showStops`. Ideal for thermostat offset or EQ band adjustments.',
      },
    },
  },
};
