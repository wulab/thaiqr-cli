import { expect, test } from 'bun:test'
import { checksum } from './crc'

const payload =
	'00020101021129370016A0000006770101110113006689123456753037645406123.455802TH'

test('crc over payload without CRC (should be 0B71)', () => {
	expect(checksum(payload)).toBe('0B71')
})

test('crc over payload + 6304 (should be 15E0)', () => {
	expect(checksum(payload + '6304')).toBe('15E0')
})
