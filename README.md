# relay-mongodb-connection [![Build Status](https://travis-ci.org/mikberg/relay-mongodb-connection.svg?branch=master)](https://travis-ci.org/mikberg/relay-mongodb-connection) [![Coverage Status](https://coveralls.io/repos/mikberg/relay-mongodb-connection/badge.svg?branch=master&service=github)](https://coveralls.io/github/mikberg/relay-mongodb-connection?branch=master)

> Like `connectionFromArray()` but for MongoDB cursors

## Install

```sh
npm install --save relay-mongodb-connection
```

## Usage

Give it a cursor from [mongodb](https://www.npmjs.com/package/mongodb), and it handles pagination int he same way [graphql-relay](https://github.com/graphql/graphql-relay-js/blob/master/src/connection/arrayconnection.js) does for arrays.

### At a glance

Pass it a MongoDB cursor and `connectionArgs`, and it's happy.

```js
async resolve(obj, { ...args }) {
  return await connectionFromMongoCursor(
    db.collection('users').find({}),
    args
  );
}
```

Optionally give it a mapper function:

```js
async resolve(obj, { ...args }) {
  return await connectionFromMongoCursor(
    db.collection('users').find({}),
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
      async resolve(user, { ...args }) {
        const spaceshipCursor = getSpaceshipsForUser(user._id);
        return await connectionFromMongoCursor(spaceshipCursor, args);
      }
    }
  }
});
```

`connectionFromMongoCursor` automatically skips and limits the MongoDB Cursor so that only the necessary documents are retrieved from the database.

## Changelog

See [CHANGELOG.md](CHANGELOG.md)

## License

MIT © [Mikael Berg](https://github.com/mikberg)
