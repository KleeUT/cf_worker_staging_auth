const baseUrl = 'https://stage.saladsimulator.com';
const auth0BaseUrl = 'https://staging-saladsimulator.au.auth0.com';
export type Fetch = (
  input: RequestInfo,
  init?: RequestInit | undefined,
) => Promise<Response>;

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  id_token: string;
  token_type: 'Bearer';
  expires_in: number;
};

export class Auth0Helper {
  constructor(private clientId: string, private clientSecret: string) {}

  public readonly authCallbackUrl = `${baseUrl}/auth/callback`;
  public readonly auth0TokenUrl = `${auth0BaseUrl}/oauth/token`;

  public authLoginUrl(challenge: string): string {
    const params = new URLSearchParams();
    params.append('response_type', 'code');
    params.append('client_id', this.clientId);
    params.append('redirect_uri', this.authCallbackUrl);
    params.append('audience', 'saladsimulator-staging');
    params.append('code_challenge', challenge);
    params.append('code', 'S256');
    const url = new URL(`${auth0BaseUrl}/authorize?${params.toString()}`);

    return url.toString();
  }

  public auth0LogoutUrl(): string {
    return `${auth0BaseUrl}/v2/logout`;
  }

  public async exchangeCodeForToken(
    fetch: Fetch,
    code: string,
    codeVerifier: string,
  ): Promise<TokenResponse> {
    const body = {
      client_id: this.clientId,
      client_secret: this.clientSecret, // for web applications
      code,
      code_verifier: codeVerifier,
      grant_type: 'authorization_code',
      redirect_uri: this.authCallbackUrl,
    };
    console.log(
      `callback url  ${
        this.auth0TokenUrl
      }, codeVerifier: ${codeVerifier}, ${JSON.stringify(body)}`,
    );
    const res = await fetch(`${this.auth0TokenUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      // if (!code) {
      const bod = await res.json();
      console.log(bod);
      throw new Error(
        `failed to get code from url ${res.status} ${
          res.statusText
        } - Code ${code} bod: ${JSON.stringify(bod)}`,
      );
      // }
    }
    return (await res.json()) as TokenResponse;
  }
}

/* 
https://staging-saladsimulator.au.auth0.com/authorize?
response_type=code&
client_id=bwTWTXSpIJ5jIblPWxN278bU06J25ine&
redirect_uri=https%253A%252F%252Fstage.saladsimulator.com%252Fauth%252Fcallback&
audience=saladsimulator-staging&
code_challenge=MmtSTnVQQ1VBRGhpM2RPNzN6L3ZTSThHeEJqdVV5QWZYU2QrOGJzWlpQQT0&
code=S256
*/
