import { Auth0Helper } from './auth0Helper';
import { handleRequest } from './handler';

declare const AUTH0_CLIENT_SECRET: string; // provided as cloudflare secret;
declare const AUTH0_CLIENT_ID: string; // provided as cloudflare secret;

addEventListener('fetch', (event) => {
  try {
    const auth0Helper = new Auth0Helper(AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET);
    event.respondWith(handleRequest(event.request, auth0Helper));
  } catch (e) {
    console.error('ERROR', e);
    event.respondWith(new Response(e));
  }
});
