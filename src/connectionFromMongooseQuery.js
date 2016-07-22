import {
  getOffsetsFromArgs,
  getConnectionFromSlice
} from './utils';

export default async function connectionFromMongooseQuery(query, args = {}, mapper) {
  const mongooseQuery = query;
  const count = await mongooseQuery.count();

  const { skip, limit } = getOffsetsFromArgs(args, count);

  mongooseQuery.skip(skip);
  mongooseQuery.limit(limit);

  // Convert all Mongoose documents to objects
  mongooseQuery.lean();

  let slice;
  if (limit === 0) {
    slice = [];
  }
  else {
    const res = await mongooseQuery.find();
    slice = res;
  }

  return getConnectionFromSlice(slice, mapper, args, count);
}
