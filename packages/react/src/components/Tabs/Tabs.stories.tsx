import { useState } from "react";
import type React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";
import { TabList } from "./TabList";
import { Tab } from "./Tab";
import { TabPanel } from "./TabPanel";

// ─── Sample icons ─────────────────────────────────────────────────────────────

const IconPhoto = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
  </svg>
);

const IconMusic = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
  </svg>
);

const IconVideo = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
  </svg>
);

const IconFavorite = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const IconSettings = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
);

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Material Design 3 Tabs component. Supports primary and secondary variants, fixed and scrollable layouts, icon-only, label-only, and icon+label content modes, badges, disabled tabs, and full keyboard navigation.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary"],
      description: "Active indicator and label color variant",
    },
    layout: {
      control: "select",
      options: ["fixed", "scrollable"],
      description: "Tab row layout mode",
    },
    defaultSelectedKey: {
      control: "text",
      description: "Default selected tab key (uncontrolled)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  render: (args) => (
    <Tabs {...args} aria-label="Default tabs" defaultSelectedKey="photos">
      <TabList>
        <Tab id="photos" label="Photos" />
        <Tab id="music" label="Music" />
        <Tab id="videos" label="Videos" />
      </TabList>
      <TabPanel id="photos">
        <p className="p-4">Photos tab content</p>
      </TabPanel>
      <TabPanel id="music">
        <p className="p-4">Music tab content</p>
      </TabPanel>
      <TabPanel id="videos">
        <p className="p-4">Videos tab content</p>
      </TabPanel>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Default tabs with primary variant and fixed layout. Click or use arrow keys to switch tabs.",
      },
    },
  },
};

// ─── Variants ─────────────────────────────────────────────────────────────────

export const PrimaryVariant: Story = {
  render: () => (
    <Tabs aria-label="Primary tabs" defaultSelectedKey="photos" variant="primary">
      <TabList>
        <Tab id="photos" label="Photos" />
        <Tab id="music" label="Music" />
        <Tab id="videos" label="Videos" />
      </TabList>
      <TabPanel id="photos">
        <p className="p-4">Photos content</p>
      </TabPanel>
      <TabPanel id="music">
        <p className="p-4">Music content</p>
      </TabPanel>
      <TabPanel id="videos">
        <p className="p-4">Videos content</p>
      </TabPanel>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Primary variant: active indicator is `bg-primary`, active label is `text-primary`. Default variant for top-level navigation.",
      },
    },
  },
};

export const SecondaryVariant: Story = {
  render: () => (
    <Tabs aria-label="Secondary tabs" defaultSelectedKey="photos" variant="secondary">
      <TabList>
        <Tab id="photos" label="Photos" />
        <Tab id="music" label="Music" />
        <Tab id="videos" label="Videos" />
      </TabList>
      <TabPanel id="photos">
        <p className="p-4">Photos content</p>
      </TabPanel>
      <TabPanel id="music">
        <p className="p-4">Music content</p>
      </TabPanel>
      <TabPanel id="videos">
        <p className="p-4">Videos content</p>
      </TabPanel>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Secondary variant: active indicator is `bg-on-surface-variant`, active label is `text-on-surface`. Used for sub-navigation inside a page.",
      },
    },
  },
};

export const BothVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-on-surface-variant mb-2 text-sm font-medium">Primary</p>
        <Tabs aria-label="Primary tabs" defaultSelectedKey="tab1" variant="primary">
          <TabList>
            <Tab id="tab1" label="Overview" />
            <Tab id="tab2" label="Details" />
            <Tab id="tab3" label="Reviews" />
          </TabList>
          <TabPanel id="tab1">
            <p className="p-4">Overview content</p>
          </TabPanel>
          <TabPanel id="tab2">
            <p className="p-4">Details content</p>
          </TabPanel>
          <TabPanel id="tab3">
            <p className="p-4">Reviews content</p>
          </TabPanel>
        </Tabs>
      </div>
      <div>
        <p className="text-on-surface-variant mb-2 text-sm font-medium">Secondary</p>
        <Tabs aria-label="Secondary tabs" defaultSelectedKey="tab1" variant="secondary">
          <TabList>
            <Tab id="tab1" label="Overview" />
            <Tab id="tab2" label="Details" />
            <Tab id="tab3" label="Reviews" />
          </TabList>
          <TabPanel id="tab1">
            <p className="p-4">Overview content</p>
          </TabPanel>
          <TabPanel id="tab2">
            <p className="p-4">Details content</p>
          </TabPanel>
          <TabPanel id="tab3">
            <p className="p-4">Reviews content</p>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  ),
};

// ─── Layouts ──────────────────────────────────────────────────────────────────

