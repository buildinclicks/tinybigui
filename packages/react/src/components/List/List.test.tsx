import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ListHeadless, ListItemHeadless } from "./ListHeadless";
import { List } from "./List";
import { ListItem } from "./ListItem";

// ---------------------------------------------------------------------------
// Static List (selectionMode="none", no onAction)
// ---------------------------------------------------------------------------

describe("ListHeadless — static mode", () => {
  test("1. renders <ul role='list'> when selectionMode='none' and no onAction", () => {
    render(
      <ListHeadless aria-label="Settings">
        <ListItemHeadless value="wifi" headline="Wi-Fi" />
        <ListItemHeadless value="bt" headline="Bluetooth" />
      </ListHeadless>
    );
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("UL");
  });

  test("2. renders <li role='listitem'> for each ListItem", () => {
    render(
      <ListHeadless aria-label="Settings">
        <ListItemHeadless value="wifi" headline="Wi-Fi" />
        <ListItemHeadless value="bt" headline="Bluetooth" />
      </ListHeadless>
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    items.forEach((item) => expect(item.tagName).toBe("LI"));
  });

  test("3. items are NOT focusable in static mode (no tabIndex)", () => {
    render(
      <ListHeadless aria-label="Settings">
        <ListItemHeadless value="wifi" headline="Wi-Fi" />
      </ListHeadless>
    );
    const item = screen.getByRole("listitem");
    expect(item).not.toHaveAttribute("tabindex");
  });

  test("4. does NOT render aria-selected in static mode", () => {
    render(
      <ListHeadless aria-label="Settings">
        <ListItemHeadless value="wifi" headline="Wi-Fi" />
      </ListHeadless>
    );
    const item = screen.getByRole("listitem");
    expect(item).not.toHaveAttribute("aria-selected");
  });
});

// ---------------------------------------------------------------------------
// Interactive List (selectionMode="single")
// ---------------------------------------------------------------------------

describe("ListHeadless — interactive (single select)", () => {
  test("5. renders with role='listbox'", () => {
    render(
      <ListHeadless aria-label="Alignment" selectionMode="single">
        <ListItemHeadless value="left" headline="Left" />
        <ListItemHeadless value="center" headline="Center" />
      </ListHeadless>
    );
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  test("6. each item has role='option'", () => {
    render(
      <ListHeadless aria-label="Alignment" selectionMode="single">
        <ListItemHeadless value="left" headline="Left" />
        <ListItemHeadless value="center" headline="Center" />
      </ListHeadless>
    );
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(2);
  });

  test("7. calls onSelectionChange when item clicked", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <ListHeadless
        aria-label="Alignment"
        selectionMode="single"
        onSelectionChange={onSelectionChange}
      >
        <ListItemHeadless value="left" headline="Left" />
        <ListItemHeadless value="center" headline="Center" />
      </ListHeadless>
    );
    await user.click(screen.getByRole("option", { name: "Left" }));
    expect(onSelectionChange).toHaveBeenCalled();
  });

  test("8. Arrow Down moves focus to next item", async () => {
    const user = userEvent.setup();
    render(
      <ListHeadless aria-label="Alignment" selectionMode="single">
        <ListItemHeadless value="left" headline="Left" />
        <ListItemHeadless value="center" headline="Center" />
        <ListItemHeadless value="right" headline="Right" />
      </ListHeadless>
    );
    const options = screen.getAllByRole("option");
    await user.tab();
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(options[1]);
  });

  test("9. Arrow Up moves focus to previous item", async () => {
    const user = userEvent.setup();
    render(
      <ListHeadless aria-label="Alignment" selectionMode="single">
        <ListItemHeadless value="left" headline="Left" />
        <ListItemHeadless value="center" headline="Center" />
        <ListItemHeadless value="right" headline="Right" />
      </ListHeadless>
    );
    const options = screen.getAllByRole("option");
    await user.tab();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(options[2]);
    await user.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(options[1]);
  });

  test("10. Home moves focus to first item", async () => {
    const user = userEvent.setup();
    render(
      <ListHeadless aria-label="Alignment" selectionMode="single">
        <ListItemHeadless value="left" headline="Left" />
        <ListItemHeadless value="center" headline="Center" />
        <ListItemHeadless value="right" headline="Right" />
      </ListHeadless>
    );
    const options = screen.getAllByRole("option");
    await user.tab();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(options[0]);
  });

  test("11. End moves focus to last item", async () => {
    const user = userEvent.setup();
    render(
      <ListHeadless aria-label="Alignment" selectionMode="single">
        <ListItemHeadless value="left" headline="Left" />
        <ListItemHeadless value="center" headline="Center" />
        <ListItemHeadless value="right" headline="Right" />
      </ListHeadless>
    );
    const options = screen.getAllByRole("option");
    await user.tab();
    await user.keyboard("{End}");
    expect(document.activeElement).toBe(options[2]);
  });

  test("12. Enter selects focused item", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <ListHeadless
        aria-label="Alignment"
        selectionMode="single"
        onSelectionChange={onSelectionChange}
      >
        <ListItemHeadless value="left" headline="Left" />
        <ListItemHeadless value="center" headline="Center" />
      </ListHeadless>
    );
    await user.tab();
    await user.keyboard("{Enter}");
    expect(onSelectionChange).toHaveBeenCalled();
  });

  test("13. Space selects focused item", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <ListHeadless
        aria-label="Alignment"
        selectionMode="single"
        onSelectionChange={onSelectionChange}
      >
        <ListItemHeadless value="left" headline="Left" />
        <ListItemHeadless value="center" headline="Center" />
      </ListHeadless>
    );
    await user.tab();
    await user.keyboard(" ");
    expect(onSelectionChange).toHaveBeenCalled();
  });

  test("14. selected item has aria-selected='true'", async () => {
    const user = userEvent.setup();
    render(
      <ListHeadless aria-label="Alignment" selectionMode="single">
        <ListItemHeadless value="left" headline="Left" />
        <ListItemHeadless value="center" headline="Center" />
      </ListHeadless>
    );
    await user.click(screen.getByRole("option", { name: "Left" }));
    expect(screen.getByRole("option", { name: "Left" })).toHaveAttribute("aria-selected", "true");
  });

  test("15. onAction called when item activated", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <ListHeadless aria-label="Settings" selectionMode="none" onAction={onAction}>
        <ListItemHeadless value="wifi" headline="Wi-Fi" />
        <ListItemHeadless value="bt" headline="Bluetooth" />
      </ListHeadless>
    );
    await user.click(screen.getByRole("option", { name: "Wi-Fi" }));
    expect(onAction).toHaveBeenCalledWith("wifi");
  });
});

