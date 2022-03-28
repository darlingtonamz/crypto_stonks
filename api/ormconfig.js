const configuration = require('./dist/src/config/configuration');

const { database } = configuration.default();

if (process.env.TESTING) {
  database.database = database.database.endsWith('_test') ? database.database : `${database.database}_test`;
}

module.exports = database;