const baseUrl = 'https://stage.saladsimulator.com';
const auth0BaseUrl = 'https://staging-saladsimulator.au.auth0.com';
const auth0ApiAudience = 'saladsimulator-staging';
const scope = 'openid profile';
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
  public readonly auth0TokenUrl =
    'https://staging-saladsimulator.au.auth0.com/oauth/token';
  private readonly staticState = 'static state';
  public authLoginUrl(challenge: string): string {
    const params = new URLSearchParams();
    params.append('response_type', 'code');
    params.append('client_id', this.clientId);
    params.append('redirect_uri', this.authCallbackUrl);
    params.append('audience', auth0ApiAudience);
    params.append('scope', scope);
    params.append('state', this.staticState);
    params.append('code_challenge', challenge);
    params.append('code_challenge_method', 'S256');

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
      grant_type: 'authorization_code',
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code_verifier: codeVerifier,
      code,
      redirect_uri: this.authCallbackUrl,

      audience: auth0ApiAudience,
      scope: scope,
    };

    const res = await fetch(`${this.auth0TokenUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const bod = await res.json();
      throw new Error(
        `failed to get code from url ${res.status} ${
          res.statusText
        } - Code ${code} bod: ${JSON.stringify(bod)}`,
      );
    }
    return (await res.json()) as TokenResponse;
  }
}
