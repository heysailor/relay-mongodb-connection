const PREFIX = 'mongodbconnection:';

export const base64 = (str) => (new Buffer(str, 'ascii')).toString('base64');
export const unbase64 = (b64) => (new Buffer(b64, 'base64')).toString('ascii');

/**
 * Rederives the offset from the cursor string
 */
export function cursorToOffset(cursor) {
  return parseInt(unbase64(cursor).substring(PREFIX.length), 10);
}

/**
 * Given an optional cursor and a default offset, returns the offset to use;
 * if the cursor contains a valid offset, that will be used, otherwise it will
 * be the default.
 */
export function getOffsetWithDefault(cursor, defaultOffset) {
  if (cursor === undefined) {
    return defaultOffset;
  }
  const offset = cursorToOffset(cursor);
  return isNaN(offset) ? defaultOffset : offset;
}

/**
 * Creates the cursor string from an offset.
 */
export function offsetToCursor(offset) {
  return base64(PREFIX + offset);
}

/**
 * Accepts a mongodb cursor and connection arguments, and returns a connection
 * object for use in GraphQL. It uses array offsets as pagination, so pagiantion
 * will work only if the data set is satic.
 */
export async function connectionFromMongo(inMongoCursor, args = {}) {
  const mongodbCursor = inMongoCursor.clone();
  const { after, before, first, last } = args;
  const sliceStart = 0;
  const arrayLength = await mongodbCursor.count();
  const sliceEnd = sliceStart + arrayLength;
  const beforeOffset = getOffsetWithDefault(before, arrayLength);
  const afterOffset = getOffsetWithDefault(after, -1);

  let startOffset = Math.max(
    sliceStart - 1,
    afterOffset,
    -1
  ) + 1;
  let endOffset = Math.min(
    sliceEnd,
    beforeOffset,
    arrayLength
  );
  if (first !== undefined) {
    endOffset = Math.min(
      endOffset,
      startOffset + first
    );
  }
  if (last !== undefined) {
    startOffset = Math.max(
      startOffset,
      endOffset - last
    );
  }

  const skip = Math.max(startOffset - sliceStart, 0);
  const limit = arrayLength - (sliceEnd - endOffset);

  // If supplied slice is too large, trim it down before mapping over it.
  mongodbCursor.skip(skip);
  mongodbCursor.limit(limit);

  const slice = await mongodbCursor.toArray();

  const edges = slice.map((value, index) => ({
    cursor: offsetToCursor(startOffset + index),
    node: value,
  }));

  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];

  return {
    edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasNextPage: skip + limit < arrayLength,
      hasPreviousPage: skip > 0,
    },
  };
}

// /**
//  * Return the cursor associated with an object in an array
//  */
// export function cursorForObjectInConnection(data, object) {
//   // NYI
// }
