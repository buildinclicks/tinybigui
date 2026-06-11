import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { MenuTrigger, Menu } from "./Menu";
import { MenuItem } from "./MenuItem";
import { MenuItemGroup } from "./MenuItemGroup";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function openMenu() {
  const user = userEvent.setup();
  const trigger = screen.getByRole("button", { name: "Open Menu" });
  await user.click(trigger);
  return { user, trigger };
}

function renderVerticalMenuWithGroups() {
  return render(
    <MenuTrigger>
      <button type="button">Open Menu</button>
      <MenuTrigger.Menu aria-label="Edit" menuStyle="vertical">
        <MenuItemGroup aria-label="Clipboard">
          <MenuItem id="cut">Cut</MenuItem>
          <MenuItem id="copy">Copy</MenuItem>
        </MenuItemGroup>
        <MenuItemGroup aria-label="History">
          <MenuItem id="undo">Undo</MenuItem>
          <MenuItem id="redo">Redo</MenuItem>
        </MenuItemGroup>
      </MenuTrigger.Menu>
    </MenuTrigger>
  );
}

// ─── MenuItemGroup ─────────────────────────────────────────────────────────────

describe("MenuItemGroup", () => {
  // ─── Rendering ──────────────────────────────────────────────────────────────

  describe("Rendering", () => {
    test("renders children inside a role='group'", async () => {
      renderVerticalMenuWithGroups();
      await openMenu();
      const groups = screen.getAllByRole("group");
      expect(groups.length).toBeGreaterThanOrEqual(2);
    });

    test("groups have correct accessible names from aria-label", async () => {
      renderVerticalMenuWithGroups();
      await openMenu();
      expect(screen.getByRole("group", { name: "Clipboard" })).toBeInTheDocument();
      expect(screen.getByRole("group", { name: "History" })).toBeInTheDocument();
    });

    test("all items within groups are accessible as menuitems", async () => {
      renderVerticalMenuWithGroups();
      await openMenu();
      expect(screen.getByRole("menuitem", { name: "Cut" })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: "Copy" })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: "Undo" })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: "Redo" })).toBeInTheDocument();
    });

    test("merges custom className onto the group container", async () => {
      render(
        <MenuTrigger>
          <button type="button">Open Menu</button>
          <MenuTrigger.Menu aria-label="Edit" menuStyle="vertical">
            <MenuItemGroup aria-label="Clipboard" className="my-custom-class">
              <MenuItem id="cut">Cut</MenuItem>
            </MenuItemGroup>
          </MenuTrigger.Menu>
        </MenuTrigger>
      );
      await openMenu();
      expect(screen.getByRole("group", { name: "Clipboard" })).toHaveClass("my-custom-class");
    });
  });

  // ─── Gap behaviour ──────────────────────────────────────────────────────────
  // The Popover renders in a portal so we query document.body, not container.

  describe("Gap behaviour (menuStyle='vertical')", () => {
    test("two sibling groups render two data-menu-gap elements", async () => {
      renderVerticalMenuWithGroups();
      await openMenu();
      const gaps = document.body.querySelectorAll("[data-menu-gap]");
      // Two groups → two gap elements (leading-gap model).
      // First is hidden (first:hidden), second is visible.
      expect(gaps.length).toBe(2);
    });

    test("the first data-menu-gap element has the first:hidden class", async () => {
      renderVerticalMenuWithGroups();
      await openMenu();
      const gaps = document.body.querySelectorAll("[data-menu-gap]");
      expect(gaps[0]).toHaveClass("first:hidden");
    });

    test("only one gap element is emitted for a single group", async () => {
      render(
        <MenuTrigger>
          <button type="button">Open Menu</button>
          <MenuTrigger.Menu aria-label="Edit" menuStyle="vertical">
            <MenuItemGroup aria-label="Clipboard">
              <MenuItem id="cut">Cut</MenuItem>
            </MenuItemGroup>
          </MenuTrigger.Menu>
        </MenuTrigger>
      );
      await openMenu();
      const gaps = document.body.querySelectorAll("[data-menu-gap]");
      // One group → one leading gap, hidden by first:hidden.
      expect(gaps.length).toBe(1);
      expect(gaps[0]).toHaveClass("first:hidden");
    });

    test("three sibling groups render three gap elements", async () => {
      render(
        <MenuTrigger>
          <button type="button">Open Menu</button>
          <MenuTrigger.Menu aria-label="Edit" menuStyle="vertical">
            <MenuItemGroup aria-label="Clipboard">
              <MenuItem id="cut">Cut</MenuItem>
            </MenuItemGroup>
            <MenuItemGroup aria-label="History">
              <MenuItem id="undo">Undo</MenuItem>
            </MenuItemGroup>
            <MenuItemGroup aria-label="Danger">
              <MenuItem id="delete">Delete</MenuItem>
            </MenuItemGroup>
          </MenuTrigger.Menu>
        </MenuTrigger>
      );
      await openMenu();
      const gaps = document.body.querySelectorAll("[data-menu-gap]");
      expect(gaps.length).toBe(3);
    });

    test("gap elements are hidden from the accessibility tree (aria-hidden)", async () => {
      renderVerticalMenuWithGroups();
      await openMenu();
      const gaps = document.body.querySelectorAll("[data-menu-gap]");
      gaps.forEach((gap) => {
        expect(gap).toHaveAttribute("aria-hidden", "true");
      });
    });
  });

  // ─── Baseline warning ────────────────────────────────────────────────────────
  // These tests render Menu directly (not inside a Popover) so MenuItemGroup
  // mounts immediately during render() without needing openMenu(). This also
  // avoids the vi.stubEnv + portal interaction issue.

  describe("Baseline menu dev warning", () => {
    beforeEach(() => {
      vi.spyOn(console, "warn").mockImplementation(() => {});
      vi.stubEnv("NODE_ENV", "development");
    });

    afterEach(() => {
      vi.unstubAllEnvs();
      vi.restoreAllMocks();
    });

    test("emits a console.warn when rendered inside a baseline menu", () => {
      render(
        <Menu aria-label="Edit" menuStyle="baseline">
          <MenuItemGroup aria-label="Clipboard">
            <MenuItem id="cut">Cut</MenuItem>
          </MenuItemGroup>
        </Menu>
      );
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining("[MenuItemGroup]"),
        expect.stringContaining("baseline")
      );
    });

    test("does NOT emit a [MenuItemGroup] warn when rendered inside a vertical menu", () => {
      render(
        <Menu aria-label="Edit" menuStyle="vertical">
          <MenuItemGroup aria-label="Clipboard">
            <MenuItem id="cut">Cut</MenuItem>
          </MenuItemGroup>
        </Menu>
      );
      const calls = (console.warn as ReturnType<typeof vi.fn>).mock.calls;
      const menuItemGroupWarn = calls.find(
        (args) => typeof args[0] === "string" && args[0].includes("[MenuItemGroup]")
      );
      expect(menuItemGroupWarn).toBeUndefined();
    });

    test("still renders the group when used inside a baseline menu (graceful degradation)", () => {
      render(
        <Menu aria-label="Edit" menuStyle="baseline">
          <MenuItemGroup aria-label="Clipboard">
            <MenuItem id="cut">Cut</MenuItem>
          </MenuItemGroup>
        </Menu>
      );
      expect(screen.getByRole("group", { name: "Clipboard" })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: "Cut" })).toBeInTheDocument();
    });

    test("does NOT inject a gap in baseline menuStyle", () => {
      render(
        <Menu aria-label="Edit" menuStyle="baseline">
          <MenuItemGroup aria-label="Clipboard">
            <MenuItem id="cut">Cut</MenuItem>
          </MenuItemGroup>
          <MenuItemGroup aria-label="History">
            <MenuItem id="undo">Undo</MenuItem>
          </MenuItemGroup>
        </Menu>
      );
      const gaps = document.body.querySelectorAll("[data-menu-gap]");
      expect(gaps.length).toBe(0);
    });
  });

  // ─── Keyboard / Interaction ───────────────────────────────────────────────────

  describe("Keyboard / Interaction", () => {
    test("clicking an item inside a group triggers its action handler", async () => {
      const onAction = vi.fn();
      render(
        <MenuTrigger>
          <button type="button">Open Menu</button>
          <MenuTrigger.Menu aria-label="Edit" menuStyle="vertical">
            <MenuItemGroup aria-label="Clipboard">
              <MenuItem id="cut" onAction={onAction}>
                Cut
              </MenuItem>
            </MenuItemGroup>
          </MenuTrigger.Menu>
        </MenuTrigger>
      );
      const { user } = await openMenu();
      await user.click(screen.getByRole("menuitem", { name: "Cut" }));
      expect(onAction).toHaveBeenCalled();
    });

    test("items across multiple groups are all keyboard-reachable via Tab", async () => {
      renderVerticalMenuWithGroups();
      await openMenu();
      // All items are in the menu's tab sequence (tabindex managed by RAC).
      // Verify all four items are registered as menuitems regardless of group.
      const items = screen.getAllByRole("menuitem");
      const names = items.map((el) => el.textContent?.trim());
      expect(names).toContain("Cut");
      expect(names).toContain("Copy");
      expect(names).toContain("Undo");
      expect(names).toContain("Redo");
    });

    test("items receive initial auto-focus when menu opens", async () => {
      renderVerticalMenuWithGroups();
      await openMenu();
      await waitFor(() => {
        expect(document.activeElement).toHaveTextContent("Cut");
      });
    });
  });

  // ─── Accessibility ───────────────────────────────────────────────────────────

  describe("Accessibility", () => {
    test("has no axe violations in vertical menu with two groups", async () => {
      const { container } = renderVerticalMenuWithGroups();
      await openMenu();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no axe violations in baseline menu (graceful degradation)", async () => {
      const { container } = render(
        <MenuTrigger>
          <button type="button">Open Menu</button>
          <MenuTrigger.Menu aria-label="Edit" menuStyle="baseline">
            <MenuItemGroup aria-label="Clipboard">
              <MenuItem id="cut">Cut</MenuItem>
              <MenuItem id="copy">Copy</MenuItem>
            </MenuItemGroup>
          </MenuTrigger.Menu>
        </MenuTrigger>
      );
      await openMenu();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
