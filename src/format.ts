export type OutputFormat = "jpeg" | "png" | "webp" | "heic" | "avif";

const formats: Record<string, OutputFormat> = { jpg: "jpeg", jpeg: "jpeg", png: "png", webp: "webp", heic: "heic", avif: "avif" };

export function outputFormat(path: string): OutputFormat | undefined {
  const extension = path.split(".").at(-1)?.toLowerCase();
  return extension ? formats[extension] : undefined;
}

export function applyFormat(image: Bun.Image, format: OutputFormat, quality?: number): Bun.Image {
  if (format === "jpeg") return image.jpeg(quality === undefined ? undefined : { quality });
  if (format === "png") return image.png();
  if (format === "webp") return image.webp(quality === undefined ? undefined : { quality });
  if (format === "heic") return image.heic(quality === undefined ? undefined : { quality });
  return image.avif(quality === undefined ? undefined : { quality });
}
