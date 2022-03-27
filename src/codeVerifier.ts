import { sha256, urlEncodeB64, getRandomData } from './cryptoHelper';
import { base64Encode } from './windowWrapper';

export async function generateCodeVerifier(): Promise<string> {
  const encoded = urlEncodeB64(base64Encode(randomCode()));
  return encoded;
}

function randomCode(): string {
  let array = new Uint8Array(32);
  array = getRandomData(array)
  return String.fromCharCode.apply(null, Array.from(array));
}

export async function generateChallenge(
  codeVerifierString: string,
): Promise<string> {
  const sha = await sha256(codeVerifierString);
  return sha;
}
