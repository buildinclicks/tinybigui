import type { Meta, StoryObj } from "@storybook/react";
import { AppBar } from "./AppBar";
import React from "react";

// ─── Icon primitives for stories ─────────────────────────────────────────────

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

// ─── Button wrappers (styled as plain accessible buttons for story context) ───

const NavButton = ({ label }: { label: string }): React.ReactElement => (
  <button
    type="button"
    aria-label={label}
    className="text-on-surface-variant hover:bg-on-surface/8 focus-visible:outline-primary relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
  >
    <IconMenu />
  </button>
);

const BackButton = (): React.ReactElement => (
  <button
    type="button"
    aria-label="Go back"
    className="text-on-surface-variant hover:bg-on-surface/8 focus-visible:outline-primary relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
  >
    <IconArrowBack />
  </button>
);

const ActionButton = ({
  label,
  Icon,
}: {
  label: string;
  Icon: () => React.ReactElement;
}): React.ReactElement => (
  <button
    type="button"
    aria-label={label}
    className="text-on-surface-variant hover:bg-on-surface/8 focus-visible:outline-primary relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
  >
    <Icon />
  </button>
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
          "Material Design 3 Top App Bar. Provides context and actions for the current screen. Supports four size variants (small, center-aligned, medium, large) with composable navigation icon and action icon slots.",
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
        "Controlled scroll state. When true, applies elevated surface (shadow-elevation-2)",
    },
    title: {
      control: "text",
      description: "Title content. Accepts string or ReactNode.",
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
    navigationIcon: <NavButton label="Open navigation menu" />,
    actions: <ActionButton label="Search" Icon={IconSearch} />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The default small AppBar with navigation icon, title, and one action icon. 64dp height with title-large type scale.",
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
          small (default) — 64dp, title-large
        </p>
        <AppBar
          variant="small"
          title="Small App Bar"
          navigationIcon={<NavButton label="Open navigation menu" />}
          actions={<ActionButton label="Search" Icon={IconSearch} />}
        />
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">
          center-aligned — 64dp, title-large, centered
        </p>
        <AppBar
          variant="center-aligned"
          title="Center Aligned"
          navigationIcon={<NavButton label="Open navigation menu" />}
          actions={<ActionButton label="Search" Icon={IconSearch} />}
        />
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">
          medium — 112dp, headline-small
        </p>
        <AppBar
          variant="medium"
          title="Medium App Bar"
          navigationIcon={<BackButton />}
          actions={<ActionButton label="More options" Icon={IconMoreVert} />}
        />
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">
          large — 152dp, display-small
        </p>
        <AppBar
          variant="large"
          title="Large App Bar"
          navigationIcon={<BackButton />}
          actions={<ActionButton label="More options" Icon={IconMoreVert} />}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All four MD3 Top App Bar size variants. Each variant uses a different bar height and title type scale per MD3 specifications.",
      },
    },
  },
};

// ─── Small Variant ─────────────────────────────────────────────────────────────

export const Small: Story = {
  args: {
    variant: "small",
    title: "Page Title",
    navigationIcon: <NavButton label="Open navigation menu" />,
    actions: <ActionButton label="Search" Icon={IconSearch} />,
  },
};

// ─── Center-Aligned ────────────────────────────────────────────────────────────

export const CenterAligned: Story = {
  args: {
    variant: "center-aligned",
    title: "My App",
    navigationIcon: <NavButton label="Open navigation menu" />,
    actions: <ActionButton label="Search" Icon={IconSearch} />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Center-aligned variant. Same 64dp height as small, but the title is horizontally centered. Common for brand-focused app bars.",
      },
    },
  },
};

// ─── Medium Variant ────────────────────────────────────────────────────────────

export const Medium: Story = {
  args: {
    variant: "medium",
    title: "Article Title",
    navigationIcon: <BackButton />,
    actions: (
      <>
        <ActionButton label="Share" Icon={IconShare} />
        <ActionButton label="More options" Icon={IconMoreVert} />
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Medium variant with 112dp height. The title sits in the bottom-left of the expanded area using headline-small type scale. Ideal for content screens.",
      },
    },
  },
};

// ─── Large Variant ─────────────────────────────────────────────────────────────

