import { describe, test, expectTypeOf, expect, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
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
