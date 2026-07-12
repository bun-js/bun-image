import { describe, expect, test } from "bun:test"
import { parseArguments } from "./parseArguments"

describe("parseArguments", () => {
  test("keeps operations in command order", () => {
    expect(
      parseArguments(["in.jpg", "--flip", "--resize", "20x10", "out.png"])
        .operations,
    ).toEqual([{ kind: "flip" }, { kind: "resize", width: 20, height: 10 }])
  })
  test("supports aspect-preserving numeric resize", () => {
    expect(
      parseArguments(["in.jpg", "--resize", "100", "out.webp"]).operations,
    ).toEqual([{ kind: "resize", width: 100, height: undefined }])
  })
  test("accepts negative numeric option values", () => {
    expect(
      parseArguments(["in.jpg", "--rotate", "-90", "--brightness", "-0.5", "out.webp"]).operations,
    ).toEqual([
      { kind: "rotate", degrees: -90 },
      { kind: "modulate", brightness: -0.5 },
    ])
  })
  test("accepts dash as a terminal destination", () => {
    expect(parseArguments(["in.png", "--metadata", "-"]).output).toBe("-")
  })
  test("parses all scalar and terminal options", () => {
    const args = parseArguments([
      "--clipboard",
      "--metadata",
      "--format",
      "webp",
      "--quality",
      "80",
      "--rotate",
      "90",
      "--flip",
      "--flop",
      "--brightness",
      "1.2",
      "--saturation",
      "0",
      "input.png",
      "output.webp",
    ])
    expect(args).toMatchObject({
      input: "-",
      format: "webp",
      quality: 80,
      terminal: "metadata",
      clipboard: true,
    })
    expect(args.operations).toEqual([
      { kind: "rotate", degrees: 90 },
      { kind: "flip" },
      { kind: "flop" },
      { kind: "modulate", brightness: 1.2, saturation: 0 },
    ])
  })
  test("rejects unsupported geometry and extra paths", () => {
    expect(() =>
      parseArguments(["in.jpg", "--resize", "50%", "out.png"]),
    ).toThrow("numeric")
    expect(() => parseArguments(["a.jpg", "b.jpg", "c.jpg"])).toThrow(
      "one input",
    )
    expect(() =>
      parseArguments(["in.jpg", "--format", "tiff", "out.png"]),
    ).toThrow("unsupported format")
    expect(() =>
      parseArguments(["in.jpg", "--quality", "101", "out.png"]),
    ).toThrow("quality")
    expect(() => parseArguments(["in.jpg", "--unknown", "out.png"])).toThrow(
      "unsupported option",
    )
    expect(() => parseArguments(["in.jpg", "--rotate", "13", "out.png"])).toThrow(
      "multiple of 90",
    )
    expect(() => parseArguments(["in.jpg", "--quality"])).toThrow(
      "--quality requires a value",
    )
  })
})
