export function getCryptoSubtle(): SubtleCrypto {
  return globalThis.crypto.subtle;
}

export function base64(data: string): string {
  return btoa(data);
}
