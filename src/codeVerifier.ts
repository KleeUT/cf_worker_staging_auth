// import { encode } from 'base64-arraybuffer';
import { ab2str, str2Uin8Array } from './ArrayBufferHelpers';

export async function codeVerifier(): Promise<string> {
  const rando = randomCode();
  const encoded = base64URLEncode(rando);
  console.log(`Code Verifier strings random: ${rando} | encoded: ${encoded}`);
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
  console.log(`Encoded ${encoded} | B64  ${b64}`);
  return encoded;
}

export async function generateChallenge(verifier: string): Promise<string> {
  const shaCode = await sha256(str2Uin8Array(verifier));
  const encoded = base64URLEncode(shaCode);
  console.log(
    `generating challenge verifier ${verifier} shaCode ${shaCode} encoded ${encoded}`,
  );
  return encoded;
}

async function sha256(data: Uint8Array): Promise<string> {
  console.log('converting to sha');
  const sha = await globalThis.crypto.subtle.digest('SHA-256', data);
  console.log('Created sha');
  return ab2str(sha);
  // return crypto.createHash('sha256').update(buffer).digest();
}
