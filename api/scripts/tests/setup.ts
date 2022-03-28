module.exports = async () => {
  const { spawn } = require('child_process');
  const { Client } = require('pg');
  const configuration = require('../../dist/src/config/configuration');
  const cloneExistingDBForTesting = process.env.FAST_TEST_MODE; // toggle for facter test setup (new migrations will be skipped)

  try {
    const config = configuration.default().database;
    const client = new Client({
      user: config.username,
      host: config.host,
      password: config.password,
      port: config.port,
    });
    await client.connect();

    const dbname = `"${config.database.endsWith('_test') ? config.database : `${config.database}_test`}"`;

    if (!cloneExistingDBForTesting) {
      await client.query(`DROP DATABASE IF EXISTS ${dbname};`);
      await client.query(`CREATE DATABASE ${dbname};`);
      console.log(`${dbname} has been created!`);

      const migrate = spawn('yarn', ['migration:run']);
      migrate.on('error', (err: any) => {
        throw err;
      });

      await new Promise((resolve) => {
        migrate.on('close', resolve);
      });
    } else {
      // To improve the speed of the e2e tests we will be cloning the live DB and skipping migrations
      const nonTestDbName = config.database.split('_test')[0];
      await client.query(`DROP DATABASE IF EXISTS ${dbname};`);
      // prevent use of the original db from blocking creating of new DB
      await client.query(`SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '${ config.database }' AND pid <> pg_backend_pid();`);
      const query = `CREATE DATABASE ${ dbname } WITH TEMPLATE "${ nonTestDbName }" OWNER "${ config.username }";`;
      await client.query(query);
      console.log(`${dbname} has been cloned!`);
    }

    await client.end();
  } catch (e) {
    console.log(e);
    process.exit();
  }
};
