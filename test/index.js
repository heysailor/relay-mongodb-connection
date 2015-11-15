import { assert, expect } from 'chai';
import { base64, unbase64 } from '../index';

describe('connectionFromArray()', () => {
  describe('basic slicing', () => {
    it('returns all elements without filters', () => {
      assert(false, 'Not yet implemented');
    });

    it('respects a smaller first', () => {
      assert(false, 'Not yet implemented');
    });

    it('respects an overly large first', () => {
      assert(false, 'Not yet implemented');
    });

    it('respects a smaller last', () => {
      assert(false, 'Not yet implemented');
    });

    it('respects an overly large last', () => {
      assert(false, 'Not yet implemented');
    });
  });

  describe('pagination', () => {
    it('respects first and after', () => {
      assert(false, 'Not yet implemented');
    });

    it('respects first and after with long first', () => {
      assert(false, 'Not yet implemented');
    });

    it('respects last and before', () => {
      assert(false, 'Not yet implemented');
    });

    it('respects last and before with long last', () => {
      assert(false, 'Not yet implemented');
    });

    it('respects first and after and before, too few', () => {
      assert(false, 'Not yet implemented');
    });

    it('respects first and after and before, too many', () => {
      assert(false, 'Not yet implemented');
    });

    it('respects first and after and before, exactly right', () => {
      assert(false, 'Not yet implemented');
    });

    it('respects last and after and before, too few', () => {
      assert(false, 'Not yet implemented');
    });

    it('respects last and after and before, too many', () => {
      assert(false, 'Not yet implemented');
    });

    it('respects last and after and before, exactly right', () => {
      assert(false, 'Not yet implemented');
    });
  });

  describe('cursor edge cases', () => {
    it('returns no elements if first is 0', () => {
      assert(false, 'Not yet implemented');
    });

    it('returns all elements if cursors are invalid', () => {
      assert(false, 'Not yet implemented');
    });

    it('returns all elements if cursors are on the outside', () => {
      assert(false, 'Not yet implemented');
    });

    it('returns no elements if cursors cross', () => {
      assert(false, 'Not yet implemented');
    });
  });

  describe('cursorForObjectInConnection()', () => {
    it('returns an edge\'s cursor, given a mongodb cursor and a member object', () => {
      assert(false, 'Not yet implemented');
    });

    it('returns null, given an array and a non-member object', () => {
      assert(false, 'Not yet implemented');
    });
  });
});

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
