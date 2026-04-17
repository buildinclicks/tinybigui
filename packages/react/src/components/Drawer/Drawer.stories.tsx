import { useState, type JSX } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Drawer } from "./Drawer";
import { DrawerItem } from "./DrawerItem";
import { DrawerSection } from "./DrawerSection";
import { HeadlessDrawer, HeadlessDrawerItem } from "./DrawerHeadless";

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

const HomeIcon = (): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const InboxIcon = (): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12h-4c0 1.66-1.34 3-3 3s-3-1.34-3-3H5V5h14v10z" />
  </svg>
);

const StarredIcon = (): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const SnoozedIcon = (): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
  </svg>
);

const DraftsIcon = (): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M21.99 8c0-.72-.37-1.35-.94-1.7L12 1 2.95 6.3C2.38 6.65 2 7.28 2 8v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2l-.01-12zM12 13 3.74 7.84 12 3l8.26 4.84L12 13z" />
  </svg>
);

const SettingsIcon = (): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.47.47 0 0 0-.59.22L2.74 8.87a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.07.63-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.57 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32a.47.47 0 0 0-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
  </svg>
);

const HelpIcon = (): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
  </svg>
);

const MenuIcon = (): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
  </svg>
);

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof Drawer> = {
  title: "Navigation/Drawer",
  component: Drawer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Material Design 3 Navigation Drawer — provides access to destinations and app functionality. Supports Standard (inline) and Modal (overlay) variants.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["standard", "modal"],
      description: "Structural variant — Standard renders inline, Modal renders as an overlay.",
    },
    open: {
      control: "boolean",
      description: "Controlled open state.",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

// ─── Standard variant ─────────────────────────────────────────────────────────

export const StandardOpen: Story = {
  name: "Standard — Open",
  render: () => (
    <div className="bg-surface relative h-screen">
      <Drawer variant="standard" open aria-label="App navigation">
        <div className="px-4 pt-6 pb-4">
          <span className="text-headline-small text-on-surface">Mail</span>
        </div>
        <DrawerItem
          icon={<InboxIcon />}
          label="Inbox"
          isActive
          badge={<span className="text-label-medium text-on-surface-variant">24</span>}
        />
        <DrawerItem icon={<StarredIcon />} label="Starred" />
        <DrawerItem icon={<SnoozedIcon />} label="Snoozed" />
        <DrawerItem
          icon={<DraftsIcon />}
          label="Drafts"
          badge={<span className="text-label-medium text-on-surface-variant">3</span>}
        />
        <DrawerSection header="More" showDivider>
          <DrawerItem icon={<SettingsIcon />} label="Settings" />
          <DrawerItem icon={<HelpIcon />} label="Help & feedback" />
        </DrawerSection>
      </Drawer>
    </div>
  ),
};

export const StandardClosed: Story = {
  name: "Standard — Closed",
  render: () => (
    <div className="bg-surface relative h-screen">
      <Drawer variant="standard" open={false} aria-label="App navigation">
        <DrawerItem icon={<InboxIcon />} label="Inbox" isActive />
        <DrawerItem icon={<StarredIcon />} label="Starred" />
      </Drawer>
      <div className="p-8">
        <p className="text-body-large text-on-surface">Drawer is closed (off-screen)</p>
      </div>
    </div>
  ),
};

// ─── Standard controlled ──────────────────────────────────────────────────────

const StandardControlledDemo = (): JSX.Element => {
  const [open, setOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("inbox");

  return (
    <div className="bg-surface relative h-screen">
      <div className="flex items-center gap-4 p-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="bg-surface-container-high text-on-surface flex items-center gap-2 rounded-full px-4 py-2"
        >
          <MenuIcon />
          {open ? "Close Drawer" : "Open Drawer"}
        </button>
        <span className="text-body-medium text-on-surface-variant">Active: {activeItem}</span>
      </div>

      <Drawer variant="standard" open={open} onOpenChange={setOpen} aria-label="App navigation">
        <div className="px-4 pt-6 pb-4">
          <span className="text-headline-small text-on-surface">Mail</span>
        </div>
        <DrawerItem
          icon={<InboxIcon />}
          label="Inbox"
          isActive={activeItem === "inbox"}
          onPress={() => setActiveItem("inbox")}
        />
        <DrawerItem
          icon={<StarredIcon />}
          label="Starred"
          isActive={activeItem === "starred"}
          onPress={() => setActiveItem("starred")}
        />
        <DrawerItem
          icon={<DraftsIcon />}
          label="Drafts"
          isActive={activeItem === "drafts"}
          onPress={() => setActiveItem("drafts")}
        />
        <DrawerSection header="More" showDivider>
          <DrawerItem
            icon={<SettingsIcon />}
            label="Settings"
            isActive={activeItem === "settings"}
            onPress={() => setActiveItem("settings")}
          />
        </DrawerSection>
      </Drawer>
    </div>
  );
};

export const StandardControlled: Story = {
  name: "Standard — Controlled toggle",
  render: () => <StandardControlledDemo />,
};

// ─── Modal variant ────────────────────────────────────────────────────────────

const ModalOpenDemo = (): JSX.Element => {
  const [open, setOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("inbox");

  return (
    <div className="bg-surface relative h-screen">
      <div className="flex items-center gap-4 p-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="bg-surface-container-high text-on-surface flex items-center gap-2 rounded-full px-4 py-2"
        >
          <MenuIcon />
          Open Modal Drawer
        </button>
        <span className="text-body-medium text-on-surface-variant">Active: {activeItem}</span>
      </div>

      <Drawer variant="modal" open={open} onOpenChange={setOpen} aria-label="App navigation">
        <div className="px-4 pt-6 pb-4">
          <span className="text-headline-small text-on-surface">Mail</span>
        </div>
        <DrawerItem
          icon={<InboxIcon />}
          label="Inbox"
          isActive={activeItem === "inbox"}
          badge={<span className="text-label-medium text-on-surface-variant">24</span>}
          onPress={() => {
            setActiveItem("inbox");
            setOpen(false);
          }}
        />
        <DrawerItem
          icon={<StarredIcon />}
          label="Starred"
          isActive={activeItem === "starred"}
          onPress={() => {
            setActiveItem("starred");
            setOpen(false);
          }}
        />
        <DrawerItem
          icon={<SnoozedIcon />}
          label="Snoozed"
          isActive={activeItem === "snoozed"}
          onPress={() => {
            setActiveItem("snoozed");
            setOpen(false);
          }}
        />
        <DrawerItem
          icon={<DraftsIcon />}
          label="Drafts"
          isActive={activeItem === "drafts"}
          badge={<span className="text-label-medium text-on-surface-variant">3</span>}
          onPress={() => {
            setActiveItem("drafts");
            setOpen(false);
          }}
        />
        <DrawerSection header="More" showDivider>
          <DrawerItem
            icon={<SettingsIcon />}
            label="Settings"
            isActive={activeItem === "settings"}
            onPress={() => {
              setActiveItem("settings");
              setOpen(false);
            }}
          />
          <DrawerItem icon={<HelpIcon />} label="Help & feedback" onPress={() => setOpen(false)} />
        </DrawerSection>
      </Drawer>
    </div>
  );
};

export const ModalOpen: Story = {
  name: "Modal — Open",
  render: () => <ModalOpenDemo />,
};

// ─── With link items ──────────────────────────────────────────────────────────

export const WithLinkItems: Story = {
  name: "Standard — Link-based items (href)",
  render: () => (
    <div className="bg-surface relative h-screen">
      <Drawer variant="standard" open aria-label="App navigation">
        <div className="px-4 pt-6 pb-4">
          <span className="text-headline-small text-on-surface">Navigation</span>
        </div>
        <DrawerItem href="/" icon={<HomeIcon />} label="Home" isActive />
        <DrawerItem href="/inbox" icon={<InboxIcon />} label="Inbox" />
        <DrawerSection header="Account" showDivider>
          <DrawerItem href="/settings" icon={<SettingsIcon />} label="Settings" />
          <DrawerItem href="/help" icon={<HelpIcon />} label="Help" />
        </DrawerSection>
      </Drawer>
    </div>
  ),
};

// ─── Without icons ────────────────────────────────────────────────────────────

export const WithoutIcons: Story = {
  name: "Standard — Without icons",
  render: () => (
    <div className="bg-surface relative h-screen">
      <Drawer variant="standard" open aria-label="App navigation">
        <div className="px-4 pt-6 pb-4">
          <span className="text-headline-small text-on-surface">Documents</span>
        </div>
        <DrawerItem label="Recent" isActive />
        <DrawerItem label="Shared with me" />
        <DrawerItem label="Starred" />
        <DrawerSection header="Folders" showDivider>
          <DrawerItem label="Work" />
          <DrawerItem label="Personal" />
          <DrawerItem label="Archive" />
        </DrawerSection>
      </Drawer>
    </div>
  ),
};

// ─── With secondary text ──────────────────────────────────────────────────────

export const WithSecondaryText: Story = {
  name: "Standard — Secondary text",
  render: () => (
    <div className="bg-surface relative h-screen">
      <Drawer variant="standard" open aria-label="App navigation">
        <div className="px-4 pt-6 pb-4">
          <span className="text-headline-small text-on-surface">Mail</span>
        </div>
        <DrawerItem
          icon={<InboxIcon />}
          label="Inbox"
          secondaryText="Your primary inbox"
          isActive
        />
        <DrawerItem icon={<StarredIcon />} label="Starred" secondaryText="Saved for later" />
        <DrawerItem icon={<DraftsIcon />} label="Drafts" secondaryText="3 unsent messages" />
      </Drawer>
    </div>
  ),
};

// ─── Disabled items ───────────────────────────────────────────────────────────

export const WithDisabledItems: Story = {
  name: "Standard — Disabled items",
  render: () => (
    <div className="bg-surface relative h-screen">
      <Drawer variant="standard" open aria-label="App navigation">
        <div className="px-4 pt-6 pb-4">
          <span className="text-headline-small text-on-surface">Mail</span>
        </div>
        <DrawerItem icon={<InboxIcon />} label="Inbox" isActive />
        <DrawerItem icon={<StarredIcon />} label="Starred" isDisabled />
        <DrawerItem icon={<DraftsIcon />} label="Drafts" />
        <DrawerSection header="More" showDivider>
          <DrawerItem icon={<SettingsIcon />} label="Settings" isDisabled />
          <DrawerItem icon={<HelpIcon />} label="Help & feedback" />
        </DrawerSection>
      </Drawer>
    </div>
  ),
};

// ─── Multiple sections ────────────────────────────────────────────────────────

export const MultipleSections: Story = {
  name: "Standard — Multiple sections",
  render: () => (
    <div className="bg-surface relative h-screen">
      <Drawer variant="standard" open aria-label="App navigation">
        <div className="px-4 pt-6 pb-4">
          <span className="text-headline-small text-on-surface">Mail</span>
        </div>
        <DrawerSection>
          <DrawerItem
            icon={<InboxIcon />}
            label="Inbox"
            isActive
            badge={<span className="text-label-medium text-on-surface-variant">24</span>}
          />
          <DrawerItem icon={<StarredIcon />} label="Starred" />
          <DrawerItem icon={<SnoozedIcon />} label="Snoozed" />
          <DrawerItem
            icon={<DraftsIcon />}
            label="Drafts"
            badge={<span className="text-label-medium text-on-surface-variant">3</span>}
          />
        </DrawerSection>
        <DrawerSection header="Labels" showDivider>
          <DrawerItem label="Work" />
          <DrawerItem label="Travel" />
          <DrawerItem label="Finance" />
        </DrawerSection>
        <DrawerSection header="More" showDivider>
          <DrawerItem icon={<SettingsIcon />} label="Settings" />
          <DrawerItem icon={<HelpIcon />} label="Help & feedback" />
        </DrawerSection>
      </Drawer>
    </div>
  ),
};

// ─── Headless primitives ──────────────────────────────────────────────────────

export const HeadlessPrimitive: Story = {
  name: "Headless — Custom styling",
  render: () => (
    <div className="bg-surface relative h-screen">
      <HeadlessDrawer
        variant="standard"
        open
        aria-label="Custom navigation"
        className="bg-surface-container-low fixed top-0 left-0 flex h-full w-64 flex-col gap-1 rounded-r-xl p-4"
      >
        <div className="pb-4">
          <span className="text-headline-small text-on-surface font-medium">Custom Drawer</span>
        </div>
        <HeadlessDrawerItem
          className="bg-secondary-container text-on-secondary-container text-label-large flex h-14 items-center gap-3 rounded-full px-4"
          isActive
        >
          <HomeIcon />
          Home
        </HeadlessDrawerItem>
        <HeadlessDrawerItem className="text-on-surface-variant text-label-large hover:bg-on-surface-variant/8 flex h-14 items-center gap-3 rounded-full px-4">
          <InboxIcon />
          Inbox
        </HeadlessDrawerItem>
      </HeadlessDrawer>
    </div>
  ),
};

// ─── Dark mode ────────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  name: "Standard — Dark mode",
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: () => (
    <div className="dark bg-surface relative h-screen">
      <Drawer variant="standard" open aria-label="App navigation">
        <div className="px-4 pt-6 pb-4">
          <span className="text-headline-small text-on-surface">Mail</span>
        </div>
        <DrawerItem
          icon={<InboxIcon />}
          label="Inbox"
          isActive
          badge={<span className="text-label-medium text-on-surface-variant">24</span>}
        />
        <DrawerItem icon={<StarredIcon />} label="Starred" />
        <DrawerItem icon={<DraftsIcon />} label="Drafts" />
        <DrawerSection header="More" showDivider>
          <DrawerItem icon={<SettingsIcon />} label="Settings" />
        </DrawerSection>
      </Drawer>
    </div>
  ),
};
