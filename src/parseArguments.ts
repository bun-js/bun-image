import { parseArgs } from "node:util"
import type { Arguments, Operation, OutputFormat } from "./types"
import { number } from "./utils/number"

export type { Arguments } from "./types"

const options = {
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
} as const

type OptionName = keyof typeof options
type Token = { kind: "option"; name: OptionName; value?: string | boolean }
type State = Pick<Arguments, "operations" | "format" | "quality" | "terminal" | "clipboard">

const formats: OutputFormat[] = ["jpeg", "png", "webp", "heic", "avif"]

const handlers: Record<OptionName, (state: State, token: Token) => void> = {
  clipboard: (state) => { state.clipboard = true },
  metadata: terminal,
  placeholder: terminal,
  base64: terminal,
  dataurl: terminal,
  format: (state, token) => {
    const format = tokenValue(token) as OutputFormat
    if (!formats.includes(format)) throw new Error(`unsupported format: ${format}`)
    state.format = format
  },
  quality: (state, token) => {
    const quality = number(tokenValue(token), "quality")
    if (quality < 1 || quality > 100) throw new Error("quality must be between 1 and 100")
    state.quality = quality
  },
  resize: (state, token) => { state.operations.push(resize(tokenValue(token))) },
  rotate: (state, token) => {
    const degrees = number(tokenValue(token), "rotation")
    if (degrees % 90 !== 0) throw new Error("rotation must be a multiple of 90 degrees")
    state.operations.push({ kind: "rotate", degrees })
  },
  flip: operation,
  flop: operation,
  brightness: modulate,
  saturation: modulate,
}

export function parseArguments(argv: string[]): Arguments {
  if (argv.length === 0 || argv.includes("--help"))
    throw new Error("Usage: bun-image [options] input output")

  const parsed = parseArgs({ args: argv, options, allowPositionals: true, tokens: true, strict: false })

  const state: State = { operations: [], clipboard: false }

  for (const token of parsed.tokens ?? []) {
    if (token.kind !== "option") continue
    const handler = handlers[token.name as OptionName]
    if (!handler) throw new Error(`unsupported option: --${token.name}`)
    handler(state, token as Token)
  }

  const [input, output, ...extra] = parsed.positionals
  if (input === undefined || output === undefined || extra.length > 0)
    throw new Error("one input and one output are required")

  return { input: state.clipboard ? "-" : input, output, ...state }
}

function tokenValue(token: Token): string {
  if (token.value === undefined) throw new Error(`--${token.name} requires a value`)
  return String(token.value)
}

function terminal(state: State, token: Token): void {
  state.terminal = token.name as Arguments["terminal"]
}

function operation(state: State, token: Token): void {
  state.operations.push({ kind: token.name as "flip" | "flop" })
}

function modulate(state: State, token: Token): void {
  const property = token.name as "brightness" | "saturation"
  const value = number(tokenValue(token), property)
  const previous = state.operations.at(-1)
  if (previous?.kind === "modulate") previous[property] = value
  else state.operations.push({ kind: "modulate", [property]: value })
}

function resize(value: string): Operation {
  const parts = value.split("x")
  if (parts.length > 2 || parts.some((part) => part.includes("%")))
    throw new Error("resize accepts numeric width and height only")
  const width = parts[0]
  if (width === undefined) throw new Error("resize requires a width")
  return { kind: "resize", width: number(width, "width"), height: parts[1] ? number(parts[1], "height") : undefined }
}
