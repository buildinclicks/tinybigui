import React from "react";
import type { JSX } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Search } from "./Search";
import { SearchBar } from "./SearchBar";
import { SearchView } from "./SearchView";
import { List } from "../List/List";
import { ListItem } from "../List/ListItem";
import { IconButton } from "../IconButton/IconButton";
import type { SearchProps } from "./Search.types";

// ─── MD3 Material Icons (inline SVG) ─────────────────────────────────────────

const SearchIcon = (): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const MoreVertIcon = (): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

const MicIcon = (): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
  </svg>
);

// ─── Inline Avatar helpers ────────────────────────────────────────────────────

interface InlineAvatarProps {
  src: string;
  alt: string;
}

const InlineAvatar = ({ src, alt }: InlineAvatarProps): JSX.Element => (
  <img src={src} alt={alt} className="size-[30px] rounded-full object-cover" />
);

interface InitialsAvatarProps {
  initials: string;
  colorClass?: string;
}

const InitialsAvatar = ({
  initials,
  colorClass = "bg-secondary-container text-on-secondary-container",
}: InitialsAvatarProps): JSX.Element => (
  <span
    className={`text-label-medium flex size-[30px] items-center justify-center rounded-full font-medium ${colorClass}`}
  >
    {initials}
  </span>
);

// ─── Named component wrappers for stateful stories ───────────────────────────

function ContainedFullScreenExample(): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(true);
  const [value, setValue] = React.useState("Ping");
  return (
    <div className="bg-surface min-h-screen">
      <button
        type="button"
        className="bg-primary text-on-primary text-label-large m-4 rounded-full px-4 py-2"
        onClick={() => setIsOpen(true)}
      >
        Open Search
      </button>
      <SearchView
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        value={value}
        onChange={setValue}
        onSubmit={(v) => console.log("Submitted:", v)}
        placeholder="Search messages"
        aria-label="Search messages"
        searchStyle="contained"
        layout="fullscreen"
      >
        <List aria-label="Search results">
          <ListItem
            value="ping"
            leadingSlot={<InitialsAvatar initials="P" />}
            leadingType="avatar"
            headline="Ping, Haneul"
            supportingText="Q3 performance summary • 8:22 AM"
          />
          <ListItem
            value="zita"
            leadingSlot={<InitialsAvatar initials="Z" />}
            leadingType="avatar"
            headline="Zita, Odette, Dagmar"
            supportingText="Movie marathon • 7:15 AM"
          />
          <ListItem
            value="in"
            leadingSlot={<InitialsAvatar initials="I" />}
            leadingType="avatar"
            headline="In, Aki Aro"
            supportingText="Museum field trip • 9:40 AM"
          />
        </List>
      </SearchView>
    </div>
  );
}

function ContainedDockedExample(): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(true);
  const [value, setValue] = React.useState("Eli");
  return (
    <div className="bg-surface flex min-h-[400px] items-start justify-center p-8">
      <SearchView
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        value={value}
        onChange={setValue}
        placeholder="Search"
        aria-label="Search"
        searchStyle="contained"
        layout="docked"
      >
        <List aria-label="Search results">
          <ListItem
            value="eli"
            headline="Eli, me"
            supportingText="Adopt a pup? The pet adoption..."
          />
          <ListItem
            value="zita"
            headline="Zita, Odette, Dagmar"
            supportingText="Movie marathon • We have to watch..."
          />
          <ListItem
            value="in"
            headline="In, Aki Aro"
            supportingText="Museum field trip • So far about..."
          />
        </List>
      </SearchView>
    </div>
  );
}

function DividedFullScreenExample(): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(true);
  const [value, setValue] = React.useState("Eli");
  return (
    <SearchView
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      value={value}
      onChange={setValue}
      placeholder="Search"
      aria-label="Search"
      searchStyle="divided"
      layout="fullscreen"
    >
      <List aria-label="Search results">
        <ListItem
          value="eli"
          headline="Eli, me"
          supportingText="Adopt a pup? The pet adoption..."
        />
        <ListItem value="zita" headline="Zita, Odette, Dagmar" supportingText="Movie marathon" />
        <ListItem value="in" headline="In, Aki" supportingText="Museum field trip" />
      </List>
    </SearchView>
  );
}

function DividedDockedExample(): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(true);
  const [value, setValue] = React.useState("Eli");
  return (
    <div className="bg-surface flex min-h-[400px] items-start justify-center p-8">
      <SearchView
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        value={value}
        onChange={setValue}
        placeholder="Search"
        aria-label="Search"
        searchStyle="divided"
        layout="docked"
      >
        <List aria-label="Search results">
          <ListItem value="eli" headline="Eli, me" supportingText="Adopt a pup?" />
          <ListItem value="zita" headline="Zita, Odette, Dagmar" supportingText="Movie marathon" />
          <ListItem value="in" headline="In, Aki" supportingText="Museum field trip" />
        </List>
      </SearchView>
    </div>
  );
}

