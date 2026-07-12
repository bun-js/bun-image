import { runCommand } from "./command/runCommand"

export async function main(
  argv = Bun.argv.slice(2),
  execute: (argv: string[]) => Promise<void> = runCommand,
) {
  try {
    await execute(argv)
  } catch (error) {
    console.error(
      `bun-image: ${error instanceof Error ? error.message : String(error)}`,
    )
    process.exitCode = 1
  }
}