// ---------------------------------------------------------------------------
// Multiple selection
// ---------------------------------------------------------------------------

describe("ListHeadless — multiple selection", () => {
  test("16. multiple items can have aria-selected='true' simultaneously", async () => {
    const user = userEvent.setup();
    render(
      <ListHeadless aria-label="Tags" selectionMode="multiple">
        <ListItemHeadless value="react" headline="React" />
        <ListItemHeadless value="vue" headline="Vue" />
        <ListItemHeadless value="angular" headline="Angular" />
      </ListHeadless>
    );
    await user.click(screen.getByRole("option", { name: "React" }));
    await user.click(screen.getByRole("option", { name: "Vue" }));
    expect(screen.getByRole("option", { name: "React" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("option", { name: "Vue" })).toHaveAttribute("aria-selected", "true");
  });
});

// ---------------------------------------------------------------------------
// Disabled items
// ---------------------------------------------------------------------------

describe("ListHeadless — disabled items", () => {
  test("17. disabled item has aria-disabled='true'", () => {
    render(
      <ListHeadless aria-label="Settings" selectionMode="single">
        <ListItemHeadless value="wifi" headline="Wi-Fi" isDisabled />
      </ListHeadless>
    );
    expect(screen.getByRole("option", { name: "Wi-Fi" })).toHaveAttribute("aria-disabled", "true");
  });

  test("18. disabled item is NOT selectable via click", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <ListHeadless
        aria-label="Settings"
        selectionMode="single"
        onSelectionChange={onSelectionChange}
      >
        <ListItemHeadless value="wifi" headline="Wi-Fi" isDisabled />
        <ListItemHeadless value="bt" headline="Bluetooth" />
      </ListHeadless>
    );
    await user.click(screen.getByRole("option", { name: "Wi-Fi" }));
    expect(onSelectionChange).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Accessibility
// ---------------------------------------------------------------------------

describe("ListHeadless — accessibility", () => {
  test("19. list has aria-label when provided", () => {
    render(
      <ListHeadless aria-label="Navigation">
        <ListItemHeadless value="home" headline="Home" />
      </ListHeadless>
    );
    expect(screen.getByRole("list")).toHaveAttribute("aria-label", "Navigation");
  });

  test("20. list has aria-labelledby when provided", () => {
    render(
      <>
        <h2 id="list-heading">Settings</h2>
        <ListHeadless aria-labelledby="list-heading">
          <ListItemHeadless value="wifi" headline="Wi-Fi" />
        </ListHeadless>
      </>
    );
    expect(screen.getByRole("list")).toHaveAttribute("aria-labelledby", "list-heading");
  });

  test("21. forwardRef: ref attached to <ul> element", () => {
    const ref = { current: null as HTMLUListElement | null };
    render(
      <ListHeadless ref={ref} aria-label="Settings">
        <ListItemHeadless value="wifi" headline="Wi-Fi" />
      </ListHeadless>
    );
    expect(ref.current).toBeInstanceOf(HTMLUListElement);
  });

  test("22. axe check — static list, no violations", async () => {
    const { container } = render(
      <ListHeadless aria-label="Settings">
        <ListItemHeadless value="wifi" headline="Wi-Fi" />
        <ListItemHeadless value="bt" headline="Bluetooth" />
      </ListHeadless>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("23. axe check — interactive single-select list, no violations", async () => {
    const { container } = render(
      <ListHeadless aria-label="Alignment" selectionMode="single">
        <ListItemHeadless value="left" headline="Left" />
        <ListItemHeadless value="center" headline="Center" />
      </ListHeadless>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("24. axe check — interactive multi-select list, no violations", async () => {
    const { container } = render(
      <ListHeadless aria-label="Tags" selectionMode="multiple">
        <ListItemHeadless value="react" headline="React" />
        <ListItemHeadless value="vue" headline="Vue" />
      </ListHeadless>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("25. axe check — list with disabled item, no violations", async () => {
    const { container } = render(
      <ListHeadless aria-label="Settings" selectionMode="single">
        <ListItemHeadless value="wifi" headline="Wi-Fi" isDisabled />
        <ListItemHeadless value="bt" headline="Bluetooth" />
      </ListHeadless>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ===========================================================================
// Styled Layer Tests (26–45)
// ===========================================================================

// ---------------------------------------------------------------------------
// Item height / density
// ---------------------------------------------------------------------------

describe("List — styled density classes", () => {
  test("26. One-line item applies min-h-14", () => {
    render(
      <List aria-label="Test">
        <ListItem value="1" headline="Item 1" />
      </List>
    );
    const item = screen.getByRole("listitem");
    expect(item).toHaveClass("min-h-14");
  });

  test("27. Two-line item (with supportingText) applies min-h-18", () => {
    render(
      <List aria-label="Test">
        <ListItem value="1" headline="Item 1" supportingText="Supporting" />
      </List>
    );
    const item = screen.getByRole("listitem");
    expect(item).toHaveClass("min-h-18");
  });

  test("28. Three-line item (with overline) applies min-h-22", () => {
    render(
      <List aria-label="Test">
        <ListItem value="1" headline="Item 1" overline="Overline" supportingText="Details" />
      </List>
    );
    const item = screen.getByRole("listitem");
    expect(item).toHaveClass("min-h-22");
  });
});

// ---------------------------------------------------------------------------
// Token classes — Variants-vs-States architecture
// ---------------------------------------------------------------------------

describe("List — styled token classes", () => {
  test("29. List container has bg-surface", () => {
    render(
      <List aria-label="Test">
        <ListItem value="1" headline="Item 1" />
      </List>
    );
    const list = screen.getByRole("list");
    expect(list).toHaveClass("bg-surface");
  });

  test("30. Selected item carries data-selected attribute", async () => {
    const user = userEvent.setup();
    render(
      <List aria-label="Test" selectionMode="single">
        <ListItem value="1" headline="Item 1" />
        <ListItem value="2" headline="Item 2" />
      </List>
    );
    await user.click(screen.getByRole("option", { name: "Item 1" }));
    expect(screen.getByRole("option", { name: "Item 1" })).toHaveAttribute("data-selected", "");
  });

  test("31. Unselected item does not carry data-selected attribute", () => {
    render(
      <List aria-label="Test" selectionMode="single">
        <ListItem value="1" headline="Item 1" />
      </List>
    );
    const item = screen.getByRole("option", { name: "Item 1" });
    expect(item).not.toHaveAttribute("data-selected");
  });

  test("32. Disabled item carries data-disabled attribute", () => {
    render(
      <List aria-label="Test" selectionMode="single">
        <ListItem value="1" headline="Item 1" isDisabled />
      </List>
    );
    const item = screen.getByRole("option", { name: "Item 1" });
    expect(item).toHaveAttribute("data-disabled", "");
  });
});

// ---------------------------------------------------------------------------
// Variants-vs-States architecture — group/list-item + data-* attributes
// ---------------------------------------------------------------------------

describe("List — Variants-vs-States architecture", () => {
  test("33. Interactive item root has group/list-item class", () => {
    render(
      <List aria-label="Test" selectionMode="single">
        <ListItem value="1" headline="Item 1" />
      </List>
    );
    const item = screen.getByRole("option", { name: "Item 1" });
    expect(item.className).toContain("group/list-item");
  });

  test("34. Interactive item root has data-interactive attribute", () => {
    render(
      <List aria-label="Test" selectionMode="single">
        <ListItem value="1" headline="Item 1" />
      </List>
    );
    const item = screen.getByRole("option", { name: "Item 1" });
    expect(item).toHaveAttribute("data-interactive", "");
  });

  test("35. Static item root does NOT have data-interactive attribute", () => {
    render(
      <List aria-label="Test">
        <ListItem value="1" headline="Item 1" />
      </List>
    );
    const item = screen.getByRole("listitem");
    expect(item).not.toHaveAttribute("data-interactive");
  });

  test("35a. data-with-leading content flag set when leadingSlot provided", () => {
    render(
      <List aria-label="Test" selectionMode="single">
        <ListItem value="1" headline="Item 1" leadingSlot={<span>★</span>} leadingType="icon" />
      </List>
    );
    // Accessible name includes slot text — use positional query since only one option
    const item = screen.getAllByRole("option")[0];
    expect(item).toHaveAttribute("data-with-leading", "");
  });

  test("35b. data-with-trailing content flag set when trailingSlot provided", () => {
    render(
      <List aria-label="Test" selectionMode="single">
        <ListItem value="1" headline="Item 1" trailingSlot={<span>→</span>} trailingType="icon" />
      </List>
    );
    // Accessible name includes slot text — use positional query since only one option
    const item = screen.getAllByRole("option")[0];
    expect(item).toHaveAttribute("data-with-trailing", "");
  });
});

// ---------------------------------------------------------------------------
// State layer — MD3 spring motion tokens
// ---------------------------------------------------------------------------

describe("List — state layer", () => {
  test("33b. State layer span present in interactive list item", () => {
    render(
      <List aria-label="Test" selectionMode="single">
        <ListItem value="1" headline="Item 1" />
      </List>
    );
    const item = screen.getByRole("option", { name: "Item 1" });
    const stateLayer = item.querySelector(".bg-on-surface.opacity-0");
    expect(stateLayer).toBeInTheDocument();
  });

  test("34b. State layer has spring-standard-fast-effects motion tokens", () => {
    render(
      <List aria-label="Test" selectionMode="single">
        <ListItem value="1" headline="Item 1" />
      </List>
    );
    const item = screen.getByRole("option", { name: "Item 1" });
    const stateLayer = item.querySelector(".bg-on-surface.opacity-0");
    expect(stateLayer).toHaveClass("transition-opacity");
    expect(stateLayer).toHaveClass("duration-spring-standard-fast-effects");
    expect(stateLayer).toHaveClass("ease-spring-standard-fast-effects");
  });

  test("35c. State layer is NOT present in static list item", () => {
    render(
      <List aria-label="Test">
        <ListItem value="1" headline="Item 1" />
      </List>
    );
    const item = screen.getByRole("listitem");
    // Static item has no state layer span
    const stateLayer = item.querySelector(".bg-on-surface.opacity-0");
    expect(stateLayer).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Focus ring
// ---------------------------------------------------------------------------

describe("List — focus ring", () => {
  test("36. Focus ring span present in interactive list item", () => {
    render(
      <List aria-label="Test" selectionMode="single">
        <ListItem value="1" headline="Item 1" />
      </List>
    );
    const item = screen.getByRole("option", { name: "Item 1" });
    const focusRing = item.querySelector(".outline-secondary.opacity-0");
    expect(focusRing).toBeInTheDocument();
  });

  test("36b. Focus ring has spring-standard-fast-effects motion tokens", () => {
    render(
      <List aria-label="Test" selectionMode="single">
        <ListItem value="1" headline="Item 1" />
      </List>
    );
    const item = screen.getByRole("option", { name: "Item 1" });
    const focusRing = item.querySelector(".outline-secondary.opacity-0");
    expect(focusRing).toHaveClass("transition-opacity");
    expect(focusRing).toHaveClass("duration-spring-standard-fast-effects");
    expect(focusRing).toHaveClass("ease-spring-standard-fast-effects");
  });
});

// ---------------------------------------------------------------------------
// Leading slot
// ---------------------------------------------------------------------------

describe("List — leading slot", () => {
  test("37. type='icon': renders with size-6 text-on-surface-variant", () => {
    render(
      <List aria-label="Test">
        <ListItem
          value="1"
          headline="Item 1"
          leadingSlot={<span data-testid="icon">★</span>}
          leadingType="icon"
        />
      </List>
    );
    const icon = screen.getByTestId("icon");
    const container = icon.parentElement!;
    expect(container).toHaveClass("size-6");
    expect(container).toHaveClass("text-on-surface-variant");
  });

  test("38. type='avatar': renders with size-10 rounded-full", () => {
    render(
      <List aria-label="Test">
        <ListItem
          value="1"
          headline="Item 1"
          leadingSlot={<img data-testid="avatar" src="a.png" alt="" />}
          leadingType="avatar"
        />
      </List>
    );
    const avatar = screen.getByTestId("avatar");
    const container = avatar.parentElement!;
    expect(container).toHaveClass("size-10");
    expect(container).toHaveClass("rounded-full");
  });

  test("39. type='checkbox': inner control wrapper has aria-hidden='true'", () => {
    render(
      <List aria-label="Test" selectionMode="multiple">
        <ListItem
          value="1"
          headline="Item 1"
          leadingSlot={<input type="checkbox" data-testid="cb" readOnly />}
          leadingType="checkbox"
        />
      </List>
    );
    const cb = screen.getByTestId("cb");
    expect(cb.closest("[aria-hidden='true']")).toBeInTheDocument();
  });

  test("40. type='radio': inner control wrapper has aria-hidden='true' and tabIndex={-1}", () => {
    render(
      <List aria-label="Test" selectionMode="single">
        <ListItem
          value="1"
          headline="Item 1"
          leadingSlot={<input type="radio" data-testid="radio" readOnly />}
          leadingType="radio"
        />
      </List>
    );
    const radio = screen.getByTestId("radio");
    const wrapper = radio.closest("[aria-hidden='true']");
    expect(wrapper).toBeInTheDocument();
    expect(wrapper).toHaveAttribute("tabindex", "-1");
  });
});

// ---------------------------------------------------------------------------
// Trailing slot
// ---------------------------------------------------------------------------

describe("List — trailing slot", () => {
  test("41. type='text': renders with text-label-small text-on-surface-variant", () => {
    render(
      <List aria-label="Test">
        <ListItem
          value="1"
          headline="Item 1"
          trailingSlot={<span data-testid="meta">100+</span>}
          trailingType="text"
        />
      </List>
    );
    const meta = screen.getByTestId("meta");
    const container = meta.parentElement!;
    expect(container).toHaveClass("text-label-small");
    expect(container).toHaveClass("text-on-surface-variant");
  });

  test("42. type='icon': renders with size-6", () => {
    render(
      <List aria-label="Test">
        <ListItem
          value="1"
          headline="Item 1"
          trailingSlot={<span data-testid="trail-icon">→</span>}
          trailingType="icon"
        />
      </List>
    );
    const icon = screen.getByTestId("trail-icon");
    const container = icon.parentElement!;
    expect(container).toHaveClass("size-6");
  });
});

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

describe("List — text sub-component", () => {
  test("43. Headline has text-body-large text-on-surface", () => {
    render(
      <List aria-label="Test">
        <ListItem value="1" headline="Headline" />
      </List>
    );
    const headline = screen.getByText("Headline");
    expect(headline).toHaveClass("text-body-large");
    expect(headline).toHaveClass("text-on-surface");
  });

  test("44. Supporting text has text-body-medium text-on-surface-variant", () => {
    render(
      <List aria-label="Test">
        <ListItem value="1" headline="Title" supportingText="Sub" />
      </List>
    );
    const supporting = screen.getByText("Sub");
    expect(supporting).toHaveClass("text-body-medium");
    expect(supporting).toHaveClass("text-on-surface-variant");
  });

  test("45. Overline has text-label-small text-on-surface-variant", () => {
    render(
      <List aria-label="Test">
        <ListItem value="1" headline="Title" overline="OVERLINE" supportingText="Sub" />
      </List>
    );
    const overline = screen.getByText("OVERLINE");
    expect(overline).toHaveClass("text-label-small");
    expect(overline).toHaveClass("text-on-surface-variant");
  });
});

// ---------------------------------------------------------------------------
// Ripple
// ---------------------------------------------------------------------------

describe("List — ripple", () => {
  test("46. Ripple container present in interactive list item", () => {
    render(
      <List aria-label="Test" selectionMode="single">
        <ListItem value="1" headline="Item 1" />
      </List>
    );
    const item = screen.getByRole("option", { name: "Item 1" });
    expect(item.querySelector("[data-ripple-container]")).toBeInTheDocument();
  });

  test("47. Ripple NOT present in static list item", () => {
    render(
      <List aria-label="Test">
        <ListItem value="1" headline="Item 1" />
      </List>
    );
    const item = screen.getByRole("listitem");
    expect(item.querySelector("[data-ripple-container]")).not.toBeInTheDocument();
  });
});

// ===========================================================================
// Divider Integration Tests (48–59)
// ===========================================================================

// ---------------------------------------------------------------------------
// showDividers prop
// ---------------------------------------------------------------------------

describe("List — showDividers", () => {
  test("48. showDividers={true} renders Divider elements between list items", () => {
    const { container } = render(
      <List aria-label="Test" showDividers>
        <ListItem value="1" headline="Item 1" />
        <ListItem value="2" headline="Item 2" />
        <ListItem value="3" headline="Item 3" />
      </List>
    );
    const dividers = container.querySelectorAll("hr");
    expect(dividers.length).toBeGreaterThan(0);
  });

  test("49. With 3 items and showDividers={true}: renders exactly 2 Dividers", () => {
    const { container } = render(
      <List aria-label="Test" showDividers>
        <ListItem value="1" headline="Item 1" />
        <ListItem value="2" headline="Item 2" />
        <ListItem value="3" headline="Item 3" />
      </List>
    );
    const dividers = container.querySelectorAll("hr");
    expect(dividers).toHaveLength(2);
  });

  test("50. With 1 item and showDividers={true}: renders NO Dividers", () => {
    const { container } = render(
      <List aria-label="Test" showDividers>
        <ListItem value="1" headline="Item 1" />
      </List>
    );
    const dividers = container.querySelectorAll("hr");
    expect(dividers).toHaveLength(0);
  });

  test("51. Divider has border-outline-variant class (token compliance)", () => {
    const { container } = render(
      <List aria-label="Test" showDividers>
        <ListItem value="1" headline="Item 1" />
        <ListItem value="2" headline="Item 2" />
      </List>
    );
    const divider = container.querySelector("hr");
    expect(divider).toHaveClass("border-outline-variant");
  });

  test("52. showDividers={false} (default): renders no Dividers", () => {
    const { container } = render(
      <List aria-label="Test">
        <ListItem value="1" headline="Item 1" />
        <ListItem value="2" headline="Item 2" />
      </List>
    );
    const dividers = container.querySelectorAll("hr");
    expect(dividers).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// insetDivider prop
// ---------------------------------------------------------------------------

describe("List — insetDivider", () => {
  test("53. insetDivider={true} renders a Divider at the bottom of the item", () => {
    render(
      <List aria-label="Test">
        <ListItem value="1" headline="Item 1" insetDivider />
      </List>
    );
    const item = screen.getByRole("listitem");
    const divider = item.querySelector("hr");
    expect(divider).toBeInTheDocument();
  });

  test("54. Inset Divider has ms-4 class (16dp logical inset from start)", () => {
    render(
      <List aria-label="Test">
        <ListItem value="1" headline="Item 1" insetDivider />
      </List>
    );
    const item = screen.getByRole("listitem");
    const divider = item.querySelector("hr");
    expect(divider).toHaveClass("ms-4");
  });

  test("55. insetDivider={false} (default): no Divider inside item", () => {
    render(
      <List aria-label="Test">
        <ListItem value="1" headline="Item 1" />
      </List>
    );
    const item = screen.getByRole("listitem");
    const divider = item.querySelector("hr");
    expect(divider).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Composition
// ---------------------------------------------------------------------------

describe("List — divider composition", () => {
  test("56. showDividers and insetDivider can coexist without duplicate dividers at the same boundary", () => {
    const { container } = render(
      <List aria-label="Test" showDividers>
        <ListItem value="1" headline="Item 1" insetDivider />
        <ListItem value="2" headline="Item 2" insetDivider />
      </List>
    );
    const allDividers = container.querySelectorAll("hr");
    // 1 showDividers divider between items + 2 insetDivider dividers inside items = 3
    expect(allDividers).toHaveLength(3);
  });

  test("57. Divider in showDividers mode uses inset='none' (full-width)", () => {
    const { container } = render(
      <List aria-label="Test" showDividers>
        <ListItem value="1" headline="Item 1" />
        <ListItem value="2" headline="Item 2" />
      </List>
    );
    const list = container.querySelector("[role='list']")!;
    const betweenDivider = list.querySelector(":scope > hr");
    expect(betweenDivider).toBeInTheDocument();
    expect(betweenDivider).not.toHaveClass("ms-4");
    expect(betweenDivider).toHaveClass("w-full");
  });

  test("58. Divider in insetDivider mode uses inset='start' (leading inset)", () => {
    render(
      <List aria-label="Test">
        <ListItem value="1" headline="Item 1" insetDivider />
      </List>
    );
    const item = screen.getByRole("listitem");
    const divider = item.querySelector("hr");
    expect(divider).toHaveClass("ms-4");
  });
});

// ---------------------------------------------------------------------------
// Divider accessibility
// ---------------------------------------------------------------------------

describe("List — divider accessibility", () => {
  test("59. axe check — list with showDividers={true}, no violations", async () => {
    const { container } = render(
      <List aria-label="Settings" showDividers>
        <ListItem value="wifi" headline="Wi-Fi" />
        <ListItem value="bt" headline="Bluetooth" />
        <ListItem value="nfc" headline="NFC" />
      </List>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("60. axe check — list with insetDivider={true}, no violations", async () => {
    const { container } = render(
      <List aria-label="Settings">
        <ListItem value="wifi" headline="Wi-Fi" insetDivider />
        <ListItem value="bt" headline="Bluetooth" insetDivider />
      </List>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("61. <hr> elements from Dividers do not break listbox/list accessibility roles", async () => {
    const { container } = render(
      <List aria-label="Settings" showDividers>
        <ListItem value="wifi" headline="Wi-Fi" insetDivider />
        <ListItem value="bt" headline="Bluetooth" />
      </List>
    );
    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
