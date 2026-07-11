Status: ready-for-agent

# bun-image CLI

## Problem Statement

Users who rely on ImageMagick's `convert` command need a small Bun-native image CLI that offers the same familiar command shape for the image operations Bun supports. The repository currently contains only a scaffold, so there is no executable, compatibility surface, or testable behavior yet.

## Solution

Build `bun-image`, a command-line image converter modeled on ImageMagick's `convert` syntax and powered exclusively by Bun's `Bun.Image` API.

The initial CLI accepts one input and one output per invocation, applies supported operations strictly from left to right, and rejects unsupported ImageMagick options explicitly. It supports direct Bun execution during development and a package executable usable through `bunx bun-image`.

## User Stories

1. As a command-line user, I want to invoke the tool as `bun-image`, so that I have a clear project-specific executable without a `convert` alias.
2. As an ImageMagick user, I want familiar positional input and output paths, so that simple conversion commands feel recognizable.
3. As a command-line user, I want one input path and one output path per invocation, so that the initial behavior is predictable.
4. As a future maintainer, I want the invocation model to remain extensible to multiple inputs, so that the initial single-input boundary does not prevent future batch behavior.
5. As an ImageMagick user, I want supported operations to execute left to right, so that operation ordering remains observable and familiar.
6. As a user, I want to resize an image to a numeric width while preserving its aspect ratio, so that I can create thumbnails.
7. As a user, I want to resize an image to numeric width and height values, so that I can produce an exact target size.
8. As a user, I want to rotate an image using supported rotation values, so that I can correct its orientation.
9. As a user, I want to flip an image vertically, so that I can mirror it across the horizontal axis.
10. As a user, I want to flop an image horizontally, so that I can mirror it across the vertical axis.
11. As a user, I want to adjust brightness, so that I can make an image lighter or darker.
12. As a user, I want to adjust saturation, so that I can desaturate or intensify an image.
13. As a user, I want to control output quality where Bun supports it, so that I can balance image quality and file size.
14. As a user, I want output format to be inferred from a normal output filename when possible, so that common conversion commands stay concise.
15. As a user, I want to explicitly select a supported output format when no filename extension exists, so that binary stdout output is unambiguous.
16. As a user, I want JPEG output, so that I can create broadly compatible compressed images.
17. As a user, I want PNG output, so that I can preserve lossless image data.
18. As a user, I want WebP output, so that I can create modern compact images.
19. As a user, I want HEIC and AVIF output where the current platform supports them, so that I can use Bun's platform-specific encoders.
20. As a user, I want unavailable platform-dependent formats to fail clearly, so that I do not mistake a fallback file for the requested format.
21. As a user, I want image metadata such as width, height, and format, so that I can inspect an image without decoding it unnecessarily.
22. As a user, I want metadata output to be usable as a terminal result, so that I can print it or redirect it to a file.
23. As a user, I want a low-quality placeholder output, so that I can generate a compact data URL for progressive image loading.
24. As a user, I want placeholder output written to a file or stdout, so that I can use it in scripts or capture it directly.
25. As a user, I want Base64 output, so that I can embed encoded image data in another tool or script.
26. As a user, I want data URL output, so that I can embed an image directly in HTML or CSS.
27. As a user, I want `-` to represent stdout, so that text terminals and encoded outputs follow a familiar Unix convention.
28. As a user, I want binary image output to stdout to require an explicit format, so that the CLI never guesses the format without a filename extension.
29. As a user on macOS or Windows, I want clipboard input, so that I can convert an image currently on the system clipboard.
30. As a user on Linux, I want clipboard limitations to be reported clearly, so that I understand when Bun cannot provide clipboard input directly.
31. As a user, I want unsupported ImageMagick options to fail explicitly, so that unsupported functionality is never silently ignored or approximated.
32. As a user, I want percentage resizing rejected for the first release, so that the initial resize contract remains limited to Bun-compatible numeric dimensions.
33. As a user, I want crop, offset, and other unsupported geometry options rejected, so that the CLI does not imply capabilities it cannot provide.
34. As a user, I want multiple-input and batch behavior deferred, so that the first release has a narrow and understandable contract.
35. As a user, I want diagnostics printed to stderr, so that stdout remains safe for successful terminal output and pipelines.
36. As a user, I want failures to return a nonzero exit status, so that shell scripts can detect unsuccessful processing.
37. As a user, I want failed processing not to create or replace an output file, so that an existing result is not corrupted by a failed conversion.
38. As a user, I want existing output files overwritten by default, so that behavior matches typical `convert` usage.
39. As a package user, I want to run the CLI through `bunx bun-image`, so that I can use it without manually wiring the source entrypoint.
40. As a developer, I want to run the CLI directly with Bun during development, so that the project follows the repository's Bun-first workflow.
41. As a maintainer, I want each production function in its own file, so that responsibilities remain small and independently testable.
42. As a maintainer, I want each production function to have a corresponding test file, so that every unit of behavior has an obvious test home.

