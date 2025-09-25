import { expect, test } from 'bun:test'
import { parse, serialize } from './payload'

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
