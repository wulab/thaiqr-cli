import { expect, test } from 'bun:test'
import { parse, serialize, type Tlv } from './tlv.ts'

test('parse simple TLV', () => {
	const payload = '0102AB'
	const result = parse(payload)
	expect(result).toEqual([{ tag: '01', length: 2, value: 'AB' }])
})

test('serialize simple TLV', () => {
	const tlvs: Tlv[] = [{ tag: '01', length: 2, value: 'AB' }]
	expect(serialize(tlvs)).toBe('0102AB')
})

test('parse nested TLV', () => {
	const payload = '29060102AB'
	const result = parse(payload)
	expect(result).toEqual([
		{
			tag: '29',
			length: 6,
			value: [{ tag: '01', length: 2, value: 'AB' }],
		},
	])
})
