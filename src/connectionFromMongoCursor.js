'use strict';

var utils = require('./utils');
var getOffsetsFromArgs = utils.getOffsetsFromArgs;
var getConnectionFromSlice = utils.getConnectionFromSlice;

/**
 * Accepts a mongodb cursor and connection arguments, and returns a connection
 * object for use in GraphQL. It uses array offsets as pagination, so pagiantion
 * will work only if the data set is satic.
 */
module.exports = exports = function connectionFromMongoCursor(inMongoCursor, inArgs, mapper) {
  var args = inArgs || {};
  var mongodbCursor = inMongoCursor.clone();

  return mongodbCursor.count()
    .then(function countPromise(count) {
      var pagination = getOffsetsFromArgs(args, count);

      // If the supplied slice is too large, trim it down before mapping over it
      mongodbCursor.skip(pagination.skip);
      mongodbCursor.limit(pagination.limit);

      // Short circuit if limit is 0; in that case, mongodb doesn't limit at all
      if (pagination.limit === 0) {
        return getConnectionFromSlice([], mapper, args, count);
      }

      return mongodbCursor.toArray().then(function fromSlice(slice) {
        return getConnectionFromSlice(slice, mapper, args, count);
      });
    });
}
