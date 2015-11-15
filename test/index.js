import { assert, expect } from 'chai';
import { base64, unbase64, connectionFromMongo } from '../index';
import { connect } from './db';

const COL = 'letters';

describe('connectionFromArray()', () => {
  let db;
  let findAll;

  before(async (done) => {
    try {
      db = await connect();
    } catch (e) {
      done(e);
    }

    await db.collection(COL).drop();
    await db.collection(COL).insertMany(
      ['A', 'B', 'C', 'D', 'E'].map(letter => ({ letter, _id: `letter_${letter}` }))
    );

    done();
  });

  beforeEach(() => {
    findAll = db.collection(COL).find({});
  });

  after(() => {
    db.close();
  });

  describe('basic slicing', () => {
    it('returns all elements without filters', async () => {
      const c = await connectionFromMongo(findAll);
      expect(c).to.deep.equal({
        edges: [
          {
            node: { letter: 'A', _id: 'letter_A' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
          },
          {
            node: { letter: 'B', _id: 'letter_B' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246MQ==',
          },
          {
            node: { letter: 'C', _id: 'letter_C' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mg==',
          },
          {
            node: { letter: 'D', _id: 'letter_D' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mw==',
          },
          {
            node: { letter: 'E', _id: 'letter_E' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
          },
        ],
        pageInfo: {
          startCursor: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
          endCursor: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
          hasPreviousPage: false,
          hasNextPage: false,
        },
      });
    });

    it('respects a smaller first', async () => {
      const c = await connectionFromMongo(findAll, { first: 2 });
      expect(c).to.deep.equal({
        edges: [
          {
            node: { letter: 'A', _id: 'letter_A' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
          },
          {
            node: { letter: 'B', _id: 'letter_B' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246MQ==',
          },
        ],
        pageInfo: {
          startCursor: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
          endCursor: 'bW9uZ29kYmNvbm5lY3Rpb246MQ==',
          hasPreviousPage: false,
          hasNextPage: true,
        },
      });
    });

    it('respects an overly large first', async () => {
      const c = await connectionFromMongo(findAll, { first: 10 });
      expect(c).to.deep.equal({
        edges: [
          {
            node: { letter: 'A', _id: 'letter_A' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
          },
          {
            node: { letter: 'B', _id: 'letter_B' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246MQ==',
          },
          {
            node: { letter: 'C', _id: 'letter_C' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mg==',
          },
          {
            node: { letter: 'D', _id: 'letter_D' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mw==',
          },
          {
            node: { letter: 'E', _id: 'letter_E' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
          },
        ],
        pageInfo: {
          startCursor: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
          endCursor: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
          hasPreviousPage: false,
          hasNextPage: false,
        },
      });
    });

    it('respects a smaller last', async () => {
      const c = await connectionFromMongo(findAll, { last: 2 });
      expect(c).to.deep.equal({
        edges: [
          {
            node: { letter: 'D', _id: 'letter_D' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mw==',
          },
          {
            node: { letter: 'E', _id: 'letter_E' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
          },
        ],
        pageInfo: {
          startCursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mw==',
          endCursor: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
          hasPreviousPage: true,
          hasNextPage: false,
        },
      });
    });

    it('respects an overly large last', async () => {
      const c = await connectionFromMongo(findAll, { last: 10 });
      expect(c).to.deep.equal({
        edges: [
          {
            node: { letter: 'A', _id: 'letter_A' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
          },
          {
            node: { letter: 'B', _id: 'letter_B' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246MQ==',
          },
          {
            node: { letter: 'C', _id: 'letter_C' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mg==',
          },
          {
            node: { letter: 'D', _id: 'letter_D' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mw==',
          },
          {
            node: { letter: 'E', _id: 'letter_E' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
          },
        ],
        pageInfo: {
          startCursor: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
          endCursor: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
          hasPreviousPage: false,
          hasNextPage: false,
        },
      });
    });
  });

  describe('pagination', () => {
    it('respects first and after', async () => {
      const c = await connectionFromMongo(findAll, {
        first: 2, after: 'bW9uZ29kYmNvbm5lY3Rpb246MQ==',
      });
      expect(c).to.deep.equal({
        edges: [
          {
            node: { letter: 'C', _id: 'letter_C' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mg==',
          },
          {
            node: { letter: 'D', _id: 'letter_D' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mw==',
          },
        ],
        pageInfo: {
          startCursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mg==',
          endCursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mw==',
          hasPreviousPage: false,
          hasNextPage: true,
        },
      });
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
