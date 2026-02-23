import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Switch } from "./Switch";

/**
 * Material Design 3 Switch Component
 *
 * A switch represents on/off values (unlike checkbox which represents selection).
 * Built with React Aria for accessibility and styled with MD3 design tokens.
 *
 * ## Features
 * - ✅ On/off states (not selection)
 * - ✅ Optional icons in handle
 * - ✅ Full keyboard support (Space/Enter)
 * - ✅ Screen reader support
 * - ✅ Ripple effect
 * - ✅ Form integration
 *
 * ## MD3 Specifications
 * - Track: 52x32dp
 * - Handle: 16dp (off), 24dp (on), 28dp (pressed)
 * - State layers: 8% hover, 12% focus/pressed
 */
const meta: Meta<typeof Switch> = {
  title: "Components/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
      description: "Label text for the switch",
    },
    isSelected: {
      control: "boolean",
      description: "Whether the switch is on (controlled)",
    },
    defaultSelected: {
      control: "boolean",
      description: "Whether the switch is on by default (uncontrolled)",
    },
    isDisabled: {
      control: "boolean",
      description: "Whether the switch is disabled",
    },
    isReadOnly: {
      control: "boolean",
      description: "Whether the switch is read-only",
    },
    disableRipple: {
      control: "boolean",
      description: "Disable the ripple effect",
    },
    onChange: {
      action: "changed",
      description: "Callback fired when state changes",
    },
    name: {
      control: "text",
      description: "Name for form submission",
    },
    value: {
      control: "text",
      description: "Value for form submission",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Switch component representing on/off states. Uses React Aria for accessibility and follows Material Design 3 specifications.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

// Sample icons for demonstration
const IconClose = (): JSX.Element => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

const IconCheck = (): JSX.Element => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

const IconPower = (): JSX.Element => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M16 9v4.66l-3.5 3.51V19h-1v-1.83L8 13.65V9h8m0-6h-2v4h-4V3H8v4h-.01C6.9 6.99 6 7.89 6 8.98v5.52L9.5 18v3h5v-3l3.5-3.5V9c0-1.1-.9-2-2-2V3z" />
  </svg>
);

const IconBluetooth = (): JSX.Element => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z" />
  </svg>
);

/**
 * Default switch with label
 */
export const Default: Story = {
  args: {
    children: "Low power mode",
  },
};

/**
 * Switch in selected (on) state
 */
export const Selected: Story = {
  args: {
    children: "Notifications enabled",
    defaultSelected: true,
  },
};

/**
 * Switch in unselected (off) state
 */
export const Unselected: Story = {
  args: {
    children: "Notifications disabled",
    defaultSelected: false,
  },
};

/**
 * Switch with icon when off
 */
export const WithIcon: Story = {
  args: {
    children: "Airplane mode",
    icon: <IconClose />,
  },
};

/**
 * Switch with icon when on
 */
export const WithSelectedIcon: Story = {
  args: {
    children: "Bluetooth",
    defaultSelected: true,
    selectedIcon: <IconCheck />,
  },
};

/**
 * Switch with both icons (off and on states)
 */
export const WithBothIcons: Story = {
  args: {
    children: "Power saving",
    icon: <IconClose />,
    selectedIcon: <IconCheck />,
  },
};

/**
 * Disabled switch (off state)
 */
export const Disabled: Story = {
  args: {
    children: "Disabled option",
    isDisabled: true,
  },
};

/**
 * Disabled switch (on state)
 */
export const DisabledSelected: Story = {
  args: {
    children: "Disabled option (on)",
    defaultSelected: true,
    isDisabled: true,
  },
};

/**
 * Read-only switch
 */
export const ReadOnly: Story = {
  args: {
    children: "Read-only switch",
    defaultSelected: true,
    isReadOnly: true,
  },
};

/**
 * Switch without label (requires aria-label)
 */
export const WithoutLabel: Story = {
  args: {
    "aria-label": "Toggle feature",
  },
};

/**
 * Switch with no ripple effect
 */
export const NoRipple: Story = {
  args: {
    children: "No ripple effect",
    disableRipple: true,
  },
};

/**
 * Controlled switch example
 */
