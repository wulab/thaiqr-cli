# thaiqr-cli

A small CLI for working with Thai QR (TLV) data, implemented in TypeScript and designed to run with Bun.

## Requirements

- Bun (recommended) — https://bun.sh
- TypeScript ^5 (listed as a peer dependency)

## Install

Install dependencies with Bun:

```bash
bun install
```

If you prefer npm/yarn, install Bun or adapt commands to your toolchain.

## Scripts

The repository provides convenient scripts in `package.json`:

- `build` — compile and bundle the CLI using Bun: outputs to `dist/`.
- `decode` — run the CLI's `decode` mode (invokes `src/index.ts decode`).
- `test` — run the project's tests with Bun.

You can run them directly with Bun or via the package manager wrappers. Examples below use Bun and npm wrappers.

### Examples

Run tests:

```bash
bun run test
```

Build the CLI (outputs `dist/index.js`):

```bash
bun run build
```

Run the CLI's decode command (reads stdin or arguments depending on implementation):

```bash
bun run decode <payload>
```

## Development notes

- Source is under `src/`. Tests are in `src/*.test.ts`.
- The project was bootstrapped with Bun; adjust scripts if you want Node.js-compatible commands.
