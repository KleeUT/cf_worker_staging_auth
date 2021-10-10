import { str2Uin8Array, ab2str } from './ArrayBufferHelpers';
// import crypto from 'crypto';
describe('Array buffer helpers', () => {
  it('should return the same string after converting and de-converting', () => {
    const sampleString = 'a sample string';
    const ab = str2Uin8Array(sampleString);
    const outputStr = ab2str(ab);

    // expect(ab.byteLength).toEqual(15);
    expect(outputStr.split('').length).toEqual(sampleString.split('').length);
    expect(outputStr).toEqual(sampleString);
    expect(outputStr == sampleString).toBeTruthy();
  });
});
