import { base64, getCryptoSubtle } from './windowWrapper';

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

export async function generateNonce(): Promise<string> {
  return urlEncodeB64(btoa(await randomCode()));
}

const sha256 = async (s: string): Promise<string> => {
  const digestOp = await getCryptoSubtle().digest(
    { name: 'SHA-256' },
    new TextEncoder().encode(s),
  );
  return bufferToBase64UrlEncoded(new Uint8Array(digestOp));
};

const bufferToBase64UrlEncoded = (input: number[] | Uint8Array): string => {
  return urlEncodeB64(base64(String.fromCharCode(...Array.from(input))));
};

const urlEncodeB64 = (input: string) => {
  const b64Chars: { [index: string]: string } = { '+': '-', '/': '_', '=': '' };
  return input.replace(/[+/=]/g, (m: string) => b64Chars[m]);
};

export async function generateChallenge(
  codeVerifierString: string,
): Promise<string> {
  const sha = await sha256(codeVerifierString);
  return sha;
}
