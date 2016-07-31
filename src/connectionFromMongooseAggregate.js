'use strict';

var utils = require('./utils');
var getOffsetsFromArgs = utils.getOffsetsFromArgs;
var getConnectionFromSlice = utils.getConnectionFromSlice;

function cloneAggregation(aggr) {
  /* eslint-disable no-underscore-dangle */
  var model = aggr._model.model(aggr._model.modelName);
  return model.aggregate(aggr._pipeline);
  /* eslint-enable no-underscore-dangle */
}

function connectionFromMongooseAggregate(aggr, inArgs, mapper) {
  var args = inArgs || {};
  var mongooseAggr = cloneAggregation(aggr);
  var countAggr = cloneAggregation(aggr);

  return countAggr
    .group({ _id: null, count: { $sum: 1 } })
    .exec()
    .then(function countPromise(countArr) {
      var count = countArr.length > 0 && countArr[0].count ? countArr[0].count : 0;
      var pagination = getOffsetsFromArgs(args, count);

      if (pagination.limit <= 0) {
        return getConnectionFromSlice([], mapper, args, count);
      }

      mongooseAggr.skip(pagination.skip);
      mongooseAggr.limit(pagination.limit);

      return mongooseAggr.exec()
        .then(function fromSlice(slice) {
          return getConnectionFromSlice(slice, mapper, args, count);
        });
    });
}

module.exports = connectionFromMongooseAggregate;
