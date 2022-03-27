import { base64Encode, getCrypto, getCryptoSubtle } from './windowWrapper';

export const getRandomData = (array: Uint8Array): Uint8Array => {
  return getCrypto().getRandomValues(array);
}

export const sha256 = async (s: string): Promise<string> => {
  const digestOp = await getCryptoSubtle().digest(
    { name: 'SHA-256' },
    new TextEncoder().encode(s),
  );
  return bufferToBase64UrlEncoded(new Uint8Array(digestOp));
};

export const urlEncodeB64 = (input: string): string => {
  const b64Chars: { [index: string]: string } = { '+': '-', '/': '_', '=': '' };
  return input.replace(/[+/=]/g, (m: string) => b64Chars[m]);
};

const bufferToBase64UrlEncoded = (input: number[] | Uint8Array): string => {
  return urlEncodeB64(base64Encode(String.fromCharCode(...Array.from(input))));
};
