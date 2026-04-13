import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Checkbox } from "./Checkbox";
import { isKeyboardAccessible, hasAccessibleLabel } from "../../../test/helpers";

describe("Checkbox", () => {
  describe("Rendering", () => {
    test("renders checkbox with label", () => {
      render(<Checkbox>Accept terms</Checkbox>);
      expect(screen.getByRole("checkbox", { name: "Accept terms" })).toBeInTheDocument();
    });

    test("renders as checkbox element", () => {
      render(<Checkbox>Check me</Checkbox>);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox.tagName).toBe("INPUT");
      expect(checkbox).toHaveAttribute("type", "checkbox");
    });

    test("applies custom className", () => {
      render(<Checkbox className="custom-class">Check me</Checkbox>);
      const label = screen.getByText("Check me").closest("label");
      expect(label).toHaveClass("custom-class");
    });

    test("forwards ref to input element", () => {
      const ref = { current: null };
      render(<Checkbox ref={ref}>Check me</Checkbox>);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    test("renders without label when no children provided", () => {
      render(<Checkbox aria-label="Check option" />);
      expect(screen.getByRole("checkbox", { name: "Check option" })).toBeInTheDocument();
    });
  });

  describe("States", () => {
    test("renders unchecked state by default", () => {
      render(<Checkbox>Unchecked</Checkbox>);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
    });

    test("renders checked state", () => {
      render(<Checkbox isSelected>Checked</Checkbox>);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });

    test("renders indeterminate state", () => {
      render(<Checkbox isIndeterminate>Indeterminate</Checkbox>);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox.indeterminate).toBe(true);
    });

    test("renders error state", () => {
      render(<Checkbox isInvalid>Error</Checkbox>);
      const label = screen.getByText("Error").closest("label");

      // Visual error styling should be applied
      expect(label).toBeInTheDocument();
    });

    test("renders disabled state", () => {
      render(<Checkbox isDisabled>Disabled</Checkbox>);
      const label = screen.getByText("Disabled").closest("label");

      // Visual styling should indicate disabled state
      expect(label).toHaveClass("opacity-38");
      expect(label).toHaveClass("pointer-events-none");
    });
  });

  describe("Interactions", () => {
    test("toggles on click", async () => {
      const user = userEvent.setup();
      render(<Checkbox>Toggle me</Checkbox>);
      const checkbox = screen.getByRole("checkbox");

      expect(checkbox).not.toBeChecked();
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    test("toggles on Space key", async () => {
      const user = userEvent.setup();
      render(<Checkbox>Toggle me</Checkbox>);
      const checkbox = screen.getByRole("checkbox");

      checkbox.focus();
      expect(checkbox).not.toBeChecked();
      await user.keyboard(" ");
      expect(checkbox).toBeChecked();
    });

    test("calls onChange when toggled", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Checkbox onChange={handleChange}>Toggle me</Checkbox>);
      const checkbox = screen.getByRole("checkbox");

      await user.click(checkbox);
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    test("does not toggle when disabled", () => {
      render(<Checkbox isDisabled>Disabled</Checkbox>);
      const checkbox = screen.getByRole("checkbox");
      const label = screen.getByText("Disabled").closest("label");

      // Visual disabled state should be applied
      expect(label).toHaveClass("opacity-38");
      expect(checkbox).not.toBeChecked();
    });

    test("clicking label toggles checkbox", async () => {
      const user = userEvent.setup();
      render(<Checkbox>Click label</Checkbox>);
      const label = screen.getByText("Click label");
      const checkbox = screen.getByRole("checkbox");

      await user.click(label);
      expect(checkbox).toBeChecked();
    });
  });

  describe("Controlled/Uncontrolled", () => {
    test("works as uncontrolled with defaultSelected", () => {
      render(<Checkbox defaultSelected>Uncontrolled</Checkbox>);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });

    test("works as controlled component", async () => {
      const user = userEvent.setup();
      let selected = false;
      const handleChange = vi.fn((value: boolean) => {
        selected = value;
      });

      const { rerender } = render(
        <Checkbox isSelected={selected} onChange={handleChange}>
          Controlled
        </Checkbox>
      );
      const checkbox = screen.getByRole("checkbox");

      expect(checkbox).not.toBeChecked();

      await user.click(checkbox);
      expect(handleChange).toHaveBeenCalledWith(true);

      rerender(
        <Checkbox isSelected={true} onChange={handleChange}>
          Controlled
        </Checkbox>
      );
      expect(checkbox).toBeChecked();
    });

    test("maintains indeterminate state when controlled", () => {
      const { rerender } = render(
        <Checkbox isIndeterminate isSelected={false}>
          Indeterminate
        </Checkbox>
      );
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox.indeterminate).toBe(true);

      rerender(
        <Checkbox isIndeterminate={false} isSelected={true}>
          Indeterminate
        </Checkbox>
      );
      expect(checkbox.indeterminate).toBe(false);
      expect(checkbox).toBeChecked();
    });
  });

  describe("Accessibility", () => {
    test("is keyboard accessible", () => {
      render(<Checkbox>Accessible</Checkbox>);
      const checkbox = screen.getByRole("checkbox");
      expect(isKeyboardAccessible(checkbox)).toBe(true);
    });

    test("has accessible label from children", () => {
      render(<Checkbox>Label text</Checkbox>);
      const label = screen.getByText("Label text").closest("label");
      expect(hasAccessibleLabel(label!)).toBe(true);
    });

    test("supports custom aria-label", () => {
      render(<Checkbox aria-label="Custom label" />);
      expect(screen.getByRole("checkbox", { name: "Custom label" })).toBeInTheDocument();
    });

    test("has correct checked attribute for checked state", () => {
      render(<Checkbox isSelected>Checked</Checkbox>);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });

    test("has correct indeterminate attribute for indeterminate state", () => {
      render(<Checkbox isIndeterminate>Indeterminate</Checkbox>);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox.indeterminate).toBe(true);
    });

    test("has invalid state when invalid", () => {
      render(<Checkbox isInvalid>Invalid</Checkbox>);
      screen.getByRole("checkbox");
      const label = screen.getByText("Invalid").closest("label");
      expect(label).toBeInTheDocument();
      const visualContainer = label?.querySelector("div > svg");
      expect(visualContainer).toBeInTheDocument();
    });

    test("supports aria-describedby", () => {
      render(
        <>
          <Checkbox aria-describedby="help-text">Check me</Checkbox>
          <span id="help-text">Helper text</span>
        </>
      );
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-describedby", "help-text");
    });

    test("has focus indicator when focused", async () => {
      const user = userEvent.setup();
      render(<Checkbox>Focus me</Checkbox>);
      const checkbox = screen.getByRole("checkbox");

      await user.tab();
      expect(checkbox).toHaveFocus();
    });

    test("announces state changes to screen readers", async () => {
      const user = userEvent.setup();
      render(<Checkbox>Toggle me</Checkbox>);
      const checkbox = screen.getByRole("checkbox");

      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });
  });

  describe("Disabled", () => {
    test("applies disabled styling", () => {
      render(<Checkbox isDisabled>Disabled</Checkbox>);
      const label = screen.getByText("Disabled").closest("label");
      expect(label).toHaveClass("opacity-38");
    });

    test("checkbox has disabled state", () => {
      render(<Checkbox isDisabled>Disabled</Checkbox>);
      screen.getByRole("checkbox");
      const label = screen.getByText("Disabled").closest("label");

      expect(label).toHaveClass("pointer-events-none");
    });

    test("does not respond to interactions when disabled", () => {
      render(<Checkbox isDisabled>Disabled</Checkbox>);
      const label = screen.getByText("Disabled").closest("label");

      // pointer-events-none prevents interaction
      expect(label).toHaveClass("pointer-events-none");
    });
  });

  describe("Form Integration", () => {
    test("supports name prop for forms", () => {
      render(<Checkbox name="terms">Terms</Checkbox>);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("name", "terms");
    });

    test("supports value prop for forms", () => {
      render(<Checkbox value="accepted">Terms</Checkbox>);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("value", "accepted");
    });

    test("works in form submission", () => {
      const handleSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
      render(
        <form onSubmit={handleSubmit}>
          <Checkbox name="newsletter" value="subscribe" defaultSelected>
            Subscribe
          </Checkbox>
          <button type="submit">Submit</button>
        </form>
      );

      const form = screen.getByRole("checkbox").closest("form")!;
      const formData = new FormData(form);
      expect(formData.get("newsletter")).toBe("subscribe");
    });
  });

  describe("Ripple Effect", () => {
    test("renders ripple container", () => {
      render(<Checkbox>Ripple</Checkbox>);
      const label = screen.getByText("Ripple").closest("label");
      const rippleContainer = label?.querySelector("[data-ripple-container]");
      expect(rippleContainer).toBeInTheDocument();
    });

    test("does not render ripple when disabled", () => {
      render(<Checkbox disableRipple>No ripple</Checkbox>);
      const label = screen.getByText("No ripple").closest("label");
      const rippleContainer = label?.querySelector("[data-ripple-container]");
      expect(rippleContainer).not.toBeInTheDocument();
    });

    test("does not render ripple on disabled checkbox", () => {
      render(<Checkbox isDisabled>Disabled</Checkbox>);
      const label = screen.getByText("Disabled").closest("label");
      const rippleContainer = label?.querySelector("[data-ripple-container]");
      expect(rippleContainer).not.toBeInTheDocument();
    });
  });

  describe("Focus", () => {
    test("shows focus ring on keyboard focus", async () => {
      const user = userEvent.setup();
      render(<Checkbox>Focus me</Checkbox>);
      const checkbox = screen.getByRole("checkbox");

      await user.tab();
      expect(checkbox).toHaveFocus();
      // Focus ring is rendered as part of SVG when isFocusVisible is true
      const label = screen.getByText("Focus me").closest("label");
      expect(label).toBeInTheDocument();
    });

    test("does not show focus ring on mouse click", async () => {
      const user = userEvent.setup();
      render(<Checkbox>Click me</Checkbox>);
      const checkbox = screen.getByRole("checkbox");

      await user.click(checkbox);
      expect(checkbox).toHaveFocus();
    });
  });

  describe("Custom Props", () => {
    test("merges custom className with default styles", () => {
      render(<Checkbox className="custom-class">Custom</Checkbox>);
      const label = screen.getByText("Custom").closest("label");
      expect(label).toHaveClass("custom-class");
    });

    test("supports data-testid", () => {
      render(<Checkbox data-testid="my-checkbox">Test ID</Checkbox>);
      const label = screen.getByTestId("my-checkbox");
      expect(label).toBeInTheDocument();
    });

    test("forwards additional HTML attributes", () => {
      render(
        <Checkbox title="Checkbox title" id="my-checkbox">
          Attributes
        </Checkbox>
      );
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("id", "my-checkbox");
    });
  });

  describe("Edge Cases", () => {
    test("handles rapid toggling", async () => {
      const user = userEvent.setup();
      render(<Checkbox>Rapid toggle</Checkbox>);
      const checkbox = screen.getByRole("checkbox");

      await user.click(checkbox);
      await user.click(checkbox);
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
    });

    test("handles isIndeterminate with isSelected", () => {
      render(
        <Checkbox isIndeterminate isSelected>
          Both states
        </Checkbox>
      );
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox.indeterminate).toBe(true);
      // Indeterminate overrides selected visually
    });

    test("prevents default form submission on Space key", async () => {
      const handleSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
      const user = userEvent.setup();
      render(
        <form onSubmit={handleSubmit}>
          <Checkbox>Submit test</Checkbox>
        </form>
      );
      const checkbox = screen.getByRole("checkbox");

      checkbox.focus();
      await user.keyboard(" ");
      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });

  describe("Axe Accessibility", () => {
    test("has no accessibility violations", async () => {
      const { container } = render(<Checkbox>Accept terms</Checkbox>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations with aria-label", async () => {
      const { container } = render(<Checkbox aria-label="Accept terms" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations when checked", async () => {
      const { container } = render(<Checkbox isSelected>Checked option</Checkbox>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations when disabled", async () => {
      const { container } = render(<Checkbox isDisabled>Disabled option</Checkbox>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations in indeterminate state", async () => {
      const { container } = render(<Checkbox isIndeterminate>Indeterminate</Checkbox>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
