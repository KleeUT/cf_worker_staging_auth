import { Auth0Helper } from './auth0Helper';
import { generateChallenge, generateCodeVerifier } from './codeVerifier';
import {
  clearAuthCookie,
  getAuthCookie,
  getCodeCookie,
  setCodeCookie,
} from './cookieHelpers';

import { verifyAuth } from './cookieValidator';

declare const AUTH0_CLIENT_SECRET: string; // provided as cloudflare secret;
declare const AUTH0_CLIENT_ID: string; // provided as cloudflare variable;

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
      {
        const code = await generateCodeVerifier();
        const challenge = await generateChallenge(code);
        response = new Response(
          `sssssh secret is "${AUTH0_CLIENT_SECRET}" clientid = "${AUTH0_CLIENT_ID}", verifierCode=${code} challenge =${challenge}`,
        );
      }
      break;
    case '/challenge':
      {
        response = await generateMeAChallenge(request);
      }
      break;
    default:
      response = await checkAuth(request, response, auth0Helper);
      break;
  }

  return response;
}

async function generateMeAChallenge(request: Request): Promise<Response> {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code') || '';
  const challenge = await generateChallenge(code);
  return new Response(`Took ${code} and generated ${challenge}`);
}

async function handleAuthCallback(
  request: Request,
  _response: Response,
  auth0Helper: Auth0Helper,
): Promise<Response> {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  if (!code) {
    return new Response(`failed to get code from url ${request.url}`);
  }

  const codeVerifier = await getCodeCookie(request);
  console.log(`Retrieved code verifier  ${codeVerifier}`);
  try {
    const bod = await auth0Helper.exchangeCodeForToken(
      fetch,
      code,
      codeVerifier,
    );
    return new Response(`fetched a token } ${JSON.stringify(bod)}`);
  } catch (e: unknown) {
    return new Response((e as Error).message, { status: 500 });
  }
}

async function checkAuth(
  request: Request,
  _response: Response,
  auth0Helper: Auth0Helper,
): Promise<Response> {
  const authCookie = getAuthCookie(request);
  const valid = await verifyAuth(authCookie);
  if (!valid) {
    console.log('Creating verifier');
    const codeVerifier = await generateCodeVerifier();
    console.log('Generating challenge');
    const codeChallenge = await generateChallenge(codeVerifier);
    const url = auth0Helper.authLoginUrl(codeChallenge);
    console.log(
      `code and code challenge generated codeVerifier "${codeVerifier}"  codeChallenge "${codeChallenge}" loginUrl=${url}`,
    );
    const res = setCodeCookie(
      request,
      Response.redirect(url, 302),
      codeVerifier,
    );
    console.log('done with response');
    return res;
  }
  return new Response(`${authCookie}--- cookie is valid? ${valid}`);
}
