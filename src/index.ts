#!/usr/bin/env bun
import { type Operation, parseArguments } from "./parse";
import { applyFormat, outputFormat } from "./utils/format";
import { writeBytes, writeText } from "./utils/output";

function apply(image: Bun.Image, operation: Operation): Bun.Image {
  switch (operation.kind) {
    case "resize":
      return image.resize(
        operation.width,
        operation.height,
        operation.height === undefined ? { fit: "inside" } : undefined,
      );
    case "rotate":
      return image.rotate(operation.degrees);
    case "flip":
      return image.flip();
    case "flop":
      return image.flop();
    case "modulate":
      return image.modulate({
        brightness: operation.brightness,
        saturation: operation.saturation,
      });
  }
}

async function main() {
  try {
    const args = parseArguments(Bun.argv.slice(2));
    const source = args.clipboard
      ? Bun.Image.fromClipboard()
      : new Bun.Image(args.input);
    if (!source)
      throw new Error(
        "clipboard does not contain an image (Linux clipboard input is unavailable)",
      );
    let image = source;
    for (const operation of args.operations) image = apply(image, operation);
    const format =
      args.format ??
      (args.output === "-" ? undefined : outputFormat(args.output));
    if (args.terminal === "metadata") {
      const metadata = await image.metadata();
      await writeText(args.output, `${JSON.stringify(metadata)}\n`);
    } else if (args.terminal === "placeholder")
      await writeText(args.output, await image.placeholder());
    else if (args.terminal === "base64")
      await writeText(
        args.output,
        `${(format ? applyFormat(image, format, args.quality) : image).toBase64()}\n`,
      );
    else if (args.terminal === "dataurl")
      await writeText(
        args.output,
        `${(format ? applyFormat(image, format, args.quality) : image).dataurl()}\n`,
      );
    else {
      if (args.output === "-" && !format)
        throw new Error("binary stdout requires --format");
      const encoded = format ? applyFormat(image, format, args.quality) : image;
      if (args.output === "-") await writeBytes(encoded.bytes());
      else await Bun.write(args.output, await encoded.bytes());
    }
  } catch (error) {
    console.error(
      `bun-image: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exitCode = 1;
  }
}
if (import.meta.main) await main();

export { main };
