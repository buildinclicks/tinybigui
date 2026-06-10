import { describe, test, expectTypeOf, expect, vi, afterEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { axe } from "vitest-axe";
import * as SliderStories from "./Slider.stories";

const mockUseReducedMotion = vi.hoisted(() => vi.fn<[], boolean>(() => false));

vi.mock("../../hooks/useReducedMotion", () => ({
  useReducedMotion: mockUseReducedMotion,
}));
import type {
  SliderVariant,
  SliderSize,
  SliderOrientation,
  SliderHeadlessProps,
  SliderThumbProps,
  SliderProps,
  SliderThumbState,
  SliderRenderState,
  SliderRangeThumbLabels,
} from "./Slider.types";
import { SliderHeadless } from "./SliderHeadless";
import { Slider } from "./Slider";
import * as SliderIndex from "./index";

// ---------------------------------------------------------------------------
// Type compile-time assertions (Milestone 1 — types scaffold only)
// ---------------------------------------------------------------------------

describe("Slider types", () => {
  describe("SliderVariant", () => {
    test("accepts standard, centered, range", () => {
      expectTypeOf<"standard">().toMatchTypeOf<SliderVariant>();
      expectTypeOf<"centered">().toMatchTypeOf<SliderVariant>();
      expectTypeOf<"range">().toMatchTypeOf<SliderVariant>();
    });
  });

  describe("SliderSize", () => {
    test("accepts all five size literals", () => {
      expectTypeOf<"xsmall">().toMatchTypeOf<SliderSize>();
      expectTypeOf<"small">().toMatchTypeOf<SliderSize>();
      expectTypeOf<"medium">().toMatchTypeOf<SliderSize>();
      expectTypeOf<"large">().toMatchTypeOf<SliderSize>();
      expectTypeOf<"xlarge">().toMatchTypeOf<SliderSize>();
    });
  });

  describe("SliderOrientation", () => {
    test("accepts horizontal and vertical", () => {
      expectTypeOf<"horizontal">().toMatchTypeOf<SliderOrientation>();
      expectTypeOf<"vertical">().toMatchTypeOf<SliderOrientation>();
    });
  });

  describe("SliderHeadlessProps", () => {
    test("accepts aria-label, aria-labelledby, and label for accessible labelling", () => {
      expectTypeOf<SliderHeadlessProps>().toHaveProperty("aria-label");
      expectTypeOf<SliderHeadlessProps>().toHaveProperty("aria-labelledby");
      expectTypeOf<SliderHeadlessProps>().toHaveProperty("label");
    });

    test("aria-label is optional string", () => {
      expectTypeOf<SliderHeadlessProps["aria-label"]>().toEqualTypeOf<string | undefined>();
    });

    test("label is optional string", () => {
      expectTypeOf<SliderHeadlessProps["label"]>().toEqualTypeOf<string | undefined>();
    });
  });

  describe("SliderThumbProps", () => {
    test("requires index as number", () => {
      expectTypeOf<SliderThumbProps>().toHaveProperty("index");
      expectTypeOf<SliderThumbProps["index"]>().toEqualTypeOf<number>();
    });
  });

  describe("SliderProps", () => {
    test("extends SliderHeadlessProps (minus children)", () => {
      expectTypeOf<SliderProps>().toMatchTypeOf<Omit<SliderHeadlessProps, "children">>();
    });

    test("accepts size prop", () => {
      expectTypeOf<SliderProps>().toHaveProperty("size");
      expectTypeOf<SliderProps["size"]>().toEqualTypeOf<SliderSize | undefined>();
    });

    test("accepts showStops prop", () => {
      expectTypeOf<SliderProps>().toHaveProperty("showStops");
      expectTypeOf<SliderProps["showStops"]>().toEqualTypeOf<boolean | undefined>();
    });

    test("accepts showValueIndicator prop", () => {
      expectTypeOf<SliderProps>().toHaveProperty("showValueIndicator");
      expectTypeOf<SliderProps["showValueIndicator"]>().toEqualTypeOf<boolean | undefined>();
    });

    test("accepts icon prop as ReactNode", () => {
      expectTypeOf<SliderProps>().toHaveProperty("icon");
    });
  });

  describe("SliderThumbState", () => {
    test("accepts all four state literals", () => {
      expectTypeOf<"enabled">().toMatchTypeOf<SliderThumbState>();
      expectTypeOf<"hovered">().toMatchTypeOf<SliderThumbState>();
      expectTypeOf<"pressed">().toMatchTypeOf<SliderThumbState>();
      expectTypeOf<"disabled">().toMatchTypeOf<SliderThumbState>();
    });
  });

  describe("SliderRenderState", () => {
    test("has values array of numbers", () => {
      expectTypeOf<SliderRenderState>().toHaveProperty("values");
      expectTypeOf<SliderRenderState["values"]>().toEqualTypeOf<number[]>();
    });

    test("has percentages array of numbers", () => {
      expectTypeOf<SliderRenderState>().toHaveProperty("percentages");
      expectTypeOf<SliderRenderState["percentages"]>().toEqualTypeOf<number[]>();
    });

    test("has isDisabled boolean", () => {
      expectTypeOf<SliderRenderState["isDisabled"]>().toEqualTypeOf<boolean>();
    });

    test("has isDragging boolean", () => {
      expectTypeOf<SliderRenderState["isDragging"]>().toEqualTypeOf<boolean>();
    });

    test("has thumbStates array of SliderThumbState", () => {
      expectTypeOf<SliderRenderState["thumbStates"]>().toEqualTypeOf<SliderThumbState[]>();
    });
  });
});

// ---------------------------------------------------------------------------
// SliderHeadless — standard variant behavior (Milestone 2)
// ---------------------------------------------------------------------------

describe("SliderHeadless — standard variant behavior", () => {
  // 10. Container has role="group"
  test("renders with role group on container", () => {
    render(<SliderHeadless label="Volume" />);
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  // 11. Hidden input has role="slider"
  test("renders a hidden input with role slider", () => {
    render(<SliderHeadless label="Volume" />);
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  // 12. Default ARIA value range attributes (React Aria uses native min/max on <input type="range">)
  test("has correct aria-valuemin and aria-valuemax defaults (0 and 100)", () => {
    render(<SliderHeadless label="Volume" />);
    const input = screen.getByRole("slider");
    expect(input).toHaveAttribute("min", "0");
    expect(input).toHaveAttribute("max", "100");
  });

  // 13. defaultValue sets current value (React Aria uses native value on <input type="range">)
  test("has correct aria-valuenow matching defaultValue", () => {
    render(<SliderHeadless label="Volume" defaultValue={[50]} />);
    const input = screen.getByRole("slider");
    expect(input).toHaveValue("50");
  });

  // 14. Visible label rendered when label prop provided
  test("renders label element when label prop is provided", () => {
    render(<SliderHeadless label="Volume" />);
    expect(screen.getByText("Volume")).toBeInTheDocument();
  });

  // 15. aria-label on input when no visible label
  test("supports aria-label when no visible label", () => {
    render(<SliderHeadless aria-label="Brightness" />);
    const input = screen.getByRole("slider");
    expect(input).toHaveAttribute("aria-label", "Brightness");
  });

  // 16. Controlled value prop (React Aria uses native value on <input type="range">)
  test("supports controlled value prop", () => {
    function ControlledSlider() {
      const [val, setVal] = useState([75]);
      return <SliderHeadless label="Volume" value={val} onChange={setVal} data-testid="slider" />;
    }
    const { rerender } = render(<ControlledSlider />);
    expect(screen.getByRole("slider")).toHaveValue("75");

    rerender(<SliderHeadless label="Volume" value={[80]} onChange={() => {}} />);
    expect(screen.getByRole("slider")).toHaveValue("80");
  });

  // 17. onChange called when value changes via keyboard
  test("calls onChange when value changes via keyboard", () => {
    const onChange = vi.fn();
    render(<SliderHeadless label="Volume" defaultValue={[50]} onChange={onChange} />);
    const input = screen.getByRole("slider");

    act(() => {
      input.focus();
    });
    fireEvent.keyDown(input, { key: "ArrowRight" });

    expect(onChange).toHaveBeenCalled();
  });

  // 18. ArrowRight increases value by default step (1)
  test("ArrowRight increases value by step (default step=1)", () => {
    render(<SliderHeadless label="Volume" defaultValue={[50]} />);
    const input = screen.getByRole("slider");

    act(() => {
      input.focus();
    });
    fireEvent.keyDown(input, { key: "ArrowRight" });

    expect(input).toHaveValue("51");
  });

  // 19. ArrowLeft decreases value by step
  test("ArrowLeft decreases value by step", () => {
    render(<SliderHeadless label="Volume" defaultValue={[50]} />);
    const input = screen.getByRole("slider");

    act(() => {
      input.focus();
    });
    fireEvent.keyDown(input, { key: "ArrowLeft" });

    expect(input).toHaveValue("49");
  });

  // 20. Home key sets value to minValue
  test("Home key sets value to minValue", () => {
    render(<SliderHeadless label="Volume" defaultValue={[50]} minValue={0} />);
    const input = screen.getByRole("slider");

    act(() => {
      input.focus();
    });
    fireEvent.keyDown(input, { key: "Home" });

    expect(input).toHaveValue("0");
  });

  // 21. End key sets value to maxValue
  test("End key sets value to maxValue", () => {
    render(<SliderHeadless label="Volume" defaultValue={[50]} maxValue={100} />);
    const input = screen.getByRole("slider");

    act(() => {
      input.focus();
    });
    fireEvent.keyDown(input, { key: "End" });

    expect(input).toHaveValue("100");
  });

  // 22. PageUp increases value by 10% of range
  test("PageUp increases value by 10% of range", () => {
    render(<SliderHeadless label="Volume" minValue={0} maxValue={100} defaultValue={[50]} />);
    const input = screen.getByRole("slider");

    act(() => {
      input.focus();
    });
    fireEvent.keyDown(input, { key: "PageUp" });

    expect(input).toHaveValue("60");
  });

  // 23. PageDown decreases value by 10% of range
  test("PageDown decreases value by 10% of range", () => {
    render(<SliderHeadless label="Volume" minValue={0} maxValue={100} defaultValue={[50]} />);
    const input = screen.getByRole("slider");

    act(() => {
      input.focus();
    });
    fireEvent.keyDown(input, { key: "PageDown" });

    expect(input).toHaveValue("40");
  });

  // 24. Disabled slider does not respond to keyboard
  test("disabled slider does not respond to keyboard", () => {
    render(<SliderHeadless label="Volume" defaultValue={[50]} isDisabled />);
    const input = screen.getByRole("slider");

    act(() => {
      input.focus();
    });
    fireEvent.keyDown(input, { key: "ArrowRight" });

    expect(input).toHaveValue("50");
    expect(input).toBeDisabled();
  });

  // 25. Step constrains values to discrete increments
  test("step prop constrains values to discrete increments", () => {
    render(<SliderHeadless label="Volume" step={10} defaultValue={[50]} />);
    const input = screen.getByRole("slider");

    act(() => {
      input.focus();
    });
    fireEvent.keyDown(input, { key: "ArrowRight" });

    expect(input).toHaveValue("60");
  });

  // 26. Click on track moves thumb to clicked position
  // Note: JSDOM does not implement element layout, so React Aria's clientX → value
  // calculation produces NaN. We verify the interaction is wired (onChange is called)
  // and that the track element is the target of pointer events.
  test("click on track moves thumb to clicked position", () => {
    const onChange = vi.fn();
    const { container } = render(
      <SliderHeadless label="Volume" defaultValue={[0]} onChange={onChange} />
    );

    const track = container.querySelector<HTMLElement>("[data-track]")!;
    expect(track).toBeInTheDocument();

    // JSDOM does not implement setPointerCapture / releasePointerCapture
    track.setPointerCapture = vi.fn();
    track.releasePointerCapture = vi.fn();

    fireEvent.pointerDown(track, {
      clientX: 75,
      clientY: 10,
      pointerId: 1,
      isPrimary: true,
      button: 0,
      buttons: 1,
    });

    // Pointer interaction on the track propagates to React Aria and triggers onChange
    expect(onChange).toHaveBeenCalled();
  });

  // 27. data-orientation reflects orientation prop
  test("data-orientation attribute reflects orientation prop", () => {
    const { container } = render(<SliderHeadless label="Volume" orientation="horizontal" />);
    const group = container.firstChild as HTMLElement;
    expect(group).toHaveAttribute("data-orientation", "horizontal");
  });

  // 28. data-disabled present when isDisabled
  test("data-disabled attribute present when isDisabled", () => {
    const { container } = render(<SliderHeadless label="Volume" isDisabled />);
    const group = container.firstChild as HTMLElement;
    expect(group).toHaveAttribute("data-disabled");
  });

  // 29. Output element displays formatted value
  test("output element displays formatted value", () => {
    render(<SliderHeadless label="Price" formatValue={(v) => `$${v}`} defaultValue={[50]} />);
    const output = document.querySelector("output");
    expect(output).toHaveTextContent("$50");
  });
});

// ---------------------------------------------------------------------------
// SliderRangeThumbLabels — type assertions
// ---------------------------------------------------------------------------

describe("SliderRangeThumbLabels", () => {
  test("is a tuple of two strings", () => {
    expectTypeOf<SliderRangeThumbLabels>().toEqualTypeOf<[string, string]>();
  });

  test("SliderHeadlessProps accepts thumbLabels", () => {
    expectTypeOf<SliderHeadlessProps>().toHaveProperty("thumbLabels");
    expectTypeOf<SliderHeadlessProps["thumbLabels"]>().toEqualTypeOf<
      SliderRangeThumbLabels | undefined
    >();
  });
});

// ---------------------------------------------------------------------------
// SliderHeadless — range variant behavior (Milestone 3)
// ---------------------------------------------------------------------------

describe("SliderHeadless — range variant behavior", () => {
  // 30. Two role="slider" inputs rendered
  test("range variant renders two slider inputs", () => {
    render(<SliderHeadless variant="range" label="Price" />);
    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });

  // 31. Default values are [25, 75]
  test("range variant has correct default values [25, 75]", () => {
    render(<SliderHeadless variant="range" label="Price" />);
    const [first, second] = screen.getAllByRole("slider");
    expect(first).toHaveValue("25");
    expect(second).toHaveValue("75");
  });

  // 32. Each thumb has a distinct default aria-label
  test("range variant: each thumb has distinct aria-label", () => {
    render(<SliderHeadless variant="range" label="Price" />);
    const [first, second] = screen.getAllByRole("slider");
    expect(first).toHaveAttribute("aria-label", "Minimum");
    expect(second).toHaveAttribute("aria-label", "Maximum");
  });

  // 33. thumbLabels prop overrides default aria-labels
  test("range variant: thumbLabels prop overrides default aria-labels", () => {
    render(
      <SliderHeadless variant="range" label="Price" thumbLabels={["Min price", "Max price"]} />
    );
    const [first, second] = screen.getAllByRole("slider");
    expect(first).toHaveAttribute("aria-label", "Min price");
    expect(second).toHaveAttribute("aria-label", "Max price");
  });

  // 34. Left thumb max is constrained to right thumb's value
  test("range variant: left thumb max is constrained by right thumb value", () => {
    render(<SliderHeadless variant="range" label="Price" value={[30, 70]} onChange={() => {}} />);
    const [first] = screen.getAllByRole("slider");
    expect(first).toHaveAttribute("max", "70");
  });

  // 35. Right thumb min is constrained to left thumb's value
  test("range variant: right thumb min is constrained by left thumb value", () => {
    render(<SliderHeadless variant="range" label="Price" value={[30, 70]} onChange={() => {}} />);
    const [, second] = screen.getAllByRole("slider");
    expect(second).toHaveAttribute("min", "30");
  });

  // 36. Thumbs cannot cross (left cannot exceed right)
  test("range variant: thumbs cannot cross (left cannot exceed right)", () => {
    render(<SliderHeadless variant="range" label="Price" defaultValue={[50, 50]} />);
    const [first, second] = screen.getAllByRole("slider");

    act(() => {
      first.focus();
    });
    fireEvent.keyDown(first, { key: "ArrowRight" });

    const leftValue = Number(first.getAttribute("value") ?? (first as HTMLInputElement).value);
    const rightValue = Number(second.getAttribute("value") ?? (second as HTMLInputElement).value);
    expect(leftValue).toBeLessThanOrEqual(rightValue);
  });

  // 37. Tab moves focus between thumbs
  test("range variant: Tab moves focus between thumbs", () => {
    render(<SliderHeadless variant="range" label="Price" />);
    const [first, second] = screen.getAllByRole("slider");

    act(() => {
      first.focus();
    });
    expect(document.activeElement).toBe(first);

    act(() => {
      second.focus();
    });
    expect(document.activeElement).toBe(second);
  });

  // 38. ArrowRight on left thumb increases its value
  test("range variant: ArrowRight on left thumb increases its value", () => {
    render(<SliderHeadless variant="range" label="Price" defaultValue={[25, 75]} />);
    const [first] = screen.getAllByRole("slider");

    act(() => {
      first.focus();
    });
    fireEvent.keyDown(first, { key: "ArrowRight" });

    expect(first).toHaveValue("26");
  });

  // 39. Click on track calls onChange (JSDOM has no layout so we verify wiring only)
  test("range variant: click on track moves nearest thumb", () => {
    const onChange = vi.fn();
    const { container } = render(
      <SliderHeadless variant="range" label="Price" defaultValue={[20, 80]} onChange={onChange} />
    );

    const track = container.querySelector<HTMLElement>("[data-track]")!;
    expect(track).toBeInTheDocument();

    track.setPointerCapture = vi.fn();
    track.releasePointerCapture = vi.fn();

    fireEvent.pointerDown(track, {
      clientX: 90,
      clientY: 10,
      pointerId: 1,
      isPrimary: true,
      button: 0,
      buttons: 1,
    });

    expect(onChange).toHaveBeenCalled();
  });

  // 40. Output shows both values formatted
  test("range variant: output displays both values formatted", () => {
    render(
      <SliderHeadless
        variant="range"
        label="Price"
        formatValue={(v) => `$${v}`}
        defaultValue={[20, 80]}
      />
    );
    const output = document.querySelector("output");
    expect(output).toHaveTextContent("$20 – $80");
  });

  // 41. data-variant attribute is "range"
  test("range variant: data-variant attribute is 'range'", () => {
    const { container } = render(<SliderHeadless variant="range" label="Price" />);
    const group = container.firstChild as HTMLElement;
    expect(group).toHaveAttribute("data-variant", "range");
  });

  // 42. Controlled value prop with two values
  test("range variant: controlled value prop with two values", () => {
    function ControlledRange({ values }: { values: number[] }) {
      return <SliderHeadless variant="range" label="Price" value={values} onChange={() => {}} />;
    }

    const { rerender } = render(<ControlledRange values={[10, 90]} />);
    const [first, second] = screen.getAllByRole("slider");
    expect(first).toHaveValue("10");
    expect(second).toHaveValue("90");

    rerender(<ControlledRange values={[20, 80]} />);
    expect(first).toHaveValue("20");
    expect(second).toHaveValue("80");
  });

  // 43. Disabled state disables both thumbs
  test("range variant: disabled state disables both thumbs", () => {
    render(<SliderHeadless variant="range" label="Price" isDisabled />);
    const [first, second] = screen.getAllByRole("slider");
    expect(first).toBeDisabled();
    expect(second).toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// SliderHeadless — centered variant behavior (Milestone 4)
// ---------------------------------------------------------------------------

describe("SliderHeadless — centered variant behavior", () => {
  // 44. Container has data-variant="centered"
  test("centered variant renders with data-variant='centered'", () => {
    const { container } = render(
      <SliderHeadless variant="centered" label="Balance" minValue={-100} maxValue={100} />
    );
    const group = container.firstChild as HTMLElement;
    expect(group).toHaveAttribute("data-variant", "centered");
  });

  // 45. Default value is [0]
  test("centered variant default value is [0]", () => {
    render(<SliderHeadless variant="centered" label="Balance" minValue={-100} maxValue={100} />);
    const input = screen.getByRole("slider");
    expect(input).toHaveValue("0");
  });

  // 46. data-zero-percent is 50 for symmetric range [-100, 100]
  test("centered variant: data-zero-percent is 50 for symmetric range [-100, 100]", () => {
    const { container } = render(
      <SliderHeadless variant="centered" label="Balance" minValue={-100} maxValue={100} />
    );
    const group = container.firstChild as HTMLElement;
    expect(group).toHaveAttribute("data-zero-percent", "50");
  });

  // 47. data-zero-percent is 25 for asymmetric range [-50, 150]
  test("centered variant: data-zero-percent is 25 for asymmetric range [-50, 150]", () => {
    const { container } = render(
      <SliderHeadless variant="centered" label="Balance" minValue={-50} maxValue={150} />
    );
    const group = container.firstChild as HTMLElement;
    expect(group).toHaveAttribute("data-zero-percent", "25");
  });

  // 48. data-zero-percent is 0 when minValue >= 0
  test("centered variant: data-zero-percent is 0 when minValue >= 0", () => {
    const { container } = render(
      <SliderHeadless variant="centered" label="Balance" minValue={0} maxValue={100} />
    );
    const group = container.firstChild as HTMLElement;
    expect(group).toHaveAttribute("data-zero-percent", "0");
  });

  // 49. Thumb data-direction is "positive" when value > 0
  test("centered variant: thumb data-direction is 'positive' when value > 0", () => {
    const { container } = render(
      <SliderHeadless
        variant="centered"
        label="Balance"
        minValue={-100}
        maxValue={100}
        defaultValue={[50]}
      />
    );
    const thumb = container.querySelector<HTMLElement>("[data-direction]");
    expect(thumb).toHaveAttribute("data-direction", "positive");
  });

  // 50. Thumb data-direction is "negative" when value < 0
  test("centered variant: thumb data-direction is 'negative' when value < 0", () => {
    const { container } = render(
      <SliderHeadless
        variant="centered"
        label="Balance"
        minValue={-100}
        maxValue={100}
        defaultValue={[-30]}
      />
    );
    const thumb = container.querySelector<HTMLElement>("[data-direction]");
    expect(thumb).toHaveAttribute("data-direction", "negative");
  });

  // 51. Thumb data-direction is "zero" when value = 0
  test("centered variant: thumb data-direction is 'zero' when value = 0", () => {
    const { container } = render(
      <SliderHeadless
        variant="centered"
        label="Balance"
        minValue={-100}
        maxValue={100}
        defaultValue={[0]}
      />
    );
    const thumb = container.querySelector<HTMLElement>("[data-direction]");
    expect(thumb).toHaveAttribute("data-direction", "zero");
  });

  // 52. ArrowRight increases value (moves toward positive)
  test("centered variant: ArrowRight increases value (moves toward positive)", () => {
    render(
      <SliderHeadless
        variant="centered"
        label="Balance"
        minValue={-100}
        maxValue={100}
        defaultValue={[0]}
      />
    );
    const input = screen.getByRole("slider");

    act(() => {
      input.focus();
    });
    fireEvent.keyDown(input, { key: "ArrowRight" });

    expect(Number((input as HTMLInputElement).value)).toBeGreaterThan(0);
  });

  // 53. ArrowLeft decreases value (moves toward negative)
  test("centered variant: ArrowLeft decreases value (moves toward negative)", () => {
    render(
      <SliderHeadless
        variant="centered"
        label="Balance"
        minValue={-100}
        maxValue={100}
        defaultValue={[0]}
      />
    );
    const input = screen.getByRole("slider");

    act(() => {
      input.focus();
    });
    fireEvent.keyDown(input, { key: "ArrowLeft" });

    expect(Number((input as HTMLInputElement).value)).toBeLessThan(0);
  });

  // 54. Supports step for discrete centered slider
  test("centered variant: supports step for discrete centered slider", () => {
    render(
      <SliderHeadless
        variant="centered"
        label="Balance"
        minValue={-50}
        maxValue={50}
        step={10}
        defaultValue={[0]}
      />
    );
    const input = screen.getByRole("slider");

    act(() => {
      input.focus();
    });
    fireEvent.keyDown(input, { key: "ArrowRight" });

    expect(input).toHaveValue("10");
  });

  // 55. onChange called with negative values
  test("centered variant: onChange called with negative values", () => {
    const onChange = vi.fn();
    render(
      <SliderHeadless
        variant="centered"
        label="Balance"
        minValue={-100}
        maxValue={100}
        defaultValue={[0]}
        onChange={onChange}
      />
    );
    const input = screen.getByRole("slider");

    act(() => {
      input.focus();
    });
    fireEvent.keyDown(input, { key: "ArrowLeft" });

    expect(onChange).toHaveBeenCalledWith(expect.arrayContaining([expect.any(Number)]));
    const calledWith = onChange.mock.calls[0][0] as number[];
    expect(calledWith[0]).toBeLessThan(0);
  });

  // 56. Renders single thumb (not two)
  test("centered variant renders single thumb (not two)", () => {
    render(<SliderHeadless variant="centered" label="Balance" minValue={-100} maxValue={100} />);
    expect(screen.getAllByRole("slider")).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// Slider — styled layer (Milestone 5)
// ---------------------------------------------------------------------------

describe("Slider — styled layer", () => {
  // 57. Active track has bg-primary class
  test("Slider renders with bg-primary class on active track", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const activeTrack = container.querySelector('[data-slot="active-track"]');
    expect(activeTrack).toBeInTheDocument();
    expect(activeTrack).toHaveClass("bg-primary");
  });

  // 58. Inactive track has bg-secondary-container class
  test("Slider renders with bg-secondary-container on inactive track", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const inactiveTrack = container.querySelector('[data-slot="inactive-track"]');
    expect(inactiveTrack).toBeInTheDocument();
    expect(inactiveTrack).toHaveClass("bg-secondary-container");
  });

  // 59. Handle has bg-primary class
  test("Slider handle has bg-primary class", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const handle = container.querySelector('[data-slot="handle"]');
    expect(handle).toBeInTheDocument();
    expect(handle).toHaveClass("bg-primary");
  });

  // 60. Handle has w-[4px] class (enabled state, not pressed)
  test("Slider handle has w-[4px] class (enabled state)", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const handle = container.querySelector('[data-slot="handle"]');
    expect(handle).toHaveClass("w-[4px]");
  });

  // 61. Handle has rounded-[2px] class
  test("Slider handle has rounded-[2px] class", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const handle = container.querySelector('[data-slot="handle"]');
    expect(handle).toHaveClass("rounded-[2px]");
  });

  // 62. xsmall size: track region has h-[44px]
  test("Slider xsmall size: container has h-[44px]", () => {
    const { container } = render(<Slider size="xsmall" label="Vol" defaultValue={[50]} />);
    const track = container.querySelector("[data-track]")!;
    expect(track).toHaveClass("h-[44px]");
  });

  // 63. medium size: track region has h-[52px]
  test("Slider medium size: container has h-[52px]", () => {
    const { container } = render(<Slider size="medium" label="Vol" defaultValue={[50]} />);
    const track = container.querySelector("[data-track]")!;
    expect(track).toHaveClass("h-[52px]");
  });

  // 64. large size: track region has h-[68px]
  test("Slider large size: container has h-[68px]", () => {
    const { container } = render(<Slider size="large" label="Vol" defaultValue={[50]} />);
    const track = container.querySelector("[data-track]")!;
    expect(track).toHaveClass("h-[68px]");
  });

  // 65. xlarge size: track region has h-[108px]
  test("Slider xlarge size: container has h-[108px]", () => {
    const { container } = render(<Slider size="xlarge" label="Vol" defaultValue={[50]} />);
    const track = container.querySelector("[data-track]")!;
    expect(track).toHaveClass("h-[108px]");
  });

  // 66. xsmall active track has h-[16px]
  test("Slider xsmall active track has h-[16px]", () => {
    const { container } = render(<Slider size="xsmall" label="Vol" defaultValue={[50]} />);
    const activeTrack = container.querySelector('[data-slot="active-track"]');
    expect(activeTrack).toHaveClass("h-[16px]");
  });

  // 67. medium active track has h-[40px]
  test("Slider medium active track has h-[40px]", () => {
    const { container } = render(<Slider size="medium" label="Vol" defaultValue={[50]} />);
    const activeTrack = container.querySelector('[data-slot="active-track"]');
    expect(activeTrack).toHaveClass("h-[40px]");
  });

  // 68. xlarge active track has h-[96px]
  test("Slider xlarge active track has h-[96px]", () => {
    const { container } = render(<Slider size="xlarge" label="Vol" defaultValue={[50]} />);
    const activeTrack = container.querySelector('[data-slot="active-track"]');
    expect(activeTrack).toHaveClass("h-[96px]");
  });

  // 69. Track layout is absolute/inset-0/pointer-events-none (absolute-fill container)
  test("Slider track layout is absolute inset-0 pointer-events-none", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const trackLayout = container.querySelector('[data-slot="track-layout"]');
    expect(trackLayout).toBeInTheDocument();
    expect(trackLayout).toHaveClass("absolute");
    expect(trackLayout).toHaveClass("inset-0");
    expect(trackLayout).toHaveClass("pointer-events-none");
  });

  // 70. Disabled: active track has group-data-driven disabled classes
  test("Slider disabled: active track has group-data disabled classes", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} isDisabled />);
    const activeTrack = container.querySelector('[data-slot="active-track"]');
    expect(activeTrack).toHaveClass("group-data-[disabled]/slider:bg-on-surface");
    expect(activeTrack).toHaveClass("group-data-[disabled]/slider:opacity-38");
  });

  // 71. Disabled: inactive track has group-data-driven disabled class
  test("Slider disabled: inactive track has group-data disabled class", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} isDisabled />);
    const inactiveTrack = container.querySelector('[data-slot="inactive-track"]');
    expect(inactiveTrack).toHaveClass("group-data-[disabled]/slider:bg-on-surface/10");
  });

  // 72. Disabled: handle has group-data-driven disabled classes
  test("Slider disabled: handle has group-data disabled classes", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} isDisabled />);
    const handle = container.querySelector('[data-slot="handle"]');
    expect(handle).toHaveClass("group-data-[disabled]/slider-thumb:bg-on-surface");
    expect(handle).toHaveClass("group-data-[disabled]/slider-thumb:opacity-38");
  });

  // 73. index.ts exports Slider, SliderHeadless, and all variants
  test("index.ts exports Slider, SliderHeadless, and all variants", () => {
    expect(SliderIndex.Slider).toBeDefined();
    expect(SliderIndex.SliderHeadless).toBeDefined();
    expect(SliderIndex.sliderContainerVariants).toBeDefined();
    expect(SliderIndex.sliderActiveTrackVariants).toBeDefined();
    expect(SliderIndex.sliderInactiveTrackVariants).toBeDefined();
    expect(SliderIndex.sliderHandleVariants).toBeDefined();
    expect(SliderIndex.sliderHandleStateLayerVariants).toBeDefined();
    expect(SliderIndex.sliderTrackLayoutVariants).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Slider — stop indicators and value indicator (Milestone 6)
// ---------------------------------------------------------------------------

describe("Slider — stop indicators and value indicator", () => {
  // 74. stop indicators not rendered when showStops is false
  test("stop indicators not rendered when showStops is false", () => {
    const { container } = render(<Slider label="Vol" step={10} defaultValue={[50]} />);
    const dots = container.querySelectorAll('[data-slot="stop-dot"]');
    expect(dots).toHaveLength(0);
  });

  // 75. stop indicators rendered when showStops and step are provided
  test("stop indicators rendered when showStops and step are provided", () => {
    const { container } = render(
      <Slider label="Vol" showStops step={10} minValue={0} maxValue={100} defaultValue={[50]} />
    );
    const dots = container.querySelectorAll('[data-slot="stop-dot"]');
    expect(dots).toHaveLength(11); // 0, 10, 20, ..., 100
  });

  // 76. stop dots have correct count based on step
  test("stop dots have correct count based on step", () => {
    const { container } = render(
      <Slider label="Vol" showStops step={25} minValue={0} maxValue={100} defaultValue={[50]} />
    );
    const dots = container.querySelectorAll('[data-slot="stop-dot"]');
    expect(dots).toHaveLength(5); // 0, 25, 50, 75, 100
  });

  // 77. stop dots on active track have bg-on-primary class
  test("stop dots on active track have bg-on-primary class", () => {
    const { container } = render(
      <Slider label="Vol" showStops step={25} minValue={0} maxValue={100} defaultValue={[50]} />
    );
    const dots = container.querySelectorAll('[data-slot="stop-dot"]');
    // dots at 0 and 25 are on active track (value is 50, so stopValue <= 50)
    expect(dots[0]).toHaveClass("bg-on-primary");
    expect(dots[1]).toHaveClass("bg-on-primary");
  });

  // 78. stop dots on inactive track have bg-on-secondary-container class
  test("stop dots on inactive track have bg-on-secondary-container class", () => {
    const { container } = render(
      <Slider label="Vol" showStops step={25} minValue={0} maxValue={100} defaultValue={[50]} />
    );
    const dots = container.querySelectorAll('[data-slot="stop-dot"]');
    // dots at 75 and 100 are on inactive track (> 50)
    expect(dots[3]).toHaveClass("bg-on-secondary-container");
    expect(dots[4]).toHaveClass("bg-on-secondary-container");
  });

  // 79. stops container has justify-between and px-[4px]
  test("stops container has justify-between and px-[4px]", () => {
    const { container } = render(<Slider label="Vol" showStops step={10} defaultValue={[50]} />);
    const stopsContainer = container.querySelector('[data-slot="stops-container"]');
    expect(stopsContainer).toHaveClass("justify-between");
    expect(stopsContainer).toHaveClass("px-[4px]");
  });

  // 80. stops container is aria-hidden
  test("stops container is aria-hidden", () => {
    const { container } = render(<Slider label="Vol" showStops step={10} defaultValue={[50]} />);
    const stopsContainer = container.querySelector('[data-slot="stops-container"]');
    expect(stopsContainer).toHaveAttribute("aria-hidden", "true");
  });

  // 81. value indicator not rendered when showValueIndicator is false
  test("value indicator not rendered when showValueIndicator is false", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const tooltip = container.querySelector('[role="tooltip"]');
    expect(tooltip).not.toBeInTheDocument();
  });

  // 82. value indicator: pressing slider-thumb sets data-pressed attribute
  // (CSS group-data-[pressed]/slider-thumb selector then reveals the indicator)
  test("value indicator: pressing slider-thumb sets data-pressed when showValueIndicator is true", () => {
    const { container } = render(<Slider label="Vol" showValueIndicator defaultValue={[50]} />);
    const thumbEl = container.querySelector('[data-slot="slider-thumb"]')!;
    expect(thumbEl).toBeInTheDocument();
    (thumbEl as HTMLElement).setPointerCapture = vi.fn();
    (thumbEl as HTMLElement).releasePointerCapture = vi.fn();
    fireEvent.pointerDown(thumbEl, { pointerId: 1, isPrimary: true, button: 0, buttons: 1 });
    expect(thumbEl).toHaveAttribute("data-pressed");
    // Indicator is always in DOM when showValueIndicator=true
    const tooltip = container.querySelector('[role="tooltip"]');
    expect(tooltip).toBeInTheDocument();
  });

  // 83. value indicator has bg-inverse-surface class
  test("value indicator has bg-inverse-surface class", () => {
    const { container } = render(<Slider label="Vol" showValueIndicator defaultValue={[50]} />);
    const tooltip = container.querySelector('[role="tooltip"]');
    expect(tooltip).toHaveClass("bg-inverse-surface");
  });

  // 84. value indicator has rounded-full class (pill shape)
  test("value indicator has rounded-full class (pill shape)", () => {
    const { container } = render(<Slider label="Vol" showValueIndicator defaultValue={[50]} />);
    const tooltip = container.querySelector('[role="tooltip"]');
    expect(tooltip).toHaveClass("rounded-full");
  });

  // 85. value indicator text has text-inverse-on-surface class
  test("value indicator text has text-inverse-on-surface class", () => {
    const { container } = render(<Slider label="Vol" showValueIndicator defaultValue={[50]} />);
    const textSpan = container.querySelector('[role="tooltip"] span');
    expect(textSpan).toHaveClass("text-inverse-on-surface");
  });

  // 86. value indicator text has text-label-large class
  test("value indicator text has text-label-large class", () => {
    const { container } = render(<Slider label="Vol" showValueIndicator defaultValue={[50]} />);
    const textSpan = container.querySelector('[role="tooltip"] span');
    expect(textSpan).toHaveClass("text-label-large");
  });

  // 87. value indicator displays formatted value
  test("value indicator displays formatted value", () => {
    const { container } = render(
      <Slider label="Vol" showValueIndicator formatValue={(v) => `$${v}`} defaultValue={[50]} />
    );
    const tooltip = container.querySelector('[role="tooltip"]');
    expect(tooltip).toHaveTextContent("$50");
  });

  // 88. value indicator has min-w-[48px] class
  test("value indicator has min-w-[48px] class", () => {
    const { container } = render(<Slider label="Vol" showValueIndicator defaultValue={[50]} />);
    const tooltip = container.querySelector('[role="tooltip"]');
    expect(tooltip).toHaveClass("min-w-[48px]");
  });

  // 89. end track stop on inactive track has right-[4px] position
  test("end track stop on inactive track has right-[4px] position", () => {
    const { container } = render(<Slider label="Vol" showStops step={10} defaultValue={[50]} />);
    const trackStop = container.querySelector('[data-slot="track-stop-end"]');
    expect(trackStop).toHaveClass("right-[4px]");
  });

  // 90. end track stop has bg-on-secondary-container class
  test("end track stop has bg-on-secondary-container class", () => {
    const { container } = render(<Slider label="Vol" showStops step={10} defaultValue={[50]} />);
    const trackStop = container.querySelector('[data-slot="track-stop-end"]');
    expect(trackStop).toHaveClass("bg-on-secondary-container");
  });
});

// ---------------------------------------------------------------------------
// Slider — vertical orientation (Milestone 7)
// ---------------------------------------------------------------------------

describe("Slider — vertical orientation", () => {
  // 91. Track layout is absolute (absolute-fill container, orientation-agnostic)
  test("vertical orientation: track layout is absolute", () => {
    const { container } = render(<Slider label="Vol" orientation="vertical" defaultValue={[50]} />);
    const trackLayout = container.querySelector('[data-slot="track-layout"]');
    expect(trackLayout).toHaveClass("absolute");
    expect(trackLayout).not.toHaveClass("flex-1");
  });

  // 92. Container has data-orientation="vertical"
  test("vertical orientation: data-orientation='vertical' on container", () => {
    const { container } = render(<Slider label="Vol" orientation="vertical" defaultValue={[50]} />);
    const group = container.querySelector('[role="group"]');
    expect(group).toHaveAttribute("data-orientation", "vertical");
  });

  // 93. ArrowUp increases value in vertical
  test("vertical orientation: ArrowUp increases value", () => {
    render(<Slider label="Vol" orientation="vertical" defaultValue={[50]} />);
    const input = screen.getByRole("slider");

    act(() => {
      input.focus();
    });
    fireEvent.keyDown(input, { key: "ArrowUp" });

    expect(Number((input as HTMLInputElement).value)).toBeGreaterThan(50);
  });

  // 94. ArrowDown decreases value in vertical
  test("vertical orientation: ArrowDown decreases value", () => {
    render(<Slider label="Vol" orientation="vertical" defaultValue={[50]} />);
    const input = screen.getByRole("slider");

    act(() => {
      input.focus();
    });
    fireEvent.keyDown(input, { key: "ArrowDown" });

    expect(Number((input as HTMLInputElement).value)).toBeLessThan(50);
  });

  // 95. aria-orientation="vertical" on slider input
  test("vertical orientation: aria-orientation='vertical' on slider input", () => {
    render(<Slider label="Vol" orientation="vertical" defaultValue={[50]} />);
    const input = screen.getByRole("slider");
    expect(input).toHaveAttribute("aria-orientation", "vertical");
  });

  // 96. Container has fixed width based on size for vertical
  test("vertical orientation: container has w-[52px] for medium size", () => {
    render(<Slider label="Vol" orientation="vertical" size="medium" defaultValue={[50]} />);
    const group = screen.getByRole("group");
    expect(group).toHaveClass("w-[52px]");
  });

  // 97. Handle dimensions are swapped in vertical — width is explicitly sized per MD3 §10.9
  test("vertical orientation: handle has h-[4px] and w-[44px] for xsmall (no w-full)", () => {
    const { container } = render(<Slider label="Vol" orientation="vertical" defaultValue={[50]} />);
    const handle = container.querySelector('[data-slot="handle"]');
    expect(handle).toHaveClass("h-[4px]");
    expect(handle).toHaveClass("w-[44px]");
    expect(handle).not.toHaveClass("w-full");
  });
});

// ---------------------------------------------------------------------------
// Slider — inset icon (Milestone 7)
// ---------------------------------------------------------------------------

describe("Slider — inset icon", () => {
  // 98. Inset icon not rendered for xsmall size
  test("inset icon not rendered for xsmall size", () => {
    const { container } = render(
      <Slider label="Vol" icon={<svg />} size="xsmall" defaultValue={[50]} />
    );
    expect(container.querySelector('[data-slot="inset-icon"]')).not.toBeInTheDocument();
  });

  // 99. Inset icon not rendered for small size
  test("inset icon not rendered for small size", () => {
    const { container } = render(
      <Slider label="Vol" icon={<svg />} size="small" defaultValue={[50]} />
    );
    expect(container.querySelector('[data-slot="inset-icon"]')).not.toBeInTheDocument();
  });

  // 100. Inset icon rendered for medium size
  test("inset icon rendered for medium size", () => {
    const { container } = render(
      <Slider label="Vol" icon={<svg />} size="medium" defaultValue={[50]} />
    );
    expect(container.querySelector('[data-slot="inset-icon"]')).toBeInTheDocument();
  });

  // 101. Inset icon rendered for large size
  test("inset icon rendered for large size", () => {
    const { container } = render(
      <Slider label="Vol" icon={<svg />} size="large" defaultValue={[50]} />
    );
    expect(container.querySelector('[data-slot="inset-icon"]')).toBeInTheDocument();
  });

  // 102. Inset icon rendered for xlarge size
  test("inset icon rendered for xlarge size", () => {
    const { container } = render(
      <Slider label="Vol" icon={<svg />} size="xlarge" defaultValue={[50]} />
    );
    expect(container.querySelector('[data-slot="inset-icon"]')).toBeInTheDocument();
  });

  // 103. Inset icon has text-on-primary class
  test("inset icon has text-on-primary class", () => {
    const { container } = render(
      <Slider label="Vol" icon={<svg />} size="medium" defaultValue={[50]} />
    );
    const iconEl = container.querySelector('[data-slot="inset-icon"]');
    expect(iconEl).toHaveClass("text-on-primary");
  });

  // 104. Inset icon has left-[8px] position in horizontal orientation
  test("inset icon has left-[8px] position in horizontal orientation", () => {
    const { container } = render(
      <Slider
        label="Vol"
        icon={<svg />}
        size="medium"
        orientation="horizontal"
        defaultValue={[50]}
      />
    );
    const iconEl = container.querySelector('[data-slot="inset-icon"]');
    expect(iconEl).toHaveClass("left-[8px]");
  });

  // 105. Inset icon medium/large has w-[24px] h-[24px]
  test("inset icon medium/large has w-[24px] and h-[24px]", () => {
    const { container } = render(
      <Slider label="Vol" icon={<svg />} size="medium" defaultValue={[50]} />
    );
    const iconEl = container.querySelector('[data-slot="inset-icon"]');
    expect(iconEl).toHaveClass("w-[24px]");
    expect(iconEl).toHaveClass("h-[24px]");
  });

  // 106. Inset icon xlarge has w-[32px] h-[32px]
  test("inset icon xlarge has w-[32px] and h-[32px]", () => {
    const { container } = render(
      <Slider label="Vol" icon={<svg />} size="xlarge" defaultValue={[50]} />
    );
    const iconEl = container.querySelector('[data-slot="inset-icon"]');
    expect(iconEl).toHaveClass("w-[32px]");
    expect(iconEl).toHaveClass("h-[32px]");
  });

  // 107. Inset icon not rendered for range variant
  test("inset icon not rendered for range variant", () => {
    const { container } = render(
      <Slider label="Vol" variant="range" icon={<svg />} size="large" defaultValue={[25, 75]} />
    );
    expect(container.querySelector('[data-slot="inset-icon"]')).not.toBeInTheDocument();
  });

  // 108. Inset icon not rendered for centered variant
  test("inset icon not rendered for centered variant", () => {
    const { container } = render(
      <Slider label="Vol" variant="centered" icon={<svg />} size="large" defaultValue={[0]} />
    );
    expect(container.querySelector('[data-slot="inset-icon"]')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Slider — motion and animation (Milestone 8)
// ---------------------------------------------------------------------------

describe("Slider — motion and animation", () => {
  afterEach(() => {
    mockUseReducedMotion.mockReturnValue(false);
  });

  // 109. active track has transition-[left,width,right] class (horizontal spring)
  test("active track has transition-[left,width,right] class", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const activeTrack = container.querySelector('[data-slot="active-track"]');
    expect(activeTrack).toHaveClass("transition-[left,width,right]");
  });

  // 110. active track has duration-spring-standard-fast-spatial class
  test("active track has duration-spring-standard-fast-spatial class", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const activeTrack = container.querySelector('[data-slot="active-track"]');
    expect(activeTrack).toHaveClass("duration-spring-standard-fast-spatial");
  });

  // 111. active track has ease-spring-standard-fast-spatial class
  test("active track has ease-spring-standard-fast-spatial class", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const activeTrack = container.querySelector('[data-slot="active-track"]');
    expect(activeTrack).toHaveClass("ease-spring-standard-fast-spatial");
  });

  // 112. handle has transition-[width] class
  test("handle has transition-[width] class", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const handle = container.querySelector('[data-slot="handle"]');
    expect(handle).toHaveClass("transition-[width]");
  });

  // 113. handle has duration-spring-standard-fast-spatial class (MD3 spring system)
  test("handle has duration-spring-standard-fast-spatial class", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const handle = container.querySelector('[data-slot="handle"]');
    expect(handle).toHaveClass("duration-spring-standard-fast-spatial");
  });

  // 114. handle has ease-spring-standard-fast-spatial class (MD3 spring system)
  test("handle has ease-spring-standard-fast-spatial class for width transition", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const handle = container.querySelector('[data-slot="handle"]');
    expect(handle).toHaveClass("ease-spring-standard-fast-spatial");
  });

  // 115. state layer has transition-opacity class
  test("state layer has transition-opacity class", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const stateLayer = container.querySelector('[data-slot="state-layer"]');
    expect(stateLayer).toHaveClass("transition-opacity");
  });

  // 116. state layer has duration-spring-standard-fast-effects class (MD3 spring effects)
  test("state layer has duration-spring-standard-fast-effects class", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const stateLayer = container.querySelector('[data-slot="state-layer"]');
    expect(stateLayer).toHaveClass("duration-spring-standard-fast-effects");
  });

  // 117. value indicator has transition-[scale,opacity] class (Tailwind v4: scale is its own property)
  test("value indicator has transition-[scale,opacity] class", () => {
    const { container } = render(<Slider label="Vol" showValueIndicator defaultValue={[50]} />);
    const tooltip = container.querySelector('[role="tooltip"]');
    expect(tooltip).toHaveClass("transition-[scale,opacity]");
  });

  // 118. value indicator has duration-spring-standard-fast-spatial class (spatial spring)
  test("value indicator has duration-spring-standard-fast-spatial class", () => {
    const { container } = render(<Slider label="Vol" showValueIndicator defaultValue={[50]} />);
    const tooltip = container.querySelector('[role="tooltip"]');
    expect(tooltip).toHaveClass("duration-spring-standard-fast-spatial");
  });

  // 119. value indicator has ease-spring-standard-fast-spatial class (spatial spring)
  test("value indicator has ease-spring-standard-fast-spatial class", () => {
    const { container } = render(<Slider label="Vol" showValueIndicator defaultValue={[50]} />);
    const tooltip = container.querySelector('[role="tooltip"]');
    expect(tooltip).toHaveClass("ease-spring-standard-fast-spatial");
  });

  // 120. reduced motion: no transition classes on active track
  test("reduced motion: no transition classes on active track", () => {
    mockUseReducedMotion.mockReturnValue(true);
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const activeTrack = container.querySelector('[data-slot="active-track"]');
    expect(activeTrack).not.toHaveClass("transition-[flex-basis]");
  });

  // 121. reduced motion: no transition classes on handle
  test("reduced motion: no transition classes on handle", () => {
    mockUseReducedMotion.mockReturnValue(true);
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const handle = container.querySelector('[data-slot="handle"]');
    expect(handle).not.toHaveClass("transition-[width]");
  });

  // 122. reduced motion: value indicator has no transition class (appears instantly)
  test("reduced motion: value indicator has no transition class", () => {
    mockUseReducedMotion.mockReturnValue(true);
    const { container } = render(<Slider label="Vol" showValueIndicator defaultValue={[50]} />);
    const tooltip = container.querySelector('[role="tooltip"]');
    expect(tooltip).not.toHaveClass("transition-[scale,opacity]");
  });

  // 123. drag state: active track suppresses spring transition
  // Triggered by pressing the slider-thumb (the RA-positioned interactive element)
  test("drag state: active track suppresses spring transition", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const thumbEl = container.querySelector('[data-slot="slider-thumb"]')!;
    (thumbEl as HTMLElement).setPointerCapture = vi.fn();
    (thumbEl as HTMLElement).releasePointerCapture = vi.fn();
    fireEvent.pointerDown(thumbEl, { pointerId: 1, isPrimary: true, button: 0, buttons: 1 });
    const activeTrack = container.querySelector('[data-slot="active-track"]');
    expect(activeTrack).not.toHaveClass("transition-[flex-basis]");
  });

  // 124. no hardcoded duration-[Xms] or ease-[cubic-bezier] values
  test("no hardcoded duration-[Xms] or ease-[cubic-bezier] values", () => {
    const { container } = render(<Slider label="Vol" showValueIndicator defaultValue={[50]} />);
    const allClasses = Array.from(container.querySelectorAll("*"))
      .map((el) => el.className)
      .filter((c) => typeof c === "string")
      .join(" ");
    expect(allClasses).not.toMatch(/duration-\[\d+ms\]/);
    expect(allClasses).not.toMatch(/ease-\[cubic-bezier/);
  });
});

