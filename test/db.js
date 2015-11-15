import { MongoClient } from 'mongodb';

export const connect = async () => {
  return MongoClient.connect('mongodb://localhost/lp');
};
