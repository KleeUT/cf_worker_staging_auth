import { Auth0Helper } from '../auth0Helper';
import { AuthRepository } from '../authRepository';
import { createAuthCallbackHandler } from './authCallbackHandler';
import { createLogoutHandler } from './logoutHandler';
import { createSessionRequiredHandler } from './sessionRequiredHandler';

export function createHandler(): (request: Request) => Promise<Response> {
  // Global variables from wrangler.toml for variables. Secrets uploaded to Cloudflare. 
  const auth0Helper = new Auth0Helper({
    clientId: AUTH0_CLIENT_ID,
    clientSecret: AUTH0_CLIENT_SECRET,
    auth0ApiAudience: AUTH0_API_AUDIENCE,
    auth0BaseUrl: AUTH0_BASE_URL,
    baseUrl: BASE_URL,
  });
  const authRepo = new AuthRepository(AUTH_STORE);

  const callbackHandler = createAuthCallbackHandler(auth0Helper, authRepo);
  const logoutHandler = createLogoutHandler(auth0Helper);
  const sessionRequiredHandler = createSessionRequiredHandler(
    auth0Helper,
    authRepo,
  );

  return async function handleRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);

    switch (url.pathname) {
      case '/auth/logout':
        return logoutHandler(request);
      case '/auth/callback':
        return await callbackHandler(request);
      default:
        return await sessionRequiredHandler(request);
    }
  };
}
