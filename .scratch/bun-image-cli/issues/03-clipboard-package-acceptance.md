# 03 — Clipboard and package-execution acceptance coverage

**What to build:** End-to-end coverage proving that supported invocation environments can use clipboard input and the configured executable entry points.

**Blocked by:** 01 — CLI conversion and terminal-output acceptance coverage

**Status:** completed

- [x] Verify clipboard input on supported macOS and Windows environments where available.
- [x] Verify Linux clipboard limitations produce a clear diagnostic and nonzero exit status.
- [x] Verify direct Bun source execution works with representative conversion arguments.
- [x] Verify the configured `bun-image` package executable resolves and runs as documented.
