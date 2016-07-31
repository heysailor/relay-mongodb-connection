var PREFIX = 'mongodbconnection:';

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
  var offset;
  if (cursor === undefined) {
    return defaultOffset;
  }
  offset = cursorToOffset(cursor);
  return isNaN(offset) ? defaultOffset : offset;
}

/**
 * Creates the cursor string from an offset.
 */
function offsetToCursor(offset) {
  return base64(PREFIX + offset);
}

function getOffsetsFromArgs(inArgs, count) {
  var skip;
  var limit;

  var args = inArgs || {};
  var after = args.after;
  var before = args.before;
  var first = args.first;
  var last = args.last;

  var beforeOffset = getOffsetWithDefault(before, count);
  var afterOffset = getOffsetWithDefault(after, -1);

  var startOffset = Math.max(-1, afterOffset) + 1;
  var endOffset = Math.min(count, beforeOffset);

  if (first !== undefined) {
    endOffset = Math.min(endOffset, startOffset + first);
  }
  if (last !== undefined) {
    startOffset = Math.max(startOffset, endOffset - last);
  }

  skip = Math.max(startOffset, 0);
  limit = endOffset - startOffset;

  return {
    beforeOffset: beforeOffset,
    afterOffset: afterOffset,
    startOffset: startOffset,
    endOffset: endOffset,
    skip: skip,
    limit: limit
  };
}

function getConnectionFromSlice(inSlice, mapper, args, count) {
  var first = args.first;
  var last = args.last;
  var before = args.before;
  var after = args.after;

  var offsetsFromArgs = getOffsetsFromArgs(args, count);
  var startOffset = offsetsFromArgs.startOffset;
  var endOffset = offsetsFromArgs.endOffset;
  var beforeOffset = offsetsFromArgs.beforeOffset;
  var afterOffset = offsetsFromArgs.afterOffset;

  // If we have a mapper function, map it!
  var slice = typeof mapper === 'function' ? inSlice.map(mapper) : inSlice;

  var edges = slice.map(function mapSliceToEdges(value, index) {
    return {
      cursor: offsetToCursor(startOffset + index),
      node: value
    };
  });

  var firstEdge = edges[0];
  var lastEdge = edges[edges.length - 1];
  var lowerBound = after ? afterOffset + 1 : 0;
  var upperBound = before ? Math.min(beforeOffset, count) : count;

  return {
    edges: edges,
    pageInfo: {
      startCursor: firstEdge ? firstEdge.cursor : null,
      endCursor: lastEdge ? lastEdge.cursor : null,
      hasPreviousPage: last !== null ? startOffset > lowerBound : false,
      hasNextPage: first !== null ? endOffset < upperBound : false
    }
  };
}

module.exports = exports = {
  base64: base64,
  unbase64: unbase64,
  cursorToOffset: cursorToOffset,
  offsetToCursor: offsetToCursor,
  getOffsetWithDefault: getOffsetWithDefault,
  getOffsetsFromArgs: getOffsetsFromArgs,
  getConnectionFromSlice: getConnectionFromSlice
};
