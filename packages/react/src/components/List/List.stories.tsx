import type { Meta, StoryObj } from "@storybook/react";
import type React from "react";
import { useState } from "react";
import type { Selection } from "react-stately";
import { Checkbox } from "../Checkbox";
import { List, ListItem } from "./index";

// ─── Icons ────────────────────────────────────────────────────────────────────

const IconWifi = (): React.ReactElement => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
  </svg>
);

const IconBluetooth = (): React.ReactElement => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.71 7.71L12 2h-1v7.59L6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 11 14.41V22h1l5.71-5.71-4.3-4.29 4.3-4.29zM13 5.83l1.88 1.88L13 9.59V5.83zm1.88 10.46L13 18.17v-3.76l1.88 1.88z" />
  </svg>
);

const IconNotifications = (): React.ReactElement => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
  </svg>
);

const IconDisplay = (): React.ReactElement => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" />
  </svg>
);

const IconSecurity = (): React.ReactElement => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z" />
  </svg>
);

const IconChevronRight = (): React.ReactElement => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
  </svg>
);

const IconMoreVert = (): React.ReactElement => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

const IconPerson = (): React.ReactElement => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const IconMail = (): React.ReactElement => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const IconShare = (): React.ReactElement => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
  </svg>
);

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof List> = {
  title: "Components/List",
  component: List,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Material Design 3 List component for displaying vertically arranged items. Supports static and interactive modes with single/multiple selection, leading/trailing slots, and dividers. [MD3 Spec](https://m3.material.io/components/lists/overview)",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    selectionMode: {
      control: "select",
      options: ["none", "single", "multiple"],
      description: "Controls whether items are selectable and how many can be active at once",
    },
    showDividers: {
      control: "boolean",
      description: "Renders full-width dividers between items using `border-outline-variant`",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof List>;

// ─── Static density stories ───────────────────────────────────────────────────

export const Default: Story = {
  args: {
    "aria-label": "Default list",
  },
  render: (args) => (
    <List {...args}>
      <ListItem value="item-1" headline="List item one" />
      <ListItem value="item-2" headline="List item two" />
      <ListItem value="item-3" headline="List item three" />
    </List>
  ),
};

export const OneLine: Story = {
  render: () => (
    <List aria-label="One-line list">
      <ListItem value="wifi" headline="Wi-Fi" />
      <ListItem value="bluetooth" headline="Bluetooth" />
      <ListItem value="notifications" headline="Notifications" />
      <ListItem value="display" headline="Display" />
    </List>
  ),
  parameters: {
    docs: {
      description: {
        story: "One-line density — headline only. Minimum height 56dp per MD3 spec.",
      },
    },
  },
};

export const TwoLine: Story = {
  render: () => (
    <List aria-label="Two-line list">
      <ListItem value="wifi" headline="Wi-Fi" supportingText="Connected to Home Network" />
      <ListItem value="bluetooth" headline="Bluetooth" supportingText="3 devices connected" />
      <ListItem
        value="notifications"
        headline="Notifications"
        supportingText="Banners and alerts"
      />
      <ListItem value="display" headline="Display" supportingText="Brightness, font size" />
    </List>
  ),
  parameters: {
    docs: {
      description: {
        story: "Two-line density — headline + supportingText. Minimum height 72dp per MD3 spec.",
      },
    },
  },
};

export const ThreeLine: Story = {
  render: () => (
    <List aria-label="Three-line list">
      <ListItem
        value="wifi"
        overline="Network"
        headline="Wi-Fi"
        supportingText="Connected to Home Network"
      />
      <ListItem
        value="bluetooth"
        overline="Devices"
        headline="Bluetooth"
        supportingText="3 devices connected"
      />
      <ListItem
        value="notifications"
        overline="Alerts"
        headline="Notifications"
        supportingText="Banners, badges, and alerts"
      />
    </List>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Three-line density — overline + headline + supportingText. Minimum height 88dp per MD3 spec. Leading/trailing slots top-align.",
      },
    },
  },
};

