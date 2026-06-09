"use client";

import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { AppBar } from "./AppBar";
import { AppBarHeadless } from "./AppBarHeadless";
import { IconButton } from "../IconButton/IconButton";

// ─── Icon primitives ──────────────────────────────────────────────────────────

const IconMenu = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
  </svg>
);

const IconArrowBack = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);

const IconSearch = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const IconShare = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
  </svg>
);

const IconMoreVert = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

const IconClose = (): React.ReactElement => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

// ─── Reusable slot elements using <IconButton> ────────────────────────────────

const NavMenuButton = (): React.ReactElement => (
  <IconButton aria-label="Open navigation menu">
    <IconMenu />
  </IconButton>
);

const NavBackButton = (): React.ReactElement => (
  <IconButton aria-label="Go back">
    <IconArrowBack />
  </IconButton>
);

const SearchAction = (): React.ReactElement => (
  <IconButton aria-label="Search">
    <IconSearch />
  </IconButton>
);

const ShareAction = (): React.ReactElement => (
  <IconButton aria-label="Share">
    <IconShare />
  </IconButton>
);

const MoreAction = (): React.ReactElement => (
  <IconButton aria-label="More options">
    <IconMoreVert />
  </IconButton>
);

const CloseAction = (): React.ReactElement => (
  <IconButton aria-label="Close">
    <IconClose />
  </IconButton>
);

// ─── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta<typeof AppBar> = {
  title: "Components/AppBar",
  component: AppBar,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Material Design 3 Top App Bar (M3 Expressive Flexible). Provides context and actions for the current screen. Supports four size variants (small, center-aligned, medium, large), an optional subtitle, and composable navigation icon and action icon slots. Medium and large variants are M3 Expressive Flexible bars that grow vertically when a subtitle is present (136dp / 152dp). Scroll-triggered elevation applies `bg-surface-container` + `shadow-elevation-2` via a presence-based `data-scrolled` attribute and standard spring motion.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["small", "center-aligned", "medium", "large"],
      description: "Size variant — controls bar height, title position, and type scale",
    },
    scrolled: {
      control: "boolean",
      description:
        "Controlled scroll state. When true, sets data-scrolled and applies surface-container background + elevation-2 via group-data selectors.",
    },
    title: {
      control: "text",
      description: "Title content. Accepts string or ReactNode.",
    },
    subtitle: {
      control: "text",
      description:
        "Optional subtitle rendered below the title. M3 Expressive Flexible type scales: small/center = label-medium (on-surface-variant); medium expanded = label-large (on-surface-variant); large expanded = title-medium (on-surface-variant). Setting a subtitle on medium/large also grows the bar height: 136dp (medium) / 152dp (large).",
    },
  },
};

export default meta;
type Story = StoryObj<typeof AppBar>;

// ─── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    title: "Page Title",
    variant: "small",
    navigationIcon: <NavMenuButton />,
    actions: <SearchAction />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The default small AppBar with navigation icon, title, and one action. 64dp height, title-large type scale.",
      },
    },
  },
};

// ─── All Variants ──────────────────────────────────────────────────────────────

export const Variants: Story = {
  render: () => (
    <div className="divide-outline-variant flex flex-col gap-0 divide-y">
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">
          small — 64dp, title: title-large
        </p>
        <AppBar
          variant="small"
          title="Small App Bar"
          navigationIcon={<NavMenuButton />}
          actions={<SearchAction />}
        />
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">
          center-aligned — 64dp, title: title-large, centered
        </p>
        <AppBar
          variant="center-aligned"
          title="Center Aligned"
          navigationIcon={<NavMenuButton />}
          actions={<SearchAction />}
        />
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">
          medium — 112dp (136dp with subtitle), title: headline-medium, subtitle: label-large
        </p>
        <AppBar
          variant="medium"
          title="Medium App Bar"
          navigationIcon={<NavBackButton />}
          actions={<MoreAction />}
        />
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">
          large — 120dp (152dp with subtitle), title: display-small, subtitle: title-medium
        </p>
        <AppBar
          variant="large"
          title="Large App Bar"
          navigationIcon={<NavBackButton />}
          actions={<MoreAction />}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All four MD3 Top App Bar size variants. Small and center-aligned are fixed at 64dp. Medium and large are M3 Expressive Flexible bars: 112/120dp without subtitle, 136/152dp with subtitle.",
      },
    },
  },
};

