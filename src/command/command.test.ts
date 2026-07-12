import { afterAll, beforeAll, describe, expect, spyOn, test } from "bun:test"
import type { Arguments } from "../types"
import { prepareImage } from "./prepareImage"
import { runCommand } from "./runCommand"
import { writeOutput } from "./writeOutput"

const fixture =
  "iVBORw0KGgoAAAANSUhEUgAAAAQAAAACAQMAAABFZu8gAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGUExURf8AAP///0EdNBEAAAABYktHRAH/Ai3eAAAAB3RJTUUH6gcMAQkeqfId8QAAAAxJREFUCNdjYGBgAAAABAABJzQnCgAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyNi0wNy0xMlQwMTowOTozMCswMDowMJtZrLUAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjYtMDctMTJUMDE6MDk6MzArMDA6MDDqBBQJAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDI2LTA3LTEyVDAxOjA5OjMwKzAwOjAwvRE11gAAAABJRU5ErkJggg=="
const root = `${import.meta.dir}/.command-fixtures`
const input = `${root}/input.png`

function args(overrides: Partial<Arguments> = {}): Arguments {
  return {
    input,
    output: `${root}/output.png`,
    operations: [],
    clipboard: false,
    ...overrides,
  }
}

beforeAll(async () => {
  await Bun.$`mkdir -p ${root}`
  await Bun.write(
    input,
    Uint8Array.from(atob(fixture), (char) => char.charCodeAt(0)),
  )
})

afterAll(async () => {
  await Bun.$`rm -rf ${root}`
})

describe("command", () => {
  test("runs parsing, image preparation, and output writing", async () => {
    const output = `${root}/command.webp`
    await runCommand([input, "--resize", "2", output])
    expect(await new Bun.Image(output).metadata()).toMatchObject({ width: 2, height: 1 })
  })

  test("prepares an image and reports an empty clipboard", async () => {
    const image = prepareImage(args({ operations: [{ kind: "rotate", degrees: 90 }] }))
    const output = `${root}/prepared.png`
    await Bun.write(output, await image.png().bytes())
    expect(await new Bun.Image(output).metadata()).toMatchObject({ width: 2, height: 4 })

    const fromClipboard = spyOn(Bun.Image, "fromClipboard").mockReturnValue(null)
    try {
      expect(() => prepareImage(args({ clipboard: true }))).toThrow("clipboard does not contain")
    } finally {
      fromClipboard.mockRestore()
    }
  })

  test("writes every text output mode", async () => {
    const destinations = {
      metadata: `${root}/metadata.json`,
      placeholder: `${root}/placeholder.txt`,
      base64: `${root}/base64.txt`,
      dataurl: `${root}/dataurl.txt`,
    } as const

    for (const [terminal, output] of Object.entries(destinations))
      await writeOutput(new Bun.Image(input), args({ terminal: terminal as Arguments["terminal"], output, format: "png" }))

    expect(JSON.parse(await Bun.file(destinations.metadata).text())).toMatchObject({ width: 4, height: 2 })
    expect(await Bun.file(destinations.placeholder).text()).toStartWith("data:image/")
    expect(await Bun.file(destinations.base64).text()).toStartWith("iVBOR")
    expect(await Bun.file(destinations.dataurl).text()).toStartWith("data:image/png;base64,")
  })

  test("infers file formats and validates binary stdout", async () => {
    const output = `${root}/inferred.webp`
    await writeOutput(new Bun.Image(input), args({ output }))
    expect(await new Bun.Image(output).metadata()).toMatchObject({ format: "webp" })

    await expect(writeOutput(new Bun.Image(input), args({ output: "-" }))).rejects.toThrow(
      "binary stdout requires --format",
    )
  })

  test("writes text and binary data to stdout", async () => {
    const write = spyOn(process.stdout, "write").mockImplementation(() => true)
    try {
      await writeOutput(new Bun.Image(input), args({ output: "-", terminal: "metadata" }))
      await writeOutput(new Bun.Image(input), args({ output: "-", format: "png" }))
      expect(write).toHaveBeenCalledTimes(2)
    } finally {
      write.mockRestore()
    }
  })
})