export const AllDensities: Story = {
  decorators: [
    (Story) => (
      <div className="w-full">
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="flex gap-4">
      <div className="w-56">
        <p className="text-label-medium text-on-surface-variant mb-2">One-line</p>
        <List aria-label="One-line density">
          <ListItem value="a" headline="Headline" />
          <ListItem value="b" headline="Headline" />
        </List>
      </div>
      <div className="w-56">
        <p className="text-label-medium text-on-surface-variant mb-2">Two-line</p>
        <List aria-label="Two-line density">
          <ListItem value="a" headline="Headline" supportingText="Supporting text" />
          <ListItem value="b" headline="Headline" supportingText="Supporting text" />
        </List>
      </div>
      <div className="w-56">
        <p className="text-label-medium text-on-surface-variant mb-2">Three-line</p>
        <List aria-label="Three-line density">
          <ListItem
            value="a"
            overline="Overline"
            headline="Headline"
            supportingText="Supporting text"
          />
          <ListItem
            value="b"
            overline="Overline"
            headline="Headline"
            supportingText="Supporting text"
          />
        </List>
      </div>
    </div>
  ),
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story: "Side-by-side comparison of all three density levels derived from content.",
      },
    },
  },
};

// ─── Leading slot stories ─────────────────────────────────────────────────────

export const WithLeadingIcon: Story = {
  render: () => (
    <List aria-label="Settings">
      <ListItem
        value="wifi"
        headline="Wi-Fi"
        supportingText="Connected"
        leadingType="icon"
        leadingSlot={<IconWifi />}
      />
      <ListItem
        value="bluetooth"
        headline="Bluetooth"
        supportingText="3 devices"
        leadingType="icon"
        leadingSlot={<IconBluetooth />}
      />
      <ListItem
        value="notifications"
        headline="Notifications"
        leadingType="icon"
        leadingSlot={<IconNotifications />}
      />
      <ListItem
        value="display"
        headline="Display"
        leadingType="icon"
        leadingSlot={<IconDisplay />}
      />
    </List>
  ),
};

export const WithLeadingAvatar: Story = {
  render: () => (
    <List aria-label="Contacts">
      <ListItem
        value="alice"
        headline="Alice Johnson"
        supportingText="alice@example.com"
        leadingType="avatar"
        leadingSlot={
          <div className="bg-primary text-on-primary flex size-full items-center justify-center text-sm font-medium">
            AJ
          </div>
        }
      />
      <ListItem
        value="bob"
        headline="Bob Smith"
        supportingText="bob@example.com"
        leadingType="avatar"
        leadingSlot={
          <div className="bg-secondary text-on-secondary flex size-full items-center justify-center text-sm font-medium">
            BS
          </div>
        }
      />
      <ListItem
        value="carol"
        headline="Carol White"
        supportingText="carol@example.com"
        leadingType="avatar"
        leadingSlot={
          <div className="bg-tertiary text-on-tertiary flex size-full items-center justify-center text-sm font-medium">
            CW
          </div>
        }
      />
    </List>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Avatar type applies `size-10 overflow-hidden rounded-full` to the leading container. Pass any element — `<div>` with initials, or `<img>` — as the `leadingSlot`.",
      },
    },
  },
};

// ─── Trailing slot stories ────────────────────────────────────────────────────

export const WithTrailingIcon: Story = {
  render: () => (
    <List aria-label="Navigation">
      <ListItem
        value="profile"
        headline="Profile"
        trailingType="icon"
        trailingSlot={<IconChevronRight />}
      />
      <ListItem
        value="settings"
        headline="Settings"
        trailingType="icon"
        trailingSlot={<IconChevronRight />}
      />
      <ListItem
        value="more"
        headline="More options"
        trailingType="icon"
        trailingSlot={<IconMoreVert />}
      />
    </List>
  ),
};

export const WithTrailingText: Story = {
  render: () => (
    <List aria-label="Messages">
      <ListItem
        value="msg-1"
        headline="Alice Johnson"
        supportingText="Hey, are you free tonight?"
        trailingType="text"
        trailingSlot={<span>2 min</span>}
      />
      <ListItem
        value="msg-2"
        headline="Bob Smith"
        supportingText="The meeting has been moved."
        trailingType="text"
        trailingSlot={<span>1 hr</span>}
      />
      <ListItem
        value="msg-3"
        headline="Team Announcements"
        supportingText="New office policy update."
        trailingType="text"
        trailingSlot={<span>Yesterday</span>}
      />
      <ListItem
        value="msg-4"
        headline="Carol White"
        supportingText="Thanks for your help!"
        trailingType="text"
        trailingSlot={<span>Mon</span>}
      />
    </List>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Trailing `text` type renders meta content (e.g. timestamps) styled with `text-label-small text-on-surface-variant`.",
      },
    },
  },
};

// ─── Interactive selection stories ───────────────────────────────────────────

