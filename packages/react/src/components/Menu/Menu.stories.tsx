import { useState, type JSX } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MenuTrigger } from "./Menu";
import { MenuItem } from "./MenuItem";
import { MenuSection } from "./MenuSection";
import { MenuDivider } from "./MenuDivider";
import { HeadlessMenuTrigger, HeadlessMenuItem } from "./MenuHeadless";
import { menuContainerVariants, menuItemVariants } from "./Menu.variants";
import { cn } from "../../utils/cn";

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

const CutIcon = (): JSX.Element => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M9.64 7.64A2 2 0 1 0 6.36 4.36L2 8.72V11h2.28L7.5 7.78A2 2 0 0 0 9.64 7.64zm4.72 0a2 2 0 1 0 3.28-3.28L22 8.72V11h-2.28L16.5 7.78a2 2 0 0 0-2.14-.14zM12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6c-1.1 0-2.1.36-2.9.96L6.28 13H4v2.28L7.04 18.3A2 2 0 0 0 9.64 20l-3.28 3.28 1.28 1.28L12 20.12l4.36 4.44 1.28-1.28L14.36 20a2 2 0 0 0 2.6-1.7l3.04-3.02V13h-2.28L14.9 16.96A4 4 0 0 0 12 16z" />
  </svg>
);

const CopyIcon = (): JSX.Element => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
  </svg>
);

const PasteIcon = (): JSX.Element => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z" />
  </svg>
);

const BoldIcon = (): JSX.Element => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z" />
  </svg>
);

const GridIcon = (): JSX.Element => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
  </svg>
);

const ListIcon = (): JSX.Element => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
  </svg>
);

