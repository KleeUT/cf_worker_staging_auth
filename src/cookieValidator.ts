import { IdentityTokenBody, JWT, TokenHead } from './types';
export async function verifyAuth(token: string): Promise<JWT | false> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }
  const head = atob(parts[0]);
  const body = atob(parts[1]);
  return {
    head: JSON.parse(head) as TokenHead,
    body: JSON.parse(body) as IdentityTokenBody,
    signature: parts[2],
  };
}
