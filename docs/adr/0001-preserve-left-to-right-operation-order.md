# Preserve left-to-right operation order

`bun-image` applies supported ImageMagick-style operations in the order they appear on the command line. This preserves the observable behavior users expect from `convert`, even when normalizing operations into a different order could simplify implementation.

## Consequences

Equivalent-looking commands may produce different results when their operation order differs, so the parser and pipeline must retain command order.
