export function str2Uin8Array(str: string): Uint8Array {
  console.log('converting string: ' + str);
  // const a = new TextEncoder().encode(str);
  // console.log(a.length);
  // return a;
  const buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  const bufView = new Uint8Array(buf);

  console.log('created buffer');

  for (let i = 0, strLen = bufView.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  console.log('Added all to buffer length', buf.byteLength);
  return bufView;
}

export function ab2str(buffer: ArrayBuffer): string {
  // try {
  //   console.log('about to decode buffer');
  //   return new TextDecoder('utf-8').decode(buffer);
  // } catch (e) {
  //   console.log(`Error decoding buffer`, e);
  //   // throw e;
  //   return 'FailedToDecode';
  // }

  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}
