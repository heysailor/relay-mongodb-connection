var chai = require('chai');
chai.use(require("chai-as-promised"));
var expect = chai.expect;
var connectionFromMongooseAggregate = require('../src/connectionFromMongooseAggregate');
var connectMongoose = require('./db').connectMongoose;
var mongoose =  require('mongoose');

var SCHEMA = new mongoose.Schema({
  letter: String,
  _id: String,
});

var MODEL = mongoose.model('aggr_letter', SCHEMA);

describe('connectionFromMongooseAggregate()', function () {
  var connection;
  var findAll;

  before(function (done) {
    connection = connectMongoose();
    connection.once('error', done);

    MODEL.insertMany(
      ['A', 'B', 'C', 'D', 'E'].map(letter => ({ letter, _id: `letter_${letter}` }))
    ).then(function() { 
      done() 
    }).catch(done);
    
  });

  beforeEach(function () {
    findAll = MODEL.aggregate([
      { $match: {} }
    ]);
  });

  after(function (done) {
    MODEL.remove({}).then(function () {
      connection.close();
      done();
    });
  });

  describe('basic slicing', function () {
    it('returns all elements without filters', function () {
      return expect(connectionFromMongooseAggregate(findAll)).to.eventually.deep.equal({
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

    it('respects a smaller first', function () {
      return expect(connectionFromMongooseAggregate(findAll, { first: 2 })).to.eventually.deep.equal({
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

    it('respects an overly large first', function () {
      return expect(connectionFromMongooseAggregate(findAll, { first: 10 })).to.eventually.deep.equal({
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

    it('respects a smaller last', function () {
      return expect(connectionFromMongooseAggregate(findAll, { last: 2 })).to.eventually.deep.equal({
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

    it('respects an overly large last', function () {
      return expect(connectionFromMongooseAggregate(findAll, { last: 10 })).to.eventually.deep.equal({
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

  describe('pagination', function () {
    it('respects first and after', function () {
      return expect(connectionFromMongooseAggregate(findAll, {
        first: 2, after: 'bW9uZ29kYmNvbm5lY3Rpb246MQ==',
      })).to.eventually.deep.equal({
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

    it('respects first and after with long first', function () {
      return expect(connectionFromMongooseAggregate(findAll, {
        first: 10, after: 'bW9uZ29kYmNvbm5lY3Rpb246MQ==',
      })).to.eventually.deep.equal({
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

    it('respects last and before', function () {
      return expect(connectionFromMongooseAggregate(findAll, {
        last: 2, before: 'bW9uZ29kYmNvbm5lY3Rpb246Mw==',
      })).to.eventually.deep.equal({
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

    it('respects last and before with long last', function () {
      return expect(connectionFromMongooseAggregate(findAll, {
        last: 10, before: 'bW9uZ29kYmNvbm5lY3Rpb246Mw==',
      })).to.eventually.deep.equal({
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

    it('respects first and after and before, too few', function () {
      return expect(connectionFromMongooseAggregate(findAll, {
        first: 2,
        after: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
        before: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
      })).to.eventually.deep.equal({
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

    it('respects first and after and before, too many', function () {
      return expect(connectionFromMongooseAggregate(findAll, {
        first: 4,
        after: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
        before: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
      })).to.eventually.deep.equal({
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

    it('respects first and after and before, exactly right', function () {
      return expect(connectionFromMongooseAggregate(findAll, {
        first: 3,
        after: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
        before: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
      })).to.eventually.deep.equal({
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

    it('respects last and after and before, too few', function () {
      return expect(connectionFromMongooseAggregate(findAll, {
        last: 2,
        after: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
        before: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
      })).to.eventually.deep.equal({
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

    it('respects last and after and before, too many', function () {
      return expect(connectionFromMongooseAggregate(findAll, {
        last: 4, // different from graphql-relay-js
        after: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
        before: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
      })).to.eventually.deep.equal({
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

    it('respects last and after and before, exactly right', function () {
      return expect(connectionFromMongooseAggregate(findAll, {
        last: 3,
        after: 'bW9uZ29kYmNvbm5lY3Rpb246MA==',
        before: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
      })).to.eventually.deep.equal({
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

  describe('cursor edge cases', function () {
    it('returns no elements if first is 0', function () {
      return expect(connectionFromMongooseAggregate(findAll, { first: 0 })).to.eventually.deep.equal({
        edges: [],
        pageInfo: {
          startCursor: null,
          endCursor: null,
          hasPreviousPage: false,
          hasNextPage: true,
        },
      });
    });

    it('returns all elements if cursors are invalid', function () {
      return expect(connectionFromMongooseAggregate(findAll, {
        before: 'invalid',
        after: 'invalid',
      })).to.eventually.deep.equal({
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

    it('returns all elements if cursors are on the outside', function () {
      return expect(connectionFromMongooseAggregate(findAll, {
        before: 'bW9uZ29kYmNvbm5lY3Rpb246Ng==',
        after: 'bW9uZ29kYmNvbm5lY3Rpb246LTE=',
      })).to.eventually.deep.equal({
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

    it('returns no elements if cursors cross', function () {
      return expect(connectionFromMongooseAggregate(findAll, {
        before: 'bW9uZ29kYmNvbm5lY3Rpb246Mg==',
        after: 'bW9uZ29kYmNvbm5lY3Rpb246NA==',
      })).to.eventually.deep.equal({
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

  describe('mapping', function () {
    it('uses mapper function if supplied', function () {
      var mapper = function (doc) {
        return Object.assign({}, doc, {
          number: doc.letter.charCodeAt(0),
        });
      };
      return expect(connectionFromMongooseAggregate(findAll, {}, mapper)).to.eventually.deep.equal({
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

  // describe('cursorForObjectInConnection()', function () {
  //   it('returns an edge\'s cursor, given a mongodb cursor and a member object', function () {
  //     // const letterBCursor = cursorForObjectInConnection(l)
  //   });
  //
  //   it('returns null, given an array and a non-member object', function () {
  //     assert(false, 'Not yet implemented');
  //   });
  // });
});
