import { expect, test } from 'bun:test'
import { parse, serialize } from './outline'

test('outline.parse simple and serialize', () => {
	const outline = `01 AB\n`
	const parsed = parse(outline)
	expect(parsed).toEqual([['01', 'AB']])
	const serialized = serialize(parsed)
	expect(serialized.trim()).toBe(outline.trim())
})

test('outline.parse nested and serialize with indentation', () => {
	const outline = `29\n   01 AB\n`
	const parsed = parse(outline)
	expect(parsed).toEqual([['29', [['01', 'AB']]]])
	const serialized = serialize(parsed)
	expect(serialized.trim()).toBe(outline.trim())
})