## Implementation Decisions

- The executable is `bun-image`; no `convert` alias is provided.
- The CLI follows ImageMagick-style positional input/output conventions for the supported subset.
- The first release accepts one input and one output per invocation.
- Supported operations are numeric resize, rotate, flip, flop, brightness, saturation, quality, supported format encoding, metadata, terminal outputs, placeholders, and clipboard input.
- Supported operations execute strictly in command-line order.
- Numeric resize accepts width and height values. Percentage resizing, cropping, offsets, and other unsupported geometry are deferred.
- New Bun-specific capabilities use long options: `--metadata`, `--placeholder`, `--base64`, `--dataurl`, and `--clipboard`.
- `--placeholder` selects the placeholder representation; its destination is still supplied separately.
- `-` denotes stdout. Text terminals may write directly to stdout. Binary image output to stdout requires an explicit output format.
- Output format is inferred from a normal output filename when no explicit format is selected.
- HEIC and AVIF failures are surfaced when unavailable on the current platform. No automatic fallback is performed by default; a future opt-in fallback argument may be added.
- Diagnostics are human-readable and go to stderr. Failures return a nonzero exit status and must not create or replace output files.
- Existing output files are overwritten by default.
- The package exposes a `bun-image` executable while retaining direct Bun source execution for development.
- Production code is organized as one function per file, with one corresponding test file per function.
- The implementation must use Bun APIs and follow the project's Bun-first repository guidance.

## Testing Decisions

- The primary test seam is the CLI process boundary: invoke the executable with arguments and assert exit status, stdout, stderr, output files, and output image behavior.
- Tests should verify externally observable behavior rather than internal parser or pipeline implementation details.
- Fixture images should be small and deterministic, with assertions on metadata, dimensions, format, terminal output, and filesystem effects.
- Tests should cover left-to-right operation ordering, supported options, numeric resize forms, output format inference, explicit formats, metadata, placeholders, Base64, data URLs, clipboard behavior where available, unsupported options, invalid input, unavailable formats, stdout rules, overwrite behavior, and failure atomicity.
- Each production function must have a dedicated test file. These unit tests may complement, but must not replace, the CLI process-boundary tests.
- There is no existing test prior art in the repository; new tests establish the initial convention.

## Out of Scope

- Full ImageMagick compatibility.
- A `convert` executable alias.
- Multiple input files, batch conversion, glob expansion, montage, or multi-image composition.
- Percentage resizing in the first release.
- Cropping, offsets, filters, drawing, text, compositing, metadata stripping, and any other operation not represented by Bun's supported image API.
- Automatic output-format fallback by default.
- A no-clobber option in the first release.
- A web server or library API separate from the CLI.

## Further Notes

- Bun's image capabilities and platform behavior are the source of truth for supported operations and formats.
- The domain model and decisions are recorded in `CONTEXT.md` and `docs/adr/`.
- Future compatibility additions should preserve the left-to-right operation model and add explicit tests at the CLI seam.
