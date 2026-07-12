import type { OutputFormat } from "../types"

const formats: Record<string, OutputFormat> = {
  jpg: "jpeg",
  jpeg: "jpeg",
  png: "png",
  webp: "webp",
  heic: "heic",
  avif: "avif",
}

export function outputFormat(path: string): OutputFormat | undefined {
  const extension = path.split(".").at(-1)?.toLowerCase()
  return extension ? formats[extension] : undefined
}
