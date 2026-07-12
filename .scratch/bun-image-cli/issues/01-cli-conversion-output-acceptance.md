# 01 — CLI conversion and terminal-output acceptance coverage

**What to build:** End-to-end coverage proving that the CLI performs its supported image conversions and terminal-output modes through the real process boundary, including stdout and output-file destinations.

**Blocked by:** None — can start immediately

**Status:** in-progress

- [x] Verify numeric resize and representative explicit WebP conversion through the process boundary.
- [ ] Verify rotation, flip, flop, brightness, saturation, and quality behavior.
- [ ] Verify output-format inference and explicit JPEG, PNG, HEIC, and AVIF selection where available.
- [x] Verify metadata and data-URL terminal outputs to stdout.
- [ ] Verify placeholder and Base64 terminal outputs to stdout and files.
- [x] Verify representative use of the `-` stdout convention.
- [ ] Verify left-to-right operation ordering.
- [x] Use deterministic image fixtures and assert observable dimensions, formats, contents, and destinations.
