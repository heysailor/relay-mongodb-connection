var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');

var MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost/mongoconnection';

module.exports.connect = exports.connect = function connect () {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(MONGO_URL, function(err, db) {
      if (err) {
        return reject(err);
      }
      resolve(db);
    });
  });
};

module.exports.connectMongoose = exports.connectMongoose = function connectMongoose () {
  mongoose.Promise = global.Promise;
  mongoose.connect(MONGO_URL)
  return mongoose.connection;
};
