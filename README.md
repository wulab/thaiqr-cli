# thaiqr-cli

A small CLI for working with Thai QR (TLV) data, implemented in TypeScript and designed to run with Bun (also works with Node.js when using Bun-compatible commands).

## Requirements

- Bun — https://bun.sh (recommended)
- Node.js (for users who prefer Node; see notes below)
- TypeScript ^5 (peer dependency)

## Install

Install dependencies with Bun:

```bash
bun install
```

If you prefer to use npm or yarn, install dependencies with your package manager of choice. Some scripts assume Bun; see "Running without Bun" below.

## Quick usage

After installing dependencies you can run the CLI directly with Bun or via Node if you build first.

**Usage:**

```bash
thaiqr-cli [decode | encode | generate] [<arg> | <file> | -] [flags]
```

- `decode [<payload> | <file> | -] [--force]` — decode a TLV payload string, file, or stdin to outline.
  - `--force` bypasses CRC validation when decoding (use with caution).
- `encode [<outline> | <file> | -] [--preserve-crc]` — encode an outline string, file, or stdin to TLV payload.
  - `--preserve-crc` will keep any CRC present in the outline instead of recomputing it.
- `generate [<payload> | <file> | -]` — generate an ASCII QR from a payload string, file, or stdin.

**Notes on inputs**
- `-` forces reading from stdin.
- If the argument is an existing file path the file is read.
- If an argument is given and it's not a file, it is treated as a raw data string.
- If no argument is given and stdin is piped, the CLI reads from stdin.

**Examples (using Bun):**

```bash
# build the CLI bundle
bun run build

# decode a TLV payload string (verifies CRC by default)
bun run decode "000201..."

# decode a TLV payload string and ignore CRC errors
bun run decode "000201..." --force

# decode a TLV payload from a file
bun run decode path/to/payload.txt

# decode a TLV payload from stdin
cat payload.txt | bun run decode -

# encode an outline file into a Thai QR payload (CRC recomputed)
bun run encode path/to/outline.txt

# encode an outline but preserve an existing CRC field
bun run encode path/to/outline.txt --preserve-crc

# encode an outline from stdin
cat outline.txt | bun run encode -

# encode an outline string directly
bun run encode "00: 01\n01: 02\n..."

# generate a QR directly from a payload string
bun run generate "000201..."

# generate a QR from a file
bun run generate path/to/payload.txt

# generate a QR from stdin
cat payload.txt | bun run generate -
```

Scripts from `package.json`:

- `build` — compile and bundle the CLI using Bun; outputs to `dist/thaiqr-cli.js`.
- `decode` — run `src/index.ts` in decode mode.
- `encode` — run `src/index.ts` in encode mode.
- `generate` — run `src/index.ts` in generate mode.
- `test` — run the project's tests with Bun.

Running without Bun (Node.js users):

1. Install dependencies with npm/yarn.
2. Build the bundle with Bun (recommended): `bun run build`. The produced bundle is `dist/thaiqr-cli.js`.
3. Run the built bundle with Node: `node dist/thaiqr-cli.js <command> ...`
   - Alternatively, run the TypeScript sources with `ts-node`/`ts-node-esm` if you prefer to avoid building, but the project is set up for bundling with Bun.

## Development

- Source files live in `src/` and tests are in `src/*.test.ts`.
- The project is configured as an ESM module and uses TypeScript. The `build` script uses Bun to produce a single JS bundle in `dist/`.

## Examples

Decode a TLV payload and print the human-readable outline:

```bash
bun run decode "000201..."
bun run decode path/to/payload.txt
cat payload.txt | bun run decode -
```

Encode an outline file or string into a Thai QR payload:

```bash
bun run encode ./examples/example-outline.txt
bun run encode "00: 01\n01: 02\n..."
cat outline.txt | bun run encode -
```

Generate an ASCII QR directly from a payload string or file:

```bash
bun run generate "000201..."
bun run generate path/to/payload.txt
cat payload.txt | bun run generate -
```

## Contributing

- Open an issue or PR for bugs and feature requests.
- Keep tests passing (`bun run test`) for any changes.


## License

This project is licensed under the Apache License 2.0. See the
`LICENSE` file for the full text.

Attribution: this project includes code adapted from qrcode-terminal
(https://github.com/gtanner/qrcode-terminal). See
https://github.com/gtanner/qrcode-terminal/blob/master/LICENSE for the
original license and copyright information.
