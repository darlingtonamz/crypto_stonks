module.exports = async () => {
  const { Client } = require('pg');
  const configuration = require('../../dist/src/config/configuration');

  try {
    const config = configuration.default().database;
    const client = new Client({
      user: config.username,
      host: config.host,
      password: config.password,
      port: config.port,
      database: 'postgres',
    });
    await client.connect();

    const dbname = `"${config.database.endsWith('_test') ? config.database : `${config.database}_test`}"`;

    // Not sure this works every time and in all cases
    await client.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '${dbname}';
    `);

    try {
      await client.query(`DROP DATABASE IF EXISTS ${dbname};`);
    } catch(err) {
      console.error(err);
    }

    await client.end();
  } catch (e) {
    console.log(e);
    process.exit();
  }
};
