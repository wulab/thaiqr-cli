type Tlv = {
	tag: string
	length: number
	value: string | Tlv[]
}

type IsConstructed = (tag: string, level?: number) => boolean
const isConstructed: IsConstructed = (tag, level = 0) => {
	// Constructed tags as per Thai QR Payment Standard
	return level === 0 && ['29', '30', '31', '80'].includes(tag)
}

type Parse = (payload: string, level?: number) => Tlv[]
const parse: Parse = (payload, level = 0) => {
	if (payload.length === 0) {
		return []
	} else {
		const match = payload.match(/^(\d{2})(\d{2})(.*)$/)
		if (!match) {
			throw new Error(`Invalid payload: ${payload}`)
		}

		const [, tag, lengthStr, restStr] = match
		if (tag === undefined || lengthStr === undefined || restStr === undefined) {
			throw new Error(`Missing tag, length, or value in payload: ${payload}`)
		}

		const length = parseInt(lengthStr, 10)
		if (payload.length < length + 4) {
			throw new Error(`Payload too short: ${payload}`)
		}

		const valueStr = restStr.slice(0, length)
		const value = isConstructed(tag, level)
			? parse(valueStr, level + 1)
			: valueStr
		const rest = restStr.slice(length)

		return [{ tag, length, value }, ...parse(rest, level)]
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
			print(first.value, `${indent}   `)
		}

		print(rest, indent)
	}
}

export { parse, serialize, print, type Tlv }
