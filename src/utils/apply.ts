import type { Operation } from "../types"

export function apply(image: Bun.Image, operation: Operation): Bun.Image {
  switch (operation.kind) {
    case "resize":
      return image.resize(
        operation.width,
        operation.height,
        operation.height === undefined ? { fit: "inside" } : undefined,
      )
    case "rotate":
      return image.rotate(operation.degrees)
    case "flip":
      return image.flip()
    case "flop":
      return image.flop()
    case "modulate":
      return image.modulate({
        brightness: operation.brightness,
        saturation: operation.saturation,
      })
  }
}
