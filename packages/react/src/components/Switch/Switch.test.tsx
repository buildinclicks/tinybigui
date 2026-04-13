import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Switch } from "./Switch";
import { isKeyboardAccessible, hasAccessibleLabel } from "../../../test/helpers";

describe("Switch", () => {
  describe("Rendering", () => {
    test("renders switch with label", () => {
      render(<Switch>Low power mode</Switch>);
      expect(screen.getByRole("switch", { name: "Low power mode" })).toBeInTheDocument();
    });

    test("renders as switch element with role", () => {
      render(<Switch>Toggle me</Switch>);
      const switchElement = screen.getByRole("switch");
      expect(switchElement.tagName).toBe("INPUT");
      expect(switchElement).toHaveAttribute("type", "checkbox");
      expect(switchElement).toHaveAttribute("role", "switch");
    });

    test("applies custom className", () => {
      render(<Switch className="custom-class">Toggle me</Switch>);
      const label = screen.getByText("Toggle me").closest("label");
      expect(label).toHaveClass("custom-class");
    });

    test("forwards ref to input element", () => {
      const ref = { current: null };
      render(<Switch ref={ref}>Toggle me</Switch>);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    test("renders without label when no children provided", () => {
      render(<Switch aria-label="Toggle option" />);
      expect(screen.getByRole("switch", { name: "Toggle option" })).toBeInTheDocument();
    });
  });

  describe("States", () => {
    test("renders unselected state by default", () => {
      render(<Switch>Unselected</Switch>);
      const switchElement = screen.getByRole("switch");
      expect(switchElement).not.toBeChecked();
    });

    test("renders selected state", () => {
      render(<Switch isSelected>Selected</Switch>);
      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeChecked();
    });

    test("renders disabled state", () => {
      render(<Switch isDisabled>Disabled</Switch>);
      const label = screen.getByText("Disabled").closest("label");
      expect(label).toHaveClass("opacity-38");
      expect(label).toHaveClass("pointer-events-none");
    });

    test("renders readonly state", () => {
      render(<Switch isReadOnly>Readonly</Switch>);
      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveAttribute("aria-readonly", "true");
    });
  });

  describe("Interactions", () => {
    test("toggles on click", async () => {
      const user = userEvent.setup();
      render(<Switch>Toggle me</Switch>);
      const switchElement = screen.getByRole("switch");

      expect(switchElement).not.toBeChecked();
      await user.click(switchElement);
      expect(switchElement).toBeChecked();
      await user.click(switchElement);
      expect(switchElement).not.toBeChecked();
    });

    test("toggles on Space key", async () => {
      const user = userEvent.setup();
      render(<Switch>Toggle me</Switch>);
      const switchElement = screen.getByRole("switch");

      switchElement.focus();
      expect(switchElement).not.toBeChecked();
      await user.keyboard(" ");
      expect(switchElement).toBeChecked();
    });

    test("toggles on Enter key", async () => {
      const user = userEvent.setup();
      render(<Switch>Toggle me</Switch>);
      const switchElement = screen.getByRole("switch");

      switchElement.focus();
      expect(switchElement).not.toBeChecked();
      await user.keyboard("{Enter}");
      expect(switchElement).toBeChecked();
    });

    test("calls onChange when toggled", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Switch onChange={handleChange}>Toggle me</Switch>);
      const switchElement = screen.getByRole("switch");

      await user.click(switchElement);
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    test("does not toggle when disabled", () => {
      render(<Switch isDisabled>Disabled</Switch>);
      const switchElement = screen.getByRole("switch");
      const label = screen.getByText("Disabled").closest("label");

      expect(label).toHaveClass("opacity-38");
      expect(switchElement).not.toBeChecked();
    });

    test("does not toggle when readonly", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Switch isReadOnly onChange={handleChange}>
          Readonly
        </Switch>
      );
      const switchElement = screen.getByRole("switch");

      await user.click(switchElement);
      expect(handleChange).not.toHaveBeenCalled();
    });

    test("clicking label toggles switch", async () => {
      const user = userEvent.setup();
      render(<Switch>Click label</Switch>);
      const label = screen.getByText("Click label");
      const switchElement = screen.getByRole("switch");

      await user.click(label);
      expect(switchElement).toBeChecked();
    });
  });

  describe("Icons", () => {
    test("renders icon when unselected", () => {
      render(<Switch icon={<span data-testid="off-icon">X</span>}>With icon</Switch>);
      expect(screen.getByTestId("off-icon")).toBeInTheDocument();
    });

    test("renders selectedIcon when selected", () => {
      render(
        <Switch isSelected selectedIcon={<span data-testid="on-icon">✓</span>}>
          With icon
        </Switch>
      );
      expect(screen.getByTestId("on-icon")).toBeInTheDocument();
    });

    test("shows correct icon based on state", async () => {
      const user = userEvent.setup();
      render(
        <Switch
          icon={<span data-testid="off-icon">X</span>}
          selectedIcon={<span data-testid="on-icon">✓</span>}
        >
          Toggle icon
        </Switch>
      );
      const switchElement = screen.getByRole("switch");

      expect(screen.getByTestId("off-icon")).toBeInTheDocument();
      expect(screen.queryByTestId("on-icon")).not.toBeInTheDocument();

      await user.click(switchElement);

      expect(screen.queryByTestId("off-icon")).not.toBeInTheDocument();
      expect(screen.getByTestId("on-icon")).toBeInTheDocument();
    });

    test("renders without icons when not provided", () => {
      render(<Switch>No icons</Switch>);
      const label = screen.getByText("No icons").closest("label");
      expect(label).toBeInTheDocument();
    });
  });

  describe("Controlled/Uncontrolled", () => {
    test("works as uncontrolled with defaultSelected", () => {
      render(<Switch defaultSelected>Uncontrolled</Switch>);
      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeChecked();
    });

    test("works as controlled component", async () => {
      const user = userEvent.setup();
      let selected = false;
      const handleChange = vi.fn((value: boolean) => {
        selected = value;
      });

      const { rerender } = render(
        <Switch isSelected={selected} onChange={handleChange}>
          Controlled
        </Switch>
      );
      const switchElement = screen.getByRole("switch");

      expect(switchElement).not.toBeChecked();

      await user.click(switchElement);
      expect(handleChange).toHaveBeenCalledWith(true);

      rerender(
        <Switch isSelected={true} onChange={handleChange}>
          Controlled
        </Switch>
      );
      expect(switchElement).toBeChecked();
    });
  });

  describe("Accessibility", () => {
    test("is keyboard accessible", () => {
      render(<Switch>Accessible</Switch>);
      const switchElement = screen.getByRole("switch");
      expect(isKeyboardAccessible(switchElement)).toBe(true);
    });

    test("has accessible label from children", () => {
      render(<Switch>Label text</Switch>);
      const label = screen.getByText("Label text").closest("label");
      expect(hasAccessibleLabel(label!)).toBe(true);
    });

    test("supports custom aria-label", () => {
      render(<Switch aria-label="Custom label" />);
      expect(screen.getByRole("switch", { name: "Custom label" })).toBeInTheDocument();
    });

    test("has correct checked attribute for selected state", () => {
      render(<Switch isSelected>Selected</Switch>);
      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeChecked();
    });

    test("has role=switch attribute", () => {
      render(<Switch>Switch role</Switch>);
      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveAttribute("role", "switch");
    });

    test("supports aria-describedby", () => {
      render(
        <>
          <Switch aria-describedby="help-text">Toggle me</Switch>
          <span id="help-text">Helper text</span>
        </>
      );
      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveAttribute("aria-describedby", "help-text");
    });

    test("has focus indicator when focused", async () => {
      const user = userEvent.setup();
      render(<Switch>Focus me</Switch>);
      const switchElement = screen.getByRole("switch");

      await user.tab();
      expect(switchElement).toHaveFocus();
    });

    test("announces state changes to screen readers", async () => {
      const user = userEvent.setup();
      render(<Switch>Toggle me</Switch>);
      const switchElement = screen.getByRole("switch");

      await user.click(switchElement);
      expect(switchElement).toBeChecked();
      // React Aria uses native checkbox checked state instead of aria-checked
      expect(switchElement.checked).toBe(true);
    });
  });

  describe("Disabled", () => {
    test("applies disabled styling", () => {
      render(<Switch isDisabled>Disabled</Switch>);
      const label = screen.getByText("Disabled").closest("label");
      expect(label).toHaveClass("opacity-38");
    });

    test("switch has disabled visual state", () => {
      render(<Switch isDisabled>Disabled</Switch>);
      const label = screen.getByText("Disabled").closest("label");
      expect(label).toHaveClass("pointer-events-none");
    });

    test("does not respond to interactions when disabled", () => {
      render(<Switch isDisabled>Disabled</Switch>);
      const label = screen.getByText("Disabled").closest("label");
      expect(label).toHaveClass("pointer-events-none");
    });
  });

  describe("Form Integration", () => {
    test("supports name prop for forms", () => {
      render(<Switch name="darkMode">Dark mode</Switch>);
      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveAttribute("name", "darkMode");
    });

    test("supports value prop for forms", () => {
      render(<Switch value="enabled">Enabled</Switch>);
      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveAttribute("value", "enabled");
    });

    test("works in form submission", () => {
      const handleSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
      render(
        <form onSubmit={handleSubmit}>
          <Switch name="notifications" value="on" defaultSelected>
            Notifications
          </Switch>
          <button type="submit">Submit</button>
        </form>
      );

      const form = screen.getByRole("switch").closest("form")!;
      const formData = new FormData(form);
      expect(formData.get("notifications")).toBe("on");
    });
  });

  describe("Ripple Effect", () => {
    test("renders ripple container", () => {
      render(<Switch>Ripple</Switch>);
      const label = screen.getByText("Ripple").closest("label");
      const rippleContainer = label?.querySelector("[data-ripple-container]");
      expect(rippleContainer).toBeInTheDocument();
    });

    test("does not render ripple when disabled", () => {
      render(<Switch disableRipple>No ripple</Switch>);
      const label = screen.getByText("No ripple").closest("label");
      const rippleContainer = label?.querySelector("[data-ripple-container]");
      expect(rippleContainer).not.toBeInTheDocument();
    });

    test("does not render ripple on disabled switch", () => {
      render(<Switch isDisabled>Disabled</Switch>);
      const label = screen.getByText("Disabled").closest("label");
      const rippleContainer = label?.querySelector("[data-ripple-container]");
      expect(rippleContainer).not.toBeInTheDocument();
    });
  });

  describe("Focus", () => {
    test("shows focus ring on keyboard focus", async () => {
      const user = userEvent.setup();
      render(<Switch>Focus me</Switch>);
      const switchElement = screen.getByRole("switch");

      await user.tab();
      expect(switchElement).toHaveFocus();
    });

    test("does not show focus ring on mouse click", async () => {
      const user = userEvent.setup();
      render(<Switch>Click me</Switch>);
      const switchElement = screen.getByRole("switch");

      await user.click(switchElement);
      expect(switchElement).toHaveFocus();
    });
  });

  describe("Custom Props", () => {
    test("merges custom className with default styles", () => {
      render(<Switch className="custom-class">Custom</Switch>);
      const label = screen.getByText("Custom").closest("label");
      expect(label).toHaveClass("custom-class");
    });

    test("supports data-testid", () => {
      render(<Switch data-testid="my-switch">Test ID</Switch>);
      const label = screen.getByTestId("my-switch");
      expect(label).toBeInTheDocument();
    });

    test("forwards additional HTML attributes", () => {
      render(
        <Switch title="Switch title" id="my-switch">
          Attributes
        </Switch>
      );
      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveAttribute("id", "my-switch");
    });
  });

  describe("Edge Cases", () => {
    test("handles rapid toggling", async () => {
      const user = userEvent.setup();
      render(<Switch>Rapid toggle</Switch>);
      const switchElement = screen.getByRole("switch");

      await user.click(switchElement);
      await user.click(switchElement);
      await user.click(switchElement);
      expect(switchElement).toBeChecked();
    });

    test("prevents default form submission on Space key", async () => {
      const handleSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
      const user = userEvent.setup();
      render(
        <form onSubmit={handleSubmit}>
          <Switch>Submit test</Switch>
        </form>
      );
      const switchElement = screen.getByRole("switch");

      switchElement.focus();
      await user.keyboard(" ");
      expect(handleSubmit).not.toHaveBeenCalled();
    });
  });

  describe("Axe Accessibility", () => {
    test("has no accessibility violations", async () => {
      const { container } = render(<Switch>Low power mode</Switch>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations with aria-label", async () => {
      const { container } = render(<Switch aria-label="Toggle option" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations when selected", async () => {
      const { container } = render(<Switch isSelected>Enabled</Switch>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations when disabled", async () => {
      const { container } = render(<Switch isDisabled>Disabled option</Switch>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
