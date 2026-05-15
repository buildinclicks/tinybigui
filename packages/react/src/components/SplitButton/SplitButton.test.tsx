import { describe, test, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { createRef } from "react";
import { SplitButtonHeadless } from "./SplitButtonHeadless";
import { SplitButton } from "./SplitButton";
import type { SplitButtonMenuItem } from "./SplitButton.types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const defaultItems: SplitButtonMenuItem[] = [
  { label: "Save as PDF", onAction: vi.fn() },
  { label: "Save as PNG", onAction: vi.fn() },
  { label: "Save as SVG", onAction: vi.fn(), isDisabled: true },
];

function renderSplitButton(props: Partial<React.ComponentProps<typeof SplitButtonHeadless>> = {}) {
  const defaultProps = {
    primaryLabel: "Save",
    onPrimaryAction: vi.fn(),
    items: defaultItems,
  };

  return render(<SplitButtonHeadless {...defaultProps} {...props} />);
}

// ─── SplitButtonHeadless ──────────────────────────────────────────────────────

describe("SplitButtonHeadless", () => {
  describe("Rendering", () => {
    // Test 1: Renders primary segment with primaryLabel text
    test("renders primary segment with primaryLabel text", () => {
      renderSplitButton({ primaryLabel: "Save" });
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    // Test 2: Renders dropdown trigger segment with expand icon
    test("renders dropdown trigger segment with expand icon", () => {
      renderSplitButton();
      const buttons = screen.getAllByRole("button");
      const dropdownTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu");
      expect(dropdownTrigger).toBeInTheDocument();
      expect(dropdownTrigger?.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Primary Segment Interactions", () => {
    // Test 3: Primary segment fires onPrimaryAction on click
    test("fires onPrimaryAction on click", async () => {
      const user = userEvent.setup();
      const onPrimaryAction = vi.fn();
      renderSplitButton({ onPrimaryAction });

      const primaryButton = screen.getByRole("button", { name: "Save" });
      await user.click(primaryButton);

      expect(onPrimaryAction).toHaveBeenCalledTimes(1);
    });

    // Test 4: Primary segment fires onPrimaryAction on Enter key
    test("fires onPrimaryAction on Enter key", async () => {
      const user = userEvent.setup();
      const onPrimaryAction = vi.fn();
      renderSplitButton({ onPrimaryAction });

      const primaryButton = screen.getByRole("button", { name: "Save" });
      primaryButton.focus();
      await user.keyboard("{Enter}");

      expect(onPrimaryAction).toHaveBeenCalledTimes(1);
    });

    // Test 5: Primary segment fires onPrimaryAction on Space key
    test("fires onPrimaryAction on Space key", async () => {
      const user = userEvent.setup();
      const onPrimaryAction = vi.fn();
      renderSplitButton({ onPrimaryAction });

      const primaryButton = screen.getByRole("button", { name: "Save" });
      primaryButton.focus();
      await user.keyboard(" ");

      expect(onPrimaryAction).toHaveBeenCalledTimes(1);
    });

    // Test 6: Primary segment does NOT fire when isDisabled={true}
    test("does NOT fire onPrimaryAction when isDisabled", async () => {
      const user = userEvent.setup();
      const onPrimaryAction = vi.fn();
      renderSplitButton({ onPrimaryAction, isDisabled: true });

      const primaryButton = screen.getByRole("button", { name: "Save" });
      await user.click(primaryButton);

      expect(onPrimaryAction).not.toHaveBeenCalled();
    });
  });

  describe("Dropdown Trigger Interactions", () => {
    // Test 7: Dropdown trigger opens menu on click
    test("opens menu on click", async () => {
      const user = userEvent.setup();
      renderSplitButton();

      const buttons = screen.getAllByRole("button");
      const dropdownTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu")!;

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      await user.click(dropdownTrigger);

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    // Test 8: Dropdown trigger opens menu on Enter key
    test("opens menu on Enter key", async () => {
      const user = userEvent.setup();
      renderSplitButton();

      const buttons = screen.getAllByRole("button");
      const dropdownTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu")!;

      dropdownTrigger.focus();
      await user.keyboard("{Enter}");

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  describe("Accessibility — ARIA Attributes", () => {
    // Test 9: Dropdown trigger has aria-haspopup="menu"
    test("dropdown trigger has aria-haspopup='menu'", () => {
      renderSplitButton();
      const buttons = screen.getAllByRole("button");
      const dropdownTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu");
      expect(dropdownTrigger).toHaveAttribute("aria-haspopup", "menu");
    });

    // Test 10: Dropdown trigger has aria-expanded="false" when menu closed
    test("dropdown trigger has aria-expanded='false' when menu closed", () => {
      renderSplitButton();
      const buttons = screen.getAllByRole("button");
      const dropdownTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu");
      expect(dropdownTrigger).toHaveAttribute("aria-expanded", "false");
    });

    // Test 11: Dropdown trigger has aria-expanded="true" when menu open
    test("dropdown trigger has aria-expanded='true' when menu open", async () => {
      const user = userEvent.setup();
      renderSplitButton();

      const buttons = screen.getAllByRole("button");
      const dropdownTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu")!;

      await user.click(dropdownTrigger);

      expect(dropdownTrigger).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("Menu Interactions", () => {
    // Test 12: Escape key closes the open menu
    test("Escape key closes the open menu", async () => {
      const user = userEvent.setup();
      renderSplitButton();

      const buttons = screen.getAllByRole("button");
      const dropdownTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu")!;

      await user.click(dropdownTrigger);
      expect(screen.getByRole("menu")).toBeInTheDocument();

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });

    // Test 13: Menu item onAction fires when menu item is selected
    test("menu item onAction fires when selected", async () => {
      const user = userEvent.setup();
      const onAction = vi.fn();
      const items: SplitButtonMenuItem[] = [
        { label: "Export PDF", onAction },
        { label: "Export PNG", onAction: vi.fn() },
      ];
      renderSplitButton({ items });

      const buttons = screen.getAllByRole("button");
      const dropdownTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu")!;

      await user.click(dropdownTrigger);

      const menuItem = screen.getByRole("menuitem", { name: "Export PDF" });
      await user.click(menuItem);

      expect(onAction).toHaveBeenCalledTimes(1);
    });
  });

  describe("Keyboard Navigation", () => {
    // Test 14: Both segments are independently focusable (Tab navigation)
    test("both segments are independently focusable via Tab", async () => {
      const user = userEvent.setup();
      renderSplitButton();

      const buttons = screen.getAllByRole("button");
      const primaryButton = screen.getByRole("button", { name: "Save" });
      const dropdownTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu")!;

      await user.tab();
      expect(primaryButton).toHaveFocus();

      await user.tab();
      expect(dropdownTrigger).toHaveFocus();
    });
  });

  describe("Disabled State", () => {
    // Test 15: isDisabled prop disables both segments
    test("isDisabled disables both segments", () => {
      renderSplitButton({ isDisabled: true });

      const buttons = screen.getAllByRole("button");
      for (const button of buttons) {
        expect(button).toBeDisabled();
      }
    });
  });

  describe("Ref Forwarding", () => {
    // Test 16: forwardRef attached to root element
    test("forwardRef is attached to root element", () => {
      const ref = createRef<HTMLDivElement>();
      render(
        <SplitButtonHeadless
          ref={ref}
          primaryLabel="Save"
          onPrimaryAction={vi.fn()}
          items={defaultItems}
        />
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current?.getAttribute("role")).toBe("group");
    });
  });

  describe("Accessibility — axe", () => {
    // Test 17: axe check — closed state, no violations
    test("no axe violations in closed state", async () => {
      const { container } = renderSplitButton();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    // Test 18: axe check — open state with menu, no violations
    test("no axe violations in open state with menu", async () => {
      const user = userEvent.setup();
      const { container } = renderSplitButton();

      const buttons = screen.getAllByRole("button");
      const dropdownTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu")!;

      await user.click(dropdownTrigger);
      expect(screen.getByRole("menu")).toBeInTheDocument();

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

// ─── SplitButton (Styled Layer 3) ────────────────────────────────────────────

const styledDefaultItems: SplitButtonMenuItem[] = [
  { label: "Save as PDF", onAction: vi.fn() },
  { label: "Save as PNG", onAction: vi.fn() },
];

function renderStyledSplitButton(props: Partial<React.ComponentProps<typeof SplitButton>> = {}) {
  const defaultProps = {
    primaryLabel: "Save",
    onPrimaryAction: vi.fn(),
    items: styledDefaultItems,
  };

  return render(<SplitButton {...defaultProps} {...props} />);
}

describe("SplitButton (Styled)", () => {
  describe("Variant Classes", () => {
    // Test 19: variant="filled" applies bg-primary class to container
    test('variant="filled" applies bg-primary class to container', () => {
      renderStyledSplitButton({ variant: "filled" });
      const container = screen.getByRole("group");
      expect(container).toHaveClass("bg-primary");
    });

    // Test 20: variant="tonal" applies bg-secondary-container class
    test('variant="tonal" applies bg-secondary-container class', () => {
      renderStyledSplitButton({ variant: "tonal" });
      const container = screen.getByRole("group");
      expect(container).toHaveClass("bg-secondary-container");
    });

    // Test 21: variant="outlined" applies border border-outline class
    test('variant="outlined" applies border border-outline class', () => {
      renderStyledSplitButton({ variant: "outlined" });
      const container = screen.getByRole("group");
      expect(container).toHaveClass("border");
      expect(container).toHaveClass("border-outline");
    });
  });

  describe("Visual Divider", () => {
    // Test 22: Visual divider present between segments
    test("visual divider present between segments", () => {
      renderStyledSplitButton();
      const divider = screen.getByTestId("split-button-divider");
      expect(divider).toBeInTheDocument();
    });
  });

  describe("Chevron Icon", () => {
    // Test 23: Dropdown trigger shows chevron icon
    test("dropdown trigger shows chevron icon", () => {
      renderStyledSplitButton();
      const chevron = screen.getByTestId("split-button-chevron");
      expect(chevron).toBeInTheDocument();
    });

    // Test 24: Chevron rotates when menu is open
    test("chevron rotates when menu is open", async () => {
      const user = userEvent.setup();
      renderStyledSplitButton();

      const chevron = screen.getByTestId("split-button-chevron");
      expect(chevron).not.toHaveClass("rotate-180");

      const buttons = screen.getAllByRole("button");
      const dropdownTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu")!;
      await user.click(dropdownTrigger);

      expect(chevron).toHaveClass("rotate-180");
    });
  });

  describe("State Layers", () => {
    // Test 25: State layer present inside primary segment
    test("state layer present inside primary segment", () => {
      renderStyledSplitButton();
      const stateLayer = screen.getByTestId("primary-state-layer");
      expect(stateLayer).toBeInTheDocument();
      expect(stateLayer).toHaveClass("pointer-events-none");
      expect(stateLayer).toHaveClass("absolute");
      expect(stateLayer).toHaveClass("inset-0");
    });

    // Test 26: State layer present inside dropdown trigger
    test("state layer present inside dropdown trigger", () => {
      renderStyledSplitButton();
      const stateLayer = screen.getByTestId("dropdown-state-layer");
      expect(stateLayer).toBeInTheDocument();
      expect(stateLayer).toHaveClass("pointer-events-none");
      expect(stateLayer).toHaveClass("absolute");
      expect(stateLayer).toHaveClass("inset-0");
    });
  });

  describe("Menu Integration", () => {
    // Test 27: Menu renders when dropdown is clicked (menu items visible)
    test("menu renders when dropdown is clicked", async () => {
      const user = userEvent.setup();
      renderStyledSplitButton();

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();

      const buttons = screen.getAllByRole("button");
      const dropdownTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu")!;
      await user.click(dropdownTrigger);

      expect(screen.getByRole("menu")).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: "Save as PDF" })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: "Save as PNG" })).toBeInTheDocument();
    });

    // Test 28: Menu closes after menu item is selected
    test("menu closes after menu item is selected", async () => {
      const user = userEvent.setup();
      const onAction = vi.fn();
      const items: SplitButtonMenuItem[] = [
        { label: "Export PDF", onAction },
        { label: "Export PNG", onAction: vi.fn() },
      ];
      renderStyledSplitButton({ items });

      const buttons = screen.getAllByRole("button");
      const dropdownTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu")!;
      await user.click(dropdownTrigger);

      const menuItem = screen.getByRole("menuitem", { name: "Export PDF" });
      await user.click(menuItem);

      expect(onAction).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });
  });
});
