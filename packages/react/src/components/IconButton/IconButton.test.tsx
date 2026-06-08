/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { axe } from "vitest-axe";
import { IconButton } from "./IconButton";
import { ButtonGroup } from "../ButtonGroup/ButtonGroup";
import React from "react";
import { isKeyboardAccessible, hasAccessibleLabel } from "../../../test/helpers";

// Mock icons for testing
const IconDelete = (): React.ReactElement => <svg data-testid="icon-delete" />;
const IconFavorite = (): React.ReactElement => <svg data-testid="icon-favorite" />;
const IconFavoriteSelected = (): React.ReactElement => <svg data-testid="icon-favorite-selected" />;
const IconEdit = (): React.ReactElement => <svg data-testid="icon-edit" />;

describe("IconButton", () => {
  describe("Rendering", () => {
    test("renders button with icon content", () => {
      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
      expect(screen.getByTestId("icon-delete")).toBeInTheDocument();
    });

    test("renders with aria-label", () => {
      render(
        <IconButton aria-label="Delete item">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByLabelText("Delete item")).toBeInTheDocument();
    });

    test("renders standard variant by default", () => {
      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-variant", "standard");
    });

    test("renders filled variant", () => {
      render(
        <IconButton aria-label="Delete" variant="filled">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-variant", "filled");
    });

    test("renders tonal variant", () => {
      render(
        <IconButton aria-label="Delete" variant="tonal">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-variant", "tonal");
    });

    test("renders outlined variant", () => {
      render(
        <IconButton aria-label="Delete" variant="outlined">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-variant", "outlined");
    });

    test("renders with primary color", () => {
      render(
        <IconButton aria-label="Delete" variant="filled" color="primary">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-color", "primary");
    });

    test("renders with secondary color", () => {
      render(
        <IconButton aria-label="Delete" variant="filled" color="secondary">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-color", "secondary");
    });

    test("renders with tertiary color", () => {
      render(
        <IconButton aria-label="Delete" variant="filled" color="tertiary">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-color", "tertiary");
    });

    test("renders with error color", () => {
      render(
        <IconButton aria-label="Delete" variant="filled" color="error">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-color", "error");
    });

    test("renders with circular shape by default", () => {
      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      // Round shape uses CSS variable [--ib-radius:9999px] rather than rounded-full
      expect(button).toHaveAttribute("data-shape", "round");
      expect(button.className).toContain("[--ib-radius:9999px]");
    });

    test("merges custom className", () => {
      render(
        <IconButton aria-label="Delete" className="custom-class">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveClass("custom-class");
    });

    test("applies title attribute", () => {
      render(
        <IconButton aria-label="Delete" title="Delete item">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("title", "Delete item");
    });

    test("renders state layer span", () => {
      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button.querySelector("[data-state-layer]")).toBeInTheDocument();
    });

    test("renders icon slot span", () => {
      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button.querySelector("[data-icon-slot]")).toBeInTheDocument();
    });
  });

  describe("Sizes — M3 Expressive 5-tier", () => {
    test("renders xsmall size", () => {
      render(
        <IconButton aria-label="Delete" size="xsmall">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-size", "xsmall");
    });

    test("renders small size", () => {
      render(
        <IconButton aria-label="Delete" size="small">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-size", "small");
    });

    test("renders medium size by default", () => {
      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-size", "medium");
    });

    test("renders large size", () => {
      render(
        <IconButton aria-label="Delete" size="large">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-size", "large");
    });

    test("renders xlarge size", () => {
      render(
        <IconButton aria-label="Delete" size="xlarge">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-size", "xlarge");
    });
  });

  describe("Width variants", () => {
    test("renders with default width by default", () => {
      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-width", "default");
    });

    test("renders with narrow width", () => {
      render(
        <IconButton aria-label="Delete" width="narrow">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-width", "narrow");
    });

    test("renders with wide width", () => {
      render(
        <IconButton aria-label="Delete" width="wide">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-width", "wide");
    });
  });

  describe("Shape variants", () => {
    test("renders with round shape by default", () => {
      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-shape", "round");
    });

    test("renders with square shape", () => {
      render(
        <IconButton aria-label="Delete" shape="square">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("data-shape", "square");
      expect(button).not.toHaveClass("rounded-full");
    });
  });

  describe("Interaction state attributes", () => {
    test("sets data-disabled when disabled", () => {
      render(
        <IconButton aria-label="Delete" isDisabled>
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("data-disabled", "");
    });

    test("does not set data-disabled when enabled", () => {
      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).not.toHaveAttribute("data-disabled");
    });

    test("sets data-selected when selected is true", () => {
      render(
        <IconButton aria-label="Favorite" selected>
          <IconFavorite />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "true");
      expect(button).toHaveAttribute("data-selected", "");
    });

    test("does not set data-selected when selected is false", () => {
      render(
        <IconButton aria-label="Favorite" selected={false}>
          <IconFavorite />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "false");
      expect(button).not.toHaveAttribute("data-selected");
    });

    test("sets data-toggle when selected prop is defined", () => {
      render(
        <IconButton aria-label="Favorite" selected={false}>
          <IconFavorite />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-toggle", "");
    });

    test("does not set data-toggle when selected prop is undefined", () => {
      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).not.toHaveAttribute("data-toggle");
      expect(screen.getByRole("button")).not.toHaveAttribute("aria-pressed");
    });
  });

  describe("Toggle behaviour", () => {
    test("shows selectedIcon when selected is true", () => {
      render(
        <IconButton aria-label="Favorite" selected selectedIcon={<IconFavoriteSelected />}>
          <IconFavorite />
        </IconButton>
      );
      expect(screen.getByTestId("icon-favorite-selected")).toBeInTheDocument();
      expect(screen.queryByTestId("icon-favorite")).not.toBeInTheDocument();
    });

    test("shows children icon when selected is false", () => {
      render(
        <IconButton aria-label="Favorite" selected={false} selectedIcon={<IconFavoriteSelected />}>
          <IconFavorite />
        </IconButton>
      );
      expect(screen.getByTestId("icon-favorite")).toBeInTheDocument();
      expect(screen.queryByTestId("icon-favorite-selected")).not.toBeInTheDocument();
    });

    test("supports controlled toggle behavior", async () => {
      const user = userEvent.setup();
      const TestComponent = (): React.ReactElement => {
        const [selected, setSelected] = React.useState(false);
        return (
          <IconButton
            aria-label={selected ? "Remove favorite" : "Add favorite"}
            selected={selected}
            onPress={() => setSelected(!selected)}
            selectedIcon={<IconFavoriteSelected />}
          >
            <IconFavorite />
          </IconButton>
        );
      };

      render(<TestComponent />);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "false");

      await user.click(button);
      expect(button).toHaveAttribute("aria-pressed", "true");

      await user.click(button);
      expect(button).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("Interactions", () => {
    test("calls onPress when clicked", async () => {
      const user = userEvent.setup();
      const onPress = vi.fn();

      render(
        <IconButton aria-label="Delete" onPress={onPress}>
          <IconDelete />
        </IconButton>
      );

      await user.click(screen.getByRole("button"));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    test("does not call onPress when disabled", async () => {
      const user = userEvent.setup();
      const onPress = vi.fn();

      render(
        <IconButton aria-label="Delete" onPress={onPress} isDisabled>
          <IconDelete />
        </IconButton>
      );

      await user.click(screen.getByRole("button"));
      expect(onPress).not.toHaveBeenCalled();
    });

    test("handles keyboard interaction with Enter key", async () => {
      const user = userEvent.setup();
      const onPress = vi.fn();

      render(
        <IconButton aria-label="Delete" onPress={onPress}>
          <IconDelete />
        </IconButton>
      );

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard("{Enter}");
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    test("handles keyboard interaction with Space key", async () => {
      const user = userEvent.setup();
      const onPress = vi.fn();

      render(
        <IconButton aria-label="Delete" onPress={onPress}>
          <IconDelete />
        </IconButton>
      );

      const button = screen.getByRole("button");
      button.focus();
      await user.keyboard(" ");
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    test("is keyboard accessible", () => {
      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(isKeyboardAccessible(button)).toBe(true);
    });

    test("shows focus indicator when focused", () => {
      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();
    });

    test("handles rapid clicks", async () => {
      const user = userEvent.setup();
      const onPress = vi.fn();

      render(
        <IconButton aria-label="Delete" onPress={onPress}>
          <IconDelete />
        </IconButton>
      );

      const button = screen.getByRole("button");
      await user.tripleClick(button);
      expect(onPress).toHaveBeenCalledTimes(3);
    });
  });

  describe("Accessibility", () => {
    test("has accessible label", () => {
      render(
        <IconButton aria-label="Delete item">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(hasAccessibleLabel(button)).toBe(true);
    });

    test("requires aria-label (enforced by types)", () => {
      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAccessibleName("Delete");
    });

    test("supports aria-pressed for toggle buttons", () => {
      render(
        <IconButton aria-label="Favorite" selected>
          <IconFavorite />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    });

    test("does not set aria-pressed when not a toggle button", () => {
      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).not.toHaveAttribute("aria-pressed");
    });

    test("has proper button role", () => {
      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    test("disabled button is properly disabled", () => {
      render(
        <IconButton aria-label="Delete" isDisabled>
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("disabled");
    });
  });

  describe("Ripple Effect", () => {
    test("shows ripple container by default", () => {
      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      expect(
        screen.getByRole("button").querySelector("[data-ripple-container]")
      ).toBeInTheDocument();
    });

    test("disables ripple when disableRipple is true", () => {
      render(
        <IconButton aria-label="Delete" disableRipple>
          <IconDelete />
        </IconButton>
      );
      expect(
        screen.getByRole("button").querySelector("[data-ripple-container]")
      ).not.toBeInTheDocument();
    });

    test("does not show ripple when disabled", () => {
      render(
        <IconButton aria-label="Delete" isDisabled>
          <IconDelete />
        </IconButton>
      );
      expect(
        screen.getByRole("button").querySelector("[data-ripple-container]")
      ).not.toBeInTheDocument();
    });
  });

  describe("Button Types", () => {
    test("defaults to button type", () => {
      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });

    test("supports submit type", () => {
      render(
        <IconButton aria-label="Submit" type="submit">
          <IconEdit />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });

    test("supports reset type", () => {
      render(
        <IconButton aria-label="Reset" type="reset">
          <IconEdit />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("type", "reset");
    });
  });

  describe("Variant combinations", () => {
    test("renders all variant and color combinations", () => {
      const variants = ["standard", "filled", "tonal", "outlined"] as const;
      const colors = ["primary", "secondary", "tertiary", "error"] as const;

      variants.forEach((variant) => {
        colors.forEach((color) => {
          const { container } = render(
            <IconButton aria-label={`${variant}-${color}`} variant={variant} color={color}>
              <IconDelete />
            </IconButton>
          );
          expect(container.querySelector("button")).toBeInTheDocument();
        });
      });
    });

    test("renders all 5 size variations", () => {
      const sizes = ["xsmall", "small", "medium", "large", "xlarge"] as const;

      sizes.forEach((size) => {
        const { container } = render(
          <IconButton aria-label={`${size} button`} size={size}>
            <IconDelete />
          </IconButton>
        );
        expect(container.querySelector("button")).toBeInTheDocument();
      });
    });

    test("renders all width variations", () => {
      const widths = ["narrow", "default", "wide"] as const;

      widths.forEach((width) => {
        const { container } = render(
          <IconButton aria-label={`${width} button`} width={width}>
            <IconDelete />
          </IconButton>
        );
        expect(container.querySelector("button")).toBeInTheDocument();
      });
    });

    test("renders both shape variations", () => {
      const shapes = ["round", "square"] as const;

      shapes.forEach((shape) => {
        const { container } = render(
          <IconButton aria-label={`${shape} button`} shape={shape}>
            <IconDelete />
          </IconButton>
        );
        expect(container.querySelector("button")).toBeInTheDocument();
      });
    });
  });

  describe("Edge Cases", () => {
    test("handles missing icon gracefully", () => {
      render(<IconButton aria-label="Empty">{null}</IconButton>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    test("forwards ref correctly", () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <IconButton aria-label="Delete" ref={ref}>
          <IconDelete />
        </IconButton>
      );
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe("data attributes for styling and ButtonGroup integration", () => {
    test("sets data-variant attribute matching the variant prop", () => {
      render(
        <IconButton aria-label="Test" variant="filled">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-variant", "filled");
    });

    test("sets data-color attribute matching the color prop", () => {
      render(
        <IconButton aria-label="Test" variant="filled" color="primary">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-color", "primary");
    });

    test("sets data-size attribute", () => {
      render(
        <IconButton aria-label="Test" size="large">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-size", "large");
    });

    test("sets data-shape attribute", () => {
      render(
        <IconButton aria-label="Test" shape="square">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-shape", "square");
    });

    test("sets data-width attribute", () => {
      render(
        <IconButton aria-label="Test" width="wide">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toHaveAttribute("data-width", "wide");
    });
  });

  describe("ButtonGroup context consumption", () => {
    test("standalone IconButton renders normally without group context", () => {
      render(
        <IconButton aria-label="Test">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      // Round shape uses CSS variable rather than rounded-full
      expect(button).toHaveAttribute("data-shape", "round");
      expect(button.className).toContain("[--ib-radius:9999px]");
      expect(button).not.toHaveClass("rounded-xs");
      expect(button).not.toHaveClass("rounded-sm");
    });

    test("IconButton inside connected group applies inner radius class", () => {
      render(
        <ButtonGroup variant="connected" size="medium" aria-label="Group">
          <IconButton aria-label="First">
            <IconDelete />
          </IconButton>
          <IconButton aria-label="Second">
            <IconFavorite />
          </IconButton>
        </ButtonGroup>
      );
      const buttons = screen.getAllByRole("button");
      buttons.forEach((btn) => {
        expect(btn).toHaveClass("rounded-sm");
      });
    });

    test("IconButton inside connected round group applies graduated outer radius", () => {
      render(
        <ButtonGroup variant="connected" size="medium" shape="round" aria-label="Group">
          <IconButton aria-label="A">
            <IconDelete />
          </IconButton>
          <IconButton aria-label="B">
            <IconFavorite />
          </IconButton>
        </ButtonGroup>
      );
      const buttons = screen.getAllByRole("button");
      expect(buttons[0].className).toContain("first:rounded-s-3xl");
      expect(buttons[0].className).toContain("last:rounded-e-3xl");
    });

    test("IconButton inside connected large group has rounded-lg inner radius", () => {
      render(
        <ButtonGroup variant="connected" size="large" aria-label="Group">
          <IconButton aria-label="A">
            <IconDelete />
          </IconButton>
          <IconButton aria-label="B">
            <IconFavorite />
          </IconButton>
        </ButtonGroup>
      );
      const buttons = screen.getAllByRole("button");
      buttons.forEach((btn) => {
        expect(btn).toHaveClass("rounded-lg");
      });
    });

    test("IconButton inside connected extra-large group applies rounded-[20px]", () => {
      render(
        <ButtonGroup variant="connected" size="extra-large" shape="round" aria-label="Group">
          <IconButton aria-label="A">
            <IconDelete />
          </IconButton>
          <IconButton aria-label="B">
            <IconFavorite />
          </IconButton>
        </ButtonGroup>
      );
      const buttons = screen.getAllByRole("button");
      buttons.forEach((btn) => {
        expect(btn.className).toContain("rounded-[20px]");
      });
    });

    test("IconButton inside connected square group applies square outer radius", () => {
      render(
        <ButtonGroup variant="connected" size="small" shape="square" aria-label="Group">
          <IconButton aria-label="A">
            <IconDelete />
          </IconButton>
          <IconButton aria-label="B">
            <IconFavorite />
          </IconButton>
        </ButtonGroup>
      );
      const buttons = screen.getAllByRole("button");
      expect(buttons[0].className).toContain("first:rounded-s-sm");
      expect(buttons[0].className).toContain("last:rounded-e-sm");
    });

    test("IconButton inside connected extra-small/small group has min-w-12", () => {
      render(
        <ButtonGroup variant="connected" size="extra-small" aria-label="Group">
          <IconButton aria-label="A">
            <IconDelete />
          </IconButton>
          <IconButton aria-label="B">
            <IconFavorite />
          </IconButton>
        </ButtonGroup>
      );
      const buttons = screen.getAllByRole("button");
      buttons.forEach((btn) => {
        expect(btn).toHaveClass("min-w-12");
      });
    });

    test("IconButton inside connected small group has min-w-12", () => {
      render(
        <ButtonGroup variant="connected" size="small" aria-label="Group">
          <IconButton aria-label="A">
            <IconDelete />
          </IconButton>
        </ButtonGroup>
      );
      expect(screen.getByRole("button")).toHaveClass("min-w-12");
    });

    test("IconButton inside connected medium group does NOT have min-w-12", () => {
      render(
        <ButtonGroup variant="connected" size="medium" aria-label="Group">
          <IconButton aria-label="A">
            <IconDelete />
          </IconButton>
        </ButtonGroup>
      );
      expect(screen.getByRole("button")).not.toHaveClass("min-w-12");
    });

    test("IconButton inside standard group does NOT apply connected radius classes", () => {
      render(
        <ButtonGroup variant="standard" size="medium" aria-label="Group">
          <IconButton aria-label="A">
            <IconDelete />
          </IconButton>
        </ButtonGroup>
      );
      const button = screen.getByRole("button");
      // Round shape uses CSS variable rather than rounded-full
      expect(button).toHaveAttribute("data-shape", "round");
      expect(button.className).toContain("[--ib-radius:9999px]");
      expect(button).not.toHaveClass("rounded-sm");
      expect(button).not.toHaveClass("min-w-12");
    });
  });

  describe("Development Warnings", () => {
    const originalEnv = process.env.NODE_ENV;
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
      consoleWarn.mockClear();
    });

    test("warns when icon is missing in development", () => {
      process.env.NODE_ENV = "development";

      render(<IconButton aria-label="Empty">{null}</IconButton>);

      expect(consoleWarn).toHaveBeenCalledWith(
        "[IconButton] IconButton should have an icon as children."
      );
    });
  });

  describe("Axe Accessibility", () => {
    test("has no accessibility violations", async () => {
      const { container } = render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations when disabled", async () => {
      const { container } = render(
        <IconButton aria-label="Delete" isDisabled>
          <IconDelete />
        </IconButton>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations in toggle mode", async () => {
      const { container } = render(
        <IconButton aria-label="Favorite" selected={false}>
          <IconFavorite />
        </IconButton>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
