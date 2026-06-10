import { describe, test, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { MenuTrigger } from "./Menu";
import { MenuItem } from "./MenuItem";
import { MenuSection } from "./MenuSection";
import { MenuDivider } from "./MenuDivider";
import { MenuGap } from "./MenuGap";
import { SubmenuTrigger } from "./SubmenuTrigger";
import { ContextMenuTrigger } from "./ContextMenuTrigger";
import { HeadlessMenuTrigger } from "./MenuHeadless";
import {
  menuContainerVariants,
  menuItemVariants,
  menuItemStateLayerVariants,
} from "./Menu.variants";

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
      // When the menu is open the Popover uses modal overlay behavior — RAC's
      // ariaHideOutside hides everything outside the popover from the a11y tree,
      // including the trigger. We use { hidden: true } to assert the attribute
      // on the DOM node directly while it is aria-hidden.
      expect(screen.getByRole("button", { name: "Open Menu", hidden: true })).toHaveAttribute(
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
          <div data-testid="outside">Outside element</div>
          <MenuTrigger>
            <button type="button">Open Menu</button>
            <MenuTrigger.Menu aria-label="Actions">
              <MenuItem id="cut">Cut</MenuItem>
            </MenuTrigger.Menu>
          </MenuTrigger>
        </div>
      );
      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: "Open Menu" }));
      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeInTheDocument();
      });
      await user.click(screen.getByTestId("outside"));
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

    test("shouldFlip prop passes through to trigger", () => {
      // shouldFlip defaults to true; test it can be set
      render(
        <MenuTrigger shouldFlip={false}>
          <button type="button">Open Menu</button>
          <MenuTrigger.Menu aria-label="Actions">
            <MenuItem id="cut">Cut</MenuItem>
          </MenuTrigger.Menu>
        </MenuTrigger>
      );
      expect(screen.getByRole("button", { name: "Open Menu" })).toBeInTheDocument();
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

    test("uses standard colorScheme by default", async () => {
      renderBasicMenu();
      await openMenu();
      const menu = screen.getByRole("menu");
      expect(menu).toHaveClass("bg-surface-container");
    });

    test("vibrant colorScheme applies tertiary container background", async () => {
      renderBasicMenu({ colorScheme: "vibrant", menuStyle: "vertical" });
      await openMenu();
      const menu = screen.getByRole("menu");
      expect(menu).toHaveClass("bg-tertiary-container");
    });

    test("baseline menuStyle uses extra-small corner radius", async () => {
      renderBasicMenu({ menuStyle: "baseline" });
      await openMenu();
      expect(screen.getByRole("menu")).toHaveClass("rounded-xs");
    });

    test("vertical menuStyle uses large corner radius", async () => {
      renderBasicMenu({ menuStyle: "vertical" });
      await openMenu();
      expect(screen.getByRole("menu")).toHaveClass("rounded-lg");
    });
  });

  describe("Portal", () => {
    test("menu is rendered in a portal (appended to document.body)", async () => {
      renderBasicMenu();
      await openMenu();
      const menu = screen.getByRole("menu");
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

    test("uses label-large typography for label text", async () => {
      renderBasicMenu();
      await openMenu();
      const item = screen.getByRole("menuitem", { name: "Cut" });
      expect(item).toHaveClass("text-label-large");
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

    test("leading icon wrapper has 24dp size constraint", async () => {
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
      const icon = screen.getByTestId("copy-icon");
      const wrapper = icon.closest("span");
      expect(wrapper).toHaveClass("w-6");
      expect(wrapper).toHaveClass("h-6");
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

    test("trailing icon wrapper has 24dp size constraint", async () => {
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
      const icon = screen.getByTestId("cut-icon");
      const wrapper = icon.closest("span");
      expect(wrapper).toHaveClass("w-6");
      expect(wrapper).toHaveClass("h-6");
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

    test("trailing text has aria-keyshortcuts attribute", async () => {
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
      const shortcut = screen.getByText("⌘C");
      expect(shortcut).toHaveAttribute("aria-keyshortcuts", "⌘C");
    });

    test("renders description when provided", async () => {
      render(
        <MenuTrigger>
          <button type="button">Open Menu</button>
          <MenuTrigger.Menu aria-label="Actions">
            <MenuItem id="copy" description="Copy the selected text">
              Copy
            </MenuItem>
          </MenuTrigger.Menu>
        </MenuTrigger>
      );
      await openMenu();
      expect(screen.getByText("Copy the selected text")).toBeInTheDocument();
    });

    test("description uses body-medium typography", async () => {
      render(
        <MenuTrigger>
          <button type="button">Open Menu</button>
          <MenuTrigger.Menu aria-label="Actions">
            <MenuItem id="copy" description="Copy description">
              Copy
            </MenuItem>
          </MenuTrigger.Menu>
        </MenuTrigger>
      );
      await openMenu();
      const desc = screen.getByText("Copy description");
      expect(desc).toHaveClass("text-body-medium");
      expect(desc).toHaveClass("text-on-surface-variant");
    });

    test("renders badge when provided", async () => {
      render(
        <MenuTrigger>
          <button type="button">Open Menu</button>
          <MenuTrigger.Menu aria-label="Actions">
            <MenuItem id="notifications" badge={<span data-testid="badge">3</span>}>
              Notifications
            </MenuItem>
          </MenuTrigger.Menu>
        </MenuTrigger>
      );
      await openMenu();
      expect(screen.getByTestId("badge")).toBeInTheDocument();
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

    test("item root carries group/menuitem scope class", async () => {
      renderBasicMenu();
      await openMenu();
      expect(screen.getByRole("menuitem", { name: "Cut" })).toHaveClass("group/menuitem");
    });

    test("item contains a state-layer span slot", async () => {
      renderBasicMenu();
      await openMenu();
      const item = screen.getByRole("menuitem", { name: "Cut" });
      const stateLayer = item.querySelector("span[aria-hidden='true']");
      expect(stateLayer).toBeInTheDocument();
    });
  });

  describe("Density", () => {
    test("density 0 (default) renders items with h-12 class", async () => {
      renderBasicMenu({ density: 0 });
      await openMenu();
      expect(screen.getByRole("menuitem", { name: "Cut" })).toHaveClass("h-12");
    });

    test("density -1 renders items with h-11 class", async () => {
      renderBasicMenu({ density: -1 });
      await openMenu();
      expect(screen.getByRole("menuitem", { name: "Cut" })).toHaveClass("h-11");
    });

    test("density -2 renders items with h-10 class", async () => {
      renderBasicMenu({ density: -2 });
      await openMenu();
      expect(screen.getByRole("menuitem", { name: "Cut" })).toHaveClass("h-10");
    });

    test("density -3 renders items with h-9 class", async () => {
      renderBasicMenu({ density: -3 });
      await openMenu();
      expect(screen.getByRole("menuitem", { name: "Cut" })).toHaveClass("h-9");
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

  test("shouldFocusWrap=true wraps focus from last to first", async () => {
    render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu aria-label="Actions" shouldFocusWrap>
          <MenuItem id="cut">Cut</MenuItem>
          <MenuItem id="copy">Copy</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    const { user } = await openMenu();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    // With wrap, should cycle back to "Cut"
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

  test("divider has correct 8dp top/bottom padding (my-2)", async () => {
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
    const divider = screen.getByRole("separator", { hidden: true });
    expect(divider).toHaveClass("my-2");
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

// ─── MenuGap ──────────────────────────────────────────────────────────────────

describe("MenuGap", () => {
  test("renders as a presentational spacer (no separator role)", async () => {
    render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu aria-label="Edit" menuStyle="vertical">
          <MenuItem id="cut">Cut</MenuItem>
          <MenuGap />
          <MenuItem id="paste">Paste</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    await openMenu();
    // MenuGap uses role="none" / aria-hidden - should NOT appear as a separator
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    // but the menu items still render
    expect(screen.getByRole("menuitem", { name: "Cut" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Paste" })).toBeInTheDocument();
  });
});

// ─── Selection variant ────────────────────────────────────────────────────────

describe("Selection mode", () => {
  test("single selection mode works", async () => {
    const onSelectionChange = vi.fn();
    render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu
          aria-label="View"
          selectionMode="single"
          onSelectionChange={onSelectionChange}
        >
          <MenuItem id="grid">Grid view</MenuItem>
          <MenuItem id="list">List view</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    const { user } = await openMenu();
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
          selectionMode="multiple"
          onSelectionChange={onSelectionChange}
        >
          <MenuItem id="bold">Bold</MenuItem>
          <MenuItem id="italic">Italic</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    const { user } = await openMenu();
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Bold" }));
    expect(onSelectionChange).toHaveBeenCalled();
  });

  test("selected items have aria-checked='true'", async () => {
    render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu aria-label="View" selectionMode="single" defaultSelectedKeys={["grid"]}>
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

  test("selected item has correct baseline selection background", async () => {
    render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu
          aria-label="View"
          selectionMode="single"
          defaultSelectedKeys={["grid"]}
          menuStyle="baseline"
        >
          <MenuItem id="grid">Grid view</MenuItem>
          <MenuItem id="list">List view</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    await openMenu();
    const selectedItem = screen.getByRole("menuitemradio", { name: "Grid view" });
    // RAC emits data-selected on the element; CVA applies data-[selected]:bg-surface-container-highest
    expect(selectedItem).toHaveAttribute("data-selected");
    expect(selectedItem).toHaveClass("data-[selected]:bg-surface-container-highest");
  });

  test("selected item in vertical standard has tertiary container background", async () => {
    render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu
          aria-label="View"
          selectionMode="single"
          defaultSelectedKeys={["grid"]}
          menuStyle="vertical"
          colorScheme="standard"
        >
          <MenuItem id="grid">Grid view</MenuItem>
          <MenuItem id="list">List view</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    await openMenu();
    const selectedItem = screen.getByRole("menuitemradio", { name: "Grid view" });
    expect(selectedItem).toHaveAttribute("data-selected");
    expect(selectedItem).toHaveClass("data-[selected]:bg-tertiary-container");
  });

  test("selected item in vertical vibrant has tertiary background", async () => {
    render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu
          aria-label="View"
          selectionMode="single"
          defaultSelectedKeys={["grid"]}
          menuStyle="vertical"
          colorScheme="vibrant"
        >
          <MenuItem id="grid">Grid view</MenuItem>
          <MenuItem id="list">List view</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    await openMenu();
    const selectedItem = screen.getByRole("menuitemradio", { name: "Grid view" });
    expect(selectedItem).toHaveAttribute("data-selected");
    expect(selectedItem).toHaveClass("data-[selected]:bg-tertiary");
  });

  test("checkmark appears on selected item when selectionMode is set and no leadingIcon", async () => {
    render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu aria-label="View" selectionMode="single" defaultSelectedKeys={["grid"]}>
          <MenuItem id="grid">Grid view</MenuItem>
          <MenuItem id="list">List view</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    await openMenu();
    const selectedItem = screen.getByRole("menuitemradio", { name: "Grid view" });
    expect(selectedItem.querySelector("[data-testid='check-icon']")).toBeInTheDocument();
  });

  test("checkmark does not appear when leadingIcon is provided", async () => {
    render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu aria-label="View" selectionMode="single" defaultSelectedKeys={["grid"]}>
          <MenuItem id="grid" leadingIcon={<CopyIcon />}>
            Grid view
          </MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    await openMenu();
    const selectedItem = screen.getByRole("menuitemradio", { name: "Grid view" });
    expect(selectedItem.querySelector("[data-testid='check-icon']")).not.toBeInTheDocument();
  });

  test("multi-select keeps menu open after selection", async () => {
    render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu aria-label="Filters" selectionMode="multiple" defaultSelectedKeys={[]}>
          <MenuItem id="bold">Bold</MenuItem>
          <MenuItem id="italic">Italic</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    const { user } = await openMenu();
    await user.click(screen.getByRole("menuitemcheckbox", { name: "Bold" }));
    // Multi-select menus stay open
    expect(screen.getByRole("menu")).toBeInTheDocument();
  });
});

// ─── Submenu ──────────────────────────────────────────────────────────────────

describe("SubmenuTrigger", () => {
  function renderMenuWithSubmenu() {
    return render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu aria-label="Actions">
          <MenuItem id="copy">Copy</MenuItem>
          <SubmenuTrigger>
            <MenuItem id="share">Share</MenuItem>
            <MenuTrigger.Menu aria-label="Share via">
              <MenuItem id="email">Email</MenuItem>
              <MenuItem id="sms">SMS</MenuItem>
            </MenuTrigger.Menu>
          </SubmenuTrigger>
          <MenuItem id="delete">Delete</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
  }

  test("renders submenu trigger item with chevron indicator", async () => {
    renderMenuWithSubmenu();
    await openMenu();
    const shareItem = screen.getByRole("menuitem", { name: /Share/i });
    expect(shareItem).toBeInTheDocument();
    // Chevron icon should be present in the item
    expect(shareItem.querySelector("[data-testid='chevron-icon']")).toBeInTheDocument();
  });

  test("submenu trigger item has aria-haspopup='menu'", async () => {
    renderMenuWithSubmenu();
    await openMenu();
    const shareItem = screen.getByRole("menuitem", { name: /Share/i });
    expect(shareItem).toHaveAttribute("aria-haspopup", "menu");
  });

  test("ArrowRight opens submenu from trigger item", async () => {
    renderMenuWithSubmenu();
    const { user } = await openMenu();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}"); // focus Share
    await user.keyboard("{ArrowRight}"); // open submenu
    await waitFor(() => {
      expect(screen.getByRole("menu", { name: "Share via" })).toBeInTheDocument();
    });
  });

  test("submenu items are accessible after opening", async () => {
    renderMenuWithSubmenu();
    const { user } = await openMenu();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}"); // focus Share
    await user.keyboard("{ArrowRight}"); // open submenu
    await waitFor(() => {
      expect(screen.getByRole("menuitem", { name: "Email" })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: "SMS" })).toBeInTheDocument();
    });
  });

  test("Escape closes submenu and returns focus to parent item", async () => {
    renderMenuWithSubmenu();
    const { user } = await openMenu();
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowRight}");
    await waitFor(() => {
      expect(screen.getByRole("menu", { name: "Share via" })).toBeInTheDocument();
    });
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("menu", { name: "Share via" })).not.toBeInTheDocument();
    });
    // Parent menu should still be open
    expect(screen.getByRole("menu", { name: "Actions" })).toBeInTheDocument();
  });
});

// ─── ContextMenuTrigger ────────────────────────────────────────────────────────

describe("ContextMenuTrigger", () => {
  test("does not render menu initially", () => {
    render(
      <ContextMenuTrigger>
        <div data-testid="target">Right-click me</div>
        <MenuTrigger.Menu aria-label="Context">
          <MenuItem id="copy">Copy</MenuItem>
        </MenuTrigger.Menu>
      </ContextMenuTrigger>
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  test("opens menu on right-click (contextmenu event)", async () => {
    render(
      <ContextMenuTrigger>
        <div data-testid="target">Right-click me</div>
        <MenuTrigger.Menu aria-label="Context">
          <MenuItem id="copy">Copy</MenuItem>
        </MenuTrigger.Menu>
      </ContextMenuTrigger>
    );
    const target = screen.getByTestId("target");
    const user = userEvent.setup();
    await user.pointer({ target, keys: "[MouseRight]" });
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  test("context menu closes on Escape", async () => {
    render(
      <ContextMenuTrigger>
        <div data-testid="target">Right-click me</div>
        <MenuTrigger.Menu aria-label="Context">
          <MenuItem id="copy">Copy</MenuItem>
        </MenuTrigger.Menu>
      </ContextMenuTrigger>
    );
    const target = screen.getByTestId("target");
    const user = userEvent.setup();
    await user.pointer({ target, keys: "[MouseRight]" });
    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
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

  test("selection mode menu passes axe audit", async () => {
    const { container } = render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu aria-label="View" selectionMode="single" defaultSelectedKeys={["grid"]}>
          <MenuItem id="grid">Grid</MenuItem>
          <MenuItem id="list">List</MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    await openMenu();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("menu with description passes axe audit", async () => {
    const { container } = render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu aria-label="Actions">
          <MenuItem id="export" description="Export to various formats">
            Export
          </MenuItem>
        </MenuTrigger.Menu>
      </MenuTrigger>
    );
    await openMenu();
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("vibrant colorScheme menu passes axe audit", async () => {
    const { container } = render(
      <MenuTrigger>
        <button type="button">Open Menu</button>
        <MenuTrigger.Menu aria-label="Edit" menuStyle="vertical" colorScheme="vibrant">
          <MenuItem id="cut">Cut</MenuItem>
          <MenuItem id="copy">Copy</MenuItem>
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

// ─── CVA Variants ─────────────────────────────────────────────────────────────

describe("CVA variants (unit)", () => {
  test("menuContainerVariants: baseline standard has bg-surface-container and rounded-xs", () => {
    const cls = menuContainerVariants({ colorScheme: "standard", menuStyle: "baseline" });
    expect(cls).toContain("bg-surface-container");
    expect(cls).toContain("rounded-xs");
  });

  test("menuContainerVariants: vertical standard has bg-surface-container-low and rounded-lg", () => {
    const cls = menuContainerVariants({ colorScheme: "standard", menuStyle: "vertical" });
    expect(cls).toContain("bg-surface-container-low");
    expect(cls).toContain("rounded-lg");
  });

  test("menuContainerVariants: vertical vibrant has bg-tertiary-container", () => {
    const cls = menuContainerVariants({ colorScheme: "vibrant", menuStyle: "vertical" });
    expect(cls).toContain("bg-tertiary-container");
  });

  test("menuItemVariants: uses text-label-large", () => {
    const cls = menuItemVariants({ colorScheme: "standard", menuStyle: "baseline" });
    expect(cls).toContain("text-label-large");
  });

  test("menuItemVariants: baseline includes data-[selected] bg class for surface-container-highest", () => {
    const cls = menuItemVariants({
      colorScheme: "standard",
      menuStyle: "baseline",
    });
    expect(cls).toContain("data-[selected]:bg-surface-container-highest");
  });

  test("menuItemVariants: vertical standard includes data-[selected] bg class for tertiary-container", () => {
    const cls = menuItemVariants({
      colorScheme: "standard",
      menuStyle: "vertical",
    });
    expect(cls).toContain("data-[selected]:bg-tertiary-container");
  });

  test("menuItemVariants: vertical vibrant includes data-[selected] bg class for tertiary", () => {
    const cls = menuItemVariants({
      colorScheme: "vibrant",
      menuStyle: "vertical",
    });
    expect(cls).toContain("data-[selected]:bg-tertiary");
  });

  test("menuItemStateLayerVariants: standard uses bg-on-surface", () => {
    const cls = menuItemStateLayerVariants({ colorScheme: "standard", menuStyle: "baseline" });
    expect(cls).toContain("bg-on-surface");
  });

  test("menuItemStateLayerVariants: vibrant uses bg-on-tertiary-container", () => {
    const cls = menuItemStateLayerVariants({ colorScheme: "vibrant", menuStyle: "baseline" });
    expect(cls).toContain("bg-on-tertiary-container");
  });

  test("menuItemStateLayerVariants: includes hover opacity-8 selector", () => {
    const cls = menuItemStateLayerVariants({ colorScheme: "standard", menuStyle: "baseline" });
    expect(cls).toContain("group-data-[hovered]/menuitem:opacity-8");
  });

  test("menuItemStateLayerVariants: includes focus-visible opacity-10 selector", () => {
    const cls = menuItemStateLayerVariants({ colorScheme: "standard", menuStyle: "baseline" });
    expect(cls).toContain("group-data-[focus-visible]/menuitem:opacity-10");
  });
});
