type Tlv = {
	tag: string
	length: number
	value: string | Tlv[]
}

type Match = (
	payload: string,
) => [tag: string, length: number, value: string, rest: string]
const match: Match = (payload) => {
	const regex = /^(\d{2})(\d{2})(.*)$/
	const result = payload.match(regex)
	if (!result) {
		throw new Error(`Invalid payload: ${payload}`)
	}

	const [, tag, lengthStr, rest] = result
	if (tag === undefined || lengthStr === undefined || rest === undefined) {
		throw new Error(`Missing tag, length, or value in payload: ${payload}`)
	}

	const length = parseInt(lengthStr, 10)
	if (payload.length < length + 4) {
		throw new Error(`Payload too short: ${payload}`)
	}

	return [tag, length, rest.slice(0, length), rest.slice(length)]
}

type IsConstructed = (tag: string, level?: number) => boolean
const isConstructed: IsConstructed = (tag, level = 0) => {
	// Constructed tags as per Thai QR Payment Standard
	return level === 0 && ['26', '29', '30', '31', '62', '64', '80'].includes(tag)
}

type Parse = (payload: string, level?: number) => Tlv[]
const parse: Parse = (payload, level = 0) => {
	if (payload.length === 0) {
		return []
	} else {
		const [tag, length, value, rest] = match(payload)

		if (isConstructed(tag, level)) {
			return [
				{ tag, length, value: parse(value, level + 1) },
				...parse(rest, level),
			]
		} else {
			return [{ tag, length, value }, ...parse(rest, level)]
		}
	}
}

type Serialize = (tlvs: Tlv[]) => string
const serialize: Serialize = (tlvs) => {
	if (tlvs.length === 0) {
		return ''
	} else {
		const [first, ...rest] = tlvs
		if (first === undefined) return serialize(rest)

		let value: string
		if (typeof first.value === 'string') {
			value = first.value
		} else {
			value = serialize(first.value)
		}

		const length = value.length.toString().padStart(2, '0')
		return first.tag + length + value + serialize(rest)
	}
}

const INDENT = '   '

type ParseLine = (line: string, number: number) => Tlv | null
const parseLine: ParseLine = (line, number) => {
	switch (true) {
		case /^\d{2}\s+\w.*$/.test(line): {
			const result = line.match(/^(\d{2})\s+(\w.*)$/)
			if (!result) {
				throw new Error(`Invalid line: ${line}`)
			}

			const [, tag, value] = result
			if (tag === undefined || value === undefined) {
				throw new Error(`Missing tag or value in line: ${line}`)
			}

			return { tag, length: value.length, value }
		}

		default:
			console.warn(`Ignoring line ${number}: ${line}`)
			return null
	}
}

type ParsePrinted = (input: string) => Tlv[]
const parsePrinted: ParsePrinted = (input) => {
	const lines = input.trim().split(/\r?\n/)
	return lines
		.map((line, index) => parseLine(line, index + 1))
		.filter((tlv) => tlv !== null)
}

type Print = (tlvs: Tlv[], indent?: string) => void
const print: Print = (tlvs, indent = '') => {
	if (tlvs.length === 0) {
		return
	} else {
		const [first, ...rest] = tlvs
		if (first === undefined) return print(rest)

		if (typeof first.value === 'string') {
			console.log(`${indent}${first.tag} ${first.value}`)
		} else {
			console.log(indent + first.tag)
			print(first.value, `${indent}${INDENT}`)
		}

		print(rest, indent)
	}
}

export { parse, parsePrinted, serialize, print, type Tlv }
