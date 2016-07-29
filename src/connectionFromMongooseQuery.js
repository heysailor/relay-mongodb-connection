var utils = require('./utils');
var getOffsetsFromArgs = utils.getOffsetsFromArgs;
var getConnectionFromSlice = utils.getConnectionFromSlice;

module.exports = exports = function connectionFromMongooseQuery(query, args, mapper) {
  args = args === undefined ? {} : args;
  var mongooseQuery = query;
  return new Promise(function (resolve, reject) {
    mongooseQuery.count(function (err, count) {
      /* istanbul ignore if  */
      if (err) {
        return reject(err);
      }

      var mongoPaginationArgs = getOffsetsFromArgs(args, count);
      var skip = mongoPaginationArgs.skip;
      var limit = mongoPaginationArgs.limit;

      mongooseQuery.skip(skip);
      mongooseQuery.limit(limit);

      // Convert all Mongoose documents to objects
      mongooseQuery.lean();
      
      if(limit === 0) {
        return resolve(getConnectionFromSlice([], mapper, args, count));
      }
      
      mongooseQuery.find(function (err, slice) {
        /* istanbul ignore if  */
        if (err) {
          return reject(err);
        }
        return resolve(getConnectionFromSlice(slice, mapper, args, count));
      });
    });
  });
};
