import { IConfig } from './IConfig';
import { SnakeNamingStrategy } from '../db/naming';

export default (): IConfig => {
  const config: IConfig = {
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
      namingStrategy: new SnakeNamingStrategy(),
      seeds: [`src/db/seeds/**/*.seed.ts`],
    },
    allowedAssetSymbols: (process.env.ALLOWED_ASSET_SYMBOLS || 'btc')
      .split(',')
      .map((str) => str.trim()),
    priceRefreshDelayInSecond: parseInt(process.env.PRICE_REFRESH_DELAY_IN_SECOND || '10', 10),
  };

  if (process.env.TESTING) {
    config.port = 0;
    config.database.database = config.database.database.endsWith('_test') ? config.database.database : `${config.database.database}_test`;
  }
  return config;
};
