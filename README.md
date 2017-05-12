# relay-mongodb-connection [![Build Status](https://travis-ci.org/mikberg/relay-mongodb-connection.svg?branch=master)](https://travis-ci.org/mikberg/relay-mongodb-connection) [![Coverage Status](https://coveralls.io/repos/mikberg/relay-mongodb-connection/badge.svg?branch=master&service=github)](https://coveralls.io/github/mikberg/relay-mongodb-connection?branch=master)

> Like `connectionFromArray()` but for MongoDB cursors

## Install

```sh
npm install --save relay-mongodb-connection
```

## Usage

Give it a cursor from [mongodb](https://www.npmjs.com/package/mongodb), and it handles pagination in the same way [graphql-relay](https://github.com/graphql/graphql-relay-js/blob/master/src/connection/arrayconnection.js) does for arrays.

```js
import connectionFromMongoCursor from 'relay-mongodb-connection';
```

Also supports [mongoose](http://mongoosejs.com/index.html)'s querys and aggregations.

```js
import { connectionFromMongooseQuery } from 'relay-mongodb-connection';
import { connectionFromMongooseAggregate } from 'relay-mongodb-connection';
```

### At a glance

Pass it a MongoDB cursor and `connectionArgs`, and it's happy.

```js
resolve(obj, { ...args }) {
  return connectionFromMongoCursor(
    db.collection('users').find({}),
    args
  );
}
```

Optionally give it a mapper function:

```js
resolve(obj, { ...args }) {
  return connectionFromMongoCursor(
    db.collection('users').find({}),
    args,
    (user) => Object.assign(user, { id: user._id })
  );
}
```

And for Mongoose users:

```js
resolve(obj, { ...args }) {
  return connectionFromMongooseQuery(
    User.find({}),  // User.aggregate() also works
    args,
    (user) => Object.assign(user, { id: user._id })
  );
}
```
### Example

```js
// ...
import connectionFromMongoCursor from 'relay-mongodb-connection';
// ...

// Instead of resolving, synchronously returns a MongoDB Cursor.
function getSpaceshipsForUser(userId) {
  return db.collection('spaceships').find({
    user: new ObjectId(userId)
  });
}

export const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    spaceships: {
      type: SpaceshipConnection,
      args: {
        ...connectionArgs,
      },
      resolve(user, { ...args }) {
        const spaceshipCursor = getSpaceshipsForUser(user._id);
        return connectionFromMongoCursor(spaceshipCursor, args);
      }
    }
  }
});
```

`connectionFromMongoCursor` automatically skips and limits the MongoDB Cursor so that only the necessary documents are retrieved from the database.

## Changelog

See [CHANGELOG.md](CHANGELOG.md)

## Testing

```sh
MONGO_URL=mongodb://192.168.99.100/mongodbconnection npm test
```

## License

MIT © [Mikael Berg](https://github.com/mikberg)
