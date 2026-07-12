#!/usr/bin/env bun
import { main } from "./main"

if (import.meta.main) await main()

export { main }
