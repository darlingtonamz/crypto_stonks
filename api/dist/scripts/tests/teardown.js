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
        yield client.connect();
        const dbname = `"${config.database.endsWith('_test') ? config.database : `${config.database}_test`}"`;
        yield client.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '${dbname}';
    `);
        try {
            yield client.query(`DROP DATABASE IF EXISTS ${dbname};`);
        }
        catch (err) {
            console.error(err);
        }
        yield client.end();
    }
    catch (e) {
        console.log(e);
        process.exit();
    }
});
//# sourceMappingURL=teardown.js.map