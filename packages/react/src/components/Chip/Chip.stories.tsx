"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import type React from "react";
import { Chip } from "./Chip";
import { ChipSet } from "./ChipSet";

// ---------------------------------------------------------------------------
// Inline SVG icons (18 × 18 dp)
// ---------------------------------------------------------------------------

const IconStar = (): React.ReactElement => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const IconCalendar = (): React.ReactElement => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
  </svg>
);

const IconTag = (): React.ReactElement => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
  </svg>
);

const noop = (): void => undefined;

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof Chip> = {
  title: "Components/Chip",
  component: Chip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
**Material Design 3 Chip** — a compact, interactive element used for actions, filters, inputs, and suggestions.

MD3 defines four distinct chip types, each with its own interaction model:

| Type | Purpose | ARIA role |
|---|---|---|
| \`assist\` | Triggers a related action (e.g. "Set alarm") | \`button\` |
| \`filter\` | Toggles a filter on/off — supports multi-select | \`button\` + \`aria-pressed\` |
| \`input\` | Represents a user-entered value; removable | two buttons (body + remove) |
| \`suggestion\` | Offers a contextual suggestion | \`button\` |

**Surfaces** — Assist and Suggestion chips support \`tonal\` (default) and \`elevated\`.

**Keyboard:** Tab to focus · Enter/Space to press/toggle · Backspace on input chip removes it.

[MD3 Chips spec →](https://m3.material.io/components/chips/overview)
        `.trim(),
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["assist", "filter", "input", "suggestion"],
      description: "MD3 chip type — determines interaction model and ARIA semantics",
    },
    surface: {
      control: "select",
      options: ["tonal", "elevated"],
      description: "Surface style (Assist and Suggestion chips only)",
    },
    selected: {
      control: "boolean",
      description: "Controlled selected state (Filter chips only)",
    },
    isDisabled: {
      control: "boolean",
      description: "Disable all interaction on the chip",
    },
    label: {
      control: "text",
      description: "Visible label text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Chip>;

// ---------------------------------------------------------------------------
// Default — all controls wired
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    type: "assist",
    label: "Set alarm",
    surface: "tonal",
    isDisabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Default story with all Storybook controls wired. Change `type` to explore every chip variant. **Keyboard:** Tab to focus, Enter or Space to activate.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Assist Chip — tonal surface
// ---------------------------------------------------------------------------

export const AssistChip: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Chip type="assist" label="Set alarm" />
      <Chip type="assist" label="With icon" leadingIcon={<IconCalendar />} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Assist chips trigger contextual actions related to the current content. The tonal surface uses `secondary-container` fill. **Keyboard:** Tab · Enter/Space to activate.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Assist Chip Elevated
// ---------------------------------------------------------------------------

export const AssistChipElevated: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Chip type="assist" surface="elevated" label="Set alarm" />
      <Chip
        type="assist"
        surface="elevated"
        label="Add to calendar"
        leadingIcon={<IconCalendar />}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Elevated assist chips use `surface-container-low` with `shadow-elevation-1` to lift the chip off the surface. Prefer the tonal variant on white/light backgrounds.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Filter Chip — uncontrolled (aria-pressed visible in a11y panel)
// ---------------------------------------------------------------------------

export const FilterChip: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Chip type="filter" label="Vegetarian" defaultSelected />
      <Chip type="filter" label="Vegan" />
      <Chip type="filter" label="Gluten-free" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Uncontrolled filter chips manage their own selection state. Open the **Accessibility** panel to confirm `aria-pressed` toggles on click. **Keyboard:** Tab · Enter/Space to toggle.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Filter Chip Controlled
// ---------------------------------------------------------------------------

const FilterChipControlledDemo = (): React.ReactElement => {
  const [selected, setSelected] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <Chip
        type="filter"
        label={selected ? "Vegetarian ✓" : "Vegetarian"}
        selected={selected}
        onSelectionChange={setSelected}
      />
      <p className="text-on-surface-variant text-sm">
        External state: <strong>{selected ? "selected" : "unselected"}</strong>
      </p>
    </div>
  );
};

export const FilterChipControlled: Story = {
  render: () => <FilterChipControlledDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Controlled filter chip — the parent manages selection via `selected` + `onSelectionChange`. The label updates to reflect state, demonstrating that the component re-renders correctly.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Filter Chip With Checkmark animation
// ---------------------------------------------------------------------------

const FilterChipWithCheckmarkDemo = (): React.ReactElement => {
  const [selected, setSelected] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <Chip type="filter" label="Dark mode" selected={selected} onSelectionChange={setSelected} />
      <p className="text-on-surface-variant text-xs">
        Click the chip to see the checkmark slide-in animation.
      </p>
    </div>
  );
};

