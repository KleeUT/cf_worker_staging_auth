import { Auth0Helper } from './auth0Helper';
import { AuthRepository } from './authRepository';
import { generateChallenge, generateCodeVerifier } from './codeVerifier';
import {
  clearAuthCookie,
  getAuthCookie,
  getCallbackCookie,
  getCodeCookie,
  setAuthCookie,
  setCallbackCookie,
  setCodeCookie,
} from './cookieHelpers';

import { verifyAuth } from './cookieValidator';

export async function handleRequest(
  request: Request,
  auth0Helper: Auth0Helper,
  authRepo: AuthRepository,
): Promise<Response> {
  const url = new URL(request.url);
  const authCookie = getAuthCookie(request);

  let response = new Response(
    `Cookie value for auth = ${authCookie} url=${request.url} 448`,
  );

  switch (url.pathname) {
    case '/favicon.ico':
      response = new Response(null, { status: 404 });
      break;
    case '/logout':
      clearAuthCookie(request, response);
      response = Response.redirect(auth0Helper.auth0LogoutUrl());
      break;
    case '/auth/callback':
      response = await handleAuthCallback(
        request,
        response,
        auth0Helper,
        authRepo,
      );
      break;
    case '/secrettest':
      {
        response = new Response(
          `Here's the key data ${(
            await (await authRepo.allKeys()).map((x) => JSON.stringify(x))
          ).join(', ')}`,
        );
      }
      break;
    default:
      response = await checkAuth(request, response, auth0Helper, authRepo);
      break;
  }

  return response;
}

async function handleAuthCallback(
  request: Request,
  _response: Response,
  auth0Helper: Auth0Helper,
  authRepo: AuthRepository,
): Promise<Response> {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  if (!code) {
    return new Response(`failed to get code from url ${request.url}`);
  }

  const codeVerifier = await getCodeCookie(request);
  try {
    const bod = await auth0Helper.exchangeCodeForToken(
      fetch,
      code,
      codeVerifier,
    );
    const parsedAuth = await verifyAuth(bod.id_token);
    if (!parsedAuth) {
      throw new Error('Could not parse token');
    }
    await authRepo.save(bod.id_token, parsedAuth);
    const res = await fetch(getCallbackCookie(request));
    return setAuthCookie(request, res, bod.id_token);
  } catch (e: unknown) {
    return new Response((e as Error).message, { status: 500 });
  }
}

async function checkAuth(
  request: Request,
  _response: Response,
  auth0Helper: Auth0Helper,
  authRepo: AuthRepository,
): Promise<Response> {
  const authCookie = getAuthCookie(request);
  const validCookie = await verifyAuth(authCookie);
  const storedAuth = await authRepo.get(authCookie);

  if (!(validCookie && storedAuth)) {
    const codeVerifier = await generateCodeVerifier();
    const codeChallenge = await generateChallenge(codeVerifier);
    const url = auth0Helper.authLoginUrl(codeChallenge);
    const res = setCodeCookie(
      request,
      Response.redirect(url, 302),
      codeVerifier,
    );
    return setCallbackCookie(request, res, request.url);
  }
  return fetch(request);
}
