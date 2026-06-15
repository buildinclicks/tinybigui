import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Button } from "./Button";
import { ButtonGroup } from "../ButtonGroup/ButtonGroup";
import { isKeyboardAccessible, hasAccessibleLabel } from "../../../test/helpers";

describe("Button", () => {
  describe("Rendering", () => {
    test("renders button with text content", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
    });

    test("renders as button element by default", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button").tagName).toBe("BUTTON");
    });

    test("applies custom className", () => {
      render(<Button className="custom-class">Click me</Button>);
      expect(screen.getByRole("button")).toHaveClass("custom-class");
    });

    test("forwards ref to button element", () => {
      const ref = { current: null };
      render(<Button ref={ref}>Click me</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    test("renders state layer span inside button", () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole("button");
      const stateLayer = button.querySelector('span[aria-hidden="true"]');
      expect(stateLayer).toBeInTheDocument();
    });

    test("sets group/button class on root element", () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole("button")).toHaveClass("group/button");
    });
  });

  describe("Variants", () => {
    test("renders filled variant (default)", () => {
      render(<Button variant="filled">Filled</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-on-primary");
      // background lives on the buttonContainerVariants child span (not the root)
      const bgContainer = button.querySelector('span[aria-hidden="true"]');
      expect(bgContainer).toHaveClass("bg-primary");
    });

    test("renders outlined variant", () => {
      render(<Button variant="outlined">Outlined</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("border", "border-outline", "text-primary");
    });

    test("renders tonal variant", () => {
      render(<Button variant="tonal">Tonal</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-on-secondary-container");
      // background lives on the buttonContainerVariants child span (not the root)
      const bgContainer = button.querySelector('span[aria-hidden="true"]');
      expect(bgContainer).toHaveClass("bg-secondary-container");
    });

    test("renders elevated variant", () => {
      render(<Button variant="elevated">Elevated</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("shadow-elevation-1");
      // background lives on the buttonContainerVariants child span (not the root)
      const bgContainer = button.querySelector('span[aria-hidden="true"]');
      expect(bgContainer).toHaveClass("bg-surface-container-low");
    });

    test("renders text variant", () => {
      render(<Button variant="text">Text</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-primary");
      // background lives on the buttonContainerVariants child span (not the root)
      const bgContainer = button.querySelector('span[aria-hidden="true"]');
      expect(bgContainer).toHaveClass("bg-transparent");
    });

    test("sets data-variant attribute", () => {
      render(<Button variant="filled">Filled</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("data-variant", "filled");
    });

    test("sets data-variant for each variant", () => {
      const variants = ["filled", "outlined", "tonal", "elevated", "text"] as const;
      variants.forEach((variant) => {
        const { unmount } = render(<Button variant={variant}>{variant}</Button>);
        expect(screen.getByRole("button")).toHaveAttribute("data-variant", variant);
        unmount();
      });
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
      expect(button).toHaveClass("h-14", "px-8");
    });

    test("text variant uses reduced padding for medium", () => {
      render(
        <Button variant="text" size="medium">
          Text
        </Button>
      );
      expect(screen.getByRole("button")).toHaveClass("px-3");
    });

    test("text variant uses reduced padding for small", () => {
      render(
        <Button variant="text" size="small">
          Text
        </Button>
      );
      expect(screen.getByRole("button")).toHaveClass("px-3");
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

    test("sets data-with-icon when leading icon is present", () => {
      render(<Button icon={<svg>icon</svg>}>Icon</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("data-with-icon", "");
    });

    test("sets data-with-icon when trailing icon is present", () => {
      render(<Button trailingIcon={<svg>icon</svg>}>Icon</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("data-with-icon", "");
    });

    test("does not set data-with-icon when no icon is present", () => {
      render(<Button>No Icon</Button>);
      expect(screen.getByRole("button")).not.toHaveAttribute("data-with-icon");
    });

    test("icon appears before label text in DOM order", () => {
      render(<Button icon={<span data-testid="icon">I</span>}>Text</Button>);
      const button = screen.getByRole("button");
      const icon = screen.getByTestId("icon");
      const label = screen.getByText("Text");

      // Filter out ripple container and aria-hidden slots (state layer, focus ring)
      const visibleChildren = Array.from(button.childNodes).filter((node) => {
        const el = node as HTMLElement;
        return (
          !el.hasAttribute?.("data-ripple-container") && el.getAttribute?.("aria-hidden") !== "true"
        );
      });
      expect(visibleChildren[0]).toContainElement(icon);
      expect(visibleChildren[1]).toContainElement(label);
    });

    test("trailing icon appears after label text in DOM order", () => {
      render(<Button trailingIcon={<span data-testid="trailing">I</span>}>Text</Button>);
      const button = screen.getByRole("button");
      const label = screen.getByText("Text");
      const icon = screen.getByTestId("trailing");

      const visibleChildren = Array.from(button.childNodes).filter((node) => {
        const el = node as HTMLElement;
        return (
          !el.hasAttribute?.("data-ripple-container") && el.getAttribute?.("aria-hidden") !== "true"
        );
      });
      expect(visibleChildren[0]).toContainElement(label);
      expect(visibleChildren[1]).toContainElement(icon);
    });
  });

  describe("States", () => {
    test("disabled button is not clickable", () => {
      render(<Button isDisabled>Disabled</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    test("sets data-disabled attribute when disabled", () => {
      render(<Button isDisabled>Disabled</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("data-disabled", "");
    });

    test("does not set data-disabled when enabled", () => {
      render(<Button>Enabled</Button>);
      expect(screen.getByRole("button")).not.toHaveAttribute("data-disabled");
    });

    test("disabled filled button has MD3 disabled container class", () => {
      render(
        <Button variant="filled" isDisabled>
          Disabled
        </Button>
      );
      const button = screen.getByRole("button");
      // disabled container bg is on the buttonContainerVariants child span
      // using group-data descendant selector (same pattern as Switch track)
      const bgContainer = button.querySelector('span[aria-hidden="true"]');
      expect(bgContainer).toHaveClass("group-data-[disabled]/button:bg-on-surface/12");
    });

    test("disabled outlined button has MD3 disabled border class", () => {
      render(
        <Button variant="outlined" isDisabled>
          Disabled
        </Button>
      );
      expect(screen.getByRole("button")).toHaveClass("data-[disabled]:border-on-surface/12");
    });

    test("disabled elevated button has MD3 disabled shadow-none class", () => {
      render(
        <Button variant="elevated" isDisabled>
          Disabled
        </Button>
      );
      expect(screen.getByRole("button")).toHaveClass("data-[disabled]:shadow-none");
    });

    test("disabled button has MD3 disabled text class across all variants", () => {
      const variants = ["filled", "outlined", "tonal", "elevated", "text"] as const;
      variants.forEach((variant) => {
        const { unmount } = render(
          <Button variant={variant} isDisabled>
            {variant}
          </Button>
        );
        expect(screen.getByRole("button")).toHaveClass("data-[disabled]:text-on-surface/38");
        unmount();
      });
    });

    test("loading button is also disabled", () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    test("sets data-loading attribute when loading", () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("data-loading", "");
    });

    test("does not set data-loading when not loading", () => {
      render(<Button>Normal</Button>);
      expect(screen.getByRole("button")).not.toHaveAttribute("data-loading");
    });

    test("shows loading spinner when loading", () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole("button").querySelector('[role="progressbar"]')).toBeInTheDocument();
    });

    test("icon is invisible (not removed) when loading", () => {
      render(
        <Button loading icon={<svg data-testid="icon">icon</svg>}>
          Loading
        </Button>
      );
      const icon = screen.getByTestId("icon");
      expect(icon).toBeInTheDocument();
      expect(icon.parentElement).toHaveClass("invisible");
    });

    test("full width button spans container", () => {
      render(<Button fullWidth>Full Width</Button>);
      expect(screen.getByRole("button")).toHaveClass("w-full");
    });
  });

  describe("Interaction Data Attributes", () => {
    test("sets data-hovered when pointer is over button", async () => {
      const user = userEvent.setup();
      render(<Button>Hover me</Button>);
      const button = screen.getByRole("button");

      await user.hover(button);
      expect(button).toHaveAttribute("data-hovered", "");
    });

    test("removes data-hovered when pointer leaves button", async () => {
      const user = userEvent.setup();
      render(<Button>Hover me</Button>);
      const button = screen.getByRole("button");

      await user.hover(button);
      await user.unhover(button);
      expect(button).not.toHaveAttribute("data-hovered");
    });

    test("does not set data-hovered when disabled", async () => {
      const user = userEvent.setup();
      render(<Button isDisabled>Disabled</Button>);
      const button = screen.getByRole("button");

      await user.hover(button);
      expect(button).not.toHaveAttribute("data-hovered");
    });

    test("sets data-pressed on press start", async () => {
      const user = userEvent.setup();
      render(<Button>Press me</Button>);
      const button = screen.getByRole("button");

      // Hold pointer down to see pressed state
      await user.pointer({ target: button, keys: "[MouseLeft>]" });
      expect(button).toHaveAttribute("data-pressed", "");
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
      screen.getByRole("button").focus();
      await user.keyboard("{Enter}");
      expect(handlePress).toHaveBeenCalledTimes(1);
    });

    test("activates on Space key", async () => {
      const handlePress = vi.fn();
      const user = userEvent.setup();

      render(<Button onPress={handlePress}>Press Space</Button>);
      screen.getByRole("button").focus();
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
      expect(isKeyboardAccessible(screen.getByRole("button"))).toBe(true);
    });

    test("has accessible label from children", () => {
      render(<Button>Click me</Button>);
      expect(hasAccessibleLabel(screen.getByRole("button"))).toBe(true);
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

    test("receives focus on tab", async () => {
      const user = userEvent.setup();
      render(<Button>Focus me</Button>);
      await user.tab();
      expect(screen.getByRole("button")).toHaveFocus();
    });

    test("focus ring span is present for keyboard focus styling", () => {
      render(<Button>Focus me</Button>);
      const button = screen.getByRole("button");
      // Multiple aria-hidden spans: state layer + focus ring
      const hiddenSpans = button.querySelectorAll('span[aria-hidden="true"]');
      expect(hiddenSpans.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Ripple Effect", () => {
    test("renders ripple container by default", () => {
      render(<Button>Ripple</Button>);
      const button = screen.getByRole("button");
      expect(button.querySelector("[data-ripple-container]")).toBeInTheDocument();
    });

    test("does not render ripple when disableRipple is true", () => {
      render(<Button disableRipple>No Ripple</Button>);
      const button = screen.getByRole("button");
      expect(button.querySelector("[data-ripple-container]")).not.toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    test("handles empty children gracefully", () => {
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

    test("prevents press when disabled", async () => {
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

  describe("data-variant attribute for ButtonGroup integration", () => {
    test("sets data-variant matching the variant prop", () => {
      render(<Button variant="filled">Test</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("data-variant", "filled");
    });

    test("sets data-variant for outlined", () => {
      render(<Button variant="outlined">Test</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("data-variant", "outlined");
    });

    test("sets data-variant for tonal", () => {
      render(<Button variant="tonal">Test</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("data-variant", "tonal");
    });

    test("sets data-variant for text", () => {
      render(<Button variant="text">Test</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("data-variant", "text");
    });

    test("sets data-variant for elevated", () => {
      render(<Button variant="elevated">Test</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("data-variant", "elevated");
    });
  });

  describe("ButtonGroup context consumption", () => {
    test("standalone Button renders with rounded-full by default", () => {
      render(<Button>Standalone</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-full");
      expect(button).not.toHaveClass("rounded-xs");
      expect(button).not.toHaveClass("rounded-sm");
    });

    test("Button inside connected group applies inner radius class", () => {
      render(
        <ButtonGroup variant="connected" size="medium" aria-label="Group">
          <Button>One</Button>
          <Button>Two</Button>
        </ButtonGroup>
      );
      screen.getAllByRole("button").forEach((btn) => {
        expect(btn).toHaveClass("rounded-sm");
      });
    });

    test("Button inside connected round group applies graduated outer radius", () => {
      render(
        <ButtonGroup variant="connected" size="medium" shape="round" aria-label="Group">
          <Button>First</Button>
          <Button>Last</Button>
        </ButtonGroup>
      );
      const buttons = screen.getAllByRole("button");
      expect(buttons[0].className).toContain("first:rounded-s-3xl");
      expect(buttons[0].className).toContain("last:rounded-e-3xl");
    });

    test("Button inside connected group has correct inner radius for large size", () => {
      render(
        <ButtonGroup variant="connected" size="large" aria-label="Group">
          <Button>One</Button>
          <Button>Two</Button>
        </ButtonGroup>
      );
      screen.getAllByRole("button").forEach((btn) => {
        expect(btn).toHaveClass("rounded-lg");
      });
    });

    test("Button inside connected round extra-large group applies rounded-[20px]", () => {
      render(
        <ButtonGroup variant="connected" size="extra-large" shape="round" aria-label="Group">
          <Button>One</Button>
          <Button>Two</Button>
        </ButtonGroup>
      );
      screen.getAllByRole("button").forEach((btn) => {
        expect(btn.className).toContain("rounded-[20px]");
      });
    });

    test("Button inside connected square group applies square outer radius", () => {
      render(
        <ButtonGroup variant="connected" size="small" shape="square" aria-label="Group">
          <Button>One</Button>
          <Button>Two</Button>
        </ButtonGroup>
      );
      const buttons = screen.getAllByRole("button");
      expect(buttons[0].className).toContain("first:rounded-s-sm");
      expect(buttons[0].className).toContain("last:rounded-e-sm");
    });

    test("Button inside connected extra-small group has min-w-12", () => {
      render(
        <ButtonGroup variant="connected" size="extra-small" aria-label="Group">
          <Button>One</Button>
          <Button>Two</Button>
        </ButtonGroup>
      );
      screen.getAllByRole("button").forEach((btn) => {
        expect(btn).toHaveClass("min-w-12");
      });
    });

    test("Button inside connected small group has min-w-12", () => {
      render(
        <ButtonGroup variant="connected" size="small" aria-label="Group">
          <Button>One</Button>
        </ButtonGroup>
      );
      expect(screen.getByRole("button")).toHaveClass("min-w-12");
    });

    test("Button inside connected medium group does NOT have min-w-12", () => {
      render(
        <ButtonGroup variant="connected" size="medium" aria-label="Group">
          <Button>One</Button>
        </ButtonGroup>
      );
      expect(screen.getByRole("button")).not.toHaveClass("min-w-12");
    });

    test("Button inside standard group does NOT apply connected radius classes", () => {
      render(
        <ButtonGroup variant="standard" size="medium" aria-label="Group">
          <Button>One</Button>
        </ButtonGroup>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-full");
      expect(button).not.toHaveClass("rounded-sm");
      expect(button).not.toHaveClass("min-w-12");
    });
  });

  describe("Axe Accessibility", () => {
    test("has no accessibility violations", async () => {
      const { container } = render(<Button>Click me</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations when disabled", async () => {
      const { container } = render(<Button isDisabled>Disabled</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations in loading state", async () => {
      const { container } = render(<Button loading>Saving</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations with icon", async () => {
      const { container } = render(<Button icon={<svg aria-hidden="true" />}>With Icon</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
