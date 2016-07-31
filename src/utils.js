const PREFIX = 'mongodbconnection:';

function base64(str) {
  return new Buffer(str, 'ascii').toString('base64');
}

function unbase64(b64) {
  return new Buffer(b64, 'base64').toString('ascii');
}

/**
 * Rederives the offset from the cursor string
 */
function cursorToOffset(cursor) {
  return parseInt(unbase64(cursor).substring(PREFIX.length), 10);
}

/**
 * Given an optional cursor and a default offset, returns the offset to use;
 * if the cursor contains a valid offset, that will be used, otherwise it will
 * be the default.
 */
function getOffsetWithDefault(cursor, defaultOffset) {
  if (cursor === undefined) {
    return defaultOffset;
  }
  const offset = cursorToOffset(cursor);
  return isNaN(offset) ? defaultOffset : offset;
}

/**
 * Creates the cursor string from an offset.
 */
function offsetToCursor(offset) {
  return base64(PREFIX + offset);
}

function getOffsetsFromArgs(inArgs, count) {
  const args = inArgs ? inArgs : {};
  const after = args.after;
  const before = args.before;
  const first = args.first;
  const last = args.last;

  const beforeOffset = getOffsetWithDefault(before, count);
  const afterOffset = getOffsetWithDefault(after, -1);

  let startOffset = Math.max(-1, afterOffset) + 1;
  let endOffset = Math.min(count, beforeOffset);

  if (first !== undefined) {
    endOffset = Math.min(endOffset, startOffset + first);
  }
  if (last !== undefined) {
    startOffset = Math.max(startOffset, endOffset - last);
  }

  const skip = Math.max(startOffset, 0);
  const limit = endOffset - startOffset;

  return {
    beforeOffset: beforeOffset,
    afterOffset: afterOffset,
    startOffset: startOffset,
    endOffset: endOffset,
    skip: skip,
    limit: limit,
  };
}

function getConnectionFromSlice(inSlice, mapper, args, count) {
  const first = args.first;
  const last = args.last;
  const before = args.before;
  const after = args.after;

  const offsetsFromArgs = getOffsetsFromArgs(args, count);
  const startOffset = offsetsFromArgs.startOffset;
  const endOffset = offsetsFromArgs.endOffset;
  const beforeOffset = offsetsFromArgs.beforeOffset;
  const afterOffset = offsetsFromArgs.afterOffset;

  // If we have a mapper function, map it!
  const slice = typeof mapper === 'function' ? inSlice.map(mapper) : inSlice;

  const edges = slice.map(function mapSliceToEdges(value, index) {
    return {
      cursor: offsetToCursor(startOffset + index),
      node: value,
    };
  });

  const firstEdge = edges[0];
  const lastEdge = edges[edges.length - 1];
  const lowerBound = after ? afterOffset + 1 : 0;
  const upperBound = before ? Math.min(beforeOffset, count) : count;

  return {
    edges: edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage: last !== null ? startOffset > lowerBound : false,
      hasNextPage: first !== null ? endOffset < upperBound : false,
    },
  };
}

module.exports = exports = {
  base64: base64,
  unbase64: unbase64,
  cursorToOffset: cursorToOffset,
  offsetToCursor: offsetToCursor,
  getOffsetWithDefault: getOffsetWithDefault,
  getOffsetsFromArgs: getOffsetsFromArgs,
  getConnectionFromSlice: getConnectionFromSlice,
};
