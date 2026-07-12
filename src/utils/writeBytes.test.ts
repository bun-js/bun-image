import { expect, test } from "bun:test"
import { writeBytes } from "./writeBytes"

test("writeBytes writes resolved bytes", async () => {
  const original = process.stdout.write
  let received = ""
  process.stdout.write = ((value: string | Uint8Array) => {
    received +=
      typeof value === "string" ? value : new TextDecoder().decode(value)
    return true
  }) as typeof process.stdout.write
  try {
    await writeBytes(Promise.resolve(new TextEncoder().encode("ok")))
    expect(received).toBe("ok")
  } finally {
    process.stdout.write = original
  }
})
