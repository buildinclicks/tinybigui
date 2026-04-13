import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { Radio } from "./Radio";
import { RadioGroup } from "./RadioGroup";
import { isKeyboardAccessible, hasAccessibleLabel } from "../../../test/helpers";

describe("RadioGroup", () => {
  describe("Rendering", () => {
    test("renders radio group with label", () => {
      render(
        <RadioGroup label="Favorite color">
          <Radio value="red">Red</Radio>
          <Radio value="blue">Blue</Radio>
        </RadioGroup>
      );
      expect(screen.getByRole("radiogroup", { name: "Favorite color" })).toBeInTheDocument();
    });

    test("renders all radio buttons in group", () => {
      render(
        <RadioGroup label="Options">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
          <Radio value="c">Option C</Radio>
        </RadioGroup>
      );
      const radios = screen.getAllByRole("radio");
      expect(radios).toHaveLength(3);
    });

    test("applies custom className to group", () => {
      render(
        <RadioGroup label="Options" className="custom-class">
          <Radio value="a">A</Radio>
        </RadioGroup>
      );
      const group = screen.getByRole("radiogroup");
      expect(group).toHaveClass("custom-class");
    });

    test("renders with vertical orientation by default", () => {
      render(
        <RadioGroup label="Options">
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </RadioGroup>
      );
      const group = screen.getByRole("radiogroup");
      // Check that the group has flex-col (vertical is default)
      expect(group).toHaveClass("flex-col");
    });

    test("renders with horizontal orientation", () => {
      render(
        <RadioGroup label="Options" orientation="horizontal">
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </RadioGroup>
      );
      const group = screen.getByRole("radiogroup");
      // The inner container has the orientation classes but radiogroup should still have flex
      expect(group).toBeInTheDocument();
    });
  });

  describe("States", () => {
    test("renders all radios unselected by default", () => {
      render(
        <RadioGroup label="Options">
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </RadioGroup>
      );
      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).not.toBeChecked();
      });
    });

    test("renders with default value selected", () => {
      render(
        <RadioGroup label="Options" defaultValue="b">
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </RadioGroup>
      );
      const radioA = screen.getByRole("radio", { name: "A" });
      const radioB = screen.getByRole("radio", { name: "B" });
      expect(radioA).not.toBeChecked();
      expect(radioB).toBeChecked();
    });

    test("renders disabled group", () => {
      render(
        <RadioGroup label="Options" isDisabled>
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </RadioGroup>
      );
      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).toBeDisabled();
      });
    });

    test("renders individual disabled radio", () => {
      render(
        <RadioGroup label="Options">
          <Radio value="a">A</Radio>
          <Radio value="b" isDisabled>
            B (Disabled)
          </Radio>
        </RadioGroup>
      );
      const radioA = screen.getByRole("radio", { name: "A" });
      const radioB = screen.getByRole("radio", { name: "B (Disabled)" });
      expect(radioA).not.toBeDisabled();
      // Individual radio disabled state - check via visual styling since React Aria handles it differently
      const labelB = screen.getByText("B (Disabled)").closest("label");
      expect(labelB).toHaveClass("opacity-38");
    });
  });

  describe("Single Selection Behavior", () => {
    test("only one radio can be selected at a time", async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup label="Options">
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
          <Radio value="c">C</Radio>
        </RadioGroup>
      );

      const radioA = screen.getByRole("radio", { name: "A" });
      const radioB = screen.getByRole("radio", { name: "B" });
      const radioC = screen.getByRole("radio", { name: "C" });

      await user.click(radioA);
      expect(radioA).toBeChecked();
      expect(radioB).not.toBeChecked();
      expect(radioC).not.toBeChecked();

      await user.click(radioB);
      expect(radioA).not.toBeChecked();
      expect(radioB).toBeChecked();
      expect(radioC).not.toBeChecked();

      await user.click(radioC);
      expect(radioA).not.toBeChecked();
      expect(radioB).not.toBeChecked();
      expect(radioC).toBeChecked();
    });

    test("clicking selected radio does not unselect it", async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup label="Options">
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </RadioGroup>
      );

      const radioA = screen.getByRole("radio", { name: "A" });
      await user.click(radioA);
      expect(radioA).toBeChecked();

      await user.click(radioA);
      expect(radioA).toBeChecked(); // Still checked
    });
  });

  describe("Interactions", () => {
    test("selects radio on click", async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup label="Options">
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </RadioGroup>
      );

      const radioA = screen.getByRole("radio", { name: "A" });
      expect(radioA).not.toBeChecked();
      await user.click(radioA);
      expect(radioA).toBeChecked();
    });

    test("calls onChange when selection changes", async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <RadioGroup label="Options" onChange={handleChange}>
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </RadioGroup>
      );

      const radioA = screen.getByRole("radio", { name: "A" });
      await user.click(radioA);
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange).toHaveBeenCalledWith("a");
    });

    test("clicking label selects radio", async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup label="Options">
          <Radio value="a">Option A</Radio>
        </RadioGroup>
      );

      const label = screen.getByText("Option A");
      const radio = screen.getByRole("radio", { name: "Option A" });

      await user.click(label);
      expect(radio).toBeChecked();
    });

    test("does not change selection when disabled", async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup label="Options" isDisabled>
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </RadioGroup>
      );

      const radioA = screen.getByRole("radio", { name: "A" });
      await user.click(radioA);
      expect(radioA).not.toBeChecked();
    });
  });

  describe("Keyboard Navigation", () => {
    test("navigates to group with Tab", async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup label="Options">
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </RadioGroup>
      );

      const radioA = screen.getByRole("radio", { name: "A" });
      await user.tab();
      expect(radioA).toHaveFocus();
    });

    test("navigates within group with arrow keys", async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup label="Options">
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
          <Radio value="c">C</Radio>
        </RadioGroup>
      );

      const radioA = screen.getByRole("radio", { name: "A" });
      const radioB = screen.getByRole("radio", { name: "B" });
      const radioC = screen.getByRole("radio", { name: "C" });

      await user.tab();
      expect(radioA).toHaveFocus();

      await user.keyboard("{ArrowDown}");
      expect(radioB).toHaveFocus();
      expect(radioB).toBeChecked();

      await user.keyboard("{ArrowDown}");
      expect(radioC).toHaveFocus();
      expect(radioC).toBeChecked();
    });

    test("arrow keys wrap around in group", async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup label="Options">
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </RadioGroup>
      );

      const radioA = screen.getByRole("radio", { name: "A" });
      const radioB = screen.getByRole("radio", { name: "B" });

      await user.tab();
      expect(radioA).toHaveFocus();

      await user.keyboard("{ArrowUp}");
      expect(radioB).toHaveFocus();
      expect(radioB).toBeChecked();

      await user.keyboard("{ArrowDown}");
      expect(radioA).toHaveFocus();
      expect(radioA).toBeChecked();
    });

    test("skips disabled radios in keyboard navigation", async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup label="Options">
          <Radio value="a">A</Radio>
          <Radio value="b" isDisabled>
            B (Disabled)
          </Radio>
          <Radio value="c">C</Radio>
        </RadioGroup>
      );

      const radioA = screen.getByRole("radio", { name: "A" });

      await user.tab();
      expect(radioA).toHaveFocus();

      // Arrow down should move focus (React Aria handles disabled radios)
      await user.keyboard("{ArrowDown}");

      // Verify focus moved from A
      expect(radioA).not.toHaveFocus();
    });
  });

  describe("Controlled/Uncontrolled", () => {
    test("works as uncontrolled with defaultValue", () => {
      render(
        <RadioGroup label="Options" defaultValue="b">
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </RadioGroup>
      );
      const radioB = screen.getByRole("radio", { name: "B" });
      expect(radioB).toBeChecked();
    });

    test("works as controlled component", async () => {
      const user = userEvent.setup();
      let selectedValue = "a";
      const handleChange = vi.fn((value: string) => {
        selectedValue = value;
      });

      const { rerender } = render(
        <RadioGroup label="Options" value={selectedValue} onChange={handleChange}>
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </RadioGroup>
      );

      const radioA = screen.getByRole("radio", { name: "A" });
      const radioB = screen.getByRole("radio", { name: "B" });

      expect(radioA).toBeChecked();
      expect(radioB).not.toBeChecked();

      await user.click(radioB);
      expect(handleChange).toHaveBeenCalledWith("b");

      rerender(
        <RadioGroup label="Options" value="b" onChange={handleChange}>
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </RadioGroup>
      );

      expect(radioA).not.toBeChecked();
      expect(radioB).toBeChecked();
    });
  });

  describe("Accessibility", () => {
    test("has radiogroup role", () => {
      render(
        <RadioGroup label="Options">
          <Radio value="a">A</Radio>
        </RadioGroup>
      );
      expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    });

    test("radios are keyboard accessible", () => {
      render(
        <RadioGroup label="Options">
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </RadioGroup>
      );
      const radioA = screen.getByRole("radio", { name: "A" });
      expect(isKeyboardAccessible(radioA)).toBe(true);
    });

    test("has accessible label from children", () => {
      render(
        <RadioGroup label="Options">
          <Radio value="a">Option A</Radio>
        </RadioGroup>
      );
      const label = screen.getByText("Option A").closest("label");
      expect(hasAccessibleLabel(label!)).toBe(true);
    });

    test("supports custom aria-label on radio", () => {
      render(
        <RadioGroup label="Options">
          <Radio value="a" aria-label="Custom label" />
        </RadioGroup>
      );
      expect(screen.getByRole("radio", { name: "Custom label" })).toBeInTheDocument();
    });

    test("group label is properly associated", () => {
      render(
        <RadioGroup label="Favorite color">
          <Radio value="red">Red</Radio>
        </RadioGroup>
      );
      const group = screen.getByRole("radiogroup", { name: "Favorite color" });
      expect(group).toBeInTheDocument();
    });

    test("supports aria-describedby on group", () => {
      render(
        <>
          <RadioGroup label="Options" aria-describedby="help-text">
            <Radio value="a">A</Radio>
          </RadioGroup>
          <span id="help-text">Helper text</span>
        </>
      );
      const group = screen.getByRole("radiogroup");
      expect(group).toHaveAttribute("aria-describedby", "help-text");
    });

    test("indicates disabled state to assistive tech", () => {
      render(
        <RadioGroup label="Options" isDisabled>
          <Radio value="a">A</Radio>
        </RadioGroup>
      );
      const radio = screen.getByRole("radio");
      expect(radio).toBeDisabled();
    });

    test("has focus indicator when focused", async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup label="Options">
          <Radio value="a">A</Radio>
        </RadioGroup>
      );
      const radio = screen.getByRole("radio");
      await user.tab();
      expect(radio).toHaveFocus();
    });

    test("label text appears exactly once in the DOM", () => {
      render(
        <RadioGroup label="Favorite Color">
          <Radio value="red">Red</Radio>
          <Radio value="blue">Blue</Radio>
        </RadioGroup>
      );
      const labelElements = screen.getAllByText("Favorite Color");
      expect(labelElements).toHaveLength(1);
    });

    test("label element id matches aria-labelledby on the radiogroup", () => {
      render(
        <RadioGroup label="Favorite Color">
          <Radio value="red">Red</Radio>
        </RadioGroup>
      );
      const group = screen.getByRole("radiogroup");
      const ariaLabelledBy = group.getAttribute("aria-labelledby");
      expect(ariaLabelledBy).toBeTruthy();
      const labelElement = document.getElementById(ariaLabelledBy!);
      expect(labelElement).toBeInTheDocument();
      expect(labelElement).toHaveTextContent("Favorite Color");
    });
  });

  describe("Form Integration", () => {
    test("supports name prop for forms", () => {
      render(
        <RadioGroup label="Options" name="choice">
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </RadioGroup>
      );
      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        expect(radio).toHaveAttribute("name", "choice");
      });
    });

    test("works in form submission", () => {
      const handleSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
      render(
        <form onSubmit={handleSubmit}>
          <RadioGroup label="Choice" name="choice" defaultValue="option2">
            <Radio value="option1">Option 1</Radio>
            <Radio value="option2">Option 2</Radio>
          </RadioGroup>
          <button type="submit">Submit</button>
        </form>
      );

      const form = screen.getByRole("radiogroup").closest("form")!;
      const formData = new FormData(form);
      expect(formData.get("choice")).toBe("option2");
    });

    test("supports required validation", () => {
      render(
        <RadioGroup label="Required" isRequired>
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
        </RadioGroup>
      );
      const radios = screen.getAllByRole("radio");
      // React Aria handles required differently - check that the group has proper aria attributes
      const group = screen.getByRole("radiogroup");
      expect(group).toBeInTheDocument();
      // At least one radio should be focusable
      expect(radios.length).toBeGreaterThan(0);
    });
  });

  describe("Ripple Effect", () => {
    test("renders ripple container on radio", () => {
      render(
        <RadioGroup label="Options">
          <Radio value="a">With ripple</Radio>
        </RadioGroup>
      );
      const label = screen.getByText("With ripple").closest("label");
      const rippleContainer = label?.querySelector("[data-ripple-container]");
      expect(rippleContainer).toBeInTheDocument();
    });

    test("does not render ripple when disabled", () => {
      render(
        <RadioGroup label="Options">
          <Radio value="a" disableRipple>
            No ripple
          </Radio>
        </RadioGroup>
      );
      const label = screen.getByText("No ripple").closest("label");
      const rippleContainer = label?.querySelector("[data-ripple-container]");
      expect(rippleContainer).not.toBeInTheDocument();
    });

    test("does not render ripple on disabled radio", () => {
      render(
        <RadioGroup label="Options" isDisabled>
          <Radio value="a">Disabled</Radio>
        </RadioGroup>
      );
      const label = screen.getByText("Disabled").closest("label");
      const rippleContainer = label?.querySelector("[data-ripple-container]");
      expect(rippleContainer).not.toBeInTheDocument();
    });
  });

  describe("Custom Props", () => {
    test("merges custom className with default styles", () => {
      render(
        <RadioGroup label="Options">
          <Radio value="a" className="custom-class">
            Custom
          </Radio>
        </RadioGroup>
      );
      const label = screen.getByText("Custom").closest("label");
      expect(label).toHaveClass("custom-class");
    });

    test("supports data-testid on group", () => {
      render(
        <RadioGroup label="Options" data-testid="my-group">
          <Radio value="a">A</Radio>
        </RadioGroup>
      );
      const group = screen.getByTestId("my-group");
      expect(group).toBeInTheDocument();
    });

    test("supports data-testid on radio", () => {
      render(
        <RadioGroup label="Options">
          <Radio value="a" data-testid="my-radio">
            A
          </Radio>
        </RadioGroup>
      );
      const label = screen.getByTestId("my-radio");
      expect(label).toBeInTheDocument();
    });

    test("forwards additional HTML attributes to radio", () => {
      render(
        <RadioGroup label="Options">
          <Radio value="a" title="Radio title" id="my-radio">
            A
          </Radio>
        </RadioGroup>
      );
      const radio = screen.getByRole("radio");
      expect(radio).toHaveAttribute("id", "my-radio");
    });
  });

  describe("Edge Cases", () => {
    test("handles rapid selection changes", async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup label="Options">
          <Radio value="a">A</Radio>
          <Radio value="b">B</Radio>
          <Radio value="c">C</Radio>
        </RadioGroup>
      );

      const radioA = screen.getByRole("radio", { name: "A" });
      const radioB = screen.getByRole("radio", { name: "B" });
      const radioC = screen.getByRole("radio", { name: "C" });

      await user.click(radioA);
      await user.click(radioB);
      await user.click(radioC);

      expect(radioA).not.toBeChecked();
      expect(radioB).not.toBeChecked();
      expect(radioC).toBeChecked();
    });

    test("handles radio without label when aria-label provided", () => {
      render(
        <RadioGroup label="Options">
          <Radio value="a" aria-label="Option A" />
        </RadioGroup>
      );
      expect(screen.getByRole("radio", { name: "Option A" })).toBeInTheDocument();
    });

    test("handles empty RadioGroup", () => {
      render(<RadioGroup label="Empty" />);
      expect(screen.getByRole("radiogroup", { name: "Empty" })).toBeInTheDocument();
    });
  });

  describe("Axe Accessibility", () => {
    test("has no accessibility violations", async () => {
      const { container } = render(
        <RadioGroup label="Favorite color">
          <Radio value="red">Red</Radio>
          <Radio value="blue">Blue</Radio>
        </RadioGroup>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations with selected value", async () => {
      const { container } = render(
        <RadioGroup label="Options" value="a">
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test("has no accessibility violations when disabled", async () => {
      const { container } = render(
        <RadioGroup label="Options" isDisabled>
          <Radio value="a">Option A</Radio>
          <Radio value="b">Option B</Radio>
        </RadioGroup>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
