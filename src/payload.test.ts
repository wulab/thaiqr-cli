import { expect, test } from 'bun:test'
import { checksum } from './crc'
import { parse, serialize, validate } from './payload'

test('payload roundtrip with multiple TLVs', () => {
	// two primitive TLVs: tag=01 value='AB' (len=2), tag=02 value='CDEF' (len=4)
	const payload = '0102AB0204CDEF'
	const parsed = parse(payload)
	expect(parsed).toEqual([
		['01', 'AB'],
		['02', 'CDEF'],
	])
	const serialized = serialize(parsed)
	expect(serialized).toBe(payload)
})

test('payload.parse throws on truncated payload', () => {
	const bad = '0103AB' // claims length 3 but only 2 bytes provided
	expect(() => parse(bad)).toThrow()
})

test('validate returns true for payload with correct CRC', () => {
	const base = '0102AB0204CDEF'
	const crc = checksum(base + '6304')
	const payload = base + '6304' + crc
	expect(validate(payload)).toBe(true)
})

test('validate returns false for payload with incorrect CRC', () => {
	const base = '0102AB0204CDEF'
	const payload = base + '6304' + 'FFFF'
	expect(validate(payload)).toBe(false)
})

test('validate returns false when CRC tag is missing', () => {
	const base = '0102AB0204CDEF'
	expect(validate(base)).toBe(false)
})

test('validate returns false when CRC value has wrong length', () => {
	const base = '0102AB0204CDEF'
	// CRC TLV present but length is 3 instead of 4
	const payload = base + '6303' + 'ABC'
	expect(validate(payload)).toBe(false)
})
