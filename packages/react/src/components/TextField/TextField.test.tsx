/**
 * TextField Component Tests
 *
 * Comprehensive test suite for the MD3 TextField component.
 * Follows TDD approach with tests for rendering, variants, states,
 * interactions, accessibility, and edge cases.
 */

import { useState } from "react";
import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { isKeyboardAccessible, hasAccessibleLabel } from "../../../test/helpers";
import { TextField } from "./TextField";

describe("TextField", () => {
  describe("Rendering", () => {
    test("renders input with label", () => {
      render(<TextField label="Email" />);
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });

    test("renders input without label (aria-label)", () => {
      render(<TextField aria-label="Search" />);
      const input = screen.getByRole("textbox", { name: "Search" });
      expect(input).toBeInTheDocument();
    });

    test("renders with helper text", () => {
      render(<TextField label="Email" description="Enter your email address" />);
      expect(screen.getByText("Enter your email address")).toBeInTheDocument();
    });

    test("renders with placeholder", () => {
      render(<TextField label="Email" placeholder="email@example.com" />);
      expect(screen.getByPlaceholderText("email@example.com")).toBeInTheDocument();
    });

    test("renders with default value", () => {
      render(<TextField label="Email" defaultValue="test@example.com" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("test@example.com");
    });

    test("forwards ref to input element", () => {
      const ref = { current: null };
      render(<TextField label="Email" ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    test("merges custom className with default classes", () => {
      const { container } = render(<TextField label="Email" className="custom-class" />);
      const rootContainer = container.firstChild as HTMLElement;
      expect(rootContainer).toHaveClass("custom-class");
    });
  });

  describe("Variants", () => {
    test("renders filled variant (default)", () => {
      render(<TextField label="Email" variant="filled" />);
      const container = screen.getByRole("textbox").closest("div");
      expect(container).toHaveClass("bg-surface-container-highest");
    });

    test("renders outlined variant", () => {
      render(<TextField label="Email" variant="outlined" />);
      const container = screen.getByRole("textbox").closest("div");
      expect(container).toHaveClass("border", "border-outline");
    });
  });

  describe("Sizes", () => {
    test("renders small size", () => {
      render(<TextField label="Email" size="small" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("h-10");
    });

    test("renders medium size (default)", () => {
      render(<TextField label="Email" size="medium" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("h-12");
    });

    test("renders large size", () => {
      render(<TextField label="Email" size="large" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("h-14");
    });
  });

  describe("States", () => {
    test("renders disabled state", () => {
      render(<TextField label="Email" isDisabled />);
      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
      expect(input).toHaveClass("cursor-not-allowed");
    });

    test("renders error state with message", () => {
      render(<TextField label="Email" errorMessage="Email is required" isInvalid />);
      expect(screen.getByText("Email is required")).toBeInTheDocument();
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    test("renders required field", () => {
      render(<TextField label="Email" isRequired />);
      const input = screen.getByRole("textbox");
      expect(input).toBeRequired();
    });

    test("renders readonly field", () => {
      render(<TextField label="Email" isReadOnly />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("readonly");
    });

    test("renders full width", () => {
      render(<TextField label="Email" fullWidth />);
      const container = screen.getByRole("textbox").closest("div");
      expect(container).toHaveClass("w-full");
    });
  });

  describe("Interactions", () => {
    test("calls onChange when input value changes", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<TextField label="Email" onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "test");

      expect(handleChange).toHaveBeenCalled();
      expect(input).toHaveValue("test");
    });

    test("calls onFocus when input receives focus", async () => {
      const handleFocus = vi.fn();
      const user = userEvent.setup();
      render(<TextField label="Email" onFocus={handleFocus} />);

      const input = screen.getByRole("textbox");
      await user.click(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    test("calls onBlur when input loses focus", async () => {
      const handleBlur = vi.fn();
      const user = userEvent.setup();
      render(<TextField label="Email" onBlur={handleBlur} />);

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.tab();

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    test("does not allow input when disabled", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<TextField label="Email" isDisabled onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "test");

      expect(handleChange).not.toHaveBeenCalled();
      expect(input).toHaveValue("");
    });
  });

  describe("Accessibility", () => {
    test("is keyboard accessible", () => {
      render(<TextField label="Email" />);
      const input = screen.getByRole("textbox");
      expect(isKeyboardAccessible(input)).toBe(true);
    });

    test("has accessible label", () => {
      render(<TextField label="Email" />);
      const input = screen.getByRole("textbox");
      expect(hasAccessibleLabel(input)).toBe(true);
    });

    test("links description via aria-describedby", () => {
      render(<TextField label="Email" description="Enter your email" />);
      const input = screen.getByRole("textbox");
      const description = screen.getByText("Enter your email");
      expect(input).toHaveAttribute("aria-describedby");
      expect(input.getAttribute("aria-describedby")).toContain(description.id);
    });

    test("links error message via aria-describedby", () => {
      render(<TextField label="Email" errorMessage="Email is required" isInvalid />);
      const input = screen.getByRole("textbox");
      const error = screen.getByText("Email is required");
      expect(input).toHaveAttribute("aria-describedby");
      expect(input.getAttribute("aria-describedby")).toContain(error.id);
    });

    test("has correct aria-invalid when invalid", () => {
      render(<TextField label="Email" isInvalid />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    test("has correct aria-required when required", () => {
      render(<TextField label="Email" isRequired />);
      const input = screen.getByRole("textbox");
      expect(input).toBeRequired();
    });
  });

  describe("Icons", () => {
    test("renders leading icon", () => {
      const LeadingIcon = () => <svg data-testid="leading-icon" />;
      render(<TextField label="Email" leadingIcon={<LeadingIcon />} />);
      expect(screen.getByTestId("leading-icon")).toBeInTheDocument();
    });

    test("renders trailing icon", () => {
      const TrailingIcon = () => <svg data-testid="trailing-icon" />;
      render(<TextField label="Email" trailingIcon={<TrailingIcon />} />);
      expect(screen.getByTestId("trailing-icon")).toBeInTheDocument();
    });

    test("renders both leading and trailing icons", () => {
      const LeadingIcon = () => <svg data-testid="leading-icon" />;
      const TrailingIcon = () => <svg data-testid="trailing-icon" />;
      render(
        <TextField label="Email" leadingIcon={<LeadingIcon />} trailingIcon={<TrailingIcon />} />
      );
      expect(screen.getByTestId("leading-icon")).toBeInTheDocument();
      expect(screen.getByTestId("trailing-icon")).toBeInTheDocument();
    });
  });

  describe("Multiline", () => {
    test("renders textarea when multiline is true", () => {
      render(<TextField label="Message" multiline />);
      const textarea = screen.getByRole("textbox");
      expect(textarea.tagName).toBe("TEXTAREA");
    });

    test("renders input when multiline is false", () => {
      render(<TextField label="Email" multiline={false} />);
      const input = screen.getByRole("textbox");
      expect(input.tagName).toBe("INPUT");
    });

    test("applies rows prop to textarea", () => {
      render(<TextField label="Message" multiline rows={5} />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("rows", "5");
    });

    test("supports default value in multiline mode", () => {
      render(<TextField label="Message" multiline defaultValue="Hello world" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("Hello world");
    });
  });

  describe("Character Counter", () => {
    test("renders character counter when enabled", () => {
      render(<TextField label="Bio" characterCount maxLength={100} defaultValue="Hello" />);
      expect(screen.getByText("5 / 100")).toBeInTheDocument();
    });

    test("updates character count on input", async () => {
      const user = userEvent.setup();
      render(<TextField label="Bio" characterCount maxLength={100} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "Test");

      expect(screen.getByText("4 / 100")).toBeInTheDocument();
    });

    test("does not render counter when characterCount is false", () => {
      render(<TextField label="Bio" characterCount={false} maxLength={100} defaultValue="Hello" />);
      expect(screen.queryByText("5 / 100")).not.toBeInTheDocument();
    });

    test("enforces maxLength", async () => {
      const user = userEvent.setup();
      render(<TextField label="Bio" maxLength={5} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "12345678");

      expect(input).toHaveValue("12345");
    });
  });

  describe("Edge Cases", () => {
    test("handles empty value", () => {
      render(<TextField label="Email" value="" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("");
    });

    test("handles long text", async () => {
      const longText = "a".repeat(1000);
      const user = userEvent.setup();
      render(<TextField label="Email" />);

      const input = screen.getByRole("textbox");
      await user.type(input, longText);

      expect(input).toHaveValue(longText);
    });

    test("handles special characters", async () => {
      const specialText = "test@example.com!#$%";
      const user = userEvent.setup();
      render(<TextField label="Email" />);

      const input = screen.getByRole("textbox");
      await user.type(input, specialText);

      expect(input).toHaveValue(specialText);
    });

    test("handles controlled component", async () => {
      const ControlledTextField = () => {
        const [value, setValue] = useState("");
        return (
          <TextField
            label="Email"
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          />
        );
      };

      const user = userEvent.setup();
      render(<ControlledTextField />);

      const input = screen.getByRole("textbox");
      await user.type(input, "test");

      expect(input).toHaveValue("test");
    });

    test("handles both description and error message", () => {
      render(
        <TextField
          label="Email"
          description="Enter your email"
          errorMessage="Email is required"
          isInvalid
        />
      );
      // When error is shown, description is hidden per MD3 spec
      expect(screen.queryByText("Enter your email")).not.toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
  });

  describe("Custom Props", () => {
    test("forwards HTML input attributes", () => {
      render(<TextField label="Email" type="email" autoComplete="email" name="email" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "email");
      expect(input).toHaveAttribute("autocomplete", "email");
      expect(input).toHaveAttribute("name", "email");
    });

    test("supports inputMode prop", () => {
      render(<TextField label="Phone" inputMode="tel" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("inputmode", "tel");
    });

    test("supports pattern validation", () => {
      render(<TextField label="Phone" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("pattern", "[0-9]{3}-[0-9]{3}-[0-9]{4}");
    });
  });
});
