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

Examples (using Bun):

```bash
# build the CLI bundle
bun run build

# decode a TLV payload
bun run decode <payload>

# encode an outline file into a Thai QR payload
bun run encode path/to/outline.txt

# generate a QR directly from a payload string
bun run generate <payload>
```

Scripts from `package.json`:

- `build` — compile and bundle the CLI using Bun; outputs to `dist/thaiqr-cli.js`.
- `decode` — run `src/index.ts` in decode mode.
- `encode` — run `src/index.ts` in encode mode.
- `generate` — run `src/index.ts` in generate mode.
- `test` — run the project's tests with Bun.

Running without Bun (Node.js users):

1. Install dependencies with npm/yarn.
2. Build the bundle with Bun (recommended) or run `ts-node`/`ts-node-esm` to execute TypeScript directly. Some features (scripts) expect Bun but the code itself uses ESM imports and should run under Node with minimal changes.

## Development

- Source files live in `src/` and tests are in `src/*.test.ts`.
- The project is configured as an ESM module and uses TypeScript. The `build` script uses Bun to produce a single JS bundle in `dist/`.

## Examples

Decode a TLV payload and print the human-readable outline:

```bash
bun run decode "000201..."
```

Encode an outline file into a Thai QR payload:

```bash
bun run encode ./examples/example-outline.txt
```

Generate an ASCII QR directly from a payload string:

```bash
bun run generate "000201..."
```

## Contributing

- Open an issue or PR for bugs and feature requests.
- Keep tests passing (`bun run test`) for any changes.

## License

Apache License 2.0

Copyright (c) 2025 Weera Wu

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
