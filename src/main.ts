/* c8 ignore file */
import { runCommand } from "./command/runCommand"

export async function main() {
  try {
    await runCommand(Bun.argv.slice(2))
  } catch (error) {
    console.error(
      `bun-image: ${error instanceof Error ? error.message : String(error)}`,
    )
    process.exitCode = 1
  }
}
