import { expect, test } from "bun:test"
import { apply } from "./apply"

test("apply handles every image operation", () => {
  const image = {
    resize: () => image,
    rotate: () => image,
    flip: () => image,
    flop: () => image,
    modulate: () => image,
  } as unknown as Bun.Image
  expect(apply(image, { kind: "resize", width: 2 })).toBe(image)
  expect(apply(image, { kind: "resize", width: 2, height: 3 })).toBe(image)
  expect(apply(image, { kind: "rotate", degrees: 90 })).toBe(image)
  expect(apply(image, { kind: "flip" })).toBe(image)
  expect(apply(image, { kind: "flop" })).toBe(image)
  expect(apply(image, { kind: "modulate", brightness: 1, saturation: 0 })).toBe(
    image,
  )
})
