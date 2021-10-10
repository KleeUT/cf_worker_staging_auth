import { Auth0Helper } from './auth0Helper';
import { generateChallenge, codeVerifier } from './codeVerifier';
import {
  clearAuthCookie,
  getAuthCookie,
  getCodeCookie,
  setCodeCookie,
} from './cookieHelpers';

import { verifyAuth } from './cookieValidator';

declare const AUTH0_CLIENT_SECRET: string; // provided as cloudflare secret;
declare const AUTH0_CLIENT_ID: string; // provided as cloudflare secret;

// Here? ;
// const auth0TokenUrl = `${auth0BaseUrl}/`;
export async function handleRequest(
  request: Request,
  auth0Helper: Auth0Helper,
): Promise<Response> {
  const url = new URL(request.url);
  console.log(`Handling request for ${url.hostname} ${url.pathname}`);
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
      response = await handleAuthCallback(request, response, auth0Helper);
      break;
    case '/secrettest':
      response = new Response(
        `sssssh secret is "${AUTH0_CLIENT_SECRET}" clientid = "${AUTH0_CLIENT_ID}", verifierCode=${await codeVerifier()}`,
      );
      break;
    default:
      response = await checkAuth(request, response, auth0Helper);
      break;
  }

  return response;
}

async function handleAuthCallback(
  request: Request,
  response: Response,
  auth0Helper: Auth0Helper,
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
      request.url,
    );
    return new Response(`fetched a token } ${JSON.stringify(bod)}`);
  } catch (e: unknown) {
    return new Response((e as Error).message, { status: 500 });
  }
}

async function checkAuth(
  request: Request,
  response: Response,
  auth0Helper: Auth0Helper,
): Promise<Response> {
  const authCookie = getAuthCookie(request);
  const valid = await verifyAuth(authCookie);
  if (!valid) {
    console.log('Creating verifier');
    const code = await codeVerifier();
    console.log('Generating challenge');
    const codeChallenge = await generateChallenge(code);
    const url = auth0Helper.authLoginUrl(codeChallenge);
    console.log(
      `code and code challenge generated Code ${code}  challenge ${codeChallenge} loginUrl=${url}`,
    );
    const res = setCodeCookie(request, Response.redirect(url, 302), code);
    console.log('done with response');
    return res;
  }
  return new Response(`${authCookie}--- cookie is valid? ${valid}`);
}