export const FixedLayout: Story = {
  render: () => (
    <Tabs aria-label="Fixed layout tabs" defaultSelectedKey="photos" layout="fixed">
      <TabList>
        <Tab id="photos" label="Photos" />
        <Tab id="music" label="Music" />
        <Tab id="videos" label="Videos" />
      </TabList>
      <TabPanel id="photos">
        <p className="p-4">Photos content</p>
      </TabPanel>
      <TabPanel id="music">
        <p className="p-4">Music content</p>
      </TabPanel>
      <TabPanel id="videos">
        <p className="p-4">Videos content</p>
      </TabPanel>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Fixed layout: all tabs share the full container width equally (`flex-1`). Best for 2–5 tabs.",
      },
    },
  },
};

export const ScrollableLayout: Story = {
  render: () => (
    <div className="w-72">
      <Tabs aria-label="Scrollable layout tabs" defaultSelectedKey="tab1" layout="scrollable">
        <TabList>
          <Tab id="tab1" label="Photos" />
          <Tab id="tab2" label="Music" />
          <Tab id="tab3" label="Videos" />
          <Tab id="tab4" label="Favorites" />
          <Tab id="tab5" label="Settings" />
          <Tab id="tab6" label="Profile" />
        </TabList>
        <TabPanel id="tab1">
          <p className="p-4">Photos content</p>
        </TabPanel>
        <TabPanel id="tab2">
          <p className="p-4">Music content</p>
        </TabPanel>
        <TabPanel id="tab3">
          <p className="p-4">Videos content</p>
        </TabPanel>
        <TabPanel id="tab4">
          <p className="p-4">Favorites content</p>
        </TabPanel>
        <TabPanel id="tab5">
          <p className="p-4">Settings content</p>
        </TabPanel>
        <TabPanel id="tab6">
          <p className="p-4">Profile content</p>
        </TabPanel>
      </Tabs>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Scrollable layout: tabs overflow horizontally with minimum width. Ideal for 5+ tabs or narrow containers. Scroll horizontally to see all tabs.",
      },
    },
  },
};

// ─── Content Modes ────────────────────────────────────────────────────────────

export const LabelOnly: Story = {
  render: () => (
    <Tabs aria-label="Label only tabs" defaultSelectedKey="photos">
      <TabList>
        <Tab id="photos" label="Photos" />
        <Tab id="music" label="Music" />
        <Tab id="videos" label="Videos" />
      </TabList>
      <TabPanel id="photos">
        <p className="p-4">Photos content</p>
      </TabPanel>
      <TabPanel id="music">
        <p className="p-4">Music content</p>
      </TabPanel>
      <TabPanel id="videos">
        <p className="p-4">Videos content</p>
      </TabPanel>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story: "Label-only content mode. Each tab has a text label with no icon.",
      },
    },
  },
};

export const IconOnly: Story = {
  render: () => (
    <Tabs aria-label="Icon only tabs" defaultSelectedKey="photos">
      <TabList>
        <Tab id="photos" icon={<IconPhoto />} aria-label="Photos" />
        <Tab id="music" icon={<IconMusic />} aria-label="Music" />
        <Tab id="videos" icon={<IconVideo />} aria-label="Videos" />
      </TabList>
      <TabPanel id="photos">
        <p className="p-4">Photos content</p>
      </TabPanel>
      <TabPanel id="music">
        <p className="p-4">Music content</p>
      </TabPanel>
      <TabPanel id="videos">
        <p className="p-4">Videos content</p>
      </TabPanel>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Icon-only content mode. Provide `aria-label` on each Tab for screen reader accessibility.",
      },
    },
  },
};

export const IconAndLabel: Story = {
  render: () => (
    <Tabs aria-label="Icon and label tabs" defaultSelectedKey="photos">
      <TabList>
        <Tab id="photos" icon={<IconPhoto />} label="Photos" />
        <Tab id="music" icon={<IconMusic />} label="Music" />
        <Tab id="videos" icon={<IconVideo />} label="Videos" />
      </TabList>
      <TabPanel id="photos">
        <p className="p-4">Photos content</p>
      </TabPanel>
      <TabPanel id="music">
        <p className="p-4">Music content</p>
      </TabPanel>
      <TabPanel id="videos">
        <p className="p-4">Videos content</p>
      </TabPanel>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story: "Icon + label content mode. Icon is stacked above the label per MD3 specification.",
      },
    },
  },
};

