import { IdentityTokenBody, JWT, TokenHead } from './types';
import { base64Decode } from './windowWrapper';
export async function decodeToken(token: string): Promise<JWT | false> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }
  const head = base64Decode(parts[0]);
  const body = base64Decode(parts[1]);
  return {
    head: JSON.parse(head) as TokenHead,
    body: JSON.parse(body) as IdentityTokenBody,
    signature: parts[2],
  };
}
