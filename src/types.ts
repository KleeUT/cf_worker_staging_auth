export type JWT = {
  head: TokenHead;
  body: IdentityTokenBody;
  signature: string;
};

export type TokenHead = {
  alg: string;
  typ: string;
  kid: string;
};

export type IdentityTokenBody = {
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
};
