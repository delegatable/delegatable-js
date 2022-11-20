export function fromHexString(hexString: string): Uint8Array {
  if (!hexString || typeof hexString !== 'string') {
    throw new Error('Expected a hex string.');
  }
  const matched = hexString.match(/.{1,2}/g);
  if (!matched) {
    throw new Error('Expected a hex string.');
  }
  const mapped = matched.map((byte) => parseInt(byte, 16));
  if (!mapped || mapped.length !== 32) {
    throw new Error('Expected a hex string.');
  }
  return new Uint8Array(mapped);
}
