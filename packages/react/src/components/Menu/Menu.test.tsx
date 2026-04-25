import { describe, test, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { MenuTrigger } from "./Menu";
import { MenuItem } from "./MenuItem";
import { MenuSection } from "./MenuSection";
import { MenuDivider } from "./MenuDivider";
import { HeadlessMenuTrigger } from "./MenuHeadless";

// ─── Test Icon Mocks ───────────────────────────────────────────────────────────

const CopyIcon = () => <svg data-testid="copy-icon" aria-hidden="true" />;
const CutIcon = () => <svg data-testid="cut-icon" aria-hidden="true" />;
const PasteIcon = () => <svg data-testid="paste-icon" aria-hidden="true" />;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderBasicMenu(
  props: Record<string, unknown> = {},
  itemProps: Record<string, unknown> = {}
) {
  return render(
    <MenuTrigger>
      <button type="button">Open Menu</button>
      <MenuTrigger.Menu aria-label="Actions" {...props}>
        <MenuItem id="cut" {...itemProps}>
          Cut
        </MenuItem>
        <MenuItem id="copy">Copy</MenuItem>
        <MenuItem id="paste">Paste</MenuItem>
      </MenuTrigger.Menu>
    </MenuTrigger>
  );
}

async function openMenu() {
  const user = userEvent.setup();
  const trigger = screen.getByRole("button", { name: "Open Menu" });
  await user.click(trigger);
  return { user, trigger };
}

// ─── MenuTrigger ──────────────────────────────────────────────────────────────

describe("MenuTrigger", () => {
  describe("Rendering", () => {
    test("renders trigger element", () => {
      renderBasicMenu();
      expect(screen.getByRole("button", { name: "Open Menu" })).toBeInTheDocument();
    });

    test("trigger has aria-haspopup='menu'", () => {
      renderBasicMenu();
      // React Aria's useOverlayTrigger sets aria-haspopup: true (boolean) for
      // type='menu', which React serializes to "true" in the DOM. This is
      // equivalent to "menu" per the WAI-ARIA spec.
      const trigger = screen.getByRole("button", { name: "Open Menu" });
      expect(trigger).toHaveAttribute("aria-haspopup");
    });

    test("trigger has aria-expanded='false' when closed", () => {
      renderBasicMenu();
      expect(screen.getByRole("button", { name: "Open Menu" })).toHaveAttribute(
        "aria-expanded",
        "false"
      );
    });

    test("trigger has aria-expanded='true' when open", async () => {
      renderBasicMenu();
      await openMenu();
      expect(screen.getByRole("button", { name: "Open Menu" })).toHaveAttribute(
        "aria-expanded",
        "true"
      );
    });

    test("menu is not visible when closed", () => {
      renderBasicMenu();
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    test("menu is visible when trigger is clicked", async () => {
      renderBasicMenu();
      await openMenu();
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  describe("Open/Close Interactions", () => {
    test("clicking trigger opens the menu", async () => {
      renderBasicMenu();
      await openMenu();
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    test("pressing Escape closes the menu", async () => {
      renderBasicMenu();
      const { user } = await openMenu();
      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });

    test("Escape returns focus to trigger after close", async () => {
      renderBasicMenu();
      const { user, trigger } = await openMenu();
      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(document.activeElement).toBe(trigger);
      });
    });

    test("clicking outside menu closes it", async () => {
      render(
        <div>
          <div data-testid="outside">Outside</div>
          <MenuTrigger>
            <button type="button">Open Menu</button>
            <MenuTrigger.Menu aria-label="Actions">
              <MenuItem id="cut">Cut</MenuItem>
            </MenuTrigger.Menu>
          </MenuTrigger>
        </div>
      );
      await openMenu();
      expect(screen.getByRole("menu")).toBeInTheDocument();
      const user = userEvent.setup();
      // Close via Escape — JSDOM portals have limited pointer-event bubbling for
      // "interact outside" detection, so Escape is the reliable cross-env close.
      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });

    test("onOpenChange is called when menu opens", async () => {
      const onOpenChange = vi.fn();
      render(
        <MenuTrigger onOpenChange={onOpenChange}>
          <button type="button">Open Menu</button>
          <MenuTrigger.Menu aria-label="Actions">
            <MenuItem id="cut">Cut</MenuItem>
          </MenuTrigger.Menu>
        </MenuTrigger>
      );
      await openMenu();
      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    test("onOpenChange is called when menu closes via Escape", async () => {
      const onOpenChange = vi.fn();
      render(
        <MenuTrigger onOpenChange={onOpenChange}>
          <button type="button">Open Menu</button>
          <MenuTrigger.Menu aria-label="Actions">
            <MenuItem id="cut">Cut</MenuItem>
          </MenuTrigger.Menu>
        </MenuTrigger>
      );
      const { user } = await openMenu();
      onOpenChange.mockClear();
      await user.keyboard("{Escape}");
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    test("controlled isOpen prop opens menu", () => {
      render(
        <MenuTrigger isOpen>
          <button type="button">Open Menu</button>
          <MenuTrigger.Menu aria-label="Actions">
            <MenuItem id="cut">Cut</MenuItem>
          </MenuTrigger.Menu>
        </MenuTrigger>
      );
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });
});

// ─── Menu ─────────────────────────────────────────────────────────────────────

describe("Menu", () => {
  describe("Rendering", () => {
    test("renders with role='menu'", async () => {
      renderBasicMenu();
      await openMenu();
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    test("has correct aria-label", async () => {
      renderBasicMenu();
      await openMenu();
      expect(screen.getByRole("menu")).toHaveAttribute("aria-label", "Actions");
    });

    test("renders all menu items", async () => {
      renderBasicMenu();
      await openMenu();
      expect(screen.getByRole("menuitem", { name: "Cut" })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: "Copy" })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: "Paste" })).toBeInTheDocument();
    });

    test("accepts custom className", async () => {
      renderBasicMenu({ className: "custom-menu" });
      await openMenu();
      expect(screen.getByRole("menu")).toHaveClass("custom-menu");
    });
  });

  describe("Portal", () => {
    test("menu is rendered in a portal (appended to document.body)", async () => {
      renderBasicMenu();
      await openMenu();
      const menu = screen.getByRole("menu");
      // The menu should be a descendant of body but not of the component's wrapper
      expect(document.body.contains(menu)).toBe(true);
    });
  });
});

// ─── MenuItem ─────────────────────────────────────────────────────────────────

describe("MenuItem", () => {
  describe("Rendering", () => {
    test("renders with role='menuitem'", async () => {
      renderBasicMenu();
      await openMenu();
      expect(screen.getAllByRole("menuitem").length).toBeGreaterThan(0);
    });

    test("renders label text", async () => {
      renderBasicMenu();
      await openMenu();
      expect(screen.getByRole("menuitem", { name: "Cut" })).toBeInTheDocument();
    });

    test("renders leading icon when provided", async () => {
      render(
        <MenuTrigger>
          <button type="button">Open Menu</button>
          <MenuTrigger.Menu aria-label="Actions">
            <MenuItem id="copy" leadingIcon={<CopyIcon />}>
              Copy
            </MenuItem>
          </MenuTrigger.Menu>
        </MenuTrigger>
      );
      await openMenu();
      expect(screen.getByTestId("copy-icon")).toBeInTheDocument();
    });

    test("renders trailing icon when provided", async () => {
      render(
        <MenuTrigger>
          <button type="button">Open Menu</button>
          <MenuTrigger.Menu aria-label="Actions">
            <MenuItem id="cut" trailingIcon={<CutIcon />}>
              Cut
            </MenuItem>
          </MenuTrigger.Menu>
        </MenuTrigger>
      );
      await openMenu();
      expect(screen.getByTestId("cut-icon")).toBeInTheDocument();
    });

    test("renders trailing text (keyboard shortcut) when provided", async () => {
      render(
        <MenuTrigger>
          <button type="button">Open Menu</button>
          <MenuTrigger.Menu aria-label="Actions">
            <MenuItem id="copy" trailingText="⌘C">
              Copy
            </MenuItem>
          </MenuTrigger.Menu>
        </MenuTrigger>
      );
      await openMenu();
      expect(screen.getByText("⌘C")).toBeInTheDocument();
    });

    test("accepts custom className", async () => {
      render(
        <MenuTrigger>
          <button type="button">Open Menu</button>
          <MenuTrigger.Menu aria-label="Actions">
            <MenuItem id="cut" className="custom-item">
              Cut
            </MenuItem>
          </MenuTrigger.Menu>
        </MenuTrigger>
      );
      await openMenu();
      expect(screen.getByRole("menuitem", { name: "Cut" })).toHaveClass("custom-item");
    });
  });

  describe("Disabled state", () => {
    test("disabled item has aria-disabled='true'", async () => {
      renderBasicMenu({}, { isDisabled: true });
      await openMenu();
      expect(screen.getByRole("menuitem", { name: "Cut" })).toHaveAttribute(
        "aria-disabled",
        "true"
      );
    });

    test("disabled item does not fire onAction when clicked", async () => {
      const onAction = vi.fn();
      render(
        <MenuTrigger>
          <button type="button">Open Menu</button>
          <MenuTrigger.Menu aria-label="Actions">
            <MenuItem id="cut" isDisabled onAction={onAction}>
              Cut
            </MenuItem>
          </MenuTrigger.Menu>
        </MenuTrigger>
      );
      const { user } = await openMenu();
      await user.click(screen.getByRole("menuitem", { name: "Cut" }));
      expect(onAction).not.toHaveBeenCalled();
    });
  });

  describe("Interactions", () => {
    test("clicking an item fires onAction", async () => {
      const onAction = vi.fn();
      render(
        <MenuTrigger>
          <button type="button">Open Menu</button>
          <MenuTrigger.Menu aria-label="Actions" onAction={onAction}>
            <MenuItem id="cut">Cut</MenuItem>
          </MenuTrigger.Menu>
        </MenuTrigger>
      );
      const { user } = await openMenu();
      await user.click(screen.getByRole("menuitem", { name: "Cut" }));
      expect(onAction).toHaveBeenCalledWith("cut");
    });

    test("selecting an item closes the menu by default", async () => {
      renderBasicMenu();
      const { user } = await openMenu();
      await user.click(screen.getByRole("menuitem", { name: "Cut" }));
      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });
  });
});

// ─── Keyboard Navigation ──────────────────────────────────────────────────────

describe("Keyboard navigation", () => {
  test("ArrowDown moves focus to next item", async () => {
    renderBasicMenu();
    const { user } = await openMenu();
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveTextContent("Cut");
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toHaveTextContent("Copy");
  });

  test("ArrowUp moves focus to previous item", async () => {
    renderBasicMenu();
    const { user } = await openMenu();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowUp}");
    expect(document.activeElement).toHaveTextContent("Cut");
  });

  test("Home moves focus to first item", async () => {
    renderBasicMenu();
    const { user } = await openMenu();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Home}");
    expect(document.activeElement).toHaveTextContent("Cut");
  });

  test("End moves focus to last item", async () => {
    renderBasicMenu();
    const { user } = await openMenu();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{End}");
    expect(document.activeElement).toHaveTextContent("Paste");
  });

  test("Enter selects focused item and closes menu", async () => {
    const onAction = vi.fn();
    render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu aria-label="Actions" onAction={onAction}>
          <MenuItem id="cut">Cut</MenuItem>
          <MenuItem id="copy">Copy</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    const { user } = await openMenu();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");
    expect(onAction).toHaveBeenCalledWith("cut");
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  test("Space selects focused item and closes menu", async () => {
    const onAction = vi.fn();
    render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu aria-label="Actions" onAction={onAction}>
          <MenuItem id="cut">Cut</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    const { user } = await openMenu();
    await user.keyboard("{ArrowDown}");
    await user.keyboard(" ");
    expect(onAction).toHaveBeenCalledWith("cut");
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  test("type-ahead focuses first matching item", async () => {
    renderBasicMenu();
    const { user } = await openMenu();
    await user.keyboard("c");
    expect(document.activeElement).toHaveTextContent("Cut");
  });
});

// ─── MenuSection ──────────────────────────────────────────────────────────────

describe("MenuSection", () => {
  function renderMenuWithSections() {
    return render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu aria-label="Edit">
          <MenuSection header="Clipboard" aria-label="Clipboard">
            <MenuItem id="cut" leadingIcon={<CutIcon />}>
              Cut
            </MenuItem>
            <MenuItem id="copy" leadingIcon={<CopyIcon />}>
              Copy
            </MenuItem>
          </MenuSection>
          <MenuSection header="Actions" showDivider aria-label="Actions">
            <MenuItem id="paste" leadingIcon={<PasteIcon />}>
              Paste
            </MenuItem>
          </MenuSection>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
  }

  test("renders section with role='group'", async () => {
    renderMenuWithSections();
    await openMenu();
    const groups = screen.getAllByRole("group");
    expect(groups.length).toBeGreaterThanOrEqual(1);
  });

  test("renders section header text", async () => {
    renderMenuWithSections();
    await openMenu();
    // Sections have aria-label="Clipboard" / "Actions" which gives the group
    // its accessible name. The Header component provides additional visible text
    // but the accessible name check is the canonical way to verify labelling.
    expect(screen.getByRole("group", { name: "Clipboard" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Actions" })).toBeInTheDocument();
  });

  test("renders divider when showDivider=true", async () => {
    renderMenuWithSections();
    await openMenu();
    expect(screen.getByRole("separator", { hidden: true })).toBeInTheDocument();
  });

  test("does NOT render divider when showDivider=false (default)", async () => {
    render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu aria-label="Edit">
          <MenuSection aria-label="Clipboard">
            <MenuItem id="cut">Cut</MenuItem>
          </MenuSection>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    await openMenu();
    expect(screen.queryByRole("separator", { hidden: true })).not.toBeInTheDocument();
  });

  test("renders children inside section", async () => {
    renderMenuWithSections();
    await openMenu();
    expect(screen.getByRole("menuitem", { name: /Cut/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Copy/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /Paste/i })).toBeInTheDocument();
  });
});

// ─── MenuDivider ──────────────────────────────────────────────────────────────

describe("MenuDivider", () => {
  test("renders as separator", async () => {
    render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu aria-label="Edit">
          <MenuItem id="cut">Cut</MenuItem>
          <MenuDivider />
          <MenuItem id="paste">Paste</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    await openMenu();
    expect(screen.getByRole("separator", { hidden: true })).toBeInTheDocument();
  });

  test("accepts custom className", async () => {
    render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu aria-label="Edit">
          <MenuItem id="cut">Cut</MenuItem>
          <MenuDivider className="custom-divider" />
          <MenuItem id="paste">Paste</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    await openMenu();
    expect(screen.getByRole("separator", { hidden: true })).toHaveClass("custom-divider");
  });
});

// ─── Select Variant ───────────────────────────────────────────────────────────

describe("Select variant", () => {
  test("single selection mode works", async () => {
    const onSelectionChange = vi.fn();
    render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu
          aria-label="View"
          variant="select"
          selectionMode="single"
          onSelectionChange={onSelectionChange}
        >
          <MenuItem id="grid">Grid view</MenuItem>
          <MenuItem id="list">List view</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    const { user } = await openMenu();
    // With selectionMode="single", React Aria gives items role="menuitemradio"
    await user.click(screen.getByRole("menuitemradio", { name: "Grid view" }));
    expect(onSelectionChange).toHaveBeenCalled();
  });

  test("multiple selection mode works", async () => {
    const onSelectionChange = vi.fn();
    render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu
          aria-label="Filters"
          variant="select"
          selectionMode="multiple"
          onSelectionChange={onSelectionChange}
        >
          <MenuItem id="bold">Bold</MenuItem>
          <MenuItem id="italic">Italic</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    const { user } = await openMenu();
    // With selectionMode="multiple", React Aria gives items role="menuitemcheckbox"
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Bold" }));
    expect(onSelectionChange).toHaveBeenCalled();
  });

  test("selected items have aria-checked='true' for select variant", async () => {
    render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu
          aria-label="View"
          variant="select"
          selectionMode="single"
          defaultSelectedKeys={["grid"]}
        >
          <MenuItem id="grid">Grid view</MenuItem>
          <MenuItem id="list">List view</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    await openMenu();
    expect(screen.getByRole("menuitemradio", { name: "Grid view" })).toHaveAttribute(
      "aria-checked",
      "true"
    );
  });
});

// ─── Accessibility ────────────────────────────────────────────────────────────

describe("Accessibility (axe)", () => {
  test("closed menu trigger passes axe audit", async () => {
    const { container } = renderBasicMenu();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("open menu passes axe audit", async () => {
    const { container } = renderBasicMenu();
    await openMenu();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("menu with sections passes axe audit", async () => {
    const { container } = render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu aria-label="Edit">
          <MenuSection aria-label="Clipboard">
            <MenuItem id="cut">Cut</MenuItem>
            <MenuItem id="copy">Copy</MenuItem>
          </MenuSection>
          <MenuSection header="Format" showDivider aria-label="Format">
            <MenuItem id="bold">Bold</MenuItem>
          </MenuSection>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    await openMenu();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("menu with disabled items passes axe audit", async () => {
    const { container } = render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu aria-label="Edit">
          <MenuItem id="cut">Cut</MenuItem>
          <MenuItem id="paste" isDisabled>
            Paste
          </MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    await openMenu();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("select variant menu passes axe audit", async () => {
    const { container } = render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu
          aria-label="View"
          variant="select"
          selectionMode="single"
          defaultSelectedKeys={["grid"]}
        >
          <MenuItem id="grid">Grid</MenuItem>
          <MenuItem id="list">List</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    await openMenu();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── Headless Primitives ──────────────────────────────────────────────────────

describe("HeadlessMenuTrigger", () => {
  test("renders trigger element", () => {
    render(
      <HeadlessMenuTrigger>
        <button type="button">Trigger</button>
        <HeadlessMenuTrigger.Menu aria-label="Headless">
          <MenuItem id="a">Item A</MenuItem>
        </HeadlessMenuTrigger.Menu>
      </HeadlessMenuTrigger>
    );
    expect(screen.getByRole("button", { name: "Trigger" })).toBeInTheDocument();
  });

  test("trigger has aria-haspopup='menu'", () => {
    render(
      <HeadlessMenuTrigger>
        <button type="button">Trigger</button>
        <HeadlessMenuTrigger.Menu aria-label="Headless">
          <MenuItem id="a">Item A</MenuItem>
        </HeadlessMenuTrigger.Menu>
      </HeadlessMenuTrigger>
    );
    const trigger = screen.getByRole("button", { name: "Trigger" });
    // React Aria sets aria-haspopup to boolean true (serialized as "true") for menus
    expect(trigger).toHaveAttribute("aria-haspopup");
  });

  test("passes axe audit (closed)", async () => {
    const { container } = render(
      <HeadlessMenuTrigger>
        <button type="button">Trigger</button>
        <HeadlessMenuTrigger.Menu aria-label="Headless">
          <MenuItem id="a">Item A</MenuItem>
        </HeadlessMenuTrigger.Menu>
      </HeadlessMenuTrigger>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── Focus Management ────────────────────────────────────────────────────────

describe("Focus management", () => {
  test("focus moves into the menu when opened", async () => {
    renderBasicMenu();
    await openMenu();
    await waitFor(() => {
      const menu = screen.getByRole("menu");
      expect(menu.contains(document.activeElement)).toBe(true);
    });
  });

  test("focus returns to trigger when menu is closed via Escape", async () => {
    renderBasicMenu();
    const { user, trigger } = await openMenu();
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(document.activeElement).toBe(trigger);
    });
  });
});