// ─── Figma Showcase — all 12 configurations ────────────────────────────────────

/**
 * Placeholder avatar for Search and Small-centered configurations.
 */
const Avatar = (): React.ReactElement => (
  <div
    className="bg-surface-container-high flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
    role="img"
    aria-label="User avatar"
  >
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  </div>
);

/**
 * Composed Search Bar for use inside AppBarHeadless (Search configuration).
 */
const SearchBar = ({ scrolled }: { scrolled: boolean }): React.ReactElement => (
  <div
    className={`flex h-14 flex-1 items-center rounded-full px-5 ${
      scrolled ? "bg-surface-container-highest" : "bg-surface-container"
    }`}
  >
    <span className="text-body-large text-on-surface-variant flex-1">Search products</span>
  </div>
);

/**
 * Brand image placeholder for the Small-image configuration.
 */
const BrandImage = (): React.ReactElement => (
  <div className="flex h-10 items-center justify-center rounded" role="img" aria-label="Brand logo">
    <svg width="80" height="28" viewBox="0 0 80 28" fill="currentColor" aria-hidden="true">
      <rect width="80" height="8" rx="4" className="text-surface-container-high fill-current" />
      <rect
        y="12"
        width="60"
        height="8"
        rx="4"
        className="text-surface-container-high fill-current"
      />
      <rect
        y="24"
        width="40"
        height="4"
        rx="2"
        className="text-surface-container-high fill-current"
      />
    </svg>
  </div>
);