export const Controlled: Story = {
  render: function ControlledRender() {
    const [isOn, setIsOn] = useState(false);

    return (
      <div className="space-y-4">
        <Switch isSelected={isOn} onChange={setIsOn}>
          Notifications
        </Switch>
        <p className="text-on-surface-variant text-sm">
          Status: <strong>{isOn ? "ON" : "OFF"}</strong>
        </p>
        <button
          type="button"
          onClick={() => setIsOn(!isOn)}
          className="bg-primary text-on-primary rounded-full px-4 py-2"
        >
          Toggle programmatically
        </button>
      </div>
    );
  },
};

/**
 * Form integration example
 */
export const FormIntegration: Story = {
  render: function FormIntegrationRender() {
    const handleSubmit = (e: React.FormEvent): void => {
      e.preventDefault();
      const formData = new FormData(e.target as HTMLFormElement);
      const settings = {
        darkMode: formData.get("darkMode"),
        notifications: formData.get("notifications"),
        autoSave: formData.get("autoSave"),
      };
      alert(JSON.stringify(settings, null, 2));
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <Switch name="darkMode" value="enabled" defaultSelected>
          Dark mode
        </Switch>
        <Switch name="notifications" value="enabled">
          Push notifications
        </Switch>
        <Switch name="autoSave" value="enabled" defaultSelected>
          Auto-save
        </Switch>
        <button type="submit" className="bg-primary text-on-primary rounded-full px-4 py-2">
          Submit
        </button>
      </form>
    );
  },
};

/**
 * All states showcase
 */
export const AllStates: Story = {
  render: function AllStatesRender() {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Basic States</h3>
          <div className="space-y-2">
            <Switch>Off (default)</Switch>
            <Switch defaultSelected>On</Switch>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">With Icons</h3>
          <div className="space-y-2">
            <Switch icon={<IconClose />} selectedIcon={<IconCheck />}>
              Toggle with icons
            </Switch>
            <Switch icon={<IconClose />} selectedIcon={<IconCheck />} defaultSelected>
              Toggle with icons (on)
            </Switch>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Disabled States</h3>
          <div className="space-y-2">
            <Switch isDisabled>Disabled (off)</Switch>
            <Switch isDisabled defaultSelected>
              Disabled (on)
            </Switch>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Read-only States</h3>
          <div className="space-y-2">
            <Switch isReadOnly>Read-only (off)</Switch>
            <Switch isReadOnly defaultSelected>
              Read-only (on)
            </Switch>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Without Labels</h3>
          <div className="space-y-2">
            <Switch aria-label="Toggle option 1" />
            <Switch aria-label="Toggle option 2" defaultSelected />
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Interactive playground with multiple switches
 */
export const Playground: Story = {
  render: function PlaygroundRender() {
    const [settings, setSettings] = useState({
      bluetooth: true,
      wifi: true,
      airplane: false,
      lowPower: false,
      autoUpdate: true,
    });

    const updateSetting =
      (key: keyof typeof settings) =>
      (value: boolean): void => {
        setSettings((prev) => ({ ...prev, [key]: value }));
      };

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Device Settings</h3>
        <div className="space-y-3">
          <Switch
            isSelected={settings.bluetooth}
            onChange={updateSetting("bluetooth")}
            selectedIcon={<IconBluetooth />}
          >
            Bluetooth
          </Switch>
          <Switch
            isSelected={settings.wifi}
            onChange={updateSetting("wifi")}
            selectedIcon={<IconCheck />}
          >
            Wi-Fi
          </Switch>
          <Switch
            isSelected={settings.airplane}
            onChange={updateSetting("airplane")}
            icon={<IconClose />}
            selectedIcon={<IconCheck />}
          >
            Airplane mode
          </Switch>
          <Switch
            isSelected={settings.lowPower}
            onChange={updateSetting("lowPower")}
            selectedIcon={<IconPower />}
          >
            Low power mode
          </Switch>
          <Switch isSelected={settings.autoUpdate} onChange={updateSetting("autoUpdate")}>
            Automatic updates
          </Switch>
        </div>
        <div className="bg-surface-container-high mt-6 rounded-lg p-4">
          <p className="text-on-surface-variant mb-2 text-sm">Current Settings:</p>
          <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        </div>
      </div>
    );
  },
};
