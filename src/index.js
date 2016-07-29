var connectionFromMongoCursor = require('./connectionFromMongoCursor');
var connectionFromMongooseAggregate = require('./connectionFromMongooseAggregate');
var connectionFromMongooseQuery = require('./connectionFromMongooseQuery');

var _extends = function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      target[key] = source[key];
    }
  }

  return target;
};

exports.connectionFromMongoCursor = connectionFromMongoCursor;
exports.connectionFromMongooseAggregate = connectionFromMongooseAggregate;
exports.connectionFromMongooseQuery = connectionFromMongooseQuery;
exports['default'] =  connectionFromMongoCursor;

module.exports = _extends(exports['default'], exports);
