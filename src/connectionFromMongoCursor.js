import {
  getOffsetsFromArgs,
  getConnectionFromSlice
} from './utils';

/**
 * Accepts a mongodb cursor and connection arguments, and returns a connection
 * object for use in GraphQL. It uses array offsets as pagination, so pagiantion
 * will work only if the data set is satic.
 */
export default async function connectionFromMongoCursor(inMongoCursor, args = {}, mapper) {
  const mongodbCursor = inMongoCursor.clone();
  const count = await mongodbCursor.count();

  const offsets = getOffsetsFromArgs(args, count);

  const {
    skip,
    limit
  } = offsets;

  // If supplied slice is too large, trim it down before mapping over it.
  mongodbCursor.skip(skip);
  mongodbCursor.limit(limit);

  // Short circuit if limit is 0; in that case, mongodb doesn't limit at all
  let slice = limit === 0 ? [] : await mongodbCursor.toArray();

  return getConnectionFromSlice(slice, mapper, args, count);
}

