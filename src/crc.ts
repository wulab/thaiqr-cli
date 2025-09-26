// CRC-16/CCITT-FALSE (poly 0x1021, init 0xFFFF, no ref, xorout 0x0000)
function checksum(payload: string): string {
	let crc = 0xffff

	for (let i = 0; i < payload.length; i++) {
		crc ^= payload.charCodeAt(i) << 8

		for (let j = 0; j < 8; j++) {
			if ((crc & 0x8000) !== 0) {
				crc = ((crc << 1) ^ 0x1021) & 0xffff
			} else {
				crc = (crc << 1) & 0xffff
			}
		}
	}

	return crc.toString(16).toUpperCase().padStart(4, '0')
}

export { checksum }
