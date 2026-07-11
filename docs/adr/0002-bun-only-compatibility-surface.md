# Limit compatibility to Bun-supported operations

`bun-image` accepts ImageMagick-style commands but implements only operations available through Bun's image API. Unsupported ImageMagick options fail explicitly instead of being approximated or silently ignored, preserving predictable behavior while keeping the first release aligned with Bun's capabilities.

## Consequences

The CLI is a deliberate compatibility subset rather than a full ImageMagick replacement. New options can be added later when Bun exposes the required capability or the project intentionally implements a safe CLI-level adaptation.