export const FilterChipWithCheckmark: Story = {
  render: () => <FilterChipWithCheckmarkDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the MD3 checkmark slide-in animation on filter chip selection. The checkmark uses `transition-[width,opacity]` with the `ease-emphasized-decelerate` easing token.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Input Chip — remove button
// ---------------------------------------------------------------------------

const InputChipDemo = (): React.ReactElement => {
  const [chips, setChips] = useState(["React", "TypeScript", "Tailwind"]);
  const remove = (label: string): void => {
    setChips((prev) => prev.filter((c) => c !== label));
  };
  return (
    <div className="flex flex-col gap-3">
      <ChipSet>
        {chips.map((label) => (
          <Chip key={label} type="input" label={label} onRemove={() => remove(label)} />
        ))}
      </ChipSet>
      {chips.length === 0 && <p className="text-on-surface-variant text-sm">All chips removed.</p>}
    </div>
  );
};

export const InputChip: Story = {
  render: () => <InputChipDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Input chips represent user-entered values (e.g. tags). Click the × button to remove a chip with a fade-out animation. **Keyboard:** Tab to the × button · Enter/Space to remove.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Input Chip Keyboard Removal
// ---------------------------------------------------------------------------

const InputChipKeyboardRemovalDemo = (): React.ReactElement => {
  const [chips, setChips] = useState(["React", "TypeScript"]);
  const remove = (label: string): void => {
    setChips((prev) => prev.filter((c) => c !== label));
  };
  return (
    <div className="flex flex-col gap-3">
      <ChipSet>
        {chips.map((label) => (
          <Chip key={label} type="input" label={label} onRemove={() => remove(label)} />
        ))}
      </ChipSet>
      <p className="text-on-surface-variant text-xs">
        Tab to focus a chip's × button, then press{" "}
        <kbd className="bg-surface-container rounded px-1 py-0.5 font-mono text-xs">Enter</kbd> or{" "}
        <kbd className="bg-surface-container rounded px-1 py-0.5 font-mono text-xs">Space</kbd> to
        remove it.
      </p>
    </div>
  );
};

export const InputChipKeyboardRemoval: Story = {
  render: () => <InputChipKeyboardRemovalDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates keyboard removal of input chips. Tab to reach the × remove button on each chip, then press Enter or Space. The chip fades out with an `animate-md-fade-out` animation before being unmounted.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Suggestion Chip — tonal
// ---------------------------------------------------------------------------

export const SuggestionChip: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Chip type="suggestion" label="See photos" />
      <Chip type="suggestion" label="Get directions" />
      <Chip type="suggestion" label="Call now" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Suggestion chips offer smart replies or contextual actions. They behave identically to assist chips but are semantically distinct per MD3. **Keyboard:** Tab · Enter/Space to activate.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Suggestion Chip Elevated
// ---------------------------------------------------------------------------

export const SuggestionChipElevated: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Chip type="suggestion" surface="elevated" label="See photos" />
      <Chip type="suggestion" surface="elevated" label="Get directions" />
      <Chip type="suggestion" surface="elevated" label="Call now" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Elevated suggestion chips lift off the surface using `shadow-elevation-1`. Useful when placed on colored or patterned backgrounds where the tonal fill would blend in.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// All Types — side by side in a ChipSet
// ---------------------------------------------------------------------------

export const AllTypes: Story = {
  render: () => (
    <ChipSet>
      <Chip type="assist" label="Assist" />
      <Chip type="filter" label="Filter" />
      <Chip type="input" label="Input" onRemove={noop} />
      <Chip type="suggestion" label="Suggestion" />
    </ChipSet>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All four MD3 chip types displayed side by side. Notice the different visual treatments: tonal fills for assist/suggestion, fixed tonal for filter/input, and the remove button on the input chip.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// With Leading Icon
// ---------------------------------------------------------------------------

export const WithLeadingIcon: Story = {
  render: () => (
    <ChipSet>
      <Chip type="assist" label="Add to calendar" leadingIcon={<IconCalendar />} />
      <Chip type="filter" label="Starred" leadingIcon={<IconStar />} />
      <Chip type="input" label="javascript" leadingIcon={<IconTag />} onRemove={noop} />
      <Chip type="suggestion" label="See photos" leadingIcon={<IconStar />} />
    </ChipSet>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Chips with 18×18dp inline SVG leading icons. Icons are wrapped in a `size-4.5` span and marked `aria-hidden` — the chip label provides the accessible name. All icon colors inherit `currentColor`.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Disabled State
// ---------------------------------------------------------------------------

export const DisabledState: Story = {
  render: () => (
    <ChipSet>
      <Chip type="assist" label="Assist" isDisabled />
      <Chip type="filter" label="Filter" isDisabled />
      <Chip type="input" label="Input" isDisabled onRemove={noop} />
      <Chip type="suggestion" label="Suggestion" isDisabled />
    </ChipSet>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "All four chip types in the disabled state. Disabled chips receive `opacity-38` and `pointer-events-none`. React Aria ensures `aria-disabled` is set and keyboard interaction is blocked.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// ChipSet Layout — flex-wrap with constrained container
// ---------------------------------------------------------------------------

export const ChipSetLayout: Story = {
  render: () => (
    <div className="max-w-xs">
      <ChipSet>
        <Chip type="filter" label="Electronics" />
        <Chip type="filter" label="Clothing" />
        <Chip type="filter" label="Books" />
        <Chip type="filter" label="Sports" />
        <Chip type="filter" label="Home & Garden" />
        <Chip type="filter" label="Toys" />
        <Chip type="filter" label="Automotive" />
        <Chip type="filter" label="Beauty" />
      </ChipSet>
    </div>
  ),
  parameters: {
    layout: "centered",
    docs: {
      description: {
        story:
          "A `ChipSet` inside a `max-w-xs` container demonstrating `flex-wrap` behavior. Chips flow into multiple rows as needed. The 8dp gap (`gap-2`) is applied consistently between all chips.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Filter Group — realistic multi-select filter UI
// ---------------------------------------------------------------------------

const CATEGORIES = ["Electronics", "Clothing", "Books", "Sports", "Home"] as const;
type Category = (typeof CATEGORIES)[number];

const FilterGroupDemo = (): React.ReactElement => {
  const [active, setActive] = useState<Set<Category>>(new Set());

  const toggle = (cat: Category): void => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-on-surface-variant text-sm font-medium">Filter by category</p>
      <ChipSet>
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            type="filter"
            label={cat}
            selected={active.has(cat)}
            onSelectionChange={() => toggle(cat)}
          />
        ))}
      </ChipSet>
      <p className="text-on-surface-variant text-xs">
        {active.size === 0
          ? "No filters active — showing all results"
          : `Active filters: ${[...active].join(", ")}`}
      </p>
    </div>
  );
};

export const FilterGroup: Story = {
  render: () => <FilterGroupDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Realistic multi-select filter UI with five category filter chips. Selection state is managed externally with `useState` and a `Set`. Multiple chips can be active simultaneously. **Keyboard:** Tab between chips · Enter/Space to toggle each.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Input Chip List — realistic tag input UI
// ---------------------------------------------------------------------------

const INITIAL_TAGS = ["React", "TypeScript", "Tailwind CSS", "Storybook", "Vitest"];

const InputChipListDemo = (): React.ReactElement => {
  const [tags, setTags] = useState<string[]>(INITIAL_TAGS);

  const remove = (tag: string): void => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-on-surface-variant text-sm font-medium">Tags</p>
      {tags.length > 0 ? (
        <ChipSet>
          {tags.map((tag) => (
            <Chip key={tag} type="input" label={tag} onRemove={() => remove(tag)} />
          ))}
        </ChipSet>
      ) : (
        <p className="text-on-surface-variant text-sm italic">No tags. Refresh to reset.</p>
      )}
      <p className="text-on-surface-variant text-xs">
        {tags.length} tag{tags.length !== 1 ? "s" : ""} · click × to remove
      </p>
    </div>
  );
};

export const InputChipList: Story = {
  render: () => <InputChipListDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Realistic tag-input UI starting with five input chips. Clicking the × on any chip removes it individually with a fade-out animation. Each chip's remove button is independently keyboard-focusable. **Keyboard:** Tab to × · Enter/Space to remove.",
      },
    },
  },
};

// ---------------------------------------------------------------------------
// Playground — full argTypes wired to Storybook controls
// ---------------------------------------------------------------------------

export const Playground: Story = {
  args: {
    type: "assist",
    label: "Chip label",
    surface: "tonal",
    selected: false,
    isDisabled: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Full interactive playground. Use the Controls panel to explore every combination of `type`, `surface`, `selected`, `isDisabled`, and `label`. Note: `selected` only affects filter chips; `surface` only affects assist and suggestion chips.",
      },
    },
  },
};
