var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
module.exports = () => __awaiter(this, void 0, void 0, function* () {
    const { spawn } = require('child_process');
    const { Client } = require('pg');
    const configuration = require('../../dist/src/config/configuration');
    const cloneExistingDBForTesting = process.env.FAST_TEST_MODE;
    try {
        const config = configuration.default().database;
        const client = new Client({
            user: config.username,
            host: config.host,
            password: config.password,
            port: config.port,
        });
        yield client.connect();
        const dbname = `"${config.database.endsWith('_test') ? config.database : `${config.database}_test`}"`;
        if (!cloneExistingDBForTesting) {
            yield client.query(`DROP DATABASE IF EXISTS ${dbname};`);
            yield client.query(`CREATE DATABASE ${dbname};`);
            console.log(`${dbname} has been created!`);
            const migrate = spawn('yarn', ['test:migration:run']);
            migrate.on('error', (err) => {
                throw err;
            });
            yield new Promise((resolve) => {
                migrate.on('close', resolve);
            });
        }
        else {
            const nonTestDbName = config.database.split('_test')[0];
            yield client.query(`DROP DATABASE IF EXISTS ${dbname};`);
            yield client.query(`SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '${config.database}' AND pid <> pg_backend_pid();`);
            const query = `CREATE DATABASE ${dbname} WITH TEMPLATE "${nonTestDbName}" OWNER "${config.username}";`;
            yield client.query(query);
            console.log(`${dbname} has been cloned!`);
        }
        yield client.end();
    }
    catch (e) {
        console.log(e);
        process.exit();
    }
});
//# sourceMappingURL=setup.js.map