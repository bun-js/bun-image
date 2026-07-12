# 01 — Complete CLI user-story acceptance matrix

**What to build:** End-to-end acceptance coverage that maps all locally verifiable user stories to observable CLI behavior, including every terminal destination, explicit stdout format, rejected compatibility boundaries, and the no-alias contract.

**Blocked by:** None — can start immediately

**Status:** completed

- [x] Verify metadata, placeholder, Base64, and data URL results to both stdout and files where each mode supports it.
- [x] Verify explicit binary stdout encoding and inferred filename formats for all stable formats.
- [x] Verify one-input/one-output enforcement, unsupported geometry rejection, and absence of a `convert` alias.
- [x] Verify direct Bun execution, diagnostics, exit status, overwrite behavior, and atomic failure behavior through the process boundary.
- [x] Document or test the platform-conditional HEIC/AVIF and clipboard branches without asserting unavailable capabilities.
