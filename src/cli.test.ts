import { expect, test } from "bun:test"

const fixture =
  "iVBORw0KGgoAAAANSUhEUgAAAAQAAAACAQMAAABFZu8gAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGUExURf8AAP///0EdNBEAAAABYktHRAH/Ai3eAAAAB3RJTUUH6gcMAQkeqfId8QAAAAxJREFUCNdjYGBgAAAABAABJzQnCgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNi0wNy0xMlQwMTowOTozMCswMDowMJtZrLUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjYtMDctMTJUMDE6MDk6MzArMDA6MDDqBBQJAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI2LTA3LTEyVDAxOjA5OjMwKzAwOjAwvRE11gAAAABJRU5ErkJggg=="

const root = `${import.meta.dir}/.cli-fixtures`
const input = `${root}/input.png`

async function run(...args: string[]) {
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

test("CLI converts images and reports metadata through the process boundary", async () => {
  await setup()
  try {
    const output = `${root}/resized.webp`
    const result = await run(input, "--resize", "2", "--format", "webp", output)
    expect(result.exitCode).toBe(0)
    expect(new TextDecoder().decode(result.stderr)).toBe("")

    const metadata = await run(input, "--metadata", "-")
    expect(metadata.exitCode).toBe(0)
    expect(JSON.parse(new TextDecoder().decode(metadata.stdout))).toMatchObject({
      width: 4,
      height: 2,
      format: "png",
    })

    const resizedMetadata = await run(output, "--metadata", "-")
    expect(JSON.parse(new TextDecoder().decode(resizedMetadata.stdout))).toMatchObject({
      width: 2,
      height: 1,
      format: "webp",
    })
  } finally {
    await cleanup()
  }
})

test("CLI emits terminal data URL output to stdout", async () => {
  await setup()
  try {
    const result = await run(input, "--dataurl", "-")
    expect(result.exitCode).toBe(0)
    expect(new TextDecoder().decode(result.stdout)).toStartWith("data:image/png;base64,")
  } finally {
    await cleanup()
  }
})

test("CLI applies ordered operations and infers the output format", async () => {
  await setup()
  try {
    const output = `${root}/rotated.jpg`
    const result = await run(
      input,
      "--resize",
      "2x1",
      "--rotate",
      "90",
      "--flip",
      "--flop",
      "--brightness",
      "1",
      "--saturation",
      "1",
      "--quality",
      "80",
      output,
    )
    expect(result.exitCode).toBe(0)

    const metadata = await run(output, "--metadata", "-")
    expect(JSON.parse(new TextDecoder().decode(metadata.stdout))).toMatchObject({
      width: 2,
      height: 1,
      format: "jpeg",
    })
  } finally {
    await cleanup()
  }
})

test("CLI emits placeholder and Base64 terminal output to files", async () => {
  await setup()
  try {
    const placeholder = `${root}/placeholder.txt`
    const base64 = `${root}/base64.txt`
    expect((await run(input, "--placeholder", placeholder)).exitCode).toBe(0)
    expect((await run(input, "--base64", base64)).exitCode).toBe(0)
    expect(await Bun.file(placeholder).text()).toStartWith("data:image/")
    expect(await Bun.file(base64).text()).toStartWith("iVBOR")
  } finally {
    await cleanup()
  }
})

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
