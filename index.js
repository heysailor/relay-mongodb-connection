const PREFIX = 'mongodbconnection:';

export const base64 = (str) => (new Buffer(str, 'ascii')).toString('base64');
export const unbase64 = (b64) => (new Buffer(b64, 'base64')).toString('ascii');

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
export async function connectionFromMongo(mongodbCursor, args) {
  const startOffset = 0;

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
      hasNextPage: await mongodbCursor.hasNext(),
      hasPreviousPage: false, // Not yet implemented
    },
  };
}

/**
 * Rederives the offset from the cursor string
 */
export function cursorToOffset(cursor) {
  return parseInt(unbase64(cursor).substring(PREFIX.length), 10);
}

/**
 * Return the cursor associated with an object in an array
 */
export function cursorForObjectInConnection(data, object) {
  // NYI
}

/**
 * Given an optional cursor and a default offset, returns the offset to use;
 * if the cursor contains a valid offset, that will be used, otherwise it will
 * be the default.
 */
export function getOffsetWithDefault(cursor, defaultOffset) {
  // NYI
}