const MoreVertIcon = (): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof MenuTrigger> = {
  title: "Feedback/Menu",
  component: MenuTrigger,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Material Design 3 Menu — a contextual popup list anchored to a trigger element. Supports leading/trailing icons, keyboard shortcuts, section grouping with dividers, disabled items, and select variants.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MenuTrigger>;

// ─── Basic ────────────────────────────────────────────────────────────────────

export const Basic: Story = {
  name: "Basic Menu",
  render: () => (
    <MenuTrigger>
      <button
        type="button"
        className="bg-primary text-on-primary text-label-large rounded-full px-6 py-2.5"
      >
        Open Menu
      </button>
      <MenuTrigger.Menu aria-label="Edit actions">
        <MenuItem id="cut">Cut</MenuItem>
        <MenuItem id="copy">Copy</MenuItem>
        <MenuItem id="paste">Paste</MenuItem>
        <MenuItem id="select-all">Select all</MenuItem>
      </MenuTrigger.Menu>
    </MenuTrigger>
  ),
};

// ─── With Icons ───────────────────────────────────────────────────────────────

export const WithLeadingIcons: Story = {
  name: "With Leading Icons",
  render: () => (
    <MenuTrigger>
      <button
        type="button"
        className="bg-primary text-on-primary text-label-large rounded-full px-6 py-2.5"
      >
        Edit
      </button>
      <MenuTrigger.Menu aria-label="Edit">
        <MenuItem id="cut" leadingIcon={<CutIcon />}>
          Cut
        </MenuItem>
        <MenuItem id="copy" leadingIcon={<CopyIcon />}>
          Copy
        </MenuItem>
        <MenuItem id="paste" leadingIcon={<PasteIcon />}>
          Paste
        </MenuItem>
      </MenuTrigger.Menu>
    </MenuTrigger>
  ),
};

// ─── With Keyboard Shortcuts ──────────────────────────────────────────────────

export const WithKeyboardShortcuts: Story = {
  name: "With Keyboard Shortcuts",
  render: () => (
    <MenuTrigger>
      <button
        type="button"
        className="bg-primary text-on-primary text-label-large rounded-full px-6 py-2.5"
      >
        Edit
      </button>
      <MenuTrigger.Menu aria-label="Edit">
        <MenuItem id="cut" leadingIcon={<CutIcon />} trailingText="⌘X">
          Cut
        </MenuItem>
        <MenuItem id="copy" leadingIcon={<CopyIcon />} trailingText="⌘C">
          Copy
        </MenuItem>
        <MenuItem id="paste" leadingIcon={<PasteIcon />} trailingText="⌘V">
          Paste
        </MenuItem>
      </MenuTrigger.Menu>
    </MenuTrigger>
  ),
};

// ─── With Sections ────────────────────────────────────────────────────────────

export const WithSections: Story = {
  name: "With Sections and Dividers",
  render: () => (
    <MenuTrigger>
      <button
        type="button"
        className="bg-primary text-on-primary text-label-large rounded-full px-6 py-2.5"
      >
        Edit
      </button>
      <MenuTrigger.Menu aria-label="Edit actions">
        <MenuSection header="Clipboard" aria-label="Clipboard">
          <MenuItem id="cut" leadingIcon={<CutIcon />} trailingText="⌘X">
            Cut
          </MenuItem>
          <MenuItem id="copy" leadingIcon={<CopyIcon />} trailingText="⌘C">
            Copy
          </MenuItem>
          <MenuItem id="paste" leadingIcon={<PasteIcon />} trailingText="⌘V">
            Paste
          </MenuItem>
        </MenuSection>
        <MenuSection header="Formatting" showDivider aria-label="Formatting">
          <MenuItem id="bold" leadingIcon={<BoldIcon />} trailingText="⌘B">
            Bold
          </MenuItem>
        </MenuSection>
      </MenuTrigger.Menu>
    </MenuTrigger>
  ),
};

// ─── With Standalone Divider ──────────────────────────────────────────────────

export const WithStandaloneDivider: Story = {
  name: "With Standalone MenuDivider",
  render: () => (
    <MenuTrigger>
      <button
        type="button"
        className="bg-primary text-on-primary text-label-large rounded-full px-6 py-2.5"
      >
        Actions
      </button>
      <MenuTrigger.Menu aria-label="Actions">
        <MenuItem id="rename">Rename</MenuItem>
        <MenuItem id="duplicate">Duplicate</MenuItem>
        <MenuDivider />
        <MenuItem id="share">Share</MenuItem>
        <MenuDivider />
        <MenuItem id="delete">Delete</MenuItem>
      </MenuTrigger.Menu>
    </MenuTrigger>
  ),
};

// ─── With Disabled Items ──────────────────────────────────────────────────────

export const WithDisabledItems: Story = {
  name: "With Disabled Items",
  render: () => (
    <MenuTrigger>
      <button
        type="button"
        className="bg-primary text-on-primary text-label-large rounded-full px-6 py-2.5"
      >
        Edit
      </button>
      <MenuTrigger.Menu aria-label="Edit">
        <MenuItem id="cut" leadingIcon={<CutIcon />} trailingText="⌘X">
          Cut
        </MenuItem>
        <MenuItem id="copy" leadingIcon={<CopyIcon />} trailingText="⌘C">
          Copy
        </MenuItem>
        <MenuItem id="paste" leadingIcon={<PasteIcon />} trailingText="⌘V" isDisabled>
          Paste
        </MenuItem>
        <MenuItem id="select-all" isDisabled>
          Select all
        </MenuItem>
      </MenuTrigger.Menu>
    </MenuTrigger>
  ),
};

// ─── Select Variant — Single ──────────────────────────────────────────────────

const SelectSingleDemo = (): JSX.Element => {
  const [selected, setSelected] = useState<string>("list");
  return (
    <div className="flex flex-col items-center gap-4">
      <MenuTrigger>
        <button
          type="button"
          className="bg-primary text-on-primary text-label-large rounded-full px-6 py-2.5"
        >
          View: {selected}
        </button>
        <MenuTrigger.Menu
          aria-label="View options"
          variant="select"
          selectionMode="single"
          selectedKeys={new Set([selected])}
          onSelectionChange={(keys) => {
            const key = [...(keys as Set<string>)][0];
            if (key) setSelected(key);
          }}
        >
          <MenuItem id="grid" leadingIcon={<GridIcon />}>
            Grid view
          </MenuItem>
          <MenuItem id="list" leadingIcon={<ListIcon />}>
            List view
          </MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
      <p className="text-body-medium text-on-surface-variant">Selected: {selected}</p>
    </div>
  );
};

export const SelectSingle: Story = {
  name: "Select Variant — Single Selection",
  render: () => <SelectSingleDemo />,
};

// ─── Select Variant — Multiple ────────────────────────────────────────────────

const SelectMultipleDemo = (): JSX.Element => {
  const [selected, setSelected] = useState<Set<string>>(new Set(["bold"]));
  return (
    <div className="flex flex-col items-center gap-4">
      <MenuTrigger>
        <button
          type="button"
          className="bg-primary text-on-primary text-label-large rounded-full px-6 py-2.5"
        >
          Formatting
        </button>
        <MenuTrigger.Menu
          aria-label="Text formatting"
          variant="select"
          selectionMode="multiple"
          selectedKeys={selected}
          onSelectionChange={(keys) => setSelected(new Set([...(keys as Set<string>)]))}
        >
          <MenuItem id="bold">Bold</MenuItem>
          <MenuItem id="italic">Italic</MenuItem>
          <MenuItem id="underline">Underline</MenuItem>
          <MenuItem id="strikethrough">Strikethrough</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
      <p className="text-body-medium text-on-surface-variant">
        Selected: {[...selected].join(", ") || "(none)"}
      </p>
    </div>
  );
};

export const SelectMultiple: Story = {
  name: "Select Variant — Multiple Selection",
  render: () => <SelectMultipleDemo />,
};

// ─── Controlled Open ──────────────────────────────────────────────────────────

const ControlledOpenDemo = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string>("(none)");
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-primary text-on-primary text-label-large rounded-full px-6 py-2.5"
        >
          Open
        </button>
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="bg-surface-container text-on-surface text-label-large rounded-full px-6 py-2.5"
        >
          Close
        </button>
      </div>
      <MenuTrigger isOpen={isOpen} onOpenChange={setIsOpen}>
        <button
          type="button"
          className="bg-surface-container-high text-on-surface text-label-large rounded-full px-6 py-2.5"
        >
          Context Menu (controlled)
        </button>
        <MenuTrigger.Menu
          aria-label="Context"
          onAction={(key) => {
            setLastAction(String(key));
            setIsOpen(false);
          }}
        >
          <MenuItem id="rename">Rename</MenuItem>
          <MenuItem id="share">Share</MenuItem>
          <MenuDivider />
          <MenuItem id="delete">Delete</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
      <p className="text-body-medium text-on-surface-variant">Last action: {lastAction}</p>
    </div>
  );
};

