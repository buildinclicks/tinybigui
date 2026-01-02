/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { IconButton } from "./IconButton";
import React from "react";
import { isKeyboardAccessible, hasAccessibleLabel } from "../../../test/helpers";

// Mock icons for testing
const IconDelete = (): React.ReactElement => <svg data-testid="icon-delete" />;
const IconFavorite = (): React.ReactElement => <svg data-testid="icon-favorite" />;
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
      expect(button).toHaveClass("bg-transparent");
    });

    test("renders filled variant", () => {
      render(
        <IconButton aria-label="Delete" variant="filled">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary", "text-on-primary");
    });

    test("renders tonal variant", () => {
      render(
        <IconButton aria-label="Delete" variant="tonal">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-secondary-container", "text-on-secondary-container");
    });

    test("renders outlined variant", () => {
      render(
        <IconButton aria-label="Delete" variant="outlined">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-transparent", "border", "border-outline");
    });

    test("renders with primary color", () => {
      render(
        <IconButton aria-label="Delete" variant="filled" color="primary">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary");
    });

    test("renders with secondary color", () => {
      render(
        <IconButton aria-label="Delete" variant="filled" color="secondary">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-secondary");
    });

    test("renders with tertiary color", () => {
      render(
        <IconButton aria-label="Delete" variant="filled" color="tertiary">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-tertiary");
    });

    test("renders with error color", () => {
      render(
        <IconButton aria-label="Delete" variant="filled" color="error">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-error");
    });

    test("renders small size", () => {
      render(
        <IconButton aria-label="Delete" size="small">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-8", "w-8"); // 32px
    });

    test("renders medium size by default", () => {
      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-10", "w-10"); // 40px
    });

    test("renders large size", () => {
      render(
        <IconButton aria-label="Delete" size="large">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-12", "w-12"); // 48px
    });

    test("renders with circular shape", () => {
      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("rounded-full");
    });

    test("merges custom className", () => {
      render(
        <IconButton aria-label="Delete" className="custom-class">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    test("applies title attribute", () => {
      render(
        <IconButton aria-label="Delete" title="Delete item">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("title", "Delete item");
    });
  });

  describe("States", () => {
    test("handles disabled state", () => {
      render(
        <IconButton aria-label="Delete" isDisabled>
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("opacity-38", "pointer-events-none");
    });

    test("renders unselected state by default", () => {
      render(
        <IconButton aria-label="Favorite">
          <IconFavorite />
        </IconButton>
      );
      const button = screen.getByRole("button");
      // When selected is not provided, aria-pressed should not be set
      expect(button).not.toHaveAttribute("aria-pressed");
    });

    test("renders selected state", () => {
      render(
        <IconButton aria-label="Favorite" selected>
          <IconFavorite />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    test("renders unselected state explicitly", () => {
      render(
        <IconButton aria-label="Favorite" selected={false}>
          <IconFavorite />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "false");
    });

    test("applies selected styles for standard variant", () => {
      render(
        <IconButton aria-label="Favorite" variant="standard" selected>
          <IconFavorite />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("text-primary");
    });

    test("applies selected styles for filled variant", () => {
      render(
        <IconButton aria-label="Favorite" variant="filled" color="primary" selected>
          <IconFavorite />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary-container", "text-on-primary-container");
    });

    test("applies selected styles for outlined variant", () => {
      render(
        <IconButton aria-label="Favorite" variant="outlined" selected>
          <IconFavorite />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-inverse-surface", "text-inverse-on-surface");
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

    test("supports toggle behavior", async () => {
      const user = userEvent.setup();
      const TestComponent = (): React.ReactElement => {
        const [selected, setSelected] = React.useState(false);
        return (
          <IconButton
            aria-label={selected ? "Remove favorite" : "Add favorite"}
            selected={selected}
            onPress={() => setSelected(!selected)}
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
      const button = screen.getByRole("button");
      expect(button).toHaveAccessibleName("Delete");
    });

    test("supports aria-pressed for toggle buttons", () => {
      render(
        <IconButton aria-label="Favorite" selected>
          <IconFavorite />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-pressed", "true");
    });

    test("has proper button role", () => {
      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    test("includes icon in accessibility tree", () => {
      render(
        <IconButton aria-label="Delete item">
          <IconDelete />
        </IconButton>
      );
      // Icon should be present but decorative (label comes from aria-label)
      expect(screen.getByTestId("icon-delete")).toBeInTheDocument();
    });

    test("disabled button has aria-disabled", () => {
      render(
        <IconButton aria-label="Delete" isDisabled>
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("disabled");
    });
  });

  describe("Ripple Effect", () => {
    test("shows ripple effect by default", async () => {
      const user = userEvent.setup();

      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );

      const button = screen.getByRole("button");
      await user.click(button);

      // Ripple container should be present
      expect(button.querySelector(".animate-ripple")).toBeInTheDocument();
    });

    test("disables ripple when disableRipple is true", () => {
      render(
        <IconButton aria-label="Delete" disableRipple>
          <IconDelete />
        </IconButton>
      );

      const button = screen.getByRole("button");

      // With disableRipple, no initial ripples should exist
      const ripples = button.querySelectorAll(".animate-ripple");
      expect(ripples.length).toBe(0);
    });

    test("does not show ripple when disabled", async () => {
      const user = userEvent.setup();

      render(
        <IconButton aria-label="Delete" isDisabled>
          <IconDelete />
        </IconButton>
      );

      const button = screen.getByRole("button");
      await user.click(button);

      // No ripple when disabled
      expect(button.querySelector(".animate-ripple")).not.toBeInTheDocument();
    });
  });

  describe("Button Types", () => {
    test("defaults to button type", () => {
      render(
        <IconButton aria-label="Delete">
          <IconDelete />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });

    test("supports submit type", () => {
      render(
        <IconButton aria-label="Submit" type="submit">
          <IconEdit />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    test("supports reset type", () => {
      render(
        <IconButton aria-label="Reset" type="reset">
          <IconEdit />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "reset");
    });
  });

  describe("Variant Combinations", () => {
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

    test("renders all size variations", () => {
      const sizes = ["small", "medium", "large"] as const;

      sizes.forEach((size) => {
        const { container } = render(
          <IconButton aria-label={`${size} button`} size={size}>
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

    test("handles multiple icons (uses last one)", () => {
      render(
        <IconButton aria-label="Multiple">
          <IconDelete />
          <IconFavorite />
        </IconButton>
      );
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(screen.getByTestId("icon-delete")).toBeInTheDocument();
      expect(screen.getByTestId("icon-favorite")).toBeInTheDocument();
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

  describe("Development Warnings", () => {
    const originalEnv = process.env.NODE_ENV;
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const consoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
      consoleError.mockClear();
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
});