const WithLeadingCheckboxExample = (): React.ReactElement => {
  const [selected, setSelected] = useState<Selection>(new Set<string>());

  const isChecked = (key: string): boolean => {
    if (selected === "all") return true;
    return (selected as Set<string>).has(key);
  };

  return (
    <List
      aria-label="Task list"
      selectionMode="multiple"
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      <ListItem
        value="task-1"
        headline="Send weekly report"
        leadingType="checkbox"
        leadingSlot={<Checkbox isSelected={isChecked("task-1")} aria-label="Send weekly report" />}
      />
      <ListItem
        value="task-2"
        headline="Review pull requests"
        leadingType="checkbox"
        leadingSlot={
          <Checkbox isSelected={isChecked("task-2")} aria-label="Review pull requests" />
        }
      />
      <ListItem
        value="task-3"
        headline="Update documentation"
        leadingType="checkbox"
        leadingSlot={
          <Checkbox isSelected={isChecked("task-3")} aria-label="Update documentation" />
        }
      />
      <ListItem
        value="task-4"
        headline="Deploy to staging"
        leadingType="checkbox"
        leadingSlot={<Checkbox isSelected={isChecked("task-4")} aria-label="Deploy to staging" />}
      />
    </List>
  );
};

export const WithLeadingCheckbox: Story = {
  render: () => <WithLeadingCheckboxExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Multiple-selection list with `Checkbox` in the leading slot. `ListItemLeading` wraps the checkbox in `aria-hidden` — selection semantics come from the `listbox` role and `aria-selected` on each option. The `isSelected` prop syncs visual state with the List's controlled `selectedKeys`. Click an item row (not the checkbox itself) to toggle selection.",
      },
    },
  },
};

/**
 * Simple SVG-based radio indicator used as a decorative leading slot.
 *
 * The `Radio` component from this library requires `RadioGroup` context (React Aria),
 * which conflicts with nesting inside a `listbox`. Since `leadingType="radio"` wraps
 * the slot in `aria-hidden`, the indicator is purely visual — selection semantics are
 * provided by the List's `useOption` / `aria-selected`.
 */
const RadioIndicator = ({ isSelected }: { isSelected: boolean }): React.ReactElement => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    aria-hidden="true"
    className="text-on-surface-variant"
  >
    <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
    {isSelected && <circle cx="10" cy="10" r="5" fill="currentColor" />}
  </svg>
);

const WithLeadingRadioExample = (): React.ReactElement => {
  const [selected, setSelected] = useState<Selection>(new Set<string>());

  const isItemSelected = (key: string): boolean => {
    if (selected === "all") return true;
    return (selected as Set<string>).has(key);
  };

  return (
    <List
      aria-label="Notification sound"
      selectionMode="single"
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      <ListItem
        value="chime"
        headline="Chime"
        leadingType="radio"
        leadingSlot={<RadioIndicator isSelected={isItemSelected("chime")} />}
      />
      <ListItem
        value="bell"
        headline="Bell"
        leadingType="radio"
        leadingSlot={<RadioIndicator isSelected={isItemSelected("bell")} />}
      />
      <ListItem
        value="ping"
        headline="Ping"
        leadingType="radio"
        leadingSlot={<RadioIndicator isSelected={isItemSelected("ping")} />}
      />
      <ListItem
        value="none"
        headline="None"
        leadingType="radio"
        leadingSlot={<RadioIndicator isSelected={isItemSelected("none")} />}
      />
    </List>
  );
};

export const WithLeadingRadio: Story = {
  render: () => <WithLeadingRadioExample />,
  parameters: {
    docs: {
      description: {
        story:
          'Single-selection list with a radio indicator in the leading slot. `ListItemLeading` wraps the indicator in `aria-hidden` since `role="option"` with `aria-selected` already conveys selection state to assistive technology. A custom `RadioIndicator` SVG is used instead of the `Radio` component because `Radio` requires `RadioGroup` context which conflicts with nesting inside a `listbox`.',
      },
    },
  },
};

const SingleSelectionExample = (): React.ReactElement => {
  const [selected, setSelected] = useState<Selection>(new Set<string>(["center"]));

  return (
    <List
      aria-label="Text alignment"
      selectionMode="single"
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      <ListItem value="left" headline="Left" />
      <ListItem value="center" headline="Center" />
      <ListItem value="right" headline="Right" />
      <ListItem value="justify" headline="Justify" />
    </List>
  );
};