export const ControlledOpen: Story = {
  name: "Controlled Open State",
  render: () => <ControlledOpenDemo />,
};

// ─── Context Menu (IconButton trigger) ───────────────────────────────────────

export const IconButtonTrigger: Story = {
  name: "With IconButton Trigger",
  render: () => (
    <MenuTrigger>
      <button
        type="button"
        className="text-on-surface-variant hover:bg-on-surface-variant/8 relative flex h-10 w-10 items-center justify-center rounded-full"
        aria-label="More options"
      >
        <MoreVertIcon />
      </button>
      <MenuTrigger.Menu aria-label="More options">
        <MenuItem id="rename">Rename</MenuItem>
        <MenuItem id="duplicate">Duplicate</MenuItem>
        <MenuItem id="share">Share</MenuItem>
        <MenuDivider />
        <MenuItem id="delete">Delete</MenuItem>
      </MenuTrigger.Menu>
    </MenuTrigger>
  ),
};

// ─── Headless Primitive ───────────────────────────────────────────────────────

export const HeadlessPrimitive: Story = {
  name: "Headless — Custom Styling",
  render: () => (
    <HeadlessMenuTrigger>
      <button
        type="button"
        className="bg-tertiary text-on-tertiary text-label-large rounded-full px-6 py-2.5"
      >
        Custom Styled Menu
      </button>
      <HeadlessMenuTrigger.Menu
        aria-label="Custom"
        className={cn(menuContainerVariants({ open: true }), "border-outline-variant border")}
      >
        <HeadlessMenuItem id="option-a" className={cn(menuItemVariants(), "text-secondary")}>
          Option A (custom)
        </HeadlessMenuItem>
        <HeadlessMenuItem id="option-b" className={cn(menuItemVariants())}>
          Option B
        </HeadlessMenuItem>
      </HeadlessMenuTrigger.Menu>
    </HeadlessMenuTrigger>
  ),
};

// ─── Dark Mode ────────────────────────────────────────────────────────────────

export const DarkMode: Story = {
  name: "Dark Mode",
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: () => (
    <div className="dark">
      <MenuTrigger>
        <button
          type="button"
          className="bg-primary text-on-primary text-label-large rounded-full px-6 py-2.5"
        >
          Open Menu
        </button>
        <MenuTrigger.Menu aria-label="Edit">
          <MenuItem id="cut" leadingIcon={<CutIcon />} trailingText="⌘X">
            Cut
          </MenuItem>
          <MenuItem id="copy" leadingIcon={<CopyIcon />} trailingText="⌘C">
            Copy
          </MenuItem>
          <MenuItem id="paste" leadingIcon={<PasteIcon />} trailingText="⌘V" isDisabled>
            Paste
          </MenuItem>
          <MenuDivider />
          <MenuItem id="select-all">Select all</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    </div>
  ),
};
