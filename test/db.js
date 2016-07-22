import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';

const MONGO_URL = process.env.MONGO_CONNECTION_STRING || 'mongodb://localhost/rmc-test';

export const connect = async () => {
  return MongoClient.connect(MONGO_URL);
};

export const connectMongoose = async () => {
  mongoose.Promise = global.Promise;
  mongoose.connect(MONGO_URL);
  return mongoose.connection;
};
