import { expect, test } from "bun:test"

const fixture =
  "iVBORw0KGgoAAAANSUhEUgAAAAQAAAACAQMAAABFZu8gAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGUExURf8AAP///0EdNBEAAAABYktHRAH/Ai3eAAAAB3RJTUUH6gcMAQkeqfId8QAAAAxJREFUCNdjYGBgAAAABAABJzQnCgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNi0wNy0xMlQwMTowOTozMCswMDowMJtZrLUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjYtMDctMTJUMDE6MDk6MzArMDA6MDDqBBQJAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI2LTA3LTEyVDAxOjA5OjMwKzAwOjAwvRE11gAAAABJRU5ErkJggg=="

test("direct Bun execution and package executable are configured", async () => {
  const packageFile = await Bun.file(`${import.meta.dir}/../package.json`).json()
  expect(packageFile.bin["bun-image"]).toBe("src/index.ts")
  const direct = Bun.spawnSync(["bun", "run", "src/index.ts"] , {
    cwd: `${import.meta.dir}/..`,
  })
  expect(direct.exitCode).not.toBe(0)
  expect(new TextDecoder().decode(direct.stderr)).toContain("bun-image:")
})

test("packed package installs and exposes the bun-image executable", async () => {
  const root = `${import.meta.dir}/.package-fixtures`
  const installRoot = `${root}/install`
  await Bun.$`rm -rf ${root}`
  await Bun.$`mkdir -p ${installRoot}`
  await Bun.write(`${installRoot}/package.json`, "{}")
  const pack = Bun.spawnSync([
    "bun",
    "pm",
    "pack",
    "--destination",
    root,
    "--quiet",
  ], { cwd: `${import.meta.dir}/..` })
  expect(pack.exitCode).toBe(0)
  const packOutput = `${new TextDecoder().decode(pack.stdout)}\n${new TextDecoder().decode(pack.stderr)}`
  const archive = packOutput.match(/\/[^\s]+\.tgz/)?.[0]
  if (!archive) throw new Error(`bun pm pack did not report an archive: ${packOutput}`)
  const install = Bun.spawnSync(["bun", "add", archive], { cwd: installRoot })
  expect(install.exitCode).toBe(0)
  const executable = Bun.spawnSync([`${installRoot}/node_modules/.bin/bun-image`], {
    cwd: installRoot,
  })
  expect(executable.exitCode).not.toBe(0)
  expect(new TextDecoder().decode(executable.stderr)).toContain("bun-image:")
  const input = `${installRoot}/input.png`
  const output = `${installRoot}/output.webp`
  await Bun.write(input, Uint8Array.from(atob(fixture), (char) => char.charCodeAt(0)))
  const conversion = Bun.spawnSync([
    `${installRoot}/node_modules/.bin/bun-image`,
    input,
    output,
  ], { cwd: installRoot })
  expect(conversion.exitCode).toBe(0)
  expect(await Bun.file(output).exists()).toBe(true)
  await Bun.$`rm -rf ${root}`
})

test("Linux reports clipboard input as unavailable", () => {
  if (process.platform !== "linux") return
  const result = Bun.spawnSync(["bun", "run", "src/index.ts", "--clipboard", "-"] , {
    cwd: `${import.meta.dir}/..`,
  })
  expect(result.exitCode).not.toBe(0)
  expect(new TextDecoder().decode(result.stderr)).toContain("clipboard")
})
