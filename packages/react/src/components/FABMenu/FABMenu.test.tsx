/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { axe } from "vitest-axe";
import React, { useContext } from "react";
import { FABMenuHeadless, FABMenuContext } from "./FABMenuHeadless";
import { FABMenu } from "./FABMenu";
import { FABMenuItem } from "./FABMenuItem";
import type { FABMenuContextValue } from "./FABMenu.types";

const IconAdd = (): React.ReactElement => <svg data-testid="icon-add" aria-hidden="true" />;
const IconEdit = (): React.ReactElement => <svg data-testid="icon-edit" aria-hidden="true" />;

/**
 * Helper: renders a FABMenuHeadless with action item children.
 * Each child is a simple button acting as a FABMenuItem placeholder.
 */
function renderWithItems(
  props: Partial<React.ComponentProps<typeof FABMenuHeadless>> = {}
): ReturnType<typeof render> {
  return render(
    <FABMenuHeadless aria-label="Quick actions" {...props}>
      <button type="button" aria-label="Edit">
        <IconEdit />
      </button>
      <button type="button" aria-label="Add">
        <IconAdd />
      </button>
    </FABMenuHeadless>
  );
}

/**
 * Helper that reads FABMenuContext and exposes values via data attributes.
 */
function ContextReader(): React.ReactElement {
  const ctx = useContext<FABMenuContextValue>(FABMenuContext);
  return (
    <span
      data-testid="ctx-reader"
      data-is-open={String(ctx.isOpen)}
      data-direction={ctx.direction}
      data-reduced-motion={String(ctx.reducedMotion)}
    />
  );
}

