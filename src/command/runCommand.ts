import { parseArguments } from "../parseArguments"
import { prepareImage } from "./prepareImage"
import { writeOutput } from "./writeOutput"

export async function runCommand(argv: string[]): Promise<void> {
  const args = parseArguments(argv)
  const image = prepareImage(args)
  await writeOutput(image, args)
}
