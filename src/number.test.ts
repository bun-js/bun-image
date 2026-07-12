import { expect, test } from "bun:test"
import { number } from "./number"

test("number parses finite values", () =>
  expect(number("12.5", "size")).toBe(12.5))
test("number rejects non-finite values", () =>
  expect(() => number("nope", "size")).toThrow("size"))
