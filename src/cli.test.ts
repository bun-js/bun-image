import { expect, test } from "bun:test"

test("CLI reports invalid arguments through stderr and a nonzero exit", () => {
  const result = Bun.spawnSync([
    "bun",
    "run",
    "src/index.ts",
    "input.png",
    "--rotate",
    "13",
    "output.png",
  ])

  expect(result.exitCode).not.toBe(0)
  expect(new TextDecoder().decode(result.stdout)).toBe("")
  expect(new TextDecoder().decode(result.stderr)).toContain(
    "rotation must be a multiple of 90 degrees",
  )
})
