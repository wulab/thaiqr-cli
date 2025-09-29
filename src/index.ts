import fs from 'node:fs'
import qrcode from 'qrcode-terminal'
import { parse as parseOutline, serialize as toOutline } from './outline'
import {
	parse as parsePayload,
	serialize as toPayload,
	serializeWithCrc as toPayloadWithCrc,
	validate,
} from './payload'
import { VERSION } from './version.ts'

if (require.main === module) {
	main()
}

/**
 * Entry point for the thaiqr-cli command-line tool.
 *
 * Handles the following commands:
 * - `decode`: Decodes a Thai QR payload and prints its outline.
 * - `encode`: Encodes an outline into a Thai QR payload.
 * - `generate`: Generates a QR code from a Thai QR payload.
 *
 * Usage:
 *   thaiqr-cli [decode | encode | generate] [<arg> | <file> | -]
 *
 * Exit codes:
 * - 0: Success
 * - 1: Invalid usage or missing command/argument
 * - 2: Invalid payload (e.g., CRC error) or unexpected error
 */
async function main() {
	const command = process.argv[2]
	if (!command) {
		console.error(
			`usage: thaiqr-cli [command]

Commands:

   decode    Decodes a Thai QR payload and prints its outline
   encode    Encodes an outline into a Thai QR payload
   generate  Generates a QR code from a Thai QR payload
   version   Prints the current application version
`,
		)
		process.exit(1)
	}

	try {
		switch (command) {
			case 'decode': {
				const payload = await resolveInput(process.argv[3])
				if (!payload) {
					console.error(
						'usage: thaiqr-cli decode [<payload> | <file> | -] [--force]',
					)
					process.exit(1)
				}

				// fail on invalid CRC by default; allow --force to bypass
				const force = process.argv.includes('--force')
				if (!force && !validate(payload)) {
					console.error(
						'error: invalid or missing CRC in payload (use --force to ignore)',
					)
					process.exit(2)
				}

				const tlvs = parsePayload(payload)
				process.stdout.write(toOutline(tlvs))
				break
			}

			case 'encode': {
				const outline = await resolveInput(process.argv[3])
				if (!outline) {
					console.error(
						'usage: thaiqr-cli encode [<outline> | <file> | -] [--preserve-crc]',
					)
					process.exit(1)
				}

				const tlvs = parseOutline(outline)

				// always produce a correct CRC unless user requests preservation
				const preserve = process.argv.includes('--preserve-crc')
				const payload = preserve ? toPayload(tlvs) : toPayloadWithCrc(tlvs)

				console.log(payload)
				break
			}

			case 'generate': {
				const payload = await resolveInput(process.argv[3])
				if (!payload) {
					console.error('usage: thaiqr-cli generate [<payload> | <file> | -]')
					process.exit(1)
				}

				qrcode.generate(payload, { small: true })
				break
			}

			case 'version': {
				console.log(VERSION)
				break
			}

			default:
				console.error('usage: thaiqr-cli <command>')
				process.exit(1)
		}
	} catch (err) {
		console.error('error:', (err as Error).message)
		process.exit(2)
	}
}

// Behaviour:
// - `command -` reads data from stdin
// - `command <file>` reads data from the given file path (if it exists)
// - `command <data>` treats the arg as a raw data string
// - `command` with no arg will read from stdin if piped, otherwise show usage
async function resolveInput(
	arg: string | undefined,
): Promise<string | undefined> {
	let data: string | undefined

	if (arg === '-') {
		// explicit request to read from stdin
		data = await readStdin()
	} else if (arg && fs.existsSync(arg) && fs.statSync(arg).isFile()) {
		// existing file path
		data = fs.readFileSync(arg, 'utf8').trim()
	} else if (arg) {
		// treat as raw data string
		data = arg
	} else if (!process.stdin.isTTY) {
		// no arg, but stdin is piped
		data = await readStdin()
	}

	return data
}

async function readStdin(): Promise<string> {
	let data = ''
	process.stdin.setEncoding('utf8')
	for await (const chunk of process.stdin) {
		data += chunk
	}
	return data.trim()
}

// Note: VERSION is generated at build time into src/version.ts
