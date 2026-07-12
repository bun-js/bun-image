import { expect, test } from "bun:test"
import { main } from "./main"

test("main is exported", () => expect(typeof main).toBe("function"))
