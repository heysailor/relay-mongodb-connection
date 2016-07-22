import { expect } from 'chai';
import { base64, unbase64 } from '../src/utils';

describe('base64()', () => {
  it('converts ascii to base64', () => {
    expect(base64('sunny weather')).to.equal('c3Vubnkgd2VhdGhlcg==');
  });
});

describe('unbase64()', () => {
  it('converts base64 to ascii', () => {
    expect(unbase64('c3Vubnkgd2VhdGhlcg==')).to.equal('sunny weather');
  });
});