export const FigmaShowcase: Story = {
  render: () => (
    <div className="divide-outline-variant flex flex-col divide-y">
      {/* ── Flat configurations ── */}
      <p className="text-label-large text-on-surface-variant bg-surface-container-low px-4 py-3">
        Elevation: Flat (at rest)
      </p>

      {/* Small-centered / Flat */}
      <div>
        <p className="text-label-small text-on-surface-variant px-4 py-1">Small-centered · Flat</p>
        <AppBar
          variant="center-aligned"
          title="Label"
          navigationIcon={<NavMenuButton />}
          actions={<Avatar />}
        />
      </div>

      {/* Search / Flat */}
      <div>
        <p className="text-label-small text-on-surface-variant px-4 py-1">Search · Flat</p>
        <AppBarHeadless className="bg-surface flex w-full items-center gap-0 px-1 py-2">
          <NavMenuButton />
          <div className="flex flex-1 items-center px-2">
            <SearchBar scrolled={false} />
          </div>
          <Avatar />
        </AppBarHeadless>
      </div>

      {/* Small-image / Flat */}
      <div>
        <p className="text-label-small text-on-surface-variant px-4 py-1">Small-image · Flat</p>
        <AppBar
          variant="small"
          title={<BrandImage />}
          navigationIcon={<NavBackButton />}
          actions={<SearchAction />}
        />
      </div>

      {/* Small / Flat */}
      <div>
        <p className="text-label-small text-on-surface-variant px-4 py-1">Small · Flat</p>
        <AppBar
          variant="small"
          title="Label"
          navigationIcon={<NavBackButton />}
          actions={<SearchAction />}
        />
      </div>

      {/* Medium / Flat */}
      <div>
        <p className="text-label-small text-on-surface-variant px-4 py-1">Medium · Flat</p>
        <AppBar
          variant="medium"
          title="Label"
          navigationIcon={<NavBackButton />}
          actions={<SearchAction />}
        />
      </div>

      {/* Large / Flat */}
      <div>
        <p className="text-label-small text-on-surface-variant px-4 py-1">Large · Flat</p>
        <AppBar
          variant="large"
          title="Label"
          navigationIcon={<NavBackButton />}
          actions={<SearchAction />}
        />
      </div>

      {/* ── On-scroll configurations ── */}
      <p className="text-label-large text-on-surface-variant bg-surface-container-low px-4 py-3">
        Elevation: On-scroll (bg-surface-container + shadow-elevation-2)
      </p>

      {/* Small-centered / On-scroll */}
      <div>
        <p className="text-label-small text-on-surface-variant px-4 py-1">
          Small-centered · On-scroll
        </p>
        <AppBar
          variant="center-aligned"
          title="Label"
          navigationIcon={<NavMenuButton />}
          actions={<Avatar />}
          scrolled
        />
      </div>

      {/* Search / On-scroll */}
      <div>
        <p className="text-label-small text-on-surface-variant px-4 py-1">Search · On-scroll</p>
        <AppBarHeadless className="bg-surface-container shadow-elevation-2 flex w-full items-center gap-0 px-1 py-2">
          <NavMenuButton />
          <div className="flex flex-1 items-center px-2">
            <SearchBar scrolled={true} />
          </div>
          <Avatar />
        </AppBarHeadless>
      </div>

      {/* Small-image / On-scroll */}
      <div>
        <p className="text-label-small text-on-surface-variant px-4 py-1">
          Small-image · On-scroll
        </p>
        <AppBar
          variant="small"
          title={<BrandImage />}
          navigationIcon={<NavBackButton />}
          actions={<SearchAction />}
          scrolled
        />
      </div>

      {/* Small / On-scroll */}
      <div>
        <p className="text-label-small text-on-surface-variant px-4 py-1">Small · On-scroll</p>
        <AppBar
          variant="small"
          title="Label"
          navigationIcon={<NavBackButton />}
          actions={<SearchAction />}
          scrolled
        />
      </div>

      {/* Medium / On-scroll */}
      <div>
        <p className="text-label-small text-on-surface-variant px-4 py-1">Medium · On-scroll</p>
        <AppBar
          variant="medium"
          title="Label"
          navigationIcon={<NavBackButton />}
          actions={<SearchAction />}
          scrolled
        />
      </div>

      {/* Large / On-scroll */}
      <div>
        <p className="text-label-small text-on-surface-variant px-4 py-1">Large · On-scroll</p>
        <AppBar
          variant="large"
          title="Label"
          navigationIcon={<NavBackButton />}
          actions={<SearchAction />}
          scrolled
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All 12 Figma M3 Design Kit configurations: 6 variant types × 2 elevation states (Flat / On-scroll). On-scroll applies `bg-surface-container` background and `shadow-elevation-2` per MD3 spec.",
      },
    },
  },
};

// ─── With Subtitle ─────────────────────────────────────────────────────────────

export const WithSubtitle: Story = {
  render: () => (
    <div className="divide-outline-variant flex flex-col gap-0 divide-y">
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">
          small — subtitle: label-medium / on-surface-variant (64dp)
        </p>
        <AppBar
          variant="small"
          title="Page Title"
          subtitle="Subtitle text"
          navigationIcon={<NavMenuButton />}
          actions={<SearchAction />}
        />
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">
          center-aligned — subtitle centered, label-medium / on-surface-variant (64dp)
        </p>
        <AppBar
          variant="center-aligned"
          title="My App"
          subtitle="Subtitle text"
          navigationIcon={<NavMenuButton />}
          actions={<SearchAction />}
        />
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">
          medium — subtitle: label-large / on-surface-variant (grows to 136dp with subtitle)
        </p>
        <AppBar
          variant="medium"
          title="Article Title"
          subtitle="Author · 5 min read"
          navigationIcon={<NavBackButton />}
          actions={
            <>
              <ShareAction />
              <MoreAction />
            </>
          }
        />
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">
          large — subtitle: title-medium / on-surface-variant (grows to 152dp with subtitle)
        </p>
        <AppBar
          variant="large"
          title="Settings"
          subtitle="Account preferences"
          navigationIcon={<NavBackButton />}
          actions={<MoreAction />}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "M3 Expressive Flexible subtitle type scales: small/center-aligned use label-medium + on-surface-variant; medium uses label-large + on-surface-variant (bar grows to 136dp); large uses title-medium + on-surface-variant (bar grows to 152dp). All subtitle colors are on-surface-variant per the M3 Expressive flexible spec.",
      },
    },
  },
};

