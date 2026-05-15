import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { Badge } from "./Badge";
import { BadgeContent } from "./BadgeContent";

describe("BadgeContent", () => {
  test("renders a dot (no count) with role='status'", () => {
    render(<BadgeContent />);
    const badge = screen.getByRole("status");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("");
  });

  test("renders count value when count is provided", () => {
    render(<BadgeContent count={5} />);
    const badge = screen.getByRole("status");
    expect(badge).toHaveTextContent("5");
  });

  test('renders "999+" when count exceeds default max (999)', () => {
    render(<BadgeContent count={1000} />);
    const badge = screen.getByRole("status");
    expect(badge).toHaveTextContent("999+");
  });

  test('renders "99+" when max={99} and count > 99', () => {
    render(<BadgeContent count={150} max={99} />);
    const badge = screen.getByRole("status");
    expect(badge).toHaveTextContent("99+");
  });

  test('with color="error" applies bg-error class', () => {
    render(<BadgeContent color="error" />);
    const badge = screen.getByRole("status");
    expect(badge).toHaveClass("bg-error");
  });

  test('with color="primary" applies bg-primary class', () => {
    render(<BadgeContent color="primary" />);
    const badge = screen.getByRole("status");
    expect(badge).toHaveClass("bg-primary");
  });

  test('derives aria-label from count ("3 notifications")', () => {
    render(<BadgeContent count={3} />);
    const badge = screen.getByRole("status");
    expect(badge).toHaveAttribute("aria-label", "3 notifications");
  });

  test('with no count has aria-label="New"', () => {
    render(<BadgeContent />);
    const badge = screen.getByRole("status");
    expect(badge).toHaveAttribute("aria-label", "New");
  });

  test("respects aria-label override", () => {
    render(<BadgeContent count={5} aria-label="5 unread messages" />);
    const badge = screen.getByRole("status");
    expect(badge).toHaveAttribute("aria-label", "5 unread messages");
  });
});

describe("Badge", () => {
  test("wraps children in a relative container", () => {
    render(
      <Badge>
        <button type="button">Host</button>
      </Badge>
    );
    const button = screen.getByRole("button", { name: "Host" });
    const wrapper = button.parentElement;
    expect(wrapper).toHaveClass("relative");
  });

  test("renders BadgeContent absolutely positioned", () => {
    render(
      <Badge count={3}>
        <button type="button">Host</button>
      </Badge>
    );
    const badge = screen.getByRole("status");
    expect(badge).toHaveClass("absolute", "-top-1", "-right-1");
  });

  test("with invisible={true} applies scale-0 opacity-0 classes", () => {
    render(
      <Badge count={3} invisible>
        <button type="button">Host</button>
      </Badge>
    );
    const badge = screen.getByRole("status");
    expect(badge).toHaveClass("scale-0", "opacity-0");
  });

  test("with count={0} is invisible (not shown)", () => {
    render(
      <Badge count={0}>
        <button type="button">Host</button>
      </Badge>
    );
    const badge = screen.getByRole("status");
    expect(badge).toHaveClass("scale-0", "opacity-0");
  });

  test("with count={5} is visible by default", () => {
    render(
      <Badge count={5}>
        <button type="button">Host</button>
      </Badge>
    );
    const badge = screen.getByRole("status");
    expect(badge).toHaveClass("scale-100", "opacity-100");
  });

  test("forwardRef: ref correctly attached to the root wrapper element", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Badge ref={ref}>
        <button type="button">Host</button>
      </Badge>
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass("relative", "inline-flex");
  });

  test("accepts and applies custom className", () => {
    render(
      <Badge className="my-custom-class">
        <button type="button">Host</button>
      </Badge>
    );
    const button = screen.getByRole("button", { name: "Host" });
    const wrapper = button.parentElement;
    expect(wrapper).toHaveClass("my-custom-class");
  });
});

describe("Badge Accessibility", () => {
  test("axe check — Badge wrapping button, no violations", async () => {
    const { container } = render(
      <Badge>
        <button type="button" aria-label="Notifications">
          N
        </button>
      </Badge>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("axe check — Badge with count, no violations", async () => {
    const { container } = render(
      <Badge count={5}>
        <button type="button" aria-label="Notifications">
          N
        </button>
      </Badge>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