describe("FABMenuHeadless", () => {
  describe("Rendering", () => {
    test("1. renders closed by default (uncontrolled)", () => {
      renderWithItems();

      const trigger = screen.getByRole("button", { name: "Quick actions" });
      expect(trigger).toBeInTheDocument();
      expect(screen.queryByRole("group")).not.toBeInTheDocument();
    });

    test("2. opens when trigger is clicked (uncontrolled)", async () => {
      const user = userEvent.setup();
      renderWithItems();

      const trigger = screen.getByRole("button", { name: "Quick actions" });
      await user.click(trigger);

      expect(screen.getByRole("group")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    });

    test("3. closes when trigger is clicked while open (uncontrolled)", async () => {
      const user = userEvent.setup();
      renderWithItems();

      const trigger = screen.getByRole("button", { name: "Quick actions" });
      await user.click(trigger);
      expect(screen.getByRole("group")).toBeInTheDocument();

      await user.click(trigger);
      expect(screen.queryByRole("group")).not.toBeInTheDocument();
    });
  });

  describe("Callbacks", () => {
    test("4. calls onOpenChange(true) when opening", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      renderWithItems({ onOpenChange });

      const trigger = screen.getByRole("button", { name: "Quick actions" });
      await user.click(trigger);

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });

    test("5. calls onOpenChange(false) when closing", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      renderWithItems({ defaultOpen: true, onOpenChange });

      const trigger = screen.getByRole("button", { name: "Quick actions" });
      await user.click(trigger);

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Controlled", () => {
    test("6. stays closed when open={false} regardless of click", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();

      render(
        <FABMenuHeadless aria-label="Quick actions" open={false} onOpenChange={onOpenChange}>
          <button type="button" aria-label="Edit">
            <IconEdit />
          </button>
        </FABMenuHeadless>
      );

      const trigger = screen.getByRole("button", { name: "Quick actions" });
      await user.click(trigger);

      expect(onOpenChange).toHaveBeenCalledWith(true);
      expect(screen.queryByRole("group")).not.toBeInTheDocument();
    });
  });

  describe("Keyboard", () => {
    test("7. Escape key closes the menu when open", async () => {
      const user = userEvent.setup();
      renderWithItems({ defaultOpen: true });

      expect(screen.getByRole("group")).toBeInTheDocument();

      const trigger = screen.getByRole("button", { name: "Quick actions" });
      trigger.focus();
      await user.keyboard("{Escape}");

      expect(screen.queryByRole("group")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    test("8. trigger has aria-expanded='false' when closed", () => {
      renderWithItems();

      const trigger = screen.getByRole("button", { name: "Quick actions" });
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    test("9. trigger has aria-expanded='true' when open", async () => {
      const user = userEvent.setup();
      renderWithItems();

      const trigger = screen.getByRole("button", { name: "Quick actions" });
      await user.click(trigger);

      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    test("10. aria-label applied to trigger", () => {
      renderWithItems();

      const trigger = screen.getByRole("button", { name: "Quick actions" });
      expect(trigger).toHaveAttribute("aria-label", "Quick actions");
    });
  });

  describe("Direction", () => {
    test("11. direction='up' renders action items above trigger (flex-col-reverse)", async () => {
      const user = userEvent.setup();
      renderWithItems({ direction: "up" });

      const trigger = screen.getByRole("button", { name: "Quick actions" });
      await user.click(trigger);

      const root = trigger.parentElement;
      expect(root).toHaveClass("flex-col-reverse");
    });

    test("12. direction='left' renders action items to the left of trigger", async () => {
      const user = userEvent.setup();
      renderWithItems({ direction: "left" });

      const trigger = screen.getByRole("button", { name: "Quick actions" });
      await user.click(trigger);

      const root = trigger.parentElement;
      expect(root).toHaveClass("flex-row-reverse");
    });
  });

  describe("Ref & Context", () => {
    test("13. forwardRef: ref correctly attached to root element", () => {
      const ref = React.createRef<HTMLDivElement>();

      render(
        <FABMenuHeadless ref={ref} aria-label="Quick actions">
          <button type="button" aria-label="Item">
            item
          </button>
        </FABMenuHeadless>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    test("14. FABMenuContext provides isOpen to children", () => {
      render(
        <FABMenuHeadless aria-label="Quick actions" defaultOpen>
          <ContextReader />
        </FABMenuHeadless>
      );

      const reader = screen.getByTestId("ctx-reader");
      expect(reader).toHaveAttribute("data-is-open", "true");
    });
  });

  describe("Axe Accessibility", () => {
    test("15. axe check — closed state, no violations", async () => {
      const { container } = renderWithItems();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("16. axe check — open state with items, no violations", async () => {
      const user = userEvent.setup();
      const { container } = renderWithItems();

      const trigger = screen.getByRole("button", { name: "Quick actions" });
      await user.click(trigger);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});

describe("FABMenu (Styled)", () => {
  describe("Styled + Variants", () => {
    test("17. FABMenu renders the existing FAB component as trigger", () => {
      render(
        <FABMenu aria-label="Actions">
          <FABMenuItem icon={<IconAdd />} label="Add" />
        </FABMenu>
      );

      const trigger = screen.getByRole("button", { name: "Actions" });
      expect(trigger).toBeInTheDocument();
    });

    test("18. Action items hidden by default (not in DOM)", () => {
      const { container } = render(
        <FABMenu aria-label="Actions" defaultOpen={false}>
          <FABMenuItem icon={<IconAdd />} label="Add" />
        </FABMenu>
      );

      expect(container.querySelector("[role='group']")).not.toBeInTheDocument();
    });

    test("19. Action items visible when open", async () => {
      const user = userEvent.setup();
      render(
        <FABMenu aria-label="Actions">
          <FABMenuItem icon={<IconAdd />} label="Add" />
        </FABMenu>
      );

      const trigger = screen.getByRole("button", { name: "Actions" });
      await user.click(trigger);

      const group = screen.getByRole("group");
      expect(group).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
    });

    test("20. direction='up' — overlay (role=group) has flex-col-reverse and absolute", () => {
      render(
        <FABMenu aria-label="Actions" direction="up" defaultOpen>
          <FABMenuItem icon={<IconAdd />} label="Add" />
        </FABMenu>
      );

      const group = screen.getByRole("group");
      expect(group).toHaveClass("flex-col-reverse");
      expect(group).toHaveClass("absolute");
    });

    test("21. direction='left' — overlay (role=group) has flex-row-reverse and absolute", () => {
      render(
        <FABMenu aria-label="Actions" direction="left" defaultOpen>
          <FABMenuItem icon={<IconAdd />} label="Add" />
        </FABMenu>
      );

      const group = screen.getByRole("group");
      expect(group).toHaveClass("flex-row-reverse");
      expect(group).toHaveClass("absolute");
    });

    test("22b. root is relative; items overlay is absolute (FAB never shifts on open)", () => {
      render(
        <FABMenu aria-label="Actions" direction="up" defaultOpen>
          <FABMenuItem icon={<IconAdd />} label="Add" />
        </FABMenu>
      );

      const trigger = screen.getByRole("button", { name: "Actions" });
      const root = trigger.parentElement!;
      // Root collapses to FAB size — it is relative but NOT a flex-direction container
      expect(root).toHaveClass("relative");
      expect(root).not.toHaveClass("flex-col-reverse");
      expect(root).not.toHaveClass("flex-col");
      // The overlay is absolute, not the root
      const group = screen.getByRole("group");
      expect(group).toHaveClass("absolute");
    });
  });

  describe("Animation", () => {
    test("22. animate-md-scale-in applied to items when opening", async () => {
      const user = userEvent.setup();
      render(
        <FABMenu aria-label="Actions">
          <FABMenuItem icon={<IconAdd />} label="Add" />
        </FABMenu>
      );

      const trigger = screen.getByRole("button", { name: "Actions" });
      await user.click(trigger);

      const menuItem = screen.getByRole("button", { name: "Add" });
      expect(menuItem).toHaveClass("animate-md-scale-in");
    });

    test("23. animate-md-scale-out applied to items when closing (isExiting phase)", async () => {
      const user = userEvent.setup();
      render(
        <FABMenu aria-label="Actions" defaultOpen>
          <FABMenuItem icon={<IconAdd />} label="Add" />
        </FABMenu>
      );

      // Item is visible on mount (defaultOpen)
      expect(screen.getByRole("button", { name: "Add" })).toHaveClass("animate-md-scale-in");

      const trigger = screen.getByRole("button", { name: "Actions" });
      await user.click(trigger);

      const menuItem = screen.getByRole("button", { name: "Add" });
      expect(menuItem).toHaveClass("animate-md-scale-out");
    });

    test("24. Stagger: second item has animation-delay greater than first", async () => {
      const user = userEvent.setup();
      render(
        <FABMenu aria-label="Actions">
          <FABMenuItem icon={<IconAdd />} label="First" />
          <FABMenuItem icon={<IconEdit />} label="Second" />
        </FABMenu>
      );

      const trigger = screen.getByRole("button", { name: "Actions" });
      await user.click(trigger);

      const firstItem = screen.getByRole("button", { name: "First" });
      const secondItem = screen.getByRole("button", { name: "Second" });

      const firstDelay = parseInt(firstItem.style.animationDelay || "0", 10);
      const secondDelay = parseInt(secondItem.style.animationDelay || "0", 10);

      expect(secondDelay).toBeGreaterThan(firstDelay);
    });
  });

  describe("FABMenuItem — Pill Shape", () => {
    test("25. FABMenuItem renders as a 56dp pill (h-14 + rounded-full)", async () => {
      const user = userEvent.setup();
      render(
        <FABMenu aria-label="Actions">
          <FABMenuItem icon={<IconAdd />} label="Add" />
        </FABMenu>
      );

      const trigger = screen.getByRole("button", { name: "Actions" });
      await user.click(trigger);

      const menuItem = screen.getByRole("button", { name: "Add" });
      expect(menuItem).toHaveClass("h-14");
      expect(menuItem).toHaveClass("rounded-full");
    });

    test("26. FABMenuItem label is rendered inline inside the button", async () => {
      const user = userEvent.setup();
      render(
        <FABMenu aria-label="Actions">
          <FABMenuItem icon={<IconAdd />} label="Create" />
        </FABMenu>
      );

      const trigger = screen.getByRole("button", { name: "Actions" });
      await user.click(trigger);

      const menuItem = screen.getByRole("button", { name: "Create" });
      // Label text lives inside the button, not as a sibling chip
      expect(menuItem).toContainHTML("Create");
    });

    test("27. FABMenuItem state layer present inside menu item", async () => {
      const user = userEvent.setup();
      render(
        <FABMenu aria-label="Actions">
          <FABMenuItem icon={<IconAdd />} label="Add" />
        </FABMenu>
      );

      const trigger = screen.getByRole("button", { name: "Actions" });
      await user.click(trigger);

      const menuItem = screen.getByRole("button", { name: "Add" });
      const stateLayer = menuItem.querySelector("[data-state-layer]");
      expect(stateLayer).toBeInTheDocument();
    });

    test("28. FABMenuItem focus ring slot present inside menu item", async () => {
      const user = userEvent.setup();
      render(
        <FABMenu aria-label="Actions">
          <FABMenuItem icon={<IconAdd />} label="Add" />
        </FABMenu>
      );

      const trigger = screen.getByRole("button", { name: "Actions" });
      await user.click(trigger);

      const menuItem = screen.getByRole("button", { name: "Add" });
      // Focus ring span has outline class
      const focusRing = menuItem.querySelector(".outline");
      expect(focusRing).toBeInTheDocument();
    });

    test("29. FABMenuItem with aria-label only (no label) renders accessibly", async () => {
      const user = userEvent.setup();
      render(
        <FABMenu aria-label="Actions">
          <FABMenuItem icon={<IconAdd />} aria-label="Add item" />
        </FABMenu>
      );

      const trigger = screen.getByRole("button", { name: "Actions" });
      await user.click(trigger);

      const menuItem = screen.getByRole("button", { name: "Add item" });
      expect(menuItem).toHaveAttribute("aria-label", "Add item");
    });
  });

  describe("FABMenuItem — Color Variants", () => {
    test("30. default color is primary-container (bg-primary-container)", async () => {
      const user = userEvent.setup();
      render(
        <FABMenu aria-label="Actions">
          <FABMenuItem icon={<IconAdd />} label="Add" />
        </FABMenu>
      );

      const trigger = screen.getByRole("button", { name: "Actions" });
      await user.click(trigger);

      const menuItem = screen.getByRole("button", { name: "Add" });
      expect(menuItem).toHaveClass("bg-primary-container");
    });

    test("31. color='secondary-container' applies secondary-container classes", async () => {
      const user = userEvent.setup();
      render(
        <FABMenu aria-label="Actions">
          <FABMenuItem icon={<IconAdd />} label="Add" color="secondary-container" />
        </FABMenu>
      );

      const trigger = screen.getByRole("button", { name: "Actions" });
      await user.click(trigger);

      const menuItem = screen.getByRole("button", { name: "Add" });
      expect(menuItem).toHaveClass("bg-secondary-container");
    });

    test("32. color='primary' (solid) applies primary background", async () => {
      const user = userEvent.setup();
      render(
        <FABMenu aria-label="Actions">
          <FABMenuItem icon={<IconAdd />} label="Add" color="primary" />
        </FABMenu>
      );

      const trigger = screen.getByRole("button", { name: "Actions" });
      await user.click(trigger);

      const menuItem = screen.getByRole("button", { name: "Add" });
      expect(menuItem).toHaveClass("bg-primary");
    });
  });

  describe("FABMenuItem — Disabled", () => {
    test("33. disabled menu item has data-disabled attribute", async () => {
      const user = userEvent.setup();
      render(
        <FABMenu aria-label="Actions">
          <FABMenuItem icon={<IconAdd />} label="Add" isDisabled />
        </FABMenu>
      );

      const trigger = screen.getByRole("button", { name: "Actions" });
      await user.click(trigger);

      const menuItem = screen.getByRole("button", { name: "Add" });
      expect(menuItem).toHaveAttribute("data-disabled", "");
    });

    test("34. disabled menu item state layer is hidden", async () => {
      const user = userEvent.setup();
      render(
        <FABMenu aria-label="Actions">
          <FABMenuItem icon={<IconAdd />} label="Add" isDisabled />
        </FABMenu>
      );

      const trigger = screen.getByRole("button", { name: "Actions" });
      await user.click(trigger);

      const menuItem = screen.getByRole("button", { name: "Add" });
      const stateLayer = menuItem.querySelector("[data-state-layer]");
      // State layer has group-data-[disabled]/fab-menu-item:hidden — class is present on element
      expect(stateLayer).toBeInTheDocument();
    });
  });

  describe("Keyboard — Arrow Navigation", () => {
    test("35. ArrowDown moves focus to next action item", async () => {
      const user = userEvent.setup();
      render(
        <FABMenu aria-label="Actions">
          <FABMenuItem icon={<IconAdd />} label="First" />
          <FABMenuItem icon={<IconEdit />} label="Second" />
        </FABMenu>
      );

      const trigger = screen.getByRole("button", { name: "Actions" });
      await user.click(trigger);

      const firstItem = screen.getByRole("button", { name: "First" });
      firstItem.focus();
      await user.keyboard("{ArrowDown}");

      expect(screen.getByRole("button", { name: "Second" })).toHaveFocus();
    });

    test("36. ArrowUp moves focus to previous action item", async () => {
      const user = userEvent.setup();
      render(
        <FABMenu aria-label="Actions">
          <FABMenuItem icon={<IconAdd />} label="First" />
          <FABMenuItem icon={<IconEdit />} label="Second" />
        </FABMenu>
      );

      const trigger = screen.getByRole("button", { name: "Actions" });
      await user.click(trigger);

      const secondItem = screen.getByRole("button", { name: "Second" });
      secondItem.focus();
      await user.keyboard("{ArrowUp}");

      expect(screen.getByRole("button", { name: "First" })).toHaveFocus();
    });
  });

  describe("Axe Accessibility — Styled", () => {
    test("37. axe check — FABMenu with items, no violations", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <FABMenu aria-label="Quick actions">
          <FABMenuItem icon={<IconAdd />} label="Add" />
          <FABMenuItem icon={<IconEdit />} label="Edit" />
        </FABMenu>
      );

      const trigger = screen.getByRole("button", { name: "Quick actions" });
      await user.click(trigger);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
