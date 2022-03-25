// const baseUrl = 'https://stage.saladsimulator.com';
// const auth0BaseUrl = 'https://staging-saladsimulator.au.auth0.com';
// const auth0ApiAudience = 'saladsimulator-staging';
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
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;
  private auth0BaseUrl: string;
  private auth0ApiAudience: string;
  private authCallbackUrl: string;

  constructor(props: {
    clientId: string;
    clientSecret: string;
    baseUrl: string;
    auth0BaseUrl: string;
    auth0ApiAudience: string;
  }) {
    this.clientId = props.clientId;
    this.clientSecret = props.clientSecret;
    this.baseUrl = props.baseUrl;
    this.auth0BaseUrl = props.auth0BaseUrl;
    this.auth0ApiAudience = props.auth0ApiAudience;
    this.authCallbackUrl = `${this.baseUrl}/auth/callback`;
  }

  private readonly staticState = 'static state';
  public authLoginUrl(challenge: string): string {
    const params = new URLSearchParams();
    params.append('response_type', 'code');
    params.append('client_id', this.clientId);
    params.append('redirect_uri', this.authCallbackUrl);
    params.append('audience', this.auth0ApiAudience);
    params.append('scope', scope);
    params.append('state', this.staticState);
    params.append('code_challenge', challenge);
    params.append('code_challenge_method', 'S256');

    const url = new URL(`${this.auth0BaseUrl}/authorize?${params.toString()}`);

    return url.toString();
  }

  public auth0LogoutUrl(): string {
    return `${this.auth0BaseUrl}/v2/logout`;
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

      audience: this.auth0ApiAudience,
      scope: scope,
    };

    const auth0TokenUrl = `${this.auth0BaseUrl}/oauth/token`;
    const res = await fetch(`${auth0TokenUrl}`, {
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
