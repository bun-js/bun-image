import { expect, test } from "bun:test"
import { writeText } from "./writeText"

test("writeText writes destination files", async () => {
  const path = `${import.meta.dir}/.write-text-test`
  await writeText(path, "ok")
  expect(await Bun.file(path).text()).toBe("ok")
  await Bun.file(path).delete()
})
