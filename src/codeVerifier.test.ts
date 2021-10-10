import { generateChallenge } from './codeVerifier';
describe(generateChallenge, () => {
  it('Should generate a code challenge', async () => {
    const challenge = await generateChallenge('inputstring');
    expect(challenge).toEqual('a value');
  });
});
