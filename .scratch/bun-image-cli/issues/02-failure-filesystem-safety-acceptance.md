# 02 — Failure and filesystem-safety acceptance coverage

**What to build:** End-to-end coverage proving that invalid or unsupported commands fail safely, report diagnostics correctly, and never corrupt output files.

**Blocked by:** 01 — CLI conversion and terminal-output acceptance coverage

**Status:** completed

- [x] Verify invalid input, unsupported options, invalid dimensions, invalid rotation, and invalid quality values.
- [x] Verify unavailable platform-dependent formats fail clearly without fallback.
- [x] Verify binary stdout requires an explicit format.
- [x] Verify failures write diagnostics to stderr and return a nonzero exit status.
- [x] Verify failed processing does not create or replace an output file.
- [x] Verify successful processing overwrites an existing output file.
