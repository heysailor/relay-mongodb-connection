import test from 'ava';
import { connectionFromMongooseAggregate } from '../src';
import mongoose from 'mongoose';

const SCHEMA = new mongoose.Schema({
    letter: String,
    _id: String,
}, {
    versionKey: false
});

const MODEL = mongoose.model('aggr_letter', SCHEMA);

let db;
let findAll;

test.before(async () => {
  mongoose.Promise = global.Promise;
  await mongoose.connect(process.env.MONGO_URL);
  db = mongoose.connection;

  await MODEL.insertMany(
    ['A', 'B', 'C', 'D', 'E'].map(l => ({ letter: l, _id: `letter_${l}` }))
  );
});

test.beforeEach(() => findAll = MODEL.aggregate([
  { $match: {} },
]));

test.after.always(async () => {
  await MODEL.remove({});
  db.close();
});

async function resultEqual(t, args, expected) {
  const c = await connectionFromMongooseAggregate(findAll, ...args);
  t.deepEqual(c, expected);
}

test('returns all elements without filters', resultEqual, [], {
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

test('respects a smaller first', resultEqual, [{ first:  2 }], {
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

test('respects an overly large first', resultEqual, [{ first: 10 }], {
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

test('respects a smaller last', resultEqual, [{ last: 2 }], {
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

test('respects an overly large last', resultEqual, [{ last: 10 }], {
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

test('respects first and after', resultEqual, [{
  first: 2, after: 'bW9uZ29kYmNvbm5lY3Rpb246MQ==',
}], {
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

test('respects first and after with long first', resultEqual, [{
  first: 10, after: 'bW9uZ29kYmNvbm5lY3Rpb246MQ==',
}], {
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

test('respects last and before', resultEqual, [{
  last: 2, before: 'bW9uZ29kYmNvbm5lY3Rpb246Mw==',
}], {
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

test('respects last and before with long last', resultEqual, [{
  last: 10, before: 'bW9uZ29kYmNvbm5lY3Rpb246Mw==',
}], {
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

test('respects first and after and before, too few', resultEqual, [{
  first: 2,
  after: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
  before: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
}], {
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

test('respects first and after and before, too many', resultEqual, [{
  first: 4,
  after: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
  before: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
}], {
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

test('respects first and after and before, exactly right', resultEqual, [{
  first: 3,
  after: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
  before: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
}], {
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

test('respects last and after and before, too few', resultEqual, [{
  last: 2,
  after: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
  before: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
}], {
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

test('respects last and after and before, too many', resultEqual, [{
  last: 4, // different from graphql-relay-js
  after: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
  before: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
}], {
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

test('respects last and after and before, exactly right', resultEqual, [{
  last: 3,
  after: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
  before: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
}], {
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

test('returns no elements if first is 0', resultEqual, [{
  first: 0
}], {
  edges: [],
  pageInfo: {
    startCursor: null,
    endCursor: null,
    hasPreviousPage: false,
    hasNextPage: true,
  },
});

test('returns all elements if cursors are invalid', resultEqual, [{
  before: 'invalid',
  after: 'invalid',
}], {
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

test('returns all elements if cursors are on the outside', resultEqual, [{
  before: 'bW9uZ29kYmNvbm5lY3Rpb246Ng==',
  after: 'bW9uZ29kYmNvbm5lY3Rpb246LTE=',
}], {
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

test('returns no elements if cursors cross', resultEqual, [{
  before: 'bW9uZ29kYmNvbm5lY3Rpb246Mg==',
  after: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
}], {
  edges: [],
  pageInfo: {
    startCursor: null,
    endCursor: null,
    hasPreviousPage: false,
    hasNextPage: false,
  },
});

test('uses mapper function if supplied', resultEqual, [
  {}, doc => ({ ...doc, number: doc.letter.charCodeAt(0) })
], {
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
