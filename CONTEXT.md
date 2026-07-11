# Domain Context

## Product

**bun-image** is a command-line image converter modeled on ImageMagick's `convert` command. It provides a compatible command shape for the image operations supported by Bun's `Bun.Image` API.

## Compatibility

**Supported compatibility** means accepting ImageMagick-style positional input/output paths and operation ordering for operations that Bun supports. It does not imply full ImageMagick feature coverage.

Unsupported compatibility is rejected explicitly. The CLI does not accept options it cannot execute through Bun's image API.

**Operation order** is the left-to-right order of supported options in a command. `bun-image` preserves this order when building and executing the image pipeline.

## Command

The user-facing executable is named `bun-image`. The project does not provide a `convert` executable alias.

**Invocation scope** initially means one input path and one output path per command. Multiple inputs and batch conversion remain future-compatible extensions, not part of the initial contract.

**Initial resize geometry** supports numeric width and height values only. Percentage resizing, cropping, offsets, and other geometry features are deferred until a later compatibility expansion.

**Terminal destination** uses `-` for stdout, matching ImageMagick conventions. Text terminals may write directly to stdout; binary image output to stdout requires an explicit output format because no filename extension is available.

**Platform-dependent formats** such as HEIC and AVIF fail explicitly when unavailable on the current platform. Automatic format fallback is a future opt-in feature, not default behavior.

**Failure behavior** sends human-readable diagnostics to stderr, exits nonzero, reserves stdout for successful terminal output, and does not create or replace an output file when processing fails.

**Output overwrite** is enabled by default, matching typical `convert` behavior. A no-clobber safeguard may be added later as an opt-in option.

**Initial feature surface** is limited to operations Bun's image API can execute: numeric resize, rotate, flip, flop, brightness, saturation, quality, supported format encoding, metadata, terminal outputs, placeholders, and clipboard input. Unsupported ImageMagick features are outside the initial compatibility contract.