export const AllContentModes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-on-surface-variant mb-2 text-sm font-medium">Label only</p>
        <Tabs aria-label="Label only" defaultSelectedKey="a">
          <TabList>
            <Tab id="a" label="Photos" />
            <Tab id="b" label="Music" />
            <Tab id="c" label="Videos" />
          </TabList>
          <TabPanel id="a">
            <p className="p-4">Content</p>
          </TabPanel>
          <TabPanel id="b">
            <p className="p-4">Content</p>
          </TabPanel>
          <TabPanel id="c">
            <p className="p-4">Content</p>
          </TabPanel>
        </Tabs>
      </div>
      <div>
        <p className="text-on-surface-variant mb-2 text-sm font-medium">Icon only</p>
        <Tabs aria-label="Icon only" defaultSelectedKey="a">
          <TabList>
            <Tab id="a" icon={<IconPhoto />} aria-label="Photos" />
            <Tab id="b" icon={<IconMusic />} aria-label="Music" />
            <Tab id="c" icon={<IconVideo />} aria-label="Videos" />
          </TabList>
          <TabPanel id="a">
            <p className="p-4">Content</p>
          </TabPanel>
          <TabPanel id="b">
            <p className="p-4">Content</p>
          </TabPanel>
          <TabPanel id="c">
            <p className="p-4">Content</p>
          </TabPanel>
        </Tabs>
      </div>
      <div>
        <p className="text-on-surface-variant mb-2 text-sm font-medium">Icon + label</p>
        <Tabs aria-label="Icon and label" defaultSelectedKey="a">
          <TabList>
            <Tab id="a" icon={<IconPhoto />} label="Photos" />
            <Tab id="b" icon={<IconMusic />} label="Music" />
            <Tab id="c" icon={<IconVideo />} label="Videos" />
          </TabList>
          <TabPanel id="a">
            <p className="p-4">Content</p>
          </TabPanel>
          <TabPanel id="b">
            <p className="p-4">Content</p>
          </TabPanel>
          <TabPanel id="c">
            <p className="p-4">Content</p>
          </TabPanel>
        </Tabs>
      </div>
    </div>
  ),
};

// ─── Badges ───────────────────────────────────────────────────────────────────

export const NumericBadge: Story = {
  render: () => (
    <Tabs aria-label="Badge tabs" defaultSelectedKey="messages">
      <TabList>
        <Tab id="messages" label="Messages" badge={5} />
        <Tab id="notifications" label="Alerts" badge={23} />
        <Tab id="overflow" label="Overflow" badge={1234} />
        <Tab id="none" label="Empty" badge={0} />
      </TabList>
      <TabPanel id="messages">
        <p className="p-4">5 unread messages</p>
      </TabPanel>
      <TabPanel id="notifications">
        <p className="p-4">23 alerts</p>
      </TabPanel>
      <TabPanel id="overflow">
        <p className="p-4">999+ items (1234 actual)</p>
      </TabPanel>
      <TabPanel id="none">
        <p className="p-4">No items</p>
      </TabPanel>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Numeric badge. Values > 999 display as `999+`. Badge is `aria-hidden` to keep the tab's accessible name clean.",
      },
    },
  },
};

export const DotBadge: Story = {
  render: () => (
    <Tabs aria-label="Dot badge tabs" defaultSelectedKey="updates">
      <TabList>
        <Tab id="updates" label="Updates" badge={true} />
        <Tab id="messages" label="Messages" badge={true} />
        <Tab id="settings" label="Settings" />
      </TabList>
      <TabPanel id="updates">
        <p className="p-4">New updates available</p>
      </TabPanel>
      <TabPanel id="messages">
        <p className="p-4">New messages</p>
      </TabPanel>
      <TabPanel id="settings">
        <p className="p-4">Settings content</p>
      </TabPanel>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Dot badge (`badge={true}`): a small indicator that something is new, without showing a count.",
      },
    },
  },
};

export const BadgeWithIcons: Story = {
  render: () => (
    <Tabs aria-label="Badge with icons tabs" defaultSelectedKey="photos">
      <TabList>
        <Tab id="photos" icon={<IconPhoto />} label="Photos" badge={3} />
        <Tab id="favorites" icon={<IconFavorite />} label="Favorites" badge={true} />
        <Tab id="settings" icon={<IconSettings />} label="Settings" />
      </TabList>
      <TabPanel id="photos">
        <p className="p-4">3 new photos</p>
      </TabPanel>
      <TabPanel id="favorites">
        <p className="p-4">New favorites</p>
      </TabPanel>
      <TabPanel id="settings">
        <p className="p-4">Settings</p>
      </TabPanel>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story: "Badges with icon+label content mode. Badge appears on the icon.",
      },
    },
  },
};

// ─── Disabled ─────────────────────────────────────────────────────────────────

export const DisabledTab: Story = {
  render: () => (
    <Tabs aria-label="Tabs with disabled" defaultSelectedKey="photos">
      <TabList>
        <Tab id="photos" label="Photos" />
        <Tab id="music" label="Music" isDisabled />
        <Tab id="videos" label="Videos" />
      </TabList>
      <TabPanel id="photos">
        <p className="p-4">Photos content</p>
      </TabPanel>
      <TabPanel id="music">
        <p className="p-4">Music content (disabled)</p>
      </TabPanel>
      <TabPanel id="videos">
        <p className="p-4">Videos content</p>
      </TabPanel>
    </Tabs>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Disabled tabs are visually de-emphasized (opacity-38), not focusable, and skipped during keyboard navigation.",
      },
    },
  },
};

