import { MongoClient } from 'mongodb';

export const connect = async () => {
  if (!process.env.MONGO_CONNECTION_STRING) {
    throw new Error(`Environment variable MONGO_CONNECTION_STRING must be set`);
  }

  return MongoClient.connect(process.env.MONGO_CONNECTION_STRING);
};
