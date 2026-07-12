import { expect, test } from "bun:test"

const fixture =
  "iVBORw0KGgoAAAANSUhEUgAAAAQAAAACAQMAAABFZu8gAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGUExURf8AAP///0EdNBEAAAABYktHRAH/Ai3eAAAAB3RJTUUH6gcMAQkeqfId8QAAAAxJREFUCNdjYGBgAAAABAABJzQnCgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNi0wNy0xMlQwMTowOTozMCswMDowMJtZrLUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjYtMDctMTJUMDE6MDk6MzArMDA6MDDqBBQJAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI2LTA3LTEyVDAxOjA5OjMwKzAwOjAwvRE11gAAAABJRU5ErkJggg=="
const root = `${import.meta.dir}/.failure-fixtures`
const input = `${root}/input.png`

function run(...args: string[]) {
  return Bun.spawnSync(["bun", "run", "src/index.ts", ...args], {
    cwd: `${import.meta.dir}/..`,
  })
}

async function setup() {
  await Bun.$`mkdir -p ${root}`
  await Bun.write(input, Uint8Array.from(atob(fixture), (char) => char.charCodeAt(0)))
}

async function cleanup() {
  await Bun.$`rm -rf ${root}`
}

test("CLI rejects invalid commands with stderr and no output", async () => {
  await setup()
  try {
    for (const args of [
      ["missing.png", "out.png"],
      [input, "--unknown", `${root}/out.png`],
      [input, "--resize", "nope", `${root}/out.png`],
      [input, "--rotate", "13", `${root}/out.png`],
      [input, "--quality", "101", `${root}/out.png`],
    ]) {
      const result = run(...args)
      expect(result.exitCode).not.toBe(0)
      expect(new TextDecoder().decode(result.stdout)).toBe("")
      expect(new TextDecoder().decode(result.stderr)).toContain("bun-image:")
    }
    expect(await Bun.file(`${root}/out.png`).exists()).toBe(false)
  } finally {
    await cleanup()
  }
})

test("CLI requires a format for binary stdout", async () => {
  await setup()
  try {
    const result = run(input, "-")
    expect(result.exitCode).not.toBe(0)
    expect(new TextDecoder().decode(result.stderr)).toContain(
      "binary stdout requires --format",
    )
  } finally {
    await cleanup()
  }
})

test("CLI preserves existing output on failure and overwrites on success", async () => {
  await setup()
  try {
    const output = `${root}/output.png`
    await Bun.write(output, "keep me")
    expect(run(input, "--unknown", output).exitCode).not.toBe(0)
    expect(await Bun.file(output).text()).toBe("keep me")
    expect(run(input, output).exitCode).toBe(0)
    expect(await Bun.file(output).bytes()).not.toEqual(new TextEncoder().encode("keep me"))
  } finally {
    await cleanup()
  }
})