// ─── Small Variant ─────────────────────────────────────────────────────────────

export const Small: Story = {
  args: {
    variant: "small",
    title: "Page Title",
    navigationIcon: <NavMenuButton />,
    actions: <SearchAction />,
  },
};

// ─── Center-Aligned ────────────────────────────────────────────────────────────

export const CenterAligned: Story = {
  args: {
    variant: "center-aligned",
    title: "My App",
    navigationIcon: <NavMenuButton />,
    actions: <SearchAction />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Center-aligned variant. Same 64dp height as small, title horizontally centered. Common for brand-focused app bars.",
      },
    },
  },
};

// ─── Medium Variant ────────────────────────────────────────────────────────────

export const Medium: Story = {
  args: {
    variant: "medium",
    title: "Article Title",
    navigationIcon: <NavBackButton />,
    actions: (
      <>
        <ShareAction />
        <MoreAction />
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Medium M3 Expressive Flexible app bar: 112dp without subtitle, 136dp with subtitle. Title uses headline-medium (28px) in the expanded bottom area. Add a subtitle to see the bar grow to 136dp with label-large type.",
      },
    },
  },
};

// ─── Large Variant ─────────────────────────────────────────────────────────────

export const Large: Story = {
  args: {
    variant: "large",
    title: "Settings",
    navigationIcon: <NavBackButton />,
    actions: <MoreAction />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Large M3 Expressive Flexible app bar: 120dp without subtitle, 152dp with subtitle. Title uses display-small (36px) in the expanded bottom area. Add a subtitle to see the bar grow to 152dp with title-medium type.",
      },
    },
  },
};

// ─── Scroll Behavior ───────────────────────────────────────────────────────────

const ScrollBehaviorDemo = (): React.ReactElement => {
  const [scrolled, setScrolled] = React.useState(false);

  return (
    <div className="flex flex-col gap-4 p-4">
      <AppBar
        title="Scroll Demo"
        variant="small"
        navigationIcon={<NavMenuButton />}
        actions={<SearchAction />}
        scrolled={scrolled}
        onScrollStateChange={setScrolled}
      />
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setScrolled((s) => !s)}
          className="bg-primary text-on-primary text-label-large cursor-pointer rounded-full px-4 py-2"
        >
          Toggle scrolled: {scrolled ? "ON" : "OFF"}
        </button>
        <span className="text-body-medium text-on-surface-variant">
          Surface:{" "}
          {scrolled
            ? "Elevated (bg-surface-container + shadow-elevation-2)"
            : "Flat (bg-surface + shadow-elevation-0)"}
        </span>
      </div>
    </div>
  );
};

export const ScrollBehavior: Story = {
  render: () => <ScrollBehaviorDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "MD3 AppBar transitions from flat surface at rest to `bg-surface-container` + `shadow-elevation-2` when scrolled. Toggle the controlled `scrolled` state with the button below.",
      },
    },
  },
};

// ─── Navigation Icon Variants ──────────────────────────────────────────────────

export const WithNavigationIcon: Story = {
  render: () => (
    <div className="divide-outline-variant flex flex-col gap-0 divide-y">
      <AppBar variant="small" title="With Navigation Icon" navigationIcon={<NavMenuButton />} />
      <AppBar variant="small" title="Without Navigation Icon" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The navigation icon slot is optional. When omitted, the title expands to fill the leading area.",
      },
    },
  },
};

// ─── Action Slots ──────────────────────────────────────────────────────────────

