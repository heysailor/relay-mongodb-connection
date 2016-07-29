var utils = require('./utils');
var getOffsetsFromArgs = utils.getOffsetsFromArgs;
var getConnectionFromSlice = utils.getConnectionFromSlice;

var cloneAggregation = function cloneAggregation(aggr) {
  /* eslint-disable no-underscore-dangle */
  var model = aggr._model.model(aggr._model.modelName);
  return model.aggregate(aggr._pipeline);
  /* eslint-enable no-underscore-dangle */
}

module.exports = exports = function connectionFromMongooseAggregate(aggr, args, mapper) {
  args = args === undefined ? {} : args;
  var mongooseAggr = cloneAggregation(aggr);
  var countAggr = cloneAggregation(aggr);
  
  return new Promise(function (resolve, reject) {
    countAggr
      .group({ _id: null, count: { $sum: 1 } })
      .exec(function (err, countArr) {
        /* istanbul ignore if  */
        if (err) {
          return reject(err);
        }

        var count = countArr.length > 0 && countArr[0].count ? countArr[0].count : 0;

        var mongoPaginationArgs = getOffsetsFromArgs(args, count);
        var skip = mongoPaginationArgs.skip;
        var limit = mongoPaginationArgs.limit;

        if (limit <= 0) {
          return resolve(getConnectionFromSlice([], mapper, args, count));
        }

        mongooseAggr.skip(skip);
        mongooseAggr.limit(limit);
        mongooseAggr.exec(function (err, slice) {
          /* istanbul ignore if  */
          if (err) {
            return reject(err);
          }
          return resolve(getConnectionFromSlice(slice, mapper, args, count));
        })
    });
  });
};
