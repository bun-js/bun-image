import { parseArgs } from "node:util"
import { applyOptionToken, createOptionState } from "./arguments/applyOption"
import { parseArgsOptions } from "./arguments/options"
import type { Arguments } from "./types"

export type { Arguments } from "./types"

export function parseArguments(argv: string[]): Arguments {
  if (argv.length === 0 || argv.includes("--help"))
    throw new Error("Usage: bun-image [options] input output")

  const parsed = parseArgs({
    args: argv,
    options: parseArgsOptions,
    allowPositionals: true,
    tokens: true,
    strict: false,
  })

  const state = createOptionState()

  for (const token of parsed.tokens ?? []) {
    if (token.kind !== "option") continue
    applyOptionToken(state, token)
  }

  const [input, output, ...extra] = parsed.positionals
  if (input === undefined || output === undefined || extra.length > 0)
    throw new Error("one input and one output are required")

  return { input: state.clipboard ? "-" : input, output, ...state }
}
