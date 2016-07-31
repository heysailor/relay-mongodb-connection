var expect = require('chai').expect;
var utils = require('../src/utils');
var base64 = utils.base64;
var unbase64 = utils.unbase64;

describe('base64()', function() {
  it('converts ascii to base64', function() {
    expect(base64('sunny weather')).to.equal('c3Vubnkgd2VhdGhlcg==');
  });
});

describe('unbase64()', function() {
  it('converts base64 to ascii', function() {
    expect(unbase64('c3Vubnkgd2VhdGhlcg==')).to.equal('sunny weather');
  });
});