export const Large: Story = {
  args: {
    variant: "large",
    title: "Settings",
    navigationIcon: <BackButton />,
    actions: <ActionButton label="More options" Icon={IconMoreVert} />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Large variant with 152dp height. The title sits at the bottom using display-small type scale. Use for top-level screens that need strong visual hierarchy.",
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
        navigationIcon={<NavButton label="Open navigation menu" />}
        actions={<ActionButton label="Search" Icon={IconSearch} />}
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
          Surface: {scrolled ? "Elevated (shadow-elevation-2)" : "Flat (shadow-elevation-0)"}
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
          "MD3 AppBar transitions from a flat surface at rest to `shadow-elevation-2` when the page is scrolled. Toggle the controlled `scrolled` state with the button below.",
      },
    },
  },
};

// ─── Navigation Icon Variants ──────────────────────────────────────────────────

export const WithNavigationIcon: Story = {
  render: () => (
    <div className="divide-outline-variant flex flex-col gap-0 divide-y">
      <AppBar
        variant="small"
        title="With Navigation Icon"
        navigationIcon={<NavButton label="Open navigation menu" />}
      />
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
          navigationIcon={<NavButton label="Open navigation menu" />}
          actions={<ActionButton label="Search" Icon={IconSearch} />}
        />
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">2 action icons</p>
        <AppBar
          variant="small"
          title="Page Title"
          navigationIcon={<NavButton label="Open navigation menu" />}
          actions={
            <>
              <ActionButton label="Search" Icon={IconSearch} />
              <ActionButton label="Share" Icon={IconShare} />
            </>
          }
        />
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">
          3 action icons (maximum)
        </p>
        <AppBar
          variant="small"
          title="Page Title"
          navigationIcon={<NavButton label="Open navigation menu" />}
          actions={
            <>
              <ActionButton label="Search" Icon={IconSearch} />
              <ActionButton label="Share" Icon={IconShare} />
              <ActionButton label="More options" Icon={IconMoreVert} />
            </>
          }
        />
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">No actions</p>
        <AppBar
          variant="small"
          title="Page Title"
          navigationIcon={<NavButton label="Open navigation menu" />}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "MD3 supports up to 3 trailing action icons. Pass them as React nodes into the `actions` prop. Each should be an accessible button with `aria-label`.",
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
          At rest (shadow-elevation-0)
        </p>
        <AppBar
          variant="small"
          title="Page Title"
          navigationIcon={<NavButton label="Open navigation menu" />}
          scrolled={false}
        />
      </div>
      <div>
        <p className="text-label-medium text-on-surface-variant px-4 py-2">
          Scrolled (shadow-elevation-2)
        </p>
        <AppBar
          variant="small"
          title="Page Title"
          navigationIcon={<NavButton label="Open navigation menu" />}
          scrolled={true}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Flat vs elevated surface comparison. The elevation transition uses MD3 motion tokens (duration-medium2, ease-standard).",
      },
    },
  },
};

// ─── Accessibility ─────────────────────────────────────────────────────────────

export const Accessibility: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-body-medium text-on-surface-variant">
        The AppBar renders as{" "}
        <code className="bg-surface-container rounded px-1 font-mono text-sm">
          {'<header role="banner">'}
        </code>{" "}
        — a landmark region recognized by screen readers. Navigation and action icons should always
        have descriptive{" "}
        <code className="bg-surface-container rounded px-1 font-mono text-sm">aria-label</code>{" "}
        attributes.
      </p>
      <AppBar
        variant="small"
        title="Accessible App Bar"
        navigationIcon={<NavButton label="Open navigation menu" />}
        actions={
          <>
            <ActionButton label="Search for content" Icon={IconSearch} />
            <ActionButton label="More options" Icon={IconMoreVert} />
          </>
        }
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Accessibility considerations: the `<header>` element provides the `banner` landmark role. Every icon button needs an `aria-label` describing its action. Focus indicators are always visible.",
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
        navigationIcon={<BackButton />}
        actions={<ActionButton label="More options" Icon={IconMoreVert} />}
      />
      <AppBar
        variant="large"
        title="Large Hero Title"
        navigationIcon={<BackButton />}
        actions={<ActionButton label="More options" Icon={IconMoreVert} />}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Medium (112dp, headline-small) and Large (152dp, display-small) variants. Both place the title in the bottom-left of the expanded area, and use a fixed 64dp top row for the navigation icon and actions.",
      },
    },
  },
};

// ─── Interactive Playground ────────────────────────────────────────────────────

export const Interactive: Story = {
  args: {
    variant: "small",
    title: "Interactive App Bar",
    scrolled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use the controls panel to explore all AppBar props. Toggle `scrolled` to see the elevation change, switch `variant` to see the different sizes.",
      },
    },
  },
};
