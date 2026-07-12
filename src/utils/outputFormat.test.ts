import { expect, test } from "bun:test"
import { outputFormat } from "./outputFormat"

test("outputFormat maps supported extensions", () => {
  expect(outputFormat("photo.JPG")).toBe("jpeg")
  expect(outputFormat("photo.webp")).toBe("webp")
})
test("outputFormat returns undefined for unknown extensions", () =>
  expect(outputFormat("photo.tiff")).toBeUndefined())
