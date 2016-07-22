import {
  getOffsetsFromArgs,
  getConnectionFromSlice
} from './utils';

function cloneAggregation(aggr) {
  /* eslint-disable no-underscore-dangle */
  const model = aggr._model.model(aggr._model.modelName);
  return model.aggregate(aggr._pipeline);
  /* eslint-enable no-underscore-dangle */
}

export default async function connectionFromMongooseAggregate(aggr, args = {}, mapper) {
  const mongooseAggr = cloneAggregation(aggr);
  const countAggr = cloneAggregation(aggr);

  const countArr = await countAggr.group({ _id: null, count: { $sum: 1 } });
  const count = countArr.length > 0 && countArr[0].count ? countArr[0].count : 0;

  const { skip, limit } = getOffsetsFromArgs(args, count);

  /*
   * Mongoose Aggregate doesn't accept negative limit as well as Query
   */
  if (limit <= 0) {
    return getConnectionFromSlice([], mapper, args, count);
  }

  mongooseAggr.skip(skip);
  mongooseAggr.limit(limit);

  const slice = await mongooseAggr.exec();

  return getConnectionFromSlice(slice, mapper, args, count);
}
