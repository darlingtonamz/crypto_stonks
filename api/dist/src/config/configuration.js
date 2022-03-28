"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const naming_1 = require("../db/naming");
exports.default = () => {
    const config = {
        environment: process.env.ENVIRONMENT || 'dev',
        port: parseInt(process.env.PORT || '', 10) || 3000,
        database: {
            type: 'postgres',
            host: process.env.DB_HOST || '',
            port: parseInt(process.env.DB_PORT || '', 10) || 5432,
            username: process.env.DB_USER || 'platform-api',
            password: process.env.DB_PASSWORD || 'database_password',
            database: process.env.DB_DATABASE || 'platform-api',
            cli: { migrationsDir: `./migrations` },
            entities: [`${__dirname}/../**/*.entity{.ts,.js}`],
            subscribers: [`${__dirname}/../**/*.subscriber{.ts,.js}`],
            migrations: [`${__dirname}/../../migrations/**/*.js`],
            migrationsRun: true,
            namingStrategy: new naming_1.SnakeNamingStrategy(),
            seeds: [`src/db/seeds/**/*.seed.ts`],
        },
    };
    if (process.env.TESTING) {
        config.port = 0;
        config.database.database = config.database.database.endsWith('_test') ? config.database.database : `${config.database.database}_test`;
    }
    return config;
};
//# sourceMappingURL=configuration.js.map