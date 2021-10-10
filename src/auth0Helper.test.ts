import { Auth0Helper } from './auth0Helper';
const AUTH0_CLIENT_SECRET = 'auth0ClientSecret'; // provided as cloudflare secret;
const AUTH0_CLIENT_ID = 'auth0ClientID'; // provided as cloudflare secret;

describe('Auth0 Helper', () => {
  it('should generate a login url', () => {
    const helper = new Auth0Helper(AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET);
    const challenge = 'AChallengeString';
    const loginUrl = helper.authLoginUrl(challenge);
    expect(loginUrl).toEqual(
      'https://staging-saladsimulator.au.auth0.com/authorize?response_type=code&client_id=auth0ClientID&redirect_uri=https%3A%2F%2Fstage.saladsimulator.com%2Fauth%2Fcallback&audience=saladsimulator-staging&scope=openid+profile&state=static+state&code_challenge=AChallengeString&code=S256',
    );
  });
});
