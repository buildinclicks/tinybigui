import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { ChipHeadless } from "./ChipHeadless";

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
