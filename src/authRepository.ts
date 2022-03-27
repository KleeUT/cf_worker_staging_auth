import { sha256 } from './cryptoHelper';
import { JWT } from './types';

export type StoredAuth = { exp: number };

export class AuthRepository {
  constructor(private store: KVNamespace) {}

  async save(token: string, parsedToken: JWT): Promise<void> {
    await this.store.put(token, JSON.stringify(parsedToken), {
      expiration: parsedToken.body.exp,
    });
  }

  async get(token: string): Promise<JWT | null> {
    const storedToken = await this.store.get(token, 'text');
    if (storedToken) {
      try {
        return JSON.parse(storedToken) as JWT;
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}
