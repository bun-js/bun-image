import { expect, test } from "bun:test"
import { applyFormat } from "./applyFormat"

test("applyFormat selects each encoder", () => {
  const image = {
    jpeg: () => image,
    png: () => image,
    webp: () => image,
    heic: () => image,
    avif: () => image,
  } as unknown as Bun.Image
  for (const format of ["jpeg", "png", "webp", "heic", "avif"] as const)
    expect(applyFormat(image, format)).toBe(image)
})
