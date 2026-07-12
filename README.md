# bun-image

`bun-image` is a Bun-native image converter with an ImageMagick-style positional command shape.

## Usage

```sh
bun-image [options] input output
```

There is one input and one output per invocation. Use `-` as the output to write a terminal result to stdout.

Examples:

```sh
bun-image photo.jpg thumbnail.webp --resize 400
bun-image photo.jpg rotated.png --rotate 90
bun-image photo.jpg --metadata -
bun-image photo.jpg --dataurl -
```

Options are applied from left to right.

## Options

### Image operations

| Option | Description |
| --- | --- |
| `--resize WIDTH` | Resize to a numeric width while preserving aspect ratio. |
| `--resize WIDTHxHEIGHT` | Resize to exact numeric dimensions. |
| `--rotate DEGREES` | Rotate by a multiple of 90 degrees. |
| `--flip` | Flip vertically, across the horizontal axis. |
| `--flop` | Flip horizontally, across the vertical axis. |
| `--brightness VALUE` | Set brightness modulation; `1` is unchanged. |
| `--saturation VALUE` | Set saturation modulation; `1` is unchanged and `0` is grayscale. |
| `--quality VALUE` | Set encoding quality from `1` to `100` where supported. |

Resize percentages, cropping, offsets, and other unsupported ImageMagick geometry options are rejected.

### Output formats

| Option | Description |
| --- | --- |
| `--format jpeg` | Encode as JPEG. `jpg` is accepted when inferred from a filename. |
| `--format png` | Encode as PNG. |
| `--format webp` | Encode as WebP. |
| `--format heic` | Encode as HEIC when supported by the current platform. |
| `--format avif` | Encode as AVIF when supported by the current platform. |

Without `--format`, the format is inferred from the output filename extension (`.jpg`, `.jpeg`, `.png`, `.webp`, `.heic`, or `.avif`). Platform-dependent formats fail explicitly when unavailable; no fallback format is selected.

### Terminal output modes

These options select a text result. Their destination is still the normal output argument.

| Option | Description |
| --- | --- |
| `--metadata` | Write JSON containing image `width`, `height`, and `format`. |
| `--placeholder` | Write a low-quality placeholder data URL. |
| `--base64` | Write base64-encoded image data. |
| `--dataurl` | Write a complete `data:image/...;base64,...` URL. |

For binary image output to stdout, an explicit format is required:

```sh
bun-image photo.jpg --format png -
```

### Input sources

| Option | Description |
| --- | --- |
| `--clipboard` | Read an image from the system clipboard instead of the input path. macOS and Windows are supported by Bun; Linux reports clipboard input as unavailable. |

## Package and development commands

Run directly during development:

```sh
bun run src/index.ts input.jpg output.png
```

The package exposes the `bun-image` executable for use through `bunx bun-image`.

## Errors and files

Diagnostics are written to stderr and failures return a nonzero exit status. Image processing completes before an output file is written, so a failed conversion does not create or replace the destination. Existing output files are overwritten by successful conversions.
