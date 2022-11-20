export function toHexString(buffer: Uint8Array): string {
  return [...buffer].map((x) => x.toString(16).padStart(2, '0')).join('');
}