function SearchBarToViewExample(): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const suggestions = [
    { id: "1", headline: "Ping, Haneul", supporting: "Q3 performance summary • 8:22 AM" },
    { id: "2", headline: "Zita, Odette, Dagmar", supporting: "Movie marathon • 7:15 AM" },
    { id: "3", headline: "In, Aki Aro", supporting: "Museum field trip • 9:40 AM" },
  ].filter((s) => !value || s.headline.toLowerCase().includes(value.toLowerCase()));

  return (
    <div className="bg-surface min-h-screen p-4">
      <Search
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        value={value}
        onChange={setValue}
        onSubmit={(v) => alert(`Search submitted: ${v}`)}
        placeholder="Search messages"
        viewAriaLabel="Search messages"
        searchStyle="contained"
        layout="fullscreen"
        trailingActions={[
          <IconButton key="mic" aria-label="Voice search">
            <MicIcon />
          </IconButton>,
        ]}
      >
        {suggestions.length > 0 && (
          <List aria-label="Search results">
            {suggestions.map((s) => (
              <ListItem
                key={s.id}
                value={s.id}
                headline={s.headline}
                supportingText={s.supporting}
              />
            ))}
          </List>
        )}
      </Search>
    </div>
  );
}

function GroupedResultsExample(): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(true);
  const [value, setValue] = React.useState("m");
  return (
    <div className="bg-surface flex min-h-[500px] items-start justify-center p-8">
      <SearchView
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        value={value}
        onChange={setValue}
        placeholder="Search"
        aria-label="Search"
        searchStyle="contained"
        layout="docked"
      >
        <div className="flex flex-col gap-2 p-2">
          <div>
            <p className="text-label-small text-on-surface-variant px-4 py-2">People</p>
            <List aria-label="People results">
              <ListItem
                value="maria"
                leadingSlot={<InitialsAvatar initials="M" />}
                leadingType="avatar"
                headline="Maria Chen"
                supportingText="Engineering"
              />
              <ListItem
                value="marcus"
                leadingSlot={
                  <InitialsAvatar
                    initials="M"
                    colorClass="bg-tertiary-container text-on-tertiary-container"
                  />
                }
                leadingType="avatar"
                headline="Marcus Lee"
                supportingText="Design"
              />
            </List>
          </div>
          <div>
            <p className="text-label-small text-on-surface-variant px-4 py-2">Messages</p>
            <List aria-label="Message results">
              <ListItem
                value="standup"
                headline="Monday standup notes"
                supportingText="Shared by Marcus • Yesterday"
              />
              <ListItem
                value="marketing"
                headline="Marketing campaign brief"
                supportingText="Shared by Maria • 2 days ago"
              />
            </List>
          </div>
        </div>
      </SearchView>
    </div>
  );
}

function PlaygroundExample(args: Partial<SearchProps>): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  return (
    <div className="bg-surface min-h-[400px] w-full p-4">
      <Search
        {...args}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        value={value}
        onChange={setValue}
        viewAriaLabel={args.placeholder ?? "Search"}
      >
        <List aria-label="Search results">
          <ListItem value="1" headline="Result one" supportingText="Supporting text" />
          <ListItem value="2" headline="Result two" supportingText="Supporting text" />
          <ListItem value="3" headline="Result three" supportingText="Supporting text" />
        </List>
      </Search>
    </div>
  );
}

// ─── Storybook Meta ────────────────────────────────────────────────────────────

