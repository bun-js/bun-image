import type { OutputFormat } from "../types"

export function applyFormat(
  image: Bun.Image,
  format: OutputFormat,
  quality?: number,
): Bun.Image {
  if (format === "jpeg")
    return image.jpeg(quality === undefined ? undefined : { quality })
  if (format === "png") return image.png()
  if (format === "webp")
    return image.webp(quality === undefined ? undefined : { quality })
  if (format === "heic")
    return image.heic(quality === undefined ? undefined : { quality })
  return image.avif(quality === undefined ? undefined : { quality })
}
