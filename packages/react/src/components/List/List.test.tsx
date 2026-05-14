import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ListHeadless, ListItemHeadless } from "./ListHeadless";

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
    // Focus the last item, then move up
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
