import { expect } from 'chai';
import { connectionFromMongooseQuery } from '../index';
import { connectMongoose } from './db';
import mongoose from 'mongoose';

const SCHEMA = new mongoose.Schema({
  letter: String,
  _id: String,
});

const MODEL = mongoose.model('letter', SCHEMA);

describe('connectionFromMongooseQuery()', () => {
  let db;
  let findAll;

  before(async (done) => {
    try {
      db = await connectMongoose();
    } catch (e) {
      done(e);
    }

    await MODEL.insertMany(
      ['A', 'B', 'C', 'D', 'E'].map(letter => ({ letter, _id: `letter_${letter}` }))
    );

    done();
  });

  beforeEach(() => {
    findAll = MODEL.find({});
  });

  after(async () => {
    await MODEL.remove({});
    db.close();
  });

  describe('basic slicing', () => {
    it('returns all elements without filters', async () => {
      const c = await connectionFromMongooseQuery(findAll);

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
      const c = await connectionFromMongooseQuery(findAll, { first: 2 });

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
      const c = await connectionFromMongooseQuery(findAll, { first: 10 });

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
      const c = await connectionFromMongooseQuery(findAll, { last: 2 });

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
      const c = await connectionFromMongooseQuery(findAll, { last: 10 });

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
      const c = await connectionFromMongooseQuery(findAll, {
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

    it('respects first and after with long first', async () => {
      const c = await connectionFromMongooseQuery(findAll, {
        first: 10, after: 'bW9uZ29kYmNvbm5lY3Rpb246MQ==',
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
          {
            node: { letter: 'E', _id: 'letter_E' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
          },
        ],
        pageInfo: {
          startCursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mg==',
          endCursor: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
          hasPreviousPage: false,
          hasNextPage: false,
        },
      });
    });

    it('respects last and before', async () => {
      const c = await connectionFromMongooseQuery(findAll, {
        last: 2, before: 'bW9uZ29kYmNvbm5lY3Rpb246Mw==',
      });

      expect(c).to.deep.equal({
        edges: [
          {
            node: { letter: 'B', _id: 'letter_B' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246MQ==',
          },
          {
            node: { letter: 'C', _id: 'letter_C' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mg==',
          },
        ],
        pageInfo: {
          startCursor: 'bW9uZ29kYmNvbm5lY3Rpb246MQ==',
          endCursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mg==',
          hasPreviousPage: true,
          hasNextPage: false,
        },
      });
    });

    it('respects last and before with long last', async () => {
      const c = await connectionFromMongooseQuery(findAll, {
        last: 10, before: 'bW9uZ29kYmNvbm5lY3Rpb246Mw==',
      });

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
        ],
        pageInfo: {
          startCursor: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
          endCursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mg==',
          hasPreviousPage: false,
          hasNextPage: false,
        },
      });
    });

    it('respects first and after and before, too few', async () => {
      const c = await connectionFromMongooseQuery(findAll, {
        first: 2,
        after: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
        before: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
      });

      expect(c).to.deep.equal({
        edges: [
          {
            node: { letter: 'B', _id: 'letter_B' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246MQ==',
          },
          {
            node: { letter: 'C', _id: 'letter_C' },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mg==',
          },
        ],
        pageInfo: {
          startCursor: 'bW9uZ29kYmNvbm5lY3Rpb246MQ==',
          endCursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mg==',
          hasPreviousPage: false,
          hasNextPage: true,
        },
      });
    });

    it('respects first and after and before, too many', async () => {
      const c = await connectionFromMongooseQuery(findAll, {
        first: 4,
        after: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
        before: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
      });

      expect(c).to.deep.equal({
        edges: [
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
        ],
        pageInfo: {
          startCursor: 'bW9uZ29kYmNvbm5lY3Rpb246MQ==',
          endCursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mw==',
          hasPreviousPage: false,
          hasNextPage: false,
        },
      });
    });

    it('respects first and after and before, exactly right', async () => {
      const c = await connectionFromMongooseQuery(findAll, {
        first: 3,
        after: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
        before: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
      });

      expect(c).to.deep.equal({
        edges: [
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
        ],
        pageInfo: {
          startCursor: 'bW9uZ29kYmNvbm5lY3Rpb246MQ==',
          endCursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mw==',
          hasPreviousPage: false,
          hasNextPage: false,
        },
      });
    });

    it('respects last and after and before, too few', async () => {
      const c = await connectionFromMongooseQuery(findAll, {
        last: 2,
        after: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
        before: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
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
          hasPreviousPage: true,
          hasNextPage: false,
        },
      });
    });

    it('respects last and after and before, too many', async () => {
      const c = await connectionFromMongooseQuery(findAll, {
        last: 4, // different from graphql-relay-js
        after: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
        before: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
      });

      expect(c).to.deep.equal({
        edges: [
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
        ],
        pageInfo: {
          startCursor: 'bW9uZ29kYmNvbm5lY3Rpb246MQ==',
          endCursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mw==',
          hasPreviousPage: false,
          hasNextPage: false,
        },
      });
    });

    it('respects last and after and before, exactly right', async () => {
      const c = await connectionFromMongooseQuery(findAll, {
        last: 3,
        after: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
        before: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
      });

      expect(c).to.deep.equal({
        edges: [
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
        ],
        pageInfo: {
          startCursor: 'bW9uZ29kYmNvbm5lY3Rpb246MQ==',
          endCursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mw==',
          hasPreviousPage: false,
          hasNextPage: false,
        },
      });
    });
  });

  describe('cursor edge cases', () => {
    it('returns no elements if first is 0', async () => {
      const c = await connectionFromMongooseQuery(findAll, { first: 0 });

      expect(c).to.deep.equal({
        edges: [],
        pageInfo: {
          startCursor: null,
          endCursor: null,
          hasPreviousPage: false,
          hasNextPage: true,
        },
      });
    });

    it('returns all elements if cursors are invalid', async () => {
      const c = await connectionFromMongooseQuery(findAll, {
        before: 'invalid',
        after: 'invalid',
      });

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

    it('returns all elements if cursors are on the outside', async () => {
      const c = await connectionFromMongooseQuery(findAll, {
        before: 'bW9uZ29kYmNvbm5lY3Rpb246Ng==',
        after: 'bW9uZ29kYmNvbm5lY3Rpb246LTE=',
      });

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

    it('returns no elements if cursors cross', async () => {
      const c = await connectionFromMongooseQuery(findAll, {
        before: 'bW9uZ29kYmNvbm5lY3Rpb246Mg==',
        after: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
      });

      expect(c).to.deep.equal({
        edges: [],
        pageInfo: {
          startCursor: null,
          endCursor: null,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      });
    });
  });

  describe('mapping', () => {
    it('uses mapper function if supplied', async () => {
      const mapper = (doc) => Object.assign({}, doc, {
        number: doc.letter.charCodeAt(0),
      });
      const c = await connectionFromMongooseQuery(findAll, {}, mapper);
      expect(c).to.deep.equal({
        edges: [
          {
            node: { letter: 'A', _id: 'letter_A', number: 65 },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
          },
          {
            node: { letter: 'B', _id: 'letter_B', number: 66 },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246MQ==',
          },
          {
            node: { letter: 'C', _id: 'letter_C', number: 67 },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mg==',
          },
          {
            node: { letter: 'D', _id: 'letter_D', number: 68 },
            cursor: 'bW9uZ29kYmNvbm5lY3Rpb246Mw==',
          },
          {
            node: { letter: 'E', _id: 'letter_E', number: 69 },
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

  // describe('cursorForObjectInConnection()', () => {
  //   it('returns an edge\'s cursor, given a mongodb cursor and a member object', () => {
  //     // const letterBCursor = cursorForObjectInConnection(l)
  //   });
  //
  //   it('returns null, given an array and a non-member object', () => {
  //     assert(false, 'Not yet implemented');
  //   });
  // });
});
