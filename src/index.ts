import { parse, print } from './tlv'

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

				const tlvs = parse(payload)
				print(tlvs)
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
