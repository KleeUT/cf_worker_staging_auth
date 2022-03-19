export {};
declare global {
  // config
  const AUTH0_CLIENT_SECRET: string; // provided as cloudflare secret;
  const AUTH0_CLIENT_ID: string; // provided as cloudflare variable in wranger.toml;
  const BASE_URL: string;
  const AUTH0_BASE_URL: string;
  const AUTH0_API_AUDIENCE: string;
  // KV namespaces
  const AUTH_STORE: KVNamespace; // comes from the Workers environment
}
