import type { Arguments, OutputFormat } from "../types"
import { applyFormat } from "../utils/applyFormat"
import { outputFormat } from "../utils/outputFormat"
import { writeBytes } from "../utils/writeBytes"
import { writeText } from "../utils/writeText"

export async function writeOutput(image: Bun.Image, args: Arguments): Promise<void> {
  const format = resolveFormat(args)

  if (args.terminal === "metadata") {
    await writeText(args.output, `${JSON.stringify(await image.metadata())}\n`)
    return
  }
  if (args.terminal === "placeholder") {
    await writeText(args.output, await image.placeholder())
    return
  }

  const encoded = format ? applyFormat(image, format, args.quality) : image
  if (args.terminal === "base64") {
    await writeText(args.output, `${await encoded.toBase64()}\n`)
    return
  }
  if (args.terminal === "dataurl") {
    await writeText(args.output, `${await encoded.dataurl()}\n`)
    return
  }

  if (args.output === "-" && !format)
    throw new Error("binary stdout requires --format")

  if (args.output === "-") await writeBytes(encoded.bytes())
  else await Bun.write(args.output, await encoded.bytes())
}

function resolveFormat(args: Arguments): OutputFormat | undefined {
  return args.format ?? (args.output === "-" ? undefined : outputFormat(args.output))
}