export const SingleSelection: Story = {
  render: () => <SingleSelectionExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Single-selection listbox. The selected item receives a `bg-secondary-container` highlight. Click a different item to move the selection.",
      },
    },
  },
};

const MultipleSelectionExample = (): React.ReactElement => {
  const [selected, setSelected] = useState<Selection>(new Set<string>(["bold", "italic"]));

  return (
    <List
      aria-label="Text formatting"
      selectionMode="multiple"
      selectedKeys={selected}
      onSelectionChange={setSelected}
    >
      <ListItem value="bold" headline="Bold" />
      <ListItem value="italic" headline="Italic" />
      <ListItem value="underline" headline="Underline" />
      <ListItem value="strikethrough" headline="Strikethrough" />
    </List>
  );
};

export const MultipleSelection: Story = {
  render: () => <MultipleSelectionExample />,
  parameters: {
    docs: {
      description: {
        story: "Multiple-selection listbox. Any number of items can be selected simultaneously.",
      },
    },
  },
};

// ─── Divider stories ──────────────────────────────────────────────────────────

export const WithShowDividers: Story = {
  render: () => (
    <List aria-label="Settings with dividers" showDividers>
      <ListItem value="wifi" headline="Wi-Fi" supportingText="Connected" />
      <ListItem value="bluetooth" headline="Bluetooth" supportingText="Off" />
      <ListItem
        value="notifications"
        headline="Notifications"
        supportingText="Banners and alerts"
      />
      <ListItem value="display" headline="Display" supportingText="Brightness, font size" />
    </List>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Full-width `<hr role="presentation">` dividers are interleaved between items when `showDividers={true}`. The `role="presentation"` prevents ARIA violations inside the `listbox`.',
      },
    },
  },
};

export const WithInsetDividers: Story = {
  render: () => (
    <List aria-label="Messages with inset dividers">
      <ListItem
        value="msg-1"
        headline="Alice Johnson"
        supportingText="Hey, are you free tonight?"
        leadingType="icon"
        leadingSlot={<IconPerson />}
        insetDivider
      />
      <ListItem
        value="msg-2"
        headline="Bob Smith"
        supportingText="The meeting has been moved."
        leadingType="icon"
        leadingSlot={<IconPerson />}
        insetDivider
      />
      <ListItem
        value="msg-3"
        headline="Carol White"
        supportingText="Thanks for your help!"
        leadingType="icon"
        leadingSlot={<IconPerson />}
        insetDivider
      />
      <ListItem
        value="msg-4"
        headline="Team Announcements"
        supportingText="New office policy update."
        leadingType="icon"
        leadingSlot={<IconPerson />}
      />
    </List>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Inset dividers sit at the bottom of each item and are indented from the start edge — ideal for lists with leading icons or avatars to maintain visual alignment.",
      },
    },
  },
};

// ─── State stories ────────────────────────────────────────────────────────────

export const WithDisabledItems: Story = {
  render: () => (
    <List aria-label="Options with disabled items" selectionMode="single">
      <ListItem value="option-1" headline="Available option" />
      <ListItem
        value="option-2"
        headline="Disabled option"
        supportingText="Not available"
        isDisabled
      />
      <ListItem value="option-3" headline="Another available option" />
      <ListItem value="option-4" headline="Also disabled" isDisabled />
      <ListItem value="option-5" headline="Final option" />
    </List>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Disabled items render with `opacity-38` and `pointer-events-none`. They are skipped during keyboard navigation and cannot receive selection.",
      },
    },
  },
};

export const KeyboardNavigation: Story = {
  render: () => (
    <List aria-label="Keyboard navigable list" selectionMode="single">
      <ListItem value="option-1" headline="Option one" />
      <ListItem value="option-2" headline="Option two" />
      <ListItem value="option-3" headline="Option three" />
      <ListItem value="option-4" headline="Option four" />
    </List>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "**Keyboard navigation:** `Tab` to focus the list, then `ArrowUp` / `ArrowDown` to move between items. Press `Enter` or `Space` to select the focused item. Disabled items are skipped automatically by React Aria.",
      },
    },
  },
};

