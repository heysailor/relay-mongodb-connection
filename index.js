export const base64 = (str) => (new Buffer(str, 'ascii')).toString('base64');
export const unbase64 = (b64) => (new Buffer(b64, 'base64')).toString('ascii');