// ─── Controlled ───────────────────────────────────────────────────────────────

const ControlledExample = (): React.ReactElement => {
  const [selected, setSelected] = useState<React.Key>("photos");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <span className="text-on-surface-variant text-sm">Selected (from state):</span>
        <code className="text-primary font-mono text-sm">{String(selected)}</code>
      </div>
      <Tabs aria-label="Controlled tabs" selectedKey={selected} onSelectionChange={setSelected}>
        <TabList>
          <Tab id="photos" label="Photos" />
          <Tab id="music" label="Music" />
          <Tab id="videos" label="Videos" />
        </TabList>
        <TabPanel id="photos">
          <p className="p-4">Photos content</p>
        </TabPanel>
        <TabPanel id="music">
          <p className="p-4">Music content</p>
        </TabPanel>
        <TabPanel id="videos">
          <p className="p-4">Videos content</p>
        </TabPanel>
      </Tabs>
      <div className="flex gap-2">
        {["photos", "music", "videos"].map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelected(key)}
            className="rounded border px-3 py-1 text-sm capitalize"
          >
            Select {key}
          </button>
        ))}
      </div>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Controlled mode: `selectedKey` and `onSelectionChange` are managed by the parent. Use the buttons below to change the selection externally.",
      },
    },
  },
};

// ─── Kitchen sink ─────────────────────────────────────────────────────────────

export const KitchenSink: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-on-surface-variant mb-1 text-sm font-medium">
          Primary · Fixed · Icon+Label · Badges
        </p>
        <Tabs
          aria-label="Kitchen sink primary"
          defaultSelectedKey="photos"
          variant="primary"
          layout="fixed"
        >
          <TabList>
            <Tab id="photos" icon={<IconPhoto />} label="Photos" badge={3} />
            <Tab id="music" icon={<IconMusic />} label="Music" badge={true} />
            <Tab id="videos" icon={<IconVideo />} label="Videos" isDisabled />
            <Tab id="favorites" icon={<IconFavorite />} label="Favorites" />
          </TabList>
          <TabPanel id="photos">
            <p className="p-4">3 new photos</p>
          </TabPanel>
          <TabPanel id="music">
            <p className="p-4">New music</p>
          </TabPanel>
          <TabPanel id="videos">
            <p className="p-4">Videos (disabled)</p>
          </TabPanel>
          <TabPanel id="favorites">
            <p className="p-4">Favorites</p>
          </TabPanel>
        </Tabs>
      </div>
      <div>
        <p className="text-on-surface-variant mb-1 text-sm font-medium">
          Secondary · Scrollable · Label only
        </p>
        <div className="w-72">
          <Tabs
            aria-label="Kitchen sink secondary"
            defaultSelectedKey="a"
            variant="secondary"
            layout="scrollable"
          >
            <TabList>
              <Tab id="a" label="Overview" />
              <Tab id="b" label="Details" />
              <Tab id="c" label="Reviews" badge={12} />
              <Tab id="d" label="Related" />
              <Tab id="e" label="Questions" badge={5} />
              <Tab id="f" label="Share" />
            </TabList>
            <TabPanel id="a">
              <p className="p-4">Overview</p>
            </TabPanel>
            <TabPanel id="b">
              <p className="p-4">Details</p>
            </TabPanel>
            <TabPanel id="c">
              <p className="p-4">12 Reviews</p>
            </TabPanel>
            <TabPanel id="d">
              <p className="p-4">Related items</p>
            </TabPanel>
            <TabPanel id="e">
              <p className="p-4">5 Questions</p>
            </TabPanel>
            <TabPanel id="f">
              <p className="p-4">Share</p>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
  ),
};

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  render: (args) => (
    <Tabs {...args} aria-label="Playground tabs" defaultSelectedKey="tab1">
      <TabList>
        <Tab id="tab1" icon={<IconPhoto />} label="Tab One" />
        <Tab id="tab2" icon={<IconMusic />} label="Tab Two" />
        <Tab id="tab3" icon={<IconVideo />} label="Tab Three" />
      </TabList>
      <TabPanel id="tab1">
        <p className="p-4">Content for Tab One</p>
      </TabPanel>
      <TabPanel id="tab2">
        <p className="p-4">Content for Tab Two</p>
      </TabPanel>
      <TabPanel id="tab3">
        <p className="p-4">Content for Tab Three</p>
      </TabPanel>
    </Tabs>
  ),
  args: {
    variant: "primary",
    layout: "fixed",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground — use the controls to switch between variant and layout options.",
      },
    },
  },
};
