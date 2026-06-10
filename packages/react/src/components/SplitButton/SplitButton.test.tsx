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
    // Test 1: Renders leading segment with primaryLabel text
    test("renders leading segment with primaryLabel text", () => {
      renderSplitButton({ primaryLabel: "Save" });
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
    });

    // Test 2: Renders trailing trigger segment with expand icon
    test("renders trailing trigger segment with expand icon", () => {
      renderSplitButton();
      const buttons = screen.getAllByRole("button");
      const trailingTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu");
      expect(trailingTrigger).toBeInTheDocument();
      expect(trailingTrigger?.querySelector("svg")).toBeInTheDocument();
    });
  });

  describe("Leading Segment Interactions", () => {
    // Test 3: Leading segment fires onPrimaryAction on click
    test("fires onPrimaryAction on click", async () => {
      const user = userEvent.setup();
      const onPrimaryAction = vi.fn();
      renderSplitButton({ onPrimaryAction });

      const primaryButton = screen.getByRole("button", { name: "Save" });
      await user.click(primaryButton);

      expect(onPrimaryAction).toHaveBeenCalledTimes(1);
    });

    // Test 4: Leading segment fires onPrimaryAction on Enter key
    test("fires onPrimaryAction on Enter key", async () => {
      const user = userEvent.setup();
      const onPrimaryAction = vi.fn();
      renderSplitButton({ onPrimaryAction });

      const primaryButton = screen.getByRole("button", { name: "Save" });
      primaryButton.focus();
      await user.keyboard("{Enter}");

      expect(onPrimaryAction).toHaveBeenCalledTimes(1);
    });

    // Test 5: Leading segment fires onPrimaryAction on Space key
    test("fires onPrimaryAction on Space key", async () => {
      const user = userEvent.setup();
      const onPrimaryAction = vi.fn();
      renderSplitButton({ onPrimaryAction });

      const primaryButton = screen.getByRole("button", { name: "Save" });
      primaryButton.focus();
      await user.keyboard(" ");

      expect(onPrimaryAction).toHaveBeenCalledTimes(1);
    });

    // Test 6: Leading segment does NOT fire when isDisabled={true}
    test("does NOT fire onPrimaryAction when isDisabled", async () => {
      const user = userEvent.setup();
      const onPrimaryAction = vi.fn();
      renderSplitButton({ onPrimaryAction, isDisabled: true });

      const primaryButton = screen.getByRole("button", { name: "Save" });
      await user.click(primaryButton);

      expect(onPrimaryAction).not.toHaveBeenCalled();
    });
  });

  describe("Trailing Trigger Interactions", () => {
    // Test 7: Trailing trigger opens menu on click
    test("opens menu on click", async () => {
      const user = userEvent.setup();
      renderSplitButton();

      const buttons = screen.getAllByRole("button");
      const trailingTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu")!;

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      await user.click(trailingTrigger);

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    // Test 8: Trailing trigger opens menu on Enter key
    test("opens menu on Enter key", async () => {
      const user = userEvent.setup();
      renderSplitButton();

      const buttons = screen.getAllByRole("button");
      const trailingTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu")!;

      trailingTrigger.focus();
      await user.keyboard("{Enter}");

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });
  });

  describe("Accessibility — ARIA Attributes", () => {
    // Test 9: Trailing trigger has aria-haspopup="menu"
    test("trailing trigger has aria-haspopup='menu'", () => {
      renderSplitButton();
      const buttons = screen.getAllByRole("button");
      const trailingTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu");
      expect(trailingTrigger).toHaveAttribute("aria-haspopup", "menu");
    });

    // Test 10: Trailing trigger has aria-expanded="false" when menu closed
    test("trailing trigger has aria-expanded='false' when menu closed", () => {
      renderSplitButton();
      const buttons = screen.getAllByRole("button");
      const trailingTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu");
      expect(trailingTrigger).toHaveAttribute("aria-expanded", "false");
    });

    // Test 11: Trailing trigger has aria-expanded="true" when menu open
    test("trailing trigger has aria-expanded='true' when menu open", async () => {
      const user = userEvent.setup();
      renderSplitButton();

      const buttons = screen.getAllByRole("button");
      const trailingTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu")!;

      await user.click(trailingTrigger);

      expect(trailingTrigger).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("Menu Interactions", () => {
    // Test 12: Escape key closes the open menu
    test("Escape key closes the open menu", async () => {
      const user = userEvent.setup();
      renderSplitButton();

      const buttons = screen.getAllByRole("button");
      const trailingTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu")!;

      await user.click(trailingTrigger);
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
      const trailingTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu")!;

      await user.click(trailingTrigger);

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
      const trailingTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu")!;

      await user.tab();
      expect(primaryButton).toHaveFocus();

      await user.tab();
      expect(trailingTrigger).toHaveFocus();
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
    // Test 16: forwardRef attached to root group element
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
      const trailingTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu")!;

      await user.click(trailingTrigger);
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
    // Test 19: variant="filled" applies bg-primary on both segments
    test('variant="filled" applies bg-primary to leading segment', () => {
      renderStyledSplitButton({ variant: "filled" });
      const buttons = screen.getAllByRole("button");
      const leading = buttons.find((b) => b.getAttribute("aria-haspopup") !== "menu");
      expect(leading).toHaveClass("bg-primary");
    });

    // Test 20: variant="tonal" applies bg-secondary-container
    test('variant="tonal" applies bg-secondary-container to leading segment', () => {
      renderStyledSplitButton({ variant: "tonal" });
      const buttons = screen.getAllByRole("button");
      const leading = buttons.find((b) => b.getAttribute("aria-haspopup") !== "menu");
      expect(leading).toHaveClass("bg-secondary-container");
    });

    // Test 21: variant="outlined" applies border border-outline
    test('variant="outlined" applies border border-outline to leading segment', () => {
      renderStyledSplitButton({ variant: "outlined" });
      const buttons = screen.getAllByRole("button");
      const leading = buttons.find((b) => b.getAttribute("aria-haspopup") !== "menu");
      expect(leading).toHaveClass("border");
      expect(leading).toHaveClass("border-outline");
    });

    // Test 22: variant="elevated" applies bg-surface-container-low and shadow-elevation-1
    test('variant="elevated" applies bg-surface-container-low and shadow-elevation-1', () => {
      renderStyledSplitButton({ variant: "elevated" });
      const buttons = screen.getAllByRole("button");
      const leading = buttons.find((b) => b.getAttribute("aria-haspopup") !== "menu");
      expect(leading).toHaveClass("bg-surface-container-low");
      expect(leading).toHaveClass("shadow-elevation-1");
    });
  });

  describe("Size Classes", () => {
    // Test 23: size="xs" applies h-8
    test('size="xs" applies h-8 to both segments', () => {
      renderStyledSplitButton({ size: "xs" });
      const buttons = screen.getAllByRole("button");
      for (const btn of buttons) {
        expect(btn).toHaveClass("h-8");
      }
    });

    // Test 24: size="sm" applies h-10
    test('size="sm" applies h-10 to both segments', () => {
      renderStyledSplitButton({ size: "sm" });
      const buttons = screen.getAllByRole("button");
      for (const btn of buttons) {
        expect(btn).toHaveClass("h-10");
      }
    });

    // Test 25: size="md" applies h-14
    test('size="md" applies h-14 to both segments', () => {
      renderStyledSplitButton({ size: "md" });
      const buttons = screen.getAllByRole("button");
      for (const btn of buttons) {
        expect(btn).toHaveClass("h-14");
      }
    });
  });

  describe("Chevron Icon", () => {
    // Test 26: Trailing trigger shows chevron icon
    test("trailing trigger shows chevron icon", () => {
      renderStyledSplitButton();
      const chevron = screen.getByTestId("split-button-chevron");
      expect(chevron).toBeInTheDocument();
    });

    // Test 27: Chevron rotates when menu is open
    test("chevron rotates when menu is open", async () => {
      const user = userEvent.setup();
      renderStyledSplitButton();

      const chevron = screen.getByTestId("split-button-chevron");
      expect(chevron).not.toHaveClass("rotate-180");

      const buttons = screen.getAllByRole("button");
      const trailingTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu")!;
      await user.click(trailingTrigger);

      expect(chevron).toHaveClass("rotate-180");
    });
  });

  describe("State Layers", () => {
    // Test 28: State layer present inside leading segment
    test("state layer present inside leading segment", () => {
      renderStyledSplitButton();
      const stateLayer = screen.getByTestId("primary-state-layer");
      expect(stateLayer).toBeInTheDocument();
      expect(stateLayer).toHaveClass("pointer-events-none");
      expect(stateLayer).toHaveClass("absolute");
      expect(stateLayer).toHaveClass("inset-0");
    });

    // Test 29: State layer present inside trailing trigger
    test("state layer present inside trailing trigger", () => {
      renderStyledSplitButton();
      const stateLayer = screen.getByTestId("dropdown-state-layer");
      expect(stateLayer).toBeInTheDocument();
      expect(stateLayer).toHaveClass("pointer-events-none");
      expect(stateLayer).toHaveClass("absolute");
      expect(stateLayer).toHaveClass("inset-0");
    });
  });

  describe("Interaction Data Attributes", () => {
    // Test 30: Leading segment gets data-disabled when isDisabled
    test("leading segment gets data-disabled when isDisabled", () => {
      renderStyledSplitButton({ isDisabled: true });
      const buttons = screen.getAllByRole("button");
      const leading = buttons.find((b) => b.getAttribute("aria-haspopup") !== "menu");
      expect(leading).toHaveAttribute("data-disabled");
    });

    // Test 31: Trailing segment gets data-disabled when isDisabled
    test("trailing segment gets data-disabled when isDisabled", () => {
      renderStyledSplitButton({ isDisabled: true });
      const buttons = screen.getAllByRole("button");
      const trailing = buttons.find((b) => b.getAttribute("aria-haspopup") === "menu");
      expect(trailing).toHaveAttribute("data-disabled");
    });

    // Test 32: Trailing segment gets data-selected when menu is open
    test("trailing segment gets data-selected when menu is open", async () => {
      const user = userEvent.setup();
      renderStyledSplitButton();

      const buttons = screen.getAllByRole("button");
      const trailing = buttons.find((b) => b.getAttribute("aria-haspopup") === "menu")!;

      expect(trailing).not.toHaveAttribute("data-selected");
      await user.click(trailing);
      expect(trailing).toHaveAttribute("data-selected");
    });
  });

  describe("2dp Gap — No Divider Element", () => {
    // Test 33: Container has gap-0.5 (2dp gap) instead of a border-l divider
    test("container applies gap-0.5 layout", () => {
      renderStyledSplitButton();
      const group = screen.getByRole("group");
      expect(group).toHaveClass("gap-0.5");
    });
  });

  describe("Menu Integration", () => {
    // Test 34: Menu renders when trailing trigger is clicked
    test("menu renders when trailing trigger is clicked", async () => {
      const user = userEvent.setup();
      renderStyledSplitButton();

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();

      const buttons = screen.getAllByRole("button");
      const trailingTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu")!;
      await user.click(trailingTrigger);

      expect(screen.getByRole("menu")).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: "Save as PDF" })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: "Save as PNG" })).toBeInTheDocument();
    });

    // Test 35: Menu closes after menu item is selected
    test("menu closes after menu item is selected", async () => {
      const user = userEvent.setup();
      const onAction = vi.fn();
      const items: SplitButtonMenuItem[] = [
        { label: "Export PDF", onAction },
        { label: "Export PNG", onAction: vi.fn() },
      ];
      renderStyledSplitButton({ items });

      const buttons = screen.getAllByRole("button");
      const trailingTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu")!;
      await user.click(trailingTrigger);

      const menuItem = screen.getByRole("menuitem", { name: "Export PDF" });
      await user.click(menuItem);

      expect(onAction).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      });
    });
  });

  describe("Accessibility — axe (Styled)", () => {
    // Test 36: No axe violations in closed state (styled)
    test("no axe violations in closed state", async () => {
      const { container } = renderStyledSplitButton();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    // Test 37: No axe violations in open state (styled)
    test("no axe violations with menu open", async () => {
      const user = userEvent.setup();
      const { container } = renderStyledSplitButton();

      const buttons = screen.getAllByRole("button");
      const trailingTrigger = buttons.find((btn) => btn.getAttribute("aria-haspopup") === "menu")!;
      await user.click(trailingTrigger);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
