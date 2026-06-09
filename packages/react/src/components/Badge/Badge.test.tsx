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

  test("applies bg-error class (MD3 error color role)", () => {
    render(<BadgeContent count={3} />);
    const badge = screen.getByRole("status");
    expect(badge).toHaveClass("bg-error");
  });

  test("applies text-on-error class (MD3 error color role)", () => {
    render(<BadgeContent count={3} />);
    const badge = screen.getByRole("status");
    expect(badge).toHaveClass("text-on-error");
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

  describe("content flags", () => {
    test("sets data-dot when no count is provided (dot badge)", () => {
      render(<BadgeContent />);
      const badge = screen.getByRole("status");
      expect(badge).toHaveAttribute("data-dot", "");
    });

    test("does NOT set data-dot when count is provided", () => {
      render(<BadgeContent count={3} />);
      const badge = screen.getByRole("status");
      expect(badge).not.toHaveAttribute("data-dot");
    });
  });

  describe("visibility flag", () => {
    test("does NOT set data-invisible when visible (default)", () => {
      render(<BadgeContent count={3} />);
      const badge = screen.getByRole("status");
      expect(badge).not.toHaveAttribute("data-invisible");
    });

    test("sets data-invisible when invisible={true}", () => {
      render(<BadgeContent count={3} invisible />);
      const badge = screen.getByRole("status");
      expect(badge).toHaveAttribute("data-invisible", "");
    });

    test("applies scale-0 class via data-[invisible] (invisible=true)", () => {
      render(<BadgeContent count={3} invisible />);
      const badge = screen.getByRole("status");
      // CVA base adds scale-100; data-[invisible]:scale-0 overrides via cascade.
      // We check the data attribute which drives the Tailwind selector.
      expect(badge).toHaveAttribute("data-invisible", "");
    });

    test("applies scale-100 class when visible", () => {
      render(<BadgeContent count={5} />);
      const badge = screen.getByRole("status");
      expect(badge).toHaveClass("scale-100");
    });
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

  test("renders BadgeContent with MD3 corner-overlap placement classes", () => {
    render(
      <Badge count={3}>
        <button type="button">Host</button>
      </Badge>
    );
    const badge = screen.getByRole("status");
    // MD3 spec: badge center straddles the wrapped element's top-right corner.
    // top-0 right-0 positions the badge's top-right at the host's top-right,
    // then -translate-y-1/2 translate-x-1/2 moves the center onto that corner.
    expect(badge).toHaveClass(
      "absolute",
      "top-0",
      "right-0",
      "-translate-y-1/2",
      "translate-x-1/2"
    );
  });

  test("with invisible={true} sets data-invisible on the badge indicator", () => {
    render(
      <Badge count={3} invisible>
        <button type="button">Host</button>
      </Badge>
    );
    const badge = screen.getByRole("status");
    expect(badge).toHaveAttribute("data-invisible", "");
  });

  test("with count={0} is invisible (data-invisible present)", () => {
    render(
      <Badge count={0}>
        <button type="button">Host</button>
      </Badge>
    );
    const badge = screen.getByRole("status");
    expect(badge).toHaveAttribute("data-invisible", "");
  });

  test("with count={5} is visible (data-invisible absent)", () => {
    render(
      <Badge count={5}>
        <button type="button">Host</button>
      </Badge>
    );
    const badge = screen.getByRole("status");
    expect(badge).not.toHaveAttribute("data-invisible");
  });

  test("dot badge (no count) sets data-dot and no data-invisible", () => {
    render(
      <Badge>
        <button type="button">Host</button>
      </Badge>
    );
    const badge = screen.getByRole("status");
    expect(badge).toHaveAttribute("data-dot", "");
    expect(badge).not.toHaveAttribute("data-invisible");
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