export const WithActions: Story = {
  render: () => (
    <div className="divide-outline-variant flex flex-col gap-0 divide-y">
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">1 action icon</p>
        <AppBar
          variant="small"
          title="Page Title"
          navigationIcon={<NavMenuButton />}
          actions={<SearchAction />}
        />
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">2 action icons</p>
        <AppBar
          variant="small"
          title="Page Title"
          navigationIcon={<NavMenuButton />}
          actions={
            <>
              <SearchAction />
              <ShareAction />
            </>
          }
        />
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">
          3 action icons (maximum per MD3)
        </p>
        <AppBar
          variant="small"
          title="Page Title"
          navigationIcon={<NavMenuButton />}
          actions={
            <>
              <SearchAction />
              <ShareAction />
              <MoreAction />
            </>
          }
        />
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">No actions</p>
        <AppBar variant="small" title="Page Title" navigationIcon={<NavMenuButton />} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "MD3 supports up to 3 trailing action icons. Pass them as React nodes into the `actions` prop using `<IconButton>` components.",
      },
    },
  },
};

// ─── Scrolled State ────────────────────────────────────────────────────────────

export const ScrolledState: Story = {
  render: () => (
    <div className="divide-outline-variant flex flex-col gap-0 divide-y">
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">
          At rest — bg-surface, shadow-elevation-0 (no data-scrolled attribute)
        </p>
        <AppBar
          variant="small"
          title="Page Title"
          navigationIcon={<NavMenuButton />}
          scrolled={false}
        />
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">
          Scrolled — bg-surface-container, shadow-elevation-2 (data-scrolled="" present)
        </p>
        <AppBar
          variant="small"
          title="Page Title"
          navigationIcon={<NavMenuButton />}
          scrolled={true}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Flat vs elevated surface comparison. On scroll, `data-scrolled` is set on the root and `group-data-[scrolled]/appbar` selectors apply `bg-surface-container` + `shadow-elevation-2`. The transition uses the MD3 standard effects spring pair (background-color + box-shadow).",
      },
    },
  },
};

// ─── Search Configuration (composed via AppBarHeadless) ───────────────────────

export const SearchConfiguration: Story = {
  render: () => (
    <div className="divide-outline-variant flex flex-col gap-0 divide-y">
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">
          Search · Flat — bg-surface search bar (surface-container)
        </p>
        <AppBarHeadless className="bg-surface flex h-16 w-full items-center gap-0 px-1">
          <NavMenuButton />
          <div className="flex flex-1 items-center px-2">
            <SearchBar scrolled={false} />
          </div>
          <Avatar />
        </AppBarHeadless>
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">
          Search · On-scroll — bg-surface-container bar, surface-container-highest search bar
        </p>
        <AppBarHeadless className="bg-surface-container shadow-elevation-2 flex h-16 w-full items-center gap-0 px-1">
          <NavMenuButton />
          <div className="flex flex-1 items-center px-2">
            <SearchBar scrolled={true} />
          </div>
          <Avatar />
        </AppBarHeadless>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Search configuration composed via `AppBarHeadless`. The search bar container uses `surface-container` at rest and `surface-container-highest` when scrolled per MD3 accessibility spec. Navigation menu is the first interactive element (leading focus per MD3 spec).",
      },
    },
  },
};

// ─── Small-Image Configuration ─────────────────────────────────────────────────

export const SmallImageConfiguration: Story = {
  render: () => (
    <div className="divide-outline-variant flex flex-col gap-0 divide-y">
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">Small-image · Flat</p>
        <AppBar
          variant="small"
          title={<BrandImage />}
          navigationIcon={<NavBackButton />}
          actions={<SearchAction />}
        />
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">
          Small-image · On-scroll
        </p>
        <AppBar
          variant="small"
          title={<BrandImage />}
          navigationIcon={<NavBackButton />}
          actions={<SearchAction />}
          scrolled
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Small app bar with a brand image/logo in the title slot. The `title` prop accepts any `ReactNode` — pass an `<img>` or SVG logo element. On-scroll applies the standard surface-container background.",
      },
    },
  },
};

