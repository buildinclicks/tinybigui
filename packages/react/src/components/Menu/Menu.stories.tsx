import { useState, type JSX } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { MenuTrigger } from "./Menu";
import { MenuItem } from "./MenuItem";
import { MenuSection } from "./MenuSection";
import { MenuDivider } from "./MenuDivider";
import { MenuGap } from "./MenuGap";
import { SubmenuTrigger } from "./SubmenuTrigger";
import { ContextMenuTrigger } from "./ContextMenuTrigger";
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

const CardViewIcon = (): JSX.Element => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M4 4h7v5H4V4zm0 7h7v9H4v-9zm9-7h7v9h-7V4zm0 11h7v5h-7v-5z" />
  </svg>
);

const MoreVertIcon = (): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

const StarIcon = (): JSX.Element => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const ShareIcon = (): JSX.Element => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
  </svg>
);

const DeleteIcon = (): JSX.Element => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const InfoIcon = (): JSX.Element => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
  </svg>
);

// ─── Shared trigger button styles ─────────────────────────────────────────────

const primaryBtn = "bg-primary text-on-primary text-label-large rounded-full px-6 py-2.5";
const secondaryBtn =
  "bg-secondary-container text-on-secondary-container text-label-large rounded-full px-6 py-2.5";
