import { useState, type CSSProperties, type JSX } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { NavigationBar } from "./NavigationBar";
import { NavigationBarItem } from "./NavigationBarItem";
import { HeadlessNavigationBar, HeadlessNavigationBarItem } from "./NavigationBarHeadless";
import type { NavigationBarItemConfig } from "./NavigationBar.types";
import type { Key } from "react-aria";

// ─── MD3 Material Icons (inline SVG) ─────────────────────────────────────────

const HomeIcon = (): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const SearchIcon = (): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const ProfileIcon = (): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const BookmarkIcon = (): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
  </svg>
);

const SettingsIcon = (): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.47.47 0 0 0-.59.22L2.74 8.87a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.07.63-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
);

// ─── Fixture data ─────────────────────────────────────────────────────────────

const threeItems: NavigationBarItemConfig[] = [
  { key: "home", icon: <HomeIcon />, label: "Home" },
  { key: "search", icon: <SearchIcon />, label: "Search" },
  { key: "profile", icon: <ProfileIcon />, label: "Profile" },
];

const fourItems: NavigationBarItemConfig[] = [
  { key: "home", icon: <HomeIcon />, label: "Home" },
  { key: "search", icon: <SearchIcon />, label: "Search" },
  { key: "bookmarks", icon: <BookmarkIcon />, label: "Saved" },
  { key: "profile", icon: <ProfileIcon />, label: "Profile" },
];

const fiveItems: NavigationBarItemConfig[] = [
  { key: "home", icon: <HomeIcon />, label: "Home" },
  { key: "search", icon: <SearchIcon />, label: "Search" },
  { key: "bookmarks", icon: <BookmarkIcon />, label: "Saved" },
  { key: "settings", icon: <SettingsIcon />, label: "Settings" },
  { key: "profile", icon: <ProfileIcon />, label: "Profile" },
];

// ─── Storybook Meta ────────────────────────────────────────────────────────────

const meta: Meta<typeof NavigationBar> = {
  title: "Navigation/NavigationBar",
  component: NavigationBar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Material Design 3 Navigation Bar (Bottom Navigation). Renders a fixed bottom bar with 3–5 destination items. Supports animated active indicator pill, optional labels, badges, disabled items, and full keyboard navigation (Arrow Left/Right, Home, End).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    hideLabels: {
      control: "boolean",
      description: "Hide labels on all items (icon-only mode)",
    },
    disableRipple: {
      control: "boolean",
      description: "Disable ripple effect on all items",
    },
    "aria-label": {
      control: "text",
      description: "Accessible label for the nav landmark (required)",
    },
  },
  decorators: [
    (Story) => (
      <div
        style={{ height: "300px", position: "relative", background: "var(--md-sys-color-surface)" }}
      >
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NavigationBar>;

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * Default: 3 items with labels (uncontrolled).
 * Home is active on first render.
 */
export const Default: Story = {
  args: {
    items: threeItems,
    defaultActiveKey: "home",
    "aria-label": "Main navigation",
  },
};

/**
 * Four destination items.
 */
export const FourItems: Story = {
  args: {
    items: fourItems,
    defaultActiveKey: "home",
    "aria-label": "Main navigation",
  },
};

/**
 * Five destination items (maximum).
 */
export const FiveItems: Story = {
  args: {
    items: fiveItems,
    defaultActiveKey: "home",
    "aria-label": "Main navigation",
  },
};

/**
 * Icon-only mode: labels hidden globally via `hideLabels`.
 * Each item must have an `aria-label` for accessibility.
 */
export const IconOnly: Story = {
  args: {
    items: [
      { key: "home", icon: <HomeIcon />, label: "Home", "aria-label": "Home" },
      { key: "search", icon: <SearchIcon />, label: "Search", "aria-label": "Search" },
      { key: "bookmarks", icon: <BookmarkIcon />, label: "Saved", "aria-label": "Saved" },
      { key: "profile", icon: <ProfileIcon />, label: "Profile", "aria-label": "Profile" },
    ],
    defaultActiveKey: "home",
    "aria-label": "Main navigation",
    hideLabels: true,
  },
};

/**
 * Badge examples: dot indicator, numeric count, "999+" truncation.
 */
export const WithBadges: Story = {
  args: {
    items: [
      { key: "home", icon: <HomeIcon />, label: "Home" },
      { key: "search", icon: <SearchIcon />, label: "Search", badge: true },
      { key: "bookmarks", icon: <BookmarkIcon />, label: "Saved", badge: 5 },
      { key: "profile", icon: <ProfileIcon />, label: "Profile", badge: 1234 },
    ],
    defaultActiveKey: "home",
    "aria-label": "Main navigation",
  },
};

/**
 * Disabled item: the "Bookmarks" destination is not interactive.
 */
export const WithDisabledItem: Story = {
  args: {
    items: [
      { key: "home", icon: <HomeIcon />, label: "Home" },
      { key: "search", icon: <SearchIcon />, label: "Search" },
      { key: "bookmarks", icon: <BookmarkIcon />, label: "Saved", isDisabled: true },
      { key: "profile", icon: <ProfileIcon />, label: "Profile" },
    ],
    defaultActiveKey: "home",
    "aria-label": "Main navigation",
  },
};

// ─── Component wrappers for controlled stories (hooks must be in components) ──

interface ControlledExampleProps {
  items: NavigationBarItemConfig[];
}

function ControlledExample({ items }: ControlledExampleProps): JSX.Element {
  const [activeKey, setActiveKey] = useState<Key>("home");
  return (
    <div style={{ height: "300px", position: "relative" }}>
      <p
        style={{
          padding: "16px",
          fontFamily: "sans-serif",
          color: "var(--md-sys-color-on-surface)",
        }}
      >
        Active destination: <strong>{String(activeKey)}</strong>
      </p>
      <NavigationBar
        items={items}
        activeKey={activeKey}
        onActiveChange={setActiveKey}
        aria-label="Main navigation"
      />
    </div>
  );
}

interface PlaygroundExampleProps {
  items: NavigationBarItemConfig[];
  hideLabels?: boolean;
  disableRipple?: boolean;
}

function PlaygroundExample({
  items,
  hideLabels,
  disableRipple,
}: PlaygroundExampleProps): JSX.Element {
  const [activeKey, setActiveKey] = useState<Key>("home");
  return (
    <div style={{ height: "300px", position: "relative" }}>
      <NavigationBar
        items={items}
        activeKey={activeKey}
        onActiveChange={setActiveKey}
        aria-label="Main navigation"
        {...(hideLabels !== undefined ? { hideLabels } : {})}
        {...(disableRipple !== undefined ? { disableRipple } : {})}
      />
    </div>
  );
}

/**
 * Controlled: parent manages `activeKey` + `onActiveChange`.
 * The current active destination is shown above the bar.
 */
export const Controlled: Story = {
  render: (args) => <ControlledExample items={args.items ?? fourItems} />,
  args: {
    items: fourItems,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Controlled mode: pass `activeKey` and `onActiveChange` to manage the active destination from the parent.",
      },
    },
  },
};

