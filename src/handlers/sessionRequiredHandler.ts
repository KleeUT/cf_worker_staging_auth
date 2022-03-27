import { Auth0Helper } from '../auth0Helper';
import { AuthRepository } from '../authRepository';
import { generateChallenge, generateCodeVerifier } from '../codeVerifier';
import {
  getAuthCookie,
  setCallbackCookie,
  setCodeCookie,
} from '../cookieHelpers';
import { decodeToken } from '../tokenHelpers';

export function createSessionRequiredHandler(
  auth0Helper: Auth0Helper,
  authRepo: AuthRepository,
): (request: Request) => Promise<Response> {
  return async (request: Request): Promise<Response> => {
    // get the token from the request header
    const authCookie = getAuthCookie(request);
    
    // retrieve the stored authentication from KV
    const storedAuth = await authRepo.get(authCookie);

    // if the user is known pass the request to the origin;
    if (authCookie || storedAuth) {
      return fetch(request);
    }

    return redirectToAuth(request);
  };

  async function redirectToAuth(request: Request): Promise<Response> {
    // create a random string to be used in the callback handler
    const codeVerifier = await generateCodeVerifier();
    // generate a hash of the verifier to provide to the Authentication Server
    const codeChallenge = await generateChallenge(codeVerifier);

    // generate the url to redirect the user to
    const url = auth0Helper.authLoginUrl(codeChallenge);

    // store the code verifier so we can prove we made the request
    const res = setCodeCookie(
      request,
      Response.redirect(url, 302),
      codeVerifier,
    );
    // store where the user was trying to go to
    const requestWithCookie = setCallbackCookie(request, res, request.url);

    return requestWithCookie;
  }
}
