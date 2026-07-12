import { expect, test } from "bun:test"

test("direct Bun execution and package executable are configured", async () => {
  const packageFile = await Bun.file(`${import.meta.dir}/../package.json`).json()
  expect(packageFile.bin["bun-image"]).toBe("src/index.ts")
  const direct = Bun.spawnSync(["bun", "run", "src/index.ts"] , {
    cwd: `${import.meta.dir}/..`,
  })
  expect(direct.exitCode).not.toBe(0)
  expect(new TextDecoder().decode(direct.stderr)).toContain("bun-image:")
})

test("Linux reports clipboard input as unavailable", () => {
  if (process.platform !== "linux") return
  const result = Bun.spawnSync(["bun", "run", "src/index.ts", "--clipboard", "-"] , {
    cwd: `${import.meta.dir}/..`,
  })
  expect(result.exitCode).not.toBe(0)
  expect(new TextDecoder().decode(result.stderr)).toContain("clipboard")
})
