import { Auth0Helper } from '../auth0Helper';
import { clearAuthCookie } from '../cookieHelpers';

export function createLogoutHandler(auth0Helper: Auth0Helper) {
  return (request: Request): Promise<Response> => {
    return Promise.resolve(
      clearAuthCookie(request, Response.redirect(auth0Helper.auth0LogoutUrl())),
    );
  };
}
