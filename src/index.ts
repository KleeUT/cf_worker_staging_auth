import { Auth0Helper } from './auth0Helper';
import { AuthRepository } from './authRepository';
import { handleRequest } from './handler';

declare const AUTH0_CLIENT_SECRET: string; // provided as cloudflare secret;
declare const AUTH0_CLIENT_ID: string; // provided as cloudflare variable;
declare const AUTH_STORE: KVNamespace; // comes from the Workers environment

addEventListener('fetch', (event) => {
  try {
    const auth0Helper = new Auth0Helper(AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET);
    const authRepo = new AuthRepository(AUTH_STORE);

    event.respondWith(handleRequest(event.request, auth0Helper, authRepo));
  } catch (e) {
    console.error(e);
    throw e;
  }
});
