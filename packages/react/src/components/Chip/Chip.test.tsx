import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ChipHeadless } from "./ChipHeadless";
import { Chip } from "./Chip";
import { ChipSet } from "./ChipSet";

// ---------------------------------------------------------------------------
// Assist chip (type="assist")
// ---------------------------------------------------------------------------

describe("ChipHeadless — Assist", () => {
  test("1. renders with role=button", () => {
    render(<ChipHeadless type="assist" label="Set alarm" />);
    expect(screen.getByRole("button", { name: "Set alarm" })).toBeInTheDocument();
  });

  test("2. calls onPress on click", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<ChipHeadless type="assist" label="Set alarm" onPress={onPress} />);
    await user.click(screen.getByRole("button", { name: "Set alarm" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test("3. calls onPress on Enter key", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<ChipHeadless type="assist" label="Set alarm" onPress={onPress} />);
    screen.getByRole("button", { name: "Set alarm" }).focus();
    await user.keyboard("{Enter}");
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test("4. calls onPress on Space key", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<ChipHeadless type="assist" label="Set alarm" onPress={onPress} />);
    screen.getByRole("button", { name: "Set alarm" }).focus();
    await user.keyboard(" ");
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test("5. does NOT call onPress when isDisabled", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<ChipHeadless type="assist" label="Set alarm" onPress={onPress} isDisabled />);
    await user.click(screen.getByRole("button", { name: "Set alarm" }));
    expect(onPress).not.toHaveBeenCalled();
  });

  test("6. isDisabled disables the button (native disabled or aria-disabled)", () => {
    render(<ChipHeadless type="assist" label="Set alarm" isDisabled />);
    // React Aria's useButton sets the native `disabled` attribute on <button> elements.
    // This is the correct WCAG pattern — disabled buttons should not be focusable.
    const button = screen.getByRole("button", { name: "Set alarm" });
    expect(button).toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// Filter chip (type="filter")
// ---------------------------------------------------------------------------

describe("ChipHeadless — Filter", () => {
  test("7. renders with role=button and aria-pressed=false initially", () => {
    render(<ChipHeadless type="filter" label="Vegetarian" />);
    const button = screen.getByRole("button", { name: "Vegetarian" });
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  test("8. toggles aria-pressed to true on click", async () => {
    const user = userEvent.setup();
    render(<ChipHeadless type="filter" label="Vegetarian" />);
    const button = screen.getByRole("button", { name: "Vegetarian" });
    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  test("9. calls onSelectionChange(true) on first click", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<ChipHeadless type="filter" label="Vegetarian" onSelectionChange={onSelectionChange} />);
    await user.click(screen.getByRole("button", { name: "Vegetarian" }));
    expect(onSelectionChange).toHaveBeenCalledWith(true);
  });

  test("10. calls onSelectionChange(false) on second click", async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(<ChipHeadless type="filter" label="Vegetarian" onSelectionChange={onSelectionChange} />);
    const button = screen.getByRole("button", { name: "Vegetarian" });
    await user.click(button);
    await user.click(button);
    expect(onSelectionChange).toHaveBeenNthCalledWith(1, true);
    expect(onSelectionChange).toHaveBeenNthCalledWith(2, false);
  });

  test("11. respects controlled selected prop", () => {
    render(<ChipHeadless type="filter" label="Vegetarian" selected />);
    const button = screen.getByRole("button", { name: "Vegetarian" });
    expect(button).toHaveAttribute("aria-pressed", "true");
  });
});

// ---------------------------------------------------------------------------
// Input chip (type="input")
// ---------------------------------------------------------------------------

describe("ChipHeadless — Input", () => {
  test("12. renders with aria-label equal to label prop", () => {
    render(<ChipHeadless type="input" label="React" onRemove={vi.fn()} />);
    expect(screen.getByRole("button", { name: "React" })).toBeInTheDocument();
  });

  test("13. renders remove button with aria-label='Remove [label]'", () => {
    render(<ChipHeadless type="input" label="React" onRemove={vi.fn()} />);
    expect(screen.getByRole("button", { name: "Remove React" })).toBeInTheDocument();
  });

  test("14. calls onRemove when remove button is clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<ChipHeadless type="input" label="React" onRemove={onRemove} />);
    await user.click(screen.getByRole("button", { name: "Remove React" }));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  test("15. calls onRemove on Backspace key while chip is focused", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<ChipHeadless type="input" label="React" onRemove={onRemove} />);
    screen.getByRole("button", { name: "React" }).focus();
    await user.keyboard("{Backspace}");
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  test("16. calls onRemove on Delete key while chip is focused", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<ChipHeadless type="input" label="React" onRemove={onRemove} />);
    screen.getByRole("button", { name: "React" }).focus();
    await user.keyboard("{Delete}");
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  test("17. remove button Enter/Space also triggers onRemove", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    render(<ChipHeadless type="input" label="React" onRemove={onRemove} />);
    const removeButton = screen.getByRole("button", { name: "Remove React" });
    removeButton.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onRemove).toHaveBeenCalledTimes(2);
  });
});

// ---------------------------------------------------------------------------
// Suggestion chip (type="suggestion")
// ---------------------------------------------------------------------------

describe("ChipHeadless — Suggestion", () => {
  test("18. renders with role=button", () => {
    render(<ChipHeadless type="suggestion" label="See photos" />);
    expect(screen.getByRole("button", { name: "See photos" })).toBeInTheDocument();
  });

  test("19. calls onPress on click", async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();
    render(<ChipHeadless type="suggestion" label="See photos" onPress={onPress} />);
    await user.click(screen.getByRole("button", { name: "See photos" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// General
// ---------------------------------------------------------------------------

describe("ChipHeadless — General", () => {
  test("20. forwardRef: ref correctly attached to root button element", () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<ChipHeadless type="assist" label="Set alarm" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  test("21. axe check — assist chip, no violations", async () => {
    const { container } = render(<ChipHeadless type="assist" label="Set alarm" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("22. axe check — filter chip (unselected), no violations", async () => {
    const { container } = render(<ChipHeadless type="filter" label="Vegetarian" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("23. axe check — filter chip (selected), no violations", async () => {
    const { container } = render(<ChipHeadless type="filter" label="Vegetarian" selected />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("24. axe check — input chip, no violations", async () => {
    const { container } = render(<ChipHeadless type="input" label="React" onRemove={vi.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("25. axe check — disabled chip, no violations", async () => {
    const { container } = render(<ChipHeadless type="assist" label="Set alarm" isDisabled />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// Chip (Styled) — base classes
// ---------------------------------------------------------------------------

describe("Chip — base classes", () => {
  test("26. applies rounded-sm, h-8, text-label-large", () => {
    render(<Chip type="assist" label="Help" />);
    const chip = screen.getByRole("button", { name: "Help" });
    expect(chip).toHaveClass("rounded-sm");
    expect(chip).toHaveClass("h-8");
    expect(chip).toHaveClass("text-label-large");
  });

  test("27. applies bg-surface-container-low for filter chip (unselected)", () => {
    render(<Chip type="filter" label="Veg" />);
    const chip = screen.getByRole("button", { name: "Veg" });
    expect(chip).toHaveClass("bg-surface-container-low");
  });

  test("28. applies bg-secondary-container for filter chip (selected)", () => {
    render(<Chip type="filter" label="Veg" selected />);
    const chip = screen.getByRole("button", { name: "Veg" });
    expect(chip).toHaveClass("bg-secondary-container");
  });

  test("29. applies border border-outline for filter chip (unselected)", () => {
    render(<Chip type="filter" label="Veg" />);
    const chip = screen.getByRole("button", { name: "Veg" });
    expect(chip).toHaveClass("border");
    expect(chip).toHaveClass("border-outline");
  });

  test("30. applies border-0 for filter chip (selected)", () => {
    render(<Chip type="filter" label="Veg" selected />);
    const chip = screen.getByRole("button", { name: "Veg" });
    expect(chip).toHaveClass("border-0");
  });
});

// ---------------------------------------------------------------------------
// Chip — Assist chip surface
// ---------------------------------------------------------------------------

describe("Chip — Assist chip surface", () => {
  test("31. tonal: applies bg-surface-container-low and border border-outline", () => {
    render(<Chip type="assist" label="Help" surface="tonal" />);
    const chip = screen.getByRole("button", { name: "Help" });
    expect(chip).toHaveClass("bg-surface-container-low");
    expect(chip).toHaveClass("border");
    expect(chip).toHaveClass("border-outline");
  });

  test("32. elevated: applies shadow-elevation-1 and hover:shadow-elevation-2", () => {
    render(<Chip type="assist" label="Help" surface="elevated" />);
    const chip = screen.getByRole("button", { name: "Help" });
    expect(chip).toHaveClass("shadow-elevation-1");
    expect(chip).toHaveClass("hover:shadow-elevation-2");
  });
});

// ---------------------------------------------------------------------------
// Chip — disabled state
// ---------------------------------------------------------------------------

describe("Chip — disabled state", () => {
  test("33. applies text-on-surface/38 and border-on-surface/12 when disabled", () => {
    render(<Chip type="assist" label="Help" surface="tonal" isDisabled />);
    const chip = screen.getByRole("button", { name: "Help" });
    expect(chip).toHaveClass("text-on-surface/38");
    expect(chip).toHaveClass("border-on-surface/12");
  });
});

// ---------------------------------------------------------------------------
// Chip — filter checkmark animation
// ---------------------------------------------------------------------------

describe("Chip — filter checkmark", () => {
  test("34. checkmark container is present in DOM for filter chips", () => {
    const { container } = render(<Chip type="filter" label="Veg" />);
    // The checkmark span is a sibling of the label inside the chip
    const spans = container.querySelectorAll("span");
    // At least one span manages the checkmark width/opacity transition
    expect(spans.length).toBeGreaterThan(0);
  });

  test("35. when selected: checkmark container has w-4.5 and opacity-100", () => {
    const { container } = render(<Chip type="filter" label="Veg" selected />);
    const checkmarkContainer = container.querySelector(".w-4\\.5.opacity-100");
    expect(checkmarkContainer).toBeInTheDocument();
  });

  test("36. when unselected: checkmark container has w-0 and opacity-0", () => {
    const { container } = render(<Chip type="filter" label="Veg" />);
    const checkmarkContainer = container.querySelector(".w-0.opacity-0");
    expect(checkmarkContainer).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Chip — Input removal animation
// ---------------------------------------------------------------------------

describe("Chip — Input removal animation", () => {
  test("37. clicking remove button adds animate-md-fade-out to chip root", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const { container } = render(<Chip type="input" label="React" onRemove={onRemove} />);
    const chipRoot = container.firstChild as HTMLElement;

    await user.click(screen.getByRole("button", { name: "Remove React" }));

    expect(chipRoot).toHaveClass("animate-md-fade-out");
  });

  test("38. onRemove is NOT called immediately — only after animationend", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const { container } = render(<Chip type="input" label="React" onRemove={onRemove} />);
    const chipRoot = container.firstChild as HTMLElement;

    await user.click(screen.getByRole("button", { name: "Remove React" }));
    // onRemove should NOT have been called yet
    expect(onRemove).not.toHaveBeenCalled();

    // Simulate the CSS animation completing
    fireEvent.animationEnd(chipRoot);
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// Chip — ripple
// ---------------------------------------------------------------------------

describe("Chip — ripple", () => {
  test("39. ripple container is present for interactive chips", () => {
    const { container } = render(<Chip type="assist" label="Help" />);
    expect(container.querySelector("[data-ripple-container]")).toBeInTheDocument();
  });

  test("40. ripple container is clipped to rounded-sm via rounded-[inherit]", () => {
    const { container } = render(<Chip type="assist" label="Help" />);
    const rippleContainer = container.querySelector("[data-ripple-container]");
    expect(rippleContainer).toHaveClass("rounded-[inherit]");
  });
});

// ---------------------------------------------------------------------------
// Chip — padding
// ---------------------------------------------------------------------------

describe("Chip — padding", () => {
  test("41. no icon: applies px-4", () => {
    render(<Chip type="assist" label="Help" />);
    const chip = screen.getByRole("button", { name: "Help" });
    expect(chip).toHaveClass("px-4");
  });

  test("42. with leadingIcon: applies pl-3 pr-4", () => {
    render(<Chip type="assist" label="Help" leadingIcon={<span>★</span>} />);
    const chip = screen.getByRole("button", { name: "Help" });
    expect(chip).toHaveClass("pl-3");
    expect(chip).toHaveClass("pr-4");
  });

  test("43. input chip: applies pl-3 pr-3", () => {
    const { container } = render(<Chip type="input" label="React" onRemove={vi.fn()} />);
    const chipRoot = container.firstChild as HTMLElement;
    expect(chipRoot).toHaveClass("pl-3");
    expect(chipRoot).toHaveClass("pr-3");
  });
});

// ---------------------------------------------------------------------------
// ChipSet
// ---------------------------------------------------------------------------

describe("ChipSet", () => {
  test("44. renders as div with flex flex-wrap gap-2", () => {
    const { container } = render(
      <ChipSet>
        <Chip type="filter" label="React" />
      </ChipSet>
    );
    const chipSet = container.firstChild as HTMLElement;
    expect(chipSet.tagName).toBe("DIV");
    expect(chipSet).toHaveClass("flex");
    expect(chipSet).toHaveClass("flex-wrap");
    expect(chipSet).toHaveClass("gap-2");
  });

  test("45. renders all children", () => {
    render(
      <ChipSet>
        <Chip type="filter" label="React" />
        <Chip type="filter" label="TypeScript" />
      </ChipSet>
    );
    expect(screen.getByRole("button", { name: "React" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "TypeScript" })).toBeInTheDocument();
  });
});
