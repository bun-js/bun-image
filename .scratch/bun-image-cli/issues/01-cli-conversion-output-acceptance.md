# 01 — CLI conversion and terminal-output acceptance coverage

**What to build:** End-to-end coverage proving that the CLI performs its supported image conversions and terminal-output modes through the real process boundary, including stdout and output-file destinations.

**Blocked by:** None — can start immediately

**Status:** in-progress

- [x] Verify numeric resize and representative explicit WebP conversion through the process boundary.
- [x] Verify rotation, flip, flop, brightness, saturation, and quality behavior.
- [ ] Verify explicit PNG, HEIC, and AVIF selection where available.
- [x] Verify output-format inference for JPEG and explicit WebP selection.
- [x] Verify metadata and data-URL terminal outputs to stdout.
- [x] Verify placeholder and Base64 terminal outputs to files.
- [x] Verify representative use of the `-` stdout convention.
- [x] Verify left-to-right operation ordering.
- [x] Use deterministic image fixtures and assert observable dimensions, formats, contents, and destinations.
