const { spawn } = require('child_process');
const { Client } = require('pg');
const configuration = require('../dist/src/config/configuration');
const config = configuration.default();

const resetDB = () => {
  const dbConfig = config.database;

  console.log('Reseting database schema...');

  return new Promise(async (resolve, reject) => {
    const client = new Client({
      user: dbConfig.username,
      host: dbConfig.host,
      password: dbConfig.password,
      port: dbConfig.port,
    });

    await client.connect();

    await client.query(`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO "${dbConfig.username}";
      GRANT ALL ON SCHEMA public TO public;
    `).catch((err) => {
      console.error(err);
      reject(err);
    }).then(() => {
      console.log('Database reset successfully.');
      resolve()
    });

    client.end();
  });
};

const runCmd = (binary, args) => {
  return new Promise((resolve, reject) => {
    const cmd = spawn(binary, args, {shell: true});

    cmd.on('data', (data) => {
      console.log(`${data}`);
    });

    cmd.stderr.on('data', (data) => {
      console.error(`${data}`);
    });

    cmd.stdout.on('data', (data) => {
      console.log(`${data}`);
    });

    cmd.on('error', (err) => {
      console.error(err);
      reject(err);
    });

    cmd.on('close', () => {
      resolve();
    });

  });
};

const migrate = async () => {
  console.log('Running migrations...');
  await runCmd('yarn', ['migration:run:nobuild']);
  console.log('Migrations run successfully.');
};

const seed = async () => {
  console.log('Running seeds...');
  await runCmd('yarn', ['seed']);
  console.log('Seeds added successfully.');
};

(async function() {
  // Only allow for local and test environments
  if (!['local', 'test'].includes(config.environment)) {
    console.warn('Not in allowed environment.');
    process.exit(1);
  };

  await resetDB();
  await migrate();
  await seed();

})();
