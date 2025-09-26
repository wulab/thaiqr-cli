import fs from 'node:fs'
import qrcode from 'qrcode-terminal'
import { parse as parseOutline, serialize as toOutline } from './outline'
import { parse as parsePayload, serialize as toPayload } from './payload'

if (require.main === module) {
	main()
}

async function main() {
	const command = process.argv[2]
	if (!command) {
		console.error(
			'usage: thaiqr-cli [decode | encode | generate] [<arg> | <file> | -]',
		)
		process.exit(1)
	}

	try {
		switch (command) {
			case 'decode': {
				const payload = await resolveInput(process.argv[3])
				if (!payload) {
					console.error('usage: thaiqr-cli decode [<payload> | <file> | -]')
					process.exit(1)
				}

				const tlvs = parsePayload(payload)
				process.stdout.write(toOutline(tlvs))
				break
			}

			case 'encode': {
				const outline = await resolveInput(process.argv[3])
				if (!outline) {
					console.error('usage: thaiqr-cli encode [<outline> | <file> | -]')
					process.exit(1)
				}

				const tlvs = parseOutline(outline)
				console.log(toPayload(tlvs))
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
