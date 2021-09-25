import { encode } from 'base64-arraybuffer';
export function randomCode(): string {
  let array = new Uint8Array(32);
  array = globalThis.crypto.getRandomValues(array);
  return String.fromCharCode.apply(null, Array.from(array));
}

async function sha256(data: ArrayBuffer): Promise<ArrayBuffer> {
  console.log('converting to sha');
  const sha = await globalThis.crypto.subtle.digest('SHA-256', data);
  console.log('Created sha');
  return sha;
  // return crypto.createHash('sha256').update(buffer).digest();
}

function str2ab(str: string): ArrayBuffer {
  console.log('converting string: ' + str);
  const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  const bufView = new Uint16Array(buf);
  console.log('created buffer');
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  console.log('Added all to buffer');
  return buf;
}

export async function generateChallenge(verifier: string): Promise<string> {
  const encoded = encode(await sha256(str2ab(verifier)));
  console.log('encoded');
  return base64URLEncode(encoded);
}
function base64URLEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  // return btoa(str).replace(/\+/g, '').replace(/\//g, '').replace(/=/g, '');
}

export async function codeVerifier(): Promise<string> {
  // const blob = new Blob([randomCode()], { type: 'text/plain; charset=utf-8' });

  // const text = await blob.text();

  const rando = randomCode();
  const encoded = base64URLEncode(rando);
  console.log(`Code Verifier strings random: ${rando} | encoded: ${encoded}`);
  return encoded;
}
