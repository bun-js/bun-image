import { expect, spyOn, test } from "bun:test"
import { main } from "./main"

test("runs the command with the provided arguments", async () => {
  let received: string[] | undefined

  await main(["input.png", "output.png"], async (argv) => {
    received = argv
  })

  expect(received).toEqual(["input.png", "output.png"])
})

test("reports command errors and sets a failing exit code", async () => {
  const error = spyOn(console, "error").mockImplementation(() => {})
  const previousExitCode = process.exitCode

  try {
    await main([], async () => {
      throw new Error("broken image")
    })

    expect(error).toHaveBeenCalledWith("bun-image: broken image")
    expect(process.exitCode).toBe(1)
  } finally {
    error.mockRestore()
    process.exitCode = previousExitCode
  }
})

test("reports non-Error command failures", async () => {
  const error = spyOn(console, "error").mockImplementation(() => {})
  const previousExitCode = process.exitCode

  try {
    await main([], async () => {
      throw "unexpected failure"
    })

    expect(error).toHaveBeenCalledWith("bun-image: unexpected failure")
    expect(process.exitCode).toBe(1)
  } finally {
    error.mockRestore()
    process.exitCode = previousExitCode
  }
})