// ─── Medium and Large ──────────────────────────────────────────────────────────

export const MediumAndLarge: Story = {
  render: () => (
    <div className="divide-outline-variant flex flex-col gap-0 divide-y">
      <AppBar
        variant="medium"
        title="Medium Expanded Title"
        navigationIcon={<NavBackButton />}
        actions={<MoreAction />}
      />
      <AppBar
        variant="large"
        title="Large Hero Title"
        navigationIcon={<NavBackButton />}
        actions={<MoreAction />}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Medium (112dp no subtitle / 136dp with subtitle, headline-medium title) and Large (120dp no subtitle / 152dp with subtitle, display-small title) M3 Expressive Flexible variants. Both place the title in the bottom-left of the expanded area, with a fixed 64dp top row for navigation icon and actions.",
      },
    },
  },
};

// ─── Accessibility ─────────────────────────────────────────────────────────────

export const Accessibility: Story = {
  render: () => (
    <div className="flex flex-col gap-6 p-4">
      <div className="flex flex-col gap-2">
        <p className="text-body-medium text-on-surface-variant">
          The AppBar renders as{" "}
          <code className="bg-surface-container rounded px-1 font-mono text-sm">
            {'<header role="banner">'}
          </code>{" "}
          — a landmark region recognized by screen readers. Per MD3 accessibility spec:
        </p>
        <ul className="text-body-medium text-on-surface-variant list-inside list-disc space-y-1">
          <li>
            Focus lands on the leading navigation button first (first interactive element in DOM)
          </li>
          <li>Tab navigates through interactive elements: leading → actions</li>
          <li>Space or Enter activates the focused element</li>
          <li>
            All icon buttons require a descriptive{" "}
            <code className="bg-surface-container rounded px-1 font-mono text-sm">aria-label</code>
          </li>
        </ul>
      </div>
      <AppBar
        variant="small"
        title="Accessible App Bar"
        navigationIcon={<NavMenuButton />}
        actions={
          <>
            <IconButton aria-label="Search for content">
              <IconSearch />
            </IconButton>
            <IconButton aria-label="More options">
              <IconMoreVert />
            </IconButton>
          </>
        }
      />
      <div className="mt-2 flex flex-col gap-2">
        <p className="text-body-medium text-on-surface-variant">
          The title accessibility label should describe the current page context. Screen readers
          announce the title followed by the component role.
        </p>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Accessibility considerations per MD3 spec: `<header role='banner'>` landmark, keyboard navigation (Tab / Space / Enter), focus order starting from leading button, and descriptive `aria-label` on all icon buttons.",
      },
    },
  },
};

// ─── Interactive Playground ────────────────────────────────────────────────────

export const Interactive: Story = {
  args: {
    variant: "small",
    title: "Interactive App Bar",
    subtitle: "",
    scrolled: false,
    navigationIcon: <NavMenuButton />,
    actions: <SearchAction />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use the controls panel to explore all AppBar props. Toggle `scrolled` to see the elevation and background change, switch `variant` to see the different sizes, add a `subtitle` to see the stacked text.",
      },
    },
  },
};

// ─── Close Button variant ──────────────────────────────────────────────────────

export const WithCloseButton: Story = {
  render: () => (
    <div className="divide-outline-variant flex flex-col gap-0 divide-y">
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">
          Dialog / sheet context — close leading, title centered
        </p>
        <AppBar
          variant="center-aligned"
          title="Edit Profile"
          navigationIcon={<CloseAction />}
          actions={
            <button
              type="button"
              className="text-primary text-label-large hover:bg-primary/8 cursor-pointer rounded-full px-4 py-2 transition-colors"
            >
              Save
            </button>
          }
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Center-aligned AppBar used in dialog/sheet context with a close icon (leading) and a text action (trailing). Actions are not limited to icon buttons — any focusable element is valid.",
      },
    },
  },
};
