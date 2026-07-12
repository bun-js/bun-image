import type { Arguments } from "../types"
import { apply } from "../utils/apply"

export function prepareImage(args: Arguments): Bun.Image {
  const source = args.clipboard
    ? Bun.Image.fromClipboard()
    : new Bun.Image(args.input)

  if (!source)
    throw new Error(
      "clipboard does not contain an image (Linux clipboard input is unavailable)",
    )

  return args.operations.reduce(apply, source)
}
