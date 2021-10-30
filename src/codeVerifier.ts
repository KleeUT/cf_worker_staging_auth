import { sha256 } from './cryptoHelper';

export async function generateCodeVerifier(): Promise<string> {
  const encoded = base64URLEncode(randomCode());
  return encoded;
}

function randomCode(): string {
  let array = new Uint8Array(32);
  array = globalThis.crypto.getRandomValues(array);
  return String.fromCharCode.apply(null, Array.from(array));
}

function base64URLEncode(str: string): string {
  const b64 = btoa(str);
  const encoded = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  return encoded;
}

export async function generateChallenge(
  codeVerifierString: string,
): Promise<string> {
  const sha = await sha256(codeVerifierString);
  return sha;
}
