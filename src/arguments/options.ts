import type { ParseArgsOptionsConfig } from "node:util"

export const parseArgsOptions = {
  clipboard: { type: "boolean" },
  metadata: { type: "boolean" },
  placeholder: { type: "boolean" },
  base64: { type: "boolean" },
  dataurl: { type: "boolean" },
  format: { type: "string" },
  quality: { type: "string" },
  resize: { type: "string" },
  rotate: { type: "string" },
  flip: { type: "boolean", multiple: true },
  flop: { type: "boolean", multiple: true },
  brightness: { type: "string" },
  saturation: { type: "string" },
} as const satisfies ParseArgsOptionsConfig

export type OptionName = keyof typeof parseArgsOptions
