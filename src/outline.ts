import type { Tlv } from './tlv'

// Parse by indentation: lines with no value start a nested block composed of the subsequent indented lines.
function parse(outline: string): Tlv[] {
	const lines = outline.replace(/\t/g, '    ').split(/\r?\n/)
	let i = 0

	function parseBlock(baseIndent = 0): Tlv[] {
		const out: Tlv[] = []

		while (i < lines.length) {
			const raw = lines[i] ?? ''
			const indentMatch = raw.match(/^\s*/)
			const indent = indentMatch ? indentMatch[0].length : 0
			const trimmed = raw.trim()

			// skip empty lines
			if (trimmed === '') {
				i++
				continue
			}

			// if this line is less indented than the block base, it's for the caller to handle
			if (indent < baseIndent) break

			// consume this line
			i++

			// split into tag and optional value
			const [tag, value] = trimmed.split(/ (.+)/).filter(Boolean)

			// skip lines with no tag
			if (tag === undefined) continue

			if (value === undefined) {
				// nested container: parse following lines that are more indented than this line
				// find next indent level: any following line with greater indent belongs to the child block
				// we pass baseIndent = indent + 1 so child lines must be strictly more indented
				const children = parseBlock(indent + 1)
				out.push([tag, children])
			} else {
				out.push([tag, value])
			}
		}

		return out
	}

	return parseBlock(0)
}

const INDENT = '   '

function serialize(tlvs: Tlv[], indent: string = ''): string {
	if (tlvs.length === 0) {
		return ''
	} else {
		const [first, ...rest] = tlvs
		if (first === undefined) {
			return serialize(rest, indent)
		}

		let result = ''
		if (typeof first[1] === 'string') {
			result += `${indent}${first[0]} ${first[1]}\n`
		} else {
			result += `${indent}${first[0]}\n`
			result += serialize(first[1], `${indent}${INDENT}`)
		}

		result += serialize(rest, indent)
		return result
	}
}

export { parse, serialize }
