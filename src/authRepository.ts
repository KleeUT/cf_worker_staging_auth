import { sha256 } from './cryptoHelper';
import { JWT } from './types';

export type StoredAuth = { exp: number };

export class AuthRepository {
  constructor(private store: KVNamespace) {}

  async save(token: string, parsedToken: JWT): Promise<void> {
    const key = await sha256(token);
    await this.store.put(key, JSON.stringify(parsedToken), {
      expiration: parsedToken.body.exp,
    });
  }

  async get(token: string): Promise<JWT | null> {
    const key = await sha256(token);
    const storedToken = await this.store.get(key, 'text');
    if (storedToken) {
      try {
        return JSON.parse(storedToken) as JWT;
      } catch (e) {}
    }
    return null;
  }

  async allKeys(): Promise<{ name: string; expiration?: number }[]> {
    const results = await this.store.list();
    return await results.keys.map((x) => ({
      name: x.name,
      expiration: x.expiration,
    }));
  }
}