const meta: Meta<typeof Search> = {
  title: "Components/Search",
  component: Search,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
MD3 Search lets people enter a keyword or phrase to get relevant information.

**Two Styles:**
- Contained (M3 Expressive — recommended): filled container, rounded pill shape, expressive motion when focused
- Divided (Baseline): divider separates bar from results; no expressive motion

**Two Layouts:**
- Full-screen: covers the full viewport
- Docked: constrained popover (min 360dp / max 720dp)

**States:** Maximized (at rest) → Focused (when activated)

Ref: \`docs/md3-components/search/detail.md\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    searchStyle: {
      control: { type: "select" },
      options: ["contained", "divided"],
      description: "Visual style — contained (M3 Expressive) or divided (Baseline)",
      table: { defaultValue: { summary: "contained" } },
    },
    layout: {
      control: { type: "select" },
      options: ["fullscreen", "docked"],
      description: "Layout of the suggestions/results container",
      table: { defaultValue: { summary: "fullscreen" } },
    },
    placeholder: {
      control: "text",
      description: "Hinted search text — also used as the accessibility label",
    },
    isDisabled: {
      control: "boolean",
      description: "Disables the search bar",
      table: { defaultValue: { summary: false } },
    },
  },
};

export default meta;

// ─── Search Bar Stories (8) ────────────────────────────────────────────────────

/**
 * Default contained search bar in Maximized State with a leading search icon and placeholder text.
 * This is the at-rest affordance before the user interacts.
 */
export const DefaultSearchBar: StoryObj<typeof SearchBar> = {
  parameters: {
    docs: {
      description: {
        story:
          "The default contained search bar in Maximized State with a leading search icon and placeholder text. This is the at-rest affordance before the user interacts.",
      },
    },
  },
  render: () => <SearchBar placeholder="Search messages" searchStyle="contained" />,
};

/**
 * Search bar with an avatar in the trailing slot.
 * Config 1 from the MD3 examples.
 */
export const SearchBarWithAvatar: StoryObj<typeof SearchBar> = {
  parameters: {
    docs: {
      description: {
        story:
          "Search bar with an avatar in the trailing slot. Config 1 from the MD3 examples — used when the search bar represents a user-scoped search context.",
      },
    },
  },
  render: () => (
    <SearchBar
      placeholder="Hinted search text"
      avatar={<InlineAvatar src="https://i.pravatar.cc/30" alt="User avatar" />}
    />
  ),
};

/**
 * Search bar with one trailing icon button.
 * Config 2 from the MD3 examples.
 */
export const SearchBarWithOneTrailingIcon: StoryObj<typeof SearchBar> = {
  parameters: {
    docs: {
      description: {
        story: "Search bar with one trailing icon button. Config 2 from the MD3 examples.",
      },
    },
  },
  render: () => (
    <SearchBar
      placeholder="Hinted search text"
      trailingActions={[
        <IconButton key="search" aria-label="Search">
          <SearchIcon />
        </IconButton>,
      ]}
    />
  ),
};

/**
 * Search bar with two trailing icon buttons.
 * Config 3 from the MD3 examples.
 */
export const SearchBarWithTwoTrailingIcons: StoryObj<typeof SearchBar> = {
  parameters: {
    docs: {
      description: {
        story: "Search bar with two trailing icon buttons. Config 3 from the MD3 examples.",
      },
    },
  },
  render: () => (
    <SearchBar
      placeholder="Hinted search text"
      trailingActions={[
        <IconButton key="search" aria-label="Search">
          <SearchIcon />
        </IconButton>,
        <IconButton key="more" aria-label="More options">
          <MoreVertIcon />
        </IconButton>,
      ]}
    />
  ),
};

/**
 * Search bar with a trailing icon button and an avatar.
 * Config 4 from the MD3 examples — the most common real-world configuration.
 */
export const SearchBarWithIconAndAvatar: StoryObj<typeof SearchBar> = {
  parameters: {
    docs: {
      description: {
        story:
          "Search bar with a trailing icon button and an avatar. Config 4 from the MD3 examples — the most common real-world configuration.",
      },
    },
  },
  render: () => (
    <SearchBar
      placeholder="Hinted search text"
      trailingActions={[
        <IconButton key="search" aria-label="Search">
          <SearchIcon />
        </IconButton>,
      ]}
      avatar={<InlineAvatar src="https://i.pravatar.cc/30" alt="User avatar" />}
    />
  ),
};

/**
 * Search bar in the Divided (Baseline) style.
 * Uses 16dp leading/trailing spacing and no expressive motion.
 */
export const SearchBarDividedStyle: StoryObj<typeof SearchBar> = {
  parameters: {
    docs: {
      description: {
        story:
          "Search bar in the Divided (Baseline) style. Uses 16dp leading/trailing spacing and no expressive motion. This is the original MD3 design without M3 Expressive updates.",
      },
    },
  },
  render: () => <SearchBar placeholder="Hinted search text" searchStyle="divided" />,
};

/**
 * Search bar in the disabled state — non-interactive, 38% opacity.
 */
export const SearchBarDisabled: StoryObj<typeof SearchBar> = {
  parameters: {
    docs: {
      description: {
        story: "Search bar in the disabled state — non-interactive, 38% opacity.",
      },
    },
  },
  render: () => <SearchBar placeholder="Search messages" isDisabled />,
};

/**
 * All four interaction states of the Search bar side by side.
 * Ref: docs/md3-components/search/images/state-search-bar.png
 */
export const SearchBarStates: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          "All four interaction states of the Search bar: Enabled, Hovered, Focused (with focus indicator ring in secondary color), and Pressed (with ripple). Reference: docs/md3-components/search/images/state-search-bar.png.",
      },
    },
  },
  render: () => (
    <div className="flex w-[400px] flex-col gap-6">
      <div>
        <p className="text-label-small text-on-surface-variant mb-2">1. Enabled</p>
        <SearchBar placeholder="Hinted search text" />
      </div>
      <div>
        <p className="text-label-small text-on-surface-variant mb-2">2. Hovered (hover over bar)</p>
        <SearchBar placeholder="Hinted search text" />
      </div>
      <div>
        <p className="text-label-small text-on-surface-variant mb-2">3. Focused (tab to focus)</p>
        <SearchBar placeholder="Search query" />
      </div>
      <div>
        <p className="text-label-small text-on-surface-variant mb-2">4. Pressed (ripple)</p>
        <SearchBar placeholder="Search query" />
      </div>
    </div>
  ),
};

// ─── Search View Stories (4) ──────────────────────────────────────────────────

/**
 * SearchView in the Contained (M3 Expressive) style with Full-screen layout.
 */
export const ContainedFullScreen: StoryObj<typeof SearchView> = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "SearchView in the Contained (M3 Expressive) style with Full-screen layout. Background: surface-container-low, no corner rounding, 56dp header height. Results appear in a full-viewport overlay. Reference: docs/md3-components/search/images/full-screen-layout.png.",
      },
    },
  },
  render: () => <ContainedFullScreenExample />,
};

/**
 * SearchView in the Contained (M3 Expressive) style with Docked layout.
 */
export const ContainedDocked: StoryObj<typeof SearchView> = {
  parameters: {
    docs: {
      description: {
        story:
          "SearchView in the Contained (M3 Expressive) style with Docked layout. Background: surface-container-high, rounded-full bar, 12dp results rounding, 2dp gap between bar and results. Width: min 360dp / max 720dp. Reference: docs/md3-components/search/images/docked-layout.png.",
      },
    },
  },
  render: () => <ContainedDockedExample />,
};

/**
 * SearchView in the Divided (Baseline) style with Full-screen layout.
 */
export const DividedFullScreen: StoryObj<typeof SearchView> = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "SearchView in the Divided (Baseline) style with Full-screen layout. Background: surface-container-high, 72dp header height, a divider separates the header from results. Reference: docs/md3-components/search/images/full-screen-layout-divided.png.",
      },
    },
  },
  render: () => <DividedFullScreenExample />,
};

/**
 * SearchView in the Divided (Baseline) style with Docked layout.
 */
export const DividedDocked: StoryObj<typeof SearchView> = {
  parameters: {
    docs: {
      description: {
        story:
          "SearchView in the Divided (Baseline) style with Docked layout. Background: surface-container-high, 56dp header, 28dp extra-large rounded container, divider between header and results. Reference: docs/md3-components/search/images/docked-layout-divided.png.",
      },
    },
  },
  render: () => <DividedDockedExample />,
};

// ─── Interactive / Compound Stories (3) ──────────────────────────────────────

/**
 * Primary interactive story. Demonstrates the full MD3 Search interaction flow:
 * Maximized State → Click/Tab → Focused State → type → results → clear → back.
 */
export const SearchBarToView: StoryObj<typeof Search> = {
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story: `
**Primary interactive story.** Demonstrates the full MD3 Search interaction flow:

1. **Maximized State** — the search bar is at rest with a leading search icon and placeholder
2. **Click or Tab+Enter/Space** — bar activates, SearchView opens (Focused State)
3. **Type** — input accepts text, suggestions appear in results area below
4. **Clear button** — appears when text is typed; clicking resets input but stays focused
5. **Back arrow** — returns to Maximized State (closes SearchView)

Includes M3 Expressive motion: bar pane margins transition from 24dp to 12dp on focus.
        `,
      },
    },
  },
  render: () => <SearchBarToViewExample />,
};

/**
 * Demonstrates the M3 Expressive feature where gaps separate results into visual groups.
 */
export const GroupedResults: StoryObj<typeof SearchView> = {
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the M3 Expressive feature where gaps separate results into visual groups. Consumers use standard Tailwind gap/space utilities on List children to achieve this grouping effect.",
      },
    },
  },
  render: () => <GroupedResultsExample />,
};

/**
 * Full interactive playground with all controls wired up.
 */
export const Playground: StoryObj<typeof Search> = {
  parameters: {
    docs: {
      description: {
        story:
          "Full interactive playground with all controls wired up. Use the controls panel to explore all style, layout, and state combinations.",
      },
    },
  },
  args: {
    searchStyle: "contained",
    layout: "fullscreen",
    placeholder: "Search messages",
    isDisabled: false,
  },
  render: (args) => <PlaygroundExample {...args} />,
};
