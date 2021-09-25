export const AUTH_COOKIE_NAME = '__stage_auth';
export const CODE_COOKIE_NAME = 'code_cookie';
export const cookieHeader = 'Cookie';

export function getAuthCookie(request: Request): string {
  return getCookie(request, AUTH_COOKIE_NAME);
}

export function getCodeCookie(request: Request): string {
  return getCookie(request, CODE_COOKIE_NAME);
}

function getCookie(request: Request, cookieName: string): string {
  console.log(`retrieving cookie ${cookieName}`);
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
  request: Request,
  response: Response,
  cookieName: string,
  value: string,
): Response {
  const existingHeaders = response.headers ?? request.headers;
  const headers = new Headers(existingHeaders);
  headers.set(
    'Set-cookie',
    `${cookieName}=${value ?? ''}; HttpOnly; Secure; SameSite=Lax;`,
  );

  return new Response(response.body, { ...response, headers });
}

export function setCodeCookie(
  request: Request,
  response: Response,
  value: string,
): Response {
  return setCookie(request, response, CODE_COOKIE_NAME, value);
}

export function clearAuthCookie(
  request: Request,
  response: Response,
): Response {
  return setCookie(request, response, AUTH_COOKIE_NAME, '');
}
