import type { OutputFormat } from "./format";

export type Operation =
  | { kind: "resize"; width: number; height?: number }
  | { kind: "rotate"; degrees: number }
  | { kind: "flip" }
  | { kind: "flop" }
  | { kind: "modulate"; brightness?: number; saturation?: number };

export interface Arguments {
  input: string;
  output: string;
  operations: Operation[];
  format?: OutputFormat;
  quality?: number;
  terminal?: "metadata" | "placeholder" | "base64" | "dataurl";
  clipboard: boolean;
}

function number(value: string, name: string): number {
  const result = Number(value);
  if (!Number.isFinite(result))
    throw new Error(`${name} must be a number: ${value}`);
  return result;
}

export function parseArguments(argv: string[]): Arguments {
  if (argv.includes("--help") || argv.length === 0)
    throw new Error("Usage: bun-image [options] input output");
  let input: string | undefined;
  let output: string | undefined;
  const operations: Operation[] = [];
  let format: OutputFormat | undefined;
  let quality: number | undefined;
  let terminal: Arguments["terminal"];
  let clipboard = false;
  const take = (i: number, option: string) => {
    if (i + 1 >= argv.length) throw new Error(`${option} requires a value`);
    const value = argv[i + 1];
    if (value === undefined) throw new Error(`${option} requires a value`);
    return value;
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === undefined) throw new Error("invalid argument list");
    if (arg === "-" || !arg.startsWith("-")) {
      if (!input) input = arg;
      else if (!output) output = arg;
      else throw new Error("only one input and one output are supported");
      continue;
    }
    if (arg === "--clipboard") {
      clipboard = true;
      continue;
    }
    if (
      ["--metadata", "--placeholder", "--base64", "--dataurl"].includes(arg)
    ) {
      terminal = arg.slice(2) as Arguments["terminal"];
      continue;
    }
    if (arg === "--format") {
      format = take(i++, arg) as OutputFormat;
      if (!["jpeg", "png", "webp", "heic", "avif"].includes(format))
        throw new Error(`unsupported format: ${format}`);
      continue;
    }
    if (arg === "--quality") {
      quality = number(take(i++, arg), "quality");
      if (quality < 1 || quality > 100)
        throw new Error("quality must be between 1 and 100");
      continue;
    }
    if (arg === "--resize") {
      const value = take(i++, arg);
      const parts = value.split("x");
      if (parts.length > 2 || parts.some((part) => part.includes("%")))
        throw new Error("resize accepts numeric width and height only");
      const width = parts[0];
      if (width === undefined) throw new Error("resize requires a width");
      operations.push({
        kind: "resize",
        width: number(width, "width"),
        height: parts[1] ? number(parts[1], "height") : undefined,
      });
      continue;
    }
    if (arg === "--rotate") {
      operations.push({
        kind: "rotate",
        degrees: number(take(i++, arg), "rotation"),
      });
      continue;
    }
    if (arg === "--flip") {
      operations.push({ kind: "flip" });
      continue;
    }
    if (arg === "--flop") {
      operations.push({ kind: "flop" });
      continue;
    }
    if (arg === "--brightness" || arg === "--saturation") {
      const value = number(take(i++, arg), arg.slice(2));
      const previous = operations.at(-1);
      if (previous?.kind === "modulate")
        previous[arg.slice(2) as "brightness" | "saturation"] = value;
      else operations.push({ kind: "modulate", [arg.slice(2)]: value });
      continue;
    }
    throw new Error(`unsupported option: ${arg}`);
  }
  if (clipboard) input = "-";
  if (!input || !output)
    throw new Error("one input and one output are required");
  return { input, output, operations, format, quality, terminal, clipboard };
}