const tertiaryBtn =
  "bg-tertiary-container text-on-tertiary-container text-label-large rounded-full px-6 py-2.5";

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof MenuTrigger> = {
  title: "Feedback/Menu",
  component: MenuTrigger,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: [
          "Material Design 3 Menu — a contextual popup list anchored to a trigger element.",
          "",
          "Supports both **Baseline** (standard 4dp corners) and **Expressive Vertical** (16dp corners) styles,",
          "two color schemes (**standard** surface-based and **vibrant** tertiary-based),",
          "leading/trailing icons, keyboard shortcuts, supporting text, badges,",
          "section grouping with dividers and gap separators, density control,",
          "single/multiple selection with automatic checkmarks,",
          "nested submenus, and right-click context menus.",
        ].join("\n"),
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
      <button type="button" className={primaryBtn}>
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
      <button type="button" className={primaryBtn}>
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
      <button type="button" className={primaryBtn}>
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

// ─── Supporting Text ─────────────────────────────────────────────────────────

export const WithSupportingText: Story = {
  name: "With Supporting Text",
  parameters: {
    docs: {
      description: {
        story:
          "Use the `description` prop to add a secondary line of supporting text below the item label. Per MD3 anatomy item 8.",
      },
    },
  },
  render: () => (
    <MenuTrigger>
      <button type="button" className={primaryBtn}>
        Share
      </button>
      <MenuTrigger.Menu aria-label="Share via">
        <MenuItem
          id="email"
          leadingIcon={<CopyIcon />}
          description="Send to anyone with an email address"
        >
          Email
        </MenuItem>
        <MenuItem id="link" leadingIcon={<ShareIcon />} description="Anyone with the link can view">
          Copy link
        </MenuItem>
        <MenuItem
          id="message"
          leadingIcon={<InfoIcon />}
          description="Send via SMS to a phone number"
        >
          Text message
        </MenuItem>
      </MenuTrigger.Menu>
    </MenuTrigger>
  ),
};

// ─── With Badge ───────────────────────────────────────────────────────────────

export const WithBadge: Story = {
  name: "With Badge",
  parameters: {
    docs: {
      description: {
        story:
          "Use the `badge` prop to render a small badge between the label and trailing content. Per MD3 anatomy item 5.",
      },
    },
  },
  render: () => (
    <MenuTrigger>
      <button type="button" className={primaryBtn}>
        Notifications
      </button>
      <MenuTrigger.Menu aria-label="Notification settings">
        <MenuItem
          id="all"
          badge={
            <span className="text-label-small bg-error text-on-error flex h-4 min-w-4 items-center justify-center rounded-full px-1">
              12
            </span>
          }
        >
          All notifications
        </MenuItem>
        <MenuItem
          id="mentions"
          badge={
            <span className="text-label-small bg-tertiary text-on-tertiary flex h-4 min-w-4 items-center justify-center rounded-full px-1">
              3
            </span>
          }
        >
          Mentions only
        </MenuItem>
        <MenuItem id="none">None</MenuItem>
      </MenuTrigger.Menu>
    </MenuTrigger>
  ),
};

// ─── With Sections ────────────────────────────────────────────────────────────

export const WithSections: Story = {
  name: "With Sections and Dividers",
  render: () => (
    <MenuTrigger>
      <button type="button" className={primaryBtn}>
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
      <button type="button" className={primaryBtn}>
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
      <button type="button" className={primaryBtn}>
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

// ─── Density ──────────────────────────────────────────────────────────────────

export const DensityLevels: Story = {
  name: "Density Levels",
  parameters: {
    docs: {
      description: {
        story:
          "MD3 web-only density prop controls item height: `0`=48dp (default), `-1`=44dp, `-2`=40dp, `-3`=36dp.",
      },
    },
  },
  render: () => (
    <div className="flex items-start gap-4">
      {([-0, -1, -2, -3] as const).map((density) => (
        <MenuTrigger key={density}>
          <button type="button" className={primaryBtn}>
            density={density}
          </button>
          <MenuTrigger.Menu aria-label={`Density ${density}`} density={density}>
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
      ))}
    </div>
  ),
};

// ─── Selection — Single ───────────────────────────────────────────────────────

const SelectSingleDemo = (): JSX.Element => {
  const [selected, setSelected] = useState<string>("list");
  return (
    <div className="flex flex-col items-center gap-4">
      <MenuTrigger>
        <button type="button" className={primaryBtn}>
          View: {selected}
        </button>
        <MenuTrigger.Menu
          aria-label="View options"
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
          <MenuItem id="card" leadingIcon={<CardViewIcon />}>
            Card view
          </MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
      <p className="text-body-medium text-on-surface-variant">Selected: {selected}</p>
    </div>
  );
};

export const SelectSingle: Story = {
  name: "Selection — Single",
  parameters: {
    docs: {
      description: {
        story:
          "Single-selection menus automatically render a leading checkmark on the selected item. Checkmark does not appear when a `leadingIcon` is already provided.",
      },
    },
  },
  render: () => <SelectSingleDemo />,
};

// ─── Selection — Multiple ─────────────────────────────────────────────────────

const SelectMultipleDemo = (): JSX.Element => {
  const [selected, setSelected] = useState<Set<string>>(new Set(["bold"]));
  return (
    <div className="flex flex-col items-center gap-4">
      <MenuTrigger>
        <button type="button" className={primaryBtn}>
          Formatting
        </button>
        <MenuTrigger.Menu
          aria-label="Text formatting"
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
  name: "Selection — Multiple",
  render: () => <SelectMultipleDemo />,
};

// ─── Vibrant Color Scheme ─────────────────────────────────────────────────────

export const VibrantColorScheme: Story = {
  name: "Vibrant Color Scheme",
  parameters: {
    docs: {
      description: {
        story:
          "The `vibrant` color scheme uses the **tertiary container** background (vs. surface-container in standard). Designed for expressive vertical menus where stronger visual identity is desired.",
      },
    },
  },
  render: () => (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center gap-2">
        <span className="text-label-small text-on-surface-variant">Standard</span>
        <MenuTrigger>
          <button type="button" className={secondaryBtn}>
            Standard
          </button>
          <MenuTrigger.Menu aria-label="Standard" colorScheme="standard" menuStyle="vertical">
            <MenuItem id="star" leadingIcon={<StarIcon />}>
              Add to favourites
            </MenuItem>
            <MenuItem id="share" leadingIcon={<ShareIcon />}>
              Share
            </MenuItem>
            <MenuGap />
            <MenuItem id="delete" leadingIcon={<DeleteIcon />}>
              Delete
            </MenuItem>
          </MenuTrigger.Menu>
        </MenuTrigger>
      </div>
      <div className="flex flex-col items-center gap-2">
        <span className="text-label-small text-on-surface-variant">Vibrant</span>
        <MenuTrigger>
          <button type="button" className={tertiaryBtn}>
            Vibrant
          </button>
          <MenuTrigger.Menu aria-label="Vibrant" colorScheme="vibrant" menuStyle="vertical">
            <MenuItem id="star" leadingIcon={<StarIcon />}>
              Add to favourites
            </MenuItem>
            <MenuItem id="share" leadingIcon={<ShareIcon />}>
              Share
            </MenuItem>
            <MenuGap />
            <MenuItem id="delete" leadingIcon={<DeleteIcon />}>
              Delete
            </MenuItem>
          </MenuTrigger.Menu>
        </MenuTrigger>
      </div>
    </div>
  ),
};

// ─── Expressive Vertical Menu ─────────────────────────────────────────────────

export const VerticalMenuStyle: Story = {
  name: "Expressive Vertical Menu",
  parameters: {
    docs: {
      description: {
        story: [
          "The `vertical` (Expressive) menu style uses **16dp rounded corners** and the **segmented model** — each group of items is a separate rounded card.",
          "",
          "`MenuGap` creates a 2dp transparent gap between segments, letting the page background show through (acting as a visual divider without a line).",
          "",
          "Items within a segment share a surface: **standard** uses `surface-container-low`; **vibrant** uses `tertiary-container`.",
          "The **selected** row gets a rounded accent highlight (standard → `tertiary-container`, vibrant → `tertiary`).",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <div className="flex items-start gap-8">
      {/* ── Standard ── */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-label-small text-on-surface-variant">Standard</span>
        <MenuTrigger defaultOpen>
          <button type="button" className={primaryBtn}>
            More actions
          </button>
          <MenuTrigger.Menu
            aria-label="More actions (standard)"
            menuStyle="vertical"
            colorScheme="standard"
            selectionMode="single"
            defaultSelectedKeys={["star"]}
          >
            <MenuItem id="star" leadingIcon={<StarIcon />}>
              Add to favourites
            </MenuItem>
            <MenuItem id="share" leadingIcon={<ShareIcon />}>
              Share
            </MenuItem>
            <MenuGap />
            <MenuItem id="rename">Rename</MenuItem>
            <MenuItem id="duplicate">Duplicate</MenuItem>
            <MenuGap />
            <MenuItem id="delete" leadingIcon={<DeleteIcon />}>
              Delete
            </MenuItem>
          </MenuTrigger.Menu>
        </MenuTrigger>
      </div>

      {/* ── Vibrant ── */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-label-small text-on-surface-variant">Vibrant</span>
        <MenuTrigger defaultOpen>
          <button type="button" className={tertiaryBtn}>
            More actions
          </button>
          <MenuTrigger.Menu
            aria-label="More actions (vibrant)"
            menuStyle="vertical"
            colorScheme="vibrant"
            selectionMode="single"
            defaultSelectedKeys={["star"]}
          >
            <MenuItem id="star" leadingIcon={<StarIcon />}>
              Add to favourites
            </MenuItem>
            <MenuItem id="share" leadingIcon={<ShareIcon />}>
              Share
            </MenuItem>
            <MenuGap />
            <MenuItem id="rename">Rename</MenuItem>
            <MenuItem id="duplicate">Duplicate</MenuItem>
            <MenuGap />
            <MenuItem id="delete" leadingIcon={<DeleteIcon />}>
              Delete
            </MenuItem>
          </MenuTrigger.Menu>
        </MenuTrigger>
      </div>
    </div>
  ),
};

// ─── Expressive Vertical — States ─────────────────────────────────────────────

export const VerticalMenuStates: Story = {
  name: "Expressive Vertical — States",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story: [
          "All 6 MD3 Expressive vertical menu item states per the reference:",
          "",
          "1. **Enabled** — default appearance",
          "2. **Disabled** — pointer-events-none, content at 38% opacity",
          "3. **Hovered** — `on-surface` state layer at 8% opacity",
          "4. **Focused** — `secondary` outline ring (2dp inset), no state-layer fill",
          "5. **Pressed** — `on-surface` state layer at 10% opacity",
          "6. **Active / submenu-open** — `tertiary-container` (standard) or `tertiary` (vibrant) highlight + `on-tertiary-container` / `on-tertiary` content",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <div className="flex items-start gap-8">
      {/* Standard */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-label-small text-on-surface-variant">Standard</span>
        <MenuTrigger defaultOpen>
          <button type="button" className={primaryBtn}>
            Open
          </button>
          <MenuTrigger.Menu
            aria-label="States standard"
            menuStyle="vertical"
            colorScheme="standard"
            selectionMode="single"
            defaultSelectedKeys={["active"]}
          >
            <MenuItem id="enabled" leadingIcon={<InfoIcon />}>
              Enabled
            </MenuItem>
            <MenuItem id="disabled" leadingIcon={<InfoIcon />} isDisabled>
              Disabled
            </MenuItem>
            <MenuItem id="shortcut" leadingIcon={<CopyIcon />} trailingText="⌘C">
              With shortcut
            </MenuItem>
            <MenuGap />
            <MenuItem id="active" leadingIcon={<StarIcon />}>
              Selected / Active
            </MenuItem>
            <MenuItem id="desc" leadingIcon={<InfoIcon />} description="Supporting text">
              With description
            </MenuItem>
          </MenuTrigger.Menu>
        </MenuTrigger>
      </div>

      {/* Vibrant */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-label-small text-on-surface-variant">Vibrant</span>
        <MenuTrigger defaultOpen>
          <button type="button" className={tertiaryBtn}>
            Open
          </button>
          <MenuTrigger.Menu
            aria-label="States vibrant"
            menuStyle="vertical"
            colorScheme="vibrant"
            selectionMode="single"
            defaultSelectedKeys={["active"]}
          >
            <MenuItem id="enabled" leadingIcon={<InfoIcon />}>
              Enabled
            </MenuItem>
            <MenuItem id="disabled" leadingIcon={<InfoIcon />} isDisabled>
              Disabled
            </MenuItem>
            <MenuItem id="shortcut" leadingIcon={<CopyIcon />} trailingText="⌘C">
              With shortcut
            </MenuItem>
            <MenuGap />
            <MenuItem id="active" leadingIcon={<StarIcon />}>
              Selected / Active
            </MenuItem>
            <MenuItem id="desc" leadingIcon={<InfoIcon />} description="Supporting text">
              With description
            </MenuItem>
          </MenuTrigger.Menu>
        </MenuTrigger>
      </div>
    </div>
  ),
};

// ─── Expressive Vertical — MD3 Reference Example ──────────────────────────────

export const VerticalMenuReference: Story = {
  name: "Expressive Vertical — Reference Example",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story: [
          "Matches the MD3 anatomy reference exactly: two segments separated by a `MenuGap`.",
          "",
          "**Segment 1**: Item 1–4 with leading icons, trailing text, and a submenu trigger.",
          "**Segment 2**: A section header (Label text) and Item 5 with supporting text and submenu.",
          "",
          "The gap between segments reveals the page background — acting as the visual divider.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <div className="flex items-start gap-8">
      {/* Standard */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-label-small text-on-surface-variant">Standard</span>
        <MenuTrigger defaultOpen>
          <button type="button" className={primaryBtn}>
            Open
          </button>
          <MenuTrigger.Menu
            aria-label="Reference standard"
            menuStyle="vertical"
            colorScheme="standard"
            selectionMode="single"
            defaultSelectedKeys={["item4"]}
          >
            <MenuItem id="item1" leadingIcon={<InfoIcon />}>
              Item 1
            </MenuItem>
            <MenuItem id="item2" leadingIcon={<CopyIcon />} trailingText="⌘C">
              Item 2
            </MenuItem>
            <MenuItem id="item3" leadingIcon={<CutIcon />}>
              Item 3
            </MenuItem>
            <MenuItem id="item4" leadingIcon={<StarIcon />}>
              Item 4
            </MenuItem>
            <MenuGap />
            <MenuSection header="Label text" aria-label="Label text">
              <MenuItem
                id="item5"
                leadingIcon={<InfoIcon />}
                description="Supporting text"
                trailingText="⌘V"
              >
                Item 5
              </MenuItem>
            </MenuSection>
          </MenuTrigger.Menu>
        </MenuTrigger>
      </div>

      {/* Vibrant */}
      <div className="flex flex-col items-center gap-2">
        <span className="text-label-small text-on-surface-variant">Vibrant</span>
        <MenuTrigger defaultOpen>
          <button type="button" className={tertiaryBtn}>
            Open
          </button>
          <MenuTrigger.Menu
            aria-label="Reference vibrant"
            menuStyle="vertical"
            colorScheme="vibrant"
            selectionMode="single"
            defaultSelectedKeys={["item4"]}
          >
            <MenuItem id="item1" leadingIcon={<InfoIcon />}>
              Item 1
            </MenuItem>
            <MenuItem id="item2" leadingIcon={<CopyIcon />} trailingText="⌘C">
              Item 2
            </MenuItem>
            <MenuItem id="item3" leadingIcon={<CutIcon />}>
              Item 3
            </MenuItem>
            <MenuItem id="item4" leadingIcon={<StarIcon />}>
              Item 4
            </MenuItem>
            <MenuGap />
            <MenuSection header="Label text" aria-label="Label text">
              <MenuItem
                id="item5"
                leadingIcon={<InfoIcon />}
                description="Supporting text"
                trailingText="⌘V"
              >
                Item 5
              </MenuItem>
            </MenuSection>
          </MenuTrigger.Menu>
        </MenuTrigger>
      </div>
    </div>
  ),
};

// ─── Gap vs Divider ───────────────────────────────────────────────────────────

export const GapVsDivider: Story = {
  name: "Gap vs Divider (Vertical)",
  parameters: {
    docs: {
      description: {
        story: [
          "Side-by-side comparison of the two MD3 vertical-menu separator styles.",
          "",
          "- **With gap** (left): A purely visual blank space (`MenuGap`) separates item groups. No visible line — the gap is hidden from the accessibility tree.",
          "- **With divider** (right): A thin horizontal rule (`MenuDivider`) drawn with `outline-variant` colour separates groups.",
        ].join("\n"),
      },
    },
  },
  render: () => (
    <div className="flex items-start gap-8">
      {/* ── With gap ── */}
      <div className="flex flex-col items-center gap-2">
        <MenuTrigger defaultOpen>
          <button type="button" className={primaryBtn}>
            With gap
          </button>
          <MenuTrigger.Menu aria-label="With gap" menuStyle="vertical">
            <MenuItem id="item1" leadingIcon={<InfoIcon />}>
              Item 1
            </MenuItem>
            <MenuItem id="item2" leadingIcon={<CopyIcon />} trailingText="⌘C">
              Item 2
            </MenuItem>
            <MenuItem id="item3" leadingIcon={<CutIcon />}>
              Item 3
            </MenuItem>
            <MenuGap />
            <MenuItem id="item4" leadingIcon={<StarIcon />} trailingIcon={<span>▸</span>}>
              Item 4
            </MenuItem>
          </MenuTrigger.Menu>
        </MenuTrigger>
      </div>

      {/* ── With divider ── */}
      <div className="flex flex-col items-center gap-2">
        <MenuTrigger defaultOpen>
          <button type="button" className={primaryBtn}>
            With divider
          </button>
          <MenuTrigger.Menu aria-label="With divider" menuStyle="vertical">
            <MenuItem id="d-item1" leadingIcon={<InfoIcon />}>
              Item 1
            </MenuItem>
            <MenuItem id="d-item2" leadingIcon={<CopyIcon />} trailingText="⌘C">
              Item 2
            </MenuItem>
            <MenuItem id="d-item3" leadingIcon={<CutIcon />}>
              Item 3
            </MenuItem>
            <MenuDivider />
            <MenuItem id="d-item4" leadingIcon={<StarIcon />} trailingIcon={<span>▸</span>}>
              Item 4
            </MenuItem>
          </MenuTrigger.Menu>
        </MenuTrigger>
      </div>
    </div>
  ),
};

// ─── Submenu ──────────────────────────────────────────────────────────────────

export const WithSubmenu: Story = {
  name: "With Submenu",
  parameters: {
    docs: {
      description: {
        story:
          "Use `SubmenuTrigger` to nest a second menu inside a `MenuItem`. A trailing chevron is automatically appended. Keyboard: `ArrowRight` opens, `ArrowLeft` / `Escape` closes and returns focus to the parent item.",
      },
    },
  },
  render: () => (
    <MenuTrigger>
      <button type="button" className={primaryBtn}>
        Actions
      </button>
      <MenuTrigger.Menu aria-label="Actions">
        <MenuItem id="copy" leadingIcon={<CopyIcon />}>
          Copy
        </MenuItem>
        <SubmenuTrigger>
          <MenuItem id="share" leadingIcon={<ShareIcon />}>
            Share
          </MenuItem>
          <MenuTrigger.Menu aria-label="Share via">
            <MenuItem id="email">Email</MenuItem>
            <MenuItem id="sms">SMS</MenuItem>
            <MenuItem id="link" trailingText="⌘L">
              Copy link
            </MenuItem>
          </MenuTrigger.Menu>
        </SubmenuTrigger>
        <MenuDivider />
        <MenuItem id="delete" leadingIcon={<DeleteIcon />}>
          Delete
        </MenuItem>
      </MenuTrigger.Menu>
    </MenuTrigger>
  ),
};

// ─── Context Menu ─────────────────────────────────────────────────────────────

const ContextMenuDemo = (): JSX.Element => {
  const [lastAction, setLastAction] = useState<string>("(none)");
  return (
    <div className="flex flex-col items-center gap-6">
      <ContextMenuTrigger>
        <div className="border-outline text-on-surface-variant text-body-medium flex h-32 w-64 items-center justify-center rounded-lg border-dashed select-none">
          Right-click anywhere here
        </div>
        <MenuTrigger.Menu
          aria-label="Context actions"
          onAction={(key) => setLastAction(String(key))}
        >
          <MenuItem id="cut" leadingIcon={<CutIcon />} trailingText="⌘X">
            Cut
          </MenuItem>
          <MenuItem id="copy" leadingIcon={<CopyIcon />} trailingText="⌘C">
            Copy
          </MenuItem>
          <MenuItem id="paste" leadingIcon={<PasteIcon />} trailingText="⌘V">
            Paste
          </MenuItem>
          <MenuDivider />
          <MenuItem id="select-all" trailingText="⌘A">
            Select all
          </MenuItem>
        </MenuTrigger.Menu>
      </ContextMenuTrigger>
      <p className="text-body-medium text-on-surface-variant">Last action: {lastAction}</p>
    </div>
  );
};

export const ContextMenu: Story = {
  name: "Context Menu (Right-click)",
  parameters: {
    docs: {
      description: {
        story:
          "Wrap any content with `ContextMenuTrigger` to open a menu on right-click or two-finger tap. The menu is positioned at the pointer coordinates.",
      },
    },
  },
  render: () => <ContextMenuDemo />,
};

// ─── Scrollable ───────────────────────────────────────────────────────────────

export const Scrollable: Story = {
  name: "Scrollable Menu",
  parameters: {
    docs: {
      description: {
        story:
          "When menu content exceeds the available viewport height the menu becomes scrollable. Max height is `calc(100vh - 2rem)` by default.",
      },
    },
  },
  render: () => (
    <MenuTrigger>
      <button type="button" className={primaryBtn}>
        Select country
      </button>
      <MenuTrigger.Menu aria-label="Countries">
        {[
          "Argentina",
          "Australia",
          "Brazil",
          "Canada",
          "China",
          "Denmark",
          "Egypt",
          "Finland",
          "France",
          "Germany",
          "India",
          "Indonesia",
          "Italy",
          "Japan",
          "Mexico",
          "Netherlands",
          "New Zealand",
          "Nigeria",
          "Norway",
          "Poland",
          "Portugal",
          "South Africa",
          "South Korea",
          "Spain",
          "Sweden",
          "Switzerland",
          "Turkey",
          "United Kingdom",
          "United States",
          "Vietnam",
        ].map((country) => (
          <MenuItem key={country} id={country.toLowerCase().replace(/ /g, "-")}>
            {country}
          </MenuItem>
        ))}
      </MenuTrigger.Menu>
    </MenuTrigger>
  ),
};

// ─── Controlled Open ──────────────────────────────────────────────────────────

const ControlledOpenDemo = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastAction, setLastAction] = useState<string>("(none)");
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-3">
        <button type="button" onClick={() => setIsOpen(true)} className={primaryBtn}>
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

// ─── Icon Button Trigger ──────────────────────────────────────────────────────

export const IconButtonTrigger: Story = {
  name: "With Icon Button Trigger",
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
        <MenuItem id="share" leadingIcon={<ShareIcon />}>
          Share
        </MenuItem>
        <MenuDivider />
        <MenuItem id="delete" leadingIcon={<DeleteIcon />}>
          Delete
        </MenuItem>
      </MenuTrigger.Menu>
    </MenuTrigger>
  ),
};

// ─── Dark Mode — Standard ─────────────────────────────────────────────────────

export const DarkMode: Story = {
  name: "Dark Mode — Standard",
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Standard color scheme in dark mode. Tokens automatically adapt via CSS `@media (prefers-color-scheme: dark)` or `.dark` class.",
      },
    },
  },
  render: () => (
    <div className="dark">
      <MenuTrigger>
        <button type="button" className={primaryBtn}>
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

// ─── Dark Mode — Vibrant ──────────────────────────────────────────────────────

export const DarkModeVibrant: Story = {
  name: "Dark Mode — Vibrant Vertical",
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: () => (
    <div className="dark">
      <MenuTrigger>
        <button type="button" className={tertiaryBtn}>
          More actions
        </button>
        <MenuTrigger.Menu aria-label="More actions" menuStyle="vertical" colorScheme="vibrant">
          <MenuItem id="star" leadingIcon={<StarIcon />}>
            Add to favourites
          </MenuItem>
          <MenuItem id="share" leadingIcon={<ShareIcon />}>
            Share
          </MenuItem>
          <MenuGap />
          <MenuItem id="delete" leadingIcon={<DeleteIcon />}>
            Delete
          </MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    </div>
  ),
};

// ─── Headless Primitive ───────────────────────────────────────────────────────

export const HeadlessPrimitive: Story = {
  name: "Headless — Custom Styling",
  parameters: {
    docs: {
      description: {
        story:
          "Layer 2 headless primitives expose the full RAC API without any MD3 styles applied. Use these as a foundation for fully custom styling.",
      },
    },
  },
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
        className={cn(
          menuContainerVariants({ menuStyle: "baseline" }),
          "border-outline-variant border"
        )}
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
