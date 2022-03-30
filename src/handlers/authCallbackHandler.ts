import { Auth0Helper } from '../auth0Helper';
import { AuthRepository } from '../authRepository';
import {
  getCallbackCookie,
  getCodeCookie,
  setAuthCookie,
} from '../cookieHelpers';
import { sha256 } from '../cryptoHelper';
import { decodeToken } from '../tokenHelpers';

export function createAuthCallbackHandler(
  auth0Helper: Auth0Helper,
  authRepo: AuthRepository,
): (request: Request) => Promise<Response> {
  return async function handleAuthCallback(
    request: Request,
  ): Promise<Response> {
    // get the code from the url
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    // exit if there is no code in the url
    if (!code) {
      return new Response(`failed to get code from url ${request.url}`);
    }

    // get the code verifier from the cookie jar
    const codeVerifier = await getCodeCookie(request);
    try {
      // get exchange the code and verifier with the Authentication Server for a token
      const responseBody = await auth0Helper.exchangeCodeForToken(
        fetch,
        code,
        codeVerifier,
      );

      // ensure the token is in the correct JWT format
      const parsedAuth = await decodeToken(responseBody.id_token);
      if (!parsedAuth) {
        throw new Error('Could not parse token');
      }
      
      // hash the token 
      const hashedToken = await sha256(responseBody.id_token);
      // store the token
      await authRepo.save(hashedToken, parsedAuth);

      // send the user back to where they were trying to access to start with 
      const res = Response.redirect(getCallbackCookie(request));
      // set the cookie so that future requests are allowed through.
      return setAuthCookie(
        request,
        res,
        hashedToken,
        parsedAuth.body.exp,
      );

    } catch (e: unknown) {
      return new Response((e as Error).message, { status: 500 });
    }
  };
}
