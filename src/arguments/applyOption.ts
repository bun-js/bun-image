import { type Arguments, type OutputFormat, outputFormats } from "../types"
import { number } from "../utils/number"
import { parseArgsOptions, type OptionName } from "./options"
import { parseResize } from "./parseResize"

type OptionState = Pick<
  Arguments,
  "operations" | "format" | "quality" | "terminal" | "clipboard"
>
type ParsedOptionToken = { name: string; value?: string | boolean }
type OptionToken = ParsedOptionToken & { name: OptionName }
type Handler = (state: OptionState, token: OptionToken) => void

const handlers: Record<OptionName, Handler> = {
  clipboard: (state) => {
    state.clipboard = true
  },
  metadata: terminal,
  placeholder: terminal,
  base64: terminal,
  dataurl: terminal,
  format: (state, token) => {
    const format = tokenValue(token) as OutputFormat
    if (!outputFormats.includes(format))
      throw new Error(`unsupported format: ${format}`)
    state.format = format
  },
  quality: (state, token) => {
    const quality = number(tokenValue(token), "quality")
    if (quality < 1 || quality > 100)
      throw new Error("quality must be between 1 and 100")
    state.quality = quality
  },
  resize: (state, token) => {
    state.operations.push(parseResize(tokenValue(token)))
  },
  rotate: (state, token) => {
    const degrees = number(tokenValue(token), "rotation")
    if (degrees % 90 !== 0)
      throw new Error("rotation must be a multiple of 90 degrees")
    state.operations.push({ kind: "rotate", degrees })
  },
  flip: operation,
  flop: operation,
  brightness: modulate,
  saturation: modulate,
}

export function createOptionState(): OptionState {
  return { operations: [], clipboard: false }
}

export function applyOptionToken(
  state: OptionState,
  token: ParsedOptionToken,
): void {
  const { name } = token
  if (!isOptionName(name)) throw new Error(`unsupported option: --${name}`)
  if (parseArgsOptions[name].type === "boolean" && token.value !== undefined)
    throw new Error(`--${name} does not accept a value`)
  handlers[name](state, { ...token, name })
}

function isOptionName(name: string): name is OptionName {
  return Object.hasOwn(parseArgsOptions, name)
}

function tokenValue(token: OptionToken): string {
  if (token.value === undefined)
    throw new Error(`--${token.name} requires a value`)
  return String(token.value)
}

function terminal(state: OptionState, token: OptionToken): void {
  state.terminal = token.name as Arguments["terminal"]
}

function operation(state: OptionState, token: OptionToken): void {
  state.operations.push({ kind: token.name as "flip" | "flop" })
}

function modulate(state: OptionState, token: OptionToken): void {
  const property = token.name as "brightness" | "saturation"
  const value = number(tokenValue(token), property)
  const previous = state.operations.at(-1)
  if (previous?.kind === "modulate") previous[property] = value
  else state.operations.push({ kind: "modulate", [property]: value })
}
