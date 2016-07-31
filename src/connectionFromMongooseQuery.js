'use strict';

var utils = require('./utils');
var getOffsetsFromArgs = utils.getOffsetsFromArgs;
var getConnectionFromSlice = utils.getConnectionFromSlice;

function connectionFromMongooseQuery(query, inArgs, mapper) {
  var args = inArgs || {};
  var mongooseQuery = query;

  return mongooseQuery.count()
    .then(function countPromise(count) {
      var pagination = getOffsetsFromArgs(args, count);

      if (pagination.limit === 0) {
        return getConnectionFromSlice([], mapper, args, count);
      }

      mongooseQuery.skip(pagination.skip);
      mongooseQuery.limit(pagination.limit);

      // Convert all Mongoose documents to objects
      mongooseQuery.lean();

      return mongooseQuery.find().then(function fromSlice(slice) {
        return getConnectionFromSlice(slice, mapper, args, count);
      });
    });
}

module.exports = connectionFromMongooseQuery;
