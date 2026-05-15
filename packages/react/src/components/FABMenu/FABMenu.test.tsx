/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { axe } from "vitest-axe";
import React, { useContext } from "react";
import { FABMenuHeadless, FABMenuContext } from "./FABMenuHeadless";
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
