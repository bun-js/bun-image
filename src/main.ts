/* c8 ignore file */
import { parseArguments } from "./parseArguments"
import { apply } from "./utils/apply"
import { applyFormat } from "./utils/applyFormat"
import { outputFormat } from "./utils/outputFormat"
import { writeBytes } from "./utils/writeBytes"
import { writeText } from "./utils/writeText"

export async function main() {
  try {
    const args = parseArguments(Bun.argv.slice(2))
    const source = args.clipboard
      ? Bun.Image.fromClipboard()
      : new Bun.Image(args.input)
    if (!source)
      throw new Error(
        "clipboard does not contain an image (Linux clipboard input is unavailable)",
      )
    let image = source
    for (const operation of args.operations) image = apply(image, operation)
    const format =
      args.format ??
      (args.output === "-" ? undefined : outputFormat(args.output))
    if (args.terminal === "metadata") {
      const metadata = await image.metadata()
      await writeText(args.output, `${JSON.stringify(metadata)}\n`)
    } else if (args.terminal === "placeholder")
      await writeText(args.output, await image.placeholder())
    else if (args.terminal === "base64")
      await writeText(
        args.output,
        `${(format ? applyFormat(image, format, args.quality) : image).toBase64()}\n`,
      )
    else if (args.terminal === "dataurl")
      await writeText(
        args.output,
        `${await (format ? applyFormat(image, format, args.quality) : image).dataurl()}\n`,
      )
    else {
      if (args.output === "-" && !format)
        throw new Error("binary stdout requires --format")
      const encoded = format ? applyFormat(image, format, args.quality) : image
      if (args.output === "-") await writeBytes(encoded.bytes())
      else await Bun.write(args.output, await encoded.bytes())
    }
  } catch (error) {
    console.error(
      `bun-image: ${error instanceof Error ? error.message : String(error)}`,
    )
    process.exitCode = 1
  }
}
