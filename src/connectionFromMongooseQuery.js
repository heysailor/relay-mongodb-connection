import {
  getOffsetsFromArgs,
  getConnectionFromSlice
} from './utils';

export default async function connectionFromMongooseQuery(query, args = {}, mapper) {
  const mongooseQuery = query;
  const count = await mongooseQuery.count();

  const offsets = getOffsetsFromArgs(args, count);
  const {
    skip,
    limit
  } = offsets;

  mongooseQuery.skip(skip);
  mongooseQuery.limit(limit);

  let slice;
  if (limit === 0) {
    slice = [];
  }
  else {
    const res = await mongooseQuery.find();
    slice = res;
  }

  // Convert all Mongoose documents to objects;
  slice = slice.map(d => d.toObject());

  return getConnectionFromSlice(slice, mapper, args, count);
}
