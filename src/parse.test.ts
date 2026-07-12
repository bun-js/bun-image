import { describe, expect, test } from "bun:test";
import { parseArguments } from "./parse";

describe("parseArguments", () => {
  test("keeps operations in command order", () => {
    expect(
      parseArguments(["in.jpg", "--flip", "--resize", "20x10", "out.png"])
        .operations,
    ).toEqual([{ kind: "flip" }, { kind: "resize", width: 20, height: 10 }]);
  });

  test("supports aspect-preserving numeric resize", () => {
    expect(
      parseArguments(["in.jpg", "--resize", "100", "out.webp"]).operations,
    ).toEqual([{ kind: "resize", width: 100, height: undefined }]);
  });

  test("accepts dash as a terminal destination", () => {
    expect(parseArguments(["in.png", "--metadata", "-"]).output).toBe("-");
  });

  test("rejects unsupported geometry and extra paths", () => {
    expect(() =>
      parseArguments(["in.jpg", "--resize", "50%", "out.png"]),
    ).toThrow("numeric");
    expect(() => parseArguments(["a.jpg", "b.jpg", "c.jpg"])).toThrow(
      "one input",
    );
  });
});
