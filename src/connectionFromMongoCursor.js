var utils = require('./utils');
var getOffsetsFromArgs = utils.getOffsetsFromArgs;
var getConnectionFromSlice = utils.getConnectionFromSlice;

/**
 * Accepts a mongodb cursor and connection arguments, and returns a connection
 * object for use in GraphQL. It uses array offsets as pagination, so pagiantion
 * will work only if the data set is satic.
 */
module.exports = exports = function connectionFromMongoCursor(inMongoCursor, args, mapper) {
  args = args === undefined ? {} : args;
  var mongodbCursor = inMongoCursor.clone();
  return new Promise(function (resolve, reject) {
    mongodbCursor.count(function (err, count) {
      /* istanbul ignore if  */
      if (err) {
        return reject(err);
      }
      
      var mongoPaginationArgs = getOffsetsFromArgs(args, count);
      var skip = mongoPaginationArgs.skip;
      var limit = mongoPaginationArgs.limit;
    
      // If supplied slice is too large, trim it down before mapping over it.
      mongodbCursor.skip(skip);
      mongodbCursor.limit(limit);
      
      // Short circuit if limit is 0; in that case, mongodb doesn't limit at all    
      if(limit === 0) {
        return resolve(getConnectionFromSlice([], mapper, args, count));
      }
      
      mongodbCursor.toArray(function (err, slice) {
        /* istanbul ignore if  */
        if (err) {
          return reject(err);
        }
        return resolve(getConnectionFromSlice(slice, mapper, args, count));
      });
    });
  });
}
