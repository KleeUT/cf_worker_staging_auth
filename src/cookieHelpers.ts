export const AUTH_COOKIE_NAME = '__stage_auth';
export const CODE_COOKIE_NAME = 'code_cookie';
export const CALLBACK_COOKIE_NAME = '__callback';
export const cookieHeader = 'Cookie';

function getCookie(request: Request, cookieName: string): string {
  let result = '';
  const cookieString = request.headers.get(cookieHeader);
  if (cookieString) {
    const cookies = cookieString.split(';');
    cookies.forEach((cookie) => {
      const cookiePair = cookie.split('=', 2);
      const cookieKey = cookiePair[0].trim();
      if (cookieKey === cookieName) {
        const cookieVal = cookiePair[1];
        result = cookieVal;
      }
    });
  }
  return result;
}

function setCookie(
  _request: Request,
  response: Response,
  cookieName: string,
  value: string,
  expiryTimeMillis = 3600,
): Response {
  const responseHeaders = response.headers;
  const headers = new Headers(responseHeaders);
  const cookieString = `${cookieName}=${
    value ?? ''
  }; HttpOnly; expires=${expiryTimeMillis}; Secure;SameSite=Lax;Path=/;`;
  headers.append('Set-cookie', cookieString);

  return new Response(response.body, { ...response, headers });
}

export function getCodeCookie(request: Request): string {
  return getCookie(request, CODE_COOKIE_NAME);
}

export function setCodeCookie(
  request: Request,
  response: Response,
  value: string,
): Response {
  return setCookie(request, response, CODE_COOKIE_NAME, value);
}

export function getCallbackCookie(request: Request): string {
  return getCookie(request, CALLBACK_COOKIE_NAME);
}

export function setCallbackCookie(
  request: Request,
  response: Response,
  value: string,
): Response {
  return setCookie(request, response, CALLBACK_COOKIE_NAME, value);
}

export function getAuthCookie(request: Request): string {
  return getCookie(request, AUTH_COOKIE_NAME);
}

export function setAuthCookie(
  request: Request,
  response: Response,
  value: string,
  expiry: number,
): Response {
  return setCookie(request, response, AUTH_COOKIE_NAME, value, expiry * 1000);
}

export function clearAuthCookie(
  request: Request,
  response: Response,
): Response {
  return setCookie(request, response, AUTH_COOKIE_NAME, '');
}
