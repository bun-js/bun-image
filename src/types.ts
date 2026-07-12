export const outputFormats = ["jpeg", "png", "webp", "heic", "avif"] as const
export type OutputFormat = (typeof outputFormats)[number]

export type Operation =
  | { kind: "resize"; width: number; height?: number }
  | { kind: "rotate"; degrees: number }
  | { kind: "flip" }
  | { kind: "flop" }
  | { kind: "modulate"; brightness?: number; saturation?: number }

export interface Arguments {
  input: string
  output: string
  operations: Operation[]
  format?: OutputFormat
  quality?: number
  terminal?: "metadata" | "placeholder" | "base64" | "dataurl"
  clipboard: boolean
}
