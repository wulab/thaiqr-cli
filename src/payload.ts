import type { Tlv } from './tlv'

function match(payload: string): [tag: string, value: string, rest: string] {
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

	return [tag, rest.slice(0, length), rest.slice(length)]
}

function isConstructed(tag: string, level: number = 0): boolean {
	// Constructed tags as per Thai QR Payment Standard
	return level === 0 && ['26', '29', '30', '31', '62', '64', '80'].includes(tag)
}

function parse(payload: string, level: number = 0): Tlv[] {
	if (payload.length === 0) {
		return []
	} else {
		const [tag, value, rest] = match(payload)

		if (isConstructed(tag, level)) {
			return [[tag, parse(value, level + 1)], ...parse(rest, level)]
		} else {
			return [[tag, value], ...parse(rest, level)]
		}
	}
}

function serialize(tlvs: Tlv[]): string {
	if (tlvs.length === 0) {
		return ''
	} else {
		const [first, ...rest] = tlvs
		if (first === undefined) return serialize(rest)

		let value: string
		if (typeof first[1] === 'string') {
			value = first[1]
		} else {
			value = serialize(first[1])
		}

		const length = value.length.toString().padStart(2, '0')
		return first[0] + length + value + serialize(rest)
	}
}

export { parse, serialize }