/**
 * Interactive playground: full control over all props.
 */
export const Playground: Story = {
  render: (args) => (
    <PlaygroundExample
      items={args.items ?? fiveItems}
      hideLabels={args.hideLabels ?? false}
      disableRipple={args.disableRipple ?? false}
    />
  ),
  args: {
    items: fiveItems,
    hideLabels: false,
    disableRipple: false,
  },
};

// ─── NavigationBarItem (standalone) ──────────────────────────────────────────

/**
 * `NavigationBarItem` standalone (no tablist semantics).
 * Demonstrates all visual states: active, inactive, badge, disabled.
 */
export const StandaloneItem: StoryObj<typeof NavigationBarItem> = {
  render: () => (
    <div
      style={{
        display: "flex",
        gap: "8px",
        padding: "16px",
        background: "var(--md-sys-color-surface-container)",
        alignItems: "center",
      }}
    >
      <NavigationBarItem
        itemKey="home"
        icon={<HomeIcon />}
        label="Home"
        isActive
        style={{ width: "80px", height: "80px" } as CSSProperties}
      />
      <NavigationBarItem
        itemKey="search"
        icon={<SearchIcon />}
        label="Search"
        badge={3}
        style={{ width: "80px", height: "80px" } as CSSProperties}
      />
      <NavigationBarItem
        itemKey="bookmarks"
        icon={<BookmarkIcon />}
        label="Saved"
        badge
        style={{ width: "80px", height: "80px" } as CSSProperties}
      />
      <NavigationBarItem
        itemKey="profile"
        icon={<ProfileIcon />}
        label="Profile"
        isDisabled
        style={{ width: "80px", height: "80px" } as CSSProperties}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Standalone `NavigationBarItem` renders visual states: active, badge (numeric), badge (dot), and disabled.",
      },
    },
  },
};

// ─── HeadlessNavigationBar (advanced consumer) ────────────────────────────────

/**
 * Headless usage — advanced consumer with full visual control.
 * Demonstrates composing `HeadlessNavigationBar` + `HeadlessNavigationBarItem`
 * directly for custom styling.
 */
function HeadlessExample(): JSX.Element {
  const [activeKey, setActiveKey] = useState<Key>("home");
  return (
    <HeadlessNavigationBar
      items={threeItems}
      selectedKey={activeKey}
      onSelectionChange={setActiveKey}
      aria-label="Custom navigation"
      className="bg-tertiary-container fixed right-0 bottom-0 left-0 flex h-20"
      renderItem={(config) => (
        <HeadlessNavigationBarItem
          key={config.key}
          itemKey={config.key}
          className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-1 outline-none"
        >
          {({ isSelected }) => (
            <>
              <span
                className={isSelected ? "text-on-tertiary-container" : "text-on-surface-variant"}
              >
                {config.icon}
              </span>
              {config.label && (
                <span
                  className={`text-xs font-medium ${
                    isSelected ? "text-on-tertiary-container" : "text-on-surface-variant"
                  }`}
                >
                  {config.label}
                </span>
              )}
            </>
          )}
        </HeadlessNavigationBarItem>
      )}
    />
  );
}

export const HeadlessUsage: StoryObj<typeof HeadlessNavigationBar> = {
  render: () => <HeadlessExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Headless layer usage for advanced consumers. Custom styling using MD3 tertiary color scheme.",
      },
    },
  },
};
