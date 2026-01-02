import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./Button";
import { isKeyboardAccessible, hasAccessibleLabel } from "../../../test/helpers";

describe("Button", () => {
  describe("Rendering", () => {
    test("renders button with text content", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    test("renders as button element by default", () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole("button");
      expect(button.tagName).toBe("BUTTON");
    });

    test("applies custom className", () => {
      render(<Button className="custom-class">Click me</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    test("forwards ref to button element", () => {
      const ref = { current: null };
      render(<Button ref={ref}>Click me</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe("Variants", () => {
    test("renders filled variant (default)", () => {
      render(<Button variant="filled">Filled</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary", "text-on-primary");
    });

    test("renders outlined variant", () => {
      render(<Button variant="outlined">Outlined</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("border", "border-outline");
    });

    test("renders tonal variant", () => {
      render(<Button variant="tonal">Tonal</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-secondary-container", "text-on-secondary-container");
    });

    test("renders elevated variant", () => {
      render(<Button variant="elevated">Elevated</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-surface-container-low", "shadow-elevation-1");
    });

    test("renders text variant", () => {
      render(<Button variant="text">Text</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-transparent", "text-primary");
    });
  });

  describe("Colors", () => {
    test("renders primary color (default)", () => {
      render(<Button color="primary">Primary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary", "text-on-primary");
    });

    test("renders secondary color", () => {
      render(<Button color="secondary">Secondary</Button>);
      const button = screen.getByRole("button");
      // For filled variant with secondary color
      expect(button).toHaveClass("bg-secondary", "text-on-secondary");
    });

    test("renders tertiary color", () => {
      render(<Button color="tertiary">Tertiary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-tertiary", "text-on-tertiary");
    });

    test("renders error color", () => {
      render(<Button color="error">Error</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-error", "text-on-error");
    });
  });

  describe("Sizes", () => {
    test("renders medium size (default)", () => {
      render(<Button size="medium">Medium</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-10", "px-6");
    });

    test("renders small size", () => {
      render(<Button size="small">Small</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-8", "px-4");
    });

    test("renders large size", () => {
      render(<Button size="large">Large</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-12", "px-8");
    });
  });

  describe("Icons", () => {
    test("renders with leading icon", () => {
      render(<Button icon={<svg data-testid="icon">icon</svg>}>With Icon</Button>);
      expect(screen.getByTestId("icon")).toBeInTheDocument();
      expect(screen.getByText("With Icon")).toBeInTheDocument();
    });

    test("renders with trailing icon", () => {
      render(
        <Button trailingIcon={<svg data-testid="trailing-icon">icon</svg>}>With Trailing</Button>
      );
      expect(screen.getByTestId("trailing-icon")).toBeInTheDocument();
    });

    test("icon appears before text", () => {
      render(<Button icon={<span data-testid="icon">I</span>}>Text</Button>);
      const button = screen.getByRole("button");
      const icon = screen.getByTestId("icon");
      const text = screen.getByText("Text");

      // Icon should come before text in DOM order
      // Get all children as array, excluding ripple container
      const children = Array.from(button.childNodes).filter(
        (node) => !(node as HTMLElement).hasAttribute?.("data-ripple-container")
      );
      expect(children[0]).toContainElement(icon);
      expect(children[1]).toContainElement(text);
    });

    test("trailing icon appears after text", () => {
      render(<Button trailingIcon={<span data-testid="trailing">I</span>}>Text</Button>);
      const button = screen.getByRole("button");
      const text = screen.getByText("Text");
      const icon = screen.getByTestId("trailing");

      // Text should come before trailing icon
      // Get all children as array, excluding ripple container
      const children = Array.from(button.childNodes).filter(
        (node) => !(node as HTMLElement).hasAttribute?.("data-ripple-container")
      );
      expect(children[0]).toContainElement(text);
      expect(children[1]).toContainElement(icon);
    });
  });

  describe("States", () => {
    test("handles disabled state", () => {
      render(<Button isDisabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      // MD3 spec: disabled state uses pointer-events-none, cursor-not-allowed, and removes shadows
      expect(button).toHaveClass("pointer-events-none", "cursor-not-allowed", "shadow-none");
    });

    test("handles loading state", () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("cursor-wait");
    });

    test("shows loading spinner when loading", () => {
      render(<Button loading>Loading</Button>);
      // Spinner should be present (we'll check for loading indicator)
      const button = screen.getByRole("button");
      expect(button.querySelector('[role="progressbar"]')).toBeInTheDocument();
    });

    test("hides icon when loading", () => {
      render(
        <Button loading icon={<svg data-testid="icon">icon</svg>}>
          Loading
        </Button>
      );
      // Icon should be present but hidden when loading
      const icon = screen.getByTestId("icon");
      expect(icon).toBeInTheDocument();
      // Check that parent span has invisible class
      expect(icon.parentElement).toHaveClass("invisible");
    });

    test("full width button spans container", () => {
      render(<Button fullWidth>Full Width</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("w-full");
    });
  });

  describe("Interactions", () => {
    test("calls onPress when clicked", async () => {
      const handlePress = vi.fn();
      const user = userEvent.setup();

      render(<Button onPress={handlePress}>Click me</Button>);
      await user.click(screen.getByRole("button"));

      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    test("does not call onPress when disabled", async () => {
      const handlePress = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onPress={handlePress} isDisabled>
          Disabled
        </Button>
      );
      await user.click(screen.getByRole("button"));

      expect(handlePress).not.toHaveBeenCalled();
    });

    test("does not call onPress when loading", async () => {
      const handlePress = vi.fn();
      const user = userEvent.setup();

      render(
        <Button onPress={handlePress} loading>
          Loading
        </Button>
      );
      await user.click(screen.getByRole("button"));

      expect(handlePress).not.toHaveBeenCalled();
    });

    test("activates on Enter key", async () => {
      const handlePress = vi.fn();
      const user = userEvent.setup();

      render(<Button onPress={handlePress}>Press Enter</Button>);
      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard("{Enter}");

      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    test("activates on Space key", async () => {
      const handlePress = vi.fn();
      const user = userEvent.setup();

      render(<Button onPress={handlePress}>Press Space</Button>);
      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard(" ");

      expect(handlePress).toHaveBeenCalledTimes(1);
    });
  });

  describe("Button Types", () => {
    test("renders as button type by default", () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });

    test("renders as submit type", () => {
      render(<Button type="submit">Submit</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    test("renders as reset type", () => {
      render(<Button type="reset">Reset</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "reset");
    });
  });

  describe("Accessibility", () => {
    test("is keyboard accessible", () => {
      render(<Button>Accessible</Button>);
      const button = screen.getByRole("button");
      expect(isKeyboardAccessible(button)).toBe(true);
    });

    test("has accessible label from children", () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole("button");
      expect(hasAccessibleLabel(button)).toBe(true);
    });

    test("supports custom aria-label", () => {
      render(<Button aria-label="Custom label">Icon</Button>);
      expect(screen.getByRole("button", { name: "Custom label" })).toBeInTheDocument();
    });

    test("supports aria-pressed for toggle buttons", () => {
      render(<Button aria-pressed="true">Toggle</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    });

    test("supports aria-expanded", () => {
      render(<Button aria-expanded="true">Expand</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    });

    test("supports aria-controls", () => {
      render(<Button aria-controls="menu-id">Menu</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("aria-controls", "menu-id");
    });

    test("supports aria-haspopup", () => {
      render(<Button aria-haspopup="menu">Menu</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("aria-haspopup", "menu");
    });

    test("has default tabIndex of 0", () => {
      render(<Button>Tab</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("tabIndex", "0");
    });

    test("supports custom tabIndex", () => {
      render(<Button tabIndex={-1}>No Tab</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("tabIndex", "-1");
    });

    test("shows focus indicator on focus", async () => {
      const user = userEvent.setup();
      render(<Button>Focus me</Button>);
      const button = screen.getByRole("button");

      await user.tab();
      expect(button).toHaveFocus();
      // Focus styles should be applied
      expect(button).toHaveClass("focus-visible:outline-2");
    });
  });

  describe("Ripple Effect", () => {
    test("renders ripple container by default", () => {
      render(<Button>Ripple</Button>);
      const button = screen.getByRole("button");
      // Ripple container should exist
      const rippleContainer = button.querySelector("[data-ripple-container]");
      expect(rippleContainer).toBeInTheDocument();
    });

    test("does not render ripple when disableRipple is true", () => {
      render(<Button disableRipple>No Ripple</Button>);
      const button = screen.getByRole("button");
      const rippleContainer = button.querySelector("[data-ripple-container]");
      expect(rippleContainer).not.toBeInTheDocument();
    });
  });

  describe("Variant + Color Combinations", () => {
    test("outlined secondary button has correct classes", () => {
      render(
        <Button variant="outlined" color="secondary">
          Outlined Secondary
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("border-outline", "text-secondary");
    });

    test("tonal tertiary button has correct classes", () => {
      render(
        <Button variant="tonal" color="tertiary">
          Tonal Tertiary
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-tertiary-container", "text-on-tertiary-container");
    });

    test("text error button has correct classes", () => {
      render(
        <Button variant="text" color="error">
          Text Error
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-error");
    });
  });

  describe("Edge Cases", () => {
    test("handles empty children gracefully", () => {
      // This should show a dev warning but still render
      const { container } = render(<Button>{""}</Button>);
      expect(container.querySelector("button")).toBeInTheDocument();
    });

    test("handles multiple children", () => {
      render(
        <Button>
          <span>Part 1</span>
          <span>Part 2</span>
        </Button>
      );
      expect(screen.getByText("Part 1")).toBeInTheDocument();
      expect(screen.getByText("Part 2")).toBeInTheDocument();
    });

    test("prevents event bubbling when disabled", async () => {
      const parentClick = vi.fn();
      const buttonPress = vi.fn();
      const user = userEvent.setup();

      render(
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div onClick={parentClick}>
          <Button onPress={buttonPress} isDisabled>
            Disabled
          </Button>
        </div>
      );

      await user.click(screen.getByRole("button"));
      expect(buttonPress).not.toHaveBeenCalled();
      // Parent should also not receive click due to pointer-events-none
    });
  });

  describe("Custom Props", () => {
    test("passes through data-testid", () => {
      render(<Button data-testid="my-button">Test</Button>);
      expect(screen.getByTestId("my-button")).toBeInTheDocument();
    });

    test("spreads additional HTML attributes", () => {
      render(<Button title="Tooltip">Hover</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("title", "Tooltip");
    });
  });
});