const ActionListExample = (): React.ReactElement => {
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <List
        aria-label="Action list"
        onAction={(key) => {
          setLastAction(String(key));
          console.log("Action triggered:", key);
        }}
      >
        <ListItem
          value="edit"
          headline="Edit"
          leadingType="icon"
          leadingSlot={<IconMail />}
          trailingType="icon"
          trailingSlot={<IconChevronRight />}
        />
        <ListItem
          value="share"
          headline="Share"
          leadingType="icon"
          leadingSlot={<IconShare />}
          trailingType="icon"
          trailingSlot={<IconChevronRight />}
        />
        <ListItem
          value="more"
          headline="More options"
          leadingType="icon"
          leadingSlot={<IconMoreVert />}
          trailingType="icon"
          trailingSlot={<IconChevronRight />}
        />
      </List>
      {lastAction && (
        <p className="text-body-small text-on-surface-variant">
          Last action: <strong>{lastAction}</strong>
        </p>
      )}
    </div>
  );
};

export const ActionList: Story = {
  render: () => <ActionListExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Action lists use `onAction` instead of `selectionMode`. Clicking an item triggers the callback with the item's `value` key — useful for menus and command lists where items should not retain selected state.",
      },
    },
  },
};

// ─── Realistic composition stories ───────────────────────────────────────────

const contacts = [
  {
    id: "alice",
    name: "Alice Johnson",
    phone: "+1 555 012 3456",
    initials: "AJ",
    colorClass: "bg-primary text-on-primary",
  },
  {
    id: "bob",
    name: "Bob Smith",
    phone: "+1 555 987 6543",
    initials: "BS",
    colorClass: "bg-secondary text-on-secondary",
  },
  {
    id: "carol",
    name: "Carol White",
    phone: "+1 555 246 8100",
    initials: "CW",
    colorClass: "bg-tertiary text-on-tertiary",
  },
  {
    id: "david",
    name: "David Lee",
    phone: "+1 555 135 7924",
    initials: "DL",
    colorClass: "bg-error text-on-error",
  },
  {
    id: "emma",
    name: "Emma Brown",
    phone: "+1 555 864 2048",
    initials: "EB",
    colorClass: "bg-primary text-on-primary",
  },
];

export const ContactList: Story = {
  render: () => (
    <List aria-label="Contacts" showDividers>
      {contacts.map((contact) => (
        <ListItem
          key={contact.id}
          value={contact.id}
          headline={contact.name}
          leadingType="avatar"
          leadingSlot={
            <div
              className={`flex size-full items-center justify-center text-sm font-medium ${contact.colorClass}`}
            >
              {contact.initials}
            </div>
          }
          trailingType="text"
          trailingSlot={<span>{contact.phone}</span>}
        />
      ))}
    </List>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Realistic contact list combining avatar leading slots, full-width dividers, and trailing phone numbers as metadata text.",
      },
    },
  },
};

const settingsItems = [
  {
    id: "wifi",
    icon: <IconWifi />,
    title: "Wi-Fi",
    description: "Connected to Home Network",
  },
  {
    id: "bluetooth",
    icon: <IconBluetooth />,
    title: "Bluetooth",
    description: "3 devices connected",
  },
  {
    id: "notifications",
    icon: <IconNotifications />,
    title: "Notifications",
    description: "Banners, badges, and sounds",
  },
  {
    id: "display",
    icon: <IconDisplay />,
    title: "Display",
    description: "Brightness, night mode",
  },
  {
    id: "security",
    icon: <IconSecurity />,
    title: "Privacy & Security",
    description: "Lock screen, biometrics",
  },
];

export const SettingsList: Story = {
  render: () => (
    <List aria-label="Device settings">
      {settingsItems.map((setting) => (
        <ListItem
          key={setting.id}
          value={setting.id}
          headline={setting.title}
          supportingText={setting.description}
          leadingType="icon"
          leadingSlot={setting.icon}
          trailingType="icon"
          trailingSlot={<IconChevronRight />}
          insetDivider
        />
      ))}
    </List>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Realistic settings screen: icon leading slots, supporting text descriptions, chevron trailing icons, and inset dividers. Non-interactive (static list).",
      },
    },
  },
};

// ─── Playground ───────────────────────────────────────────────────────────────

export const Playground: Story = {
  args: {
    "aria-label": "Playground list",
    selectionMode: "none",
    showDividers: false,
  },
  render: (args) => (
    <List {...args}>
      <ListItem value="item-1" headline="List item one" supportingText="Supporting text" />
      <ListItem value="item-2" headline="List item two" supportingText="Supporting text" />
      <ListItem value="item-3" headline="List item three" supportingText="Supporting text" />
      <ListItem value="item-4" headline="List item four" supportingText="Supporting text" />
    </List>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use the Controls panel to adjust `selectionMode` and `showDividers` and see how the list adapts.",
      },
    },
  },
};
