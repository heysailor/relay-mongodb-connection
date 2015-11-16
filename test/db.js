import { MongoClient } from 'mongodb';

export const connect = async () => {
  return MongoClient.connect(process.env.MONGO_CONNECTION_STRING);
};
