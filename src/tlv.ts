type Tlv = {
	tag: string
	length: number
	value: string | Tlv[]
}

type Parse = (input: string) => Tlv[]
const parse: Parse = (input) => {
	if (input.length === 0) {
		return []
	} else {
		const match = input.match(/^(\d{2})(\d{2})(.*)$/)
		if (!match) {
			throw new Error(`Invalid input: ${input}`)
		}

		const [, tag, lengthStr, restStr] = match
		if (tag === undefined || lengthStr === undefined || restStr === undefined) {
			throw new Error(`Invalid input groups: ${input}`)
		}

		const length = parseInt(lengthStr, 10)
		if (input.length < length + 4) {
			throw new Error(`Input too short: ${input}`)
		}

		const rawValue = restStr.slice(0, length)
		const rest = restStr.slice(length)

		// attempt nested parse: only accept nested if parsing the whole rawValue succeeds
		let value: Tlv['value']
		try {
			value = parse(rawValue)
		} catch {
			value = rawValue
		}

		return [{ tag, length, value }, ...parse(rest)]
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
