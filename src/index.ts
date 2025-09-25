import fs from 'node:fs'
import qrcode from 'qrcode-terminal'
import { parse as parseOutline, serialize as toOutline } from './outline'
import { parse as parsePayload, serialize as toPayload } from './payload'

const main = () => {
	const command = process.argv[2]
	if (!command) {
		console.error('Usage: thaiqr-cli <command>')
		process.exit(1)
	}

	try {
		switch (command) {
			case 'decode': {
				const payload = process.argv[3]
				if (!payload) {
					console.error('Usage: thaiqr-cli decode <payload>')
					process.exit(1)
				}

				const tlvs = parsePayload(payload)
				console.log(toOutline(tlvs))
				break
			}

			case 'encode': {
				const path = process.argv[3]
				if (!path) {
					console.error('Usage: thaiqr-cli encode <file>')
					process.exit(1)
				}

				const outline = fs.readFileSync(path, 'utf-8')
				const tlvs = parseOutline(outline)
				console.log(toPayload(tlvs))
				break
			}

			case 'generate': {
				const payload = process.argv[3]
				if (!payload) {
					console.error('Usage: thaiqr-cli generate <payload>')
					process.exit(1)
				}

				qrcode.generate(payload, { small: true })
				break
			}

			default:
				console.error('Usage: thaiqr-cli <command>')
				process.exit(1)
		}
	} catch (err) {
		console.error('Error:', (err as Error).message)
		process.exit(2)
	}
}

if (require.main === module) {
	main()
}
