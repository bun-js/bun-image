import type { Operation } from "../types"
import { number } from "../utils/number"

export function parseResize(value: string): Operation {
  const parts = value.split("x")
  if (parts.length > 2 || parts.some((part) => part.includes("%")))
    throw new Error("resize accepts numeric width and height only")

  const width = parts[0]
  if (width === undefined) throw new Error("resize requires a width")

  return {
    kind: "resize",
    width: number(width, "width"),
    height: parts[1] ? number(parts[1], "height") : undefined,
  }
}
