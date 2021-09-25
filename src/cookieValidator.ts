export async function verifyAuth(token: string): Promise<boolean> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }
  const head = atob(parts[0]);
  const body = atob(parts[1]);
  JSON.parse(head);
  JSON.parse(body);
  return true;
}

// // import jwksClient from 'jwks-rsa';
// import jwt from 'jsonwebtoken';

// const jwksUrl =
//   'https://staging-saladsimulator.au.auth0.com/.well-known/jwks.json';
// // const client = jwksClient({
// //   jwksUri: 'https://staging-saladsimulator.au.auth0.com/.well-known/jwks.json',
// //   requestHeaders: {}, // Optional
// //   timeout: 30000, // Defaults to 30s
// //   cacheMaxAge: 600000,
// // });

// export async function verifyAuth(cookieValue: string): Promise<boolean> {
//   function getKey(
//     header: jwt.JwtHeader,
//     callback: (error: null | Error, key: string | undefined) => void,
//   ) {
//     client.getSigningKey(
//       header.kid,
//       function (
//         err: Error | null,
//         key: Partial<jwksClient.RsaSigningKey & jwksClient.CertSigningKey>,
//       ) {
//         const signingKey = key.publicKey || key.rsaPublicKey;
//         callback(null, signingKey);
//       },
//     );
//   }

//   return new Promise<boolean>((resolve, reject) => {
//     jwt.verify(
//       cookieValue,
//       getKey,
//       {
//         algorithms: ['RS256'],
//         issuer: [
//           'staging-saladsimulator.au.auth0.com',
//           'https://staging-saladsimulator.au.auth0.com',
//         ],
//       },
//       function (err, decoded) {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(Boolean(decoded));
//         }
//       },
//     );
//   });
// }
