export function getCryptoSubtle(): SubtleCrypto {
  return globalThis.crypto.subtle;
}

export function base64Encode(data: string): string {
  return btoa(data);
}

export function base64Decode(data: string): string {
  return atob(data);
}
