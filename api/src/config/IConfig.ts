import { NamingStrategyInterface } from "typeorm/naming-strategy/NamingStrategyInterface";
// eslint-disable-next-line import/no-cycle

interface IDatabaseConfig {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  cli: {
    migrationsDir: string;
  };
  entities: string[];
  subscribers: string[];
  migrations: string[];
  migrationsRun: boolean;
  logging?: boolean | string[];
  namingStrategy: NamingStrategyInterface;
  seeds: string[];
  factories?: string[];
}


export interface IConfig {
  environment?: string;
  port: number;
  database: IDatabaseConfig;
}