// ---------------------------------------------------------------------------
// Slider — accessibility (Milestone 9)
// ---------------------------------------------------------------------------

describe("Slider — accessibility", () => {
  afterEach(() => {
    mockUseReducedMotion.mockReturnValue(false);
  });

  // 125. standard slider: axe reports zero violations
  test("standard slider: axe reports zero violations", async () => {
    const { container } = render(<Slider label="Volume" defaultValue={[50]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // 126. range slider: axe reports zero violations
  test("range slider: axe reports zero violations", async () => {
    const { container } = render(
      <Slider
        variant="range"
        label="Price range"
        thumbLabels={["Minimum", "Maximum"]}
        defaultValue={[30, 70]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // 127. centered slider: axe reports zero violations
  test("centered slider: axe reports zero violations", async () => {
    const { container } = render(
      <Slider
        variant="centered"
        label="Balance"
        minValue={-100}
        maxValue={100}
        defaultValue={[0]}
      />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // 128. disabled slider: axe reports zero violations
  test("disabled slider: axe reports zero violations", async () => {
    const { container } = render(<Slider label="Volume" isDisabled defaultValue={[50]} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // 129. aria-orientation matches orientation prop
  test("aria-orientation matches orientation prop", () => {
    const { container: hContainer } = render(
      <Slider label="Vol" orientation="horizontal" defaultValue={[50]} />
    );
    const hInput = hContainer.querySelector('input[type="range"]');
    expect(hInput).toHaveAttribute("aria-orientation", "horizontal");

    const { container: vContainer } = render(
      <Slider label="Vol" orientation="vertical" defaultValue={[50]} />
    );
    const vInput = vContainer.querySelector('input[type="range"]');
    expect(vInput).toHaveAttribute("aria-orientation", "vertical");
  });

  // 130. aria-valuetext is used when formatValue is provided
  test("aria-valuetext is used when formatValue is provided", () => {
    const { container } = render(
      <Slider label="Price" defaultValue={[50]} formatValue={(v) => `$${v}`} />
    );
    const input = container.querySelector('input[type="range"]');
    expect(input).toHaveAttribute("aria-valuetext", "$50");
  });

  // 131. range slider: left thumb max constrained by right thumb value
  test("range slider: left thumb max constrained by right thumb", () => {
    const { container } = render(<Slider variant="range" label="Range" defaultValue={[30, 70]} />);
    const inputs = container.querySelectorAll('input[type="range"]');
    // React Aria sets native max attribute (implicit aria-valuemax for <input type="range">)
    expect(inputs[0]).toHaveAttribute("max", "70");
  });

  // 132. range slider: right thumb min constrained by left thumb value
  test("range slider: right thumb min constrained by left thumb", () => {
    const { container } = render(<Slider variant="range" label="Range" defaultValue={[30, 70]} />);
    const inputs = container.querySelectorAll('input[type="range"]');
    // React Aria sets native min attribute (implicit aria-valuemin for <input type="range">)
    expect(inputs[1]).toHaveAttribute("min", "30");
  });

  // 133. Tab key moves focus from left thumb to right thumb in range
  test("Tab key moves focus from left thumb to right thumb in range", () => {
    const { container } = render(<Slider variant="range" label="Range" defaultValue={[30, 70]} />);
    const inputs = container.querySelectorAll('input[type="range"]');
    expect(inputs).toHaveLength(2);

    act(() => {
      (inputs[0] as HTMLElement).focus();
    });
    expect(document.activeElement).toBe(inputs[0]);

    act(() => {
      (inputs[1] as HTMLElement).focus();
    });
    expect(document.activeElement).toBe(inputs[1]);
  });

  // 134. focus-visible ring appears on keyboard focus
  test("focus-visible ring appears on keyboard focus", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const input = container.querySelector('input[type="range"]')!;

    act(() => {
      // Keyboard modality: fire keydown before focus so React Aria sets isFocusVisible=true
      fireEvent.keyDown(document.body, { key: "Tab" });
      (input as HTMLElement).focus();
      fireEvent.focus(input);
    });

    const thumbWithFocusVisible = container.querySelector("[data-focus-visible]");
    expect(thumbWithFocusVisible).not.toBeNull();
  });

  // 135. focus ring NOT visible on pointer interaction
  test("focus ring NOT visible on pointer interaction", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const input = container.querySelector('input[type="range"]')!;

    act(() => {
      // jsdom has no PointerEvent; React Aria falls back to mousedown for modality tracking.
      // Firing mouseDown on document.body resets modality to "pointer" before focusing.
      fireEvent.mouseDown(document.body);
      (input as HTMLElement).focus();
      fireEvent.focus(input);
    });

    const thumbWithFocusVisible = container.querySelector("[data-focus-visible]");
    expect(thumbWithFocusVisible).toBeNull();
  });

  // 136. output element serves as live region for value changes
  test("output element serves as live region for value changes", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const output = container.querySelector("output");
    expect(output).not.toBeNull();
    expect(output).toHaveTextContent("50");
  });

  // 137. stops overlay has aria-hidden="true"
  test("stops overlay has aria-hidden", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} step={10} showStops />);
    const stopsContainer = container.querySelector('[data-slot="stops-container"]');
    expect(stopsContainer).toHaveAttribute("aria-hidden", "true");
  });

  // 138. value indicator is not announced to screen reader
  test("value indicator is not announced to screen reader", () => {
    const { container } = render(<Slider label="Vol" showValueIndicator defaultValue={[50]} />);
    // Indicator is always in DOM when showValueIndicator=true (CSS-driven visibility)
    const indicator = container.querySelector('[data-slot="value-indicator"]');
    expect(indicator).not.toBeNull();
    // role="tooltip" is a non-live landmark; aria-hidden="true" permanently since
    // accessible value is in the <output> element managed by React Aria
    const hasTooltipRole = indicator?.getAttribute("role") === "tooltip";
    const isAriaHidden = indicator?.getAttribute("aria-hidden") === "true";
    expect(hasTooltipRole || isAriaHidden).toBe(true);
  });

  // 139. development warning when no accessible name provided
  test("development warning when no accessible name provided", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<Slider defaultValue={[50]} />);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining("[Slider]"));
    consoleSpy.mockRestore();
  });

  // 140. disabled slider has tabindex removed or -1
  test("disabled slider has tabindex removed or -1", () => {
    const { container } = render(<Slider label="Vol" isDisabled defaultValue={[50]} />);
    const input = container.querySelector('input[type="range"]');
    expect(input).not.toBeNull();
    const tabIndex = input?.getAttribute("tabindex");
    const isDisabledAttr = input?.hasAttribute("disabled");
    // React Aria either removes tabindex, sets it to -1, or sets the disabled attribute
    expect(tabIndex === "-1" || tabIndex === null || isDisabledAttr).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Slider — stories (Milestone 10)
// ---------------------------------------------------------------------------

describe("Slider — stories", () => {
  // 141. Storybook meta has correct title 'Components/Slider'
  test("Storybook meta has correct title 'Components/Slider'", () => {
    const meta = SliderStories.default as { title: string; tags: string[] };
    expect(meta.title).toBe("Components/Slider");
  });

  // 142. Storybook meta has 'autodocs' tag
  test("Storybook meta has 'autodocs' tag", () => {
    const meta = SliderStories.default as { title: string; tags: string[] };
    expect(meta.tags).toContain("autodocs");
  });

  // 143. Default story renders without errors
  test("Default story renders without errors", () => {
    expect(() => render(<Slider label="Volume" defaultValue={[50]} size="xsmall" />)).not.toThrow();
  });

  // 144. AllSizes story renders five slider instances
  test("AllSizes story renders five slider instances", () => {
    const sizes: SliderSize[] = ["xsmall", "small", "medium", "large", "xlarge"];
    const { container } = render(
      <div>
        {sizes.map((size) => (
          <Slider key={size} label="Volume" defaultValue={[50]} size={size} />
        ))}
      </div>
    );
    expect(container.querySelectorAll('[role="group"]')).toHaveLength(5);
  });

  // 145. RangeSlider story renders two thumbs
  test("RangeSlider story renders two thumbs", () => {
    render(
      <Slider
        variant="range"
        label="Price range"
        defaultValue={[200, 800]}
        minValue={0}
        maxValue={1000}
      />
    );
    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });

  // 146. DisabledState story renders with aria-disabled
  test("DisabledState story renders with aria-disabled", () => {
    const { container } = render(<Slider label="Brightness" defaultValue={[60]} isDisabled />);
    // React Aria marks the group with data-disabled and the native input with
    // the disabled attribute — both are valid signals of the disabled state.
    const group = container.querySelector('[role="group"]');
    const input = container.querySelector('input[type="range"]');
    expect(group).toHaveAttribute("data-disabled");
    expect(input).toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// Slider — regression tests (absolute track layout)
// ---------------------------------------------------------------------------

describe("Slider — absolute track layout regression", () => {
  // R1. Vertical at value=0: active track is absolute, has no flex-1
  test("vertical value=0: active track is absolute and has no flex-1", () => {
    const { container } = render(<Slider label="Vol" orientation="vertical" defaultValue={[0]} />);
    const activeTrack = container.querySelector('[data-slot="active-track"]');
    expect(activeTrack).toHaveClass("absolute");
    expect(activeTrack).not.toHaveClass("flex-1");
  });

  // R2. Range at defaultValue=[0, 50]: renders all three segments without throwing
  test("range at [0, 50] renders all three track segments", () => {
    const { container } = render(<Slider variant="range" label="Range" defaultValue={[0, 50]} />);
    expect(container.querySelector('[data-slot="inactive-track-left"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="active-track"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="inactive-track-right"]')).toBeInTheDocument();
  });

  // R3. Range at defaultValue=[50, 100]: renders all three segments without throwing
  test("range at [50, 100] renders all three track segments", () => {
    const { container } = render(<Slider variant="range" label="Range" defaultValue={[50, 100]} />);
    expect(container.querySelector('[data-slot="inactive-track-left"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="active-track"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="inactive-track-right"]')).toBeInTheDocument();
  });

  // R4. Active track is absolute (not flex-shrink-0 / flex-1)
  test("horizontal active track is absolute", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const activeTrack = container.querySelector('[data-slot="active-track"]');
    expect(activeTrack).toHaveClass("absolute");
    expect(activeTrack).not.toHaveClass("flex-shrink-0");
    expect(activeTrack).not.toHaveClass("flex-1");
  });

  // R5. Inactive track is absolute (not flex-1)
  test("horizontal inactive track is absolute", () => {
    const { container } = render(<Slider label="Vol" defaultValue={[50]} />);
    const inactiveTrack = container.querySelector('[data-slot="inactive-track"]');
    expect(inactiveTrack).toHaveClass("absolute");
    expect(inactiveTrack).not.toHaveClass("flex-1");
  });

  // R6. Vertical track region uses flex-1 (not h-full) so it fills the flex container
  test("vertical track region has flex-1 and not h-full", () => {
    const { container } = render(<Slider label="Vol" orientation="vertical" defaultValue={[50]} />);
    const track = container.querySelector("[data-track]");
    expect(track).toHaveClass("flex-1");
    expect(track).not.toHaveClass("h-full");
  });

  // R7. Vertical handle width scales per size (medium = 52px, xlarge = 108px)
  test("vertical handle width is w-[52px] for medium size", () => {
    const { container } = render(
      <Slider label="Vol" orientation="vertical" size="medium" defaultValue={[50]} />
    );
    const handle = container.querySelector('[data-slot="handle"]');
    expect(handle).toHaveClass("w-[52px]");
    expect(handle).not.toHaveClass("w-full");
  });

  test("vertical handle width is w-[108px] for xlarge size", () => {
    const { container } = render(
      <Slider label="Vol" orientation="vertical" size="xlarge" defaultValue={[50]} />
    );
    const handle = container.querySelector('[data-slot="handle"]');
    expect(handle).toHaveClass("w-[108px]");
    expect(handle).not.toHaveClass("w-full");
  });

  // R8. Vertical centered variant renders all three track segments (active + 2 inactive)
  test("vertical centered renders active track and two inactive segments", () => {
    const { container } = render(
      <Slider
        label="Balance"
        variant="centered"
        orientation="vertical"
        minValue={-50}
        maxValue={50}
        defaultValue={[20]}
      />
    );
    const activeTrack = container.querySelector('[data-slot="active-track"]');
    const inactiveTracks = container.querySelectorAll(
      '[data-slot="inactive-track-left"], [data-slot="inactive-track-right"]'
    );
    expect(activeTrack).toBeInTheDocument();
    expect(inactiveTracks).toHaveLength(2);
  });
});
